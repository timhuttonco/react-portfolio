import React from "react";
import Pagetitle from "../elements/Pagetitle";
import { Link } from "react-router-dom";

const aboutContent = {
  name: "Tim Hutton",
  avatarImage: "/images/av-2.png",
  content:
    "As a Tagging & Implementation Product Manager and Consultant, I have 10+ years of experience in building best-in-class analytics tracking and reporting across websites and apps. In an ever-changing privacy and technology landscape, I pride myself, and the teams I work with, on using and implementing future-proof solutions and technologies, always with user privacy in mind. With my extensive knowledge on both the client and vendor side of businesses, I can bring a strategic mindset to help the growth of businesses using data-driven decisioning.",
};

function About() {
  return (
    <section id="about">
      <div className="container">
        <Pagetitle title="About Me" />
        <div className="row">
          <div className="col-md-3">
            <div className="text-center text-md-left">
              <img src={aboutContent.avatarImage} alt={aboutContent.name} />
            </div>
            <div className="spacer d-md-none d-lg-none" data-height="30"></div>
          </div>

          <div className="col-md-9 triangle-left-md triangle-top-sm">
            <div className="rounded bg-white shadow-dark padding-30">
              <div className="row">
                <div className="col-md-12">
                  <p>{aboutContent.content}</p>
                  <div className="mt-3">
                    <Link to="portfolio">
                    <button className="btn btn-default">
                      View my portfolio
                    </button>
                    </Link>
                  </div>
                  <div
                    className="spacer d-md-none d-lg-none"
                    data-height="30"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;