import React, { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.min.css";
import { Helmet } from 'react-helmet-async';
import Header from "../components/layouts/Header";
import ServiceCard from "../components/elements/ServiceCard";
import Pagination from "../components/elements/Pagination";

const allServices = [
  {
    id: 1,
    title: "Tagging & Tracking Audit",
    image: "/images/services/tagging-tracking-audit.svg",
    filesource: "/services/tagging-tracking-audit.md",
    category: "Audit",
  },{
    id: 9,
    title: "Data Product Manager / Product Owner",
    image: "/images/services/data-product-manager.svg",
    filesource: "/services/data-product-manager.md",
    category: "Product",
  },{
    id: 2,
    title: "GDPR / Consent Mode V2 Compliance Audit",
    image: "/images/services/gdpr-consent-mode-v2-audit.svg",
    filesource: "/services/gdpr-consent-mode-v2-audit.md",
    category: "Compliance",
  },{
    id: 10,
    title: "CDP / Tealium AudienceStream Engineering",
    image: "/images/services/cdp-tealium-audiencestream-engineering.svg",
    filesource: "/services/cdp-tealium-audiencestream-engineering.md",
    category: "CDP",
  },{
    id: 8,
    title: "Fractional Analytics & Data Product Leadership",
    image: "/images/services/fractional-analytics-leadership.svg",
    filesource: "/services/fractional-analytics-leadership.md",
    category: "Advisory",
  },{
    id: 3,
    title: "Data Layer Audit",
    image: "/images/services/data-layer-audit.svg",
    filesource: "/services/data-layer-audit.md",
    category: "Audit",
  },{
    id: 6,
    title: "Data Quality Dashboards",
    image: "/images/services/data-quality-dashboards.svg",
    filesource: "/services/data-quality-dashboards.md",
    category: "Dashboard",
  },{
    id: 5,
    title: "Server-Side Tagging Migration",
    image: "/images/services/server-side-tagging-migration.svg",
    filesource: "/services/server-side-tagging-migration.md",
    category: "Migration",
  },{
    id: 4,
    title: "Marketing Tag Implementation",
    image: "/images/services/marketing-tag-implementation.svg",
    filesource: "/services/marketing-tag-implementation.md",
    category: "Implementation",
  },{
    id: 7,
    title: "Contract & Usage Dashboards",
    image: "/images/services/contract-usage-dashboards.svg",
    filesource: "/services/contract-usage-dashboards.md",
    category: "Dashboard",
  },
];

function Serviceslist() {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(60);

  useEffect(() => {
    setPosts(allServices);
    AOS.refresh();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (e, pageNumber) => {
    e.preventDefault();
    setCurrentPage(pageNumber);
  };

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
      <Helmet>
        <title>Services | Tim Hutton</title>
        <meta name="description" content="Analytics, tagging, and data product services offered by Tim Hutton." />
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
            <div className="row blog-wrapper fix-spacing">
              {currentPosts.map((serviceItem, index) => (
                <div
                  className="col-md-6"
                  key={serviceItem.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <ServiceCard serviceData={serviceItem} />
                </div>
              ))}
            </div>
            <div className="spacer" data-height="50"></div>
            {!(posts.length > postsPerPage) ? null : (
              <Pagination
                itemsPerPage={postsPerPage}
                totalItems={posts.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            )}
          </div>
        </div>
        <div className="spacer" data-height="96"></div>
      </main>
    </>
  );
}

export default Serviceslist;
