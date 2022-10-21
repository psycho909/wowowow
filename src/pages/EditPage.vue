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
const store = mainStore()
const { content } = storeToRefs(store);
const MODE = import.meta.env.MODE;
let saveLightbox = ref(false)
let auditLightbox = ref(false)
let homeLightbox = ref(false)


const cssVar = computed(() => {
    let bg = content.value.body.filter((c, i) => {
        return c.component == "GBg"
    })
    return {
        "--color": bg[0].content.color,
        "--pc": `url(${bg[0].content.pc})`,
        "--mb": `url(${bg[0].content.mb ? bg[0].content.mb : bg[0].content.pc})`,
        "--w": bg[0].content.w,
        "--h": bg[0].content.h,
        "--mw": bg[0].content.mw,
        "--mh": bg[0].content.mh,
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

const pageInfo = (data) => {
    document.title = data.title;
    document.querySelectorAll("meta[name='description']")[0].setAttribute("content", data.description);
    document.querySelectorAll("meta[property='og:title']").setAttribute("content", data.fbTitle);
    document.querySelectorAll("meta[property='og:description']").setAttribute("content", data.fbDescription);
    document.querySelectorAll("meta[property='og:image']").setAttribute("content", data.fbImage);
    if (data.cookie == "true") {
        InsertCookie()
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

const onEvent = (type) => {
    switch (type) {
        case "home":
            homeLightbox.value = true;
            break;
        case "submit":
            auditLightbox.value = true;
            break;
        case "preview":
            store.$patch(state => {
                state.page = "Preview"
            })
            break;
        case "save":
            axios.post("http://localhost:3000/data/", {
                listData: store.content
            }).then((res) => {
                return store.setSave(store.content)
            }).then((res) => {
                saveLightbox.value = true;
            })
            break;
        case "eventList":

            break;
    }
}

const onAuditSubmit = () => {
    store.$patch(state => {
        state.page = "EventList"
    })
}

const onAuditCancel = () => {
    auditLightbox.value = false;
}

const onHomeSubmit = () => {
    InsertCookie
    store.$patch(state => {
        state.page = "Home"
    })
}

const onHomeCancel = () => {
    homeLightbox.value = false;
}
</script>
<template>
    <section class="wrap" :class="MODE" data-type="one" :style="cssVar">
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
            <a href="javascript:;" class="btn btn__reset" @click="onHomeCancel">取消</a>
        </template>
    </g-lightbox>

    <!-- 送審 -->
    <g-lightbox v-model:showLightbox="auditLightbox">
        <template #lightbox-content>
            <div class="text-center">送審前請先確認已存檔！是否確定送審活動【活動名稱活動名稱活動名稱活動名稱】送審後將無法繼續編輯，是否確認送審？</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onAuditSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onAuditCancel">取消</a>
        </template>
    </g-lightbox>

    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="saveLightbox" :action="false">
        <template #lightbox-content>
            <div class="text-center">已存檔完成</div>
        </template>
    </g-lightbox>
</template>