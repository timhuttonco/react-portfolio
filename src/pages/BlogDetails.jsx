import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import Header from "../components/layouts/Header";
import { useParams } from "react-router-dom";

function BlogDetails(props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const { title } = useParams(); // 'title' must match the :title in your App.jsx route
  const blogFile = title;

  useEffect(() => {
  setLoading(true);
  // 1. Remove any leading slashes or .md extensions from the variable
  // to prevent doubling if the data already includes them.
  const cleanFileName = blogFile.replace(/^\//, "").replace(/\.md$/, "");
  // 2. Use an absolute path from the root (starting with /)
  axios.get(`/blogs/${cleanFileName}.md`)
    .then((result) => {
      setContent(result.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error at:", `/blogs/${cleanFileName}.md`, err);
      setLoading(false);
    });
}, [blogFile]);
    

  const [toggleMenu, setToggleMenu] = useState(false);

  const headerToggler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  document.addEventListener("click", function (e) {
    if (e.target.closest(".content")) {
      setToggleMenu(false);
    }
  });

  return (
    <>
      <Header
        logoSource="/images/logo.svg"
        toggleMenu={toggleMenu}
        headerToggler={headerToggler}
      />
      <main className={toggleMenu ? "content open" : "content"}>
        <div className="spacer" data-height="96"></div>
        <div className="blog-page-section">
          <div className="container">
            <div className="blog-single shadow-dark p-30">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}
                children={content}
              ></ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="spacer" data-height="96"></div>
      </main>
    </>
  );
}

export default BlogDetails;
