import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 69,
    title: "Gemini 4 Argon Released",
    image: "/images/blog/gemini-argon.png",
    filesource: "/blogs/gemini-4-argon-released.md",
    date: "October 16, 2026",
    category: "Tech, Analytics",
  },{
    id: 68,
    title: "ChatGPT Stops Tagging Outbound Links",
    image: "/images/blog/chatgpt-phone.png",
    filesource: "/blogs/chatgpt-stops-tagging-outbound-links.md",
    date: "October 15, 2026",
    category: "Tech, Analytics",
  },{
    id: 67,
    title: "Adobe's AI Assistant Can Now Audit Your Data Before You Build on It",
    image: "/images/blog/adobe-cja2.png",
    filesource: "/blogs/adobe-ai-assistant-audit-data-quality.md",
    date: "October 15, 2026",
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
