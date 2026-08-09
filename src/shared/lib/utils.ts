/**
 * Utility functions for The Home Pizza
 * Common helpers for formatting, validation, etc.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine classnames and resolve conflicting Tailwind utilities
 * (e.g. `cn('px-2', condition && 'px-4')` keeps only `px-4`)
 */
export const cn = (...classes: ClassValue[]): string => {
  return twMerge(clsx(classes));
};

/**
 * Format price to USD currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * The restaurant's own timezone, pinned so a published date reads the same
 * whether a page was prerendered on a CI box in UTC or rendered locally.
 * Without it, an evening post in Vietnam prints as the previous day.
 */
const SITE_TIME_ZONE = 'Asia/Ho_Chi_Minh';

/**
 * `dd/MM/yyyy HH:mm` — the timestamp under a story card, as the design
 * writes it. Fixed rather than locale-dependent because the format is part
 * of the layout: `en-US` would flip it to `3/6/2023, 10:59 AM` and reflow
 * the card.
 */
export const formatStoryTimestamp = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SITE_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${get('day')}/${get('month')}/${get('year')} ${get('hour')}:${get('minute')}`;
};

/**
 * Short published date for an article byline — "23 thg 2" in Vietnamese,
 * "23 Feb" in English. Locale-dependent on purpose here, unlike the card
 * timestamp above: it sits inline in a sentence rather than in a fixed slot.
 */
export const formatStoryByline = (date: Date | string, locale: string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'vi-VN', {
    timeZone: SITE_TIME_ZONE,
    day: 'numeric',
    month: 'short',
  }).format(d);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

/**
 * Check if string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Sleep/delay function for async operations
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (el: Element): boolean => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Get URL search params as object
 */
export const getSearchParams = (query: string): Record<string, string> => {
  const params = new URLSearchParams(query);
  const obj: Record<string, string> = {};

  params.forEach((value, key) => {
    obj[key] = value;
  });

  return obj;
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, string | number | boolean>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

/**
 * Generate a unique ID
 */
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Clamp a number between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Lerp (linear interpolation) between two values
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};
