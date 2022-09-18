#%%
from typing import List
from webbrowser import get
from Musixmatch import get_lyrics


def str2nestedlist(song_lyrics: str) -> List[str]:
    list_verses = song_lyrics.split("\n")
    verses_split_words = map(lambda x: x.split(" "), list_verses)
    out = [el for el in verses_split_words if el != [""]]
    return list(out)


lyr = get_lyrics("caruso", "lucio dalla")

print(str2nestedlist(lyr))
