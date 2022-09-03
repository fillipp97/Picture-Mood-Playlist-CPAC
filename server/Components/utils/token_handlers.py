from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent.parent))
import time
from spotipy.oauth2 import SpotifyOAuth
from flask import Flask, url_for, session
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(str(env_path))
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")


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


def remove_token():
    for key in list(session.keys()):
        session.pop(key)
    session.clear()
    try:
        os.remove(".cache")
    except:
        pass
