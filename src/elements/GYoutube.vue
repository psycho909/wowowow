<script setup>
const props = defineProps({
    youtube: {
        type: String
    },
    autoplay: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(["update:modelValue"])

const ytUrl = computed(() => {
    return `https://www.youtube.com/embed/${props.youtube}?autoplay=${props.autoplay ? 1 : 0}&mute=1`
})
</script>
<template>
    <div class="video-yt__box">
        <iframe width="560" height="315" :src="ytUrl" title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
    </div>
</template>