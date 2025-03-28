import "../stylesheets/About.css";
import ComponentSvg from "../assets/Component.svg";
import OneSvg from "../assets/1.svg";
import Member1 from "../assets/Member1.webp";
import Member2 from "../assets/Member2.webp";
import Member3 from "../assets/Member3.webp";
import Member4 from "../assets/Member4.webp";
import Member5 from "../assets/Member5.webp";
import { useEffect, useRef } from "react";
import { use } from "react";


function About() {
  const teamMembers = [
    { id: 1, name: "Aly Ashour", role: "Co-Founder, President", image: Member3 },
    { id: 2, name: "Ali Elgalad", role: "Co-Founder, VP Finance", image: Member1 },
    { id: 3, name: "Hamza Elkababji", role: "Co-Founder, VP Comms", image: Member4 },
    { id: 4, name: "Zain Syed", role: "VP Tech", image: Member5 },
    { id: 5, name: "Ethan Greene", role: "VP Marketing", image: Member2 },
    { id: 6, name: "Danya Abbas", role: "VP Events", image: Member5 },
    
    
  ]

  const teamSectionRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px"
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach(card => {
      observer.observe(card);
    });
    return () => {
      memberCards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div className="about-container">
      <div className="background-decoration">
        <img src={ComponentSvg} alt="" className="bg-svg component-svg" />
        <img src={OneSvg} alt="" className="bg-svg one-svg" />
      </div>
      
      <div className="about-content">
        
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
            {/* <div className="pyramid-row top-row">
              <div className="member-card">
                <div className="member-image">
                  <img src={teamMembers[0].image} alt={teamMembers[0].name} />
                </div>
                <h3 className="name">{teamMembers[0].name}</h3>
                <p className="role">{teamMembers[0].role}</p>
              </div>
            </div> */}
            
            {/* Middle row - 3 members */}
            <div className="pyramid-row middle-row">
              {teamMembers.slice(0, 3).map(member => (
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
              {teamMembers.slice(3, 6).map(member => (
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
