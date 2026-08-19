import React, { useState } from "react";
import emailjs from "@emailjs/browser";

// Reuses the same EmailJS project as the main contact form (see .env.example).
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Reused across service, portfolio, and blog detail pages — `serviceName` is passed
// as whichever title is relevant (service/portfolio piece/article) and is included in
// the email so it's clear which page the enquiry came from. `heading` and
// `defaultMessage` let each page type use wording appropriate to it.
function ServiceContactForm({
  serviceName,
  heading = "Interested in this service? Get in touch",
  defaultMessage,
}) {
  const initialMessage = defaultMessage || `I'm interested in the ${serviceName} — please get in touch.`;

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    message: initialMessage,
  });

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (event) => {
    setFormdata({
      ...formdata,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (!formdata.name) {
      setError(true);
      setMessage("Name is required");
    } else if (!formdata.email) {
      setError(true);
      setMessage("Email is required");
    } else if (!formdata.message) {
      setError(true);
      setMessage("Message is required");
    } else if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      setError(true);
      setMessage("This form isn't configured yet — EmailJS keys are missing. See .env.example.");
    } else {
      setError(false);
      setSending(true);
      emailjs
        .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, event.target, {
          publicKey: EMAILJS_PUBLIC_KEY,
        })
        .then(() => {
          setSending(false);
          setError(false);
          setMessage("Thanks — your message has been sent! I'll reply to you very shortly.");
          setFormdata({
            name: "",
            email: "",
            message: initialMessage,
          });
        })
        .catch((err) => {
          setSending(false);
          setError(true);
          setMessage("Sorry, something went wrong sending your message. Please try emailing me directly instead.");
          console.error("EmailJS error:", err);
        });
    }
  };

  const handleAlerts = () => {
    if (error && message) {
      return <div className="alert alert-danger mt-4">{message}</div>;
    } else if (!error && message) {
      return <div className="alert alert-success mt-4">{message}</div>;
    } else {
      return null;
    }
  };

  return (
    <div className="rounded bg-white shadow-dark padding-30 mt-5">
      <h3 className="mb-3 mt-0">{heading}</h3>
      <p>
        Fill in the form below and I'll get back to you shortly — or email me directly at{" "}
        <a href="mailto:me@timhutton.co">me@timhutton.co</a> 👋
      </p>
      <form className="contact-form mt-4" onSubmit={submitHandler} method="POST">
        {/* Lets the email show exactly which service/page this enquiry came from */}
        <input type="hidden" name="service_name" value={serviceName} />
        <input type="hidden" name="page_url" value={typeof window !== "undefined" ? window.location.href : ""} />
        <div className="row">
          <div className="column col-md-6">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Your name"
                onChange={handleChange}
                value={formdata.name}
              />
            </div>
          </div>

          <div className="column col-md-6">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Email address"
                onChange={handleChange}
                value={formdata.email}
              />
            </div>
          </div>

          <div className="column col-md-12">
            <div className="form-group">
              <textarea
                name="message"
                className="form-control"
                rows="4"
                placeholder="Message"
                onChange={handleChange}
                value={formdata.message}
              ></textarea>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-default" disabled={sending}>
          {sending ? "Sending..." : "Get in Touch"}
        </button>
      </form>
      {handleAlerts()}
    </div>
  );
}

export default ServiceContactForm;
