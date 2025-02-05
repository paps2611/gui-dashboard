import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Assuming server is on localhost:5000

socket.on('connect', () => {
  console.log('Connected to WebSocket server with ID:', socket.id); // This should log on connection
});

socket.on('dbUpdate', (newData) => {
  console.log('Received real-time data:', newData); // This should log updates
});

export default socket;
