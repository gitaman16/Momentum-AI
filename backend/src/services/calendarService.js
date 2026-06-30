import { google } from "googleapis";
import { User } from "../models/User.js";

// Builds an OAuth2 client. The same client is used for the auth-code exchange
// and for per-user API calls once tokens are stored.
export function oauthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT || "postmessage"
  );
}

// Exchange an auth code (from the frontend popup) for tokens and persist them.
export async function connectCalendar(userId, code) {
  const client = oauthClient();
  const { tokens } = await client.getToken(code);
  await User.findByIdAndUpdate(userId, {
    "google.accessToken": tokens.access_token,
    "google.refreshToken": tokens.refresh_token,
    "google.tokenExpiry": tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    "google.calendarConnected": true
  });
}

// Returns upcoming calendar events for the next 7 days, normalized for the
// Scheduling Agent. Returns [] if the user has not connected a calendar or if
// the call fails (calendar is an enhancement, never a hard dependency).
export async function getUpcomingEvents(user) {
  if (!user?.google?.calendarConnected || !user.google.refreshToken) return [];

  try {
    const client = oauthClient();
    client.setCredentials({
      access_token: user.google.accessToken,
      refresh_token: user.google.refreshToken
    });
    const calendar = google.calendar({ version: "v3", auth: client });
    const now = new Date();
    const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: weekAhead.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50
    });
    return (data.items || [])
      .filter((e) => e.start?.dateTime && e.end?.dateTime)
      .map((e) => ({ title: e.summary || "Busy", start: e.start.dateTime, end: e.end.dateTime }));
  } catch {
    return [];
  }
}

// Push an AI-generated study/work session onto the user's primary calendar.
export async function createEvent(user, { title, start, end }) {
  if (!user?.google?.calendarConnected || !user.google.refreshToken) return null;
  const client = oauthClient();
  client.setCredentials({
    access_token: user.google.accessToken,
    refresh_token: user.google.refreshToken
  });
  const calendar = google.calendar({ version: "v3", auth: client });
  const { data } = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      start: { dateTime: start },
      end: { dateTime: end }
    }
  });
  return data.id;
}
