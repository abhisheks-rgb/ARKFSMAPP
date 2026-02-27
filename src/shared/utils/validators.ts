/**
 * validators.ts — login field validation.
 * path: src/shared/utils/validators.ts
 */

const EMAIL_RE    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE    = /^\+?[0-9]{7,15}$/;
const USERNAME_RE = /^[a-zA-Z0-9_.]{3,30}$/;

export type IdentifierType = 'email' | 'phone' | 'username';

export function detectIdentifierType(value: string): IdentifierType {
  const v = value.trim();
  if (EMAIL_RE.test(v)) return 'email';
  if (PHONE_RE.test(v)) return 'phone';
  return 'username';
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export function validateIdentifier(value: string): ValidationResult {
  const v = value.trim();
  if (!v) return {valid: false, error: 'Username, email or phone is required'};

  const type = detectIdentifierType(v);
  if (type === 'email') {
    return EMAIL_RE.test(v)
      ? {valid: true, error: null}
      : {valid: false, error: 'Enter a valid email address'};
  }
  if (type === 'phone') {
    return PHONE_RE.test(v)
      ? {valid: true, error: null}
      : {valid: false, error: 'Enter a valid phone number (e.g. +919876543210)'};
  }
  if (v.length < 3)         return {valid: false, error: 'Username must be at least 3 characters'};
  if (v.length > 30)        return {valid: false, error: 'Username must be 30 characters or less'};
  if (!USERNAME_RE.test(v)) return {valid: false, error: 'Only letters, numbers, _ and . allowed'};
  return {valid: true, error: null};
}

export function validatePassword(value: string): ValidationResult {
  if (!value)           return {valid: false, error: 'Password is required'};
  if (value.length < 6) return {valid: false, error: 'Password must be at least 6 characters'};
  if (value.length > 128) return {valid: false, error: 'Password is too long'};
  return {valid: true, error: null};
}