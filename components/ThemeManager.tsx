"use client";

import { useEffect } from "react";

const MEXICO_CITY_LATITUDE = 19.4326;
const MEXICO_CITY_LONGITUDE = -99.1332;
const MEXICO_CITY_TIME_ZONE = "America/Mexico_City";

function getMexicoCityDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: MEXICO_CITY_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  ) as Record<"year" | "month" | "day" | "hour" | "minute", number>;
}

function getDayOfYear(year: number, month: number, day: number): number {
  return Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86_400_000,
  );
}

function getSunTimeMinutes(
  year: number,
  month: number,
  day: number,
  isSunrise: boolean,
): number {
  const dayOfYear = getDayOfYear(year, month, day);
  const longitudeHour = MEXICO_CITY_LONGITUDE / 15;
  const approximateTime = dayOfYear + ((isSunrise ? 6 : 18) - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude =
    (meanAnomaly +
      1.916 * Math.sin((Math.PI / 180) * meanAnomaly) +
      0.02 * Math.sin((Math.PI / 180) * 2 * meanAnomaly) +
      282.634 +
      360) %
    360;
  let rightAscension =
    (180 / Math.PI) *
    Math.atan(0.91764 * Math.tan((Math.PI / 180) * trueLongitude));

  rightAscension = (rightAscension + 360) % 360;
  rightAscension +=
    Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin((Math.PI / 180) * trueLongitude);
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const zenith = 90.833;
  const cosHour =
    (Math.cos((Math.PI / 180) * zenith) -
      sinDeclination * Math.sin((Math.PI / 180) * MEXICO_CITY_LATITUDE)) /
    (cosDeclination * Math.cos((Math.PI / 180) * MEXICO_CITY_LATITUDE));

  const hourAngle = isSunrise
    ? 360 - (180 / Math.PI) * Math.acos(cosHour)
    : (180 / Math.PI) * Math.acos(cosHour);
  const localMeanTime =
    hourAngle / 15 + rightAscension - 0.06571 * approximateTime - 6.622;
  const utcHour = (localMeanTime - longitudeHour + 24) % 24;

  return ((utcHour - 6 + 24) % 24) * 60;
}

function isNightInMexicoCity(date = new Date()): boolean {
  const debugTheme = window.localStorage.getItem("fira-theme-debug");
  if (debugTheme === "night") return true;
  if (debugTheme === "day") return false;

  const parts = getMexicoCityDateParts(date);
  const currentMinutes = parts.hour * 60 + parts.minute;
  const sunrise = getSunTimeMinutes(parts.year, parts.month, parts.day, true);
  const sunset = getSunTimeMinutes(parts.year, parts.month, parts.day, false);

  return currentMinutes < sunrise || currentMinutes >= sunset;
}

function applyTheme() {
  const override = window.localStorage.getItem("fira-theme-override");
  if (override === "dark" || override === "light") {
    document.documentElement.dataset.theme = override;
    return;
  }

  document.documentElement.dataset.theme = isNightInMexicoCity() ? "dark" : "light";
}

export default function ThemeManager() {
  useEffect(() => {
    const updateTheme = () => applyTheme();

    updateTheme();
    window.addEventListener("focus", updateTheme);
    window.addEventListener("fira-theme-change", updateTheme);
    const interval = window.setInterval(updateTheme, 15 * 60 * 1000);

    return () => {
      window.removeEventListener("focus", updateTheme);
      window.removeEventListener("fira-theme-change", updateTheme);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
