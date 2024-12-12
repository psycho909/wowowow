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
    },
    openapp: {
        type: [Boolean, String],
        default: false
    },
    auto: {
        type: Boolean,
        default: false
    },
    loop: {
        type: Boolean,
        default: false
    }
})
let videoRef = ref(null)
let player = ref(null)
let videoImg = ref(null)
let playStatus = ref(false)
let mobile = ref(false);
const emit = defineEmits(["update:modelValue"])


onMounted(async () => {
    await nextTick()
    if (isMobile.any) {
        mobile.value = true
    } else {
        mobile.value = false
    }
    if (mobile.value && (props.openapp == 'true' || props.openapp == true)) {
        videoImg.value = youtubePreview(extractVideoID(props.youtube))
        return
    } else {
        if (!props.pop) {
            if (videoRef.value) {
                await nextTick()
                player = YouTubePlayer(videoRef.value, {
                    videoId: extractVideoID(props.youtube)
                })
                if (props.auto) {
                    player.playVideo();
                }
                if (props.loop) {
                    player.on('stateChange', (e) => {
                        if (e.data === 0) {
                            player.playVideo();
                        }
                    });
                }
            }
        }
        if (props.popopen) {
            player.playVideo();
        }
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
defineExpose({ player, videoRef });
</script>
<template>
    <div class="g-yt">
        <template v-if="mobile">
            <template v-if="openapp == 'true' || openapp == true">
                <a class="g-yt__box" :href="youtube" data-openapp="1">
                    <img class="g-yt__img" :class="[playStatus ? 'on' : 'off']" :src="videoImg?.hq" target="_blank" />
                </a>
            </template>
            <template v-else>
                <div class="g-yt__box" @click="onVideo" :data-type="[preview || popstatus ? 'pop' : 'video']">
                    <img class="g-yt__img" :class="[playStatus ? 'on' : 'off']" :src="videoImg?.hq" alt=""
                         v-if="preview" />
                    <div class="g-yt__video" ref="videoRef" v-if="!pop"></div>
                </div>
            </template>
        </template>
        <template v-else>
            <div class="g-yt__box" @click="onVideo" :data-type="[preview || popstatus ? 'pop' : 'video']">
                <img class="g-yt__img" :class="[playStatus ? 'on' : 'off']" :src="videoImg?.hq" alt="" v-if="preview" />
                <div class="g-yt__video" ref="videoRef" v-if="!pop"></div>
            </div>
        </template>
    </div>
</template>