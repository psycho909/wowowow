<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GHome from "../components/GHome.vue";
import { GetPageType } from "../api";
import { loadingShow, loadingHide } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);

let typeList = ref([])
let totalPage = ref(0)
let currentPage = ref(1)
let loading = ref(true)

onMounted(() => {
    loadingShow()
    GetPageType(1).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        loadingHide()
        typeList.value = listData;
        totalPage.value = Math.ceil(listData.length / 12);
        loading.value = false;
    })
})

const confirmType = (type) => {
    store.$patch(state => {
        state.pageTypeSeq = type
        state.page = "CreateEvent"
    })
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
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>選擇樣板</span>
        </div>
        <div class="select-type__content">
            <div class="select-type__box" v-for="t in typeList" @click="confirmType(t.pageTypeSeq)">
                <a href="javascript:;" class="select-type__type"></a>
                <div class="select-type__name">{{ t.subject }}</div>
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
</template>