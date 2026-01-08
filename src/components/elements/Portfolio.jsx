import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import { Link } from "react-router-dom";

function Portfolio({ portfolioData }) {
  const { category, title, image, filesource } = portfolioData;
  const getNospaceTitle = (filesource) => {
    let tempArr = filesource.split("/");
    let fileName = tempArr[tempArr.length - 1];
    let getName = fileName.slice(0, -3);
    return getName;
  };

  return (
    <ScrollAnimation
      animateIn="fadeInUp"
      animateOut="fadeInOut"
      animateOnce={true}
    >
    <div className="blog-item rounded bg-white shadow-dark">
        <div className="thumb">
          <Link to={`/portfolio/${getNospaceTitle(filesource)}`}>
          <span className="category">{category}</span>
            <img src={image} alt="blog-title" />
          </Link>
        </div>
        <div className="details">
          <h4 className="my-0 title">
            <Link
              to={`/portfolio/${getNospaceTitle(filesource)}`}
            >
              {title}
            </Link>
          </h4>
          <ul className="list-inline meta mb-0 mt-2">
          </ul>
        </div>
      </div>
      </ScrollAnimation>
  );
}

export default Portfolio;