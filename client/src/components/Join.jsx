import "../stylesheets/Join.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAnimateIn } from "../utils/animations";
import { trackPageView, trackEvent } from "../utils/analytics";

function Join() {
  const { t } = useTranslation();

  // Animation refs
  const infoBoxRef = useAnimateIn("animate-slide-in");
  const redTeamRef = useAnimateIn("animate-fade-in");
  const blackTeamRef = useAnimateIn("animate-fade-in");
  const cvTeamRef = useAnimateIn("animate-fade-in");
  const ctaRef = useAnimateIn("animate-slide-up");

  // Prefetch Contact component when hovering the CTA button
  const prefetchContactForm = () => {
    import("./Contact.tsx");
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
          <hr className="header-line-break"></hr>
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
        <hr className="team-info-header-line-break"></hr>
        <div className="team-box" id="red-team-box" ref={redTeamRef}>
          <h2 className="team-heading">{t("team.red.title")}</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">{t("team.red.description")}</p>
          </div>
        </div>
        <div className="team-box" id="black-team-box" ref={blackTeamRef}>
          <h2 className="team-heading">{t("team.black.title")}</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">{t("team.black.description")}</p>
          </div>
        </div>
        <div className="team-box" id="cv-team-box" ref={cvTeamRef}>
          <h2 className="team-heading">{t("team.cv.title")}</h2>
          <hr className="team-header-line-break"></hr>
          <div>
            <p className="team-body">{t("team.cv.description")}</p>
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
}
export default Join;
