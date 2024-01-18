import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css';
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";


ReactDOM.render(
	<React.StrictMode>
		<Auth0Provider
			domain="https://unep-gpml.eu.auth0.com"
			clientId="lmdxuDGdQjUsbLbMFpjDCulTP1w5Z4Gi"
			redirectUri={`${window.location.origin}/oauth2/callback`}
		>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Auth0Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
