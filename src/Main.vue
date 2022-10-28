<script setup>
import Page from "./pages/Page.vue";
import axios from "axios";
import { mainStore } from "./store/index";
const store = mainStore()
const pageInfo = (data) => {
	document.title = data.title;
	document.querySelectorAll("meta[name='description']")[0].setAttribute("content", data.description);
	document.querySelectorAll("meta[property='og:title']").setAttribute("content", data.fbTitle);
	document.querySelectorAll("meta[property='og:description']").setAttribute("content", data.fbDescription);
	document.querySelectorAll("meta[property='og:image']").setAttribute("content", data.fbImage);
	if (data.cookie == "true") {
		document.querySelector("#cookieBarWrap").classList("on")
	}
	if (data.header == "true") {
		InsertHeader()
	}
	if (data.GA == "true") {
		InsertGA(data.GA);
	}
	if (data.GTM == "true") {
		InsertGTM(data.GTM);
	}
	if (data.script) {
		InsertScript(data.script)
	}
}
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
    