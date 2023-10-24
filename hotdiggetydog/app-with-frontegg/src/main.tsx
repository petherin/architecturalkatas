// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
    baseUrl: 'https://app-al0s8azy1prn.frontegg.com',
    clientId: '23791809-4c0d-499e-83f2-fc918d86bc75'
};

const authOptions = {
    // keepSessionAlive: true // Uncomment this in order to maintain the session alive
};


ReactDOM.createRoot(document.getElementById('root')!).render(
    <FronteggProvider contextOptions={contextOptions}
                      hostedLoginBox={true}
                      authOptions={authOptions}>
        <App />
    </FronteggProvider>,
)