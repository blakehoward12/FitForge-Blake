"use client";

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-5" style={{ borderTop: "1px solid var(--br)", borderBottom: "1px solid var(--br)" }}>
      <div
        className="flex gap-[60px] w-max"
        style={{ animation: `${reverse ? "marquee-reverse" : "marquee"} ${reverse ? "26s" : "22s"} linear infinite` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-[18px] whitespace-nowrap text-[16px] tracking-[3px]" style={{ ...bebas, color: "rgba(255,255,255,.18)" }}>
            {item}
            <span className="inline-block w-1 h-1 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, var(--og), var(--pl))" }} />
          </span>
        ))}
      </div>
    </div>
  );
}
