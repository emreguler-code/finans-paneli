// Development-only visual fixture; not imported by the production entry.
import React from 'react';import {createRoot} from 'react-dom/client';import {LoginPanel} from '../../src/Session';import '../../src/styles/index.css';createRoot(document.getElementById('root')).render(<LoginPanel session={{setupRequired:false}} submit={e=>e.preventDefault()}/>);
