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

})
onUpdated(() => {

})
onUnmounted(() => {

})

</script>
<template>
    <Teleport to="body">>
        <div class="g-lightbox" v-if="showLightbox" ref="lightboxRef">
            <div class="g-lightbox__module"></div>
            <div class="g-lightbox__wrap">
                <button type="button" class="g-lightbox__close" @click="closeBtn">close</button>
                <div class="g-lightbox__content">
                    <slot name="lightbox-title"></slot>
                    <slot name="lightbox-content"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>