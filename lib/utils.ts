import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertWeiToEth = (value: any) => {
  return (BigInt(value) / BigInt(1e18)).toString(); // Convert Wei to ETH as string
};
