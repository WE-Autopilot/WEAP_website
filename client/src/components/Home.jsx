import "../stylesheets/Home.css";

function Home() {
  return (
    <>
    <div className="logo-card">
      <div className="logo-align">

        <div className="logo">
          <h2>WE</h2>
          <img src="Logo_trimmed.svg" id="Logo"></img>
          <h2>AUTOPILOT</h2>
        </div>
        

        <div className="line"></div>
        <p>Western Engineering AutoPilot Club</p>

      </div>
    </div>

    <section className="intro-container">
      <div className="content">
        <h2>What is WE AutoPilot?</h2>
        <p>
        Welcome to the official Western Engineering AutoPilot Website! We are a group of driven engineers and developers, looking to change the world with our Autonomy Software, one road at a time. Feel free to explore everything, from our current endeavours, to future aspirations.
        </p>
      </div>
    </section>
    </>
  );
}

export default Home;

