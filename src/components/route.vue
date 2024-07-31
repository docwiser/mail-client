<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
const currentRouteMessage = ref('');
const router = useRouter();
router.afterEach((newRoute, oldRoute) => {
currentRouteMessage.value = `${newRoute.name} is loaded`;
});
</script>
<template>
<p role="alert" aria-atomic="true" aria-live="assertive">{{currentRouteMessage}}</p>
</template>