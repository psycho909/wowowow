<script>
export default {
    name: "QA"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);
onMounted(() => {
    console.log("onMounted")
})
onUpdated(() => {
    console.log("onUpdated")
})
onUnmounted(() => {
    console.log("destroyed")
})
</script>
<template>
    <div>
    </div>
</template>