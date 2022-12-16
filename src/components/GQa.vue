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

})
onUpdated(() => {

})
onUnmounted(() => {

})
</script>
<template>
    <div>
    </div>
</template>