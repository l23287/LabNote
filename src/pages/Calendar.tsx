import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProtocolsForUser } from "../lib/storage";
import { ProtocolCard } from "../components/ProtocolCard";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  return dateKey(a) === dateKey(b);
}

export function CalendarPage() {
  const { user } = useAuth();
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const protocols = useMemo(
    () => (user ? getProtocolsForUser(user.id) : []),
    [user],
  );

  const protocolsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of protocols) {
      const key = dateKey(new Date(p.createdAt));
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [protocols]);

  const lastProtocolLabel = useMemo(() => {
    if (protocols.length === 0) return "Du hast noch kein Protokoll erstellt.";
    const last = new Date(protocols[0].createdAt);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / 86_400_000);
    if (diffDays <= 0) return "Zuletzt erstellt: heute";
    if (diffDays === 1) return "Zuletzt erstellt: gestern";
    return `Zuletzt erstellt: vor ${diffDays} Tagen`;
  }, [protocols, today]);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result: (Date | null)[] = Array.from({ length: startOffset }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      result.push(new Date(year, month, day));
    }
    return result;
  }, [cursor]);

  const selectedDayProtocols = protocols.filter((p) => sameDay(new Date(p.createdAt), selected));

  return (
    <div className="min-h-dvh px-6 pt-8 pb-32">
      <h1 className="font-display text-2xl font-extrabold mb-1">Kalender</h1>
      <p className="text-muted text-sm mb-6">{lastProtocolLabel}</p>

      <div className="rounded-3xl bg-surface border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-display font-bold">
            {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
          </span>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="w-9 h-9 rounded-full bg-bg-soft flex items-center justify-center"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-[11px] text-muted-2 font-semibold">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const isToday = sameDay(d, today);
            const isSelected = sameDay(d, selected);
            const hasProtocol = protocolsByDay.has(dateKey(d));

            return (
              <button
                key={i}
                onClick={() => setSelected(d)}
                className="flex flex-col items-center gap-1"
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isSelected
                      ? "text-white font-semibold"
                      : isToday
                        ? "text-primary font-semibold"
                        : "text-ink"
                  }`}
                  style={
                    isSelected
                      ? {
                          background:
                            "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
                        }
                      : isToday
                        ? { border: "1px solid var(--color-primary)" }
                        : undefined
                  }
                >
                  {d.getDate()}
                </span>
                <span
                  className="w-1 h-1 rounded-full"
                  style={{
                    background: hasProtocol ? "var(--color-accent)" : "transparent",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display font-bold mb-4">
          {sameDay(selected, today) ? "Heute" : selected.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "long",
          })}
        </h2>

        {selectedDayProtocols.length === 0 ? (
          <p className="text-muted text-sm">An diesem Tag wurde kein Protokoll erstellt.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedDayProtocols.map((p, i) => (
              <ProtocolCard key={p.id} protocol={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
