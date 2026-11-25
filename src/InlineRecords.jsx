import { inlineHostId } from "./record-target.mjs";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
const Placement = createContext(false);
export const useInlinePlacement = () => useContext(Placement);
export function RecordHost({ entity, id = "" }) {
  return (
    <div
      className="record-inline-host"
      data-form-host={entity}
      data-form-record={String(id)}
    />
  );
}
export function InlineRecord({ context, children }) {
  const [host, setHost] = useState(null);
  useLayoutEffect(() => {
    const hosts = [...document.querySelectorAll("[data-form-host]")];
    const target =
      hosts.find(
        (n) =>
          n.dataset.formHost === context.entity &&
          n.dataset.formRecord === inlineHostId(context),
      ) || hosts.find((n) => n.dataset.formHost === context.entity);
    setHost(target || null);
    if (target && context.mode !== "status")
      requestAnimationFrame(() => target.scrollIntoView({ block: "nearest" }));
  }, [context]);
  return host
    ? createPortal(
        <Placement.Provider value={true}>{children}</Placement.Provider>,
        host,
      )
    : null;
}
