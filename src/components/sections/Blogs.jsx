import React from "react";
import { Link } from "react-router-dom";
import Blog from "../elements/Blog";
import Pagetitle from "../elements/Pagetitle";


const allBlogs = [
  {
    id: 32,
    title: "A Year In Books - 2025",
    image: "/images/blog/a-year-in-books-2025-small.png",
    filesource: "/blogs/a-year-in-books-2025.md",
    date: "February 6, 2026",
    category: "Books",
  },{
    id: 31,
    title: "Calcio In Italia - Travelling from the UK to Italy to watch football: A Guide",
    image: "/images/blog/calcio-in-italia.png",
    filesource: "../calcio-in-italia.md",
    date: "July 23, 2025",
    category: "Sport, Travel",
  },{
    id: 30,
    title: "A Year In Books - 2024",
    image: "/images/blog/a-year-in-books-2024.png",
    filesource: "../blogs/a-year-in-books-2024.md",
    date: "January 7, 2025",
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