import Image from "next/image";
import { Inter } from "next/font/google";
import { Parallax } from "react-parallax";
import { Container, Row } from "react-bootstrap";
import * as ort from "onnxruntime-web";
import { useEffect, useState } from "react";
import imgdata from "../utils/imgdata";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import Testimonials from "../components/Testimonials/Testimonials";
import testimonialdata from "../utils/testimonialdata.json";
import HindiLogo from "../assets/Hindilogo.png";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home(props: any) {
  return (
    <>
      <NavBar />
      <Container fluid className="p-0">
        <Parallax
          className="parallax-container"
          bgImage="../images/sofa.jpg"
          strength={500}
        >
          <Container className="parallax-text">
            <Container className="parallax-title text-center">
              <Image src={HindiLogo} alt="Hindi Logo" />
            </Container>
          </Container>
        </Parallax>
        <Container fluid className="features-list py-5 text-center ">
          <Container className="col-md-10 mx-auto px-4">
            <h1 className="text-center projects-title">
              Welcome to the new era of product visualization
            </h1>
            <h3>
              Revolutionizing the way retailers and manufacturers sell finishing
              and home decor products with cutting-edge product
              visualization tools.
            </h3>
          </Container>
        </Container>
        <Container fluid className="projects-list">
          <h1 className="text-center projects-title">Our projects</h1>
          <Row lg={1} className="justify-content-center">
            {imgdata.map((img) => (
              <ProjectItem key={img.key} title={img.title} img={img.img} />
            ))}
          </Row>
        </Container>

        {/* <WallPaint /> */}

        <Testimonials testimonialData={testimonialdata} />
      </Container>
      <Footer />
    </>
  );
}
