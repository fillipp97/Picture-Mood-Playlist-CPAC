from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent))

import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, url_for, session, request, redirect, jsonify
import time
import os
import shutil
from dotenv import load_dotenv
from enum import unique
from multiprocessing.connection import wait
from random import choice
from numpy import choose

from Components.object_detection import (
    get_object,
    detect_img,
    download_and_resize_image,
    hub,
    detector,
    run_detector,
)
import Components.Translations as Translations
from time import sleep

from Components.Azure_api import get_mood, emotion_detect

# from Components.Spotify import Spoty

load_dotenv(".env")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
# print("CLIENT_ID: ", CLIENT_ID)
# print("CLIENT_SECRET: ", CLIENT_SECRET)
# App config
app = Flask(__name__)

app.secret_key = "4njigv9nipvls"
app.config["SESSION_COOKIE_NAME"] = "spotify-login-session"


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
    for key in list(session.keys()):
        session.pop(key)
    session.clear()
    try:
        os.remove(".cache")
    except:
        pass
    try:
        shutil.rmtree("__pycache__")
    except:
        pass
    return redirect("http://localhost:3000")


@app.route("/getTracks")
def get_tracks():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        return {"result": "bad"}
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    currGroup = sp.current_user_saved_tracks(limit=50, offset=0)["items"]
    return {"result": "ok", "songs": currGroup}


@app.route("/getCovers")
def get_covers():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        return {"result": "bad"}
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    currGroup = sp.current_user_saved_tracks(limit=50, offset=0)["items"]
    link = currGroup[0]["track"]["album"]["images"][0]["url"]
    return {"result": "ok", "links": link}


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
    return SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=url_for("authorize", _external=True),
        scope="user-library-read,user-top-read,user-read-private",
    )


@app.route("/uploadFile", methods=["GET", "POST"])
def upload_im():
    image = request.files["Image"].read()
    image_path = download_and_resize_image(image, 640, 480)
    detect_img(image_path)

    emotion_detect(image_path)

    print("\nThe emotion_result is: ", get_mood())
    print("\nThe object_result is: ", get_object())

    obj = list(dict.fromkeys(get_object()))
    unique_songs = Translations.Get_Songs_from_mood(get_mood(), obj)
    # print('\n Pool of songs:\n')
    # i=0
    # for song in unique_songs:
    #     i+=1
    # print(i,'-',song[0],song[1],song[3])
    choice = Translations.make_a_choice(unique_songs)
    # print('\n\n\n','The final choice is:\n', choice[0],choice[1],choice[3])
    return jsonify({"choices": choice})


@app.route("/getResult")
# Here we must insert the core of the program, Since flask doesn't provide a functionality in order to run functions after return, we should use something like KEEP ALIVE
def getResult():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        return {"result": "bad"}
    sp = spotipy.Spotify(auth=session.get("token_info").get("access_token"))
    # preferences = sp.current_user_top_tracks()
    sp.audio_features(tracks="2KfZlHUvngihMWV72wnmhL")
    return "200"


@app.route("/checkLogState")
def checkLogState():
    session["token_info"], authorized = get_token()
    session.modified = True
    if not authorized:
        return {"result": "bad"}
    else:
        return {"result": "ok"}


if __name__ == "__main__":
    app.run(debug=True)
