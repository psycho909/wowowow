<script setup>
import YouTubePlayer from 'youtube-player';
import { youtubePreview, extractVideoID } from '../Tool';
const props = defineProps({
    youtube: {
        type: String
    },
    pop: {
        type: Boolean,
        default: false
    }
})
let videoRef = ref(null)
let player = ref(null)
let videoImg = ref(null)
let playStatus = ref(false)
const emit = defineEmits(["update:modelValue"])


onMounted(async () => {
    await nextTick()
    if (!props.pop) {
        console.log(props.youtube)
        player = YouTubePlayer(videoRef.value, {
            videoId: extractVideoID(props.youtube)
        })
    }
    videoImg.value = youtubePreview(extractVideoID(props.youtube))
})


const onVideo = () => {
    if (!props.pop) {
        if (!playStatus.value) {
            player.playVideo()
            playStatus.value = true;
        } else {
            player.stopVideo()
            playStatus.value = false;
        }
    }
}
defineExpose({ player, videoRef })
</script>
<template>
    <div class="g-yt">
        <div class="g-yt__box" @click="onVideo">
            <img class="g-yt__img" :class="[playStatus?'on':'off']" :src="videoImg?.hq" alt="" />
            <div class="g-yt__video" ref="videoRef" v-if="!pop"></div>
        </div>
    </div>
</template>