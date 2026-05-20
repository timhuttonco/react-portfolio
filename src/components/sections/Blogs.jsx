import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
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
  },{
    id: 32,
    title: "A Year In Books - 2025",
    image: "/images/blog/a-year-in-books-2025-small.png",
    filesource: "/blogs/a-year-in-books-2025.md",
    date: "February 6, 2026",
    category: "Books",
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