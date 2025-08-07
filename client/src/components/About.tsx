import "../stylesheets/About.css";
import ComponentSvg from "../assets/Component.svg";
import OneSvg from "../assets/1.svg";
import Member1 from "../assets/Member1.webp";
import Member2 from "../assets/Member2.webp";
import Member3 from "../assets/Member3.webp";
import Member4 from "../assets/Member4.webp";
import Member5 from "../assets/Member5.webp";
import Danya from "../assets/Danya.webp";
import Tygo from "../assets/Tygo.jpg";
import Obaid from "../assets/Obaid.jpg";
import RedTeamLead from "../assets/RedTeamLead.jpg";
import BlackTeamLead from "../assets/Ian.jpg";
import { useEffect, memo } from "react";

// TeamMember component for better performance
const TeamMember = memo(({ member, isTeamLead }: {member: any; isTeamLead: boolean}) => {
  return (
    <div
      className={`member-card ${isTeamLead ? "cv-lead" : ""}`}
      key={member.id}
    >
      <div className="member-image">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            decoding="async"
            width="150"
            height="150"
          />
        ) : (
          <div className="placeholder-image" aria-label={member.name}>
            {member.placeholderInitials || member.name.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="name">{member.name}</h3>
      <p className="role">{member.role}</p>
    </div>
  );
});

TeamMember.displayName = "TeamMember";

function About() {
  // Define team structure with leadership levels
  const LEADERSHIP_LEVELS = {
    PRESIDENT: "president",
    CO_FOUNDER: "co-founder",
    VP: "vp",
    TEAM_LEAD: "team-lead",
    TEAM_LEAD_SECONDARY: "team-lead-secondary",
  };

  const teamMembers = [
    {
      id: 1,
      name: "Aly Ashour",
      role: "Co-Founder, President",
      image: Member3,
      level: LEADERSHIP_LEVELS.PRESIDENT,
    },
    {
      id: 2,
      name: "Ali Elgalad",
      role: "Co-Founder, VP Finance",
      image: Member1,
      level: LEADERSHIP_LEVELS.CO_FOUNDER,
    },
    {
      id: 3,
      name: "Hamza Elkababji",
      role: "Co-Founder, VP Comms",
      image: Member4,
      level: LEADERSHIP_LEVELS.CO_FOUNDER,
    },
    {
      id: 4,
      name: "Zain Syed",
      role: "VP Tech",
      image: Member5,
      level: LEADERSHIP_LEVELS.VP,
    },
    {
      id: 5,
      name: "Ethan Greene",
      role: "VP Marketing",
      image: Member2,
      level: LEADERSHIP_LEVELS.VP,
    },
    {
      id: 6,
      name: "Danya Abbas",
      role: "VP Events",
      image: Danya,
      level: LEADERSHIP_LEVELS.VP,
    },
    {
      id: 7,
      name: "Tygo Crawley",
      role: "Team Lead - Computer Vision Project",
      image: Tygo,
      level: LEADERSHIP_LEVELS.TEAM_LEAD,
    },
    {
      id: 8,
      name: "Obaid Mohiuddin",
      role: "Computer Vision Lead",
      image: Obaid,
      level: LEADERSHIP_LEVELS.TEAM_LEAD,
    },
    {
      id: 9,
      name: "Benjamin Namayandeh",
      role: "Autonomy Black Team Lead",
      image: RedTeamLead,
      level: LEADERSHIP_LEVELS.TEAM_LEAD_SECONDARY,
    },
    {
      id: 10,
      name: "Ian",
      role: "Autonomy Red Team Lead",
      image: BlackTeamLead,
      level: LEADERSHIP_LEVELS.TEAM_LEAD_SECONDARY,
    },
  ];

  // teamSection is managed by intersection observer

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const memberCards = document.querySelectorAll(".member-card");
    memberCards.forEach((card) => {
      observer.observe(card);
    });
    return () => {
      memberCards.forEach((card) => {
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
            <p>
              Welcome to the offical Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavors, to futre
              aspirations.
            </p>
          </div>

          {/* Card 2 */}
          {/* <div className="card">
            <h2>Why WEAP?</h2>
            <p>
              Welcome to the offical Western Engineering AutoPilot Website! We
              are a group of driven engineers and developers, looking to change
              the world with our Autonomy Software, one road at a time. Feel
              free to explore everything, from our current endeavors, to futre
              aspirations.
            </p>
          </div> */}
        </div>
        <div className="Members-container">
          <h2>Meet Our Team</h2>

          <div className="team-tree">
            {/* Top level - President */}
            <div className="tree-level level-1">
              {teamMembers
                .filter(
                  (member) => member.level === LEADERSHIP_LEVELS.PRESIDENT
                )
                .map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    isTeamLead={false}
                  />
                ))}
            </div>

            {/* Second level - Co-Founders */}
            <div className="tree-level level-2">
              {teamMembers
                .filter(
                  (member) => member.level === LEADERSHIP_LEVELS.CO_FOUNDER
                )
                .map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    isTeamLead={false}
                  />
                ))}
            </div>

            {/* Third level - VPs only */}
            <div className="tree-level level-3">
              {teamMembers
                .filter((member) => member.level === LEADERSHIP_LEVELS.VP)
                .map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    isTeamLead={false}
                  />
                ))}
            </div>

            {/* Fourth level - Team Leads */}
            <div className="tree-level level-4">
              {teamMembers
                .filter(
                  (member) => member.level === LEADERSHIP_LEVELS.TEAM_LEAD
                )
                .map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    isTeamLead={true}
                  />
                ))}
            </div>

            {/* Fifth level - Secondary Team Leads */}
            <div className="tree-level level-5">
              {teamMembers
                .filter(
                  (member) =>
                    member.level === LEADERSHIP_LEVELS.TEAM_LEAD_SECONDARY
                )
                .map((member) => (
                  <TeamMember
                    key={member.id}
                    member={member}
                    isTeamLead={false}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export as memoized component for performance
export default memo(About);
