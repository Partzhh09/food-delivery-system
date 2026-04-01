const normalizeApiBase = (value) => {
  if (!value) return "";
  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const envApiBase = normalizeApiBase(
  import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL,
);

const runtimeApiBase =
  typeof window !== "undefined" && window.location?.hostname
    ? normalizeApiBase(
      `${window.location.protocol}//${window.location.hostname}:5000`,
    )
    : "http://localhost:5000/api";

export const API_BASE = envApiBase || runtimeApiBase;
