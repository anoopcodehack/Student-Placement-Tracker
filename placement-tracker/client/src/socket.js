// src/socket.js
import { io } from 'socket.io-client';
import { API_BASE_URL } from './utils/runtimeConfig';

const socket = io(API_BASE_URL, { transports: ['websocket', 'polling'] });
export default socket;