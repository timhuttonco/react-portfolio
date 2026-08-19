import React from "react";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";
import Pagetitle from "../elements/Pagetitle";
import Service from "../elements/Service";

const servicesData = [
  {
    id: 1,
    icon: "images/implementation.svg",
    title: "Analytics & Tracking Audits",
    content:
      "10+ years implementing and auditing GA4, Google Tag Manager and data layer setups, finding broken tracking, duplicate events and misconfigured conversions before they skew every decision built on top of them.",
    color: "#6C6CE5",
    contentColor: "light",
    link: "/services/tagging-tracking-audit",
  },
  {
    id: 2,
    icon: "images/sd-process.svg",
    title: "Marketing Tag & Server-Side Implementation",
    content:
      "Hands-on implementation of Meta, LinkedIn, TikTok and Google tags, plus leading server-side tagging migrations, including directing exactly this migration across Kingfisher's full multi-brand estate.",
    color: "#F9D74C",
    contentColor: "dark",
    link: "/services/marketing-tag-implementation",
  },
  {
    id: 3,
    icon: "images/analytics.svg",
    title: "GDPR & Consent Mode Compliance",
    content:
      "Specialist in privacy-compliant data collection, including Google Consent Mode v2 audits that check consent signals are correctly captured, mapped and respected across GTM and GA4.",
    color: "#F97B8B",
    contentColor: "light",
    link: "/services/gdpr-consent-mode-v2-audit",
  },
  {
    id: 4,
    icon: "images/documentation.svg",
    title: "Custom Dashboards & Monitoring",
    content:
      "Purpose-built dashboards for data quality monitoring and vendor contract/usage tracking, so problems get caught in days rather than discovered three months later in a quarterly report.",
    color: "#72D073",
    contentColor: "light",
    link: "/services/data-quality-dashboards",
  },
  {
    id: 5,
    icon: "images/analytics.svg",
    title: "Data Product Leadership",
    content:
      "Track record owning the full product lifecycle for analytics platforms, from customer discovery and roadmap prioritisation through to launch and adoption, at Kingfisher, YOOX Net-A-Porter and Tealium. Available full-time or as fractional, retained leadership.",
    color: "#6C6CE5",
    contentColor: "light",
    link: "/services/fractional-analytics-leadership",
  },
  {
    id: 6,
    icon: "images/implementation.svg",
    title: "Technical Documentation & Enablement",
    content:
      "Passion and experience for turning complex systems into clear, actionable documentation and processes teams actually use, including being the creator of the Decibel Knowledgebase.",
    color: "#F9D74C",
    contentColor: "dark",
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
          <div className="spacer" data-height="30"></div>
          <RouterLink to="/services" className="btn btn-default">
            View Services
          </RouterLink>
        </div>
      </div>
    </section>
  );
}

export default Services;
