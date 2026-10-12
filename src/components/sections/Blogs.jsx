import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 64,
    title: "Adobe's AI Assistant Can Now Audit Your Data Before You Build on It",
    image: "/images/blog/adobe-cja2.png",
    filesource: "/blogs/adobe-ai-assistant-audit-data-quality.md",
    date: "October 15, 2026",
    category: "Tech, Analytics",
  },{
    id: 63,
    title: "Adobe's September CJA Release Roundup",
    image: "/images/blog/adobe-cja.png",
    filesource: "/blogs/adobe-cja-september-release-roundup.md",
    date: "October 13, 2026",
    category: "Tech, Analytics",
  },{
    id: 62,
    title: "Checkout Page Tracking Scripts Disabled on Some Shopify Stores",
    image: "/images/blog/shopify-analytics.png",
    filesource: "/blogs/shopify-checkout-tracking-scripts-disabled.md",
    date: "October 12, 2026",
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
