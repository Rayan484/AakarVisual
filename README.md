# Frontend 
* Running Locally 
  * Add `.env.local` file to `frontend`
  * `NEXT_PUBLIC_BACKEND_URL` (Backend url)
  * `NEXT_PUBLIC_EMAILJS_USERID`,`NEXT_PUBLIC_EMAILJS_SERVICEID`,`NEXT_PUBLIC_EMAILJS_TEMPLATEID` (for Emailjs)
  * `cd frontend`
  *  `npm i`
  *  `npm run dev`


# Backend1
* Using ONNX models of sam encoder of vit_b (92 MB)
* Takes around <30 sec to generate Image Embedding
* requires python>=3.8
* Running Locally
  * `cd backend1`
  * `python -m venv env`
  * `env/Scripts/activate`
  * `pip install -r requirements.txt`
  * `python main.py`


# Backend2 
* using SAM encoder of vit_h (2.6 GB) 
* Takes around 2 Min to generate Image Embedding
* More Accurate
* require python>=3.8 and torch

# Demo Collab file for onnx model 
