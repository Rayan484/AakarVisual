from flask_cors import CORS, cross_origin
from flask import Flask, send_file
from PIL import Image
import flask
import numpy as np
import cv2
import os
import urllib.request
import onnxruntime
urllib.request.urlretrieve("https://firebasestorage.googleapis.com/v0/b/aakar-21675.appspot.com/o/sam_vit_b_encoder.onnx?alt=media&token=51e26e1f-eb6b-4103-84f5-6b5a53cc5f43", "sam_vit_b_encoder.onnx")
encoder_path = "sam_vit_b_encoder.onnx"
encoder_session = onnxruntime.InferenceSession(encoder_path, providers=['CPUExecutionProvider'])
app = Flask(__name__)
CORS(app, expose_headers=["Content-Disposition"])


@app.route('/', methods=['GET'])
def home():
    
    return "Hello, World !!"

@app.route('/test',methods=['POST'])
def testpost():
    imagfile=flask.request.files['image']
    print(imagfile)
    return "Image Recieved"

@app.route('/getembedding', methods=['POST'])
@cross_origin(origin='*')
def getembedding1():
    imagefile = flask.request.files['image']
    print(imagefile)
    img = Image.open(imagefile)
    cv_image = np.array(img)
    input_size = (684, 1024)
    scale_x = input_size[1] / cv_image.shape[1]
    scale_y = input_size[0] / cv_image.shape[0]
    scale = min(scale_x, scale_y)
    transform_matrix = np.array(
        [
            [scale, 0, 0],
            [0, scale, 0],
            [0, 0, 1],
        ]
    )
    cv_image = cv2.warpAffine(
        cv_image,
        transform_matrix[:2],
        (input_size[1], input_size[0]),
        flags=cv2.INTER_LINEAR,
    )
    encoder_inputs = {
        "input_image": cv_image.astype(np.float32),
    }
    output = encoder_session.run(None, encoder_inputs)
    if output is not None:
        output = output[0]
    image_embedding = output
    response=flask.jsonify(image_embedding.tolist())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if (__name__ == '__main__'):
    app.run(debug=True,port=os.getenv("PORT", default=10000),host=os.getenv("HOST", default="0.0.0.0"))
