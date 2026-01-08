import { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Use useLocation instead of withRouter

const ScrollIntoView = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return children;
};

export default ScrollIntoView; // No more withRouter wrapper!