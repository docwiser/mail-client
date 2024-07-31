<script setup>
import {ref, computed, watch, onMounted} from 'vue';
const message = ref('');
const settings = ref({loaded: false});
onMounted(() => {
var localsettings = JSON.parse(localStorage.getItem("mailsettings")) || {};
settings.value = {loaded: true, ...localsettings};
if (settings.value?.auth === 'ssl') {
settings.value.port = 465;
} else if(settings.value?.auth === 'tls') {
settings.value.port = 587;
}
});
const handleSubmit = () => {
localStorage.setItem("mailsettings", JSON.stringify(settings.value));
message.value = "";
setTimeout(() => {
message.value = "Settings Updated Successfully!";
}, 300);
}
watch(() => settings.value.auth, (newAuth) => {
if (newAuth === 'ssl') {
settings.value.port = 465;
} else if(newAuth === 'tls') {
settings.value.port = 587;
}
});
</script>
<template>
<div v-if="settings.loaded">
<form @submit.prevent="handleSubmit">
<label for="host">SMTP Host:</label>
<input type="text" id="host" v-model="settings.host" required="">
<label>Authentication Type:</label>
<input type="radio" id="ssl" v-model="settings.auth" name="ssl" value="ssl">
<label for="ssl">SSL</label>
<input type="radio" id="tls" v-model="settings.auth" name="tls" value="tls">
<label for="tls">TLS</label>
<label for="port">SMTP Port(Automaticly field based on Authentication Type):</label>
<input type="number" id="port" v-model="settings.port" readonly required="">
<label for="username">SMTP Username(Email):</label>
<input type="mail" id="username" v-model="settings.username" required="">
<label for="cname">Display Name:</label>
<input type="text" id="cname" v-model="settings.name" minlength="5" maxlength="100" required="">
<label for="password">SMTP Password:</label>
<input :type="settings.checked ? 'text' : 'password'" id="password" v-model="settings.password" required="">
<input type="checkbox" id="chkd" v-model="settings.checked">
<label for="chkd">Show Password</label>
<input type="submit" value="Save">
</form>
</div>
<div v-else>
<p>Loading Configuration...</p>
</div>
<p role="alert">{{message}}</p>
</template>