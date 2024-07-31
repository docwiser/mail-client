<script setup>
import { ref, onMounted, onUnmounted, watch, computed} from 'vue';
import useSocket from '../composables/socket';
const list = ref({ loaded: false, lists: [] });
const mailConfig = ref({ loaded: false });
const selectedList = ref('');
const subject = ref('');
const body = ref('');
const message = ref('');
const emailsSent = ref(0);
const emailsErrored = ref(0);
const errorLog = ref({ loaded: false, logs: [] });
const progressBar = ref(null);
const { socket, connectionManager, reconnect } = useSocket();
const sendMessage = (value) => {
message.value = value;
setTimeout(() => {
message.value = '';
}, 4000);
};
onMounted(() => {
const locallist = JSON.parse(localStorage.getItem('maillist')) || { lists: [] };
const mailc = JSON.parse(localStorage.getItem('mailsettings')) || { loaded: false };
const savedSubject = localStorage.getItem('subject') || '';
const savedBody = localStorage.getItem('body') || '';
const savedSelectedList = localStorage.getItem('selectedList') || '';
list.value = { loaded: true, ...locallist };
mailConfig.value = { loaded: true, ...mailc };
subject.value = savedSubject;
body.value = savedBody;
selectedList.value = savedSelectedList;
socket.on('mailsent', (email) => {
emailsSent.value += 1;
sendMessage(`${emailsSent.value} emails Sent`);
updateProgressBar();
});
socket.on('mailerror', (log) => {
emailsErrored.value += 1;
errorLog.value.loaded = true;
errorLog.value.logs.push(log);
sendMessage(`${emailsErrored.value} Errors found. Current error: ${log.error}. Please expand the Error details menu to view all errors`);
updateProgressBar();
});
});
onUnmounted(() => {
socket.off('mailsent');
socket.off('mailerror');
});
watch([subject, body, selectedList], () => {
localStorage.setItem('subject', subject.value);
localStorage.setItem('body', body.value);
localStorage.setItem('selectedList', selectedList.value);
});
const sendEmails = () => {
if (!connectionManager.value.connected) {
sendMessage(`Sorry. we cant find a sutable layer to connect with our underlying mail transportation system. Please reload the page and click the "Send" Button`);
} else if (!mailConfig.value.loaded) {
sendMessage("Sorry, you haven't provided any SMTP information to send the emails. Please go to SMTP settings and provide your SMTP information and try again.");
} else if (!selectedList.value || !subject.value.trim() || !body.value.trim()) {
sendMessage('Please select a list, and fill in both the subject and body.');
} else {
sendMessage(`Sending emails...`);
const selectedEmails = list.value.lists[selectedList.value].items.map(item => ({
email: item.email,
name: item.name,
body: body.value.replace(/\[name\]/g, item.name).replace(/\[email\]/g, item.email)
}));
emailsSent.value = 0;
emailsErrored.value = 0;
errorLog.value.loaded = false;
errorLog.value.logs = [];
socket.emit('sendmails', mailConfig.value, selectedEmails, subject.value);
}
};

const updateProgressBar = () => {
if (progressBar.value) {
const totalEmails = list.value.lists[selectedList.value].items.length;
const totalProcessed = emailsSent.value + emailsErrored.value;
progressBar.value.style.width = `${(totalProcessed / totalEmails) * 100}%`;
}
};

const renderedBody = computed(() => {
if (selectedList.value && list.value.lists[selectedList.value].items.length > 0) {
const firstItem = list.value.lists[selectedList.value].items[0];
return body.value.replace(/\[name\]/g, firstItem.name).replace(/\[email\]/g, firstItem.email);
}
return body.value;
});
</script>

<template>
<div v-if="list.loaded">
<form @submit.prevent="sendEmails">
<div>
<label for="subject">Subject:</label>
<input id="subject" v-model="subject" placeholder="Subject" required />
</div>
<div>
<label for="body">Body:</label>
<textarea id="body" v-model="body" placeholder="Email body" required></textarea>
<details>
<summary role="button">View the message Body (Rendered)</summary>
<div>{{ renderedBody }}</div>
</details>
</div>
<div>
<label for="list">Select List:</label>
<select id="list" v-model="selectedList" required>
<option value="" disabled>---Please select a list---</option>
<option v-for="(lst, index) in list.lists" :key="index" :value="index">{{ lst.name }}</option>
</select>
</div>
<button type="submit">Send</button>
</form>
<div>
<p role="alert">{{ message }}</p>
<div class="progress-bar-container">
<div class="progress-bar" ref="progressBar"></div>
</div>
<p>{{ emailsSent }} emails sent, {{ emailsErrored }} errors</p>
</div>
<details v-if="errorLog.loaded">
<summary role="button">View {{emailsErrored}} Error Details</summary>
<ul style="list-style-type:none;">
<li v-for="(item, index) in errorLog.logs" :key="index">
<p>Index: {{ index }}</p>
<p>Email: {{ item.email }}</p>
<p>Error: {{ item.error }}</p>
</li>
</ul>
</details>
</div>
<div v-else>
<p>Loading Configuration...</p>
</div>
</template>

<style scoped>
.progress-bar-container {
width: 100%;
background-color: #f3f3f3;
border: 1px solid #ccc;
margin-top: 10px;
height: 20px;
position: relative;
}

.progress-bar {
background-color: #4caf50;
height: 100%;
width: 0;
transition: width 0.4s ease;
}
</style>
