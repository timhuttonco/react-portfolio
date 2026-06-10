import React from "react";
import { Link } from "react-router-dom";
import Portfolio from "../elements/Portfolio";
import Pagetitle from "../elements/Pagetitle";


const allWorks = [
  {
    id: 28,
        title: "Layer Lens — Chrome Extension",
        image: "/images/works/layer-lens.png",
        filesource: "../portfolio/layer-lens.md",
        category: "Projects, Analytics",
    },{
    id: 29,
        title: "World Cup Sweepstake Generator",
        image: "/images/works/world-cup-sweepstake.png",
        filesource: "../portfolio/world-cup-sweepstake.md",
        category: "Projects",
    },{
    id: 27,
        title: "The Good Growth Podcast",
        image: "/images/works/good-growth-podcast.png",
        filesource: "../portfolio/good-growth-podcast.md",
        category: "Podcasts",
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
