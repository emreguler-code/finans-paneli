
import {FinancePages} from './FinancePages';
import {AccountPage} from './AccountPage';
import {EventForm, StatementForm} from './EventForm';
import {EntityDialog} from './EntityDialog';
import {RecordDetails} from './RecordDetails';
export {AuditHistory} from './AuditHistory';
export function FinanceHub(props) {
  return ['Hesaplar','Kredi kartları'].includes(props.page) ? <AccountPage {...props}/> : <FinancePages {...props}/>;
}
export function FinanceDialog(props) {
  const {entity,mode}=props.context;
  if (['view','history'].includes(mode)) return <RecordDetails {...props}/>;
  if (entity==='statement') return <StatementForm {...props}/>;
  if (entity==='event' && mode!=='status') return <EventForm {...props}/>;
  return <EntityDialog {...props}/>;
}
