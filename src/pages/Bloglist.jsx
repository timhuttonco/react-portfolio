import React, { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.min.css";
import Header from "../components/layouts/Header";
import Blog from "../components/elements/Blog";
import Pagination from "../components/elements/Pagination";

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
    filesource: "/blogs/calcio-in-italia.md",
    date: "July 23, 2025",
    category: "Sport, Travel",
  },
  {
    id: 30,
    title: "A Year In Books - 2024",
    image: "/images/blog/a-year-in-books-2024.png",
    filesource: "/blogs/a-year-in-books-2024.md",
    date: "January 7, 2025",
    category: "Books",
  },
  {
    id: 29,
    title: "Using Proxyman to Debug App Analytics",
    image: "/images/blog/proxyman.png",
    filesource: "../blogs/proxyman.md",
    date: "November 14, 2024",
    category: "Tech, Analytics",
  },
  {
    id: 28,
    title: "A Year In Books - 2023",
    image: "/images/blog/a-year-in-books-2022.png",
    filesource: "../blogs/a-year-in-books-2023.md",
    date: "February 23, 2024",
    category: "Books",
  },
  {
    id: 27,
    title: "Implementing Facebook Conversions API Using Google Tag Manager Server-Side",
    image: "/images/blog/fb_capi6.jpg",
    filesource: "../blogs/facebook-capi-gtm.md",
    date: "December 17, 2023",
    category: "Tech, Analytics",
  },
  {
    id: 26,
    title: "Implementing TikTok Events API",
    image: "/images/blog/tiktok-events-api.png",
    filesource: "../blogs/implementing-tiktok-events-api.md",
    date: "September 12, 2023",
    category: "Tech, Analytics",
  },
  {
    id: 25,
    title: "Sending Data To and From Google Tag Manager Server-Side Using GA4 Tags",
    image: "/images/blog/gtm-server-side-ii.png",
    filesource: "../blogs/google-tag-manager-server-side-data.md",
    date: "February 23, 2023",
    category: "Tech, Analytics",
  },
  {
    id: 24,
    title: "Implementing Google Tag Manager Server-Side Using Cloud Run",
    image: "/images/blog/google-tag-manager-cloud-run.png",
    filesource: "../blogs/google-tag-manager-cloud-run.md",
    date: "January 25, 2023",
    category: "Tech, Analytics",
  },
  {
    id: 23,
    title: "A Year In Books - 2022",
    image: "/images/blog/a-year-in-books-2022.png",
    filesource: "../blogs/a-year-in-books-2022.md",
    date: "January 21, 2023",
    category: "Books",
  },
  {
    id: 22,
    title: "Testing Firebase & Google Analytics 4 Tracking on Android Apps",
    image: "/images/blog/firebase-ga4.png",
    filesource: "../blogs/testing-google-analytics-firebase-android.md",
    date: "October 14th, 2022",
    category: "Tech, Analytics",
  },
  {
    id: 21,
    title: "Debugging Google Analytics in iOS Applications with Charles",
    image: "/images/blog/debugging-google-analytics-ios-charles.png",
    filesource: "../blogs/debugging-google-analytics-ios-charles.md",
    date: "January 30, 2022",
    category: "Tech, Analytics",
  },
  {
    id: 20,
    title: "A Year In Books - 2021",
    image: "/images/blog/a-year-in-books-2020.png",
    filesource: "../blogs/a-year-in-books-2021.md",
    date: "January 16, 2022",
    category: "Books",
  },
  {
    id: 19,
    title: "Why Work In Technical Support?",
    image: "/images/blog/why-work-in-technical-support.png",
    filesource: "../blogs/why-work-in-technical-support.md",
    date: "June 8, 2021",
    category: "Tech, Careers",
  },
  {
    id: 18,
    title: "Running and Mental Health – An Ode to NRC",
    image: "/images/blog/running-and-mental-health.png",
    filesource: "../blogs/running-and-mental-health.md",
    date: "May 13, 2021",
    category: "Running, Mental Health",
  },
  {
    id: 17,
    title: "Seven Signs You Should Look for a New Job",
    image: "/images/blog/seven-signs-you-should-look-for-a-new-job.png",
    filesource: "../blogs/seven-signs-you-should-look-for-a-new-job.md",
    date: "March 29, 2021",
    category: "Tech, Careers",
  },
  {
    id: 16,
    title: "2 Ways You Can Easily Get Started With Azure Resource Manager (ARM) Templates",
    image: "/images/blog/arm.png",
    filesource: "../blogs/get-started-with-arm.md",
    date: "February 23, 2021",
    category: "Tech",
  },
  {
    id: 15,
    title: "A Year In Books - 2020",
    image: "/images/blog/a-year-in-books-2020-small.png",
    filesource: "../blogs/a-year-in-books-2020.md",
    date: "February 8, 2021",
    category: "Books",
  },
  {
    id: 14,
    title: "Learning and Reacting: Migrating a portfolio to React",
    image: "/images/blog/react-logo-small.png",
    filesource: "../blogs/learning-and-reacting-portfolio.md",
    date: "January 4, 2021",
    category: "Tech",
  },
  {
    id: 13,
    title: "10 Tips on How to Hire Remote Software Developers for Your Startup",
    image: "/images/blog/10-tips-hiring-remote-software-developers_small.png",
    filesource: "../blogs/10-tips-hiring-remote-software-developers.md",
    date: "December 9, 2020",
    category: "Tech, Recruitment",
  },
  {
    id: 12,
    title: "A Year In Books - 2019",
    image: "/images/blog/a-year-in-books-2018.jpg",
    filesource: "../blogs/a-year-in-books-2019.md",
    date: "January 21, 2020",
    category: "Books",
  },
  {
    id: 11,
    title: "The Closest I'll Come to a PhD: Harriet Lowe's PhD Eye Tracking Website",
    image: "/images/blog/harriet-lowe-phd-eye-tracking.gif",
    filesource: "../blogs/harriet-lowe-phd-eye-tracking-website.md",
    date: "December 10, 2018",
    category: "Tech",
  },
  {
    id: 10,
    title: "A Year In Books",
    image: "/images/blog/a-year-in-books-2018.jpg",
    filesource: "../blogs/a-year-in-books-2018.md",
    date: "January 12, 2019",
    category: "Books",
  },
  {
    id: 9,
    title: "Decibel Knowledge Base Praise",
    image: "/images/blog/decibelknowledgebasepraise.jpg",
    filesource: "../blogs/decibel-knowledgebase-praise.md",
    date: "September 11, 2018",
    category: "Tech",
  },
  {
    id: 8,
    title: "Delayed From Denver",
    image: "/images/blog/delayedfromdenver.jpg",
    filesource: "../blogs/delayed-from-denver.md",
    date: "31 March, 2018",
    category: "Travel",
  },
  {
    id: 7,
    title: "A Bad Case Of UX From My Beloved Football Club",
    image: "/images/blog/lufcux.jpg",
    filesource: "../blogs/a-bad-case-of-ux-lufc.md",
    date: "22 February, 2017",
    category: "UX",
  },
  {
    id: 6,
    title: "Facebook's Hooli Moment Shows It Has A Long Way To Go",
    image: "/images/blog/facebookshoolimoment.jpg",
    filesource: "../blogs/facebooks-hooli-moment.md",
    date: "18 May, 2016",
    category: "Tech",
  },
  {
    id: 5,
    title: "Decibel Insight Knowledgebase Officially Launched",
    image: "/images/blog/decibelinsightknowledgebase.jpg",
    filesource: "../blogs/decibel-insight-knowledgebase.md",
    date: "13 April, 2016",
    category: "Tech",
  },
  {
    id: 4,
    title: "A Weekend In Verona",
    image: "/images/blog/veronab.jpg",
    filesource: "../blogs/a-weekend-in-verona.md",
    date: "30 July, 2015",
    category: "Travel",
  },
  {
    id: 3,
    title: "The Return Of The Start Menu: Windows 10 Unveiled",
    image: "/images/blog/windows10.jpg",
    filesource: "../blogs/windows-10.md",
    date: "22 January, 2015",
    category: "Tech",
  },
  {
    id: 2,
    title: "Nike To Release 'Back To The Future' Self-Tying Shoelaces This Year",
    image: "/images/blog/bttf.jpg",
    filesource: "../blogs/back-to-the-future-laces.md",
    date: "7 January, 2015",
    category: "Tech, Film",
  },
  {
    id: 1,
    title: "New York City Gets Its Own Domain Name",
    image: "/images/blog/newyork1.jpg",
    filesource: "../blogs/new-york-city-gets-its-domain-name.md",
    date: "8 July, 2013",
    category: "Tech",
  },
];

function Bloglist() {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(60);

  useEffect(() => {
    setPosts(allBlogs);
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
              {currentPosts.map((blogItem, index) => ( // Added index here
                <div 
                  className="col-md-6" 
                  key={blogItem.id} 
                  data-aos="fade-up" // This triggers the animation
                  data-aos-delay={index * 50}
                >
          <Blog blogData={blogItem} />
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

export default Bloglist;