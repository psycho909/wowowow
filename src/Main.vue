<script setup>
import Page from "./pages/Page.vue";
import { mainStore } from "./store/index";
import { loadingShow, loadingHide, pageInfo, getBrowserLocales } from "./Tool";
import topBar from "./topBar";
import GLightbox from "./components/GLightbox.vue";
import GCookie from "./components/GCookie.vue";
const store = mainStore()
let messageText = ref("");
let messageLightbox = ref(false);
let cookieLightbox = ref(false);
let configData = ref("");

onMounted(async () => {
	loadingShow();
	let currentHref = location.href;
	let _data = json;
	let { code, message, url, data } = _data;
	if (code != 1) {
		messageText.value = message;
		messageLightbox.value = true;
		return false;
	}
	if (data) {
		if (data.show == 0) {
			messageText.value = "活動已下架!";
			messageLightbox.value = true;
			loadingHide();
			return false;
		}
		pageInfo(data);
		if (data.cookie == 1) {
			cookieLightbox.value = true;
			configData.value = data;
		}
		if (data.header == 1) {
			if (data.gameName == "新瑪奇B") {
				data.gameName = "新瑪奇"
			}
			topBar(data.gameName)
		}
		let filterData = JSON.parse(data.detail).filter((v, i) => {
			return v.component == "GLang"
		})
		if (filterData.length > 0) {
			let langList = filterData[0].content;
			let currentBrowserLang = langList.langs.filter((v, i) => v.val == getBrowserLocales()[0])
			let defaultLang = langList.langs.filter((v, i) => v.val == langList.default)[0]
			if (currentBrowserLang.length > 0) {
				if (currentBrowserLang[0].url != currentHref) {
					window.location.href = currentBrowserLang[0].url
				}
			} else {
				window.location.href = defaultLang.url
			}


		}
		await store.setData(data);
		store.setPage("Page");
		loadingHide();
	} else {
		messageText.value = "沒有內容資料!";
		messageLightbox.value = true;
		loadingHide();
		return false;
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