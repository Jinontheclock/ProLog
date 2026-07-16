// Demo user name, shared across screens for the session. "Start Demo"
// leaves it unset (screens fall back to "Stranger"); signing up with a
// name — or editing it from Settings — personalizes the greeting and
// profile. Screens subscribe so an edit shows up everywhere at once.
let userName: string | null = null;
const listeners = new Set<() => void>();

export function setUserName(name: string): void {
  const trimmed = name.trim();
  userName = trimmed.length > 0 ? trimmed : null;
  listeners.forEach((l) => l());
}

export function displayName(): string {
  return userName ?? "Stranger";
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
