// client/src/App.js
import React, { useEffect } from 'react';
import DataTable from './components/DataTable';
import socket from './services/socket'; // New Socket.io client service
import './App.css';

function App() {
  useEffect(() => {
    // Log connection confirmation
    socket.on('connect', () => {
      console.log('Connected to server via socket');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>GUI Dashboard</h1>
        <DataTable />
      </header>
    </div>
  );
}

export default App;
