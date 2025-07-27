import React from "react";
import { useTranslation } from "react-i18next";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ApplicationFormData } from "@/types";
import "../../stylesheets/Contact.css";

interface PersonalInfoSectionProps {
  register: UseFormRegister<ApplicationFormData>;
  errors: FieldErrors<ApplicationFormData>;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  register,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="form-section">
      <h3>{t("application.personal")}</h3>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">
            {t("application.name")} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            className={}
            {...register("name", {
              required: t("error.required"),
              minLength: {
                value: 2,
                message: t("error.name"),
              },
            })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            {t("application.email")} <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            className={}
            {...register("email", {
              required: t("error.required"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
                message: t("error.email"),
              },
            })}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="schoolEmail">
            {t("application.schoolEmail")} <span className="required">*</span>
          </label>
          <input
            type="email"
            id="schoolEmail"
            className={}
            {...register("schoolEmail", {
              required: t("error.required"),
              pattern: {
                value: /^[A-Z0-9._%+-]+@uwo.ca$/i,
                message: t("error.schoolEmail"),
              },
            })}
            aria-invalid={errors.schoolEmail ? "true" : "false"}
          />
          {errors.schoolEmail && (
            <span className="error-message">{errors.schoolEmail.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="studentId">
            {t("application.studentId")} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="studentId"
            className={}
            {...register("studentId", {
              required: t("error.required"),
              pattern: {
                value: /^d{8,10}$/,
                message: t("error.studentId"),
              },
            })}
            aria-invalid={errors.studentId ? "true" : "false"}
          />
          {errors.studentId && (
            <span className="error-message">{errors.studentId.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="program">
            {t("application.program")} <span className="required">*</span>
          </label>
          <input
            type="text"
            id="program"
            className={}
            {...register("program", {
              required: t("error.required"),
            })}
            aria-invalid={errors.program ? "true" : "false"}
          />
          {errors.program && (
            <span className="error-message">{errors.program.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
