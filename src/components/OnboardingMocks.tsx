import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export function WizardMock() {
  const step = 2;
  const total = 4;
  const items = ["Bechergläser", "10g Salz", "Gasbrenner"];

  return (
    <div data-mock-card className="w-64 rounded-[28px] bg-bg-soft border border-border shadow-2xl p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <ChevronLeft size={14} className="text-muted-2" />
        <span className="text-[10px] text-muted font-medium">
          Schritt {step} von {total}
        </span>
      </div>
      <div className="flex gap-1.5 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{
              background:
                i < step
                  ? "linear-gradient(90deg, var(--color-primary), var(--color-accent))"
                  : "var(--color-surface-2)",
            }}
          />
        ))}
      </div>
      <p className="text-[13px] font-bold leading-snug mb-1">Welche Materialien brauchst du?</p>
      <p className="text-[10px] text-muted mb-2.5 leading-snug">
        Füge alle Dinge hinzu, die du für den Versuch benötigst.
      </p>
      <div className="flex items-center gap-1.5 mb-2.5">
        <div className="flex-1 h-8 rounded-xl bg-surface border border-border px-3 flex items-center">
          <span className="text-[10px] text-muted-2">z.B. Bechergläser</span>
        </div>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
          }}
        >
          <Plus size={13} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div
            key={item}
            className="h-7 rounded-lg bg-surface/70 px-2.5 flex items-center justify-between"
          >
            <span className="text-[10px] font-medium">{item}</span>
            <ChevronRight size={11} className="text-muted-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function buildJuly2026() {
  const year = 2026;
  const month = 6;
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function CalendarMock() {
  const cells = buildJuly2026();
  const today = 29;
  const protocols = [
    { title: "Wie schnell löst sich Salz in Salzwasser…", progress: 60 },
    { title: "Wie beeinflusst die Temperatur die…", progress: 35 },
  ];

  return (
    <div data-mock-card className="w-64 rounded-[28px] bg-bg-soft border border-border shadow-2xl p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-bold">Kalender</span>
        <span className="text-[9px] text-muted-2">Zurück zu heute</span>
      </div>
      <div className="flex items-center justify-between mb-1.5">
        <ChevronLeft size={13} className="text-muted-2" />
        <span className="text-[10px] font-semibold">Juli 2026</span>
        <ChevronRight size={13} className="text-muted-2" />
      </div>
      <div className="grid grid-cols-7 mb-0.5">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <span key={d} className="text-[7px] text-muted-2 text-center font-medium">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 mb-2">
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-4">
            {d && (
              <span
                className="text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center"
                style={{
                  background: d === today ? "var(--color-primary)" : "transparent",
                  color: d === today ? "#0e1712" : "var(--color-ink)",
                  fontWeight: d === today ? 700 : 400,
                }}
              >
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-[9px] font-semibold text-muted mb-1.5">Heute</p>
      <div className="grid grid-cols-2 gap-2">
        {protocols.map((p) => (
          <div key={p.title} className="rounded-xl bg-surface/70 p-2 flex flex-col gap-1.5">
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: "linear-gradient(135deg, #4ade80, #15803d)" }}
            />
            <span className="text-[9px] font-medium leading-tight line-clamp-2">{p.title}</span>
            <div className="h-1 rounded-full bg-bg-soft overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${p.progress}%`,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
