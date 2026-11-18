import { useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
export function TagInput({ value, onChange, options, selectOnFocus = false }) {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(-1),
    [filtering, setFiltering] = useState(false),
    anchor = useRef(null),
    id = useId();
  const filtered = filtering
    ? options.filter((v) =>
        v.toLocaleLowerCase("tr").includes(value.toLocaleLowerCase("tr")),
      )
    : options;
  const choose = (tag) => {
    if (!tag) return;
    setFiltering(false);
    onChange(tag);
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  };
  return (
    <span className="tag-control">
      <input
        ref={anchor}
        role="combobox"
        aria-label="Etiket (isteğe bağlı)"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={open ? id : undefined}
        aria-activedescendant={
          open && index >= 0 ? id + "-" + index : undefined
        }
        value={value}
        maxLength={80}
        onFocus={(e) => {
          if (selectOnFocus) e.target.select();
        }}
        placeholder="Genel"
        onChange={(e) => {
          onChange(e.target.value);
          setFiltering(true);
          setOpen(true);
          setIndex(-1);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) setFiltering(false);
            setOpen(true);
            setIndex((i) =>
              Math.max(
                0,
                Math.min(
                  filtered.length - 1,
                  i + (e.key === "ArrowDown" ? 1 : -1),
                ),
              ),
            );
          } else if (e.key === "Enter" && open && index >= 0) {
            e.preventDefault();
            choose(filtered[index]);
          } else if (e.key === "Tab") setOpen(false);
        }}
      />
      <button
        type="button"
        aria-label="Etiket seçenekleri"
        aria-expanded={open}
        onClick={() => {
          setFiltering(false);
          setIndex(-1);
          setOpen(!open);
        }}
      >
        <ChevronDown size={14} />
      </button>
      {open && (
        <FloatingPanel
          anchor={anchor.current?.parentElement}
          title="Etiket"
          autoFocus={false}
          onClose={() => {
            setOpen(false);
            setFiltering(false);
          }}
          width={240}
          maxPanelHeight={280}
          className="choice-panel"
        >
          <div id={id} role="listbox" aria-label="Etiketler">
            {filtered.map((tag, i) => (
              <button
                key={tag}
                id={id + "-" + i}
                role="option"
                aria-selected={tag === value}
                className={i === index ? "is-active" : ""}
                type="button"
                onClick={() => choose(tag)}
              >
                {tag}
              </button>
            ))}
            {!filtered.length && (
              <p className="calendar-hint">Yeni etiket: {value}</p>
            )}
          </div>
        </FloatingPanel>
      )}
    </span>
  );
}
