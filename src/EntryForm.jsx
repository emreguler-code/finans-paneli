import { useState, useId } from "react";
import { createPortal } from "react-dom";
export function FormSection({
  title,
  summary,
  children,
  optional = false,
  open = false,
  region,
}) {
  return optional ? (
    <details
      data-region={region}
      className="entry-section entry-fold"
      open={open || undefined}
    >
      <summary>
        <span>{title}</span>
        {summary && <small>{summary}</small>}
      </summary>
      <div className="entry-section-fields">{children}</div>
    </details>
  ) : (
    <section data-region={region} className="entry-section">
      <h3>{title}</h3>
      <div className="entry-section-fields">{children}</div>
    </section>
  );
}
export function EntryForm({ onSubmit, children, className = "", id }) {
  const [issues, setIssues] = useState([]),
    issueId = useId();
  function clear() {
    issues.forEach(({ control, previous }) => {
      control.removeAttribute("aria-invalid");
      if (previous) control.setAttribute("aria-describedby", previous);
      else control.removeAttribute("aria-describedby");
    });
    setIssues([]);
  }
  function submit(event) {
    event.preventDefault();
    clear();
    const invalid = [...event.currentTarget.elements].filter(
      (n) => n.willValidate && !n.validity.valid,
    );
    if (invalid.length) {
      const next = invalid.map((node, i) => {
        const label = node.closest("label");
        const name = label
          ? [...label.childNodes]
              .filter((n) => n.nodeType === 3)
              .map((n) => n.textContent)
              .join("")
              .replace("*", "")
              .trim()
          : node.getAttribute("aria-label") || "Bu alan";
        const message = node.validity.valueMissing
          ? `${name} alanını doldurun.`
          : node.validity.typeMismatch
            ? `${name} için geçerli bir değer girin.`
            : `${name} değerini kontrol edin.`;
        const key = issueId + "-" + i,
          control =
            node.classList.contains("date-validation") ||
            node.classList.contains("choice-validation")
              ? node.previousElementSibling
              : node,
          previous = control.getAttribute("aria-describedby");
        control.setAttribute("aria-invalid", "true");
        control.setAttribute(
          "aria-describedby",
          [previous, key].filter(Boolean).join(" "),
        );
        return { node, control, label, message, key, previous };
      });
      setIssues(next);
      focus(next[0].node);
      return;
    }
    onSubmit(event);
  }
  function focus(node) {
    let parent = node.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") parent.open = true;
      parent = parent.parentElement;
    }
    const target =
      node.classList.contains("date-validation") ||
      node.classList.contains("choice-validation")
        ? node.previousElementSibling
        : node;
    requestAnimationFrame(() => {
      target?.scrollIntoView({ block: "nearest" });
      target?.focus({ preventScroll: true });
    });
  }
  return (
    <form
      id={id}
      className={"finance-form entry-form " + className}
      noValidate
      onSubmit={submit}
      onInput={() => {
        if (issues.length) clear();
      }}
      onChange={() => {
        if (issues.length) clear();
      }}
    >
      {issues.length > 0 && (
        <div className="entry-errors" role="alert">
          <strong>Kaydetmek için işaretli alanları kontrol edin.</strong>
          {issues.map((issue) => (
            <button
              type="button"
              key={issue.key}
              onClick={() => focus(issue.node)}
            >
              {issue.message}
            </button>
          ))}
        </div>
      )}
      {children}
      {issues
        .filter((x) => x.label)
        .map((issue) =>
          createPortal(
            <span className="field-error" id={issue.key}>
              {issue.message}
            </span>,
            issue.label,
            issue.key,
          ),
        )}
    </form>
  );
}
