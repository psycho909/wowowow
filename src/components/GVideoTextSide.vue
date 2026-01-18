<script>
export default {
    name: "GVideoTextSide",
    label: "影片-左右圖文",
    order: [8, 13],
    type: [1,2,3]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GYoutube from '../elements/GYoutube.vue';
import GSelect from '../elements/GSelect.vue';
import GCkedit from '../elements/GCkeditSimple.vue';
import { mainStore } from "../store/index";
import { extractVideoID, handleNumber, loadingShow, loadingHide, isMp4 } from "../Tool";
import colors, { style1, style2 } from "../colors";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
import { nextTick } from "vue";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let _videoDataLength = ref(1);
let videoUpdate = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let videoSetting = reactive({});
let videoData = reactive({});
const initData = () => {
    return {
        num: 1,
        preview: false,
        type: "click",
        loop: false,
        app: true,
        source: "youtube",
        opacity: 1,
        align: "center",
        videos: [{
            url: "", mp4: "", show: false, validUrl: true,
            card: {
                title: "",
                text: "",
                url: "",
                mp4: "",
                validCard: true,
                align: "center"
            }
        }],
        card: false,
        style: "",
        validStyle: true,
        muted: true,
        control: false,
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
            if (props.data.content.opacity === undefined) {
                props.data.content.opacity = 1;
            }
            if (props.data.content.source === undefined) {
                props.data.content.source = "youtube"
            }
            if (props.data.content.loop === undefined) {
                props.data.content.loop = false
            }
            if (props.data.content.card === undefined) {
                props.data.content.card = false
                props.data.content.style = ""
            }
            Object.assign(videoData, cloneDeep(props.data.content));
            Object.assign(videoSetting, cloneDeep(props.data.content));

            _videoDataLength.value = videoData.num;
        }
        videoUpdate.value = true;
        await nextTick();
        videoUpdate.value = false;
        if (videoData.source == undefined) {
            videoData.source = "youtube"
            videoSetting.source = "youtube"
        }
        if (videoData.card == undefined) {
            videoData.card = false;
            videoData.style = "";
            videoData.loop = false
            videoData.opacity = 1;
            videoSetting.card = false;
            videoSetting.style = "";
            videoSetting.opacity = 1;
            videoSetting.loop = false
        }
        videoData.videos.forEach((v, i) => {
            if (v.card === undefined) {
                v.card = {
                    title: "",
                    text: "",
                    url: "",
                    mp4: "",
                    validCard: true,
                    align: "center"
                }
            }
        })
        videoSetting.videos.forEach((v, i) => {
            if (v.card === undefined) {
                v.card = {
                    title: "",
                    text: "",
                    url: "",
                    mp4: "",
                    validCard: true,
                    align: "center"
                }
            }
        })
        if (videoData.align == undefined) {
            videoData.align = "center"
        }
        if (videoSetting.align == undefined) {
            videoSetting.align = "center"
        }
        if (videoSetting.type == "click" && videoSetting.source == "mp4") {
            handleVideo("click");
        }
        if (videoSetting.type == "pop" && videoSetting.source == "mp4") {
            handleVideo("pop");
        }
        if (videoSetting.type == "auto" && videoSetting.source == "mp4") {
            nextTick(() => {
                console.log(videoSetting.control)
                document.querySelectorAll("[data-type='auto'] video").forEach((function (video, i) {
                    video.play()
                    if (videoSetting.muted === true || videoSetting.muted === 'true') {
                        video.muted = true;
                    } else {
                        video.muted = false;
                    }
                }))
            })
        }
        if (videoData.muted == undefined) {
            videoData.muted = false;
        }
        if (videoData.control == undefined) {
            videoData.control = false;
        }
        if (videoSetting.muted == undefined) {
            videoSetting.muted = false;
        }
        if (videoSetting.control == undefined) {
            videoSetting.control = false;
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        if (props.data.content.opacity === undefined) {
            props.data.content.opacity = 1;
        }
        if (props.data.content.source === undefined) {
            props.data.content.source = "youtube"
        }
        if (props.data.content.loop === undefined) {
            props.data.content.loop = false
        }
        if (props.data.content.card === undefined) {
            props.data.content.card = false
            props.data.content.style = ""
        }
        Object.assign(videoData, cloneDeep(props.data.content));
        Object.assign(videoSetting, cloneDeep(props.data.content));
        _videoDataLength.value = videoData.num;
        if (videoData.source == undefined) {
            videoData.source = "youtube"
            videoSetting.source = "youtube"
        }
        if (videoData.card == undefined) {
            videoData.card = false;
            videoData.style = "";
            videoData.loop = false
            videoData.opacity = 1;
            videoSetting.card = false;
            videoSetting.style = "";
            videoSetting.opacity = 1;
            videoSetting.loop = false
        }
        videoData.videos.forEach((v, i) => {
            if (v.card === undefined) {
                v.card = {
                    title: "",
                    text: "",
                    url: "",
                    mp4: "",
                    validCard: true,
                    align: "center"
                }
            }
        })
        videoSetting.videos.forEach((v, i) => {
            if (v.card === undefined) {
                v.card = {
                    title: "",
                    text: "",
                    url: "",
                    mp4: "",
                    validCard: true,
                    align: "center"
                }
            }
        })
        if (videoSetting.type == "click" && videoSetting.source == "mp4") {
            handleVideo("click");
        }
        if (videoSetting.type == "pop" && videoSetting.source == "mp4") {
            handleVideo("pop");
        }
        if (videoSetting.type == "auto" && videoSetting.source == "mp4") {
            nextTick(() => {
                console.log(videoSetting.control)
                document.querySelectorAll("[data-type='auto'] video").forEach((function (video, i) {
                    video.play()
                    if (videoSetting.muted === true || videoSetting.muted === 'true') {
                        video.muted = true;
                    } else {
                        video.muted = false;
                    }
                }))
            })
        }
        if (videoData.align == undefined) {
            videoData.align = "center"
        }
        if (videoSetting.align == undefined) {
            videoSetting.align = "center"
        }
        if (videoData.muted == undefined) {
            videoData.muted = false;
        }
        if (videoData.control == undefined) {
            videoData.control = false;
        }
        if (videoSetting.muted == undefined) {
            videoSetting.muted = false;
        }
        if (videoSetting.control == undefined) {
            videoSetting.control = false;
        }
    }
})

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
        "--opacity": props.data.content.opacity === undefined ? 1 : props.data.content.opacity,
    }
})

