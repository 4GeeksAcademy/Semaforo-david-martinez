import React from 'react'
import ReactDOM from 'react-dom/client'
import '../styles/index.css'
import "bootstrap/dist/css/bootstrap.min.css";
import TrafficLight from './components/TrafficLight';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TrafficLight />
  </React.StrictMode>
);