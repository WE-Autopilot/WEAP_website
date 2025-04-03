import "../stylesheets/Home.css";

function Home() {
  return (
    <>
      <div className="logo-card">
        <div className="logo-align">
          <div className="logo">
            <h2>WE</h2>
            <img src="Logo_trimmed.svg" id="Logo" alt="Logo" />
            <h2>AUTOPILOT</h2>
          </div>

          <div className="line"></div>
          <div className="logo-align">
            <p>Western Engineering AutoPilot Club</p>
          </div>
        </div>
      </div>

      <div className="home-container">
        <section className="intro-section">
          <div className="content">
            <div className="title">What is WE AutoPilot?</div>
            <div className="divider"></div>
            <p className="description">
              Welcome to the official Western Engineering AutoPilot Website! We are a group of driven engineers and developers, looking to change the world with our Autonomy Software, one road at a time. Feel free to explore everything, from our current endeavors to future aspirations.
            </p>
          </div>
        </section>

        <section className="mission-section">
          <div className="polycard1">
            <div className="mission-shape">
              <div className="left-part">
                <div className="mission-content">
                  <h2>Our Mission</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
              </div>
              <div className="right-part">
                <img src="/home/image_4507.png" alt="Group Image" className="group-img" />
              </div>
            </div>
          </div>
        </section>

        <section className="commitments-section">
          <div className="polycard2">
            <div className="commitments-shape">
              <div className="left-part2">
                <img src="/home/IMG_5372.png" alt="Learning Image" className="learning-img" />
              </div>
              <div className="right-part2">
                <div className="commitments-content">
                  <h2>Our Commitments</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
        <section className="join-section">
          <div className="ready-to-join">
            <h2 className="join-title">Ready to Join?</h2>
            <div className="join-button">
              <a href="/join">
                <span>Join Now!</span>
              </a>
            </div>
          </div>
        </section>
    </>
  );
}

export default Home;
