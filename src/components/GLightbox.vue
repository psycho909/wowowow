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
    },
    style: {
        type: String
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

</script>
<template>
    <Teleport to="body">
        <div class="g-lightbox" :class="[style?style:'']" v-if="showLightbox" ref="lightboxRef">
            <div class="g-lightbox__module"></div>
            <div class="g-lightbox__wrap">
                <a href="javascript:;" class="g-lightbox__close" @click="closeBtn">close</a>
                <div class="g-lightbox__content">
                    <div class="g-lightbox__title">
                        <slot name="lightbox-title"></slot>
                    </div>
                    <slot name="lightbox-content"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>