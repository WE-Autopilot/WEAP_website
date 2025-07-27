import React, { useState, useRef, useEffect, FC, ReactElement } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";
import "../stylesheets/Contact.css";
import { trackEvent, trackFormInteraction } from "../utils/analytics";
import {
  saveFormData,
  getSavedFormData,
  clearSavedFormData,
  debounce,
} from "../utils/persistence";
import {
  ApplicationFormData,
  Team,
  ValidationRules,
  TFunction,
  SubmissionResponse,
} from "../types";
import { applicationService, createDemoCSVDownload } from "../services/api";

// Form ID for persistence
const FORM_ID = "application-form";

// Extract validation rules to a separate utility
const validationRules: ValidationRules = {
  name: (t) => ({
    required: t("error.required"),
    maxLength: { value: 100, message: t("error.nameTooLong") },
  }),
  studentId: (t) => ({
    required: t("error.required"),
    pattern: {
      value: /^[0-9]{8,10}$/,
      message: t("error.studentId"),
    },
  }),
  email: (t) => ({
    required: t("error.required"),
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: t("error.email"),
    },
  }),
  schoolEmail: (t) => ({
    required: t("error.required"),
    pattern: {
      value: /^[^\s@]+@(?:[\w-]+\.)*uwo\.ca$/,
      message: t("error.schoolEmail"),
    },
  }),
  program: (t) => ({
    required: t("error.required"),
  }),
  team: (t) => ({
    required: t("error.teamRequired"),
  }),
  resumeUrl: (t, uploadMethod) => ({
    required: uploadMethod === "link" ? t("error.urlRequired") : false,
    pattern: {
      value: /^https?:\/\/.+/i,
      message: t("error.validUrl"),
    },
  }),
};

interface SavedDataNoticeProps {
  onRestore: () => void;
  onDiscard: () => void;
  t: TFunction;
}

// Saved data notification component
const SavedDataNotice: FC<SavedDataNoticeProps> = ({
  onRestore,
  onDiscard,
  t,
}) => (
  <div className="saved-data-notice">
    <div className="notice-icon">💾</div>
    <div className="notice-content">
      <p>{t("application.savedData")}</p>
      <div className="notice-actions">
        <button type="button" onClick={onRestore}>
          {t("application.restore")}
        </button>
        <button type="button" onClick={onDiscard}>
          {t("application.discard")}
        </button>
      </div>
    </div>
  </div>
);

interface StatusMessageProps {
  status: string | null;
  t: TFunction;
}

// Status message component
const StatusMessage: FC<StatusMessageProps> = ({ status, t }) => {
  if (!status) return null;

  if (status === "success") {
    return (
      <div className="submit-success" role="alert" aria-live="polite">
        <div className="success-icon">✓</div>
        <div className="success-message">
          <h3>{t("success.title")}</h3>
          <p>{t("success.message")}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="submit-error" role="alert" aria-live="assertive">
        <div className="error-icon">!</div>
        <div className="error-message">
          <h3>{t("error.title")}</h3>
          <p>{t("error.message")}</p>
        </div>
      </div>
    );
  }

  return null;
};

interface PersonalInfoSectionProps {
  register: any; // Will be replaced with proper react-hook-form type
  errors: Record<string, any>;
  t: TFunction;
  trackFormInteraction: (
    formName: string,
    fieldName: string,
    action: string
  ) => void;
}

