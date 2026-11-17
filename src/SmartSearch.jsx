import { useEffect, useLayoutEffect, useId, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
import {
  activeField,
  multiField,
  parseSearch,
  searchSuggestions,
  selectedValues,
} from "./search-query.mjs";
const labelFor = (f, v) =>
  f.range
    ? [v.from, v.to].filter(Boolean).join(" – ")
    : f.check
      ? v
        ? "Evet"
        : "Hayır"
      : f.options.find((o) => String(o.value) === String(v))?.label || v;
export function SmartSearch({
  query = "",
  setQuery,
  placeholder = "Hareketlerde ara",
  reset,
  resultCount,
  fields = [],
  inline,
  host,
  onSearchSubmit,
  onSearchKeyDown,
  onSearchText,
  suggestions,
  activeSuggestion,
  searchFeedback,
  onFiltersApplied,
}) {
  const [text, setText] = useState(query),
    [opened, setOpened] = useState(false),
    [error, setError] = useState(""),
    [index, setIndex] = useState(-1),
    [composing, setComposing] = useState(false);
  const input = useRef(null),
    box = useRef(null),
    id = useId(),
    setter = useRef(setQuery);
  setter.current = setQuery;
  const today =
    fields.find((f) => f.range)?.child?.props.today ||
    new Date().toLocaleDateString("sv-SE");
  useLayoutEffect(() => setText(query), [query]);
  useEffect(() => {
    if (
      composing ||
      text.includes(":") ||
      text === query ||
      (text.trim().length > 0 && text.trim().length < 3)
    )
      return;
    const timer = setTimeout(() => setter.current(text.trim()), 300);
    return () => clearTimeout(timer);
  }, [text, query, composing]);
  const chips = fields.filter(activeField).flatMap((f) =>
    selectedValues(f.value).map((v) => ({
      field: f,
      value: v,
      label: f.label + ": " + labelFor(f, v),
    })),
  );
  const suggested = searchSuggestions(text, fields, today),
    show =
      opened &&
      suggested.length > 0 &&
      (!suggestions ||
        text.includes(":") ||
        !text.trim() ||
        suggested.some((s) => !s.hint));
  function apply(parsed) {
    if (parsed.errors.length) {
      setError(parsed.errors.join(" "));
      return false;
    }
    for (const f of new Set(parsed.filters.map((x) => x.field))) {
      const values = parsed.filters
        .filter((x) => x.field === f)
        .map((x) => x.value);
      f.change(
        multiField(f) && values.length > 1
          ? [...new Set(values)]
          : values.at(-1),
      );
    }
    setQuery(parsed.query);
    setText(parsed.query);
    onSearchText?.(parsed.query);
    setOpened(false);
    setIndex(-1);
    setError("");
    onFiltersApplied?.(parsed.query);
    return true;
  }
  function choose(s) {
    if (s.hint) {
      setText((s.prefix ? s.prefix + " " : "") + s.text);
      setIndex(-1);
      setOpened(true);
      input.current?.focus({ preventScroll: true });
      return;
    }
    const parsed = parseSearch(s.prefix || "", fields, { today });
    const existing = parsed.filters
      .filter((x) => x.field === s.field)
      .map((x) => x.value);
    const current = existing.length
      ? existing
      : activeField(s.field) && multiField(s.field)
        ? selectedValues(s.field.value)
        : [];
    parsed.filters = parsed.filters.filter((x) => x.field !== s.field);
    const values = multiField(s.field)
      ? [...new Set([...current, s.value])]
      : [s.value];
    parsed.filters.push(...values.map((value) => ({ field: s.field, value })));
    if (apply(parsed)) input.current?.focus({ preventScroll: true });
  }
  function remove(f, value) {
    const remaining = selectedValues(f.value).filter((v) => v !== value);
    f.change(
      remaining.length > 1
        ? remaining
        : remaining.length
          ? remaining[0]
          : f.empty,
    );
  }
  function submit(ev) {
    ev?.preventDefault();
    if (index >= 0 && suggested[index]) return choose(suggested[index]);
    const parsed = parseSearch(text, fields, { today });
    if (apply(parsed) && onSearchSubmit && !parsed.filters.length)
      onSearchSubmit();
  }
  function clear() {
    reset?.();
    setQuery("");
    setText("");
    onSearchText?.("");
    setError("");
    setOpened(false);
    setIndex(-1);
    input.current?.focus({ preventScroll: true });
  }
  return (
    <div className="page-search smart-search" ref={box}>
      <form
        className="smart-search-form"
        role="search"
        aria-label={placeholder}
        onSubmit={submit}
      >
        <div className="smart-search-box">
          <Search size={18} aria-hidden="true" />
          <div className="smart-search-content">
            {chips.map(({ field: f, value: v, label }) => (
              <button
                key={f.key + JSON.stringify(v)}
                type="button"
                className="search-token"
                aria-label={label + " filtresini kaldır"}
                title={label}
                onClick={() => remove(f, v)}
              >
                <span>{label}</span>
                <X size={12} />
              </button>
            ))}
            <input
              ref={input}
              id={inline ? "party-search" : "search"}
              aria-label={placeholder}
              placeholder={chips.length ? "Aramaya devam et…" : placeholder}
              enterKeyHint="search"
              value={text}
              role={fields.length ? "combobox" : undefined}
              aria-expanded={fields.length ? show : undefined}
              aria-autocomplete="list"
              aria-controls={show ? id + "-list" : undefined}
              aria-activedescendant={
                show && index >= 0 ? id + "-" + index : activeSuggestion
              }
              onFocus={() => setOpened(true)}
              onChange={(e) => {
                setText(e.target.value);
                setOpened(true);
                setIndex(-1);
                setError("");
                onSearchText?.(e.target.value);
              }}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              onKeyDown={(e) => {
                if (!(
                  show &&
                  ["ArrowDown", "ArrowUp", "Enter"].includes(e.key) &&
                  text.includes(":")
                ))
                  onSearchKeyDown?.(e);
                if (e.defaultPrevented) return;
                if (e.key === "ArrowDown" && show) {
                  e.preventDefault();
                  setIndex((i) => Math.min(suggested.length - 1, i + 1));
                }
                if (e.key === "ArrowUp" && show) {
                  e.preventDefault();
                  setIndex((i) => Math.max(0, i - 1));
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpened(false);
                  setIndex(-1);
                  setText(query);
                  setError("");
                }
                if (e.key === "Backspace" && !text && chips.length) {
                  const c = chips.at(-1);
                  remove(c.field, c.value);
                }
              }}
            />
          </div>
          <div className="smart-search-controls">
            {(text || query || chips.length > 0) && (
              <button
                type="button"
                className="search-clear"
                aria-label="Aramayı temizle"
                title="Temizle"
                onClick={clear}
              >
                <X size={16} />
              </button>
            )}
            {!inline && !chips.length && <kbd aria-hidden="true">Ctrl K</kbd>}
          </div>
        </div>
      </form>
      {show && (
        <FloatingPanel
          id={id}
          anchor={input.current}
          alignTo={box.current}
          width={Math.min(box.current?.clientWidth || 500, 760)}
          maxPanelHeight={360}
          title="Arama önerileri"
          autoFocus={false}
          className="smart-suggestions"
          onClose={() => {
            setOpened(false);
            setIndex(-1);
          }}
        >
          <div id={id + "-list"} role="listbox" aria-label="Arama filtreleri">
            {text && !text.includes(":") && (
              <button
                type="button"
                className="search-text-option"
                onClick={() => submit()}
              >
                Metinde “{text}” ara
              </button>
            )}
            {suggested.map((s, i) => (
              <button
                type="button"
                role="option"
                id={id + "-" + i}
                aria-selected={i === index}
                key={(s.field?.key || s.text) + JSON.stringify(s.value)}
                onClick={() => choose(s)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}
      {(error || searchFeedback) && (
        <p className="cari-error" role="alert">
          {error || searchFeedback}
        </p>
      )}
      {suggestions?.({ anchor: input.current, host, filters: show })}
      <span className="sr-only" role="status" aria-live="polite">
        {resultCount === undefined ? "" : resultCount + " sonuç"}
      </span>
    </div>
  );
}
