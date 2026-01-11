import React, { useEffect } from "react"; // Fixed: removed { React } and used import React
import AOS from 'aos';
import { HelmetProvider } from 'react-helmet-async';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Bloglist from "./pages/Bloglist";
import BlogDetails from "./pages/BlogDetails";
import Portfoliolist from './pages/Portfoliolist';
import WorkDetails from './pages/WorkDetails';
import "./App.scss";
import ScrollIntoView from './components/elements/ScrollIntoView';
import ScrollToTop from "./components/elements/ScrollToTop";
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function App() {
  // Initialize AOS when the App mounts
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Whether animation should happen only once - while scrolling down
      mirror: false,
    });
  }, []);

  return (
    <HelmetProvider>
    <BrowserRouter history={history}>
      <ScrollIntoView>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/blogs" element={<Bloglist />} />
          <Route path="/portfolio" element={<Portfoliolist />} />
          <Route path="/portfolio/:title" element={<WorkDetails />} />
          <Route path="/blogs/:title" element={<BlogDetails />} />
        </Routes>
        <ScrollToTop />
      </ScrollIntoView>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;