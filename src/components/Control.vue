<script setup>
import { mainStore } from "../store/index";
const props = defineProps(["uid"])
const store = mainStore()
console.log(props.uid)
const remove = () => {
    store.removeCpt(props.uid);
}
const up = () => {
    store.upCpt(props.uid);
}
const down = () => {
    store.downCpt(props.uid);
}
</script>
<template>
    <div class="btn-group">
        <button type="button" class="up" @click="up">up</button>
        <button type="button" class="down" @click="down">down</button>
        <button type="button" class="remove" @click="remove">remove</button>
        <slot name="btn-update"></slot>
    </div>
</template>