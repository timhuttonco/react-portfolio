import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import Header from "../components/layouts/Header";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

function BlogDetails(props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { title } = useParams(); 
  const blogFile = title;
  const [toggleMenu, setToggleMenu] = useState(false);

  // Helper to extract a plain text description from Markdown
  const getExcerpt = (mdContent) => {
    if (!mdContent) return "";
    // Remove Markdown symbols and take the first 160 characters
    return mdContent
      .replace(/[#*`_]/g, "") 
      .replace(/\[.*\]\(.*\)/g, "")
      .substring(0, 160) + "...";
  };

  useEffect(() => {
    setLoading(true);
    const cleanFileName = blogFile.replace(/^\//, "").replace(/\.md$/, "");
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

  const headerToggler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  // Format the title for the browser tab (e.g., "my-blog-post" -> "My Blog Post")
  const displayTitle = title ? title.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Blog Details";

  return (
    <>
      <Helmet>
        {/* Standard SEO */}
        <title>{displayTitle} | Your Site Name</title>
        <meta name="description" content={getExcerpt(content)} />

        {/* Facebook / Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={getExcerpt(content)} />
        <meta property="og:url" content={window.location.href} />
        {/* Note: You might want a default og:image if your MD doesn't have one */}
        <meta property="og:image" content="https://yourdomain.com/images/blog-share-default.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={getExcerpt(content)} />
      </Helmet>

      <Header
        logoSource="/images/logo.svg"
        toggleMenu={toggleMenu}
        headerToggler={headerToggler}
      />
      <main className={toggleMenu ? "content open" : "content"}>
        <div className="spacer" data-height="96"></div>
        <div className="blog-page-section">
          <div className="container">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="blog-single shadow-dark p-30">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        <div className="spacer" data-height="96"></div>
      </main>
    </>
  );
}

export default BlogDetails;