<script setup>
import { mainStore } from "../store/index";
const props = defineProps(["uid"])
const store = mainStore()
const remove = () => {
    store.removeCpt(props.uid);
}
const up = () => {
    store.upCpt(props.uid);
}
const down = () => {
    store.downCpt(props.uid);
}
const edit = () => {
    store.editCpt(props.uid);
}
</script>
<template>
    <div class="btn-group">
        <button type="button" class="modify-btn__edit" @click="edit">edit</button>
        <button type="button" class="modify-btn__up" @click="up">up</button>
        <button type="button" class="modify-btn__down" @click="down">down</button>
        <button type="button" class="modify-btn__remove" @click="remove">remove</button>
        <slot name="btn-update"></slot>
    </div>
</template>