<script>
import { watchEffect } from 'vue';
export default {
    name: "g-edit",
    label: ""
}
</script>
<script setup>
import { mainStore } from "../store/index";
const props = defineProps({
    showEdit: {
        type: Boolean, default: false
    }, uid: {
        type: Number
    }, func: {
        type: Function
    }
})
const store = mainStore()
const emit = defineEmits(["update:showEdit"])
const closeBtn = () => {
    store.editCptClose(props.uid);
    emit("update:showEdit", false)
}

watchEffect(() => {
    if (props.showEdit) {
        document.querySelector("body").classList.add("ov-hidden");
    } else {
        document.querySelector("body").classList.remove("ov-hidden");
    }
})
</script>
<template>
    <Teleport to="body">
        <div class="g-edit" v-if="showEdit" @click="func">
            <div class="g-edit__module"></div>
            <div class="g-edit__wrap">
                <slot name="edit-close">
                    <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
                </slot>
                <div class="g-edit__content">
                    <slot name="edit-content"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>