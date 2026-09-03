import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUploadedPhotoUrl(json: {
  url?: string;
  data?: { url?: string };
}): string | undefined {
  return json.data?.url ?? json.url;
}
