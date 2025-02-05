import React, { useState, useEffect } from 'react';
import { getData } from '../services/api';
import socket from '../services/socket';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="table-container">
      <h2 className="title">Node Status Table</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Node Name</th>
            <th>Node Type</th>
            <th>Status</th>
            <th>CPU (%)</th>
            <th>Memory (%)</th>
            <th>Disk (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.nodeName}</td>
              <td>{item.nodeType}</td>
              <td>{item.status}</td>
              <td>{item.cpu}</td>
              <td>{item.memory}</td>
              <td>{item.disk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
