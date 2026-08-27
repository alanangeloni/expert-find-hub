import { ADVISOR_SERVICES } from "./advisorServices";
import { SPECIALTY_DEFINITIONS } from "./definitions";

export const ALL_SERVICES: string[] = [...ADVISOR_SERVICES];

export const serviceSlug = (service: string) =>
  service
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const serviceFromSlug = (slug: string): string | undefined =>
  ALL_SERVICES.find((s) => serviceSlug(s) === slug);

export const serviceDefinition = (service: string): string =>
  SPECIALTY_DEFINITIONS[service] ||
  `Financial professionals who focus on ${service.toLowerCase()} for individuals and families.`;

const lower = (service: string) => service.toLowerCase();

export const serviceChecklist = (service: string): string[] => [
  `Direct, ongoing experience with ${lower(service)}, not just a passing mention on their profile.`,
  "Fiduciary status, so their advice is legally required to serve your interests first.",
  "Relevant credentials such as CFP, CFA, CPA, or a designation specific to your situation.",
  "A fee structure you understand up front: flat fee, hourly, or a percentage of assets.",
  "A minimum investment requirement that matches where you are today.",
  "Clear communication and a service cadence that fits how often you want to meet.",
];

export interface ServiceFaq {
  q: string;
  a: string;
}

export const serviceFaqs = (service: string): ServiceFaq[] => [
  {
    q: `What does a financial professional who specializes in ${lower(service)} do?`,
    a: serviceDefinition(service),
  },
  {
    q: `How much does help with ${lower(service)} cost?`,
    a: "It depends on the fee model. Fee-only professionals typically charge a flat project fee, an hourly rate, or roughly 0.5% to 1.25% of the assets they manage each year. Every profile in this directory lists its fee structure and minimum so you can compare before reaching out.",
  },
  {
    q: `How do I choose the right professional for ${lower(service)}?`,
    a: "Shortlist two or three professionals whose specialties, fees, and minimums fit your situation, compare them side by side, then request an introduction. First conversations are free, and you are never obligated to work with anyone you meet through the directory.",
  },
];
