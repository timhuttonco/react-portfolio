import React from "react";
import { Link } from "react-scroll";
import Pagetitle from "../elements/Pagetitle";
import Service from "../elements/Service";

const servicesData = [
  {
    id: 1,
    icon: "images/implementation.svg",
    title: "Technical Implementation",
    content:
      "Expert in implementing SaaS web technologies and building implementation processes, both as a client and a vendor, including using Tealium, Adobe DTM/Launch & Google Tag Manager.",
    color: "#6C6CE5",
    contentColor: "light",
  },
  {
    id: 2,
    icon: "images/sd-process.svg",
    title: "Service Delivery Processes",
    content:
      "Experience building Service Delivery teams from the ground up, including Technical Support, Implementation and Pre-Sales functions.",
    color: "#F9D74C",
    contentColor: "dark",
  },
  {
    id: 3,
    icon: "images/analytics.svg",
    title: "Analytics & UX",
    content:
      "Knowledge and experience of working with, implementing, integrating and analysing analytics and UX platforms such as Google Analytics, Decibel, ContentSquare, Qualtrics and other split-testing and Voice of Customer tools, along with a history of advising a wide-range of clients in effectively improving user experience.",
    color: "#F97B8B",
    contentColor: "light",
  },
  {
    id: 4,
    icon: "images/documentation.svg",
    title: "Technical Documentation",
    content:
      "Passion and experience for writing public and internal technical documentation, along with building technical documentation processes across teams, including being the creator of the Decibel Knowledgebase.",
    color: "#72D073",
    contentColor: "light",
  },
];

function Services() {
  return (
    <section id="services">
      <div className="container">
        <Pagetitle title="Services &amp; Specialities" />
        <div className="row fix-spacing">
          {servicesData.map((service) => (
            <div className="col-md-6" key={service.id}>
              <Service service={service} />
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <p className="mb-0">
            Can I be of help to you?{" "}
            <Link
              className="colorpink pointer"
              to="section-contact"
              spy
              smooth
              duration={500}
            >
              Click here
            </Link>{" "}
            to contact me! 👋
          </p>
        </div>
      </div>
    </section>
  );
}

export default Services;
