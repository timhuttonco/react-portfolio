import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 53,
    title: "BigQuery's AI Agents, August to September 2026: A Timeline of Access and Guardrails",
    image: "/images/blog/google-sessionstart-issues.png",
    filesource: "/blogs/bigquery-ai-agents-timeline-august-september-2026.md",
    date: "September 22, 2026",
    category: "Tech, Analytics",
  },{
    id: 52,
    title: "Google Adds Diagnostics, a New Uplift Metric and Meridian Integration to Data Manager",
    image: "/images/blog/google-ads-data-manager.png",
    filesource: "/blogs/google-data-manager-diagnostics-uplift-meridian.md",
    date: "September 21, 2026",
    category: "Tech, Analytics",
  },{
    id: 51,
    title: "How to Build a Data Agent in BigQuery Conversational Analytics",
    image: "/images/blog/bigquery-conversational6.png",
    filesource: "/blogs/how-to-build-a-data-agent-in-bigquery-conversational-analytics.md",
    date: "September 16, 2026",
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
