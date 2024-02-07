import React, { useState, useContext, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import texturedata from "../utils/texturedata.json";
import colordata from "../utils/colordata.json";
import axios from "axios";
import Image from "next/image";
import { handleImageScale } from "../utils/helpers/scaleHelper";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { modelScaleProps } from "../utils/helpers/Interfaces";
import { Share } from "@capacitor/share";
import introJs from "intro.js";
import "intro.js/introjs.css";
import {
  onnxMaskToImage,
  loadNpyTensor,
  loadNpyTensor1,
  convertURLtoFile,
  convertImageEleToData,
  imageDataToImage,
  scaleTexture,
  downloadImage,
  processTexture,
} from "../utils/helpers/maskUtils";
import { modelData } from "../utils/helpers/onnxModelAPI";
import Stage from "../components/Stage";
import AppContext from "../utils/hooks/createContext";
import preimage from "../utils/preimage.json";
import hexRgb from "hex-rgb";
import FileUpload from "../components/FileUpload/FileUpload";
import undoRedo from "../utils/helpers/linkedlist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Offcanvas } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faClose,
  faCopy,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  IoIosCloudDownload,
  IoIosRedo,
  IoIosUndo,
  IoMdImage,
} from "react-icons/io";
import { RxReset } from "react-icons/rx";
import { MdCompare } from "react-icons/md";
import { FaImage, FaShare } from "react-icons/fa";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Capacitor } from "@capacitor/core";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import NavBar1 from "../components/NavBar/NavBar1";
import { Tensor } from "onnxruntime-web";
const ColorVisualiser = (props: any) => {
  // const [color, setColor] = useColor("hex", "#121212");
  const {
    clicks: [clicks],
    image: [image, setImage],
    maskImg: [maskImg, setMaskImg],
    color: [color, setColor],
    error: [error, setError],
    texture: [texture, setTexture],
    initialImage: [initialImage, setInitialImage],
  } = useContext(AppContext)!;
  const { model, vithModel } = props;
  const fileInput = useRef<HTMLInputElement>(null);
  const textureFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>(null);
  const [tensor, setTensor] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);
  const [showOffcanvas, setShowOffcanvas] = useState<boolean>(false);
  const [showColorModal, setShowColorModal] = useState<boolean>(false);
  const [textureFile, setTextureFile] = useState<any>(null);
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const [shareURL, setShareURL] = useState<string>("");
  const [colour, setColour] = useColor("#561ecb");
  const [type, setType] = useState<boolean>(false);
  const handleShowModal = () => setShowModal(true);
  const handleShowLoader = () => setShowLoader(true);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseLoader = () => setShowLoader(false);
  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = () => setShowOffcanvas(true);
  const handleShowColorModal = () => setShowColorModal(true);
  const handleCloseColorModal = () => setShowColorModal(false);
  const handleShowSlider = () => setShowSlider(!showSlider);
  const handleShowShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => setShowShareModal(false);

  const getImageEmbedding = async (file: any) => {
    handleShowModal();
    setType(false);
    const formData = new FormData();
    formData.append("image", file);
    await loadImage(file);
    await scrollTo(0, 0);
    try {
      const res = await axios.post(
        ` ${process.env.NEXT_PUBLIC_BACKEND_URL}/getembedding`,
        formData
      );
      const data = await res.data;

      // convert data into float32 array
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          for (let k = 0; k < data[i][j].length; k++) {
            for (let l = 0; l < data[i][j][k].length; l++) {
              data[i][j][k][l] = parseFloat(data[i][j][k][l]);
            }
          }
        }
      }
      const data2 = data.flat(Infinity);
      const data1 = new Float32Array(data2);
      const tensor = new Tensor("float32", data1, [1, 256, 64, 64]);
      setTensor(tensor);
      handleCloseModal();
      introJs().setOption("dontShowAgain", true).start();
    } catch (e) {
      handleCloseModal();
      setError(
        "Currently we are facing some issues , Try from one of our preloaded images"
      );
      setFile(null);
      setTimeout(() => {
        setError(null);
      }, 2000);

      console.log(e);
    }
  };

  const loadImage = async (imageFile: any) => {
    try {
      const img = document.createElement("img"); // create a new image object
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const { height, width, samScale } = handleImageScale(img);
        setModelScale({
          height: height, // original image height
          width: width, // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        img.width = width;
        img.height = height;
        setImage(img);
        undoRedo.setImage(img);
        setInitialImage(img);
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    runONNX();
  }, [clicks]);

  const runONNX = async () => {
    try {
      if (
        model === null ||
        clicks === null ||
        tensor === null ||
        modelScale === null
      )
        return;
      else {
        // Preapre the model input in the correct format for SAM.
        // The modelData function is from onnxModelAPI.tsx.
        const feeds = modelData({
          clicks,
          tensor,
          modelScale,
        });
        if (feeds === undefined) return;
        // Run the SAM ONNX model with the feeds returned from modelData()
        if (!type) {
          const results = await model.run(feeds);
          const output = results[model.outputNames[0]];

          // The predicted mask returned from the ONNX model is an array which is
          // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.
          setMaskImg(
            onnxMaskToImage(output.data, output.dims[2], output.dims[3])
          );
        } else {
          const results = await vithModel.run(feeds);
          const output = results[vithModel.outputNames[0]];
          setMaskImg(
            onnxMaskToImage(output.data, output.dims[2], output.dims[3])
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handlePreloadedImage = (imagedetail: any) => {
    handleShowModal();
    setType(true);
    convertURLtoFile(imagedetail.image, imagedetail.name).then((file) => {
      setFile(file);
      const image = document.createElement("img");
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const { height, width, samScale } = handleImageScale(image);
        setModelScale({
          height: height, // original image height
          width: width, // original image width
          samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        });
        image.width = width;
        image.height = height;
        setImage(image);
        undoRedo.setImage(image);
        setInitialImage(image);
        setTexture(null);
        setMaskImg(null);
        setTextureFile(null);
        setColor("#121212");
        scrollTo(0, 0);
        Promise.resolve(
          loadNpyTensor(imagedetail.image_embedding, "float32")
        ).then((embedding) => {
          setTensor(embedding);
        });
        setTimeout(() => {
          handleCloseModal();
          introJs().setOption("dontShowAgain", true).start();
        }, 3000);
      };
    });
  };
  const applyColor = async (
    image: HTMLImageElement,
    maskImg: HTMLImageElement,
    color: string
  ) => {
    if (!image || !maskImg || !color) return;
    try {
      const imageData = await convertImageEleToData(image);
      const maskData = await convertImageEleToData(maskImg);
      if (!imageData.data || !maskData.data) return;
      for (let i = 0; i < maskData.data.length; i += 4) {
        if (
          maskData.data[i] === 0 &&
          maskData.data[i + 1] === 114 &&
          maskData.data[i + 2] === 189
        ) {
          // color the pixel
          const rgb = hexRgb(color);
          imageData.data[i] = rgb.red;
          imageData.data[i + 1] = rgb.green;
          imageData.data[i + 2] = rgb.blue;
          imageData.data[i + 3] = 255;
        }
      }

      const finalImage = await imageDataToImage(imageData);
      await setImage(finalImage);
      await undoRedo!.insert(finalImage);
    } catch (e) {
      setError("Something went wrong , please try again");
      setTimeout(() => {
        setError(null);
      }, 1000);
      console.log(e);
    }
  };
  const applyTexture = async (
    image: HTMLImageElement,
    maskImg: HTMLImageElement,
    texture: HTMLImageElement
  ) => {
    if (!image || !maskImg || !texture) return;
    try {
      const imageData = await convertImageEleToData(image);
      const maskData = await convertImageEleToData(maskImg);
      const textureData = await convertImageEleToData(texture);
      if (!imageData.data || !maskData.data || !textureData.data) return;
      for (let i = 0; i < maskData.data.length; i += 4) {
        if (
          maskData.data[i] === 0 &&
          maskData.data[i + 1] === 114 &&
          maskData.data[i + 2] === 189
        ) {
          // color the pixel
          imageData.data[i] = textureData.data[i];
          imageData.data[i + 1] = textureData.data[i + 1];
          imageData.data[i + 2] = textureData.data[i + 2];
          imageData.data[i + 3] = 255;
        }
      }

      const finalImage = await imageDataToImage(imageData);
      await setImage(finalImage);
      await undoRedo!.insert(finalImage);
    } catch (e) {
      setError("Something went wrong , please try again");
      setTimeout(() => {
        setError(null);
      }, 1000);
      console.log(e);
    }
  };
  const handleTextureClick = (texture: any) => {
    // load image
    if (!image) return;
    try {
      const img = document.createElement("img"); // create a new image object
      img.src = texture.url;
      img.onload = () => {
        scaleTexture(image, img).then((scaledTexture) => {
          if (!scaledTexture) return;
          if (scaledTexture instanceof HTMLImageElement) {
            setTexture(scaledTexture);
            toast.success("Texture Selected");
            handleCloseOffCanvas();
          }
          setColor(null);
        });
      };
    } catch (error) {
      console.log(error);
    }
  };
  const handleUndo = () => {
    const image = undoRedo!.undo();
    if (image instanceof HTMLImageElement) {
      setImage(image);
    }
  };
  const handleRedo = () => {
    const image = undoRedo!.redo();
    if (image instanceof HTMLImageElement) {
      setImage(image);
    }
  };
  const handleReset = () => {
    setImage(initialImage);
    undoRedo!.reset();
  };
  const shareImage = async () => {
    if (
      Capacitor.getPlatform() === "android" ||
      Capacitor.getPlatform() === "ios"
    ) {
      const formData = new FormData();
      if (image!.src.startsWith("blob")) {
        formData.append("file", file);
      } else {
        formData.append("file", image!.src);
      }
      formData.append("upload_preset", "d5mvumcd");
      formData.append("cloud_name", "dbvxdjjpr");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbvxdjjpr/image/upload",
        formData
      );
      const data = await res.data;
      await Share.share({
        title: "Aakar",
        text: "Check out this Room Image from Aakar",
        url: data.url,
        dialogTitle: "Share with loved ones",
      })
        .then(() => {
          console.log("Share successful");
        })
        .catch((e) => {
          console.log(e);
        });
      return;
    } else if (Capacitor.getPlatform() === "web") {
      handleShowShareModal();
      handleShowLoader();
      const formData = new FormData();
      if (image!.src.startsWith("blob")) {
        formData.append("file", file);
      } else {
        formData.append("file", image!.src);
      }
      formData.append("upload_preset", "d5mvumcd");
      formData.append("cloud_name", "dbvxdjjpr");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbvxdjjpr/image/upload",
        formData
      );

      const data = await res.data;

      await handleCloseLoader();
      await setShareURL(data.url);
    }
    // await handleCloseShareModal();
  };
  const handleClose = () => {
    setFile(null);
    setImage(null);
    setMaskImg(null);
    setTensor(null);
    setModelScale(null);
    undoRedo!.reset();
  };
  return (
    <>
      {!file && <NavBar />}
      {file && <NavBar1 handleClose={handleClose} />}
      <div className={`${file ? "colorvisualiser" : ""} py-5 pb-5`}>
        {!file && (
          <div className="colorvisualiser__container container py-md-2 py-lg-5">
            <div className="row justify-content-center align-items-center gap-5 gap-lg-0">
              <div className="col-12 col-lg-6 colorvisualiser__container__left ">
                <h1 className="text-center mb-4">Visualize your Home</h1>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-100 img-fluid"
                >
                  <source
                    src="/Paint_Visualizer_7becb7495b.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="col-12 col-lg-6 colorvisualiser__container__right">
                <FileUpload
                  fileInput={fileInput}
                  setFile={setFile}
                  getEmbedding={getImageEmbedding}
                />
              </div>
            </div>
            <div className="row justify-content-center align-items-center gap-5 gap-lg-3 mt-5 ">
              <div className="col-12 colorvisualiser__container__left ">
                <h1 className="text-center">Try one of our preloaded images</h1>
              </div>
              {preimage.map((image: any, index: number) => {
                return (
                  <Card
                    className="border-2 shadow-sm col-11 col-md-5 col-lg-3"
                    key={index}
                    onClick={() => handlePreloadedImage(image)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-between align-items-center p-0 pt-3">
                      <Card.Img
                        variant="top"
                        src={image.image}
                        className="img-fluid"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                      <Card.Title className="text-center">
                        {image.name}.png
                      </Card.Title>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        {file && (
          <>
            <div className="colorvisualiser__container container-fluid m-0 p-0">
              <div className="row m-0 p-0 align-items-center">
                <div className="col-12 col-lg-8 colorvisualiser__container__left">
                  <Stage
                    handleShowLoader={handleShowLoader}
                    applyColor={applyColor}
                    applyTexture={applyTexture}
                    handleCloseLoader={handleCloseLoader}
                    showSlider={showSlider}
                  />
                </div>
                <div className="col-12 col-lg-4 colorvisualiser__container__right mt-3 mt-lg-0">
                  <div className="colorvisualiser__tools_container mb-4">
                    <Card
                      className="border-2 shadow-sm"
                      data-intro="Tools where you can undo , redo , reset , compare, download and share your image"
                      data-step="1"
                    >
                      <Card.Body className="d-flex   justify-content-between align-items-center ">
                        <Button
                          className="colorvisualiser__button"
                          onClick={handleUndo}
                        >
                          <IoIosUndo size={20} />
                        </Button>
                        <Button
                          className="colorvisualiser__button"
                          onClick={handleRedo}
                        >
                          <IoIosRedo size={20} />
                        </Button>
                        <Button
                          className="colorvisualiser__button"
                          onClick={handleReset}
                        >
                          <RxReset size={20} />
                        </Button>
                        <Button
                          className="colorvisualiser__button"
                          onClick={handleShowSlider}
                        >
                          <MdCompare size={20} />
                        </Button>
                        <Button
                          className="colorvisualiser__button"
                          onClick={() => {
                            downloadImage(image!);
                            toast.success("Image Downloaded");
                          }}
                        >
                          <IoIosCloudDownload size={20} />
                        </Button>
                        <Button
                          className="colorvisualiser__button"
                          onClick={shareImage}
                        >
                          <FaShare size={20} />
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="colorvisualiser__color_container mb-4">
                    <Card className="border-2 shadow-sm ">
                      <Card.Title className="text-center fw-bold mt-2">
                        Color Palette
                      </Card.Title>
                      <Card.Body className="d-flex flex-wrap gap-2 justify-content-center align-items-center ">
                        {color ? (
                          <Button
                            className="p-0  colorvisualiser__color_button--active"
                            style={{ backgroundColor: color }}
                            data-intro="Selected Color will be shown here"
                            data-step="2"
                          ></Button>
                        ) : (
                          <FaImage
                            className=" colorvisualiser__color_button"
                            style={{ color: "#000" }}
                            data-intro="Selected Color will be shown here"
                            data-step="2"
                          />
                        )}
                        {colordata.map((color: any, index: number) => {
                          return (
                            <Button
                              className="colorvisualiser__color_button"
                              key={index}
                              style={{ backgroundColor: color.hex }}
                              onClick={() => {
                                setColor(color.hex);
                                toast.success("Color Selected");
                                setTexture(null);
                              }}
                            ></Button>
                          );
                        })}

                        <Button
                          className="colorvisualiser__color_addbutton"
                          onClick={handleShowColorModal}
                          data-intro="You can also add any color from color pallete"
                          data-step="3"
                        >
                          <FontAwesomeIcon icon={faPlus} size="2x" />
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                  <div className="colorvisualiser__texture_container">
                    <Card className="border-2 shadow-sm">
                      <Card.Title className="text-center fw-bold mt-2">
                        Texture
                      </Card.Title>
                      <Card.Body className="d-flex flex-wrap gap-2 justify-content-center align-items-center">
                        <Button
                          className="p-0  border-0"
                          style={{ backgroundColor: "#fff" }}
                        >
                          {texture ? (
                            <Image
                              src={texture.src}
                              className="colorvisualiser__currtexture_button"
                              alt="Texture"
                              width={90}
                              height={90}
                              data-intro="Selected Texture will be shown here"
                              data-step="4"
                            />
                          ) : (
                            <IoMdImage
                              size={90}
                              style={{ color: "#000" }}
                              data-intro="Selected Texture will be shown here"
                              data-step="4"
                            />
                          )}
                        </Button>
                        {texturedata
                          .slice(0, 2)
                          .map((texture: any, index: number) => {
                            return (
                              <Button
                                className="p-0 border-0 colorvisualiser__texture_button"
                                key={index}
                                onClick={() => handleTextureClick(texture)}
                              >
                                <Image
                                  src={texture.url}
                                  alt="Texture"
                                  width={90}
                                  height={90}
                                />
                              </Button>
                            );
                          })}

                        <Button
                          className=" border-0 colorvisualiser__texture_button"
                          onClick={handleShowOffCanvas}
                          data-intro="Have any texture in mind ? You can upload it here"
                          data-step="5"
                        >
                          <FontAwesomeIcon icon={faPlus} size="2x" />
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              show={showShareModal}
              centered
              onHide={handleCloseShareModal}
            >
              <Modal.Body>
                {/* Show loader */}
                {showLoader ? (
                  <div className="d-flex justify-content-center align-items-center fw-bold mt-2">
                    Generating Image URL
                    <div className="spinner-border ms-2 " role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className=" d-flex gap-4 justify-content-center align-items-center">
                      <label className="fw-bold " htmlFor="shareURL">
                        Share URL
                      </label>
                      <div className="colorvisualiser__copylink position-relative">
                        <input
                          id="shareURL"
                          type="text"
                          alt="Share URL"
                          className="form-control d-inline"
                          value={shareURL}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="colorvisualiser__share d-flex gap-2 justify-content-around align-items-center mt-3">
                      <div
                        className="colorvisualiser__share__icon"
                        onClick={() => {
                          window.open(
                            `https://www.facebook.com/sharer/sharer.php?u=${shareURL}`,
                            "_blank"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                      </div>
                      <div
                        className="colorvisualiser__share__icon"
                        onClick={() => {
                          window.open(
                            `https://twitter.com/intent/tweet?url=${shareURL}`,
                            "_blank"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                      </div>
                      <div
                        className="colorvisualiser__share__icon"
                        onClick={() => {
                          window.open(`tg://msg_url?url=${shareURL}`);
                        }}
                      >
                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                      </div>
                      <div
                        className="colorvisualiser__share__icon"
                        onClick={() => {
                          window.open(
                            `https://api.whatsapp.com/send?text=${shareURL}`,
                            "_blank"
                          );
                        }}
                      >
                        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                      </div>
                      <div className="colorvisualiser__share__clipboard">
                        <div
                          className="colorvisualiser__copy_button"
                          onClick={async () => {
                            if (navigator.clipboard) {
                              await navigator.clipboard.writeText(shareURL);
                              toast.success("Copied to Clipboard");
                            }
                          }}
                        >
                          <FontAwesomeIcon icon={faCopy} size="2x" />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Modal.Body>
            </Modal>
            <Modal
              show={showColorModal}
              onHide={handleCloseColorModal}
              centered
            >
              <Modal.Body>
                <div className="fw-bold text-center mb-2">Select Color</div>
                <ColorPicker color={colour} onChange={setColour} />
                <Button
                  className="mt-2 mx-auto d-block"
                  onClick={() => {
                    setColor(colour.hex);
                    setTexture(null);
                    toast.success("Color Selected");
                    handleCloseColorModal();
                  }}
                >
                  Select Color
                </Button>
              </Modal.Body>
            </Modal>
            <Offcanvas
              show={showOffcanvas}
              onHide={handleCloseOffCanvas}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Texture</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Card className="border-2 shadow-sm p-0 ">
                  <Card.Body className="d-flex flex-wrap gap-1 justify-content-center p-1">
                    {texturedata.slice(2).map((texture: any, index: number) => {
                      return (
                        <Button
                          className="p-0 border-0 colorvisualiser__texture_button"
                          key={index}
                          onClick={() => handleTextureClick(texture)}
                        >
                          <Image
                            src={texture.url}
                            alt="Texture"
                            width={90}
                            height={90}
                          />
                        </Button>
                      );
                    })}
                  </Card.Body>
                </Card>
                <div className="uploadimage">
                  <div className=" mt-3 ">
                    <h4 className=" fw-bold">Upload Texture</h4>
                    <div>
                      <ul>
                        <li>Max allowed size 1 MB</li>
                        <li>Will Auto Resize to Default size</li>
                      </ul>
                    </div>
                  </div>
                  <div className="previewimage mt-3 text-center">
                    {textureFile ? (
                      <Image
                        src={textureFile.src}
                        className="img-fluid"
                        alt="Texture"
                        width={300}
                        height={300}
                      />
                    ) : (
                      <FaImage
                        className=" colorvisualiser__color_button"
                        style={{ color: "#000" }}
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    title="Upload Image"
                    ref={textureFileRef}
                    className="mt-3 d-none"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        const image = document.createElement("img");
                        image.src = URL.createObjectURL(file);
                        image.onload = () => {
                          setTextureFile(image);
                        };
                      }
                    }}
                  />
                  <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                    <Button
                      className="mt-3"
                      onClick={async (e) => {
                        textureFileRef.current?.click();
                      }}
                    >
                      <FontAwesomeIcon icon={faUpload} size="1x" /> Upload Image
                    </Button>
                    <Button
                      className="mt-3"
                      onClick={() => {
                        processTexture(textureFile, image).then((texture) => {
                          if (texture instanceof HTMLImageElement) {
                            setTexture(texture);
                            setColor(null);
                            toast.success("Texture Selected");
                            handleCloseOffCanvas();
                          }
                        });
                      }}
                    >
                      Select Texture
                    </Button>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
          </>
        )}
        {showModal && file && (
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            centered
            backdrop="static"
          >
            <Modal.Body>
              <div className="d-flex justify-content-between align-items-center ps-3">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Uploaded Image"
                  width={100}
                  height={100}
                  className="img-fluid"
                />
                <Image
                  src="https://segment-anything.com/assets/arrow-icn.svg"
                  alt="Uploaded Image"
                  width={40}
                  height={100}
                  className="img-fluid"
                />
                <Image
                  src="https://segment-anything.com/assets/icn-nn.svg"
                  width={100}
                  height={100}
                  alt="Neural Network"
                  className="img-fluid"
                />
                <Image
                  src="https://segment-anything.com/assets/arrow-icn.svg"
                  alt="Uploaded Image"
                  width={40}
                  height={80}
                  className="img-fluid"
                />
                <Image
                  src="https://segment-anything.com/assets/stack.svg"
                  width={100}
                  height={10}
                  style={{
                    height: "100px",
                    width: "100px",
                  }}
                  className="img-fluid"
                  alt="Stack"
                />
              </div>
              <div className="d-flex justify-content-center align-items-center fw-bold mt-2">
                Generating Image Embedding
                <div className="spinner-border ms-2 " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
        <Modal show={error != null} centered onHide={() => setError(null)}>
          <Modal.Body>
            <div className="fw-bold fw-capitalize text-center text-danger">
              {error}
            </div>
          </Modal.Body>
        </Modal>
      </div>
      {!file && <Footer />}
    </>
  );
};
export default ColorVisualiser;
