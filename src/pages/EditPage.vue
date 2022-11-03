<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GMenu from "../components/GMenu.vue";
import { mainStore } from "../store/index";
import GLightbox from "../components/GLightbox.vue";
import { InsertCookie, InsertScript, InsertHeader, InsertGA, InsertGTM } from "../Tool";
import axios from "axios";
import { loadingShow, loadingHide } from "../Tool";
import { UpdateEventContent, ApproveEvent } from "../api";

const store = mainStore()
const { content } = storeToRefs(store);
let saveLightbox = ref(false)
let auditLightbox = ref(false)
let homeLightbox = ref(false)
let message = ref("");
let messageLightbox = ref(false);

onMounted(() => {
    console.log(store.content)
    if (!store.content) {
        store.setData(store.template[store.pageTypeSeq]);
    }
})

const cssVar = computed(() => {
    if (content.value.body) {
        let bg = content.value.body.filter((c, i) => {
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

const menu = computed(() => {
    return Object.keys(components).map((m, i) => {
        return {
            title: m,
            label: components[m].label,
            limit: components[m].limit || 0,
            status: true
        }
    });
})

const onEvent = (type) => {
    switch (type) {
        case "home":
            homeLightbox.value = true;
            break;
        case "submit":
            auditLightbox.value = true;
            break;
        case "preview":
            store.setPage("Preview");
            break;
        case "save":
            UpdateEventContent(1, store.content).then((res) => {
                return store.setSave(store.content)
            }).then((res) => {
                saveLightbox.value = true;
            })
            break;
        case "eventList":
            store.setPage("EventList");
            break;
    }
}

const onApproveSubmit = () => {
    let data = { ...store.config, ...store.content }
    ApproveEvent(1, data).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        store.setData({})
    })
}

const onHomeSubmit = () => {
    store.setPage("Home")
}

const onCancel = (ref) => {
    ref["value"] = false;
}
</script>
<template>
    <section class="wrap development" data-type="one" :style="cssVar" v-if="content.body">
        <template v-for="block in content.body">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <g-menu :menu="menu" />
    <div class="page-control__group">
        <a href="javascript:;" class="page-control__btn" @click="onEvent('save')">存檔</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('preview')">預覽</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('submit')">送審</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('eventList')">回列表</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('home')">回首頁</a>
    </div>

    <!-- 回首頁 -->
    <g-lightbox v-model:showLightbox="homeLightbox">
        <template #lightbox-content>
            <div class="text-center">若尚未存檔會遺失目前設定，是否確定回到首頁</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onHomeSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel(homeLightbox)">取消</a>
        </template>
    </g-lightbox>

    <!-- 送審 -->
    <g-lightbox v-model:showLightbox="auditLightbox">
        <template #lightbox-content>
            <div class="text-center">送審前請先確認已存檔！是否確定送審活動【活動名稱活動名稱活動名稱活動名稱】送審後將無法繼續編輯，是否確認送審？</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onApproveSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel(auditLightbox)">取消</a>
        </template>
    </g-lightbox>

    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="saveLightbox" :action="false">
        <template #lightbox-content>
            <div class="text-center">已存檔完成</div>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ message }}</div>
        </template>
    </g-lightbox>
</template>