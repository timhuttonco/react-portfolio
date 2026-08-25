import React, { useEffect, Suspense, lazy } from "react"; // Fixed: removed { React } and used import React
import AOS from 'aos';
import { HelmetProvider } from 'react-helmet-async';
import 'aos/dist/aos.css';
// These were previously only imported inside individual page files
// (Bloglist/Serviceslist/Portfoliolist/WorkDetails). That was fine when every
// route was bundled together, but now that those pages load lazily (see
// below), their CSS would only load once a visitor navigated to one of them
// specifically. Bootstrap's reset in particular is relied on globally
// (e.g. list styling), so these need to load eagerly on every page.
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "animate.css/animate.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./App.scss";
import ScrollIntoView from './components/elements/ScrollIntoView';
import ScrollToTop from "./components/elements/ScrollToTop";
import { createBrowserHistory } from 'history';

// Everything below is only needed once a visitor navigates away from the
// homepage, so it's loaded on demand rather than bundled into the initial
// page load.
const Bloglist = lazy(() => import("./pages/Bloglist"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Portfoliolist = lazy(() => import("./pages/Portfoliolist"));
const WorkDetails = lazy(() => import("./pages/WorkDetails"));
const Serviceslist = lazy(() => import("./pages/Serviceslist"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/blogs" element={<Bloglist />} />
            <Route path="/portfolio" element={<Portfoliolist />} />
            <Route path="/portfolio/:title" element={<WorkDetails />} />
            <Route path="/blogs/:title" element={<BlogDetails />} />
            <Route path="/services" element={<Serviceslist />} />
            <Route path="/services/:title" element={<ServiceDetails />} />
          </Routes>
        </Suspense>
        <ScrollToTop />
      </ScrollIntoView>
    </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
