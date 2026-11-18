import { contentScroll, scrollContent } from "./AppShell";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSearchStore } from "./SearchState";
import { requestId } from "./api";
import { readRoute, routeHash } from "./routes.mjs";
const Navigation = createContext(null);
export function NavigationProvider({ children }) {
  const store = useSearchStore(),
    [route, setRoute] = useState(() => readRoute(location.hash)),
    [revision, setRevision] = useState(0),
    [direction, setDirection] = useState("forward"),
    current = useRef(route),
    snapshots = useRef(new Map()),
    lists = useRef(new Map()),
    seen = useRef("");
  const position = useRef(history.state?.finansIndex ?? 0),
    restoringPop = useRef(false);
  const blocker = useRef(null);
  const setBlocker = (fn) => {
    blocker.current = fn;
    return () => {
      if (blocker.current === fn) blocker.current = null;
    };
  };
  const stamp = requestId;
  function remember() {
    const key = history.state?.finansEntry;
    if (key)
      snapshots.current.set(key, {
        store: new Map(store),
        scroll: contentScroll()?.scrollTop || 0,
      });
    if (!current.current.record)
      lists.current.set(current.current.page, {
        store: new Map(store),
        scroll: contentScroll()?.scrollTop || 0,
      });
  }
  function restore(snapshot) {
    if (snapshot) {
      store.clear();
      snapshot.store.forEach((v, k) => store.set(k, v));
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scrollContent(snapshot.scroll)),
      );
    }
  }
  function navigate(
    next,
    {
      fresh = false,
      replace = false,
      restoreList = false,
      preserveFilters = false,
      bypass = false,
    } = {},
  ) {
    if (blocker.current && !bypass) {
      blocker.current(() =>
        navigate(next, {
          fresh,
          replace,
          restoreList,
          preserveFilters,
          bypass: true,
        }),
      );
      return false;
    }
    remember();
    const target = {
      record: "",
      tab: "",
      event: "",
      q: "",
      category: "all",
      source: "all",
      ...next,
    };
    if (
      routeHash(target) === routeHash(current.current) &&
      !fresh &&
      !restoreList
    )
      return;
    if (
      fresh ||
      (target.record &&
        current.current.record !== target.record &&
        !preserveFilters)
    ) {
      for (const key of store.keys())
        if (
          key.startsWith(target.page + ":") ||
          (target.page === "Araçlarım" && key.startsWith("vehicles:"))
        )
          store.delete(key);
    }
    if (restoreList) restore(lists.current.get(target.page));
    const hash = routeHash(target),
      key = stamp();
    const nextPosition = position.current + (replace ? 0 : 1);
    history[replace ? "replaceState" : "pushState"](
      { finansEntry: key, finansIndex: nextPosition },
      "",
      hash,
    );
    position.current = nextPosition;
    seen.current = key + hash;
    const remount =
      current.current.page !== target.page ||
      current.current.record !== target.record ||
      fresh ||
      restoreList;
    setDirection(restoreList ? "back" : "forward");
    current.current = target;
    setRoute(target);
    if (remount) setRevision((n) => n + 1);
    if (!restoreList) scrollContent(0);
  }
  useEffect(() => {
    if (
      !history.state?.finansEntry ||
      !Number.isInteger(history.state?.finansIndex)
    )
      history.replaceState(
        {
          finansEntry: history.state?.finansEntry || stamp(),
          finansIndex: position.current,
        },
        "",
        routeHash(current.current),
      );
    seen.current = history.state.finansEntry + location.hash;
    const pop = () => {
      const key = (history.state?.finansEntry || "") + location.hash;
      if (restoringPop.current) {
        if (location.hash === routeHash(current.current)) {
          restoringPop.current = false;
          seen.current = key;
        }
        return;
      }
      if (key === seen.current) return;
      seen.current = key;
      const next = readRoute(location.hash),
        targetPosition = history.state?.finansIndex;
      if (blocker.current && (blocker.current.needsGuard?.() ?? true)) {
        if (
          Number.isInteger(targetPosition) &&
          targetPosition !== position.current
        ) {
          const delta = position.current - targetPosition;
          restoringPop.current = true;
          history.go(delta);
          blocker.current(() => {
            seen.current = "";
            history.go(-delta);
          });
          return;
        }
        history.replaceState(history.state, "", routeHash(current.current));
        blocker.current(() => navigate(next, { bypass: true }));
        return;
      }
      setDirection(
        Number.isInteger(targetPosition) && targetPosition < position.current
          ? "back"
          : "forward",
      );
      if (Number.isInteger(targetPosition)) position.current = targetPosition;
      current.current = next;
      restore(snapshots.current.get(history.state?.finansEntry));
      setRoute(current.current);
      setRevision((n) => n + 1);
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("hashchange", pop);
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("hashchange", pop);
    };
  }, []);

  return (
    <Navigation.Provider
      value={{
        route,
        revision,
        direction,
        navigate,
        setBlocker,
        guard: (action) =>
          blocker.current ? blocker.current(action) : action(),
        clearBlocker: () => {
          blocker.current = null;
        },
        getRoute: () => current.current,
      }}
    >
      {children}
    </Navigation.Provider>
  );
}
export const useNavigation = () => useContext(Navigation);
export function useRecordState(page) {
  const nav = useNavigation(),
    record = nav?.route.page === page ? nav.route.record : "";
  return [
    record && ["Cari hesaplar", "Araçlarım"].includes(page)
      ? Number(record)
      : record || null,
    (id) =>
      nav.navigate(
        { page, record: id ? String(id) : "" },
        { restoreList: !id },
      ),
  ];
}
export function useRouteTab(initial) {
  const nav = useNavigation();
  return [
    nav.route.tab || initial,
    (value) => nav.navigate({ ...nav.route, tab: value }),
  ];
}
