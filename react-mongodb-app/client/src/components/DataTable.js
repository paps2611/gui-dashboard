import React, { useState, useEffect } from 'react';
import { getData } from '../services/api';
import socket from '../services/socket';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Nodes'); // Tab for future expansion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        setData(response.data);
        setLoading(false);
        console.log('Initial Data from DB:', response.data); // Debug log
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();

    // Handle WebSocket updates
    socket.on('dbUpdate', (newData) => {
      console.log('Real-time Data Update:', newData);
      setData(newData); // Update UI with new data
    });

    return () => {
      socket.off('dbUpdate');
    };
  }, []);

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      {/* Tab Bar */}
      <div style={styles.tabBar}>
        <button
          style={{ ...styles.tabItem, ...(activeTab === 'Nodes' && styles.activeTab) }}
          onClick={() => setActiveTab('Nodes')}
        >
          Nodes
        </button>
        <button
          style={{ ...styles.tabItem, ...(activeTab === 'Metrics' && styles.activeTab) }}
          onClick={() => setActiveTab('Metrics')}
        >
          Metrics
        </button>
      </div>

      {/* Data Table */}
      <div style={styles.tableContainer}>
        <h2 style={styles.title}>Node Status Table</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thTd}>Node Name</th>
              <th style={styles.thTd}>Node Type</th>
              <th style={styles.thTd}>Status</th>
              <th style={styles.thTd}>CPU (%)</th>
              <th style={styles.thTd}>Memory (%)</th>
              <th style={styles.thTd}>Disk (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td style={styles.thTd}>{item.nodeName}</td>
                <td style={styles.thTd}>{item.nodeType}</td>
                <td style={{ ...styles.thTd, ...getStatusStyle(item.status) }}>{item.status}</td>
                <td style={{ ...styles.thTd, ...getUsageStyle(item.cpu) }}>{item.cpu}</td>
                <td style={{ ...styles.thTd, ...getUsageStyle(item.memory) }}>{item.memory}</td>
                <td style={styles.thTd}>{item.disk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Status Color Logic
const getStatusStyle = (status) => ({
  color: status.toLowerCase() === 'ready' || status.toLowerCase() === 'up' ? 'green' : 'red',
  fontWeight: 'bold',
});

// CPU/Memory Warning Logic
const getUsageStyle = (value) => ({
  color: value > 70 ? 'red' : 'black',
  fontWeight: value > 70 ? 'bold' : 'normal',
});

// Inline Styles
const styles = {
  container: {
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    padding: 20,
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
    background: '#f7f7f7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabItem: {
    flexGrow: 1,
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#6200ea',
    color: 'white',
  },
  tableContainer: {
    overflowX: 'auto',
    background: 'white',
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#6200ea',
  },
  table: {
    width: '100%',
    marginTop: 20,
    borderCollapse: 'collapse', // Ensures borders don't double up
  },
  thTd: {
    border: '1px solid #ddd', // Added borders
    padding: '8px',
    textAlign: 'center',
  },
  loading: {
    fontSize: 24,
    color: '#6200ea',
    marginTop: 20,
  },
};

export default DataTable;
