import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        this site is maintained on{" "}
        <a
          href="https://github.com/bairdlangenbrunner/bairdlangenbrunner"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
          <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
