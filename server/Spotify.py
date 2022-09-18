#%%
# Import libraries
from cgitb import reset
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent))

from flask import session, redirect
import os
import random
from collections import Counter
from spotipy import SpotifyClientCredentials

os.chdir(os.path.abspath(os.path.dirname(__file__)))

import spotipy
from dotenv import load_dotenv
from token_handlers import get_token
from typing import List

# WE NEED A FUNCTION THAT TRANSLATES THE VALUES OF VALENCE-AROUSAL INTO THIS MULTIPLE PARAMETERS, AND TO SOME GENRES, THE FUNCTION TAKES AS INPUT THE OUTPUT OF AI

# min_acousticness,max_acousticness,min_danceability,max_danceability,min_energy,max_energy,min_instrumentalness,max_instrumentalness,min_loudness,max_loudness, min_tempo,max_tempo, min_valence,max_valence, target_mode = 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0

# min_acousticness=0
# max_acousticness=0.5
# min_danceability=0.7
# max_danceability=1
# min_energy=0.5
# max_energy=1
# min_instrumentalness=0
# max_instrumentalness=0.01
# min_loudness=2
# max_loudness=11
# min_tempo  = 120
# max_tempo=130
# min_valence=0.7
# max_valence=1
# target_mode=1


#  Let's start with the token
# 1) go to https://developer.spotify.com/console/get-audio-analysis-track/?id=06AKEBrKUckW0KREUWRnvT
# 2) press "try it"
# 3) login
# 4) agree
# 5) execute this cell and give the script the token (see above)
# if "token" not in locals(): # if you have not inserted the token
#    token=input("Give me the token")
# token="BQApPXZBF0YWi-9YTM12yonnXGfLCPNI1okb9Tv86jyfaCORdoaN4Z5MDe9HanwiHzwW3g-Gz1G857MnjMrTje6Tq19x_R03BSQW8auUxHb1SZ9FYyk35hDdg2bB83JQUrTBAtxq4R0Q_5IdmlyVffPvp8pRY5vuD2lEUeupF0Ywv5hsdqpfjO9gQWv_kXL_HNn07i4_ZZOKQdsjEW5vZA_f70SHjFY"

# header={"Authorization": f"Bearer {token}"}
#  Search api: first info


env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(str(env_path))
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")


def req_handler() -> spotipy.Spotify:
    """Checks token validity and returns a Spotipy object that can handle API calls

    Returns:
        spotipy.Spotify: The spotipy object
    """
    session["token_info"], authorized = get_token()
    session.modified = True

    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    if not authorized:
        session.clear()
        print("Not Logged in")
        return redirect("http://localhost:3000")
    return sp


def get_liked_songs(limit: int = 50, offset: int = 0, verbose: bool = False) -> dict:
    """Get user's last 50 saved songs, rerun with different offset to get more songs"""
    sp = req_handler()
    liked_songs = sp.current_user_saved_tracks(limit=limit, offset=offset)
    liked_songs = liked_songs["items"]
    print("\n\n\n\nLiked songs:\n", liked_songs)

    if verbose:
        for i in range(len(liked_songs)):
            first_result = liked_songs[i]["track"]
            # print("\n\nResult {}".format(i))
            print("Author: %s" % first_result["artists"][0]["name"])
            print("Name: %s" % first_result["name"])
            print("Preview url: %s" % first_result["preview_url"])
            print("Id on spotify: %s" % first_result["id"])
    return liked_songs


def valid_genres_for_seed():
    """Calls Spotify in order to know which are the valid genres in order to compose a seed for recommendations"""
    sp = req_handler()
    available_genres = sp.recommendation_genre_seeds()
    return available_genres["genres"]


def get_most_listened_artists(
    limit: int = 10, offset: int = 0, time_range: str = "medium_term"
) -> list:
    """Gets the most listened artists for the current user

    Args:
        limit (int, optional): The number of artists to return. Defaults to 10. Max to 50.
        offset (int, optional): The starting point in the complete list of artists. Defaults to 0.
        time_range(str, optional): The time frame in which affinities are computed
    Returns:
        list: A list of the {limit} most listened artists
    """
    sp = req_handler()
    top_artists = sp.current_user_top_artists(
        limit=limit, offset=offset, time_range=time_range
    )
    return top_artists["items"]


