import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "/styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import * as ort from "onnxruntime-web";
import { useEffect, useState } from "react";
import AppContextProvider from "../utils/hooks/context";

export default function App({ Component, pageProps }: AppProps) {
  const [model, setModel] = useState<ort.InferenceSession | null>();
  useEffect(() => {
    const initmodel = async () => {
      const session = await ort.InferenceSession.create(
        "./_next/static/chunks/pages/sam_vit_h_decoder.onnx",
        {
          executionProviders: ["wasm"],
        }
      );

      setModel(session);
    };
    initmodel();
  }, []);
  return (
    <>
      <AppContextProvider>
        <Component {...pageProps} model={model} />
      </AppContextProvider>
    </>
  );
}
