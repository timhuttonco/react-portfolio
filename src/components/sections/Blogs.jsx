import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 47,
    title: "Google Analytics Now Has Native, Drag-and-Drop Dashboards",
    image: "/images/blog/ga_dashboard1.png",
    filesource: "/blogs/google-analytics-native-drag-and-drop-dashboards.md",
    date: "September 10, 2026",
    category: "Tech, Analytics",
  },{
    id: 46,
    title: "ChatGPT Ads Expand to Europe, With a New Measurement Pixel and Conversions API",
    image: "/images/blog/open-ai-ads.jpg",
    filesource: "/blogs/chatgpt-ads-europe-expansion.md",
    date: "August 26, 2026",
    category: "Tech, Analytics",
  },{
    id: 45,
    title: "BigQuery Pipelines Can Now Document Themselves",
    image: "/images/blog/google-sessionstart-issues.png",
    filesource: "/blogs/bigquery-pipelines-self-documenting.md",
    date: "August 25, 2026",
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
