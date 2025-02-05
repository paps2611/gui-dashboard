import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Method 1: Export as a named function
export const getData = async () => {
  return await API.get('/data');
};
