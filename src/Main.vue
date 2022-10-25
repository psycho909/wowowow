<script setup>
import Page from "./pages/Page.vue";
import axios from "axios";
import { mainStore } from "./store/index";
const store = mainStore()

onMounted(() => {
	console.log("MAIN")
	store.setPage("Page");
	axios.get("http://localhost:3000/data/").then((res) => {
		store.setData(res.data.listData)
	})

})
</script>
    
<template>
	<Page></Page>
</template>
    