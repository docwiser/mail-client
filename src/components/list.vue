<script setup>
import { ref, computed, onMounted } from 'vue';
const list = ref({ loaded: false, lists: [] });
const config = ref({ view: 'list', currentList: null });
const newListName = ref('');
const newEmailName = ref('');
const newEmail = ref('');
const message = ref('');
const sendMessage = (value) => {
message.value = value;
setTimeout(() => {
message.value = "";
}, 4000);
};
onMounted(() => {
var locallist = JSON.parse(localStorage.getItem("maillist")) || { lists: [] };
list.value = { loaded: true, ...locallist };
});
const saveListToLocalStorage = () => {
localStorage.setItem("maillist", JSON.stringify(list.value));
};
const createList = () => {
if (newListName.value.trim() !== '') {
list.value.lists.push({ name: newListName.value.trim(), items: [] });
newListName.value = '';
saveListToLocalStorage();
sendMessage("List Created Successfully!");
}
};
const deleteList = (listIndex) => {
if (confirm("Are you sure you want to delete this list?")) {
list.value.lists.splice(listIndex, 1);
saveListToLocalStorage();
sendMessage("List Deleted Successfully!");
config.value.view = 'list';
}
};
const editList = (listIndex) => {
config.value.currentList = listIndex;
config.value.view = 'edit';
sendMessage("Showing Edit Screen");
};
const updateList = () => {
saveListToLocalStorage();
sendMessage("List Updated Successfully!");
config.value.view = 'single';
};
const addEmailToList = () => {
if (newEmailName.value.trim() !== '' && newEmail.value.trim() !== '') {
list.value.lists[config.value.currentList].items.push({ name: newEmailName.value.trim(), email: newEmail.value.trim() });
newEmailName.value = '';
newEmail.value = '';
saveListToLocalStorage();
sendMessage("Email Added");
} else {
sendMessage("All Informations are mandatory");
}
};
const removeEmailFromList = (emailIndex) => {
list.value.lists[config.value.currentList].items.splice(emailIndex, 1);
saveListToLocalStorage();
sendMessage("Email Removed");
};
const showListDetails = (listIndex) => {
config.value.currentList = listIndex;
config.value.view = 'single';
sendMessage("Showing Single List");
};
const goBack = () => {
config.value.view = 'list';
};
const handleFileImport = async (event, type) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (e) => {
const data = e.target.result;
if (type === 'json') {
try {
const jsonData = JSON.parse(data);
jsonData.forEach(item => {
if (item.name && item.email) {
list.value.lists[config.value.currentList].items.push({ name: item.name, email: item.email });
}
});
saveListToLocalStorage();
sendMessage("Emails Imported Successfully!");
} catch (error) {
sendMessage("Invalid JSON file");
}
} else if (type === 'csv') {
const rows = data.split('\n').slice(1);
rows.forEach(row => {
const [name, email] = row.split(',');
if (name && email) {
list.value.lists[config.value.currentList].items.push({ name: name.trim(), email: email.trim() });
}
});
saveListToLocalStorage();
sendMessage("Emails Imported Successfully!");
}
};
reader.readAsText(file);
}
};
</script>
<template>
<div v-if="list.loaded">
<div v-if="config.view === 'list'">
<h1>Mail Lists</h1>
<details>
<summary role="button">Create New List</summary>
<form @submit.prevent="createList">
<input v-model="newListName" placeholder="New list name" required="" />
<input type="submit" value="Create" />
</form>
</details>
<ul>
<li v-for="(lst, index) in list.lists" :key="index">
<span @click="showListDetails(index)" style="cursor: pointer;">{{ lst.name }}</span>
<button @click="editList(index)">Edit</button>
<button @click="deleteList(index)">Delete</button>
</li>
</ul>
</div>
<div v-if="config.view === 'single'">
<button @click="goBack">Back</button>
<h2>{{ list.lists[config.currentList].name }}</h2>
<button @click="editList(config.currentList)">Edit</button>
<button @click="deleteList(config.currentList)">Delete</button>
<ul>
<li v-for="(item, index) in list.lists[config.currentList].items" :key="index">
{{ item.name }} - {{ item.email }}
</li>
</ul>
<button @click="editList(config.currentList)">Edit</button>
<button @click="deleteList(config.currentList)">Delete</button>
</div>
<div v-if="config.view === 'edit'">
<button @click="goBack">Back</button>
<h2>Edit {{ list.lists[config.currentList].name }}</h2>
<details>
<summary role="button">More Options</summary>
<details>
<summary role="button">Add new Email</summary>
<form @submit.prevent="addEmailToList">
<input v-model="newEmailName" placeholder="Name" required="" />
<input v-model="newEmail" placeholder="Email" required="" />
<input type="submit" value="Add" />
</form>
</details>
<details>
<summary role="button">Import Emails</summary>
<input type="file" accept=".json" @change="(e) => handleFileImport(e, 'json')" aria-label="Import from JSON" />
<input type="file" accept=".csv" @change="(e) => handleFileImport(e, 'csv')" aria-label="Import from CSV" />
</details>
<button @click="updateList">Save Changes</button>
</details>
<ul>
<li v-for="(item, index) in list.lists[config.currentList].items" :key="index">
{{ item.name }} - {{ item.email }}
<button @click="removeEmailFromList(index)">Remove</button>
</li>
</ul>
<details>
<summary role="button">Add new Email</summary>
<form @submit.prevent="addEmailToList">
<input v-model="newEmailName" placeholder="Name" required="" />
<input v-model="newEmail" placeholder="Email" required="" />
<input type="submit" value="Add" />
</form>
</details>
<details>
<summary role="button">Import Emails</summary>
<input type="file" accept=".json" @change="(e) => handleFileImport(e, 'json')" aria-label="Import from JSON" />
<input type="file" accept=".csv" @change="(e) => handleFileImport(e, 'csv')" aria-label="Import from CSV" />
</details>
<button @click="updateList">Save Changes</button>
</div>
<p role="alert">{{ message }}</p>
</div>
<div v-else>
<p>Loading Configuration...</p>
</div>
<div v-if="list.lists.length==0">
<p>There are no lists found. please create a list and add emails</p>
</div>
</template>
