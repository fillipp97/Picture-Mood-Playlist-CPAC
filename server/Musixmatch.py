
from pathlib import Path
import translators as ts
import sys

sys.path.append(str(Path(__file__).parent))
from dotenv import load_dotenv
import os

path_env = Path(__file__).parent / ".env"
load_dotenv(path_env)
MUSIXMATCH_API_KEY = os.getenv("MUSIXMATCH_API_KEY")
from musixmatch import Musixmatch

musixmatch = Musixmatch(MUSIXMATCH_API_KEY)


def get_lyrics(title, artist):
    print(title, artist)
    song_res = musixmatch.matcher_track_get(q_track=title, q_artist=artist)
    if song_res["message"]["header"]["status_code"] == 404:
        return None
    id = song_res["message"]["body"]["track"]["track_id"]
    lyrics_res = musixmatch.track_lyrics_get(id)
    if lyrics_res["message"]["header"]["status_code"] == 404:
        return None
    lyrics = lyrics_res["message"]["body"]["lyrics"]["lyrics_body"]
    lyrics = lyrics.split("******* This Lyrics is NOT for Commercial use *******")[0]
    return lyrics


def count_occurrences(obj, lyrics):
    tr_obj = list(
        set([obj, ts.google(obj, "auto", "it"), ts.google(obj, "auto", "zh-CN")])
    )

    words = lyrics.split(" |\n")

    i = 0
    for obj in tr_obj:
        for word in words:
            if obj == word:
                i += 1
    return i


def get_scored_list(songs, objects):
    scored_songs = []
    for song in songs:
        title = song.get("name")
        artist = song.get("artists")[0].get("name")
        lyrics = get_lyrics(title=title, artist=artist)
        if lyrics is not None:
            score = 0
            for obj in objects:
                if obj in title:
                    score += 3
                score = score + count_occurrences(obj, lyrics)

            song["score"] = score
            song["lyrics"] = lyrics
            scored_songs.append(song)
        else:
            song["score"] = 0
            song["lyrics"] = ""
            scored_songs.append(song)
    return scored_songs


if __name__ == "__main__":
    print(get_lyrics("smoke on the water", "deep purple"))
