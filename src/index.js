import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
import { DrawContextProvider } from './Context/drawer/DrawContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <DrawContextProvider>
        <App />
      </DrawContextProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
