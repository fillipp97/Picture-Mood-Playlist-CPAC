from pathlib import Path
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


if __name__ == "__main__":
    print(get_lyrics("smoke on the water", "deep purple"))