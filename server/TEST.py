#%%
# import importlib
# from typing import List
# from webbrowser import get
# from Musixmatch import get_lyrics


# def str2nestedlist(song_lyrics: str) -> List[str]:
#     list_verses = song_lyrics.split("\n")
#     verses_split_words = map(lambda x: x.split(" "), list_verses)
#     out = [el for el in verses_split_words if el != [""]]
#     return list(out)


# lyr = get_lyrics("caruso", "lucio dalla")

# print(str2nestedlist(lyr))

#%%
import spotipy
from pathlib import Path
import os
from dotenv import load_dotenv
from spotipy import SpotifyClientCredentials

env_path = Path(__file__).parent / ".env"
load_dotenv(str(env_path))
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
spotify = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(CLIENT_ID, CLIENT_SECRET)
)

res = spotify.search(q="Killing In the Name", limit=1, type="track")
res = res["tracks"]["items"]
print(res)