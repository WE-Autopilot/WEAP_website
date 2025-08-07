import React, { useEffect, memo } from "react";
import "../stylesheets/Footer.css";
import { Gradient } from "../assets/Gradient";

const Footer: React.FC = () => {

    useEffect(() => {
      const gradient = new Gradient();
      gradient.initGradient("#gradient-canvas");
    }, []);

  return (
    <>


      <footer className="Footer">
        <div id="animated-bg">
          <canvas id="gradient-canvas"></canvas>
        </div>

        <div id="FooterLeft">
          <img
            src="/socials/footerlogo.png"
            id="FooterLogo"
            width="215"
            height="auto"
            alt="WEAP Logo"
          />
          <p id="Address">
            1151 Richmond St,
            <br />
            London, ON N6A 3K7
          </p>
        </div>
        <div id="Socials">
          <p id="SocialTitle">Socials</p>
          <div id="SocialImages">
            <a
              href="https://linktr.ee/we.autopilot"
              id="LinkTree"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkTree"
            >
              <img
                src="/socials/linktree.svg"
                width="40"
                height="40"
                alt="LinkTree"
              />
            </a>
            <a
              href="https://www.instagram.com/we.autopilot"
              id="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <img
                src="/socials/insta.svg"
                width="40"
                height="40"
                alt="Instagram"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/we-autopilot-club"
              id="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <img
                src="/socials/linkedin.svg"
                width="40"
                height="40"
                alt="LinkedIn"
              />
            </a>
            <a
              href="https://discord.com/invite/HuJCHCSVB2"
              id="Discord"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <img
                src="/socials/discord.svg"
                width="45"
                height="45"
                alt="Discord"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default memo(Footer);
