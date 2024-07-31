import { ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
const socket = io('https://mail-hud9.onrender.com');
const connectionManager = ref({
connected: false,
disconnected: true,
error: false,
errorLog: '',
isRefresh: false,
socketID: ''
});
socket.on('connect', () => {
connectionManager.value.connected = true;
connectionManager.value.disconnected = false;
connectionManager.value.socketID = socket.id;
});
socket.on('disconnect', () => {
connectionManager.value.connected = false;
connectionManager.value.disconnected = true;
});
socket.on('connect_error', (err) => {
connectionManager.value.error = true;
connectionManager.value.errorLog = err;
console.error('Connection Error:', err);
});

const useSocket = () => {
onUnmounted(() => {
socket.disconnect();
});

const reconnect = () => {
if (connectionManager.value.disconnected) {
socket.connect();
}
};

return { socket, connectionManager, reconnect };
};

export default useSocket;
