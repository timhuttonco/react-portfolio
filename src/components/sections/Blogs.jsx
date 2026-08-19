import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 42,
    title: "The GA4 session_start Conundrum: How to Work With Impacted Data",
    image: "/images/blog/google-sessionstart-issues.png",
    filesource: "/blogs/google-sessionstart-issues.md",
    date: "August 19, 2026",
    category: "Tech, Analytics",
  },{
    id: 41,
    title: "Layer Lens v1.2: See Exactly Where Your Email Goes in Your Analytics Stack",
    image: "/images/blog/layer-lens.png",
    filesource: "/blogs/layer-lens-v1-2-email-check.md",
    date: "July 8, 2026",
    category: "Tech, Analytics",
  },{
    id: 40,
    title: "Building a Firebase Analytics Error Tracking Dashboard",
    image: "/images/blog/firebase-error-dashboard.png",
    filesource: "/blogs/firebase-error-dashboard.md",
    date: "June 15, 2026",
    category: "Tech, Analytics",
  },
];


function Blogs() {
  return (
    <section id="blog">
      <div className="container">
        <Pagetitle title="Latest Posts" />
        <div className="row blog-wrapper">
          {allBlogs.map((blogItem) => (
            <div className="col-md-4" key={blogItem.id}>
              <Blog blogData={blogItem} />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="spacer" data-height="30"></div>
          <Link to="/blogs" className="btn btn-default">
            Show all blogs
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Blogs;
