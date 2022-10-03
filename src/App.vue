
<script setup>
import { storeToRefs } from "pinia";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import Home from "./pages/Home.vue";
import Page from "./pages/Page.vue";
import SelectType from "./pages/SelectType.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);
</script>
    
<template>
	<Home v-if="store.page == 'Home'"></Home>
	<SelectType v-if="store.page == 'SelectType'"></SelectType>
	<CreateEvent v-if="store.page == 'CreateEvent'"></CreateEvent>
	<EventList v-if="store.page  == 'EventList'"></EventList>
	<Page v-if="store.page  == 'Page'"></Page>
</template>
    