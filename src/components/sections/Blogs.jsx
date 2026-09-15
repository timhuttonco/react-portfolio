import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 49,
    title: "Google Is Testing Payments to Publishers for Content Used in AI Answers",
    image: "/images/blog/ai-contribution-pilot.png",
    filesource: "/blogs/google-ai-contribution-pilot-publisher-payments.md",
    date: "September 15, 2026",
    category: "Tech, Analytics",
  },{
    id: 48,
    title: "Exploring Databricks' Lakehouse Industry Data Models",
    image: "/images/blog/databricks-lakehouse-model.png",
    filesource: "/blogs/databricks-lakehouse-industry-data-models.md",
    date: "September 14, 2026",
    category: "Tech, Analytics",
  },{
    id: 47,
    title: "Google Analytics Now Has Native, Drag-and-Drop Dashboards",
    image: "/images/blog/ga_dashboard1.png",
    filesource: "/blogs/google-analytics-native-drag-and-drop-dashboards.md",
    date: "September 10, 2026",
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
