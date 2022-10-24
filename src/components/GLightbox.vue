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
    },
    action: {
        default: true
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
</script>
<template>
    <Teleport to="body">
        <div class="g-lightbox" :style="[style?style:'']" v-if="showLightbox" ref="lightboxRef">
            <div class="g-lightbox__module"></div>
            <div class="g-lightbox__wrap">
                <slot name="lightbox-close">
                    <a href="javascript:;" class="g-lightbox__close icon-close" @click="closeBtn">close</a>
                </slot>
                <div class="g-lightbox__container">
                    <div class="g-lightbox__title">
                        <slot name="lightbox-title"></slot>
                    </div>
                    <div class="g-lightbox__content">
                        <slot name="lightbox-content"></slot>
                    </div>
                    <div class="g-lightbox__btn-group" v-if="action">
                        <slot name="lightbox-btn">
                            <a href="javascript:;" class="g-lightbox__btn" @click="closeBtn">確定</a>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>