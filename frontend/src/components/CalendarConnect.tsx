import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { getCalendarStatus, connectCalendar } from "../api/calendar";

// Requests Google Calendar permission via Google Identity Services code flow.
// The auth code is sent to the backend, which exchanges it for tokens.
declare global {
  interface Window {
    google?: any;
  }
}

export function CalendarConnect() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getCalendarStatus().then(setConnected).catch(() => {});
  }, []);

  function connect() {
    if (!window.google) {
      alert("Google library not loaded yet. Please retry in a moment.");
      return;
    }
    const codeClient = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/calendar.events",
      ux_mode: "popup",
      callback: async (resp: { code: string }) => {
        if (resp.code) {
          await connectCalendar(resp.code);
          setConnected(true);
        }
      }
    });
    codeClient.requestCode();
  }

  if (connected) {
    return (
      <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
        Google Calendar connected
      </span>
    );
  }
  return (
    <Button variant="ghost" onClick={connect}>
      Connect Google Calendar
    </Button>
  );
}