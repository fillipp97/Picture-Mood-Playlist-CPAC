
# Copyright 2018 The TensorFlow Hub Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================


# ================================== Setting part ==================================
# @title Imports and function definitions

# For running inference on the TF-Hub module.
import time
import tensorflow as tf

import tensorflow_hub as hub
# from colorthief import ColorThief
# For downloading the image.
import matplotlib.pyplot as plt
import tempfile
# from six.moves.urllib.request import urlopen
from urllib.request import urlopen
from six import BytesIO

# For drawing onto the image.
import numpy as np
from PIL import Image
from PIL import ImageColor
from PIL import ImageDraw
from PIL import ImageFont
from PIL import ImageOps

object_result = []
# For measuring the inference time.
# Turn on emergency execution
tf.compat.v1.enable_eager_execution()
# tf.config.run_functions_eagerly(True)




def display_image(image):
    fig = plt.figure(figsize=(20, 15))
    plt.grid(False)
    plt.imshow(image)


def download_and_resize_image(image_data, new_width=256, new_height=256,
                              display=False):
    _, filename = tempfile.mkstemp(suffix=".jpg")
    # response = urlopen(url)
    # image_data = response.read()
    image_data = BytesIO(image_data)
    pil_image = Image.open(image_data)
    pil_image = ImageOps.fit(
        pil_image, (new_width, new_height), Image.ANTIALIAS)
    pil_image_rgb = pil_image.convert("RGB")
    pil_image_rgb.save(filename, format="JPEG", quality=90)
    print("Image downloaded to %s." % filename)
    # if display:
    #     display_image(pil_image)
    return filename


def draw_bounding_box_on_image(image,
                               ymin,
                               xmin,
                               ymax,
                               xmax,
                               color,
                               font,
                               thickness=4,
                               display_str_list=()):
    """Adds a bounding box to an image."""
    draw = ImageDraw.Draw(image)
    im_width, im_height = image.size
    (left, right, top, bottom) = (xmin * im_width, xmax * im_width,
                                  ymin * im_height, ymax * im_height)
    draw.line([(left, top), (left, bottom), (right, bottom), (right, top),
               (left, top)],
              width=thickness,
              fill=color)

    # If the total height of the display strings added to the top of the bounding
    # box exceeds the top of the image, stack the strings below the bounding box
    # instead of above.
    display_str_heights = [font.getsize(ds)[1] for ds in display_str_list]
    # Each display_str has a top and bottom margin of 0.05x.
    total_display_str_height = (1 + 2 * 0.05) * sum(display_str_heights)

    if top > total_display_str_height:
        text_bottom = top
    else:
        text_bottom = top + total_display_str_height
    # Reverse list and print from bottom to top.
    for display_str in display_str_list[::-1]:
        text_width, text_height = font.getsize(display_str)
        margin = np.ceil(0.05 * text_height)
        draw.rectangle([(left, text_bottom - text_height - 2 * margin),
                        (left + text_width, text_bottom)],
                       fill=color)
        draw.text((left + margin, text_bottom - text_height - margin),
                  display_str,
                  fill="black",
                  font=font)
        text_bottom -= text_height - 2 * margin


def draw_boxes(image, boxes, class_names, scores, max_boxes=10, min_score=0.1):
    """Overlay labeled boxes on an image with formatted scores and label names."""
    colors = list(ImageColor.colormap.values())

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSansNarrow-Regular.ttf",
                                  25)
    except IOError:
        print("Font not found, using default font.")
        font = ImageFont.load_default()
    print("All the results: ")
    for i in range(min(boxes.shape[0], max_boxes)):
        if scores[i] >= min_score:
            ymin, xmin, ymax, xmax = tuple(boxes[i])
            display_str = "{}: {}%".format(class_names[i].decode("ascii"),
                                           int(100 * scores[i]))
            print(" ", class_names[i].decode("ascii"))
            color = colors[hash(class_names[i]) % len(colors)]
            image_pil = Image.fromarray(np.uint8(image)).convert("RGB")
            draw_bounding_box_on_image(
                image_pil,
                ymin,
                xmin,
                ymax,
                xmax,
                color,
                font,
                display_str_list=[display_str])
            np.copyto(image, np.array(image_pil))
    return image

