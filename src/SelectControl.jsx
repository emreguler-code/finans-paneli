import { Children, useId, useRef, useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { FloatingPanel } from "./FloatingPanel";
// Native form participation plus an anchored, keyboard-operated listbox.
export function SelectControl({ modern = false, children, ...props }) {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    anchor = useRef(null),
    id = useId();
  useEffect(() => {
    if (open)
      document
        .getElementById(id + "-" + index)
        ?.scrollIntoView({ block: "nearest" });
  }, [open, index, id]);
  if (!modern) return <select {...props}>{children}</select>;
  const options = Children.toArray(children)
    .flatMap((child) =>
      child?.type === "optgroup"
        ? Children.toArray(child.props.children)
        : [child],
    )
    .filter((c) => c?.type === "option")
    .map((c) => ({
      value: String(c.props.value ?? ""),
      label: c.props.children,
      disabled: c.props.disabled,
    }));
  const selected = options.findIndex(
    (o) => o.value === String(props.value ?? ""),
  );
  const choose = (i) => {
    const option = options[i];
    if (!option || option.disabled) return;
    props.onChange?.({
      target: { value: option.value },
      currentTarget: { value: option.value },
    });
    setOpen(false);
    anchor.current?.focus({ preventScroll: true });
  };
  const label =
    props["aria-label"] ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <span className="choice-control">
      <button
        ref={anchor}
        type="button"
        role="combobox"
        className="choice-trigger"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? id : undefined}
        aria-activedescendant={open ? id + "-" + index : undefined}
        disabled={props.disabled}
        onClick={() => {
          setIndex(Math.max(0, selected));
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
            setIndex((i) =>
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? options.length - 1
                  : Math.max(
                      0,
                      Math.min(
                        options.length - 1,
                        open
                          ? i + (e.key === "ArrowDown" ? 1 : -1)
                          : Math.max(0, selected),
                      ),
                    ),
            );
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (open) choose(index);
            else {
              setIndex(Math.max(0, selected));
              setOpen(true);
            }
          } else if (e.key === "Tab") {
            setOpen(false);
          } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const i = options.findIndex((o) =>
              String(o.label)
                .toLocaleLowerCase("tr")
                .startsWith(e.key.toLocaleLowerCase("tr")),
            );
            if (i >= 0) {
              e.preventDefault();
              setIndex(i);
              setOpen(true);
            }
          }
        }}
      >
        <span>{options[selected]?.label || "Seçin"}</span>
        <ChevronDown size={14} />
      </button>
      <select
        {...props}
        className="choice-validation"
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </select>
      {open && (
        <FloatingPanel
          anchor={anchor.current}
          title={label || "Seçenekler"}
          onClose={() => setOpen(false)}
          autoFocus={false}
          width={Math.max(
            220,
            anchor.current?.getBoundingClientRect().width || 0,
          )}
          maxPanelHeight={300}
          className="choice-panel"
        >
          <div id={id} role="listbox" aria-label={label || "Seçenekler"}>
            {options.map((o, i) => (
              <button
                id={id + "-" + i}
                type="button"
                key={o.value}
                role="option"
                aria-selected={i === selected}
                disabled={o.disabled}
                className={i === index ? "is-active" : ""}
                onPointerMove={() => setIndex(i)}
                onClick={() => choose(i)}
              >
                <span>{o.label}</span>
                {i === selected && <Check size={16} />}
              </button>
            ))}
          </div>
        </FloatingPanel>
      )}
    </span>
  );
}
