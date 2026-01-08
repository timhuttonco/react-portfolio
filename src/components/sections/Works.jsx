import React from "react";
import { Link } from "react-router-dom";
import Portfolio from "../elements/Portfolio";
import Pagetitle from "../elements/Pagetitle";


const allWorks = [
  {
    id: 27,
        title: "The Good Growth Podcast",
        image: "/images/works/good-growth-podcast.png",
        filesource: "../portfolio/good-growth-podcast.md",
        category: "Podcasts",
    },{
    id: 26,
        title: "Senior Analytics Implementation Manager at YOOX Net-A-Porter",
        image: "/images/works/ynap.png",
        filesource: "../portfolio/ynap-analytics-implementation.md",
        category: "Career",
    },{
      id: 25,
          title: "Consultant at Higher Oak Consulting",
          image: "/images/works/higher-oak.png",
          filesource: "../portfolio/higher-oak-consulting.md",
          category: "Career, Consulting",
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
