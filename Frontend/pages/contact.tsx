import React from "react";
import { Container } from "react-bootstrap";
import { useState } from "react";
import { init, send } from "emailjs-com";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";

function Contact() {
  const USER_ID = process.env.REACT_APP_USER_ID;
  // init(USER_ID);
  const SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
  const TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;

  const [toSend, setToSend] = useState({
    user_name: "",
    user_email: "",
    user_message: "",
    user_number: "",
  });

  const handleChange = (event: any) => {
    setToSend({
      ...toSend,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    // send(SERVICE_ID, TEMPLATE_ID, toSend, USER_ID)
    //   .then((response) => {
    //     console.log("SUCCESS!", response.status, response.text);
    //   })
    //   .catch((err) => {
    //     console.log("FAILED...", err);
    //   });
    // setToSend({
    //   user_name: "",
    //   user_email: "",
    //   user_message: "",
    // });
    alert("Message sent!");
  };
  return (
    <>
      <NavBar />
      <Container fluid className="p-0 py-4 ">
        <h2 className="contact-subtitle text-center">
          Any questions? Contact us!
        </h2>

        <Container className=" contact-form col-md-8">
          <form className="needs-validation " onSubmit={onSubmit} noValidate>
            <Container className="mb-3">
              <label htmlFor="validationCustom01" className="form-label p-text">
                Name{" "}
              </label>
              <input
                type="text"
                name="user_name"
                className="form-control"
                id="validationCustom01"
                value={toSend.user_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </Container>
            <Container className="mb-3">
              <label htmlFor="validationCustom02" className="form-label p-text">
                Email address
              </label>
              <input
                type="email"
                name="user_email"
                className="form-control"
                id="validationCustom02"
                value={toSend.user_email}
                onChange={handleChange}
                placeholder="abc@xyz.com"
                required
              />
            </Container>
            <Container className="mb-3">
              <label htmlFor="validationCustom03" className="form-label p-text">
                Mobile Number
              </label>
              <input
                type="text"
                name="user_number"
                className="form-control"
                id="validationCustom03"
                value={toSend.user_number}
                onChange={handleChange}
                placeholder="10 digit mobile number"
                required
              />
            </Container>
            <Container className="mb-3">
              <label htmlFor="validationCustom04" className="form-label p-text">
                Message
              </label>
              <textarea
                name="user_message"
                className="form-control"
                id="validationCustom04"
                value={toSend.user_message}
                onChange={handleChange}
                rows={3}
                required
              />
            </Container>
            <button
              type="submit"
              className="btn btn-secondary btn-lg px-5 m-2 me-sm-3"
            >
              Send
            </button>
          </form>
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default Contact;