// Personal information section component
const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({
  register,
  errors,
  t,
  trackFormInteraction,
}) => (
  <div className="form-section">
    <h3>{t("application.personal")}</h3>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="name">
          {t("application.name")} <span className="required">*</span>
        </label>
        <input
          id="name"
          {...register("name", validationRules.name(t))}
          className={errors.name ? "error" : ""}
          placeholder="John Smith"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          onFocus={() =>
            trackFormInteraction("Application Form", "name", "focus")
          }
          onBlur={() =>
            trackFormInteraction("Application Form", "name", "blur")
          }
        />
        {errors.name && (
          <span id="name-error" className="error-message">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="studentId">
          {t("application.studentId")} <span className="required">*</span>
        </label>
        <input
          id="studentId"
          {...register("studentId", validationRules.studentId(t))}
          className={errors.studentId ? "error" : ""}
          placeholder="250123456"
          aria-invalid={errors.studentId ? "true" : "false"}
          aria-describedby={errors.studentId ? "studentId-error" : undefined}
          onFocus={() =>
            trackFormInteraction("Application Form", "studentId", "focus")
          }
          onBlur={() =>
            trackFormInteraction("Application Form", "studentId", "blur")
          }
        />
        {errors.studentId && (
          <span id="studentId-error" className="error-message">
            {errors.studentId.message}
          </span>
        )}
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label htmlFor="email">
          {t("application.email")} <span className="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email", validationRules.email(t))}
          className={errors.email ? "error" : ""}
          placeholder="john.smith@gmail.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          onFocus={() =>
            trackFormInteraction("Application Form", "email", "focus")
          }
          onBlur={() =>
            trackFormInteraction("Application Form", "email", "blur")
          }
        />
        {errors.email && (
          <span id="email-error" className="error-message">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="schoolEmail">
          {t("application.schoolEmail")} <span className="required">*</span>
        </label>
        <input
          id="schoolEmail"
          type="email"
          {...register("schoolEmail", validationRules.schoolEmail(t))}
          className={errors.schoolEmail ? "error" : ""}
          placeholder="jsmith123@uwo.ca"
          aria-invalid={errors.schoolEmail ? "true" : "false"}
          aria-describedby={
            errors.schoolEmail ? "schoolEmail-error" : undefined
          }
          onFocus={() =>
            trackFormInteraction("Application Form", "schoolEmail", "focus")
          }
          onBlur={() =>
            trackFormInteraction("Application Form", "schoolEmail", "blur")
          }
        />
        {errors.schoolEmail && (
          <span id="schoolEmail-error" className="error-message">
            {errors.schoolEmail.message}
          </span>
        )}
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="program">
        {t("application.program")} <span className="required">*</span>
      </label>
      <input
        id="program"
        {...register("program", validationRules.program(t))}
        className={errors.program ? "error" : ""}
        placeholder="e.g., Computer Engineering, Year 2"
        aria-invalid={errors.program ? "true" : "false"}
        aria-describedby={errors.program ? "program-error" : undefined}
        onFocus={() =>
          trackFormInteraction("Application Form", "program", "focus")
        }
        onBlur={() =>
          trackFormInteraction("Application Form", "program", "blur")
        }
      />
      {errors.program && (
        <span id="program-error" className="error-message">
          {errors.program.message}
        </span>
      )}
    </div>
  </div>
);

interface TeamSelectionSectionProps {
  register: any; // Will be replaced with proper react-hook-form type
  errors: Record<string, any>;
  watch: any; // Will be replaced with proper react-hook-form type
  t: TFunction;
  teams: Team[];
  handleTeamKeyDown: (e: React.KeyboardEvent, teamId: string) => void;
  trackFormInteraction: (
    formName: string,
    fieldName: string,
    action: string
  ) => void;
}

// Team selection section component
const TeamSelectionSection: FC<TeamSelectionSectionProps> = ({
  register,
  errors,
  watch,
  t,
  teams,
  handleTeamKeyDown,
  trackFormInteraction,
}) => (
  <div className="form-section">
    <h3>{t("application.teamSelection")}</h3>
    <p className="form-description">{t("application.teamDesc")}</p>

    <div
      role="radiogroup"
      aria-labelledby="team-selection-label"
      className="team-selection"
    >
      <span id="team-selection-label" className="sr-only">
        {t("application.teamSelection")}
      </span>
      {teams.map((team) => (
        <div
          className={`team-card ${watch("team") === team.id ? "selected" : ""}`}
          key={team.id}
          tabIndex={0}
          role="radio"
          aria-checked={watch("team") === team.id}
          onKeyDown={(e) => handleTeamKeyDown(e, team.id)}
        >
          <input
            type="radio"
            id={`team-${team.id}`}
            value={team.id}
            {...register("team", {
              ...validationRules.team(t),
              onChange: () =>
                trackFormInteraction("Application Form", "team", team.id),
            })}
          />
          <label htmlFor={`team-${team.id}`}>
            <h4>{team.name}</h4>
            <p>{team.description}</p>
          </label>
        </div>
      ))}
    </div>

    {errors.team && (
      <span className="error-message">{errors.team.message}</span>
    )}
  </div>
);

interface ResumeUploadSectionProps {
  register: any; // Will be replaced with proper react-hook-form type
  errors: Record<string, any>;
  t: TFunction;
  uploadMethod: string;
  setUploadMethod: (method: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  trackFormInteraction: (
    formName: string,
    fieldName: string,
    action: string
  ) => void;
}

// Resume upload section component
const ResumeUploadSection: FC<ResumeUploadSectionProps> = ({
  register,
  errors,
  t,
  uploadMethod,
  setUploadMethod,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  isSubmitting,
  handleFileChange,
  trackFormInteraction,
}) => (
  <div className="form-section">
    <h3>{t("application.resume")}</h3>

    <div className="upload-options">
      <button
        type="button"
        className={`upload-option ${uploadMethod === "file" ? "active" : ""}`}
        onClick={() => setUploadMethod("file")}
      >
        {t("application.uploadFile")}
      </button>
      <button
        type="button"
        className={`upload-option ${uploadMethod === "link" ? "active" : ""}`}
        onClick={() => setUploadMethod("link")}
      >
        {t("application.provideLink")}
      </button>
    </div>

    {uploadMethod === "file" ? (
      <div className="form-group file-upload">
        <label htmlFor="resume">
          {t("application.resumeUpload")} <span className="required">*</span>
        </label>
        <div
          className={`file-upload-container ${!selectedFile ? "empty" : ""}`}
        >
          <input
            type="file"
            id="resume"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            aria-describedby="file-hint"
          />
          <div className="file-upload-button">
            <span>
              {selectedFile ? selectedFile.name : t("application.chooseFile")}
            </span>
            <button type="button" className="browse-button">
              {t("application.browse")}
            </button>
          </div>
          {selectedFile && (
            <button
              type="button"
              className="remove-file"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
                trackFormInteraction(
                  "Application Form",
                  "resume",
                  "file_removed"
                );
              }}
              aria-label={t("application.removeFile")}
            >
              ×
            </button>
          )}
        </div>
        {!selectedFile && isSubmitting && (
          <span className="error-message">{t("error.resumeRequired")}</span>
        )}
        <p id="file-hint" className="file-hint">
          {t("application.maxSize")}
        </p>
      </div>
    ) : (
      <div className="form-group">
        <label htmlFor="resumeUrl">
          {t("application.resumeUrl")} <span className="required">*</span>
        </label>
        <input
          id="resumeUrl"
          type="url"
          {...register("resumeUrl", validationRules.resumeUrl(t, uploadMethod))}
          className={errors.resumeUrl ? "error" : ""}
          placeholder="https://drive.google.com/your-resume"
          aria-invalid={errors.resumeUrl ? "true" : "false"}
          aria-describedby={errors.resumeUrl ? "resumeUrl-error" : undefined}
          onFocus={() =>
            trackFormInteraction("Application Form", "resumeUrl", "focus")
          }
          onBlur={() =>
            trackFormInteraction("Application Form", "resumeUrl", "blur")
          }
        />
        {errors.resumeUrl && (
          <span id="resumeUrl-error" className="error-message">
            {errors.resumeUrl.message}
          </span>
        )}
        <p className="url-hint">{t("application.urlHint")}</p>
      </div>
    )}
  </div>
);

