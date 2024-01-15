import React from "react";
import Link from "next/link";

import { Parallax } from "react-parallax";
import { Row, Container, Image } from "react-bootstrap";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
function About() {
  return (
    <>
      <NavBar />
      <Container fluid className="p-0">
        <Parallax
          className="parallax-container"
          bgImage="../images/about.jpg"
          strength={600}
        >
          <Container className="parallax-text">
            <Container className="parallax-title text-center">
              <h1 className="text-center projects-title">About Us</h1>
            </Container>
          </Container>
        </Parallax>
        <Container className="col-lg-10 mx-auto px-4  my-5 ">
          <p className="lead about-text">
            We specialize in Residential Condos, Townhomes, Duplexes and Single
            Detached home design, remodels and renovations. Interior Design
            Studio is a unique company that combines both Interior Design and
            Project Management (same role as General Contractor) expertise under
            one roof. By specializing in both the design and build role we are
            able to provide a single point of contact which helps eliminate
            miscommunication between multiple professionals and ultimately
            providing a simple, streamlined experience for our clients. Our
            approach also allows us to take full ownership of every aspect of
            the project from the Design/planning, Budgeting/bid, Scheduling and
            Construction Management which results in the most effective
            execution.
          </p>
          <Link
            className="btn btn-secondary btn-lg contact-button"
            href="/contact"
          >
            Contact us for a free estimate
          </Link>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default About;
