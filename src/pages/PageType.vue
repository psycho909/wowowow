<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GHome from "../components/GHome.vue";
import GLightbox from "../components/GLightbox.vue";
import { GetPageType } from "../api";
import { loadingShow, loadingHide } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);

let typeList = ref([])
let totalPage = ref(0)
let currentPage = ref(1)
let total = ref(5)
let messageText = ref("");
let messageLightbox = ref(false);
let pageTypeLightbox = ref(false);
let pageTypeSeq = ref("");
let pageTypeTitle = ref("");
let pageTypeDescription = ref("");

onMounted(() => {
    loadingShow()
    GetPageType(store.otp).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            loadingHide()
            return;
        }
        typeList.value = listData;
        let findType2 = typeList.value.find((item) => {
            return item.pageTypeSeq == 2
        })
        if (!findType2) {
            typeList.value.push({
                "pageTypeSeq": 2,
                "subject": "分區顯示版型",
                "directions": "此版型特色在於加入後背景圖(第一頁)為固定頁(含logo)</BR>其他頁面可自由新增，一次增加一頁</BR>僅可使用固定元件所有頁面的背景獨立",
                "image": "/img/2.jpg"
            })
        }

        totalPage.value = Math.ceil(typeList.value.length / total.value);
    }).finally(() => {
        loadingHide()
    })
})

const confirmType = (type) => {
    pageTypeTitle.value = type.subject;
    pageTypeDescription.value = type.directions;
    pageTypeLightbox.value = true;
    pageTypeSeq.value = type.pageTypeSeq;

}
const prev = () => {
    let temp = currentPage.value;
    temp -= 1;
    if (temp < 1) {
        return;
    }

    currentPage.value = temp;
}
const next = () => {
    let temp = currentPage.value;
    temp += 1;
    if (temp > totalPage.value) {
        return;
    }
    typeList.value = []
    currentPage.value = temp;
}

const onSubmit = () => {
    store.$patch(state => {
        state.pageTypeSeq = pageTypeSeq.value;
        state.page = "CreateEvent";
    })
}

const onCancel = () => {
    pageTypeLightbox.value = false;
}
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>選擇樣板</span>
        </div>
        <div class="page-type__content">
            <div class="page-type__box" v-for="t in typeList" @click="confirmType(t)">
                <a href="javascript:;" class="page-type__type" :data-type="t.pageTypeSeq">
                    <img :src="t.image" alt="">
                </a>
                <div class="page-type__name">{{ t.subject }}</div>
            </div>
        </div>
        <div class="pagination__box" v-if="!loading">
            <a href="javascript:;" class="btn btn__prev" :class="[currentPage == 1 ? 'disabled' : '']"
               @click="prev">上一頁</a>
            <div class="pagination__page">
                <span class="on">{{ currentPage }}</span>/
                <span>{{ totalPage }}</span>
            </div>
            <a href="javascript:;" class="btn btn__next" :class="[currentPage == totalPage ? 'disabled' : '']"
               @click="next">下一頁</a>
        </div>
    </div>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ messageText }}</div>
        </template>
    </g-lightbox>

    <g-lightbox v-model:showLightbox="pageTypeLightbox">
        <template #lightbox-title>
            <div>{{ pageTypeTitle }}</div>
        </template>
        <template #lightbox-content>
            <div v-html="pageTypeDescription"></div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel">取消</a>
        </template>
    </g-lightbox>
</template>