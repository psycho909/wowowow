<script setup>
import Page from "./pages/Page.vue";
import { mainStore } from "./store/index";
import { GetApprovedEventMain } from "./api";
import { loadingShow, loadingHide, pageInfo } from "./Tool";
import topBar from "./topBar";
import gameFooter from "./gameFooter";
import GLightbox from "./components/GLightbox.vue";
import GCookie from "./components/GCookie.vue";
const store = mainStore()
let messageText = ref("");
let messageLightbox = ref(false);
let cookieLightbox = ref(false);
let configData = ref("");

onMounted(() => {
	loadingShow();
	let url, Id;
	let href = location.search;
	let hrefSplit = href.split("&")
	const regexUrl = new RegExp("Url");
	const regexId = new RegExp("Id=");
	if (regexUrl.test(hrefSplit[0])) {
		url = hrefSplit[0].replace("?Url=", "");
	}
	if (regexId.test(hrefSplit[1])) {
		Id = hrefSplit[1].replace("Id=", "");
	}
	if (url && Id) {
		GetApprovedEventMain(url, Id).then((res) => {
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
					topBar(data.gameseq)
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
    