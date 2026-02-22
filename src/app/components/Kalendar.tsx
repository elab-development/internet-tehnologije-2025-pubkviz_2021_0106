"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
};

export default function Kalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/kalendar", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Greška pri dohvatanju podataka");
      }

      const data = await res.json();
      let items: Event[] = data.items || [];

      const now = new Date();

      // ✅ Filtriranje samo budućih događaja
      items = items.filter((event) => {
        const dateStr = event.start?.dateTime || event.start?.date;
        if (!dateStr) return false;

        const eventDate = new Date(dateStr);

        // Ako je all-day event (ima samo "date"), tretiraj ga kao kraj dana
        if (event.start.date && !event.start.dateTime) {
          eventDate.setHours(23, 59, 59, 999);
        }

        return eventDate >= now;
      });

      // ✅ Sortiranje po datumu (najbliži prvi)
      items.sort((a, b) => {
        const dateA = new Date(
          a.start?.dateTime || a.start?.date || ""
        ).getTime();

        const dateB = new Date(
          b.start?.dateTime || b.start?.date || ""
        ).getTime();

        return dateA - dateB;
      });

      setEvents(items);
    } catch (error) {
      console.error("Greška prilikom fetch-a kalendara:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Prvi fetch + automatski refresh na 30s
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (event: Event) => {
    const dateStr = event.start?.dateTime || event.start?.date;
    if (!dateStr) return "";

    const date = new Date(dateStr);

    return date.toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">
        📅 Budući termini pub kvizova
      </h2>

      {loading && <p>Učitavanje događaja...</p>}

      {!loading && events.length === 0 && (
        <p>Nema budućih događaja.</p>
      )}

      {!loading &&
        events.map((event) => (
          <div
            key={event.id}
            className="mb-4 p-3 bg-white rounded shadow-sm"
          >
            <h3 className="font-semibold text-lg">
              {event.summary || "Bez naziva"}
            </h3>
            <p className="text-gray-600">
              {formatDate(event)}
            </p>
          </div>
        ))}
    </div>
  );
}