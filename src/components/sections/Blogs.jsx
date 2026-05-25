import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 35,
    title: "Automate Server-Side Google Tag Manager Updates on Cloud Run",
    image: "/images/blog/google-tag-manager-cloud-run.png",
    filesource: "/blogs/automate-sgtm-cloud-run-updates.md",
    date: "May 25, 2026",
    category: "Tech, Analytics",
  },
  {
    id: 34,
    title: "Updating Google Tag Manager Server Side Tagging Servers",
    image: "/images/blog/google-tag-manager-cloud-run.png",
    filesource: "../updating-sgtm-tagging-server-version.md",
    date: "May 20, 2026",
    category: "Tech, Analytics",
  },{
    id: 33,
    title: "Deploying Websites Using Firebase",
    image: "/images/blog/firebase-web.png",
    filesource: "/blogs/deploying-firebase-websites.md",
    date: "February 16, 2026",
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