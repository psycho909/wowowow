
<script setup>
import { storeToRefs } from "pinia";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import Home from "./pages/Home.vue";
import EditPage from "./pages/EditPage.vue";
import Page from "./pages/Page.vue";
import Preview from "./pages/Preview.vue";
import SelectType from "./pages/SelectType.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);

onMounted(() => {
	store.$patch((state) => {
		state.MODE = import.meta.env.MODE;
	})
})
</script>
    
<template>
	<template v-if="MODE == 'development'">
		<Home v-if="page == 'Home'"></Home>
		<SelectType v-if="page == 'SelectType'"></SelectType>
		<CreateEvent v-if="page == 'CreateEvent'"></CreateEvent>
		<EventList v-if="page  == 'EventList'"></EventList>
		<EditPage v-if="page  == 'EditPage'"></EditPage>
		<Preview v-if="page  == 'Preview'"></Preview>
	</template>
	<template v-else>
		<Page v-if="page  == 'Page'"></Page>
	</template>
</template>
    