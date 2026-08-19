import React from "react";
import { Link } from "react-router-dom";

// Note: deliberately not wrapped in react-animate-on-scroll's <ScrollAnimation> here.
// That library defaults to opacity:0 until a scroll-triggered visibility check fires,
// and on a short page (like a services list with only a handful of cards, all already
// in the viewport on load) that check can end up never firing, leaving cards invisible
// but still clickable. The parent list already applies an AOS fade-up, so this is skipped
// to avoid stacking two independent reveal animations on top of each other.
function ServiceCard({ serviceData }) {
  const { category, title, image, filesource } = serviceData;
  const getNospaceTitle = (filesource) => {
    let tempArr = filesource.split("/");
    let fileName = tempArr[tempArr.length - 1];
    let getName = fileName.slice(0, -3);
    return getName;
  };

  return (
    <div className="blog-item rounded bg-white shadow-dark">
      <div className="thumb">
        <span className="category">{category}</span>
        <Link to={`/services/${getNospaceTitle(filesource)}`}>
          <img src={image} alt={title} />
        </Link>
      </div>
      <div className="details">
        <h4 className="my-0 title">
          <Link to={`/services/${getNospaceTitle(filesource)}`}>
            {title}
          </Link>
        </h4>
      </div>
    </div>
  );
}

export default ServiceCard;