const handleVideo = (type) => {
    nextTick(() => {
        let videos, outputs;
        if (type == "click") {
            videos = document.querySelectorAll('.g-video__box-video.click video');
            outputs = document.querySelectorAll('.g-video__box-video.click img');
        }
        if (type == "pop") {
            videos = document.querySelectorAll('.g-video__box-video.pop.mp4 video');
            outputs = document.querySelectorAll('.g-video__box-video.pop.mp4 img');
        }
        videos.forEach((video, index) => {
            // Safari 跨域支援
            video.setAttribute('crossorigin', 'anonymous');
            video.setAttribute('preload', 'auto');

            const handleVideoLoad = () => {
                try {
                    // 創建離屏 canvas
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // 設置 canvas 尺寸
                    canvas.width = 400;  // 設置較小的尺寸以提高性能
                    canvas.height = (video.videoHeight / video.videoWidth) * canvas.width;

                    // 繪製並壓縮
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const quality = 0.7; // 壓縮比例
                    outputs[index].src = canvas.toDataURL('image/jpeg', quality);

                    // 移除監聽器
                    video.removeEventListener('loadeddata', handleVideoLoad);
                } catch (e) {
                    console.error('Safari 預覽圖生成失敗:', e);
                }
            };

            // 添加事件監聽
            video.addEventListener('loadeddata', handleVideoLoad);
            // 觸發載入
            if (video.readyState >= 2) {
                handleVideoLoad();
            } else {
                video.load();
            }
        });
    });
};

const openPop = (data) => {
    data.show = true
}

const onChange = (e) => {
    let num = e.target.value;
    if (_videoDataLength.value <= num) {
        for (let i = 0; i < (num - _videoDataLength.value); i++) {
            videoData.videos.push({
                url: "", mp4: "", show: false, validUrl: true, card: {
                    title: "",
                    text: "",
                    url: "",
                    mp4: "",
                    validCard: true,
                    align: "center"
                }
            })
        }

    } else {
        videoData.videos = videoData.videos.slice(0, videoData.num)
    }
    _videoDataLength.value = num
}
function removeHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '');
}
function validateCard(card) {
    // 檢查至少一個字段有內容
    const hasContent = card.text || card.title;

    // 檢查標題長度
    const validTitle = !card.title || card.title.length <= 50;

    // 檢查文本長度
    const validText = !card.text || removeHtmlTags(card.text).length <= 250;

    // 設置validCard
    card.validCard = hasContent && validTitle && validText;

    return card.validCard;
}

