<script setup>
import { mainStore } from "../store/index";
const store = mainStore()
const onBack = () => {
    store.setPage("Home")
}
</script>
<template>
    <a href="javascript:;" class="page-control__back" @click="onBack('home')">回首頁</a>
</template>