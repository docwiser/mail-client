<script setup>
import {onMounted} from 'vue';
import List from '../components/list.vue';
onMounted(() => {
document.title = "my Lists | Transport";
});
</script>
<template>
<List />
</template>