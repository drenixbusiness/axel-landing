// Name shown in the laptop menu bar for each slide (kept apart from Screens.tsx, which loads later).
const APP_NAMES = ["Browser", "Browser", "Shifo CRM", "Studio", "Studio", "Terminal", "Browser"];

export function appName(i: number) {
  return APP_NAMES[i] ?? "Axel";
}
