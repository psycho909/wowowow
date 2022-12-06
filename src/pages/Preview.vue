<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GCookie from "../components/GCookie.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, gameNameFilter, pageInfo } from "../Tool";
import gameFooter from "../gameFooter";
import topBar from "../topBar";
const store = mainStore()
let state = null;

if (window.sessionStorage.getItem("state")) {
    state = JSON.parse(window.sessionStorage.getItem("state"))
    store.setState(state);
}
let { content } = storeToRefs(store);
let footer = {}

onMounted(async () => {
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    footer.prod = gameNameFilter(store.config.gameseq)[0].gameName || '天堂M';
    footer.theme = store.config.footer == 1 ? 'light' : 'dark';
    gameFooter(footer);
    pageInfo(store.config);
    if (store.config.header == 1) {
        topBar(store.config.gameseq)
    }
})
const cssVar = computed(() => {
    if (content?.value.length > 0) {
        let bg = content.value.filter((c, i) => {
            return c.component == "GBg"
        })
        return {
            "--color": bg[0].content.color,
            "--pc": `url(${bg[0].content.pc})`,
            "--mobile": `url(${bg[0].content.mobile ? bg[0].content.mobile : bg[0].content.pc})`,
            "--w": bg[0].content.w,
            "--h": bg[0].content.h,
            "--mw": bg[0].content.mw,
            "--mh": bg[0].content.mh,
        }
    }
})
const onEvent = (type) => {
    switch (type) {
        case "editPage":
            store.setStorageState(store.$state, "EditPage");
            store.setPage("EditPage", true);
            break;
        case "eventList":
            store.setStorageState(store.$state, "EventList");
            store.setPage("EventList", true);
            break;
    }
}
</script>
<template>
    <section class="page-preview">(此頁面內容尚未儲存，如需保留請記得存檔)</section>
    <section class="wrap" :data-type="store.config.pageTypeSeq" :style="cssVar">
        <template v-for="block in content">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <GCookie v-if="(store.config.cookie == 1)" :data="store.config"></GCookie>
    <!-- <div class="page-control__group">
        <a href="javascript:;" class="page-control__btn" @click="onEvent('editPage')"
           v-if="store.config.flag == 0">回編輯</a>
    </div> -->
</template>