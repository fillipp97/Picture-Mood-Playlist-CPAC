from pathlib import Path
from random import randint, random, shuffle, choice
import sys

sys.path.append(str(Path(__file__).parent.parent))
import spotipy
from flask import Flask, session, request, redirect
import os
from dotenv import load_dotenv

from utils.object_detection import (
    get_object,
    detect_img,
    download_and_resize_image,
    hub,
    detector,
    run_detector,
)
from utils.utilities import get_par_from_mood, get_par_from_LLF
from utils.Azure_api import get_mood, emotion_detect
from utils.token_handlers import get_token, create_spotify_oauth, remove_token
from utils.Musixmatch import get_lyrics
from utils.Spotify import (
    valid_genres_for_seed,
    get_most_listened_artists,
    get_recommendations,
    get_recommendation_by_text,
    create_new_playlist,
)

# from Components.Spotify import Spoty
env_path = Path(__file__).parent.parent / ".env"
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
    return {"result": "ok", "songs": currGroup}


@app.route("/getCovers")
def get_covers():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        session.clear()
        print("Not Logged in")
        return redirect("http://localhost:3000")
        # return {"result": "bad"}
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    currGroup = sp.current_user_saved_tracks(limit=50, offset=0)["items"]
    link = currGroup[0]["track"]["album"]["images"][0]["url"]
    return {"result": "ok", "links": link}


@app.route("/uploadFile", methods=["GET", "POST"])
def Step1():
    # Download Image
    image = request.files["Image"].read()
    image_path = download_and_resize_image(image, 640, 480)
    detect_img(image_path)
    # Try to detect face
    try:
        emotion_detect(image_path)
        mood = get_mood()
    except:
        print("No Face Found")
        mood = None
    # Recognize Objects
    objects, number = get_object()
    if number == 0:
        print("No objects identified")
        objects = None
    else:
        objects = list(set(objects))
    print("\nThe emotion_result is: ", mood)
    print("\nThe object_result is: ", objects)
    # Get possible seeds for the user to chose
    # Get some top artists and some random secondary ones
    artists = get_most_listened_artists(limit=10, offset=0, time_range="medium_term")
    artists_secondary = get_most_listened_artists(
        limit=10, offset=randint(1, 2), time_range="medium_term"
    )
    [
        artists.append(secondary)
        for secondary in artists_secondary
        if secondary not in artists
    ]
    shuffle(artists)
    mixed_artists = artists[:10]
    # get some random genres mized with genres in tune with the previous selected artists
    genres = valid_genres_for_seed()  # They are 126
    artists_genres = []
    for artist in artists:
        for genre in artist["genres"]:
            for word in genre.split(" "):
                artists_genres.append(word)

    for gen in artists_genres:
        if gen not in genres:
            artists_genres.remove(gen)

    artists_genres = list(set(artists_genres))
    while len(artists_genres) < 10:
        new_gen = choice(genres)
        if new_gen not in artists_genres:
            artists_genres.append(new_gen)

    mixed_genres = artists_genres[:10]
    return {
        "mood": mood,
        # "moodLLF": moodLLF,
        "objects": objects,
        "genres": mixed_genres,
        "artists": mixed_artists,
    }


@app.route("/getSongs", methods=["GET", "POST"])
def Step2():
    mood = request.args["mood"]
    objects = request.args["objects"]
    genres_seed = request.args["genres"]
    artists_seed = request.args["artists"]

    if mood is not None:
        # Proceed with the branch with face
        parameters = get_par_from_mood(mood=mood)
        recommendations = get_recommendations(
            seed_artists=artists_seed,
            seed_genres=genres_seed,
            limit=20,
            kwargs=parameters,
        )
        # optional text filtering
        return recommendations
    else:
        texts = get_lyrics()
        recommendations_by_text = get_recommendation_by_text(objects)
        parameters_LLF = get_par_from_LLF()  # moodLLF)
        recommendations_by_LLF = get_recommendations()  # parameters_LLF
        # mix =
        # return recommendations


# IF I ALSO RETURN THE TEXT THERE'S THE POSSIBILITY TO LET USER PLAY WITH LYRICS IN ORDER TO COMPOSE THE TITLE AND THE DESCRIPTION OF THE PLAYLIST


@app.route("/savePlaylist", methods=["GET", "POST"])
def Step3():
    songs = request.args["songs"]
    playlist_title = request.args["playlist_title"]

    create_new_playlist(songs, playlist_title)


# obj = list(dict.fromkeys(objects))
# unique_songs = Translations.Get_Songs_from_mood(mood, obj)
# # print('\n Pool of songs:\n')
# # i=0
# # for song in unique_songs:
# #     i+=1
# # print(i,'-',song[0],song[1],song[3])
# choice = Translations.make_a_choice(unique_songs)
# # print('\n\n\n','The final choice is:\n', choice[0],choice[1],choice[3])
# return jsonify({"choices": choice})


if __name__ == "__main__":
    app.run(debug=True)
