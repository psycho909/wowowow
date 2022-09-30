<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);
</script>
<template>
</template>