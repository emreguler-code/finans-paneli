import { SmartSearch } from "./SmartSearch";
import { Children, isValidElement, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download } from "lucide-react";
import { SortFields } from "./SortHeader";

// Filter descriptors are the single source for search commands and suggestions.
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
    columnSorting = false,
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
    <ListActions {...{ sort, setSort, sortOptions, csv, columnSorting }} />
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

// CSV stays beside search; headerless lists use direct field labels.
export function ListActions({
  sort,
  setSort,
  sortOptions = [],
  csv,
  columnSorting = false,
  label = "Liste araçları",
  className = "",
}) {
  if (!csv && (columnSorting || !sortOptions.length)) return null;
  return (
    <div
      className={"common-toolbar content-tools " + className}
      role="group"
      aria-label={label}
    >
      {!columnSorting && (
        <SortFields {...{ sort, options: sortOptions }} onSort={setSort} />
      )}
      <div className="cari-toolbar-actions">
        {csv && (
          <button
            type="button"
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