const onSubmit = async () => {
    let data = {}
    let validCheck = false;
    let validCardCheck = false;
    let validStyleCheck = false;
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
    if (videoData.source === 'youtube') {
        videoData.videos.forEach((v, i) => {
            if (v.url.length > 0 && extractVideoID(v.url)) {
                v.validUrl = true;
            } else {
                v.validUrl = false;
            }
            if (videoData.card === 'true' || videoData.card === true) {
                if (validateCard(v.card)) {
                    v.card.validCard = true;
                    validCardCheck = true;
                } else {
                    v.card.validCard = false;
                    validCardCheck = false;
                }
                if (videoData.style == "" || videoData.style == undefined) {
                    videoData.validStyle = false;
                    validStyleCheck = false;
                } else {
                    videoData.validStyle = true;
                    validStyleCheck = true;
                }
            } else {
                validCardCheck = true;
                validStyleCheck = true;
            }
        })
        validCheck = videoData.videos.every(function (v, i) {
            return v.validUrl == true;
        })
    }
    if (videoData.source === "mp4") {
        videoData.videos.forEach((v, i) => {
            console.log(v);
            if (v.mp4.length > 0 && isMp4(v.mp4)) {
                v.validUrl = true;
            } else {
                v.validUrl = false;
            }
            if (videoData.card === 'true' || videoData.card === true) {
                if (validateCard(v.card)) {
                    v.card.validCard = true;
                    validCardCheck = true;
                } else {
                    v.card.validCard = false;
                    validCardCheck = false;
                }
                if (videoData.style == "" || videoData.style == undefined) {
                    videoData.validStyle = false;
                    validStyleCheck = false;
                } else {
                    videoData.validStyle = true;
                    validStyleCheck = true;
                }
            } else {
                validCardCheck = true;
                validStyleCheck = true;
            }


        })
        validCheck = videoData.videos.every(function (v, i) {
            return v.validUrl == true;
        })

    }
    if (videoData.validMt && videoData.validMb && videoData.validMmt && videoData.validMmb) {
        if (validCheck && validCardCheck && validStyleCheck) {
            document.querySelector("#loadingProgress").style.display = "block";
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

const playVideo = (e) => {
    const target = e.target;
    let video;
    let parent;
    let poster;
    try {
        // 檢查點擊目標類型並尋找對應元素
        if (target.tagName === 'VIDEO') {
            video = target;
            parent = target.parentElement;
        } else if (target.classList.contains('g-video__box-video')) {
            video = target.querySelector('video');
            parent = target;
        } else {
            // 處理其他可能的點擊情況
            video = target.closest('.g-video__box-video')?.querySelector('video');
            parent = target.closest('.g-video__box-video');
        }

        // 確保找到影片元素
        if (!video || !parent) {
            console.warn('找不到影片元素');
            return;
        }

        // 尋找海報圖片
        poster = parent.querySelector('img');

        // 控制播放狀態
        if (video.paused) {
            parent.dataset.status = 'play';
            if (videoSetting.muted === true || videoSetting.muted === 'true') {
                video.muted = true;
            } else {
                video.muted = false;
            }
            video.play();
            if (poster) poster.style.display = 'none';
        } else {
            parent.dataset.status = 'pause';
            video.pause();
        }
    } catch (error) {
        console.error('影片控制錯誤:', error);
    }
}

function splitUid(uid) {
    let _uid = uid.toString()
    return _uid.split("-")[0];
}
</script>
<template>
    <div class="g-video" :style="[cssVar, colors[videoSetting.style]]" :id="splitUid(props.data.uid)"
         :data-type="videoSetting.type">
        <div class="g-video-container" :data-num="videoSetting.num">
            <template v-for="(v, index) in videoSetting.videos" :key="index">
                <div class="g-video__box">
                    <template v-if="videoSetting.source == 'youtube'">
                        <a v-if="videoSetting.type == 'click'" href="javascript:;" class="g-video__box-video">
                            <g-youtube :youtube="v.url"
                                       :loop="videoSetting.loop === true || videoSetting.loop === 'true'"
                                       v-if="!videoUpdate"
                                       :openapp="videoSetting.app" />
                        </a>
                        <a v-if="videoSetting.type == 'auto'" href="javascript:;" class="g-video__box-video">
                            <g-youtube :youtube="v.url" :auto="true"
                                       :loop="videoSetting.loop === true || videoSetting.loop === 'true'"
                                       v-if="!videoUpdate"
                                       :openapp="videoSetting.app" />
                        </a>
                    </template>
                    <template v-if="videoSetting.source == 'mp4'">
                        <template v-if="videoSetting.type == 'click' || videoSetting.type == 'auto'">
                            <template v-if="videoSetting.control === true || videoSetting.control === 'true'">
                                <video :src="v.mp4"
                                       :muted="videoSetting.muted === true || videoSetting.muted === 'true'"
                                       playsinline
                                       :controls="videoSetting.control === true || videoSetting.control === 'true'"
                                       :loop="videoSetting.loop === true || videoSetting.loop === 'true'"
                                       v-bind:autoplay="videoSetting.type == 'auto' ? '' : null"
                                       class="g-video__box-video"
                                       v-if="!videoUpdate"></video>
                            </template>
                            <template v-else>
                                <a href="javascript:;" class="g-video__box-video"
                                   :class="[videoSetting.type]"
                                   v-bind:autoplay="auto ? '' : null"
                                   @click="playVideo" :data-status="videoSetting.type == 'click' ? 'pause' : ''">
                                    <img>
                                    <video :src="v.mp4" muted playsinline
                                           :loop="videoSetting.loop === true || videoSetting.loop === 'true'"
                                           v-bind:autoplay="videoSetting.type == 'auto' ? '' : null"
                                           v-if="!videoUpdate"></video>

                                </a>
                            </template>
                        </template>
                    </template>
                    <a v-if="videoSetting.type == 'pop'" href="javascript:;" class="g-video__box-video"
                       :class="[videoSetting.type, videoSetting.source]" @click="openPop(v)">
                        <template v-if="videoSetting.source == 'youtube'">
                            <g-youtube :youtube="v.url" :pop="true" :preview="true" :openapp="videoSetting.app"
                                       v-if="!videoUpdate" />
                        </template>
                        <template v-if="videoSetting.source == 'mp4'">
                            <img>
                            <video :src="v.mp4" muted playsinline v-if="!videoUpdate"></video>
                        </template>
                        <g-lightbox v-model:showLightbox="v.show" :action="false" class="lb-video">
                            <template #lightbox-content>
                                <div class="g-lightbox__video">
                                    <template v-if="videoSetting.source == 'youtube'">
                                        <g-youtube :youtube="v.url" :popopen="v.show" :popstatus="true"
                                                   :openapp="videoSetting.app"
                                                   :loop="videoSetting.loop === true || videoSetting.loop === 'true'" />
                                    </template>
                                    <template v-if="videoSetting.source == 'mp4'">
                                        <template
                                                  v-if="videoSetting.control === true || videoSetting.control === 'true'">
                                            <video class="g-video__box-video" :src="v.mp4" autoplay
                                                   :muted="videoSetting.muted === true || videoSetting.muted === 'true'"
                                                   :controls="videoSetting.control === true || videoSetting.control === 'true'"
                                                   playsinline
                                                   :loop="videoSetting.loop === true || videoSetting.loop === 'true'"></video>
                                        </template>
                                        <template v-else>
                                            <a href="javascript:;" class="g-video__box-video">
                                                <video :src="v.mp4" autoplay
                                                       :muted="videoSetting.muted === true || videoSetting.muted === 'true'"
                                                       playsinline
                                                       :loop="videoSetting.loop === true || videoSetting.loop === 'true'"></video>
                                            </a>
                                        </template>
                                    </template>
                                </div>
                            </template>
                        </g-lightbox>
                    </a>
                    <template v-if="videoSetting.card === true || videoSetting.card === 'true'">
                        <div class="g-video__card" :data-align="videoSetting.align">
                            <div class="g-video__card-body" v-if="v.card.title !== '' || v.card.text !== ''">
                                <div class="g-video__card-title" v-if="v.card.title !== ''">{{ v.card.title }}
                                </div>
                                <div class="g-video__card-text" v-if="v.card.text !== ''" v-html="v.card.text">
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
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
                <div class="g-edit__row">
                    <div class="input-group__label required">顯示文字說明:</div>
                    <g-radio label="關閉" name="card" :value="false" v-model="videoData.card" />
                    <g-radio label="開啟" name="card" :value="true" v-model="videoData.card" />
                </div>
                <template v-if="videoData.card === true || videoData.card === 'true'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                      :valid="videoData.validStyle"
                                      v-model="videoData.style" />
                        </div>
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">透明度:</div>
                        <input type="range" id="opacity" name="opacity" min="0" max="1" step="0.01" value="1"
                               v-model="videoData.opacity" />
                        <span>{{ parseInt((videoData.opacity * 100)) }}%</span>
                    </div>
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <div class="input-group__label">文字對齊方向:</div>
                            <g-radio label="置左" name="textAlign" value="left" v-model="videoData.align" />
                            <g-radio label="置中" name="textAlign" value="center" v-model="videoData.align" />
                            <g-radio label="置右" name="textAlign" value="right" v-model="videoData.align" />
                        </div>
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="input-group__label required">影片來源:</div>
                    <g-radio label="Youtube" name="source" value="youtube" v-model="videoData.source" />
                    <g-radio label="MP4" name="source" value="mp4" v-model="videoData.source" />
                </div>
                <div class="g-edit__row" v-if="videoData.source == 'youtube'">
                    <div class="input-group__label required">手機使用YoutubeAPP開啟:</div>
                    <g-radio label="是" name="app" :value="true" v-model="videoData.app" />
                    <g-radio label="否" name="app" :value="false" v-model="videoData.app" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">播放方式:</div>
                    <g-radio label="點擊後播放" name="type" value="click" v-model="videoData.type" />
                    <g-radio label="彈出燈箱播放" name="type" value="pop" v-model="videoData.type" />
                    <g-radio label="進頁面後自動播放(手機APP無效)" name="type" value="auto" v-model="videoData.type" />
                </div>
                <template v-if="videoData.source == 'mp4'">
                    <div class="g-edit__row">
                        <div class="input-group__label required">開啟聲音:</div>
                        <g-radio label="是" name="muted" :value="false" v-model="videoData.muted" />
                        <g-radio label="否" name="muted" :value="true" v-model="videoData.muted" />
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">顯示控制按鈕:</div>
                        <g-radio label="是" name="control" :value="true" v-model="videoData.control" />
                        <g-radio label="否" name="control" :value="false" v-model="videoData.control" />
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="input-group__label required">循環播放:</div>
                    <g-radio label="是" name="loop" :value="true" v-model="videoData.loop" />
                    <g-radio label="否" name="loop" :value="false" v-model="videoData.loop" />
                </div>
                <template v-if="videoData.card === false || videoData.card === 'false'">
                    <div class="g-edit__row" v-for="(video, index) in videoData.videos">
                        <template v-if="videoData.source == 'youtube'">
                            <div class="g-edit__col" data-type="yt">
                                <g-input label="影片網址" v-model.trim="video.url"
                                         :valid="video.validUrl"
                                         :required="true" />
                            </div>
                        </template>
                        <template v-if="videoData.source == 'mp4'">
                            <div class="g-edit__col" data-type="mp4">
                                <g-input label="影片網址" v-model.trim="video.mp4"
                                         :valid="video.validUrl"
                                         :required="true" />
                            </div>
                        </template>
                    </div>
                </template>
                <div class="g-edit__row" v-for="(video, index) in videoData.videos">
                    <template v-if="videoData.card === true || videoData.card === 'true'">
                        <template v-if="videoData.source == 'youtube'">
                            <div class="g-edit__col" data-type="yt">
                                <g-input label="影片網址" v-model.trim="video.url"
                                         :valid="video.validUrl"
                                         :required="true" />
                            </div>
                        </template>
                        <template v-if="videoData.source == 'mp4'">
                            <div class="g-edit__col" data-type="mp4">
                                <g-input label="影片網址" v-model.trim="video.mp4"
                                         :valid="video.validUrl"
                                         :required="true" />
                            </div>
                        </template>
                        <div class="g-edit__col">
                            <g-input label="標題文字:" v-model.trim="video.card.title" max="50"
                                     :valid="video.card.validCard"
                                     warning="標題、內文至少填寫一個，限制字數50字" />
                        </div>
                        <div class="g-edit__col items-start">
                            <div class="input-group__label">內文:</div>
                            <g-ckedit v-model="video.card.text" max="250" :valid="video.card.validCard"
                                      warning="標題、內文至少填寫一個，限制字數250字" />
                        </div>
                    </template>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="videoData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="videoData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="videoData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="videoData.validMb" />
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