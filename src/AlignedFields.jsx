import { useLayoutEffect, useRef } from "react";
export function AlignedFields({ children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const grid = ref.current,
      table = grid.closest("table");
    let frame;
    const layout = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const width = grid.clientWidth;
        if (!width) return;
        const cells = [
          ...(table
            ?.querySelector("tr.is-editing")
            ?.querySelectorAll(":scope > td[data-label]") || []),
        ];
        const desktop = table?.closest(".ledger-view")?.clientWidth >= 880;
        const tracks =
          desktop && cells.length
            ? cells
                .slice(0, -1)
                .map((c) => Math.max(1, c.getBoundingClientRect().width - 12))
            : Array(width < 480 ? 1 : 2).fill(
                (width - (width < 480 ? 0 : 12)) / (width < 480 ? 1 : 2),
              );
        if (desktop && tracks.length)
          tracks[tracks.length - 1] = Math.max(1, tracks.at(-1) - 12);
        grid.style.gridTemplateColumns = tracks.map((w) => w + "px").join(" ");
        let col = 0;
        for (const field of grid.children) {
          const label = [...field.childNodes]
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent)
            .join("");
          const min = field.classList.contains("compact-date")
            ? 145
            : Math.min(240, Math.max(155, label.length * 6));
          let span = 1;
          while (
            col + span < tracks.length &&
            tracks.slice(col, col + span).reduce((a, b) => a + b, 0) +
              12 * (span - 1) <
              min
          )
            span++;
          if (
            tracks.slice(col, col + span).reduce((a, b) => a + b, 0) +
              12 * (span - 1) <
              min &&
            col
          ) {
            col = 0;
            span = 1;
            while (
              span < tracks.length &&
              tracks.slice(0, span).reduce((a, b) => a + b, 0) +
                12 * (span - 1) <
                min
            )
              span++;
          }
          field.style.gridColumn = col + 1 + " / span " + span;
          col += span;
          if (col >= tracks.length) col = 0;
        }
      });
    };
    const observer = new ResizeObserver(layout);
    observer.observe(grid);
    if (table) observer.observe(table);
    layout();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [children]);
  return (
    <div className="inline-extra-grid" ref={ref}>
      {children}
    </div>
  );
}
