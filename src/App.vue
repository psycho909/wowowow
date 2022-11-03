<script setup>
import { storeToRefs } from "pinia";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import ApproveList from "./pages/ApproveList.vue";
import Home from "./pages/Home.vue";
import EditPage from "./pages/EditPage.vue";
import Page from "./pages/Page.vue";
import Preview from "./pages/Preview.vue";
import PageType from "./pages/PageType.vue";
import axios from "axios";
import { mainStore } from "./store/index";
const store = mainStore()
const { page } = storeToRefs(store);
onMounted(() => {
	axios.get("http://localhost:3000/data/").then((res) => {
		store.setSave(res.data.listData)
	})
})
</script>
    
<template>
	<Home v-if="page == 'Home'"></Home>
	<PageType v-if="page == 'PageType'"></PageType>
	<CreateEvent v-if="page == 'CreateEvent'"></CreateEvent>
	<EventList v-if="page == 'EventList'"></EventList>
	<ApproveList v-if="page == 'ApproveList'"></ApproveList>
	<EditPage v-if="page == 'EditPage'"></EditPage>
	<Preview v-if="page == 'Preview'"></Preview>
</template>
    