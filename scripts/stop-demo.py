#!/usr/bin/env python3
"""Stop only containers owned by the retained local synthetic demo."""
import json,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1];marker=root/'.qa/current-demo'
if marker.exists():
 runtime=Path(marker.read_text()).resolve()
 if runtime.parent!=root/'.qa':raise RuntimeError('Unexpected demo directory')
 session=runtime/'local-session.json'
 data=json.loads(session.read_text())
 ident=runtime.name
 expected={'finans-qa-db-'+ident,'finans-qa-php-'+ident}
 if set(data['containers'])!=expected:raise RuntimeError('Unexpected demo containers')
 for name in reversed(data['containers']):subprocess.run(['docker','rm','-f',name],check=True,stdout=subprocess.DEVNULL)
 for file in [session,runtime/'db.env',runtime/'web/api/config.php',marker]:file.unlink(missing_ok=True)
 print('Local demo stopped; credentials removed.')
else:print('No retained demo.')
