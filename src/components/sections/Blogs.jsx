import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 45,
    title: "BigQuery Pipelines Can Now Document Themselves",
    image: "/images/blog/google-sessionstart-issues.png",
    filesource: "/blogs/bigquery-pipelines-self-documenting.md",
    date: "August 25, 2026",
    category: "Tech, Analytics",
  },{
    id: 44,
    title: "Merchant Center Is Redefining 'Organic Traffic' on August 24",
    image: "/images/blog/merchant-center.jpg",
    filesource: "/blogs/merchant-center-redefining-organic-traffic.md",
    date: "August 21, 2026",
    category: "Tech, Analytics",
  },{
    id: 43,
    title: "The App Tracking Transparency Prompt Was Never Neutral. Germany Just Made Apple Prove It.",
    image: "/images/blog/germany-att-prompt-result.jpg",
    filesource: "/blogs/germany-forces-apple-att-redesign.md",
    date: "August 20, 2026",
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
