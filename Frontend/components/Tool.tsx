// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useEffect, useState } from "react";
import AppContext from "../utils/hooks/createContext";
import { ToolProps } from "../utils/helpers/Interfaces";
// @ts-ignore
import * as _ from "underscore";
import Image from "next/image";
import { handleImageScale } from "../utils/helpers/scaleHelper";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
const Tool = (props: any) => {
  const { handleMouseMove } = props;
  const { handleMouseClick } = props;
  const {
    image: [image],
    initialImage: [initialImage],
    maskImg: [maskImg, setMaskImg],
  } = useContext(AppContext)!;

  // Determine if we should shrink or grow the images to match the
  // width or the height of the page and setup a ResizeObserver to
  // monitor changes in the size of the page
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });

  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [image]);
  const imageClasses = "baseImage";
  const maskImageClasses = `maskImage`;
  // Render the image and the predicted mask image on top
  return (
    <div className="position-relative baseimagecontainer">
      {image && (
        <>
          {props.showSlider && (
            <ImgComparisonSlider>
              <Image
                src={image.src}
                slot="first"
                alt="Image"
                width={image.width}
                height={image.height}
                className={`${
                  shouldFitToWidth ? "w-full" : "h-full"
                } ${imageClasses}`}
              ></Image>
              <Image
                src={initialImage!.src}
                alt="Image"
                slot="second"
                width={image.width}
                height={image.height}
                className={`${
                  shouldFitToWidth ? "w-full" : "h-full"
                } ${imageClasses}`}
              ></Image>
            </ImgComparisonSlider>
          )}
          {!props.showSlider && (
            <Image
              data-intro="For PC, You can hover over the image to see the mask and apply Color,Texture by Clicking Once. For mobile, you can tap on the image to see the mask and apply Color,Texture by Double Tapping."
              data-step="6"
              onMouseMove={handleMouseMove}
              onDoubleClick={handleMouseClick}
              onMouseOut={() => _.defer(() => setMaskImg(null))}
              onTouchMove={handleMouseMove}
              src={image.src}
              alt="Image"
              width={image.width}
              height={image.height}
              className={`${
                shouldFitToWidth ? "w-full" : "h-full"
              } ${imageClasses}`}
            ></Image>
          )}
          <div id="applied"></div>
        </>
      )}
      {maskImg && (
        <Image
          src={maskImg.src}
          alt="Mask"
          width={maskImg.width}
          height={maskImg.height}
          className={`${
            shouldFitToWidth ? "w-full" : "h-full"
          } ${maskImageClasses} `}
        ></Image>
      )}
    </div>
  );
};

export default Tool;
