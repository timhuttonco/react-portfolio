import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.min.css";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import Header from "../components/layouts/Header";
import { useParams } from "react-router-dom";


function WorkDetails(props) {
  const [content, setContent] = useState("");
  const params = useParams();
  const { id } = useParams();
  const [blogData, setBlogData] = useState(null);
  const { title } = useParams(); // 'title' must match the :title in your App.jsx route
  const workFile = title;

  useEffect(() => {
  // 1. Remove any leading slashes or .md extensions from the variable
  // to prevent doubling if the data already includes them.
  const cleanFileName = workFile.replace(/^\//, "").replace(/\.md$/, "");

  // 2. Use an absolute path from the root (starting with /)
  axios.get(`/portfolio/${cleanFileName}.md`)
    .then((result) => {
      setContent(result.data);
    })
    .catch((err) => {
      console.error("Fetch error at:", `/portfolio/${cleanFileName}.md`, err);
    });
}, [workFile]);

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

export default WorkDetails;
