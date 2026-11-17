import { ArrowUp, ArrowDown } from "lucide-react";
import { nextSort, sortDirection, sortKey } from "./sorting.mjs";
export function SortLabel({
  label,
  field,
  sort,
  onSort,
  value,
  disabled = false,
}) {
  const active = value ? sort === value : sortKey(sort) === field;
  return (
    <button
      type="button"
      className="sort-label"
      disabled={disabled}
      aria-pressed={active}
      aria-description={
        active
          ? sortDirection(sort) === "ascending"
            ? "Artan sıra"
            : "Azalan sıra"
          : undefined
      }
      aria-label={label + " sıralaması"}
      onClick={() => onSort(value || nextSort(sort, field))}
    >
      {label}
      {active &&
        (sortDirection(sort) === "ascending" ? (
          <ArrowUp size={14} aria-hidden="true" />
        ) : (
          <ArrowDown size={14} aria-hidden="true" />
        ))}
    </button>
  );
}
export function SortHeader({ label, field, sort, onSort, right = false }) {
  return (
    <th
      scope="col"
      className={right ? "right" : undefined}
      aria-sort={sortKey(sort) === field ? sortDirection(sort) : undefined}
    >
      <SortLabel {...{ label, field, sort, onSort }} />
    </th>
  );
}
// For lists without a table, field names are the direct controls; no sort icon or popup.
export function SortFields({ sort, onSort, options, className = "" }) {
  if (!onSort || !options.length) return null;
  const unique = [];
  for (const [value, label] of options) {
    const key = sortKey(value);
    if (!unique.some((x) => x.key === key))
      unique.push({
        key,
        label: label.split(":")[0],
        value: /-(asc|desc)$/.test(value) ? undefined : value,
      });
  }
  return (
    <div
      className={"sort-fields " + className}
      role="group"
      aria-label="Sıralama başlıkları"
    >
      {unique.map(({ key, label, value }) => (
        <SortLabel
          key={key}
          label={label}
          field={key}
          value={value}
          {...{ sort }}
          onSort={onSort}
        />
      ))}
    </div>
  );
}
