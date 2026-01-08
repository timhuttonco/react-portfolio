import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    isVisible && (
      <div onClick={scrollToTop} className="scroll-to-top">
        {/* You can use an icon here or just text */}
        <span style={{ cursor: 'pointer', position: 'fixed', bottom: '20px', right: '20px', background: '#ff4c60', color: '#fff', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
           ↑
        </span>
      </div>
    )
  );
};

export default ScrollToTop;