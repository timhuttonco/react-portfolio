import React, { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.min.css";
import Header from "../components/layouts/Header";
import Portfolio from "../components/elements/Portfolio";
import Pagination from "../components/elements/Pagination";

const allWorks = [
  {
    id: 27,
        title: "The Good Growth Podcast",
        image: "/images/works/good-growth-podcast.png",
        filesource: "../portfolio/good-growth-podcast.md",
        category: "Podcasts",
    },{
    id: 26,
        title: "Senior Analytics Implementation Manager at YOOX Net-A-Porter",
        image: "/images/works/ynap.png",
        filesource: "../portfolio/ynap-analytics-implementation.md",
        category: "Career",
    },{
      id: 25,
          title: "Consultant at Higher Oak Consulting",
          image: "/images/works/higher-oak.png",
          filesource: "../portfolio/higher-oak-consulting.md",
          category: "Career, Consulting",
      },{
        id: 24,
            title: "The Vibes 'N' Tribes Podcast",
            image: "/images/works/vibes-n-tribes-podcast.png",
            filesource: "../portfolio/vibes-n-tribes-podcast.md",
            category: "Podcasts",
        },{
    id: 23,
        title: "Multiverse Mentoring",
        image: "/images/works/multiverse-mentoring.png",
        filesource: "../portfolio/multiverse-mentoring.md",
        category: "Mentoring",
    },{
    id: 22,
        title: "Implementation Engineer Manager EMEA at Tealium",
        image: "/images/works/tealium_small.png",
        filesource: "../portfolio/tealium-ie-manager.md",
        category: "Career",
    },
    {
      id: 21,
          title: "Decibel Implementation Processes",
          image: "/images/works/decibel-implementation-small.png",
          filesource: "../portfolio/decibel-implementation.md",
          category: "Processes",
      },
      {
        id: 20,
            title: "Decibel Knowledgebase",
            image: "/images/works/decibelknowledgebase_small.png",
            filesource: "../portfolio/decibel-knowledgebase.md",
            category: "Technical Documentation",
        },
  {
    id: 19,
        title: "Service Delivery Lead at Decibel",
        image: "/images/works/decibel_small.png",
        filesource: "../portfolio/decibel.md",
        category: "Career",
    },
    {
      id: 18,
          title: "Decibel Support Processes",
          image: "/images/works/decibel-support-small.png",
          filesource: "../portfolio/decibel-support.md",
          category: "Processes",
      },
    {
      id: 17,
          title: "Harriet Lowe PhD Eye Tracking Website",
          image: "/images/works/harriet-lowe-phd-eye-tracking.gif",
          filesource: "../portfolio/harriet-lowe-phd-eye-tracking.md",
          category: "Web",
      },
  {
    id: 16,
        title: "CN English Website",
        image: "/images/works/cnenglish_small.png",
        filesource: "../portfolio/cn-english-website.md",
        category: "Web",
    },
  {
      id: 15,
          title: "Solutions Engineering at Decibel",
          image: "/images/works/decibel_small.png",
          filesource: "../portfolio/decibel-se.md",
          category: "Career",
      },
    {
      id: 14,
          title: "Technical Lead at Decibel",
          image: "/images/works/decibel_small.png",
          filesource: "../portfolio/decibel-tl.md",
          category: "Career",
      },
      {
        id: 13,
            title: "Decibel Insight Webinars",
            image: "/images/works/decibel-insight-multichannel-webinar_small.png",
            filesource: "../portfolio/decibel-insight-webinars.md",
            category: "Webinars",
        },
  {
    id: 12,
        title: "Bromley Arena Website",
        image: "/images/works/bromleyarena_small.png",
        filesource: "../portfolio/bromley-arena.md",
        category: "Web",
    },
    {
      id: 11,
          title: "Sportplan: Content and Marketing",
          image: "/images/works/sportplancontent_small.png",
          filesource: "../portfolio/sportplan.md",
          category: "Content, Marketing",
      },
  {
    id: 10,
        title: "Leeds Metropolitan University: PHP Social Networking Project",
        image: "/images/works/lmu_small.png",
        filesource: "../portfolio/lmu-final-year-project.md",
        category: "Web Development",
    },
  {
    id: 9,
        title: "Bromley Football Club Website",
        image: "/images/works/bromleyfcwebsite_small.png",
        filesource: "../portfolio/bromley-fc-website.md",
        category: "Web",
    },
  {
    id: 8,
        title: "Bromley Arena Microsites",
        image: "/images/works/bromleyarena2_small.png",
        filesource: "../portfolio/bromley-arena-microsites.md",
        category: "Web",
    },
  {
    id: 7,
        title: "Bromley FC Programme",
        image: "/images/works/bfcprog_small.png",
        filesource: "../portfolio/bromley-fc-programme.md",
        category: "Content, Print",
    },
  {
    id: 6,
        title: "Bromley FC: Inside The Club",
        image: "/images/works/bfc-inside-the-club_small.png",
        filesource: "../portfolio/bfc-inside-the-club.md",
        category: "Video Editing",
    },
  {
    id: 5,
        title: "Sportplan: Video Tutorials",
        image: "/images/works/sportplan_small.png",
        filesource: "../portfolio/sportplan-videos.md",
        category: "Video Editing, Documentation",
    },
  {
    id: 4,
        title: "MoreLife: Social Media",
        image: "/images/works/morelifesocial_small.png",
        filesource: "../portfolio/more-life-social-media.md",
        category: "Social Media",
    },
  {
    id: 3,
        title: "Impact Volunteering Website",
        image: "/images/works/impact_small.png",
        filesource: "../portfolio/impact-volunteering.md",
        category: "Web",
    },
  {
    id: 2,
        title: "BFCtv",
        image: "/images/works/bfctv_small.png",
        filesource: "../portfolio/bromley-fc-media.md",
        category: "Video Editing",
    },  
  {
    id: 1,
        title: "MoreLife Videos",
        image: "/images/works/morelife_small.png",
        filesource: "../portfolio/more-life-videos.md",
        category: "Video Editing",
    },
];

function Portfoliolist() {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(60);

  useEffect(() => {
    setPosts(allWorks);
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
              {currentPosts.map((worksItem, index) => ( // Added index here
                <div 
                  className="col-md-6" 
                  key={worksItem.id} 
                  data-aos="fade-up" // This triggers the animation
                  data-aos-delay={index * 50}
                >
          <Portfolio portfolioData={worksItem} />
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

export default Portfoliolist;