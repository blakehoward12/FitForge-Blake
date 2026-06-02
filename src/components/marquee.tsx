"use client";

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Repeat the list several times so the loop period (half the track) is always
  // wider than any viewport — otherwise translating -50% reveals empty space at
  // the end before the loop restarts. Duration scales with the copies so the
  // perceived scroll speed stays constant.
  const COPIES = 8;
  const repeated = Array.from({ length: COPIES }, () => items).flat();
  const duration = (reverse ? 26 : 22) * (COPIES / 2);
  return (
    <div className="overflow-hidden py-5" style={{ borderTop: "1px solid var(--br)", borderBottom: "1px solid var(--br)" }}>
      <div
        className="flex w-max"
        style={{ animation: `${reverse ? "marquee-reverse" : "marquee"} ${duration}s linear infinite` }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-[18px] whitespace-nowrap text-[16px] tracking-[3px] mr-[60px]" style={{ ...bebas, color: "rgba(255,255,255,.18)" }}>
            {item}
            <span className="inline-block w-1 h-1 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, var(--og), var(--pl))" }} />
          </span>
        ))}
      </div>
    </div>
  );
}
