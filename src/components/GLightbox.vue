<script>
export default {
    name: "Lightbox",
    label: ""
}
</script>
<script setup>
const props = defineProps({
    showLightbox: {
        type: Boolean, default: false
    }
})
const emit = defineEmits(["update:showLightbox"])
const lightboxRef = ref(null)

defineExpose({
    lightboxRef
})
const closeBtn = () => {
    emit("update:showLightbox", false)
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
    <div class="edit" v-if="showLightbox" ref="lightboxRef">
        <div class="edit-module"></div>
        <div class="edit-wrap">
            <button type="button" class="edit-close" @click="closeBtn">close</button>
            <div class="edit-content">
                <slot name="edit-title"></slot>
                <slot name="edit-content"></slot>
            </div>
        </div>
    </div>
</template>