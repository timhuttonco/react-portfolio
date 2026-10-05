import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 55,
    title: "BigQuery Adds AI.KEY_DRIVERS and a New Security Center",
    image: "/images/blog/bigquery.png",
    filesource: "/blogs/bigquery-ai-key-drivers-security-center.md",
    date: "October 5, 2026",
    category: "Tech, Analytics",
  },{
    id: 54,
    title: "\"Finally, a Conversions API Setup That Doesn't Require Web Developers\" - Read This Before Acting",
    image: "/images/blog/meta-conversions-api.png",
    filesource: "/blogs/meta-conversions-api-gateway-no-developer.md",
    date: "October 2, 2026",
    category: "Tech, Analytics",
  },{
    id: 53,
    title: "BigQuery's AI Agents, August to September 2026: A Timeline of Access and Guardrails",
    image: "/images/blog/google-sessionstart-issues.png",
    filesource: "/blogs/bigquery-ai-agents-timeline-august-september-2026.md",
    date: "September 22, 2026",
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
