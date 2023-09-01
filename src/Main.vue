<script setup>
import Page from "./pages/Page.vue";
import { mainStore } from "./store/index";
import { loadingShow, loadingHide, pageInfo } from "./Tool";
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
			// setTimeout(function () {
			// 	(function (gobal) {
			// 		var s = document.createElement("script");
			// 		s.async = 1;
			// 		s.src = "https://alpha-tw.beanfun.com/3KO/removable/pchome/js/topbar.js";
			// 		s.id = "top-bar";
			// 		//產品
			// 		s.setAttribute("prod", data.gameName);

			// 		$("head")
			// 			.append(s)
			// 			.ready(function () {
			// 				gobal.callTopBar;
			// 			});
			// 	})(window);
			// }, 0);
			topBar(data.gameName)
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
    