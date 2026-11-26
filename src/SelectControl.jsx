import { Children } from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// The native mirror preserves FormData and browser constraint validation.
// Radix owns keyboard navigation, typeahead, focus return and portal positioning.
export function SelectControl({ modern = true, children, ...props }) {
  const options = Children.toArray(children)
    .flatMap((child) =>
      child?.type === "optgroup"
        ? Children.toArray(child.props.children)
        : [child],
    )
    .filter((child) => child?.type === "option")
    .map((child) => ({
      value: String(child.props.value ?? child.props.children ?? ""),
      label: child.props.children,
      disabled: child.props.disabled,
    }));
  const value = String(props.value ?? props.defaultValue ?? "");
  const change = (value) =>
    props.onChange?.({ target: { value }, currentTarget: { value } });
  return (
    <span
      className={"choice-control " + (props.className || "")}
      style={props.style}
      data-modern={modern}
    >
      <Select.Root
        value={":" + value}
        onValueChange={(next) => change(next.slice(1))}
        disabled={props.disabled}
      >
        <Select.Trigger
          className="choice-trigger"
          aria-label={props["aria-label"]}
          aria-invalid={props["aria-invalid"]}
          aria-describedby={props["aria-describedby"]}
          title={props.title}
        >
          <Select.Value placeholder="Seçin" />
          <Select.Icon>
            <ChevronDown size={14} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            data-floating-panel="true"
            className="choice-menu"
            position="popper"
            sideOffset={6}
            collisionPadding={12}
          >
            <Select.ScrollUpButton className="choice-scroll">
              <ChevronUp size={16} />
            </Select.ScrollUpButton>
            <Select.Viewport>
              {options.map((option) => (
                <Select.Item
                  className="choice-option"
                  key={option.value}
                  value={":" + option.value}
                  disabled={option.disabled}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="choice-scroll">
              <ChevronDown size={16} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <select
        {...props}
        value={props.value}
        className="choice-validation"
        aria-hidden="true"
        tabIndex={-1}
      >
        {children}
      </select>
    </span>
  );
}
