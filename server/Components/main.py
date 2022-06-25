from enum import unique
from multiprocessing.connection import wait
from random import choice
from numpy import choose
import object_detection
from object_detection import get_object,detect_img, download_and_resize_image,hub,detector,run_detector
import Spotify
import Translations
from time import sleep
import Azure_api
from Azure_api import get_mood, emotion_detect

image_urls = [
    "https://i.huffpost.com/gen/2141038/images/o-SAD-OLDER-PERSON-facebook.jpg"
]

image_path = download_and_resize_image(image_urls[0], 640, 480)
detect_img(image_path)

emotion_detect(image_path)

print("\nThe emotion_result is: ", get_mood())
print("\nThe object_result is: ", get_object())

obj= list(dict.fromkeys(get_object())) 
unique_songs=Translations.Get_Songs_from_mood(get_mood(),obj)
print('\n Pool of songs:\n')
i=0
for song in unique_songs:
   i+=1
   print(i,'-',song[0],song[1],song[3])
choice =Translations.make_a_choice(unique_songs)
print('\n\n\n','The final choice is:\n', choice[0],choice[1],choice[3])