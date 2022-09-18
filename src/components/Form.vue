<script>
export default {
    name: ""
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
const handleSubmit = () => {
    console.log("handleSubmit")
}
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
    <div class="form-wrap">
        <slot></slot>
        <button type="button" class="form-btn__submit" @click="handleSubmit">Submit</button>
    </div>
</template>