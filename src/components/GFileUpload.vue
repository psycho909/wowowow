<script>
export default {
    name: "FileUpload"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GControl from "./GControl.vue";
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
        <g-control :uid="props.content.uid" />
    </div>
</template>