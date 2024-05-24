# AAkar

- A ```Paint Visualizer``` where users can upload image of the room and can try different colors and textures.
- This Project was built during 24 hour hackathon codeshashtra 9.0 organised by DJCSI.


## Deployed 
  - [![Netlify Status](https://api.netlify.com/api/v1/badges/cf4e0f96-1f57-4550-8d57-7607717d6938/deploy-status)](https://app.netlify.com/sites/omprakashchoudhary/deploys): [aakarvisual.netlify.app](https://aakarvisual.netlify.app)
  - ![Vercel Status](https://camo.githubusercontent.com/4e591aad0c01cde89db7155c22ea1a8191a5f3452460039fabaa19a479dceffc/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6465706c6f796d656e74732f6a616b656a61727669732f6a6172762e69732f70726f64756374696f6e3f6c6162656c3d76657263656c266c6f676f3d76657263656c266c6f676f436f6c6f723d7768697465): [aakarvisual.vercel.app](https://aakarvisual.vercel.app)
    

## Features 
* Upload Image of Room
* Select a color from the suggested color or choose any color from the color palette
* Select a texture from a given texture or upload your texture
* Now Repaint any wall, ceiling, floor, or any part ( In PC, hover over the image to see the mask and click once to apply color or texture & In Touch Devices, tap once to see the mask and double tap to apply texture or color)
* Tools for Editing Images ex. Redo, Undo, Reset, Download, Share, or compare with the initial image
* Try Preloaded Images 
* Support for Caching and PWA App.
### Frontend 
* Running Locally 
  * Add `.env.local` file to `frontend`
  * `NEXT_PUBLIC_BACKEND_URL` (Backend url)
  * `NEXT_PUBLIC_EMAILJS_USERID`,`NEXT_PUBLIC_EMAILJS_SERVICEID`,`NEXT_PUBLIC_EMAILJS_TEMPLATEID` (for Emailjs)
  * `cd frontend`
  *  `npm i`
  *  `npm run dev`


## Backend1
* Using ONNX models of sam encoder of vit_b (92 MB)
* Takes around <30 sec to generate Image Embedding
* requires python>=3.8
* Running Locally
  * `cd backend1`
  * `python -m venv env`
  * `env/Scripts/activate`
  * `pip install -r requirements.txt`
  * `python main.py`


## Backend2 
* using SAM encoder of vit_h (2.6 GB) [VIT_H](https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth)
* Takes around 2 Min to generate Image Embedding
* More Accurate
* require python>=3.8 and torch
* Running Locally
  * Download checkpoint and place it to Backend2/
  * RUN same as backend1 

## Demo Collab file name `Backend1_Demo`
* Use it for running Flask in Kaggle or Collab using ngrok to make api for generating embedding
* Paste URL of flask to .env.local in frontend `NEXT_PUBLIC_BACKEND_URL`


This is just for Demonstration purpose.
