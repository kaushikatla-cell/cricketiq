const PLAYERS_KEY = "cricketiq_players";
const MATCHES_KEY = "cricketiq_matches";

function parseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
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

export function savePlayers(players) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function saveMatches(matches) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
}

export function resetAllData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLAYERS_KEY);
  localStorage.removeItem(MATCHES_KEY);
}
