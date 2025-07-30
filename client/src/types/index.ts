/**
 * Type definitions for the WEAP application
 */

/**
 * Application form data interface
 */
export interface ApplicationFormData {
  name: string;
  email: string;
  schoolEmail: string;
  studentId: string;
  program: string;
  team: string;
  resumeUrl?: string;
}

/**
 * Team definition interface
 */
export interface Team {
  id: string;
  name: string;
  description: string;
}

/**
 * Form validation rules interface
 */
export interface ValidationRules {
  name: (t: TFunction) => Record<string, any>;
  studentId: (t: TFunction) => Record<string, any>;
  email: (t: TFunction) => Record<string, any>;
  schoolEmail: (t: TFunction) => Record<string, any>;
  program: (t: TFunction) => Record<string, any>;
  team: (t: TFunction) => Record<string, any>;
  resumeUrl: (t: TFunction, uploadMethod: string) => Record<string, any>;
}

/**
 * Translation function type
 */
export type TFunction = (key: string) => string;

/**
 * Form submission response interface
 */
export interface SubmissionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string> | string[];
  data?: any;
}

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  category: string;
  action: string;
  label: string;
  value?: number | null;
  timestamp: number;
  url?: string;
  referrer?: string;
}
