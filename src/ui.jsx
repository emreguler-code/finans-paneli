import { DiscardConfirmation, isolateBackground } from "./OverlayLayer";
import { useEffect, useRef, useId, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
export function useViewport() {
  useEffect(() => {
    const v = window.visualViewport;
    let frame;
    const update = (followFocus = true) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty(
          "--visible-height",
          `${v?.height || window.innerHeight}px`,
        );
        document.documentElement.style.setProperty(
          "--visible-top",
          `${v?.offsetTop || 0}px`,
        );
        document.documentElement.classList.toggle(
          "keyboard-open",
          (v?.height || innerHeight) < innerHeight * 0.77,
        );
        const active = document.activeElement;
        if (
          followFocus &&
          active?.matches("input,select,textarea") &&
          active.closest(".finance-sheet,.auth-panel,.entry-surface")
        ) {
          const r = active.getBoundingClientRect();
          const bottom = (v?.offsetTop || 0) + (v?.height || innerHeight);
          if (r.bottom > bottom - 90 || r.top < (v?.offsetTop || 0) + 60)
            active.scrollIntoView({ block: "center", behavior: "instant" });
        }
      });
    };
    const trackScroll = () => update(false);
    update();
    v?.addEventListener("resize", update);
    v?.addEventListener("scroll", trackScroll);
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    return () => {
      cancelAnimationFrame(frame);
      v?.removeEventListener("resize", update);
      v?.removeEventListener("scroll", trackScroll);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
    };
  }, []);
}

export function Sheet({ title, onClose, children, busy = false }) {
  const dialogId = useId();
  const ref = useRef(null),
    close = useRef(onClose),
    baseline = useRef(null);
  const [discard, setDiscard] = useState(false);
  const fingerprint = () =>
    JSON.stringify(
      [
        ...(ref.current?.querySelectorAll(
          "form input,form select,form textarea",
        ) || []),
      ]
        .filter((n) => n.type !== "hidden")
        .map((n) => [
          n.name,
          n.type,
          n.type === "checkbox" ? n.checked : n.value,
        ]),
    );
  function requestClose() {
    if (busy) return;
    if (baseline.current !== null && fingerprint() !== baseline.current) {
      setDiscard(true);
      return;
    }
    onClose();
  }
  close.current = requestClose;
  useEffect(() => {
    baseline.current = fingerprint();
  }, []);
  useEffect(() => {
    if (discard) ref.current?.querySelector(".discard-confirm button")?.focus();
  }, [discard]);
  useEffect(() => {
    const prior = document.activeElement,
      app = document.querySelector(".app");
    const release = isolateBackground(app ? [app] : []);
    ref.current?.focus({ preventScroll: true });
    const key = (e) => {
      if (e.defaultPrevented) return;
      if (e.target.closest?.("[data-floating-panel]")) return;
      if (
        [...document.querySelectorAll(".finance-sheet")].at(-1) !== ref.current
      )
        return;
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
      }
      if (e.key === "Tab") {
        const els = [
          ...ref.current.querySelectorAll(
            "button,input,select,textarea,summary,a[href]",
          ),
        ].filter(
          (x) =>
            !x.disabled && !x.closest("[inert]") && x.getClientRects().length,
        );
        if (!els.length) return;
        if (
          e.shiftKey &&
          (document.activeElement === els[0] ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          els.at(-1).focus();
        } else if (
          !e.shiftKey &&
          (document.activeElement === els.at(-1) ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      release();
      document.removeEventListener("keydown", key);
      prior?.focus({ preventScroll: true });
    };
  }, []);
  const content = (
    <div className="drawer-layer">
      <button
        className="backdrop"
        aria-label="Paneli kapat"
        disabled={busy}
        onClick={requestClose}
      />
      <section
        className="drawer finance-sheet"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogId}
      >
        <div className="drawer-heading">
          <div>
            <span className="eyebrow">FİNANS</span>
            <h2 id={dialogId}>{title}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Paneli kapat"
            disabled={busy}
            onClick={requestClose}
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="sheet-body"
          inert={discard || undefined}
          onClickCapture={(e) => {
            if (
              e.target.closest('.sheet-footer button[type="button"]')
                ?.textContent === "Vazgeç"
            ) {
              e.stopPropagation();
              e.preventDefault();
              requestClose();
            }
          }}
        >
          {children}
        </div>
        {discard && (
          <DiscardConfirmation
            onContinue={() => setDiscard(false)}
            onDiscard={onClose}
          />
        )}
      </section>
    </div>
  );
  return typeof document === "undefined"
    ? content
    : createPortal(content, document.body);
}
export const roleName = {
  admin: "Yönetici",
  editor: "Düzenleyici",
  user: "Kullanıcı",
  viewer: "Gözlemci",
};
export const can = (u, task) =>
  task === "admin"
    ? u?.role === "admin"
    : task === "edit"
      ? ["admin", "editor"].includes(u?.role)
      : task === "create"
        ? ["admin", "editor", "user"].includes(u?.role)
        : true;
export const fmt = (c) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(c / 100);
export const tone = (c) => (c > 0 ? "positive" : c < 0 ? "danger-text" : "");
export const KIND = [
  "Açılış",
  "Alacak",
  "Borç",
  "Tahsilat",
  "Ödeme",
  "Virman",
  "Kart harcaması",
  "Kart iadesi",
  "Kart ödemesi",
];
export function Badge({ kind, effect, neutral = false }) {
  const short = {
    "Faturalı Alış": "Fat. Alış",
    "Faturasız Alış": "Fatsız. Alış",
    Alacak: "Satış",
    Borç: "Alış",
    "Kart harcaması": "Ödeme",
    "Kart iadesi": "Tahsilat",
    "Kart ödemesi": "Virman",
  };
  return (
    <span
      title={kind}
      className={
        "cari-badge " +
        (neutral
          ? "effect-neutral"
          : effect !== undefined
            ? effect > 0
              ? "effect-positive"
              : effect < 0
                ? "effect-negative"
                : "effect-neutral"
            : "kind-" + kind.replaceAll(" ", "-"))
      }
    >
      {short[kind] || kind}
    </span>
  );
}
