import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 38,
    title: "Introducing Layer Lens: Search Your GTM & GA4 Data in Real Time",
    image: "/images/blog/layer-lens.png",
    filesource: "/blogs/layer-lens-chrome-extension.md",
    date: "June 8, 2026",
    category: "Tech, Analytics",
  },{
    id: 37,
    title: "How to Deploy a Firebase Website as an App on Your iPhone",
    image: "/images/blog/firebase-web.png",
    filesource: "/blogs/firebase-pwa-iphone.md",
    date: "June 6, 2026",
    category: "Tech",
  },{
    id: 36,
    title: "How to Secure Gemini API Keys in Google Cloud & Firebase",
    image: "/images/blog/securing-gemini-api-keys-in-firebase.png",
    filesource: "/blogs/securing-gemini-api-keys-in-firebase.md",
    date: "May 27, 2026",
    category: "Tech, AI",
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