from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent))

import json
from urllib import response
from xml.dom.minidom import Identified
import requests
import matplotlib
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image
from io import BytesIO
import urllib.request
import os
## =========================== import image & api ===========================
THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
matplotlib.rcParams['interactive'] == True
imageSource = 'LOCAL'

# print("This is the path of the folder: ", THIS_FOLDER)

# # image path
# image_path = THIS_FOLDER + '/pics/fear.jpeg'
# #image url
# image_url = '';
# #Link to the face api endpoint
# https://cpacoc.cognitiveservices.azure.com/
face_api_url = 'https://cpac.cognitiveservices.azure.com/face/v1.0/detect';

## get params from api
params = {
	'detectionModel':'detection_01',
	'returnFaceAttributes':'emotion,gender,age',
	'returnFaceId':'true'
}


def numbers_to_emotions(argument):
	switcher = {
		0: "angry",
		1: "contempt",
		2: "disgusted",
		3: "fearful",
		4: "happy",
		5: "neutral",
		6: "sad",
		7: "surprised"
	}
	return switcher.get(argument, "nothing")


def emotion_detect(image_path):
	global emotion_result
	image_data = open(image_path,'rb').read()
	headers = {'Ocp-Apim-Subscription-Key':'2903f42966d24764a8523c77a947cbd9',
	'Content-Type':'application/octet-stream'
	}
	response = requests.post(face_api_url, params = params, headers = headers, data = image_data)
	# Getting gender and Age
	responseJson = response.json()
	print(responseJson)
	# print(responseJson,"=================  HERE IS responseJson!  ==============")  #test
	genderId = responseJson[0]["faceAttributes"]["gender"]
	ageId = responseJson[0]["faceAttributes"]["age"]

	#Getting all values for each emotion key
	emotionId = responseJson[0]["faceAttributes"]["emotion"]
	angerId = responseJson[0]["faceAttributes"]["emotion"]["anger"]
	contemptId = responseJson[0]["faceAttributes"]["emotion"]["contempt"]
	disgustId = responseJson[0]["faceAttributes"]["emotion"]["disgust"]
	fearId = responseJson[0]["faceAttributes"]["emotion"]["fear"]
	happinessId = responseJson[0]["faceAttributes"]["emotion"]["happiness"]
	neutralId = responseJson[0]["faceAttributes"]["emotion"]["neutral"]
	sadnessId = responseJson[0]["faceAttributes"]["emotion"]["sadness"]
	surpriseId = responseJson[0]["faceAttributes"]["emotion"]["surprise"]

	emotionSelect = []
	# store all values for each emotion key
	emotionSelect.append(angerId)
	emotionSelect.append(contemptId)
	emotionSelect.append(disgustId)
	emotionSelect.append(fearId)
	emotionSelect.append(happinessId)
	emotionSelect.append(neutralId)
	emotionSelect.append(sadnessId)
	emotionSelect.append(surpriseId)

	# print(emotionId)
	# print(emotionSelect)

	maxemotion = emotionSelect.index(max(emotionSelect))
	emotion_result = numbers_to_emotions(maxemotion)
	gender = str(genderId)
	age = str(ageId)
	identifiedEmotion = "Emotion: " + emotion_result

	##===============================plot part===============================
	# plot image and annotations
	image = Image.open(BytesIO(image_data))
	print(str(image.width) + " -width")
	print(str(image.height) + " -height")  
	fig = plt.figure(figsize=(20, 15))
	plt.imshow(image)

	# ax = plt.imshow(image, alpha = 0.5)
	ax = plt.gca()
	idText = ("Gender: " + gender + ", Age: " + age)

	# create bounding box for face
	bboxTop = responseJson[0]["faceRectangle"]["top"]
	bboxLeft = responseJson[0]["faceRectangle"]["left"]
	bboxWidth = responseJson[0]["faceRectangle"]["width"]
	bboxHeight = responseJson[0]["faceRectangle"]["height"]
	bbox = []
	bbox.append(bboxTop)
	bbox.append(bboxLeft)
	bbox.append(bboxWidth)
	bbox.append(bboxHeight)
	origin = (bbox[1],bbox[0])
	patch = Rectangle(origin, bbox[2], bbox[3], fill = False, edgecolor = 'red', linewidth=2)

	# Add the patch to the Axes
	ax.add_patch(patch)

	plt.annotate(idText,
		(0,0),
		textcoords = "offset pixels",
		xytext = (0,0),
		ha = 'left',
		va = 'bottom',
		color = "black",
		weight = "bold",
	)

	plt.annotate(identifiedEmotion,
		(0,0),
		textcoords = "offset pixels",
		xytext = (0,24),
		ha = 'left',
		va = 'bottom',
		color = "black",
		weight = "bold",
		# backgroundcolor = "black"
		)
	# plt.imshow(patch)
	plt.axis("off")
	plt.show()




# if imageSource == 'LOCAL':
# 	image_data = open(image_path,'rb').read()
# 	headers = {'Ocp-Apim-Subscription-Key':'e28d831ddb324d5c94a7ad0f3c911595',
# 	'Content-Type':'application/octet-stream'
# 	}
# 	response = requests.post(face_api_url, params = params, headers = headers, data = image_data)
# 	print("Response: ",response)

# elif imageSource == 'URL':
# 	image_data = urllib.requesst.urlopen(image_url).read()
# 	headers = {'Ocp-Apim-Subscription-Key':'e28d831ddb324d5c94a7ad0f3c911595'}
# 	response = requests.post(face_api_url, params = params, headers = headers, json = {"url":image_url})
# else:
# 	print("Please use a valid source 'URL' 'LOCAL'")

#print unfiltered JSON response
# print(json.dumps(response.json()),'===================\n') #test

def get_mood():
    return emotion_result