<script setup>
import { mainStore } from "../store/index";
const props = defineProps({
    uid: {
        type: [String, Number]
    },
    title: {
        type: String
    },
    move: {
        type: Boolean,
        default: true
    },
    edit: {
        type: Boolean,
        default: true
    },
    remove: {
        type: Boolean,
        default: true
    }
})

const store = mainStore()
const onRemove = () => {
    store.removeCpt(props.uid);
}
const onUp = () => {
    store.upCpt(props.uid);
}
const onDown = () => {
    store.downCpt(props.uid);
}
const onEdit = () => {
    store.editCptOpen(props.uid);
}
</script>
<template>
    <div class="g-modify">
        <div class="g-modify-title">{{title}}</div>
        <div class="g-modify-btn__group" v-if="move">
            <a href="javascript:;" class="icon icon-up" @click="onUp">up</a>
            <a href="javascript:;" class="icon icon-down" @click="onDown">down</a>
        </div>
        <div class="g-modify-btn__group" v-if="edit">
            <a href="javascript:;" class="icon icon-edit" @click="onEdit">edit</a>
            <a href="javascript:;" class="icon icon-remove" v-if="remove" @click="onRemove">remove</a>
        </div>
    </div>
</template>