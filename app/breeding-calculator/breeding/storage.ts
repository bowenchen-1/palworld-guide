const KEY = "palworld-guide.available-pals.v1";
export function readAvailablePals() { try { const value = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(value) && value.every((id) => typeof id === "string") ? value : []; } catch { return []; } }
export function saveAvailablePals(ids: string[]) { try { localStorage.setItem(KEY, JSON.stringify([...new Set(ids)])); } catch { /* storage is optional */ } }
