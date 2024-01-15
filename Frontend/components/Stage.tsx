// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext } from "react";
/* @ts-ignore */
import * as _ from "underscore";
import Tool from "./Tool";
import { modelInputProps } from "../utils/helpers/Interfaces";
import AppContext from "../utils/hooks/createContext";

const Stage = (props: any) => {
  const {
    clicks: [, setClicks],
    image: [image],
    maskImg: [maskImg],
    color: [color],
    texture: [texture],
  } = useContext(AppContext)!;

  const getClick = (x: number, y: number): modelInputProps => {
    const clickType = 1;
    return { x, y, clickType };
  };

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;
    const click = getClick(x, y);
    if (click) setClicks([click]);
  }, 15);

  // On click of the image, get the mouse position and scale the (x, y)
  // coordinates back to the natural scale of the image. Update the state of
  // clicks with setClicks to trigger the ONNX model to run and generate a new
  // mask via a useEffect in App.tsx and also apply the color to the mask
  const handleMouseClick = (e: any) => {
    handleMouseMove(e);
    // apply color to mask
    if (!maskImg) return;
    if (texture) props.applyTexture(image, maskImg, texture);
    else if (color) props.applyColor(image, maskImg, color);
  };
  const flexCenterClasses = "flex items-center justify-center";
  return (
    <div className={`${flexCenterClasses} w-full h-full`}>
      <div className={`${flexCenterClasses} relative w-[90%] h-[90%]`}>
        <Tool
          handleMouseMove={handleMouseMove}
          handleMouseClick={handleMouseClick}
          showSlider={props.showSlider}
        />
      </div>
    </div>
  );
};

export default Stage;
