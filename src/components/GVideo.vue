<script>
export default {
    name: "GVideo",
    label: "影片區塊",
    order: [8, 8],
    type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GYoutube from '../elements/GYoutube.vue';
import { mainStore } from "../store/index";
import { extractVideoID, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let _videoDataLength = ref(1);
let videoUpdate = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let videoSetting = reactive({});
let videoData = reactive({});
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        num: 1,
        preview: false,
        type: "click",
        app: true,
        videos: [{
            url: "", show: false, validUrl: true
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
};

Object.assign(videoData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(videoData, cloneDeep(props.data.content));
            Object.assign(videoSetting, cloneDeep(props.data.content));

            _videoDataLength.value = videoData.num;
        }
        videoUpdate.value = true;
        await nextTick();
        videoUpdate.value = false;
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(videoData, cloneDeep(props.data.content));
        Object.assign(videoSetting, cloneDeep(props.data.content));
        _videoDataLength.value = videoData.num;
        if ($addComponent) {
            $addComponent();
        }
    }
})

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
    }
})

const openPop = (data) => {
    data.show = true
}

const onChange = (e) => {
    let num = e.target.value;
    if (_videoDataLength.value <= num) {
        for (let i = 0; i < (num - _videoDataLength.value); i++) {
            videoData.videos.push({
                url: "", show: false, validUrl: true
            })
        }

    } else {
        videoData.videos = videoData.videos.slice(0, videoData.num)
    }
    _videoDataLength.value = num
}

const onSubmit = async () => {
    let data = {}
    videoData.validMt = true;
    videoData.validMb = true;
    videoData.validMmt = true;
    videoData.validMmb = true;
    if (videoData.mt < 0) {
        videoData.validMt = false;
    }
    if (videoData.mb < 0) {
        videoData.validMb = false;
    }
    if (videoData.mobile_mt < 0) {
        videoData.validMmt = false;
    }
    if (videoData.mobile_mb < 0) {
        videoData.validMmb = false;
    }
    videoData.videos.forEach((v, i) => {
        if (v.url.length > 0 && extractVideoID(v.url)) {
            v.validUrl = true;
        } else {
            v.validUrl = false;
        }
    })
    var validCheck = videoData.videos.every(function (v, i) {
        return v.validUrl == true;
    })
    if (videoData.validMt && videoData.validMb && videoData.validMmt && videoData.validMmb) {
        if (validCheck) {
            $("#loadingProgress").show();
            if (videoData.type == "pop") {
                videoData.preview = true;
            }
            let data = cloneDeep(videoData)
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(videoSetting, data);

            videoUpdate.value = true;
            await nextTick();
            videoUpdate.value = false;
            GetPageType(store.otp)
        }
    }

}
const onReset = () => {
    _videoDataLength.value = 1;
    Object.assign(videoData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        loadingHide()
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(videoData, cloneDeep(props.data.content));
        _videoDataLength.value = videoData.num;
    } else {
        Object.assign(videoData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-video" :style="cssVar">
        <div class="g-video-container" :data-num="videoSetting.num">
            <template v-for="(videos, index) in videoSetting.videos" :key="index">
                <a v-if="videoSetting.type == 'click'" href="javascript:;" class="g-video__box">
                    <g-youtube :youtube="videos.url" v-if="!videoUpdate" :openapp="videoSetting.app" />
                </a>
                <a v-if="videoSetting.type == 'pop'" href="javascript:;" class="g-video__box" @click="openPop(videos)">
                    <g-youtube :youtube="videos.url" :pop="true" :preview="true" :openapp="videoSetting.app"
                               v-if="!videoUpdate" />
                    <g-lightbox v-model:showLightbox="videos.show" :style="videos.style" :action="false"
                                class="lb-video">
                        <template #lightbox-content>
                            <div class="g-lightbox__video">
                                <g-youtube :youtube="videos.url" :popopen="videos.show" :popstatus="true"
                                           :openapp="videoSetting.app" />
                            </div>
                        </template>
                    </g-lightbox>
                </a>
            </template>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">
                        影片區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Video${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇影片數量:</div>
                    <g-radio label="單一影片" name="video" value="1" v-model="videoData.num" @change="onChange" />
                    <g-radio label="兩格影片" name="video" value="2" v-model="videoData.num" @change="onChange" />
                    <g-radio label="三格影片" name="video" value="3" v-model="videoData.num" @change="onChange" />
                    <g-radio label="四格影片" name="video" value="4" v-model="videoData.num" @change="onChange" />
                </div>
                <div class="g-edit__row" v-for="(video, index) in videoData.videos">
                    <g-input :label="'影片' + (index + 1) + 'URL:'" v-model.trim="video.url" :valid="video.validUrl"
                             :required="true" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">播放方式:</div>
                    <g-radio label="點擊直接播放" name="type" value="click" v-model="videoData.type" />
                    <g-radio label="點擊跳出燈箱播放" name="type" value="pop" v-model="videoData.type" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">手機使用YoutubeAPP開啟:</div>
                    <g-radio label="是" name="app" :value="true" v-model="videoData.app" />
                    <g-radio label="否" name="app" :value="false" v-model="videoData.app" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="videoData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="videoData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="videoData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="videoData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="videoData.mobile_mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="videoData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="videoData.mobile_mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="videoData.validMmb" />
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