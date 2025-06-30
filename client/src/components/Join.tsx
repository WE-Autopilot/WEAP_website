import React, { useEffect, FC } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAnimateIn } from "../utils/animations";
import { trackPageView, trackEvent } from "../utils/analytics";
import "../stylesheets/Join.css";
// TODO: Replace with actual photo of Tygo when available
// import TygoImage from "../assets/Tygo.webp";
const TygoImage = null; // Placeholder until image is available

const Join: FC = () => {
  const { t } = useTranslation();

  // Animation refs
  const infoBoxRef = useAnimateIn<HTMLDivElement>("animate-slide-in");
  const redTeamRef = useAnimateIn<HTMLDivElement>("animate-fade-in");
  const blackTeamRef = useAnimateIn<HTMLDivElement>("animate-fade-in");
  const cvTeamRef = useAnimateIn<HTMLDivElement>("animate-fade-in");
  const cvContainerRef = useAnimateIn<HTMLDivElement>("animate-fade-in");
  const ctaRef = useAnimateIn<HTMLDivElement>("animate-slide-up");

  // Prefetch Contact component when hovering the CTA button
  const prefetchContactForm = () => {
    import("./Contact");
  };

  // Track page view
  useEffect(() => {
    trackPageView("Join Page");
  }, []);

  return (
    <div className="join-container">
      <div className="join-info">
        <div className="join-info-box" ref={infoBoxRef}>
          <h2 className="join-info-heading">{t("join.why")}</h2>
          <hr className="header-line-break" />
          <div>
            <p className="join-info-body">
              Western Engineering AutoPilot offers hands-on experience
              developing cutting-edge autonomous vehicle technology. As a
              member, you'll gain valuable technical skills, work alongside
              passionate peers, and build a competitive portfolio that stands
              out to employers. Join us to make meaningful contributions to the
              future of transportation technology.
            </p>
          </div>
        </div>
      </div>

      <div className="team-info">
        <h2 className="team-info-heading">{t("join.teams")}</h2>
        <hr className="team-info-header-line-break" />
        <div className="team-box" id="red-team-box" ref={redTeamRef}>
          <h2 className="team-heading">{t("team.red.title")}</h2>
          <hr className="team-header-line-break" />
          <div>
            <p className="team-body">{t("team.red.description")}</p>
          </div>
        </div>
        <div className="team-box" id="black-team-box" ref={blackTeamRef}>
          <h2 className="team-heading">{t("team.black.title")}</h2>
          <hr className="team-header-line-break" />
          <div>
            <p className="team-body">{t("team.black.description")}</p>
          </div>
        </div>

        {/* CV Team with Team Lead */}
        <div className="cv-team-container" ref={cvContainerRef}>
          <div className="team-lead-card">
            <div className="team-lead-image">
              {TygoImage ? (
                <img src={TygoImage} alt="Tygo Crawley" />
              ) : (
                <div className="placeholder-image" aria-label="Tygo Crawley">
                  TC
                </div>
              )}
            </div>
            <h3 className="team-lead-name">Tygo Crawley</h3>
            <p className="team-lead-role">
              Team Lead - Computer Vision Project
            </p>
          </div>
          <div className="team-box" id="cv-team-box">
            <h2 className="team-heading">{t("team.cv.title")}</h2>
            <hr className="team-header-line-break" />
            <div>
              <p className="team-body">{t("team.cv.description")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="join-cta-container" ref={ctaRef}>
        <div className="join-cta-content">
          <h2>{t("join.ready")}</h2>
          <p>{t("join.readyDescription")}</p>
          <Link
            to="/contact"
            className="apply-button"
            onMouseEnter={prefetchContactForm}
            onClick={() => trackEvent("Navigation", "click", "Apply Button")}
          >
            {t("join.apply")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
