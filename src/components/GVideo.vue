<script>
export default {
    name: "GVideo",
    label: "影片區塊"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GYoutube from '../elements/GYoutube.vue';
import { mainStore } from "../store/index";
const props = defineProps(["data"])
let showEdit = ref(false);
let _videoDataLength = 1;
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let videoSetting = ref({})
let videoData = reactive({
    num: 1,
    type: "click",
    videos: [{
        url: "", show: false, validUrl: true
    }],
    mt: 0, mb: 54,
})

watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (props.data) {
        Object.keys(props.data.content).forEach((v, i) => {
            videoData[v] = props.data.content[v];
            videoSetting.value[v] = props.data.content[v];
            _videoDataLength = videoData.num
        })
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            videoData[v] = props.data.content[v];
            videoSetting.value[v] = props.data.content[v];
        })
    }
})

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
    }
})

const openPop = (data) => {
    data.show = true
}

const onChange = (e) => {
    let num = e.target.value;
    if (_videoDataLength <= num) {
        for (let i = 0; i < (num - _videoDataLength); i++) {
            videoData.videos.push({
                url: "", show: false, validUrl: true
            })
        }
        _videoDataLength = num
    } else {
        videoData.videos = videoData.videos.slice(0, videoData.num)
    }
}

const onSubmit = () => {
    let data = {}
    videoData.videos.forEach((v, i) => {
        if (v.url.length > 0) {
            v.validUrl = true;
        } else {
            v.validUrl = false;
        }
    })
    var validCheck = videoData.videos.every(function (v, i) {
        return v.validUrl == true;
    })
    if (validCheck) {
        data = { ...videoData }
        store.updateCpt(props.data.uid, data)
    }
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            videoData[v] = props.data.content[v];
            videoSetting.value[v] = props.data.content[v];
        })
    } else {
        videoData = {
            num: 1,
            type: "click",
            videos: [{
                url: "", show: false, validUrl: true
            }],
            mt: 0, mb: 54,
        }
    }
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            videoData[v] = props.data.content[v];
            videoSetting.value[v] = props.data.content[v];
        })
    } else {
        videoData = {
            num: 1,
            type: "click",
            videos: [{
                url: "", show: false, validUrl: true
            }],
            mt: 0, mb: 54,
        }
    }
    showEdit.value = false;
    props.data.update = false;
}
</script>
<template>
    <div class="g-video" :style="cssVar">
        <div class="g-video-container" :data-num="videoSetting.num">
            <template v-for="(videos, index) in videoSetting.videos">
                <a v-if="videoSetting.type == 'click'" href="javascript:;" class="g-video__box">
                    <g-youtube :youtube="videos.url" />
                </a>
                <a v-if="videoSetting.type == 'pop'" href="javascript:;" class="g-video__box" @click="openPop(videos)">
                    <g-youtube :youtube="videos.url" :pop="true" />
                    <g-lightbox v-model:showLightbox="videos.show" :style="videos.style">
                        <template #lightbox-content>
                            <div class="g-lightbox__video">
                                <g-youtube :youtube="videos.url" />
                            </div>
                        </template>
                    </g-lightbox>
                </a>
            </template>
            <g-modify :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">影片區塊<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇影片數量:</div>
                    <g-radio label="單一影片" name="video" value="1" v-model="videoData.num" @change="onChange" />
                    <g-radio label="兩格影片" name="video" value="2" v-model="videoData.num" @change="onChange" />
                    <g-radio label="三格影片" name="video" value="3" v-model="videoData.num" @change="onChange" />
                    <g-radio label="四格影片" name="video" value="4" v-model="videoData.num" @change="onChange" />
                </div>
                <div class="g-edit__row" v-for="(video, index) in videoData.videos">
                    <g-input :label="'影片' + (index + 1) + 'URL:'" v-model="video.url" :valid="video.validUrl"
                             :required="true" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">播放方式:</div>
                    <g-radio label="點擊直接播放" name="type" value="click" v-model="videoData.type" />
                    <g-radio label="點擊跳出燈箱播放" name="type" value="pop" v-model="videoData.type" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="間距上:" v-model="videoData.mt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="間距下:" v-model="videoData.mb" />
                    </div>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>