def get_most_listened_tracks(
    limit: int = 10, offset: int = 0, time_range: str = "long_term"
) -> list:
    """Gets the most listened tracks for the current user

    Args:
        limit (int, optional): The number of artists to return. Defaults to 10. Max to 50.
        offset (int, optional): The starting point in the complete list of artists. Defaults to 0.
        time_range(str, optional): The time frame in which affinities are computed
    Returns:
        list: A list of the {limit} most listened artists
    """
    sp = req_handler()
    top_tracks = sp.current_user_top_tracks(
        limit=limit, offset=offset, time_range=time_range
    )
    return top_tracks["items"]


# def get_possible_genres_seeds():
#     #find the genres seeds that spotify allows
#     params={}
#     search_url="https://api.spotify.com/v1/recommendations/available-genre-seeds"
#     req=requests.get(url=search_url, params=params,headers=header)
#     assert req.status_code==200, req.content
#     answer=req.json()
#     available_genres=answer["genres"]
#     #print(available_genres)
#     return available_genres


def select_genres(available):
    # happy,sad,angry, fearful_disgusted, neutral, random = ([] for i in range(6))
    return random.sample(available, 5)


def select_songs(liked_songs):
    return random.sample(liked_songs, 5)


def select_artists(available):
    c = Counter(available)
    selected = c.most_common(5)
    # print(selected)
    return selected


def delete_duplicates(song_titles, song_artists):
    complete_list = list(zip(song_titles, song_artists))
    unique_songs = list(dict.fromkeys(complete_list))
    return unique_songs


def get_recommendations(
    seed_artists: List[dict],
    seed_tracks: List[str],
    seed_genres: List[str],
    limit: int = 100,
    **kwargs,
) -> dict:
    """Returns Spotify's recommendations based on 2 seeds of 5 Artists and 5 Genres

    Args:
        seed_artists (List[dict]): Artists seed
        seed_genres (List[str]): Genres seed
        seed_tracks (List[str]): Tracks seed
        limit (int, optional): Maximum amount of songs to get. Defaults to 100.

    Returns:
        dict: The tracks in the response
    """
    sp = req_handler()
    print(f"ARTISTS: {seed_artists}")
    print(f"Genres: {seed_genres}")
    print(f"Tracks: {seed_tracks}")

    recommendations = sp.recommendations(
        seed_artists=seed_artists,
        seed_tracks=seed_tracks,
        seed_genres=seed_genres,
        limit=limit,
        **kwargs,
    )

    # items = recommendations["tracks"]
    # print("\n\nITEMS\n", items)
    return recommendations


def get_recommendation_by_objects(objects):
    # query by objects
    songs = []
    spotify = spotipy.Spotify(
        auth_manager=SpotifyClientCredentials(CLIENT_ID, CLIENT_SECRET)
    )

    for obj in objects:
        res = spotify.search(q=obj, limit=2, type="track")
        res = res["tracks"]["items"]
        for song in res:
            if obj in song["name"]:
                songs.append(song)
    return songs


def create_new_playlist(
    playlist_title: str, tracks: List[dict], description: str = "blabla"
):
    sp = req_handler()
    # Get User id
    user = sp.current_user()
    # print(user.get("id"))
    user_id = user.get("id")
    # # Create playlist
    playlist = sp.user_playlist_create(
        user=user_id,
        name=playlist_title,
        public=True,
        collaborative=False,
        description=description,
    )
    print(playlist)
    # data = {
    #         "name": name,
    #         "public": public,
    #         "collaborative": collaborative,
    #         "description": description
    #     }
    # print(res.get("items")[0].get("playlist_title"))

    # get the interesting id TODO
    # Add the tracks
    # sp.user_playlist_add_tracks(user, playlist_id, tracks, position=None)
