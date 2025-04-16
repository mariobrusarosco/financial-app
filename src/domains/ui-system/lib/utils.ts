import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names with Tailwind CSS utility classes
 * Uses clsx for conditional class names and twMerge to handle
 * Tailwind CSS conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 