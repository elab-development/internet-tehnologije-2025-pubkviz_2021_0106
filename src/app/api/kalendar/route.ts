import { NextResponse } from "next/server";

export async function GET() {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json(
      { error: "Nedostaje API key ili Calendar ID" },
      { status: 500 }
    );
  }

  const now = new Date();
  const future = new Date();
  future.setMonth(future.getMonth() + 6); // 6 meseci unapred

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`
  );

  url.searchParams.append("key", apiKey);
  url.searchParams.append("singleEvents", "true");
  url.searchParams.append("orderBy", "startTime");
  url.searchParams.append("timeMin", now.toISOString());
  url.searchParams.append("timeMax", future.toISOString()); 
  url.searchParams.append("maxResults", "2500");
  url.searchParams.append("timeZone", "Europe/Belgrade");

  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
    });

    const data = await res.json();

    console.log("Broj događaja:", data.items?.length);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Greška prilikom fetch-a" },
      { status: 500 }
    );
  }
}