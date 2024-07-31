<script setup>
import {onMounted} from 'vue';
import Compose from '../components/compose.vue';
onMounted(() => {
document.title = "Compose new Email | Transport";
});
</script>
<template>
<h1>Compose new email</h1>
<Compose />
</template>