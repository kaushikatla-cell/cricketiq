const PLAYERS_KEY = "cricketiq_players";
const MATCHES_KEY = "cricketiq_matches";
const SEASONS_KEY = "cricketiq_seasons";

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorage(key, payload) {
  if (typeof window === "undefined") return { ok: true };
  try {
    const serialized = JSON.stringify(payload);
    localStorage.setItem(key, serialized);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save data.";
    const quota = /quota/i.test(message) ? "Browser storage is full. Export CSV backups, then reset data." : message;
    return { ok: false, error: quota };
  }
}

export function getPlayers() {
  if (typeof window === "undefined") return [];
  return parseJson(localStorage.getItem(PLAYERS_KEY), []);
}

export function getMatches() {
  if (typeof window === "undefined") return [];
  return parseJson(localStorage.getItem(MATCHES_KEY), []);
}

export function getSeasons() {
  if (typeof window === "undefined") return [];
  return parseJson(localStorage.getItem(SEASONS_KEY), []);
}

export function savePlayers(players) {
  return writeLocalStorage(PLAYERS_KEY, players);
}

export function saveMatches(matches) {
  return writeLocalStorage(MATCHES_KEY, matches);
}

export function saveSeasons(seasons) {
  return writeLocalStorage(SEASONS_KEY, seasons);
}

export function resetAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLAYERS_KEY);
  localStorage.removeItem(MATCHES_KEY);
  localStorage.removeItem(SEASONS_KEY);
}
