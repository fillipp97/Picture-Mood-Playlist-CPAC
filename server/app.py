from pathlib import Path
from random import randint, random, shuffle, choice, uniform
import sys

sys.path.append(str(Path(__file__).parent))
import spotipy
import numpy as np
from flask import Flask, session, request, redirect
import os
from dotenv import load_dotenv

# from .object_detection import (
#     get_object,
#     detect_img,
#     download_and_resize_image,
#     hub,
#     detector,
#     run_detector,
# )
from .utilities import (
    get_par_from_mood,
    get_mood_from_LLF,
    image_is_plain,
    dominant_color,
)
from .Azure_api import get_mood, emotion_detect
from .token_handlers import get_token, create_spotify_oauth, remove_token
from .Musixmatch import get_lyrics, get_scored_list
from .Spotify import (
    get_recommendation_by_objects,
    valid_genres_for_seed,
    get_most_listened_artists,
    get_recommendations,
    get_recommendation_by_objects,
    get_most_listened_tracks,
    create_new_playlist,
)


# from Components.Spotify import Spoty
env_path = Path(__file__).parent / ".env"
load_dotenv(str(env_path))
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

# App config
app = Flask(__name__)

app.secret_key = "4njigv9nipvls"
app.config["SESSION_COOKIE_NAME"] = "spotify-login-session"


@app.route("/checkLogState")
def checkLogState():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        return {"result": "bad"}
    else:
        return {"result": "ok"}


@app.route("/login")
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return auth_url


@app.route("/authorize")
def authorize():
    sp_oauth = create_spotify_oauth()
    session.clear()
    code = request.args.get("code")
    token_info = sp_oauth.get_access_token(code)
    session["token_info"] = token_info
    return redirect("http://localhost:3000")


@app.route("/logout")
def logout():
    remove_token()
    return redirect("http://localhost:3000")


@app.route("/getTracks")
def get_tracks():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        session.clear()
        print("Not Logged in")
        return redirect("http://localhost:3000")
        # return {"result": "bad"}
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    currGroup = sp.current_user_saved_tracks(limit=50, offset=0)["items"]
    print(currGroup[0]["track"]["album"]["images"])
    return {"result": "ok", "songs": currGroup}


# @app.route("/getCovers")
# def get_covers():
#     session["token_info"], authorized = get_token()
#     session.modified = True
#     if not authorized:
#         session.clear()
#         print("Not Logged in")
#         return redirect("http://localhost:3000")
#         # return {"result": "bad"}
#     sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
#     currGroup = sp.current_user_saved_tracks(limit=50, offset=0)["items"]
#     print(currGroup[0]["track"]["album"]["images"])
#     link = currGroup[0]["track"]["album"]["images"][0]["url"]
#     return {"result": "ok", "links": link}


@app.route("/uploadFile", methods=["POST"])
def Step1():
    # Download Image
    image = request.files["Image"].read()
    # image_path = download_and_resize_image(image, 640, 480)

    # detect_img(image_path)
    # # Try to detect face
    # try:
    #     emotion_detect(image_path)
    #     mood = get_mood()
    # except:
    #     print("No Face Found")
    #     mood = None
    # # Recognize Objects
    # objects, number = get_object()
    # if number == 0:
    #     print("No objects identified")
    #     objects = None
    # else:
    #     objects = list(set(objects))
    #     objects = remove_human(objects)
    # print("\nThe emotion_result is: ", mood)
    # print("\nThe object_result is: ", objects)
    mood = "happy"
    objects = ["Chair", "Hair", "Airplane", "Duck"]
    # Get possible seeds for the user to chose

    # Get most listened tracks mixed with other tracks to insert variation
    most_listened_tracks = get_most_listened_tracks(
        limit=10, offset=0, time_range="long_term"
    )
    tracks_secondary = get_most_listened_tracks(
        limit=10, offset=randint(1, 2), time_range="long_term"
    )
    [
        most_listened_tracks.append(secondary)
        for secondary in tracks_secondary
        if secondary not in most_listened_tracks
    ]
    shuffle(most_listened_tracks)
    most_listened_tracks = most_listened_tracks[:10]
    # Get some top artists
    artists = get_most_listened_artists(limit=10, offset=0, time_range="medium_term")
    artists_secondary = get_most_listened_artists(
        limit=10, offset=randint(1, 2), time_range="long_term"
    )
    [
        artists.append(secondary)
        for secondary in artists_secondary
        if secondary not in artists
    ]
    shuffle(artists)
    mixed_artists = artists[:10]
    # get some random genres mixed with genres in tune with the previous selected artists
    genres = valid_genres_for_seed()  # They are 126
    artists_genres = []
    for artist in artists:
        for genre in artist["genres"]:
            artists_genres.append(genre)

    for gen in artists_genres:
        if gen not in genres:
            artists_genres.remove(gen)

    artists_genres = list(set(artists_genres))
    while len(artists_genres) < 10:
        new_gen = choice(genres)
        if new_gen not in artists_genres:
            artists_genres.append(new_gen)

    mixed_genres = artists_genres[:10]
    if mood is None:
        moodLLF = "sad"  # get_mood_from_LLF(image_path=image_path)
    else:
        moodLLF = None
    return {
        "result": "ok",
        "mood": mood,
        "moodLLF": moodLLF,
        "objects": objects,
        "tracksSeed": most_listened_tracks,
        "genresSeed": mixed_genres,  # Keep for later
        "artistsSeed": mixed_artists,
    }


