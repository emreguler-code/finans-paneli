import { SelectControl } from "./SelectControl";
import { useState } from "react";
import { PageHeading } from "./PageLayout";
import { ListTools, ListActions } from "./ListTools";
import { collectAlerts, AlertNotice } from "./Alerts";
import {
  notificationSource,
  notificationSubject,
  notificationSources,
  notificationLevels,
  orderNotifications,
  readableAlertDetail,
} from "./notification-utils.mjs";
import { DatePicker } from "./DatePicker";
import { exportRows } from "./csv.mjs";
export function NotificationsPage({
  data,
  initialScope = {},
  onOpenNotification,
}) {
  const [query, setQuery] = useState(""),
    [source, setSource] = useState(initialScope.source || "all"),
    [subject, setSubject] = useState(initialScope.subject || "all"),
    [level, setLevel] = useState("all"),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [sort, setSort] = useState("priority"),
    [filters, setFilters] = useState(false),
    [limit, setLimit] = useState(30);
  const all = orderNotifications(collectAlerts(data));
  const options =
    source === "accounts"
      ? data.accounts.map((a) => [String(a.id), a.name])
      : source === "cards"
        ? data.cards.map((a) => [String(a.id), a.name])
        : source === "parties"
          ? data.parties.map((a) => [String(a.id), a.name])
          : source === "vehicles"
            ? (data.vehicles || []).map((a) => [String(a.id), a.plate])
            : source === "campaigns"
              ? (data.campaigns || []).map((a) => [String(a.id), a.name])
              : [];
  const rows = all.filter(
    (a) =>
      (source === "all" || notificationSource(a) === source) &&
      (subject === "all" || notificationSubject(a) === subject) &&
      (level === "all" || a.level === level) &&
      (!from || a.date >= from) &&
      (!to || (a.date && a.date <= to)) &&
      `${a.title} ${readableAlertDetail(a.detail)}`
        .toLocaleLowerCase("tr")
        .includes(query.toLocaleLowerCase("tr")),
  );
  if (sort === "newest")
    rows.sort(
      (a, b) =>
        (b.date || "").localeCompare(a.date || "") || a.id.localeCompare(b.id),
    );
  function reset() {
    setQuery("");
    setSource("all");
    setSubject("all");
    setLevel("all");
    setFrom("");
    setTo("");
    setSort("priority");
    setLimit(30);
  }
  return (
    <div className="finance-page cari-page notifications-page">
      <PageHeading
        title="Bildirimler"
        subtitle="Tüm bölümlerde dikkat gerektiren kayıtlar."
      />
      <ListTools
        {...{ query, setQuery, filters, setFilters }}
        showActions={false}
        resultCount={rows.length}
        placeholder="Bildirimlerde ara"
        reset={reset}
      >
        <label>
          Bölüm
          <SelectControl
            aria-label="Bölüm"
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setSubject("all");
              setLimit(30);
            }}
          >
            <option value="all">Tüm bölümler</option>
            {Object.entries(notificationSources).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectControl>
        </label>
        <label>
          İlgili kayıt
          <SelectControl
            aria-label="İlgili kayıt"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="all">Tüm kayıtlar</option>
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectControl>
        </label>
        <label>
          Önem
          <SelectControl
            aria-label="Önem"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="all">Tümü</option>
            {Object.entries(notificationLevels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectControl>
        </label>
        <label>
          Tarih aralığı
          <DatePicker
            range
            today={data.today}
            {...{ from, to }}
            onChange={(r) => {
              setFrom(r.from);
              setTo(r.to);
            }}
          />
        </label>
      </ListTools>
      <section className="panel notification-list">
        <header className="notification-list-heading">
          <div>
            <h2>
              Bildirimler <small>{rows.length}</small>
            </h2>
            <p>Önem düzeyi ve vade sırasıyla</p>
          </div>
          <ListActions
            sort={sort}
            setSort={setSort}
            sortOptions={[
              ["priority", "Önem ve vade"],
              ["newest", "En yeni"],
            ]}
            csv={() =>
              exportRows(
                "bildirimler",
                ["Önem", "Bölüm", "Tarih", "Başlık", "Açıklama"],
                rows.map((a) => [
                  notificationLevels[a.level],
                  notificationSources[notificationSource(a)],
                  a.date || "",
                  a.title,
                  readableAlertDetail(a.detail),
                ]),
              )
            }
          />
        </header>
        {rows.slice(0, limit).map((a) => (
          <div className="notification-list-item" key={a.id}>
            <span className={"notification-severity " + a.level}>
              {notificationLevels[a.level] || "Bilgi"} ·{" "}
              {notificationSources[notificationSource(a)]}
            </span>
            <AlertNotice alert={a} onOpen={() => onOpenNotification(a)} />
          </div>
        ))}
        {!rows.length && <p className="empty">Bu kapsamda bildirim yok.</p>}
        {rows.length > limit && (
          <button
            className="secondary-button notification-load-more"
            onClick={() => setLimit((n) => n + 30)}
          >
            Daha fazla göster ({rows.length - limit})
          </button>
        )}
      </section>
    </div>
  );
}
