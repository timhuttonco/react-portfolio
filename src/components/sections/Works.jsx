import React from "react";
import { Link } from "react-router-dom";
import Portfolio from "../elements/Portfolio";
import Pagetitle from "../elements/Pagetitle";


const allWorks = [
  {
    id: 35,
        title: "Browser Extension: Duplicating Tealium Event Specs",
        image: "/images/works/tealium-event-spec-duplicate2.png",
        filesource: "../portfolio/browser-extension-duplicating-tealium-event-specs.md",
        category: "Projects, Analytics",
    },{
    id: 34,
        title: "Layer Lens v1.2 — Email Privacy Detection",
        image: "/images/works/layer-lens.png",
        filesource: "../portfolio/layer-lens-v1-2.md",
        category: "Projects, Analytics",
    },{
    id: 32,
        title: "Analytics & Tracking Setup — Hatchly",
        image: "/images/works/hatchly.png",
        filesource: "../portfolio/hatchly-analytics-setup.md",
        category: "Consulting, Analytics",
    },
];


function Works() {
  return (
    <section id="blog">
      <div className="container">
        <Pagetitle title="Work &amp; Portfolio" />
        <div className="row blog-wrapper">
          {allWorks.map((worksItem) => (
            <div className="col-md-4" key={worksItem.id}>
              <Portfolio portfolioData={worksItem} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="spacer" data-height="30"></div>
          <Link to="/portfolio" className="btn btn-default">
            Show all work
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Works;
