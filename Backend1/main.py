from flask_cors import CORS, cross_origin
from flask import Flask, send_file
from PIL import Image
import flask
import numpy as np
import cv2
import os
import onnxruntime
encoder_path = "models/sam_vit_b_encoder.onnx"
encoder_session = onnxruntime.InferenceSession(
    encoder_path, providers=['CPUExecutionProvider'])
app = Flask(__name__)
CORS(app,origins=['http://localhost:3000','https://sam-two-peach.vercel.app/'])


@app.route('/', methods=['GET'])
@cross_origin(origin='*')
def home():
    return "Hello, World !!"


@app.route('/getembedding', methods=['POST'])
@cross_origin(origin='*')
def getembedding1():
    imagefile = flask.request.files['image']
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
    print(encoder_inputs)
    output = encoder_session.run(None, encoder_inputs)
    if output is not None:
        output = output[0]
    print(output)
    image_embedding = output
    # a = np.random.randint(1000)
    # if not os.path.exists("Embeddings"):
    #     os.makedirs("Embeddings")
    # file_path ="Embeddings\image_embedding"+str(a)+".npy"
    # np.save(file_path, image_embedding)
    # print("image_embedding"+str(a)+".npy")
    # return send_file(file_path, mimetype='application/octet-stream', as_attachment=True)
    return flask.jsonify({"data": image_embedding.tolist()})


if (__name__ == '__main__'):
    app.run(debug=True,port=os.getenv("PORT", default=10000),host=os.getenv("HOST", default="0.0.0.0"))
