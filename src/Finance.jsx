import { EventStatusForm } from "./EventStatusForm";
import { TrackingPages } from "./TrackingPages";
import { TrackingDialog } from "./TrackingDialog";
import { FinancePages } from "./FinancePages";
import { AccountPage } from "./AccountPage";
import { EventForm, StatementForm } from "./EventForm";
import { EntityDialog } from "./EntityDialog";
import { RecordDetails } from "./RecordDetails";
export { AuditHistory } from "./AuditHistory";
export function FinanceHub(props) {
  if (["Araçlarım", "Kampanyalar"].includes(props.page))
    return <TrackingPages {...props} />;
  return ["Hesaplar", "Kredi kartları"].includes(props.page) ? (
    <AccountPage {...props} />
  ) : (
    <FinancePages {...props} />
  );
}
export function FinanceDialog(props) {
  const { entity, mode } = props.context;
  if (
    ["vehicle", "vehicle_record", "campaign", "campaign_entry"].includes(entity)
  )
    return <TrackingDialog {...props} />;
  if (entity === "event" && mode === "status")
    return <EventStatusForm {...props} />;
  if (["view", "history"].includes(mode)) return <RecordDetails {...props} />;
  if (entity === "statement") return <StatementForm {...props} />;
  if (entity === "event" && mode !== "status")
    return (
      <EventForm {...props} context={{ ...props.context, inline: true }} />
    );
  return <EntityDialog {...props} />;
}
