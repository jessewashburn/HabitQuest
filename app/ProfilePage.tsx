import { useState } from "react";

interface User {
  name: string;
  points: number;
  level: number;
}

interface ProfilePageProps {
  user?: User;
  readOnly?: boolean;
}

export default function ProfilePage({ user, readOnly = false }: ProfilePageProps) {
  const [theme, setTheme] = useState("Light");

  const points = user?.points ?? 0;
  const level = user?.level ?? 1;
  const name = user?.name ?? "User Profile";

  const handleSave = () => {
    if (readOnly) return;
    alert(`Preferences saved: Theme = ${theme}`);
  };

  const handleLogout = () => {
    if (readOnly) return;
    alert("Logging out...");
  };

  return (
    <main>
      <section id="profile">
        <h1>{name}</h1>
        <p><strong>Points:</strong> {points}</p>
        <p><strong>Level:</strong> {level}</p>

        <div>
          <label htmlFor="pref-theme">Theme:</label>
          <select
            id="pref-theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            disabled={readOnly}
          >
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>

        {!readOnly && (
          <>
            <button onClick={handleSave}>Save Preferences</button>
            <button onClick={handleLogout}>Log Out</button>
          </>
        )}
      </section>
    </main>
  );
}
