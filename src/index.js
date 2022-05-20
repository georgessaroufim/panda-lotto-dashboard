import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import I18nManager from './core/I18nManager/I18nManager';
import { getCookie } from './core/common-service/CommonService';
import { HelmetProvider } from 'react-helmet-async';
import StoreProvider from './core/context/StoreContext';
import RouteProvider from './core/context/RouteContext';


const dir = getCookie('dir')
if (dir == 'rtl' || dir == 'ltr') {
  I18nManager.setDirValue(dir == 'rtl' ? true : false)
  document.getElementsByTagName('html')[0].setAttribute("dir", dir);
  document.getElementsByTagName('html')[0].setAttribute("lang", dir == 'rtl' ? 'ar' : 'en');
} else {
  I18nManager.setDirValue(true)
  document.getElementsByTagName('html')[0].setAttribute("dir", 'rtl');
  document.getElementsByTagName('html')[0].setAttribute("lang", 'ar');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <StoreProvider>
        <RouteProvider>
          <App />
        </RouteProvider>
      </StoreProvider>
    </HelmetProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
