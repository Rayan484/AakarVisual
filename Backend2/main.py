from flask_cors import CORS
from flask import Flask, send_file
from PIL import Image
import flask
from segment_anything import sam_model_registry, SamPredictor
import numpy as np
import os
checkpoint = "sam_vit_h_4b8939.pth"
model_type = "vit_h"
sam = sam_model_registry[model_type](checkpoint=checkpoint)
sam.to(device='cpu')
predictor = SamPredictor(sam)
app = Flask(__name__)
CORS(app)
@app.route('/', methods=['GET'])
def home():
    return "Hello, World !!"


@app.route('/getembedding', methods=['POST'])
def getembedding():
    imagefile = flask.request.files['image']
    img = Image.open(imagefile)
    img = np.array(img)
    predictor.set_image(img)
    image_embedding = predictor.get_image_embedding().cpu().numpy()
    print(image_embedding)
    a = np.random.randint(100)
    np.save("Embeddings/image_embedding"+str(a)+".npy", image_embedding)
    print("image_embedding"+str(a)+".npy")
    return send_file("Embeddings/image_embedding"+str(a)+".npy", mimetype='application/octet-stream', as_attachment=True)

if (__name__ == '__main__'):
     app.run(debug=False,port=os.getenv("PORT", default=5000),host=os.getenv("HOST", default="0.0.0.0"))
