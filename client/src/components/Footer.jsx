import "../stylesheets/Footer.css";

function Footer() {
  return (
    <footer className="Footer">
      <div id="FooterLeft">
        <img src="/socials/footerlogo.png" id="FooterLogo" width="215px"></img>
        <p id="Address">1151 Richmond St, London, ON N6A 3K7</p>
      </div>
      <div id="Socials">
        <p id="SocialTitle">Socials</p>
        <div id="SocialImgs">
          <img src="/socials/linktree.png" width="52px"></img>
          <img src="/socials/instagram.png" width="85px"></img>
          <img src="/socials/linkedin.png" width="46px"></img>
          <img src="/socials/discord.png" width="53px"></img>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
