export const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const hueFor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

export const extractAcronym = (designation: string) => {
  const match = designation.match(/\(([^)]+)\)/);
  if (match) return match[1];
  const words = designation.trim().split(/\s+/);
  if (words.length === 1) return designation;
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

export const formatMinAssets = (min?: string) => {
  if (!min) return "No minimum";
  const raw = String(min).trim();
  if (!raw) return "No minimum";
  const numeric = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isNaN(numeric) && numeric === 0) return "No minimum";
  if (!Number.isNaN(numeric) && numeric > 0) return `$${numeric.toLocaleString()}`;
  return raw.startsWith("$") ? raw : `$${raw}`;
};

export const advisorLocation = (city?: string, state?: string) =>
  [city, state].filter(Boolean).join(", ");
