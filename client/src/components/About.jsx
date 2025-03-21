import "../stylesheets/About.css";
import ComponentSvg from "../assets/Component.svg";
import OneSvg from "../assets/1.svg";
import Member1 from "../assets/Member1.webp";
import Member2 from "../assets/Member2.webp";
import Member3 from "../assets/Member3.webp";
import Member4 from "../assets/Member4.webp";
import Member5 from "../assets/Member5.webp";

// Boilerplate code for the About component

function About() {
  const teamMembers = [
    { id: 1, name: "Aly Ashour", role: "Founder", image: Member5 },
    { id: 2, name: "Zain Syed", role: "VP Tech", image: Member4 },
    { id: 3, name: "Ethan Greene", role: "VP Marketing", image: Member2 },
    { id: 4, name: "Ali Elgalad", role: "VP Finance", image: Member5 },
    { id: 5, name: "Danya Abbas", role: "VP Events", image: Member3 },
    { id: 6, name: "Hamza Elkababji", role: "VP Comms", image: Member1 },
    
  ]
  return (
    <div className="about-container">
      <div className="background-decoration">
        <img src={ComponentSvg} alt="" className="bg-svg component-svg" />
        <img src={OneSvg} alt="" className="bg-svg one-svg" />
      </div>
      
      <div className="about-content">
        <h1>About Us</h1>
        
        <div className="cards-container">
          {/* Card 1 */}
          <div className="card">
            <h2>Our Start</h2>
            <p>Welcome to the offical Western Engineering AutoPilot Website! We are a group of driven engineers and developers, looking to change the world with our Autonomy Software, one road at a time.
              Feel free to explore everything, from our current endeavors, to futre aspirations.
            </p>
          </div>
          
          {/* Card 2 */}
          <div className="card">
            <h2>Why WEAP?</h2>
            <p>Welcome to the offical Western Engineering AutoPilot Website! We are a group of driven engineers and developers, looking to change the world with our Autonomy Software, one road at a time.
            Feel free to explore everything, from our current endeavors, to futre aspirations.</p>
          </div>
          
        
        </div>
        <div className="Members-container">
        <h2>Meet Our Team</h2>
          
          <div className="team-pyramid">
            {/* Top row - 1 member */}
            <div className="pyramid-row top-row">
              <div className="member-card">
                <div className="member-image">
                  <img src={teamMembers[0].image} alt={teamMembers[0].name} />
                </div>
                <h3 className="name">{teamMembers[0].name}</h3>
                <p className="role">{teamMembers[0].role}</p>
              </div>
            </div>
            
            {/* Middle row - 3 members */}
            <div className="pyramid-row middle-row">
              {teamMembers.slice(1, 4).map(member => (
                <div className="member-card" key={member.id}>
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3 className="name">{member.name}</h3>
                  <p className="role">{member.role}</p>
                </div>
              ))}
            </div>
            
            {/* Bottom row - 2 members */}
            <div className="pyramid-row bottom-row">
              {teamMembers.slice(4, 6).map(member => (
                <div className="member-card" key={member.id}>
                  <div className="member-image">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3 className="name">{member.name}</h3>
                  <p className="role">{member.role}</p>
                </div>
              ))}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default About;
