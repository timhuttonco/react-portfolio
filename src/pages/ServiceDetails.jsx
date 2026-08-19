import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import matter from "gray-matter";
import Header from "../components/layouts/Header";
import ServiceContactForm from "../components/elements/ServiceContactForm";
import { useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

function ServiceDetails(props) {
  const [post, setPost] = useState({ content: "", data: {} });
  const [loading, setLoading] = useState(true);
  const { title } = useParams();
  const [toggleMenu, setToggleMenu] = useState(false);

  const siteUrl = "https://timhutton.co";

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

    axios.get(`/services/${cleanFileName}.md`)
      .then((result) => {
        const parsed = matter(result.data);
        setPost(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error at:", `/services/${cleanFileName}.md`, err);
        setLoading(false);
      });
  }, [title]);

  const headerToggler = (e) => {
    e.preventDefault();
    setToggleMenu(!toggleMenu);
  };

  document.addEventListener("click", function (e) {
    if (e.target.closest(".content")) {
      setToggleMenu(false);
    }
  });

  const displayTitle = post.data.title || title.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const description = post.data.description || getExcerpt(post.content) || "Read more at timhutton.co";
  const rawImage = post.data.image;
  const finalPreviewImage = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${siteUrl}${rawImage}`)
    : `${siteUrl}/images/logo3.png`;

  return (
    <>
      <Helmet>
        <title>{displayTitle} | Tim Hutton</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={finalPreviewImage} />

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
                <p>Loading service...</p>
              </div>
            ) : (
              <>
                <div className="blog-single shadow-dark p-30">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
                <ServiceContactForm serviceName={displayTitle} />
              </>
            )}
          </div>
        </div>
        <div className="spacer" data-height="96"></div>
      </main>
    </>
  );
}

export default ServiceDetails;
