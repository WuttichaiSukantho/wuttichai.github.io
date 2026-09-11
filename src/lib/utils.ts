import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

class ClassNames {
  public static merge(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
  }
}

export const cn = (...inputs: ClassValue[]): string => ClassNames.merge(...inputs);
