import React from "react";
import Pagetitle from "../elements/Pagetitle";
import { Link } from "react-router-dom";

const aboutContent = {
  name: "Tim Hutton",
  avatarImage: "/images/av-2.png",
  content:
    "I'm the Founder & Director of Bird & Bear Group, the consultancy I built to help businesses cut through messy data and put it to work properly. I'm a data product leader with 10+ years of experience building analytics products at the intersection of engineering and commercial strategy, owning the full product lifecycle from customer discovery and roadmap prioritisation through to launch and adoption, with a track record of turning complex data ecosystems into scalable, user-facing platforms that drive measurable business outcomes. I'm just as hands-on as I am strategic: I implement tracking directly in GA4 and Google Tag Manager, migrate stacks to server-side tagging, and build on Google Cloud infrastructure myself rather than just directing it from a roadmap. I have deep technical fluency across GA4, GCP, BigQuery and Python, paired with a proven ability to translate data complexity into clear narratives that move C-suite and cross-functional teams to action. I specialise in attribution modelling, marketing analytics, data quality and privacy-compliant data collection, equally comfortable in the weeds of an anomaly detection script as I am presenting measurement strategy to senior leadership.",
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