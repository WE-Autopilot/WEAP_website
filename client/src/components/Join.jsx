import "../stylesheets/Join.css";

function Join() {
  return (
    <div className="join-container">
      <div className="join-info">
        <div className="join-info-box">
          <h2 className="join-info-heading">Why Join?</h2>
          <hr className="header-line-break"></hr>
          <div>
            <p className="join-info-body">
              Welcome to the official Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavours, to future
              aspirations.
            </p>
          </div>
        </div>
      </div>

      <div className="team-info">
        <h2 className="team-info-heading">The Teams</h2>
        <hr className="team-info-header-line-break"></hr>
        <div className="team-box" id="red-team-box">
          <h2 className="team-heading">Red Team</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">
              Welcome to the official Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavours, to future
              aspirations.
            </p>
          </div>
        </div>
        <div className="team-box" id="black-team-box">
          <h2 className="team-heading">Black Team</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">
              Welcome to the official Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavours, to future
              aspirations.
            </p>
          </div>
        </div>
        <div className="team-box" id="cv-team-box">
          <h2 className="team-heading">CV Team</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">
              Welcome to the official Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavours, to future
              aspirations.
            </p>
          </div>
        </div>
      </div>

  

<div className="join-form-container">
  <form className="join-form">
    <h2 className="form-heading">Get Involved!</h2>
    <div className="form-grid">
      <input
        type="text"
        className="name-box"
        name="name"
        placeholder="Name"
      />
      <input 
        type="text" 
        name="email" 
        placeholder="Email"
      />
      <select name="year" defaultValue={""}>
        <option value="" disabled>
          Year
        </option>
      </select>
      <input
        type="text"
        name="discipline"
        placeholder="Discipline"
      />
      <select name="team" className="full-width" defaultValue={""}>
        <option value="" disabled>
          Team of Interest
        </option>
      </select>
      <input
        type="text"
        className="message-box full-width"
        name="message"
        placeholder="Your Message"
      />
    </div>
    <input type="submit" value="Submit" className="submit-button" />
  </form>
</div>


    </div>
  );
}
export default Join;
