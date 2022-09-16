<script>
export default {
    name: ""
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import Control from "./Control.vue";
const props = defineProps(["content"])
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
        <Control :uid="content.uid" />
    </div>
</template>