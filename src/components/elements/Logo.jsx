import React from "react";
import { Link } from "react-router-dom";

function Logo({ bootstrapNav }) {
  if (bootstrapNav) {
    return (
      <Link className="navbar-brand" to="/">
        <img src={'../../../images/logo3.png'} alt="Tim Hutton" />
      </Link>
    );
  }

  return (
    <div className="site-logo">
      <Link to="/">
        <img src={'../../../images/logo3.png'} alt="Tim Hutton" />
      </Link>
    </div>
  );
}

export default Logo;
