<script setup>
import Page from "./pages/Page.vue";
import { mainStore } from "./store/index";
import { GetApprovedEventMain } from "./api";
import { loadingShow, loadingHide, pageInfo, getUrlSearchParams } from "./Tool";
import topBar from "./topBar";
import GLightbox from "./components/GLightbox.vue";
import GCookie from "./components/GCookie.vue";
const store = mainStore()
let messageText = ref("");
let messageLightbox = ref(false);
let cookieLightbox = ref(false);
let configData = ref("");

onMounted(() => {
	loadingShow();
	let Url = getUrlSearchParams("Url");
	let Id = getUrlSearchParams("Id");
	if (Url && Id) {
		GetApprovedEventMain(Url, Id).then((res) => {
			let { code, message, url, data } = res.data;
			if (code != 1) {
				messageText.value = message;
				messageLightbox.value = true;
				return false;
			}
			if (data) {
				if (data.show == 0) {
					messageText.value = "活動已下架!";
					messageLightbox.value = true;
					return false;
				}
				pageInfo(data);
				if (data.cookie == 1) {
					cookieLightbox.value = true;
					configData.value = data;
				}
				if (data.header == 1) {
					topBar(data.gameName)
				}
				return store.setData(data);
			} else {
				messageText.value = "沒有內容資料!";
				messageLightbox.value = true;
				return false;
			}

		}).then((res) => {
			if (!res) {
				return;
			}
			store.setPage("Page");
		}).finally(() => {
			loadingHide();
		})
	} else {
		messageText.value = "錯誤網址資訊!";
		messageLightbox.value = true;
	}
})
</script>
    
<template>
	<Page v-if="store.page == 'Page'"></Page>
	<g-lightbox v-model:showLightbox="messageLightbox">
		<template #lightbox-content>
			<div>{{ messageText }}</div>
		</template>
	</g-lightbox>
	<GCookie v-if="cookieLightbox" :data="configData"></GCookie>
</template>
    