# ==============================================Apply Module==============================================
# FasterRCNN+InceptionResNet V2: high accuracy,
# ssd+mobilenet V2: small and fast.
# module_handle = "https://tfhub.dev/google/faster_rcnn/openimages_v4/inception_resnet_v2/1"
# @param ["https://tfhub.dev/google/openimages_v4/ssd/mobilenet_v2/1", "https://tfhub.dev/google/faster_rcnn/openimages_v4/inception_resnet_v2/1"]


module_handle = "https://tfhub.dev/google/openimages_v4/ssd/mobilenet_v2/1"
detector = hub.load(module_handle).signatures['default']

def load_img(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_jpeg(img, channels=3)
    return img


def run_detector(detector, path):
    img = load_img(path)

    converted_img = tf.image.convert_image_dtype(img, tf.float32)[
        tf.newaxis, ...]
    start_time = time.time()
    result = detector(converted_img)
    end_time = time.time()

    result = {key:value.numpy() for key,value in result.items()}

    print("Found %d objects." % len(result["detection_scores"]))
    print("Inference time: ", end_time-start_time)

    image_with_boxes = draw_boxes(
        img.numpy(), result["detection_boxes"],
        result["detection_class_entities"], result["detection_scores"])
#   print("All the Results of Recognition: ",result["detection_class_entities"].decode("ascii"))
    global object_result
    # object_result = result["detection_class_entities"][0].decode("ascii")# most possibilty
    for i in range(len(result["detection_class_entities"])):
        object_result.append(result["detection_class_entities"][i].decode("ascii"))

    
    # print("Similarest Result of Recognition : ",
    #       result["detection_class_entities"][0].decode("ascii"))
    # print("Type: ", type(result["detection_class_entities"][0]))
    # display_image(image_with_boxes)


# def detect_img(image_url):
#     start_time = time.time()
#     image_path = download_and_resize_image(image_url, 640, 480)
#     print("image_path:",image_path)
#     run_detector(detector, image_path)
#     end_time = time.time()
#     print("Inference time:", end_time-start_time)

def detect_img(image_path):
    start_time = time.time()
    
    run_detector(detector, image_path)
    end_time = time.time()
    print("Inference time:", end_time-start_time)
    print("=========================Object Detection Finished=======================")

def get_object():
    return object_result
# ==============================================Set Images==============================================


# image_urls = [
#     # Source: https://commons.wikimedia.org/wiki/File:The_Coleoptera_of_the_British_islands_(Plate_125)_(8592917784).jpg
#     #   "https://upload.wikimedia.org/wikipedia/zh/d/d6/Zootopia-poster1-600x889.jpg",
#     #     "https://cdn.w600.comps.canstockphoto.it/objects-set-spazio-disegno_csp45794099.jpg",
#     #     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4rV9kCxlj5UtYY33yk02CFzvIkiqMgJr4Kg&usqp=CAU",
#     #     "https://image.freepik.com/free-photo/home-interior-with-decorative-items-wooden-table_169016-1693.jpg",
#     "https://raw.githubusercontent.com/fillipp97/Picture-Mood-Playlist/main/pics/face4.jpeg?token=GHSAT0AAAAAABM3PY42UEKJJL65SBVS3OCAYPIYUMA",
#     #     "https://upload.wikimedia.org/wikipedia/commons/b/b2/Manis_tricuspis_San_Diego_Zoo_03.2012.jpg",
#     #   # By Américo Toledano, Source: https://commons.wikimedia.org/wiki/File:Biblioteca_Maim%C3%B3nides,_Campus_Universitario_de_Rabanales_007.jpg
#     #   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Biblioteca_Maim%C3%B3nides%2C_Campus_Universitario_de_Rabanales_007.jpg/1024px-Biblioteca_Maim%C3%B3nides%2C_Campus_Universitario_de_Rabanales_007.jpg",
#     #   # Source: https://commons.wikimedia.org/wiki/File:The_smaller_British_birds_(8053836633).jpg
#     #   "https://upload.wikimedia.org/wikipedia/commons/0/09/The_smaller_British_birds_%288053836633%29.jpg",
# ]

# detect_img(image_urls[0])
