import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import matter from "gray-matter";
import Header from "../components/layouts/Header";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

function BlogDetails(props) {
  // store both the raw markdown content and the parsed frontmatter data
  const [post, setPost] = useState({ content: "", data: {} });
  const [loading, setLoading] = useState(true);
  const { title } = useParams(); 
  const [toggleMenu, setToggleMenu] = useState(false);

  // domain for absolute image paths
  const siteUrl = "https://timhutton.co"; 

  /**
   * FALLBACK HELPERS
   * These are used only if the Frontmatter (gray-matter) block is missing data.
   */
  const getFirstImage = (mdContent) => {
    if (!mdContent) return null;
    const match = mdContent.match(/!\[.*?\]\((.*?)\)/);
    if (match && match[1]) {
      const imgPath = match[1];
      return imgPath.startsWith('http') ? imgPath : `${siteUrl}${imgPath}`;
    }
    return null;
  };

  const getExcerpt = (mdContent) => {
    if (!mdContent) return "";
    return mdContent
      .replace(/[#*`_]/g, "") 
      .replace(/\[.*\]\(.*\)/g, "")
      .substring(0, 160) + "...";
  };

  useEffect(() => {
    setLoading(true);
    const cleanFileName = title.replace(/^\//, "").replace(/\.md$/, "");
    
    axios.get(`/blogs/${cleanFileName}.md`)
      .then((result) => {
        // Parse the markdown string into { data, content }
        const parsed = matter(result.data);
        setPost(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error at:", `/blogs/${cleanFileName}.md`, err);
        setLoading(false);
      });
  }, [title]);

  const headerToggler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  /**
   * METADATA LOGIC
   * Priority: 1. Frontmatter Data -> 2. Scraped/Generated Data -> 3. Hardcoded Default
   */
  const displayTitle = post.data.title || title.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const description = post.data.description || getExcerpt(post.content) || "Read more at timhutton.co";
  
  // Handle Preview Image
  const rawImage = post.data.image || getFirstImage(post.content);
  const finalPreviewImage = rawImage 
    ? (rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`)
    : `${siteUrl}/images/logo3.png`;

  return (
    <>
      <Helmet>
        {/* Standard SEO */}
        <title>{displayTitle} | Tim Hutton</title>
        <meta name="description" content={description} />

        {/* Facebook / Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={finalPreviewImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={displayTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={finalPreviewImage} />
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
              <div className="text-center">
                <div className="spacer" data-height="100"></div>
                <p>Loading post...</p>
              </div>
            ) : (
              <div className="blog-single shadow-dark p-30">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {post.content}
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