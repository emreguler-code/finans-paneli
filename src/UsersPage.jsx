import { RecordHost } from "./InlineRecords";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { roleName } from "./ui";
import { ListTools } from "./ListTools";
import { useScopedState } from "./SearchState";
export function UsersPage({ data, open }) {
  const [query, setQuery] = useScopedState("users:query", ""),
    [role, setRole] = useScopedState("users:role", "Tümü"),
    [status, setStatus] = useScopedState("users:status", "Tümü"),
    [filters, setFilters] = useState(false);
  const users = data.users.filter(
    (u) =>
      `${u.short_name} ${u.username}`
        .toLocaleLowerCase("tr")
        .includes(query.toLocaleLowerCase("tr")) &&
      (role === "Tümü" || u.role === role) &&
      (status === "Tümü" ||
        Boolean(Number(u.active)) === (status === "active")),
  );
  return (
    <section className="panel">
      <ListTools
        query={query}
        setQuery={setQuery}
        placeholder="Kullanıcılarda ara"
        resultCount={users.length}
        filters={filters}
        setFilters={setFilters}
        reset={() => {
          setQuery("");
          setRole("Tümü");
          setStatus("Tümü");
        }}
      >
        <label>
          Rol
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Tümü</option>
            {Object.entries(roleName).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Durum
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </label>
      </ListTools>
      <RecordHost entity="user" />
      {users.map((u) => (
        <div className="finance-due" key={u.id}>
          <div>
            <strong>{u.short_name}</strong>
            <p>
              {u.username} · {roleName[u.role]}
              {!Number(u.active) ? " · Pasif" : ""}
            </p>
          </div>
          <button
            className="secondary-button icon-only"
            aria-label="Düzenle"
            title="Düzenle"
            onClick={() => open({ entity: "user", item: u })}
          >
            <Pencil size={18} />
          </button>
          <RecordHost entity="user" id={u.id} />
        </div>
      ))}
      {!users.length && <p className="empty">Kullanıcı bulunamadı.</p>}
    </section>
  );
}