interface FormActionsProps {
  isSubmitting: boolean;
  t: TFunction;
}

// Form submit button component
const FormActions: FC<FormActionsProps> = ({ isSubmitting, t }) => (
  <div className="form-actions">
    <button
      type="submit"
      disabled={isSubmitting}
      className={isSubmitting ? "submitting" : ""}
      aria-busy={isSubmitting ? "true" : "false"}
    >
      {isSubmitting ? (
        <>
          <span className="spinner" aria-hidden="true"></span>
          {t("application.submitting")}
        </>
      ) : (
        t("application.submit")
      )}
    </button>
  </div>
);

const Contact: FC = (): ReactElement => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<string>("file");
  const [hasSavedData, setHasSavedData] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<ApplicationFormData>({
    mode: "onBlur", // Validate on blur for better UX
  });

  const formValues = watch();

  // Team definitions
  const teams: Team[] = [
    {
      id: "red",
      name: t("team.red.title"),
      description: t("team.red.description"),
    },
    {
      id: "black",
      name: t("team.black.title"),
      description: t("team.black.description"),
    },
    {
      id: "cv",
      name: t("team.cv.title"),
      description: t("team.cv.description"),
    },
  ];

  // Check for saved form data on component mount
  useEffect(() => {
    const savedData = getSavedFormData(FORM_ID);
    if (savedData) {
      setHasSavedData(true);
    }

    // Track page view
    trackEvent("Page View", "view", "Application Form");

    return () => {
      // Track when user leaves the page
      trackEvent("Page", "exit", "Application Form");
    };
  }, []);

  // Setup autosave
  useEffect(() => {
    const debouncedSave = debounce(() => {
      if (
        Object.keys(formValues).some(
          (key) => formValues[key as keyof ApplicationFormData]
        )
      ) {
        saveFormData(FORM_ID, formValues);
      }
    }, 1000);

    // Only autosave if there are actual values
    if (
      Object.keys(formValues).some(
        (key) => formValues[key as keyof ApplicationFormData]
      )
    ) {
      debouncedSave();
    }

    return () => {
      // Save one last time when component unmounts
      if (
        Object.keys(formValues).some(
          (key) => formValues[key as keyof ApplicationFormData]
        )
      ) {
        saveFormData(FORM_ID, formValues);
      }
    };
  }, [formValues]);

  // Load saved form data
  const loadSavedData = () => {
    const savedData = getSavedFormData(FORM_ID);
    if (savedData) {
      Object.keys(savedData).forEach((key) => {
        setValue(key as keyof ApplicationFormData, savedData[key]);
      });
      setHasSavedData(false);
      trackEvent("Form", "restore_saved_data", "Application Form");
    }
  };

  // Clear saved form data
  const discardSavedData = () => {
    clearSavedFormData(FORM_ID);
    setHasSavedData(false);
    trackEvent("Form", "discard_saved_data", "Application Form");
  };

  // Validate form data
  const validateFormData = (data: ApplicationFormData): boolean => {
    if (uploadMethod === "file" && !selectedFile) {
      throw new Error(t("error.resumeRequired"));
    }
    return true;
  };

  // Handle form submission - broken into smaller functions with single responsibilities
  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    const startTime = performance.now();
    setIsSubmitting(true);
    trackEvent("Form", "submit_start", "Application Form");

    try {
      // 1. Validate form data (client-side)
      validateFormData(data);

      // 2. Create a FormData object to send the file
      const formData = new FormData();

      // Append all the text fields from your form
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key as keyof ApplicationFormData] as string);
      });

      // Append the other necessary fields
      formData.append("resumeMethod", uploadMethod);
      formData.append("timestamp", new Date().toISOString());

      // IMPORTANT: Append the actual file if it exists
      if (uploadMethod === "file" && selectedFile) {
        formData.append("resume", selectedFile, selectedFile.name);
      } else if (uploadMethod === "link" && data.resumeUrl) {
        formData.append("resumeData", data.resumeUrl);
      }

      // 3. Submit the FormData to the API service
      const response = await applicationService.submitApplication(formData);

      if (!response.success) {
        throw new Error(response.message || "Error submitting application");
      }

      // 4. Track successful submission
      const completionTime = performance.now() - startTime;
      trackEvent(
        "Form",
        "submit_success",
        "Application Form",
        Math.round(completionTime)
      );

      // 5. Reset form state
      setSubmitStatus("success");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      clearSavedFormData(FORM_ID);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
      trackEvent("Form", "submit_error", (error as Error).message);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      // Clear status after 8 seconds
      setTimeout(() => setSubmitStatus(null), 8000);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert(t("error.fileSize"));
        e.target.value = "";
        return;
      }

      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file.type)
      ) {
        alert(t("error.fileType"));
        e.target.value = "";
        return;
      }

      setSelectedFile(file);
      trackFormInteraction("Application Form", "resume", "file_selected");
    }
  };

  // Handle keyboard navigation for team selection
  const handleTeamKeyDown = (e: React.KeyboardEvent, teamId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setValue("team", teamId);
      trackFormInteraction("Application Form", "team", "keyboard_select");
    }
  };

  return (
    <div className="application-container">
      <h2>{t("application.title")}</h2>

      {/* Saved form data notification */}
      {hasSavedData && (
        <SavedDataNotice
          onRestore={loadSavedData}
          onDiscard={discardSavedData}
          t={t}
        />
      )}

      {/* Status messages */}
      <StatusMessage status={submitStatus} t={t} />

      {/* Hidden status announcer for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {submitStatus === "success" && t("success.message")}
        {submitStatus === "error" && t("error.message")}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="application-form"
        noValidate
        aria-label="Application Form"
      >
        {/* Personal information section */}
        <PersonalInfoSection
          register={register}
          errors={errors}
          t={t}
          trackFormInteraction={trackFormInteraction}
        />

        {/* Team selection section */}
        <TeamSelectionSection
          register={register}
          errors={errors}
          watch={watch}
          t={t}
          teams={teams}
          handleTeamKeyDown={handleTeamKeyDown}
          trackFormInteraction={trackFormInteraction}
        />

        {/* Resume upload section */}
        <ResumeUploadSection
          register={register}
          errors={errors}
          t={t}
          uploadMethod={uploadMethod}
          setUploadMethod={setUploadMethod}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          fileInputRef={fileInputRef}
          isSubmitting={isSubmitting}
          handleFileChange={handleFileChange}
          trackFormInteraction={trackFormInteraction}
        />

        {/* Form actions */}
        <FormActions isSubmitting={isSubmitting} t={t} />
      </form>
    </div>
  );
};

export default Contact;
