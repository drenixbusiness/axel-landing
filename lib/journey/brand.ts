// The business name a visitor types into the laptop, shared by the hero and the finale card.
import { useSyncExternalStore } from "react";

let brand = "";
const subscribers = new Set<() => void>();

export function setBrand(value: string) {
  brand = value;
  subscribers.forEach((notify) => notify());
}

export function useBrand() {
  return useSyncExternalStore(
    (notify) => {
      subscribers.add(notify);
      return () => subscribers.delete(notify);
    },
    () => brand,
    () => "",
  );
}

export function contactHref(name: string) {
  const v = name.trim();
  return `/contact${v ? `?brand=${encodeURIComponent(v)}` : ""}`;
}
