// Splits a headline into word / character spans for scroll-scrubbed entrances.
// A seeded generator keeps the "random" offsets identical on server and client.

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export type SplitMode = "words" | "scatter" | "grid" | "weave" | "type";

export function Split({ text, seed = 1, mode = "words", spread = 0.5 }: { text: string; seed?: number; mode?: SplitMode; spread?: number }) {
  const r = rng(seed);
  const words = text.split(" ");
  const total = text.replace(/\s/g, "").length;
  let ci = 0;
  const round = (n: number) => Math.round(n * 1000) / 1000;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span className="txs" aria-hidden="true">
        {words.map((w, wi) => {
          const wordStyle: CSSVars = { "--th": round((wi / Math.max(1, words.length)) * spread + r() * 0.04) };
          return (
            <span key={wi}>
              {wi > 0 ? " " : null}
              <span className="w" style={wordStyle}>
                {mode === "words"
                  ? w
                  : [...w].map((c, k) => {
                      const i = ci++;
                      const ordered = (i / Math.max(1, total)) * spread;
                      let st: CSSVars;
                      if (mode === "scatter") {
                        st = { "--th": round(r() * spread), "--jx": `${round((r() - 0.5) * 60)}px`, "--jy": `${round((r() - 0.5) * 50)}px`, "--jr": `${round((r() - 0.5) * 40)}deg` };
                      } else if (mode === "grid") {
                        st = { "--th": round(ordered + r() * 0.06), "--jx": `${round(-18 - r() * 26)}px` };
                      } else if (mode === "weave") {
                        st = { "--th": round(ordered * 0.8 + r() * 0.08), "--jy": `${(i % 2 ? -1 : 1) * round(14 + r() * 12)}px` };
                      } else {
                        st = { "--th": round(ordered) };
                      }
                      return (
                        <span className="c" key={k} style={st}>
                          {c}
                        </span>
                      );
                    })}
              </span>
            </span>
          );
        })}
      </span>
    </>
  );
}
