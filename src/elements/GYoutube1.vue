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
    },
    inner: {
        type: Boolean,
        default: false
    },
    popopen: {
        type: Boolean,
        default: false
    },
    preview: {
        type: Boolean,
        default: false
    },
    popstatus: {
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
        if (videoRef.value) {
            player = YouTubePlayer(videoRef.value, {
                videoId: extractVideoID(props.youtube)
            })
        }
    }
    if (props.popopen) {
        player.playVideo();
    }
    console.log("YT Update")
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
defineExpose({ player, videoRef });

</script>
<template>
    <div class="g-yt">
        <div class="g-yt__box" @click="onVideo" :data-type="[preview || popstatus ? 'pop' : 'video']">
            <img class="g-yt__img" :class="[playStatus ? 'on' : 'off']" :src="videoImg?.hq" alt="" v-if="preview" />
            <div class="g-yt__video" ref="videoRef" v-if="!pop"></div>
        </div>
    </div>
</template>