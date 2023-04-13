<script>
export default {
    name: "Lightbox",
    label: ""
}
</script>
<script setup>
import { onUnmounted, useSlots } from "vue";
const props = defineProps({
    showLightbox: {
        type: Boolean, default: false
    },
    style: {
        type: [String, Object]
    },
    action: {
        default: true
    },
    close: {
        default: true
    },
    class: {
        default: ""
    }
})
const emit = defineEmits(["update:showLightbox"])
const lightboxRef = ref(null)


const closeBtn = () => {
    emit("update:showLightbox", false)
}
const slotTile = useSlots()['lightbox-title'];
defineExpose({
    lightboxRef
})
watchEffect(() => {
    if (props.showLightbox) {
        document.querySelector("body").classList.add("ov-hidden");
    } else {
        document.querySelector("body").classList.remove("ov-hidden");
    }
})
onUnmounted(() => {
    if (document.querySelector("body").classList.contains("ov-hidden")) {
        document.querySelector("body").classList.remove("ov-hidden");
    }
})
</script>
<template>
    <Teleport to="body">
        <div class="g-lightbox" :style="[style ? style : '']" :class="class" v-if="showLightbox" ref="lightboxRef">
            <div class="g-lightbox__module"></div>
            <div class="g-lightbox__wrap">
                <template v-if="close">
                    <slot name="lightbox-close">
                        <a href="javascript:;" class="g-lightbox__close icon-close" @click="closeBtn">close</a>
                    </slot>
                </template>
                <div class="g-lightbox__container">
                    <div class="g-lightbox__title" v-if="slotTile">
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