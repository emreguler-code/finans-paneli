import { useInlinePlacement } from "./InlineRecords";
import { DiscardConfirmation } from "./OverlayLayer";
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X, Plus, SlidersHorizontal } from "lucide-react";
import { Sheet } from "./ui";
import { PageHeading } from "./PageLayout";
import { useNavigation } from "./Navigation";
function flat(children) {
  return Children.toArray(children).flatMap((node) =>
    isValidElement(node) && node.type === Fragment
      ? flat(node.props.children)
      : [node],
  );
}
function Columns({ children, page, preview }) {
  const nodes = flat(children),
    main = [],
    side = [],
    helpers = [];
  const [more, setMore] = useState(false);
  for (const node of nodes) {
    if (
      !page &&
      isValidElement(node) &&
      node.props.className === "entry-effect"
    )
      side.push(node);
    else if (
      isValidElement(node) &&
      (node.props.optional ||
        node.props.region === "aside" ||
        node.type === "details")
    )
      side.push(node);
    else if (
      isValidElement(node) &&
      ["entry-effect", "cari-error", "cari-hint"].some((c) =>
        node.props.className?.split(" ").includes(c),
      )
    )
      helpers.push(node);
    else main.push(node);
  }
  if (page)
    side.sort(
      (a, b) =>
        Number(a.props?.title === "Mevcut borçla başlat") -
        Number(b.props?.title === "Mevcut borçla başlat"),
    );
  return page ? (
    <div className="entry-columns">
      <div className="panel entry-main">
        {main}
        {helpers}
      </div>
      <aside className="entry-aside">
        {preview && (
          <section className="panel entry-preview">{preview}</section>
        )}
        {side.length > 0 && <div className="panel entry-secondary">{side}</div>}
      </aside>
    </div>
  ) : (
    <>
      <div className="dock-primary">
        {main}
        {side.length > 0 && (
          <div className="dock-more-field">
            <span>Diğer</span>
            <button
              type="button"
              className="list-icon dock-more"
              aria-label="Diğer seçenekler"
              title="Diğer seçenekler"
              aria-expanded={more}
              onClick={() => setMore(!more)}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        )}
        {helpers}
      </div>
      {side.length > 0 && (
        <details
          className="dock-options"
          open={more}
          onToggle={(e) => setMore(e.currentTarget.open)}
        >
          <summary>Diğer seçenekler</summary>
          <div className="dock-option-fields">
            {side.map((node, i) =>
              isValidElement(node) && node.props.optional
                ? cloneElement(node, { key: node.key || i, optional: false })
                : node,
            )}
          </div>
        </details>
      )}
    </>
  );
}
export function EntrySurface({
  title,
  onClose,
  children,
  busy = false,
  variant = "dock",
  preview,
  collapsible = false,
  autoFocus = true,
  resetKey,
  externalFormId,
}) {
  const placed = useInlinePlacement();
  if (placed) {
    variant = "inline";
    collapsible = false;
    autoFocus = false;
  }
  const anchor = useRef(null),
    collapse = useRef(null);
  const [collapsed, setCollapsed] = useState(false),
    toggle = useRef(null);
  const ref = useRef(null),
    base = useRef(null),
    close = useRef(null);
  const [discard, setDiscard] = useState(false),
    pending = useRef(null),
    busyRef = useRef(busy);
  busyRef.current = busy;
  const id = useId(),
    nav = useNavigation();
  const fingerprint = () =>
    JSON.stringify(
      [
        ...(externalFormId
          ? document.getElementById(externalFormId)?.elements || []
          : ref.current?.querySelectorAll(
              "form input,form select,form textarea",
            ) || []),
      ]
        .filter((n) => ["INPUT", "SELECT", "TEXTAREA"].includes(n.tagName))
        .filter(
          (n) =>
            !n.closest(".choice-control") ||
            n.classList.contains("choice-validation"),
        )
        .filter(
          (n) => n.type !== "hidden" || n.hasAttribute("data-draft-value"),
        )
        .map((n) => [
          n.name ||
            n.id ||
            n.getAttribute("aria-label") ||
            n.closest("label")?.textContent,
          n.type,
          n.type === "checkbox" ? n.checked : n.value,
        ])
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
    );
  function request(action = onClose) {
    if (busy) return;
    if (base.current !== null && fingerprint() !== base.current) {
      pending.current = action;
      setDiscard(true);
    } else action();
  }
  close.current = request;
  collapse.current = () => {
    if (!collapsed) foldComposer();
  };
  useLayoutEffect(() => {
    if (variant === "modal") return;
    const previous = document.activeElement;
    base.current = fingerprint();
    autoFocus &&
      ref.current
        ?.querySelector(
          "form select,form input:not([type=hidden]):not([aria-hidden=true]),form .date-trigger",
        )
        ?.focus({ preventScroll: true });
    const key = (e) => {
      if (e.defaultPrevented) return;
      const confirm = ref.current?.querySelector(".discard-confirm");
      if (confirm && e.key === "Tab") {
        const buttons = [...confirm.querySelectorAll("button")];
        if (e.shiftKey && document.activeElement === buttons[0]) {
          e.preventDefault();
          buttons.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === buttons.at(-1)) {
          e.preventDefault();
          buttons[0]?.focus();
        }
        return;
      }
      if (confirm && e.key === "Escape") {
        e.preventDefault();
        setDiscard(false);
        return;
      }
      if (e.key === "Escape" && !e.target.closest?.("[data-floating-panel]")) {
        e.preventDefault();
        if (collapsible) {
          collapse.current();
        } else close.current();
      }
    };
    const unload = (e) => {
      if (base.current !== null && fingerprint() !== base.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    document.addEventListener("keydown", key);
    window.addEventListener("beforeunload", unload);
    const block = (action) => close.current(action);
    block.needsGuard = () =>
      busyRef.current ||
      (base.current !== null && fingerprint() !== base.current);
    const unblock = nav?.setBlocker?.(block);
    return () => {
      unblock?.();
      document.removeEventListener("keydown", key);
      window.removeEventListener("beforeunload", unload);
      previous?.focus?.({ preventScroll: true });
    };
  }, [variant]);
  useLayoutEffect(() => {
    if (externalFormId) {
      const scope = ref.current?.closest("tbody");
      scope?.querySelectorAll("input,select,textarea").forEach((n) => {
        if (n.closest("[data-editor-slot]"))
          n.setAttribute("form", externalFormId);
      });
    }
    base.current = fingerprint();
  }, [resetKey]);
  useEffect(() => {
    if (discard) ref.current?.querySelector(".discard-confirm button")?.focus();
  }, [discard]);
  useLayoutEffect(() => {
    if (variant !== "dock") return;
    const root = document.documentElement;
    const resize = () => {
      root.style.setProperty(
        "--composer-height",
        ref.current.getBoundingClientRect().height + "px",
      );
      const host = ref.current.closest("#entry-dock-root");
      if (host)
        host.classList.toggle(
          "composer-folded",
          ref.current.classList.contains("is-collapsed"),
        );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(ref.current);
    root.classList.add("composer-open");
    resize();
    return () => {
      observer.disconnect();
      root.classList.remove("composer-open");
      root.style.removeProperty("--composer-height");
      ref.current
        ?.closest("#entry-dock-root")
        ?.classList.remove("composer-folded");
    };
  }, [variant, collapsed]);
  function foldComposer() {
    if (!collapsed) {
      const r = toggle.current.getBoundingClientRect();
      anchor.current = {
        right: innerWidth - r.right,
        bottom: innerHeight - r.bottom,
      };
    }
    setCollapsed(!collapsed);
    toggle.current?.focus({ preventScroll: true });
  }
  if (variant === "modal")
    return <Sheet {...{ title, onClose, busy }}>{children}</Sheet>;
  const page = variant === "page",
    inline = variant === "inline";
  const form = isValidElement(children)
    ? cloneElement(
        children,
        {
          id: externalFormId || id,
          className: (children.props.className || "") + " surface-form",
        },
        Children.map(children.props.children, (node) => {
          if (!isValidElement(node)) return node;
          if (
            !page &&
            !inline &&
            !collapsible &&
            node.props.className === "sheet-footer"
          )
            return cloneElement(
              node,
              {},
              <>
                {node.props.children}
                <button
                  type="button"
                  className="list-icon"
                  aria-label="Paneli kapat"
                  title="Kapat"
                  disabled={busy || discard}
                  onClick={() => request()}
                >
                  <X size={18} />
                </button>
              </>,
            );
          if (node.props.className !== "sheet-scroll") return node;
          const content = flat(node.props.children).flatMap((n) =>
            isValidElement(n) &&
            n.type === "fieldset" &&
            n.props.className === "tracking-fields"
              ? flat(n.props.children)
              : [n],
          );
          return inline
            ? node
            : cloneElement(
                node,
                {},
                <Columns {...{ page, preview }}>{content}</Columns>,
              );
        }),
      )
    : children;
  const content = (
    <section
      ref={ref}
      data-entry="true"
      data-record-inline={placed || undefined}
      role={page || collapsible || inline ? "region" : "dialog"}
      aria-modal={page || collapsible || inline ? undefined : "false"}
      aria-label={title}
      className={
        "entry-surface " +
        (page
          ? "entry-page finance-page"
          : inline
            ? "entry-inline"
            : "entry-dock") +
        (collapsible ? " persistent-composer" : "") +
        (collapsed ? " is-collapsed" : "")
      }
    >
      {page ? (
        <PageHeading
          title={title}
          subtitle="Temel bilgileri girin, ayrıntıları ihtiyaç oldukça tamamlayın."
          back={() => request()}
          backLabel="Geri dön"
          actions={
            <>
              <button
                type="button"
                className="secondary-button"
                disabled={busy || discard}
                onClick={() => request()}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                form={id}
                className="primary-button"
                disabled={busy || discard}
              >
                {busy ? "Kaydediliyor…" : "Kaydet"}
              </button>
            </>
          }
        />
      ) : null}
      <div
        hidden={collapsed}
        inert={collapsed || discard || busy || undefined}
        className="surface-body"
        onClickCapture={(e) => {
          if (
            e.target.closest("[data-entry-cancel]") ||
            ((!inline || placed) &&
              e.target.closest('.sheet-footer button[type="button"]')
                ?.textContent === "Vazgeç")
          ) {
            e.preventDefault();
            e.stopPropagation();
            request();
          }
        }}
      >
        {form}
      </div>
      {collapsible && (
        <button
          ref={toggle}
          type="button"
          className={
            "list-icon party-compose-toggle " +
            (collapsed ? "primary-button" : "")
          }
          aria-label={collapsed ? "Yeni işlem ekle" : "Paneli kapat"}
          title={collapsed ? "Yeni işlem ekle" : "Gizle"}
          aria-expanded={!collapsed}
          disabled={busy || discard}
          style={
            collapsed && anchor.current
              ? {
                  position: "fixed",
                  right: anchor.current.right,
                  bottom: anchor.current.bottom,
                }
              : undefined
          }
          onClick={foldComposer}
        >
          <Plus size={18} />
        </button>
      )}
      {discard && (
        <DiscardConfirmation
          onContinue={() => setDiscard(false)}
          onDiscard={() => {
            base.current = fingerprint();
            setDiscard(false);
            const action = pending.current || onClose;
            nav?.clearBlocker?.();
            action();
          }}
        />
      )}
    </section>
  );
  return inline
    ? content
    : createPortal(
        content,
        document.getElementById(page ? "entry-page-root" : "entry-dock-root") ||
          document.body,
      );
}
