// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useState } from "react";
import { modelInputProps } from "../helpers/Interfaces";
import AppContext from "./createContext";

const AppContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [clicks, setClicks] = useState<Array<modelInputProps> | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null);
  const [color, setColor] = useState<string | null>("#121212");
  const [error, setError] = useState<string | null>(null);
  const [texture, setTexture] = useState<HTMLImageElement | null>(null);
  const [initialImage, setInitialImage] = useState<HTMLImageElement | null>(
    null
  );
  return (
    <AppContext.Provider
      value={{
        clicks: [clicks, setClicks],
        image: [image, setImage],
        initialImage: [initialImage, setInitialImage],
        maskImg: [maskImg, setMaskImg],
        color: [color, setColor],
        error: [error, setError],
        texture: [texture, setTexture],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
