from logging.config import dictConfig
from math import isclose
from pathlib import Path
import sys
from turtle import color

sys.path.append(str(Path(__file__).parent))

from ast import operator
from . import Spotify

# import lyrics
from langdetect import detect
from deep_translator import GoogleTranslator
import operator
import random
from colorthief import ColorThief
import webcolors
from PIL import Image, ImageStat
from sorcery import dict_of

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


def get_par_from_mood(mood):

    if mood == "angry":
        min_energy = 0.8
        max_energy = 1
        min_loudness = 0.6
        min_speechiness = 0.5
        parameters = dict_of(min_energy, max_energy, min_loudness, min_speechiness)
    elif (
        mood == "fearful"
        or mood == "disgusted"
        or mood == "contempt"
        or mood == "anxious"
    ):
        # sample from playlist
        horror = True
        parameters = dict_of(horror)
    elif mood == "happy":
        min_energy = 0.5
        max_energy = 0.9
        min_valence = 0.7
        max_valence = 1
        parameters = dict_of(min_energy, max_energy, min_valence, max_valence)
    elif mood == "neutral":
        min_energy = 0.2
        max_energy = 0.6
        min_instrumentalness = 0.5
        max_instrumentalness = 1
        min_valence = 0.2
        max_valence = 0.6

        parameters = dict_of(
            min_energy,
            max_energy,
            min_instrumentalness,
            max_instrumentalness,
            min_valence,
            max_valence,
        )
    elif mood == "sad":
        max_energy = 0.3
        max_valence = 0.4
        parameters = dict_of(max_energy, max_valence)
    elif mood == "calm" or mood == "peaceful":
        min_valence = 0.6
        max_energy = 0.5
        parameters = dict_of(min_valence, max_energy)
    elif mood == "surprised":
        min_energy = 0.4
        max_energy = 0.5
        min_valence = 0.6
        max_valence = 0.8
        parameters = dict_of(min_energy, max_energy, min_valence, max_valence)
        # search for wow words in lyrics
    elif mood == "darkness":
        min_energy = 0.6
        max_valence = 0.4
        parameters = dict_of(min_energy, max_valence)

    return parameters


def image_is_plain(path):

    im = Image.open(path)
    width, height = im.size

    color_tuple = None
    for w in range(0, width):
        for h in range(0, height):
            # this will hold the value of all the channels
            if color_tuple is None:
                color_tuple = im.getpixel((w, h))
            else:
                for i, el in enumerate(color_tuple):
                    if not isclose(el, im.getpixel((w, h))[i], rel_tol=3):
                        return False
            # do something with the colors here
    return True


def get_colour_name(rgb_triplet):
    min_colours = {}
    for key, name in webcolors.CSS21_HEX_TO_NAMES.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        rd = (r_c - rgb_triplet[0]) ** 2
        gd = (g_c - rgb_triplet[1]) ** 2
        bd = (b_c - rgb_triplet[2]) ** 2
        min_colours[(rd + gd + bd)] = name
    return min_colours[min(min_colours.keys())]


def dominant_color(image_path):
    color_grabber = ColorThief(image_path)
    color_code = color_grabber.get_color(quality=1)
    color_name = get_colour_name(color_code)
    return color_name


def get_mood_from_LLF(image_path):
    """Returns a mood from the dominant color of the picture"""
    names_mood = {
        "aqua": "calm",  # 00ffff
        "black": "darkness",  # 000000
        "blue": "calm",  # 0000ff
        "fuchsia": "anxious",  # ff00ff
        "green": "peaceful",  # 008000
        "gray": "sad",  # 808080
        "lime": "happy",  # 00ff00
        "maroon": "nervous",  # 800000
        "navy": "calm",  # 000080
        "olive": "nervous",  # 808000
        "purple": "terror",  # 800080
        "red": "pleasure",  # ff0000
        "silver": "sad",  # c0c0c0
        "teal": "calm",  # 008080
        "white": "peaceful",  # ffffff
        "yellow": "happy",  # ffff00
        "orange": "happy",  # ffa500
    }
    color_name = dominant_color(image_path)
    return names_mood[color_name]


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
    Songs.extend(Spotify.get_recommendations())
    Songs.extend(Spotify.get_recommendations())
    if not Songs:
        print("No songs identified ... \nRetrying")
        # Songs.extend(Spotify.get_recommendations(parameters))

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
    return unique_songs
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