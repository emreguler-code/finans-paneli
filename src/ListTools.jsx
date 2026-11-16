import { SmartSearch } from "./SmartSearch";
import {
  Children,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ArrowDownUp, Download } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
import { usePresence } from "./Motion";

// Stage controlled filter fields without running their page setters until Apply.
function fieldsIn(node, fields = [], path = "f", label = "") {
  Children.forEach(node, (child, index) => {
    if (!isValidElement(child)) return;
    const key = path + "." + index,
      p = child.props;
    const text =
      child.type === "label"
        ? Children.toArray(p.children)
            .filter((x) => typeof x === "string")
            .join("")
            .trim()
        : label;
    if (p.onChange && ("value" in p || "checked" in p || p.range)) {
      const range = Boolean(p.range),
        check = "checked" in p;
      const value = range
        ? { from: p.from || "", to: p.to || "" }
        : check
          ? p.checked
          : p.value;
      const options =
        child.type === "select"
          ? Children.toArray(p.children).flatMap((x) =>
              isValidElement(x) && x.type === "option"
                ? [
                    {
                      value: x.props.value ?? x.props.children,
                      label: x.props.children,
                    },
                  ]
                : [],
            )
          : [];
      fields.push({
        key,
        child,
        defaultRange: p.defaultRange,
        label: text || p.label || "Filtre",
        value,
        range,
        check,
        options,
        change: (value) =>
          p.onChange(range ? value : { target: { value, checked: value } }),
        empty: range
          ? { from: "", to: "" }
          : p["data-filter-default"] !== undefined
            ? p["data-filter-default"]
            : check
              ? (p["data-filter-default"] ?? false)
              : options.some((x) => x.value === "Tümü")
                ? "Tümü"
                : options.some((x) => x.value === "all")
                  ? "all"
                  : (options[0]?.value ?? ""),
      });
    } else fieldsIn(p.children, fields, key, text);
  });
  return fields;
}
export function ListTools(props) {
  const {
    query,
    setQuery,
    placeholder,
    reset,
    sort,
    setSort,
    sortOptions = [],
    csv,
    children,
    resultCount,
    searchEnabled = true,
    showActions = true,
    showFilters = true,
    onSearchSubmit,
    onSearchKeyDown,
    onSearchText,
    suggestions,
    activeSuggestion,
    searchFeedback,
    onFiltersApplied,
    placement = "header",
  } = props;
  const inline = placement === "inline",
    [host, setHost] = useState(null);
  useLayoutEffect(
    () => setHost(document.getElementById("page-search-host")),
    [],
  );
  const fields = showFilters ? fieldsIn(children) : [];
  const search = searchEnabled && (
    <SmartSearch
      {...{
        query,
        setQuery,
        placeholder,
        reset,
        resultCount,
        onSearchSubmit,
        onSearchKeyDown,
        onSearchText,
        suggestions,
        activeSuggestion,
        searchFeedback,
        onFiltersApplied,
        fields,
        inline,
        host,
      }}
    />
  );
  const actions = showActions && (
    <ListActions {...{ sort, setSort, sortOptions, csv }} />
  );
  return inline ? (
    <div className="inline-list-tools">
      {search}
      {actions}
    </div>
  ) : (
    <>
      {search && (host ? createPortal(search, host) : search)}
      {actions}
    </>
  );
}

// Content actions remain independent of the global search scope.
export function ListActions({
  sort,
  setSort,
  sortOptions = [],
  csv,
  label = "Liste araçları",
  className = "",
}) {
  const [sorting, setSorting] = useState(false),
    anchor = useRef(null);
  const presence = usePresence(sorting);
  if (!sortOptions.length && !csv) return null;
  return (
    <div
      className={"common-toolbar content-tools " + className}
      role="group"
      aria-label={label}
    >
      <div className="cari-toolbar-actions">
        {sortOptions.length > 0 && (
          <div className="sort-container">
            <button
              ref={anchor}
              className={"list-icon " + (sorting ? "active" : "")}
              aria-label="Sırala"
              title="Sırala"
              aria-expanded={sorting}
              onClick={() => setSorting(!sorting)}
            >
              <ArrowDownUp size={18} />
            </button>
            {presence.mounted && (
              <FloatingPanel
                anchor={anchor.current}
                title="Sıralama"
                width={280}
                exiting={!sorting}
                onClose={() => setSorting(false)}
              >
                <div className="sheet-scroll sort-options">
                  {sortOptions.map(([value, label]) => (
                    <button
                      key={value}
                      aria-pressed={sort === value}
                      onClick={() => {
                        setSort(value);
                        setSorting(false);
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </FloatingPanel>
            )}
          </div>
        )}
        {csv && (
          <button
            className="list-icon"
            aria-label="CSV indir"
            title="CSV indir"
            onClick={csv}
          >
            <Download size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
