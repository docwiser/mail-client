<script setup>
import { RouterLink, RouterView } from 'vue-router'
import RouteAnnouncer from './components/route.vue';
import useSocket from './composables/socket';
const {socket, connectionManager, reconnect} = useSocket();
</script>
<template>
<header>
<img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
<div v-if="connectionManager.connected">
<p>Connected with the server: {{connectionManager.socketID}}</p>
</div>
<div v-else-if="connectionManager.error">
<p>Connection Error: {{connectionManager.errorLog}}</p>
</div>
<div v-else-if="connectionManager.disconnected">
<p>Disconnected from the server</p>
</div>
<details>
<summary role="button">Open Menu</summary>
<nav aria-label="Primary">
<Router-link to="/">Home</Router-link>
<Router-link to="/list">my Lists</Router-link>
<Router-link to="/compose">Compose</Router-link>
<Router-link to="/settings">SMTP Settings</Router-link>
</nav>
</details>
</header>
<main id="content">
<RouterView />
</main>
<footer>
<p>&copy; copyright Mail Transporter {{new Date().getFullYear()}} | Powered by <a href="https://www.techassistantforblind.com">Tech Assistant for Blind</a></p>
</footer>
<RouteAnnouncer />
</template>

<style scoped>
header {
line-height: 1.5;
max-height: 100vh;
}

.logo {
display: block;
margin: 0 auto 2rem;
}

nav {
width: 100%;
font-size: 12px;
text-align: center;
margin-top: 2rem;
}

nav a.router-link-exact-active {
color: var(--color-text);
}

nav a.router-link-exact-active:hover {
background-color: transparent;
}

nav a {
display: inline-block;
padding: 0 1rem;
border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
border: 0;
}

@media (min-width: 1024px) {
header {
display: flex;
place-items: center;
padding-right: calc(var(--section-gap) / 2);
}

.logo {
margin: 0 2rem 0 0;
}

header .wrapper {
display: flex;
place-items: flex-start;
flex-wrap: wrap;
}

nav {
text-align: left;
margin-left: -1rem;
font-size: 1rem;

padding: 1rem 0;
margin-top: 1rem;
}
}
</style>
