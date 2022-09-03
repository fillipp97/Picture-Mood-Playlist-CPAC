#%%
# Import libraries
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))

from flask import Flask, url_for, session, request, redirect, jsonify
import requests
import os
import random
from collections import Counter
os.chdir(os.path.abspath(os.path.dirname(__file__)))
from spotipy.oauth2 import SpotifyOAuth
import spotipy
import time
from dotenv import load_dotenv
#WE NEED A FUNCTION THAT TRANSLATES THE VALUES OF VALENCE-AROUSAL INTO THIS MULTIPLE PARAMETERS, AND TO SOME GENRES, THE FUNCTION TAKES AS INPUT THE OUTPUT OF AI 

#min_acousticness,max_acousticness,min_danceability,max_danceability,min_energy,max_energy,min_instrumentalness,max_instrumentalness,min_loudness,max_loudness, min_tempo,max_tempo, min_valence,max_valence, target_mode = 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0

#min_acousticness=0
#max_acousticness=0.5
#min_danceability=0.7
#max_danceability=1
#min_energy=0.5
#max_energy=1
#min_instrumentalness=0
#max_instrumentalness=0.01
#min_loudness=2
#max_loudness=11
#min_tempo  = 120
#max_tempo=130
#min_valence=0.7
#max_valence=1
#target_mode=1








#  Let's start with the token
# 1) go to https://developer.spotify.com/console/get-audio-analysis-track/?id=06AKEBrKUckW0KREUWRnvT
# 2) press "try it"
# 3) login
# 4) agree 
# 5) execute this cell and give the script the token (see above)
#if "token" not in locals(): # if you have not inserted the token 
#    token=input("Give me the token")
# token="BQApPXZBF0YWi-9YTM12yonnXGfLCPNI1okb9Tv86jyfaCORdoaN4Z5MDe9HanwiHzwW3g-Gz1G857MnjMrTje6Tq19x_R03BSQW8auUxHb1SZ9FYyk35hDdg2bB83JQUrTBAtxq4R0Q_5IdmlyVffPvp8pRY5vuD2lEUeupF0Ywv5hsdqpfjO9gQWv_kXL_HNn07i4_ZZOKQdsjEW5vZA_f70SHjFY"

# header={"Authorization": f"Bearer {token}"}
#  Search api: first info


env_path = Path(__file__).parent.parent / ".env"
load_dotenv(str(env_path))
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")


def get_liked_songs(limit=50, offset=0, verbose=1):
    
    #get user last 50 saved songs, rerun with different offset to get more songs
    
    session["token_info"], authorized = get_token()  
    session.modified = True

    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    liked_songs = sp.current_user_saved_tracks(limit=limit,offset=offset)
    liked_songs=liked_songs["items"]
    print("\n\n\n\nLiked songs:\n", liked_songs)

    if verbose:
        for i in range(len(liked_songs)):
            first_result=liked_songs[i]["track"]
            # print("\n\nResult {}".format(i))
            print("Author: %s"%first_result["artists"][0]["name"])
            print("Name: %s"%first_result["name"])
            print("Preview url: %s"%first_result["preview_url"])
            print("Id on spotify: %s"%first_result["id"])
    return liked_songs

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
    return random.sample(available,5)

def select_songs(liked_songs):
    return random.sample(liked_songs,5)


def select_artists(available):
    c=Counter(available)
    selected = c.most_common(5)
    #print(selected)
    return selected




def get_seeds():
    # searches for the favourite artists into the liked songs, 
    # the 5 favourite songs and the 5 favourite artists are selected to be part of the seed for the recommendation, 
    # moreover it uses "Get Available Genre Seeds" in order to get the genres seeds
    seeds=[]
    available_genres = get_available_genres()
    Genres_seed = select_genres(available_genres)
    liked_songs=get_liked_songs()
    Songs_seed=select_songs([liked_songs[i]["track"]["id"] for i in range(len(liked_songs))])
    Artist_seed=select_artists([liked_songs[i]["track"]["artists"][0]["id"] for i in range(len(liked_songs))])
    seeds.append(Genres_seed)
    seeds.append(Songs_seed)
    seeds.append(Artist_seed)
    return seeds


def delete_duplicates(song_titles, song_artists):
    complete_list=list(zip(song_titles, song_artists))
    unique_songs=list(dict.fromkeys(complete_list))
    return unique_songs

# def get_playlist():
#     #chose randomly one playlist between
#     playlists=['11AzGmTlQ1eYpiuymva2Ks', '2Jh1uEl2C4wW92K4EprRjv']
#     chosen=random.sample(playlists,1)[0]
#     #print(chosen)
#     params={'playlist_id': chosen }
#     search_url="https://api.spotify.com/v1/playlists/" + chosen + '/tracks'
#     req=requests.get(url=search_url, params=params,headers=header)
#     assert req.status_code==200, req.content
#     answer=req.json()
#     songs_in_playlist=answer['items']

#     return songs_in_playlist

def get_recommendations():
    seeds =get_seeds()
    seed_artists = [seeds[2][i][0] for i in range(len(seeds[2]))]
    seed_genres = seeds[0]
    seed_genres = seeds[1]
    limit = 100
    
    session["token_info"], authorized = get_token()  
    session.modified = True
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    print(f"Seed Artists: {seed_artists}, \nSeed Genres: {seed_genres}, \nLimit: {limit}")
    recommendations = sp.recommendations(seed_artists=seed_artists,seed_genres=seed_genres,limit=limit)

    items=recommendations['tracks']
    print("\n\nITEMS\n", items)
    return items


def get_token():
    token_valid = False
    token_info = session.get("token_info", {})

    if not (session.get("token_info", False)):
        token_valid = False
        return token_info, token_valid

    now = int(time.time())
    is_token_expired = session.get("token_info").get("expires_at") - now < 60

    # Refreshing token if it has expired
    if is_token_expired:
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(
            session.get("token_info").get("refresh_token")
        )

    token_valid = True
    return token_info, token_valid


def create_spotify_oauth():
    # print("CLIENT_ID: ", CLIENT_ID)
    # print("CLIENT_SECRET: ", CLIENT_SECRET)
    return SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=url_for("authorize", _external=True),
        scope="user-library-read,user-top-read,user-read-private",
    )


def get_available_genres():
    # searches for the favourite artists into the liked songs, 
    # the 5 favourite songs and the 5 favourite artists are selected to be part of the seed for the recommendation, 
    # moreover it uses "Get Available Genre Seeds" in order to get the genres seeds
    session["token_info"], authorized = get_token()  
    session.modified = True
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    available_genres = sp.recommendation_genre_seeds()
    # print("Available Genres in get_available_genres\n",available_genres['genres'])
    # Genres_seed = select_genres(available_genres)
    # liked_songs=get_liked_songs()
    # Songs_seed=select_songs([liked_songs[i]["track"]["id"] for i in range(len(liked_songs))])
    # Artist_seed=select_artists([liked_songs[i]["track"]["artists"][0]["id"] for i in range(len(liked_songs))])
    # seeds.append(Genres_seed)
    # seeds.append(Songs_seed)
    # seeds.append(Artist_seed)
    return available_genres['genres']
