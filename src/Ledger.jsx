import { RecordHost } from "./InlineRecords";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Pencil, History, Trash2, RotateCcw, Plus, Minus } from "lucide-react";
import { Popover, dateLabel } from "./DatePicker";
import { Badge, can, fmt, tone } from "./ui";
import { AuditHistory } from "./AuditHistory";
import {
  movementDate,
  detailedMovementDate,
  reconciledMonths,
} from "./party-ledger.mjs";
import { operationLabel } from "./operations.mjs";
import { EventForm } from "./EventForm";
import { useLedgerEditing } from "./LedgerEditing";
import { useNavigation } from "./Navigation";
import { SortHeader, SortFields } from "./SortHeader";
export function Ledger({
  events,
  data,
  open,
  toolbar,
  amount,
  accountLabel,
  party = false,
  card = false,
  global = false,
  focusEvent = null,
  title,
  scope,
  sort = "date-desc",
  onSort,
  monthEvents,
  balanceMode,
  currentBalance,
  lockedCardId,
  lockedPartyId,
  currentAccount,
}) {
  const [expanded, setExpanded] = useState(null),
    [bubble, setBubble] = useState(null),
    [limit, setLimit] = useState(30),
    [editing, setEditing] = useState(null),
    [editInitial, setEditInitial] = useState({}),
    [creating, setCreating] = useState(false),
    [createInitial, setCreateInitial] = useState({}),
    [createKey, setCreateKey] = useState(0);
  const editor = useLedgerEditing(),
    nav = useNavigation(),
    root = useRef(null),
    anchor = useRef(null),
    editingRef = useRef(null);
  editingRef.current = editing || creating;
  const beginCreate = (initial = {}) => {
    const action = () => {
      setEditing(null);
      setExpanded(null);
      setCreateInitial(initial);
      setCreating(true);
      setCreateKey((k) => k + 1);
      requestAnimationFrame(() =>
        root.current
          ?.querySelector(".ledger-composer")
          ?.scrollIntoView({ block: "nearest" }),
      );
    };
    editor.start(action);
  };
  useEffect(() => {
    if (editor?.createContext && !editor.createContext.hosted) {
      if (editor.createContext.item?.id)
        startEditing(
          editor.createContext.item,
          editor.createContext.initial || {},
        );
      else beginCreate(editor.createContext.initial || {});
      editor.clearCreate();
    }
  }, [editor?.createContext?.stamp]);
  const ascending = sort === "date-asc",
    signature = sort + "|" + events.map((e) => e.id).join(","),
    previous = useRef("");
  const columns = 7;
  const realMonths =
    monthEvents && sort.startsWith("date-")
      ? reconciledMonths(
          monthEvents,
          party ? {} : { effect: amount, currentBalance },
        )
      : null;
  const pageEvents = ascending ? events.slice(-limit) : events.slice(0, limit),
    more = events.length > limit;
  function scrollLatest() {
    if (!ascending || editingRef.current) return;
    const rows = root.current?.querySelectorAll("[data-ledger-id]");
    rows?.[rows.length - 1]?.scrollIntoView({
      block: "nearest",
      behavior: "instant",
    });
  }
  useLayoutEffect(() => {
    const key =
      signature + "|focus:" + focusEvent?.id + "|" + focusEvent?.stamp;
    if (previous.current === key) return;
    previous.current = key;
    const position = events.findIndex((e) => e.id === focusEvent?.id);
    setLimit(
      position >= 0
        ? Math.max(30, ascending ? events.length - position : position + 1)
        : 30,
    );
    if (position >= 0) setExpanded(focusEvent.id);
    const frame = requestAnimationFrame(() => {
      if (position >= 0)
        root.current
          ?.querySelector('[data-ledger-id="' + focusEvent.id + '"]')
          ?.scrollIntoView({ block: "nearest", behavior: "instant" });
      else scrollLatest();
    });
    return () => cancelAnimationFrame(frame);
  }, [signature, focusEvent?.id]);
  useEffect(
    () => () => {
      if (editingRef.current) editor?.end();
    },
    [],
  );
  useLayoutEffect(() => {
    if (!anchor.current) return;
    const { id, top, scroll } = anchor.current;
    const element = root.current?.querySelector(
      '[data-ledger-id="' + id + '"]',
    );
    if (element) scroll.scrollTop += element.getBoundingClientRect().top - top;
    anchor.current = null;
  }, [limit]);
  function loadOlder() {
    const scroll = document.querySelector(".main-content"),
      visible = [...root.current.querySelectorAll("[data-ledger-id]")].find(
        (e) =>
          e.getBoundingClientRect().bottom > scroll.getBoundingClientRect().top,
      );
    if (ascending && visible)
      anchor.current = {
        id: visible.dataset.ledgerId,
        top: visible.getBoundingClientRect().top,
        scroll,
      };
    setLimit((n) => n + 30);
  }
  function startEditing(e, initial = {}) {
    const action = () => {
      setCreating(false);
      setExpanded(e.id);
      setEditing(e);
      setEditInitial(initial);
      setCreateKey((k) => k + 1);
      setBubble(null);
      requestAnimationFrame(() =>
        root.current
          ?.querySelector(".ledger-composer")
          ?.scrollIntoView({ block: "nearest" }),
      );
    };
    editor
      ? editor.start(action)
      : open({ entity: "event", mode: "edit", item: e });
  }
  function finish() {
    setEditing(null);

    setCreating(false);
    editor?.end();
  }
  function toggle(e) {
    if (editing) {
      nav.guard(() => {
        finish();
        setExpanded(e.id === expanded ? null : e.id);
      });
      return;
    }
    setExpanded(e.id === expanded ? null : e.id);
  }
  const sortColumns = [
    ["date", "Tarih"],
    ["operation", "İşlem"],
    ["description", "Açıklama"],
    ...(party ? [["tag", "Etiket"]] : []),
    ["creator", "Ekleyen"],
    ...(!party ? [["account", "Hesap"]] : []),
    ["amount", "Tutar"],
    ...(party ? [["balance", "Bakiye"]] : []),
  ];
  function changeSort(next) {
    const action = () => {
      if (editing) finish();
      onSort?.(next);
    };
    if (editing) nav.guard(action);
    else action();
  }
  const header = (field, label, right = false) =>
    onSort ? (
      <SortHeader
        key={field}
        {...{ field, label, sort, right }}
        onSort={changeSort}
      />
    ) : (
      <th key={field} className={right ? "right" : undefined}>
        {label}
      </th>
    );
  const olderButton = more && (
    <div className="ledger-load-row">
      <button
        type="button"
        className="secondary-button"
        disabled={Boolean(editing)}
        onClick={loadOlder}
      >
        {ascending ? "Önceki 30 işlemi yükle" : "Sonraki 30 işlemi yükle"}
      </button>
    </div>
  );
  return (
    <div
      ref={root}
      className={"ledger-workspace " + (party ? "party-ledger-workspace" : "")}
    >
      {creating || editing ? (
        <div className="panel ledger-composer">
          <EventForm
            key={(editing ? "edit-" + editing.id : "new") + "-" + createKey}
            context={{
              entity: "event",
              inline: true,
              mode: editing ? "edit" : "new",
              item: editing || undefined,
              lockedPartyId: editing?.party_id || lockedPartyId,
              lockedCardId,
              initial: editing
                ? editInitial
                : { account: currentAccount || "", ...createInitial },
            }}
            data={data}
            onClose={finish}
            onState={editor.onState}
            notify={editor.notify}
          />
        </div>
      ) : (
        (lockedPartyId ||
          lockedCardId ||
          global ||
          balanceMode === "account") &&
        can(data.user, "create") && (
          <div className="ledger-create-action">
            <button className="text-button" onClick={() => beginCreate()}>
              <Plus size={17} />
              Yeni işlem ekle
            </button>
          </div>
        )
      )}
      <section
        className={
          "panel cari-list ledger-view " + (party ? "party-ledger-view" : "")
        }
      >
        {title ? (
          <div className="ledger-section-heading">
            <h2>{title}</h2>
            {toolbar}
          </div>
        ) : (
          toolbar
        )}
        {scope}
        {ascending && olderButton}
        {onSort && (
          <SortFields
            className="ledger-mobile-sort"
            sort={sort}
            onSort={changeSort}
            options={sortColumns.flatMap(([key, label]) => [
              [key + "-asc", label],
              [key + "-desc", label],
            ])}
          />
        )}
        <div className="cari-table-scroll">
          <table
            role="table"
            className={
              "cari-table finance-table " + (party ? "party-ledger" : "")
            }
          >
            <thead>
              <tr>
                {sortColumns.map(([field, label]) =>
                  header(field, label, ["amount", "balance"].includes(field)),
                )}
                {!party && (
                  <th className="inline-status-head">
                    <span className="sr-only">Durum / Eylemler</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {pageEvents.map((e, i) => {
                const active = expanded === e.id;
                return (
                  <React.Fragment key={e.id}>
                    <tr
                      data-ledger-id={e.id}
                      tabIndex={0}
                      aria-expanded={active}
                      className={
                        (e.cancelled ? "cancelled " : "") +
                        (active ? "expanded " : "")
                      }
                      onClick={(ev) => {
                        if (!ev.target.closest("input,button,select,textarea"))
                          toggle(e);
                      }}
                      onKeyDown={(ev) => {
                        if (
                          ev.target === ev.currentTarget &&
                          ["Enter", " "].includes(ev.key)
                        ) {
                          ev.preventDefault();
                          toggle(e);
                        }
                      }}
                    >
                      <td className="mobile-ledger-cell" colSpan={columns}>
                        <div className="mobile-txn-top">
                          <div>
                            <span className="mobile-txn-kind">
                              <Badge
                                kind={operationLabel(e)}
                                effect={amount(e)}
                                neutral={Boolean(e.cancelled)}
                              />
                            </span>
                            <MovementDate
                              event={e}
                              today={data.today}
                              active={active}
                            />
                          </div>
                          <strong className="money-nowrap">
                            <SignedAmount
                              value={amount(e)}
                              inactive={e.cancelled}
                            />
                          </strong>
                        </div>
                        <p className="mobile-txn-description">
                          {e.description || operationLabel(e)}
                        </p>
                        {active && (
                          <div className="mobile-txn-details">
                            <span>
                              {e.tag || "Genel"} · {e.creator || "Önceki kayıt"}
                              {!party && (
                                <small>
                                  {accountLabel(e)}
                                  {e.party_name ? " · " + e.party_name : ""}
                                  {e.period_date &&
                                  e.period_date !== e.event_date
                                    ? " · Dönem " + dateLabel(e.period_date)
                                    : ""}
                                </small>
                              )}
                            </span>
                          </div>
                        )}
                      </td>
                      <td data-label="Tarih" className="cari-date">
                        {
                          <MovementDate
                            event={e}
                            today={data.today}
                            active={active}
                          />
                        }
                      </td>
                      <td data-label="İşlem">
                        {
                          <Badge
                            kind={operationLabel(e)}
                            effect={amount(e)}
                            neutral={Boolean(
                              e.cancelled ||
                              e.synthetic ||
                              (global &&
                                [
                                  "Virman",
                                  "Kart ödemesi",
                                  "Kart aktarımı",
                                ].includes(e.kind)),
                            )}
                          />
                        }
                      </td>
                      <td data-label="Açıklama">
                        {party ? (
                          e.description
                        ) : (
                          <>
                            {e.description || operationLabel(e)}
                            <small>
                              {e.party_name || ""}
                              {e.tag && (
                                <span className="expense-tag">{e.tag}</span>
                              )}
                              {e.period_date &&
                                e.period_date !== e.event_date && (
                                  <span>
                                    {" "}
                                    · Dönem {dateLabel(e.period_date)}
                                  </span>
                                )}
                            </small>
                          </>
                        )}
                      </td>
                      {party && (
                        <td data-label="Etiket">
                          {
                            <span className="expense-tag">
                              {e.tag || "Genel"}
                            </span>
                          }
                        </td>
                      )}
                      <td data-label="Ekleyen" className="cari-creator">
                        {e.creator || "Önceki kayıt"}
                      </td>
                      {!party && (
                        <td data-label="Hesap" className="account-route">
                          {accountLabel(e)}
                        </td>
                      )}
                      <td data-label="Tutar" className="right cari-number">
                        {
                          <SignedAmount
                            value={amount(e)}
                            inactive={e.cancelled}
                          />
                        }
                      </td>
                      {party && (
                        <td
                          data-label="Bakiye"
                          className={
                            "right cari-number party-running-value " +
                            tone(e.party_balance)
                          }
                        >
                          {
                            <>
                              {fmt(e.party_balance)}{" "}
                              <span className="unit">TL</span>
                            </>
                          }
                        </td>
                      )}
                      {!party && (
                        <td
                          className="inline-rail-cell"
                          data-label="Durum"
                        ></td>
                      )}
                    </tr>
                    {active && (
                      <tr className="ledger-action-row">
                        <td colSpan={columns}>
                          <RecordHost entity="event" id={e.id} />
                          {
                            <div className="ledger-expanded-bar">
                              <EffectDetails
                                event={e}
                                gross={amount(e)}
                                party={party}
                              />
                              <div className="ledger-actions">
                                {e.synthetic ? (
                                  <span className="muted">
                                    {e.operation === "statement_carry"
                                      ? "Önceki ekstrenin devreden bakiyesi."
                                      : "Ekstre toplamı ile tanımlı kalemlerin farkı."}
                                  </span>
                                ) : (
                                  <>
                                    {e.scheduled &&
                                      can(data.user, "create") && (
                                        <button
                                          className="text-button"
                                          onClick={() =>
                                            open({
                                              entity: "event",
                                              mode: "edit",
                                              item: e,
                                              initial: {
                                                scheduled: false,
                                                date: data.today,
                                              },
                                            })
                                          }
                                        >
                                          Gerçekleşti
                                        </button>
                                      )}
                                    {can(data.user, "edit") &&
                                      !e.cancelled &&
                                      !e.managed_parent_id && (
                                        <button
                                          className="icon-button"
                                          aria-label="İşlemi düzenle"
                                          title="Düzenle"
                                          onClick={() => startEditing(e)}
                                        >
                                          <Pencil size={16} />
                                        </button>
                                      )}
                                    <button
                                      className="icon-button"
                                      aria-label="İşlem geçmişi"
                                      title="Log"
                                      onClick={(ev) =>
                                        setBubble({
                                          event: e,
                                          anchor: ev.currentTarget,
                                        })
                                      }
                                    >
                                      <History size={16} />
                                    </button>
                                    {can(data.user, "admin") &&
                                      !e.managed_parent_id && (
                                        <button
                                          className="icon-button danger-text"
                                          aria-label={
                                            e.cancelled
                                              ? "İşlemi geri aç"
                                              : "İşlemi sil"
                                          }
                                          title={
                                            e.cancelled ? "Geri aç" : "Sil"
                                          }
                                          onClick={() =>
                                            open({
                                              entity: "event",
                                              mode: "status",
                                              item: e,
                                            })
                                          }
                                        >
                                          {e.cancelled ? (
                                            <RotateCcw size={16} />
                                          ) : (
                                            <Trash2 size={16} />
                                          )}
                                        </button>
                                      )}
                                    {(data.claims || []).some(
                                      (c) => c.id === e.id,
                                    ) &&
                                      can(data.user, "create") && (
                                        <button
                                          className="icon-button"
                                          title="Ödeme / tahsilat"
                                          aria-label="Ödeme veya tahsilat kaydet"
                                          onClick={() => {
                                            const claim = data.claims.find(
                                              (c) => c.id === e.id,
                                            );
                                            open({
                                              entity: "event",
                                              lockedPartyId: e.party_id,
                                              initial: {
                                                partyId: e.party_id,
                                                operation:
                                                  e.operation ===
                                                  "customer_return"
                                                    ? "return_payment"
                                                    : claim.type === "alacak"
                                                      ? "collection"
                                                      : "payment",
                                                linkedId: e.id,
                                                amount: String(
                                                  claim.amount_cents / 100,
                                                ).replace(".", ","),
                                                description: e.description,
                                              },
                                            });
                                          }}
                                        >
                                          <Plus size={16} />
                                        </button>
                                      )}
                                  </>
                                )}
                              </div>
                            </div>
                          }
                        </td>
                      </tr>
                    )}
                    {realMonths &&
                      e.event_date?.slice(0, 7) !==
                        pageEvents[i + 1]?.event_date?.slice(0, 7) &&
                      realMonths.has(e.event_date.slice(0, 7)) && (
                        <MonthSummary
                          month={realMonths.get(e.event_date.slice(0, 7))}
                          columns={columns}
                        />
                      )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {!events.length && <p className="empty">Bu kapsamda işlem yok.</p>}
        {!ascending && olderButton}
        <div className="cari-table-footer">
          <span>
            {Math.min(limit, events.length)} / {events.length} hareket
          </span>
        </div>
        {bubble && (
          <Popover
            anchor={bubble.anchor}
            onClose={() => setBubble(null)}
            label="İşlem geçmişi"
            className="log-bubble"
          >
            <AuditHistory entity="event" id={bubble.event.id} data={data} />
          </Popover>
        )}
      </section>
    </div>
  );
}
export function SignedAmount({ value, inactive = false }) {
  return (
    <>
      <span className={"amount-sign " + (inactive ? "" : tone(value))}>
        {value > 0 ? "+" : value < 0 ? "−" : ""}
      </span>
      {fmt(Math.abs(value))} <span className="unit">TL</span>
    </>
  );
}
function MovementDate({ event: e, today, active }) {
  const [date, clock] = detailedMovementDate(e.event_date, e.event_time);
  return (
    <time
      className={active ? "movement-date detailed" : "movement-date"}
      dateTime={e.event_date + "T" + (e.event_time || "00:00:00")}
    >
      {active ? (
        <>
          <strong>{date}</strong>
          <small>{clock}</small>
        </>
      ) : (
        movementDate(e.event_date, e.event_time, today, {
          planned: e.scheduled,
        })
      )}
    </time>
  );
}
function EffectDetails({ event: e, gross, party }) {
  const inactive = e.cancelled || e.scheduled;
  return (
    <div className="party-effect-details" aria-label="İşlem ayrıntıları">
      {inactive && (
        <span>
          {e.cancelled
            ? "İptal edilmiş işlem"
            : "Planlanan işlem · Bakiyeye dahil değil"}
        </span>
      )}
      {party && !inactive && Number(e.excess_payment_cents) > 0 && (
        <span>
          Eski borca ek ödeme: <strong>{fmt(e.excess_payment_cents)} TL</strong>{" "}
          · Toplam kaynak:{" "}
          <strong>
            {fmt(Number(e.settled_cents) + Number(e.excess_payment_cents))} TL
          </strong>
        </span>
      )}
      {party && !inactive && Number(e.settled_cents) > 0 && (
        <span>
          {gross < 0 ? "Peşin ödeme" : "Peşin tahsilat"}:{" "}
          <strong>{fmt(Number(e.settled_cents))} TL</strong>
        </span>
      )}
      {party && !inactive && Number(e.party_effect) !== Number(gross) && (
        <span>
          Net etki: <strong>{fmt(Number(e.party_effect) || 0)} TL</strong>
        </span>
      )}
      {party && (
        <span className="mobile-running-balance">
          Bakiye:{" "}
          <strong className={tone(e.party_balance)}>
            {fmt(e.party_balance)} TL
          </strong>
        </span>
      )}
      {e.document_no && <span>Belge: {e.document_no}</span>}
    </div>
  );
}
function MonthSummary({ month: m, columns }) {
  return (
    <tr className="ledger-month-summary">
      <td colSpan={columns}>
        <div>
          <strong>{m.label}</strong>
          <span>
            Devreden: <span className="money-nowrap">{fmt(m.opening)} TL</span>
          </span>
          <span className="month-signed">
            <Plus size={14} className="positive" aria-label="Artış" />
            {fmt(m.positive)} TL
          </span>
          <span className="month-signed">
            <Minus size={14} className="danger-text" aria-label="Azalış" />
            {fmt(Math.abs(m.negative))} TL
          </span>
          <strong className={tone(m.closing)}>Net: {fmt(m.closing)} TL</strong>
        </div>
      </td>
    </tr>
  );
}
