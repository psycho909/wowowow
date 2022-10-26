<script setup>
import Page from "./pages/Page.vue";
import axios from "axios";
import { mainStore } from "./store/index";
const store = mainStore()

onMounted(() => {
	const loading = ref(true)
	store.setPage("Page");
	axios.get("http://localhost:3000/data/").then((res) => {
		store.setData(res.data.listData)
		loading.value = false
	})

})
</script>
    
<template>
	<template v-if="!loading">
		<Page></Page>
	</template>
</template>
    