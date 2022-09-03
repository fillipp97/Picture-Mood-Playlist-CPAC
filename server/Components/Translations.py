from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent.parent))

from ast import operator
from contextlib import nullcontext
from enum import unique
from fnmatch import translate

from matplotlib.pyplot import text
from .Spotify import *

# import lyrics
from langdetect import detect
from deep_translator import GoogleTranslator
import operator
import random

# import wordnet
# from senti_classifier import senti_classifier
# word= "sad"
# def emotions2spotify(word):
#     return


"""
min_acousticness=0
max_acousticness=0.5
min_danceability=0.7
max_danceability=1
min_energy=0.5
max_energy=1

#min_instrumentalness=0
#max_instrumentalness=0.01

min_loudness=2
max_loudness=11
min_tempo  = 120
max_tempo=175
min_valence=0.7
max_valence=1
target_mode=1

"""
# from asyncio.windows_events import NULL
from logging import NullHandler


def get_par_from_mood(mood):

    if mood == "angry":
        min_energy = 0.8
        max_energy = 1
        parameters = {"mood": mood, "min_energy": min_energy, "max_energy": max_energy}
    elif mood == "fearful" or mood == "disgusted":
        # sample from playlist
        parameters = {"mood": "Sample_Horror"}
    elif mood == "happy":
        min_energy = 0.5
        max_energy = 0.9
        min_valence = 0.7
        max_valence = 1
        parameters = {
            "mood": mood,
            "min_energy": min_energy,
            "max_energy": max_energy,
            "min_valence": min_valence,
            "max_valence": max_valence,
        }
    elif mood == "neutral":
        min_energy = 0.2
        max_energy = 0.6
        min_instrumentalness = 0.5
        max_instrumentalness = 1
        min_valence = 0.2
        max_valence = 0.6

        parameters = {
            "mood": mood,
            "min_energy": min_energy,
            "max_energy": max_energy,
            "min_valence": min_valence,
            "max_valence": max_valence,
            "min_instrumentalness": min_instrumentalness,
            "max_instrumentalness": max_instrumentalness,
        }
    elif mood == "sad":
        min_energy = 0
        max_energy = 0.3
        min_valence = 0
        max_valence = 0.4
        parameters = {
            "mood": mood,
            "min_energy": min_energy,
            "max_energy": max_energy,
            "min_valence": min_valence,
            "max_valence": max_valence,
        }
    elif mood == "surprised":
        min_energy = 0.4
        max_energy = 0.5
        min_valence = 0.6
        max_valence = 0.8
        parameters = {
            "mood": mood,
            "min_energy": min_energy,
            "max_energy": max_energy,
            "min_valence": min_valence,
            "max_valence": max_valence,
        }
        # search for wow words in lyrics
    elif mood == "noface":
        # search for objects in lyrics
        parameters = {"mood": "noface"}
    return parameters


def assign_score(words, text):
    split = text.lower().split()
    score = 0
    for word in words:
        score += split.count(word)
    return score


def score_func(songs_and_texts, words):
    # takes as input songs and lyrics and scores songs by counting the number of times words appear in the lyrics
    print("Working on texts")
    # GET THE NEEDED LANGUAGES
    languages = set()
    for song in songs_and_texts:
        try:
            languages.add(detect(song[2]))
        except:
            print(
                "Impossible to detect the language of: {},{} ---> SKIPPED".format(
                    song[0], song[1]
                )
            )
    print(languages)
    # TRANSLATE THE WORDS JUST ONE TIME
    trans_words = ""
    for word in words:
        for lang in languages:
            trans_words += GoogleTranslator(source="auto", target=lang).translate(word)
            trans_words += "-"
    words = trans_words.lower().split("-")
    words = words[:-1]
    print(words)
    for song in songs_and_texts:
        if song[2] == "" or song[2] == "notext":
            song[2] = song[0]  # for instrumentals or notext consider title as a lyric
        if song[2] != "notext":
            # print(song[0],song[1])
            song[3] = assign_score(words, song[2])

            # print(song[0],song[1],song[3])
    return songs_and_texts


def retrieve_lyrics(unique_songs, horror=0):
    if horror == 1:  # just format
        # print(unique_songs)
        songs = []
        for song in unique_songs:
            # print('This is the structure of a song: \n\n\n\n')
            # print(song['track']['name'], song['track']['artists'][0]['name'])
            songs.append(
                [song["track"]["name"], song["track"]["artists"][0]["name"], "", 0]
            )
        return songs
    texts = []
    if horror == 2:
        for song in unique_songs:
            texts.append([song[0], song[1], "", 0])
        return texts

    for song in unique_songs:
        text = lyrics.get_lyrics(song[0], song[1])  # problem
        texts.append([song[0], song[1], text, 0])

    # print("=================  We are retrieve_lyrics:  ========================", )
    # for i in range(3):
    #     print(texts[i][3])
    # print("=================  Over here  ========================", )
    return texts


def make_a_choice(song_list):
    if song_list[0][3] == 0:
        selected = random.sample(song_list, 1)[0]
        return selected
    return song_list[0]


def Get_Songs_from_mood(mood, obj_in_pic):
    # parameters
    parameters = get_par_from_mood(mood)

    print(parameters)

    # Get a pool of songs from the recommended ones
    Songs = []
    # each time means 100 songs
    Songs.extend(Spotify.get_recommendations(parameters))
    Songs.extend(Spotify.get_recommendations(parameters))
    while not Songs:
        print("No songs identified ... \nRetrying")
        Songs.extend(Spotify.get_recommendations(parameters))

    # extract titles and artists
    song_titles = [Songs[i]["name"] for i in range(len(Songs))]
    song_artists = [Songs[i]["artists"][0]["name"] for i in range(len(Songs))]
    # Remove duplicates
    unique_songs = Spotify.delete_duplicates(song_titles, song_artists)
    print(
        "FROM {} SONGS {} SONGS HAVE BEEN DELETED".format(
            len(Songs), len(Songs) - len(unique_songs)
        )
    )

    if parameters["mood"] == "noface":
        songs_and_texts = retrieve_lyrics(
            unique_songs
        )  # contains [song title, song artist, lyrics,score initialized to 0] for each song
        score_list = score_func(songs_and_texts, obj_in_pic)
        score_list.sort(key=operator.itemgetter(3), reverse=True)
        return score_list
    elif parameters["mood"] == "Sample_Horror":
        # SAMPLE FROM HORROR PLAYLIST
        Songs = Spotify.get_playlist()
        songs_and_texts = retrieve_lyrics(Songs, horror=1)
        return songs_and_texts

    songs_and_texts = retrieve_lyrics(
        unique_songs, horror=2
    )  # contains [song title, song artist, lyrics,score initialized to 0] for each song
    score_list = score_func(
        songs_and_texts, obj_in_pic
    )  # FOR EVERY MOOD CHOSE WETHER TO CONSIDER THE TEXT OR JUST OUTPUT A RANDOM SONG
    score_list.sort(key=operator.itemgetter(3), reverse=True)

    return score_list
