import React from "react";
import { Container } from "react-bootstrap";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/NavBar/NavBar";
import { ToastContainer, toast } from "react-toastify";

function Contact() {
  const USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USERID;
  // init(USER_ID);
  const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICEID;
  const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATEID;

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
    if (
      SERVICE_ID === undefined ||
      TEMPLATE_ID === undefined ||
      USER_ID === undefined
    ) {
      return;
    }
    //validate email
    const email = toSend.user_email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email!");
      return;
    }
    //validate mobile number
    const mobile = toSend.user_number;
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error("Invalid mobile number!");
      return;
    }

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, toSend, USER_ID)
      .then((response) => {
        toast.success("Message sent!");
      })
      .catch((err) => {
        console.log("FAILED...", err);
        toast.error("Message not sent!");
      });

    setToSend({
      user_name: "",
      user_email: "",
      user_message: "",
      user_number: "",
    });
  };
  return (
    <>
      <NavBar />

      <Container fluid className="p-0 py-4 ">
        <h2 className="contact-subtitle text-center">
          Any questions? Contact us!
        </h2>

        <Container className=" contact-form col-md-8">
          <form className="needs-validation " noValidate>
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
              onClick={onSubmit}
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
