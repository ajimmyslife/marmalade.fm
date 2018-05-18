import React from 'react';
import ReactDOM from 'react-dom';
import './css/main.css';
import 'tachyons';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
