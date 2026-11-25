import {
  movementReport,
  reportRows,
  downloadReportPdf,
} from "./movement-report.mjs";
import { RecordHost } from "./InlineRecords";
import { matchesChoice } from "./search-query.mjs";
import { ContentColumns } from "./AppShell";
import { useNavigation, useRecordState, useRouteTab } from "./Navigation";
import { cardDisplayName } from "./account-display.mjs";
import { NotificationPreview, RecentActivity } from "./ActivityPanels";
import { useScopedState } from "./SearchState";
import { useState, useEffect, useLayoutEffect } from "react";
import { Plus, ArrowLeftRight, FileText, Pencil } from "lucide-react";
import { AccountGrid, AccountSummary } from "./AccountSummary";
import { bankName, PROGRAMS } from "./BankCards";
import { PageHeading } from "./PageLayout";
import { Ledger } from "./Ledger";
import { sortLedgerEvents } from "./sorting.mjs";
import { ListTools, ListActions } from "./ListTools";
import { can, fmt } from "./ui";
import { DatePicker } from "./DatePicker";
import { exportRows } from "./csv.mjs";
import {
  cardPeriodRows,
  cardEventEffect,
  operationLabel,
} from "./operations.mjs";
export function AccountPage({
  page,
  data,
  open: openRecord,
  search = "",
  initialAccount = "all",
  initialEventId,
  onNotifications,
}) {
  const isCard = page === "Kredi kartları";
  const source = isCard ? data.cards : data.accounts;
  const nav = useNavigation();
  const [record, selectRecord] = useRecordState(page);
  const [selected, setSelected] = useState(
      source.find((x) => String(x.id) === String(record || initialAccount))?.id,
    ),
    [tab, setTab] = useRouteTab(
      isCard ? "Dönem içi işlemler" : "Hesap hareketleri",
    ),
    [archived, setArchived] = useScopedState(page + ":archived", false),
    [filters, setFilters] = useState(false),
    [sort, setSort] = useScopedState(page + ":sort", "date-asc"),
    [cancelled, setCancelled] = useScopedState(
      page + ":cancelled",
      Boolean(
        initialEventId &&
        data.events.find((e) => e.id === initialEventId)?.cancelled,
      ),
    ),
    [from, setFrom] = useScopedState(page + ":from", ""),
    [to, setTo] = useScopedState(page + ":to", ""),
    [statementId, setStatementId] = useScopedState(
      page + ":statementId",
      nav.route.statement || "",
    );
  const [inventorySort, setInventorySort] = useScopedState(
      page + ":inventorySort",
      "name-asc",
    ),
    [kind, setKind] = useScopedState(page + ":kind", "Tümü"),
    [person, setPerson] = useScopedState(page + ":person", "Tümü");
  const [detail, setDetail] = useState(
    Boolean(record) || initialAccount !== "all",
  );
  const [focusEvent, setFocusEvent] = useState(null);
  function open(context) {
    openRecord(
      isCard && detail && context.entity === "event"
        ? { ...context, lockedCardId: selected }
        : context,
    );
  }
  function openAlert(alert) {
    const event = data.events.find((e) => e.id === alert.eventId);
    if (event) {
      openRecord({
        entity: "event",
        mode: "view",
        item: event,
        ...(isCard
          ? { lockedCardId: alert.account }
          : { accountId: alert.account }),
      });
      return;
    }
    nav.navigate({ page, record: String(alert.account) });
  }
  const [tag, setTag] = useScopedState(page + ":tag", "all"),
    [minAmount, setMinAmount] = useScopedState(page + ":minAmount", ""),
    [maxAmount, setMaxAmount] = useScopedState(page + ":maxAmount", "");
  const [searchQuery, setSearchQuery] = useScopedState(
    page + ":searchQuery",
    "",
  );
  const [listQuery] = useScopedState(page + ":listQuery", "");
  const [queryScope, setQueryScope] = useScopedState(
    page + ":queryScope",
    record ? "movements" : "accounts",
  );
  useLayoutEffect(() => {
    if (initialAccount === "all" && !record) {
      setQueryScope("accounts");
      setSearchQuery(listQuery);
    }
  }, []);
  const scopeControl = (
    <label>
      Arama kapsamı
      <select
        data-filter-default={detail ? "movements" : "accounts"}
        value={queryScope}
        onChange={(e) => setQueryScope(e.target.value)}
      >
        <option value="accounts">{isCard ? "Kartlar" : "Hesaplar"}</option>
        <option value="movements">Seçili kaydın hareketleri</option>
      </select>
    </label>
  );
  const inventory = source
    .filter(
      (x) =>
        (archived || x.active) &&
        `${x.name} ${x.last_four || ""} ${x.bank || ""}`
          .toLocaleLowerCase("tr")
          .includes(
            (queryScope === "accounts" ? searchQuery : "").toLocaleLowerCase(
              "tr",
            ),
          ),
    )
    .sort((a, b) =>
      inventorySort.startsWith("balance-")
        ? (inventorySort === "balance-asc" ? 1 : -1) *
          ((a.balance_cents ?? Math.round(a.debt * 100)) -
            (b.balance_cents ?? Math.round(b.debt * 100)))
        : (inventorySort === "name-desc" ? -1 : 1) *
          a.name.localeCompare(b.name, "tr"),
    );
  const a = detail
    ? queryScope === "accounts" && searchQuery
      ? inventory.find((x) => String(x.id) === String(record || selected)) ||
        inventory[0]
      : source.find((x) => String(x.id) === String(record || selected))
    : inventory.find((x) => x.id === selected) || inventory[0];
  const statements = a?.statements || [];
  const statement =
    statements.find((x) => String(x.id) === statementId) || statements.at(-1);
  useEffect(() => {
    if (a && a.id !== selected) {
      setSelected(a.id);
      if (detail && record && queryScope === "accounts")
        nav.navigate({ page, record: String(a.id) }, { preserveFilters: true });
    }
  }, [a?.id, selected]);
  useLayoutEffect(() => {
    if (initialAccount === "all") return;
    const target = source.find(
      (item) => String(item.id) === String(initialAccount),
    );
    if (target) {
      setDetail(true);
      setSelected(target.id);
      setSearchQuery("");
      setTag("all");
      setMinAmount("");
      setMaxAmount("");
      setFrom("");
      setTo("");
      setKind("Tümü");
      setPerson("Tümü");
      setCancelled(false);
      setQueryScope("movements");
      if (!target.active) setArchived(true);
    }
  }, [initialAccount]);
  useLayoutEffect(() => {
    if (initialEventId) {
      const event = data.events.find((e) => e.id === initialEventId);
      if (event) {
        setFocusEvent({ id: event.id, stamp: Date.now() });
        setTab(
          isCard
            ? nav.route.tab || "Dönem içi işlemler"
            : event.scheduled
              ? "Gelecek dönem hareketleri"
              : "Hesap hareketleri",
        );
      }
    }
  }, [initialEventId]);
  function select(id) {
    selectRecord(id);
  }
  function back() {
    selectRecord(null);
  }
  let rows = a
    ? isCard
      ? cardPeriodRows(data.events, a, tab, statement, data.today)
      : data.events.filter(
          (e) =>
            (e.account_id === a.id || e.target_id === a.id) &&
            (tab === "Gelecek dönem hareketleri" ? e.scheduled : !e.scheduled),
        )
    : [];
  if (isCard && tab === "Ekstre" && statement && statement.difference_cents) {
    rows = [
      ...rows,
      {
        id: "difference-" + statement.id,
        synthetic: true,
        kind: "Ekstre farkı",
        operation: "statement_difference",
        description: "Detayı girilmemiş ekstre harcamaları",
        event_date: statement.cut_date,
        event_time: "",
        amount_cents: Math.abs(statement.difference_cents),
        card_effect: statement.difference_cents,
        tag: "Genel",
        creator: "",
        card_id: a.id,
        card_name: a.name,
      },
    ];
  }
  if (isCard && tab === "Ekstre" && statement?.carry_cents) {
    rows = [
      ...rows,
      {
        id: "carry-" + statement.id,
        synthetic: true,
        kind: "Ekstre devri",
        operation: "statement_carry",
        description: "Önceki ekstre devri",
        event_date: statement.cut_date,
        event_time: "",
        amount_cents: Math.abs(statement.carry_cents),
        card_effect: statement.carry_cents,
        tag: "Genel",
        creator: "",
        card_id: a.id,
        card_name: a.name,
      },
    ];
  }
  const amount = (e) =>
    isCard
      ? -cardEventEffect(e, a.id)
      : e.kind === "Virman"
        ? e.account_id === a.id
          ? -e.amount_cents
          : e.amount_cents
        : e.scheduled
          ? ["income", "refund", "collection", "cash_advance"].includes(
              e.operation,
            )
            ? e.amount_cents
            : -e.amount_cents
          : e.cash_effect;
  rows = rows.filter(
    (e) =>
      matchesChoice(tag, e.tag || "Genel") &&
      (!minAmount ||
        Math.abs(amount(e)) >= Math.round(Number(minAmount) * 100)) &&
      (!maxAmount ||
        Math.abs(amount(e)) <= Math.round(Number(maxAmount) * 100)) &&
      (cancelled || !e.cancelled) &&
      matchesChoice(kind, operationLabel(e)) &&
      matchesChoice(person, e.created_by ?? "") &&
      (!from || e.event_date >= from) &&
      (!to || e.event_date <= to) &&
      `${e.description} ${e.tag || "Genel"} ${operationLabel(e)}`
        .toLocaleLowerCase("tr")
        .includes(
          (queryScope === "movements" ? searchQuery : "").toLocaleLowerCase(
            "tr",
          ),
        ),
  );
  const exportReport = () =>
    movementReport({
      title: isCard ? "Kredi Kartı Hareketleri" : "Hesap Hareketleri",
      subject: a?.name || "",
      events: rows,
      period: isCard,
      amount,
      balance: a ? (isCard ? Math.round(a.debt * 100) : a.balance_cents) : null,
      balanceLabel: isCard ? "Güncel kart borcu" : "Güncel hesap bakiyesi",
      scope: `${rows.length} kayıt · ${tab} · ${from || "Başlangıç açık"} – ${to || "Bitiş açık"} · ${queryScope === "movements" ? searchQuery : ""}`,
    });
  const csv = () => {
    const report = exportReport();
    exportRows(
      "hesap-hareketleri",
      report.csv.columns,
      reportRows(report, true),
    );
  };
  csv.pdf = () => downloadReportPdf("hesap-hareketleri", exportReport());
  const inventoryCsv = () =>
    exportRows(
      "hesaplar",
      ["Ad", "Tür", "Bakiye TL"],
      [
        ...inventory.map((x) => [
          x.name,
          x.type || "Kart",
          (x.balance_cents ?? Math.round(x.debt * 100)) / 100,
        ]),
        [
          isCard ? "Toplam kart borcu" : "Toplam bakiye",
          "",
          inventory.reduce(
            (n, x) => n + (x.balance_cents ?? Math.round(x.debt * 100)),
            0,
          ) / 100,
        ],
      ],
    );
  const targetEvent = data.events.find(
    (e) =>
      String(e.id) === String(initialEventId || nav.route.event) &&
      (isCard
        ? e.card_id === a?.id || e.target_card_id === a?.id
        : e.account_id === a?.id || e.target_id === a?.id),
  );
  const revealTarget = targetEvent && !rows.includes(targetEvent);
  if (revealTarget) rows = [...rows, targetEvent];
  rows = sortLedgerEvents(rows, sort, {
    amount,
    accountLabel: (e) =>
      e.target_name
        ? `${e.account_name} → ${e.target_name}`
        : e.account_name || e.card_name || a?.name || "",
    date: (e) => e.period_date || e.event_date,
  });
  const inventoryActions = (
    <ListActions
      label={isCard ? "Kart listesi araçları" : "Hesap listesi araçları"}
      className="inventory-tools"
      sort={inventorySort}
      setSort={setInventorySort}
      sortOptions={[
        ["name-asc", "Ad: A–Z"],
        ["balance-desc", "Bakiye: yüksekten düşüğe"],
      ]}
      csv={inventoryCsv}
    />
  );
  const movementActions = (
    <ListActions
      columnSorting
      label="Hareket araçları"
      sort={sort}
      setSort={setSort}
      sortOptions={[
        ["date-desc", "Tarih: yeniden eskiye"],
        ["date-asc", "Tarih: eskiden yeniye"],
        ["amount-desc", "Tutar: yüksekten düşüğe"],
        ["amount-asc", "Tutar: düşükten yükseğe"],
      ]}
      csv={csv}
    />
  );
  const tools = (
    <ListTools
      query={searchQuery}
      setQuery={setSearchQuery}
      showActions={false}
      resultCount={queryScope === "accounts" ? inventory.length : rows.length}
      filters={filters}
      setFilters={setFilters}
      placeholder={
        queryScope === "accounts"
          ? isCard
            ? "Kartlarda ara"
            : "Hesaplarda ara"
          : "Seçili kaydın hareketlerinde ara"
      }
      reset={() => {
        setSearchQuery("");
        setTag("all");
        setMinAmount("");
        setMaxAmount("");
        setArchived(false);
        setFrom("");
        setTo("");
        setCancelled(false);
        setKind("Tümü");
        setPerson("Tümü");
        setSort("date-desc");
        setInventorySort("name-asc");
      }}
    >
      {scopeControl}
      <label className="check-label">
        <input
          type="checkbox"
          checked={archived}
          onChange={(e) => setArchived(e.target.checked)}
        />
        Arşiv dahil
      </label>
      <label>
        İşlem
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option>Tümü</option>
          {[...new Set(data.events.map(operationLabel))].map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <label>
        Etiket
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="all">Tümü</option>
          {[...new Set(data.events.map((e) => e.tag || "Genel"))]
            .sort()
            .map((value) => (
              <option key={value}>{value}</option>
            ))}
        </select>
      </label>
      <label>
        En az tutar (TL)
        <input
          name="amountMin"
          type="number"
          min="0"
          step="0.01"
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
        />
      </label>
      <label>
        En fazla tutar (TL)
        <input
          name="amountMax"
          type="number"
          min="0"
          step="0.01"
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
        />
      </label>
      <label>
        Ekleyen kişi
        <select value={person} onChange={(e) => setPerson(e.target.value)}>
          <option>Tümü</option>
          <option value="">Önceki kayıt</option>
          {data.users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.short_name || u.username}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tarih
        <DatePicker
          range
          from={from}
          to={to}
          today={data.today}
          onChange={(r) => {
            setFrom(r.from);
            setTo(r.to);
          }}
        />
      </label>
      <label className="check-label">
        <input
          type="checkbox"
          checked={cancelled}
          onChange={(e) => setCancelled(e.target.checked)}
        />
        İptal edilenleri göster
      </label>
    </ListTools>
  );
  const create = () =>
    open({
      entity: "event",
      initial: {
        operation: "expense",
        account: isCard ? "" : a.id,
        cardId: isCard ? a.id : "",
        scheduled: !isCard && tab === "Gelecek dönem hareketleri",
      },
    });
  return (
    <div
      className={
        "finance-page cari-page account-page " +
        (!isCard ? "bank-account-page" : "")
      }
    >
      <PageHeading
        title={
          detail && a
            ? isCard
              ? cardDisplayName(
                  a.name,
                  (bankName(a.bank_code) || a.bank || "").replace(" BBVA", ""),
                  PROGRAMS[a.program_code],
                )
              : a.name
            : page
        }
        subtitle={
          detail && a
            ? isCard
              ? `${bankName(a.bank_code) || a.bank || "Kredi kartı"}${
                  PROGRAMS[a.program_code] &&
                  !cardDisplayName(
                    a.name,
                    (bankName(a.bank_code) || a.bank || "").replace(
                      " BBVA",
                      "",
                    ),
                    PROGRAMS[a.program_code],
                  )
                    .toLocaleLowerCase("tr")
                    .includes(PROGRAMS[a.program_code].toLocaleLowerCase("tr"))
                    ? " · " + PROGRAMS[a.program_code]
                    : ""
                } · **** ${a.last_four || "—"}`
              : a.type
            : isCard
              ? "Kartlar, ekstreler ve dönem hareketleri."
              : "Kasa ve banka hesapları, tek bir yerde."
        }
        back={detail ? back : null}
        backLabel={isCard ? "Kredi kartlarına dön" : "Hesaplara dön"}
        actions={
          can(data.user, "create") &&
          !detail && (
            <button
              className="primary-button icon-only"
              aria-label={
                detail ? "İşlem ekle" : isCard ? "Kart ekle" : "Hesap ekle"
              }
              title={
                detail ? "İşlem ekle" : isCard ? "Kart ekle" : "Hesap ekle"
              }
              onClick={() =>
                detail
                  ? create()
                  : open({ entity: isCard ? "card" : "account" })
              }
            >
              <Plus size={18} />
            </button>
          )
        }
      />
      {detail && a && <AccountSummary item={a} {...{ isCard, data, open }} />}
      <ContentColumns className="account-workspace">
        <div className="account-main">
          {!detail && (
            <>
              <RecordHost entity={isCard ? "card" : "account"} />
              <section className="panel account-list-panel">
                {inventoryActions}
                <AccountGrid
                  items={inventory}
                  {...{ isCard, data, open }}
                  onSelect={select}
                />
              </section>
            </>
          )}

          {tools}
          {detail && !a && (
            <p className="empty">
              <span>Bu kapsamda hesap veya kart bulunamadı.</span>{" "}
              <button className="text-button" onClick={back}>
                Listeye dön
              </button>
            </p>
          )}
          {detail && a && (
            <>
              {isCard && a.debt < 0 && (
                <p className="future-note">
                  Kartta {fmt(Math.round(-a.debt * 100))} TL alacak var.
                </p>
              )}
              {isCard && tab === "Ekstre" && (
                <section className="panel statement-panel">
                  <div className="statement-controls">
                    <label>
                      Ekstre
                      <select
                        value={statement?.id || ""}
                        onChange={(e) => setStatementId(e.target.value)}
                      >
                        <option value="">
                          {statements.length
                            ? "Ekstre seçin"
                            : "Henüz manuel ekstre girilmedi"}
                        </option>
                        {statements.map((s) => (
                          <option value={s.id} key={s.id}>
                            {s.cut_date}
                          </option>
                        ))}
                      </select>
                    </label>
                    {can(data.user, "edit") && (
                      <>
                        <button
                          className="list-icon"
                          aria-label="Yeni ekstre gir"
                          title="Ekstre ekle"
                          onClick={() => open({ entity: "statement", item: a })}
                        >
                          <FileText size={18} />
                        </button>
                        {statement && (
                          <button
                            className="list-icon"
                            aria-label="Ekstreyi düzelt"
                            title="Ekstreyi düzelt"
                            onClick={() =>
                              open({ entity: "statement", item: a, statement })
                            }
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="statement-totals">
                    {[
                      [
                        "Ekstre toplamı",
                        statement?.total_cents ?? a.statement_total_cents,
                      ],
                      ["Ödenen", statement?.paid_cents ?? a.paid_cents],
                      [
                        "Kalan borç",
                        statement?.remaining_cents ??
                          Math.round(a.statement * 100),
                      ],
                    ].map(([l, n]) => (
                      <div key={l}>
                        <span>{l}</span>
                        <strong>{fmt(n || 0)} TL</strong>
                      </div>
                    ))}
                  </div>
                  {a.statement_credit_cents > 0 &&
                    statement === statements.at(-1) && (
                      <p className="future-note">
                        Ekstreye uygulanan iade / mahsup:{" "}
                        {fmt(a.statement_credit_cents)} TL
                      </p>
                    )}
                  {statement?.difference_cents < 0 && (
                    <p className="warning-text">
                      Tanımlı kalemler ekstre toplamını aşıyor. Dönem, tutar
                      veya iadeleri kontrol edin.
                    </p>
                  )}
                </section>
              )}
              <RecordHost entity={isCard ? "card" : "account"} id={a.id} />
              {isCard && <RecordHost entity="statement" />}
              {revealTarget && (
                <p className="muted" role="status">
                  Bağlantıdaki kayıt, mevcut filtreler korunarak ayrıca
                  gösteriliyor.
                </p>
              )}
              <Ledger
                onSort={setSort}
                sort={sort}
                balanceMode={
                  !isCard && tab === "Hesap hareketleri" ? "account" : undefined
                }
                currentBalance={a.balance_cents}
                monthEvents={
                  !isCard
                    ? data.events.filter(
                        (e) => e.account_id === a.id || e.target_id === a.id,
                      )
                    : undefined
                }
                currentAccount={!isCard ? a.id : undefined}
                lockedCardId={isCard ? a.id : undefined}
                key={a.id + "-" + tab + "-" + statement?.id}
                events={rows}
                data={data}
                open={open}
                toolbar={
                  <div className="account-ledger-heading">
                    <div className="cari-tabs">
                      {(isCard
                        ? ["Ekstre", "Dönem içi işlemler", "Gelecek Dönem"]
                        : ["Hesap hareketleri", "Gelecek dönem hareketleri"]
                      ).map((t) => (
                        <button
                          key={t}
                          className={t === tab ? "active" : ""}
                          aria-pressed={t === tab}
                          onClick={() => {
                            setTab(t);
                            setFocusEvent(null);
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="cari-actions">
                      {movementActions}
                      {can(data.user, "create") && a.active && (
                        <>
                          <button
                            className="list-icon"
                            aria-label="Hesaplar arası aktarım"
                            title="Aktarım"
                            onClick={() =>
                              open({
                                entity: "event",
                                initial: {
                                  operation: isCard
                                    ? "cash_advance"
                                    : "transfer",
                                  cardId: isCard ? a.id : "",
                                  account: isCard ? undefined : a.id,
                                },
                              })
                            }
                          >
                            <ArrowLeftRight size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                }
                amount={amount}
                accountLabel={(e) =>
                  e.target_name
                    ? `${e.account_name} → ${e.target_name}`
                    : e.account_name || e.card_name || a.name
                }
                card={isCard}
                focusEvent={focusEvent}
              />
            </>
          )}
        </div>
        <aside className="context-aside">
          <NotificationPreview
            data={data}
            source={isCard ? "cards" : "accounts"}
            onAll={onNotifications}
            onOpen={(alert) => {
              if (isCard) {
                select(alert.account);
              } else openAlert(alert);
            }}
          />
          <RecentActivity
            data={data}
            source={isCard ? "cards" : "accounts"}
            open={open}
          />
        </aside>
      </ContentColumns>
    </div>
  );
}
