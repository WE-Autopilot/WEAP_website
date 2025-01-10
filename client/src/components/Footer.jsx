import "../stylesheets/Footer.css";

function Footer() {
  return (
    <footer className="Footer">
      <div id="FooterLeft">
        <img src="/socials/footerlogo.png" id="FooterLogo" width="215px"></img>
        <p id="Address">
          1151 Richmond St,
          <br id="TextBreak" />
          London, ON N6A 3K7
        </p>
      </div>
      <div id="Socials">
        <p id="SocialTitle">Socials</p>
        <div id="SocialImages">
          <a href="https://linktr.ee/we.autopilot" id="LinkTree">
            <img src="/socials/linktree.png" width="52px"></img>
          </a>
          <a href="https://www.instagram.com/we.autopilot" id="Instagram">
            <img src="/socials/instagram.png" width="40px"></img>
          </a>
          <a
            href="https://www.linkedin.com/company/we-autopilot-club"
            id="LinkedIn"
          >
            <img src="/socials/linkedin.png" width="46px"></img>
          </a>
          <a href="https://discord.com/invite/HuJCHCSVB2" id="Discord">
            <img src="/socials/discord.png" width="53px"></img>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
