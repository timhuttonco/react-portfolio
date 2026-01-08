import React from "react";
import Pagetitle from "../elements/Pagetitle";
import Timeline from "../elements/Timeline";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, } from '@fortawesome/free-brands-svg-icons';
import { faBriefcase, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab, faBriefcase, faGraduationCap)

const educationData = [
  {
    id: 1,
    title: "Google",
    content:
      "Google Analytics 4 Certification, Google Ads - Measurement Certification, Google Analytics for Power Users, Advanced Google Analytics, Google Tag Manager Fundamentals, Google Analytics for Beginners",
  },{
    id: 2,
    title: "Google Cloud Computing Fundamentals",
    content:
      "Cloud Computing Fundamentals, Infrastructure in Google Cloud, Networking and Security in Google Cloud, Data, ML, and AI in Google Cloud",
  },
  {
    id: 3,
    title: "Tealium",
    content:
      "iQ Technical User Certification, AudienceStream and DataAccess Advanced User Certification, iQ Advanced User Certification, iQ Basic User Certification, AudienceStream Basic Certification",
  },
  {
    id: 4,
    title: "Mental Health First Aid (MHFA) England",
    content:
      "Mental Health First Aider",
  },{
    id: 5,
    title: "Contentsquare",
    content:
      "Contentsquare Fundamentals",
  },
  {
    id: 6,
    title: "Quantum Metric",
    content:
      "Continuous Product Design (CPD) Foundations Certification",
  },
  {
    id: 7,
    title: "Leeds Metropolitan University",
    content:
      "Bachelor of Science (BSc) - Computing",
  },
];

const experienceData = [
  {
    id: 9,
    title: "Product Manager - Tagging & Implementation",
    years: "February 2024 - Present",
    content:
      "Kingfisher plc",
  },{
    id: 8,
    title: "Consultant",
    years: "October 2022 - Present",
    content:
      "Higher Oak Consulting",
  },{
    id: 7,
    title: "Senior Analytics Implementation Manager",
    years: "August 2021 - February 2024",
    content:
      "YOOX Net-A-Porter",
  },{
    id: 6,
    title: "Mentor",
    years: "April 2022 - August 2022",
    content:
      "Multiverse",
  },{
    id: 5,
    title: "Implementation Engineer Manager EMEA",
    years: "February 2020 - August 2021",
    content:
      "Tealium",
  },
  {
    id: 4,
    title: "Service Delivery Lead",
    years: "August 2018 - January 2020",
    content:
      "Decibel",
  },
  {
    id: 3,
    title: "Senior Solutions Engineer",
    years: "October 2017 - August 2018",
    content:
      "Decibel",
  },
  {
    id: 2,
    title: "Solutions Engineer",
    years: "June 2016 - October 2017",
    content:
      "Decibel",
  },
  {
    id: 1,
    title: "Technical Lead",
    years: "November 2014 - June 2016",
    content:
      "Decibel",
  },
];

function Experiences() {
  return (
    <section id="experience">
      <div className="container">
        <Pagetitle title="Experience &amp; Certifications" />
        <div className="row">
          <div className="col-md-6">
          <div className="timeline exp bg-white rounded shadow-dark padding-30 overflow-hidden">
          <h3><FontAwesomeIcon icon="briefcase" />&nbsp; Experience</h3>
              {experienceData.map((experience) => (
                <Timeline key={experience.id} education={experience} />
              ))}
            </div>
          </div>

          <div className="col-md-6">
            <div className="spacer d-md-none d-lg-none" data-height="30"></div>
            <div className="timeline edu bg-white rounded shadow-dark padding-30 overflow-hidden">
            <h3><FontAwesomeIcon icon="graduation-cap" />&nbsp; Certifications</h3>
              {educationData.map((education) => (
                <Timeline key={education.id} education={education} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Experiences;
