import React from "react";
import { Link } from "react-router-dom";
import Logo from "../elements/Logo";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faHome, faPencilAlt, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(fab, faHome, faPencilAlt, faBriefcase)

function Header({ light, logoSource, toggleMenu, headerToggler }) {
  const handleClasses = () => {
    let classes = "desktop-header-1 d-flex align-items-start flex-column";
    if (light & toggleMenu) {
      classes += " light open";
    } else if (toggleMenu) {
      classes += " open";
    } else if (light) {
      classes += " light";
    }
    return classes;
  };
  const handleMobileClasses = () => {
    let classes = "mobile-header-1";
    if (light & toggleMenu) {
      classes += " light open";
    } else if (toggleMenu) {
      classes += " open";
    } else if (light) {
      classes += " light";
    }
    return classes;
  };
  return (
    <>
      <header className={handleMobileClasses()}>
        <div className="container">
          <div className="menu-icon d-inline-flex mr-4">
            <button onClick={headerToggler}>
              <span></span>
            </button>
          </div>
          <Logo logoSource={logoSource} />
        </div>
      </header>
      <header className={handleClasses()}>
        <Logo logoSource={logoSource} />
        <nav>
        <ul className="vertical-menu scrollspy">
            <li>
            <Link
            to="/"
            >
              <FontAwesomeIcon icon="home" />
              &nbsp; Home
            </Link>
            </li>
            <li>
            <Link
            to="/blogs"
            >
            <FontAwesomeIcon icon="pencil-alt" />
            &nbsp; Blog
            </Link>
            </li>
            <li>
            <Link
            to="/portfolio"
            >
            <FontAwesomeIcon icon="briefcase" />
            &nbsp; Portfolio
            </Link>
            </li>
            <li>
            
            </li>
          </ul>
        </nav>

        <div className="footer">
        <a href="https://www.linkedin.com/in/timhuttonco" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin}/></a> &nbsp; <a href="https://www.instagram.com/timhuttonco/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram}/></a> &nbsp;<br />
          <span className="copyright">
            &copy; {new Date().getFullYear()} Tim Hutton
          </span>
        </div>
      </header>
    </>
  );
}

export default Header;
