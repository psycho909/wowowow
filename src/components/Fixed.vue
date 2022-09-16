<script>
export default {
    name: "Fixed"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import Control from "./Control.vue";
const props = defineProps(["content"])
const store = mainStore()
const { content } = storeToRefs(store);
const position = computed(() => {
    var top = props.content.top ? `top:0px;` : `bottom:0px;`;
    var left = props.content.left ? `left:0px;` : `right:0px;`;
    return top + left;
})
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
    <div class="box fixed" :style="position" :data-uid="content.uid">
        <div>fixed {{content.uid}} </div>
        <Control :uid="content.uid" />
    </div>
</template>