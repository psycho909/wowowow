<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);

const changePage = (page) => {
    store.$patch(state => {
        state.page = page
    })
}
</script>
<template>
    <div class="container">
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>活動網站製作系統</span>
        </div>
        <div class="home-btn__group">
            <a href="javascript:;" class="home-btn__item" @click="changePage('PageType')">新增活動</a>
            <a href="javascript:;" class="home-btn__item" @click="changePage('EventList')">活動列表 </a>
            <a href="javascript:;" class="home-btn__item" @click="changePage('ApproveList')">已審活動 </a>
            <a href="javascript:;" class="home-btn__item" @click="changePage('Guide')">使用教學 </a>
        </div>
    </div>
</template>