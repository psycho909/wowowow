<script>
import { onMounted, onUnmounted, watchEffect } from 'vue';
export default {
    name: "Gbox"
}
</script>
<script setup>
const props = defineProps({
    options: {
        type: Object
    },
    afterOpen: {
        type: Function
    },
    afterClose: {
        type: Function
    },
    modelValue: {
        type: Boolean, default: false
    }
})
const emit = defineEmits(["update:modelValue"])
const closeBtn = () => {
    emit("update:modelValue", false)
}
onMounted(() => {
    if (props.afterOpen) {
        props.afterOpen()
    }
})
onUnmounted(() => {
    if (props.afterClose) {
        props.afterClose()
    }
})
watchEffect(() => {
    if (!props.modelValue) {
        if (props.afterClose) {
            props.afterClose()
        }
    }
})
</script>
<template>
    <Teleport to="body">
        <div class="gbox" :class="options.addClass" id="gbox" v-if="modelValue">
            <div class="gbox-module"></div>
            <div class="gbox-wrap">
                <div class="gbox-content">
                    <slot name="content"></slot>
                </div>
                <button class="gbox-close" v-if="options.hasCloseBtn" @click="closeBtn">×</button>
                <div class="gbox-action" v-if="options.hasActionBtn">
                    <slot name="actionBtns">
                        <a class="gbox-btn" href="javascript:;" @click="closeBtn">確定</a>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>