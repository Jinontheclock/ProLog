// Demo user name, shared across screens for the session. "Start Demo"
// leaves it unset (screens fall back to "Stranger"); signing up with a
// name personalizes the greeting and profile.
let userName: string | null = null;

export function setUserName(name: string): void {
  const trimmed = name.trim();
  userName = trimmed.length > 0 ? trimmed : null;
}

export function displayName(): string {
  return userName ?? "Stranger";
}