def remove_human(objects):
    new_obj = []
    for el in objects:
        print(el)
        if "Human" in el:
            obj = el.split(" ")[-1]
            new_obj.append(obj[0].upper() + obj[1:])
        else:
            new_obj.append(el)
    new_obj.append("Human")
    return list(set(new_obj))


@app.route("/getSongs", methods=["POST"])
def Step2():
    data = request.get_json()

    mood = data.get("mood")
    objects = data.get("objects")
    moodLLF = data.get("moodLLF")
    # List[strings] of genres
    genres_seed = data.get("genresSeed")
    # List[strings] of artists' names
    artists_seed = data.get("artistsSeed")
    # List[strings] of tracks ID
    tracks_seed = data.get("tracksSeed")

    tracks_ids = [el.get("id") for el in tracks_seed]

    artists_ids = [el.get("id") for el in artists_seed]
    available_genres = valid_genres_for_seed()
    splits = []
    for g in genres_seed:
        el_split = g.split(" ")
        for el in el_split:
            splits.append(el)
    genres_seed.extend(splits)
    genres_seed = list(set(genres_seed))

    genres_sel = [gen for gen in genres_seed if gen in available_genres]

    # print(genres_sel)
    # print(available_genres)
    # genres = [el.get("id") for el in genres_seed]
    while len(artists_ids) + len(genres_sel) + len(tracks_ids) > 5:
        n = np.random.randint(0, 3)
        lists = [artists_ids, genres_sel, tracks_ids]
        if len(lists[n]) > 1:
            i = np.random.randint(0, len(lists[n]))
            lists[n].remove(lists[n][i])

    if mood is not None:
        # Proceed with the branch with face
        # Get parameters from mood

        parameters = get_par_from_mood(mood=mood)
        # Get recommendations according to parameters

        recommendations = get_recommendations(
            seed_artists=artists_ids,
            seed_genres=genres_sel,
            seed_tracks=tracks_ids,
            limit=20,
            **parameters,
        )
        # optional text filtering

        lyrics = [
            get_lyrics(
                el.get("name"),
                el.get("artists")[0].get("name"),
            )
            for el in recommendations.get("tracks")
            if uniform(0, 1) <= 0.5
        ]
        return {"result": "ok", "recommendations": recommendations, "lyrics": lyrics}
    else:
        # Get 5 recommendations from each object in the image
        recommendations_by_objects = get_recommendation_by_objects(objects)
        # print("Rec by Objects ", recommendations_by_objects)
        # Get also parameters from a mood extracted by colors in the picture
        parameters_LLF = get_par_from_mood(moodLLF)
        # Get recommendations
        recommendations_moodLLF = get_recommendations(
            seed_artists=artists_ids,
            seed_genres=genres_sel,
            seed_tracks=tracks_ids,
            limit=10,
            **parameters_LLF,
        )
        # print("Rec by Mood ", recommendations_moodLLF.get('tracks'))
        # Mix all the results and get the first 20 OR CREATE A SCORING FUNCTION THAT USES THE TEXT TODO
        # print("BY OBJECTS ", recommendations_by_objects)
        # print("BY LLF ", recommendations_moodLLF.get("tracks"))
        recommendations_by_objects.extend(recommendations_moodLLF.get("tracks"))

        # Ensure there are no duplicates
        # mix = ensure_no_duplicates(recommendations_by_objects)
        scored_songs, lyrics = get_scored_list(recommendations_by_objects, objects)

        # IF I ALSO RETURN THE TEXT THERE'S THE POSSIBILITY TO LET USER PLAY WITH LYRICS IN ORDER TO COMPOSE THE TITLE AND THE DESCRIPTION OF THE PLAYLIST
        return {
            "result": "ok",
            "recommendations": scored_songs,
            "lyrics": lyrics,
        }  # recommendations.score and recommendation.lyrics


def ensure_no_duplicates(songs):
    out = []
    for v in songs:
        if v not in out:
            out.append(v)
        return out


@app.route("/savePlaylist", methods=["POST"])
def Step3():
    # List[strings] the song IDs
    songs = request.args["songs"]
    # str , a title for the playlist
    playlist_title = request.args["playlist_title"]

    create_new_playlist(songs, playlist_title)
    return "200"


if __name__ == "__main__":
    app.run(debug=True)
