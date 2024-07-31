<script setup>
import {onMounted} from 'vue';
import Settings from '../components/settings.vue';
onMounted(() => {
document.title = "Settings | Transport";
});
</script>
<template>
<h1>Settings</h1>
<p>Update your SMTP Settings</p>
<Settings />
</template>