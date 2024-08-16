<script>
export default {
    name: "Background",
    label: "背景圖",
    limit: 1,
    order: 1,
    type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { nextTick, onUpdated, reactive, watchEffect } from 'vue';
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import { mainStore } from "../store/index";
import { CheckImage, getVideoInfo, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
const store = mainStore()
const { content, MODE, page, pageTypeSeq } = storeToRefs(store);
let showEdit = ref(false);
let showColor = ref(false);
let bgData = reactive({});
let bgSetting = reactive({});
let videoRef = ref(null);
let mobile = ref(false);
let videoUpdate = ref(false);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        color: "#fff",
        pc: "",
        mobile: "",
        pcVideo: "",
        mobileVideo: "",
        w: "",
        h: "",
        mw: "",
        mh: "",
        fit: true,
        validPC: true,
        validPCVideo: true,
        validMobile: true,
        validMobileVideo: true,
    }
};

Object.assign(bgData, initData());

if (isMobile.any) {
    mobile.value = true;
} else {
    mobile.value = false;
}

const imageInfo = async (type, url) => {
    return new Promise((resolve, reject) => {
        var elem = new Image();
        elem.onload = () => {
            if (type == "pc") {
                bgData.w = elem.width
                bgData.h = elem.height
            }
            if (type == "mobile") {
                bgData.mw = elem.width
                bgData.mh = elem.height
            }
            resolve(true)
        };
        elem.onerror = () => resolve(false);
        elem.src = url;
    });
}
watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(bgData, cloneDeep(props.data.content));
            Object.assign(bgSetting, cloneDeep(props.data.content));
            if (bgData.pc !== '') {
                if (isMp4(bgData.pc)) {
                    bgData.pcVideo = bgData.pc;
                    bgData.pc = "";
                }
            }
            if (bgData.mobile !== '') {
                if (isMp4(bgData.mobile)) {
                    bgData.mobileVideo = bgData.mobile;
                    bgData.mobile = "";
                }
            }
            if (bgSetting.pc !== '') {
                if (isMp4(bgSetting.pc)) {
                    console.log(123)
                    bgSetting.pcVideo = bgSetting.pc;
                    bgSetting.pc = "";
                }
            }
            if (bgSetting.mobile !== '') {
                if (isMp4(bgSetting.mobile)) {
                    bgSetting.mobileVideo = bgSetting.mobile;
                    bgSetting.mobile = "";
                }
            }
            if (bgSetting.pcVideo) {
                videoUpdate.value = true;
                await nextTick();
                videoUpdate.value = false;
            }
        }
    }
})
watch(videoRef, (newVal, oldVal) => {
    if (newVal !== null) {
        videoRef.value.addEventListener('loadeddata', () => {
            setTimeout(() => {
                document.querySelector(".wrap").style.setProperty("--video-h", document.querySelector(".g-bg-video").clientHeight);
                document.querySelector(".wrap").classList.add("video-bg-h");
                console.log(document.querySelector(".g-bg-video").clientHeight)
            }, 0);
        });
    } else {
        document.querySelector(".wrap").classList.remove("video-bg-h");
    }
}, { flush: 'post' })
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(bgData, cloneDeep(props.data.content));
        Object.assign(bgSetting, cloneDeep(props.data.content));
        await nextTick()
        if (bgSetting.pc !== "") {
            document.querySelector(".wrap").classList.add("bg-h");
        }
        if (videoRef.value) {
            videoRef.value.addEventListener('loadeddata', () => {
                setTimeout(() => {
                    document.querySelector(".wrap").style.setProperty("--video-h", document.querySelector(".g-bg-video").clientHeight);
                    document.querySelector(".wrap").classList.add("video-bg-h");
                }, 0);
                if ($addComponent) {
                    $addComponent();
                }
            });
        } else {
            if ($addComponent) {
                $addComponent();
            }
        }

    }
})

const updateColor = (color) => {
    bgData.color = color.hex
}
const openColor = () => {
    if (showColor.value) {
        showColor.value = false;
    } else {
        showColor.value = true;
    }

}

function isMp4(url) {
    var ext = url.split('.').pop().toLowerCase();
    return (ext === 'mp4');
}

const onSubmit = async () => {
    loadingShow();
    let data = {};
    bgData.validMobile = true;
    if (bgData.pc.length == 0) {
        bgData.validPC = true;
    } else {
        if (!await CheckImage(bgData.pc)) {
            bgData.validPC = false;
        } else {
            bgData.validPC = true;
        }
    }

    if (bgData.pcVideo.length == 0) {
        bgData.validPCVideo = true;
    } else {
        if (!isMp4(bgData.pcVideo)) {
            bgData.validPCVideo = false;
        } else {
            try {
                let videoInfo = await getVideoInfo(bgData.pcVideo);
                if (videoInfo.size > 10) {
                    bgData.validPCVideo = false;
                } else {
                    bgData.validPCVideo = true;
                }
            } catch (err) {
                bgData.validPCVideo = false;
            }
        }
    }

    if (bgData.mobile.length > 0) {
        if (!await CheckImage(bgData.mobile)) {
            bgData.validMobile = false;
        } else {
            bgData.validMobile = true;
        }
    } else {
        bgData.validMobile = true;
    }
    if (bgData.mobileVideo.length == 0) {
        bgData.validMobileVideo = true;
    } else {
        if (!isMp4(bgData.mobileVideo)) {
            bgData.validMobileVideo = false;
        } else {
            try {
                let videoInfo = await getVideoInfo(bgData.mobileVideo);
                if (videoInfo.size > 10) {
                    bgData.validMobileVideo = false;
                } else {
                    bgData.validMobileVideo = true;
                }
            } catch (err) {
                bgData.validMobileVideo = false;
            }
        }
    }
    if (bgData.validPC && bgData.validMobile && bgData.validPCVideo && bgData.validMobileVideo) {
        if (bgData.pc.length) {
            await imageInfo("pc", bgData.pc);
        }
        if (bgData.mobile.length) {
            await imageInfo("mobile", bgData.mobile);
        }
        data = { ...bgData };
        store.updateCpt(props.data.uid, data, props.sub);
        GetPageType(store.otp)
    } else {
        loadingHide();
    }
    // data = { ...bgData };
    //     store.updateCpt(props.data.uid, data, props.sub);
    //     loadingHide();
}
const onReset = () => {
    Object.assign(bgData, initData());
}

const enterColor = async (e) => {
    var target = e.target;
    var current = target.closest(".input-group__color-ref");
    if (showColor.value) {
        if (!(current && document.querySelector(".hu-color-picker")) && !target.closest(".hu-color-picker")) {
            showColor.value = false;
            return;
        }
    }

}
const closeBtn = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            bgData[v] = props.data.content[v];
        })
    } else {
        Object.assign(bgData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-bg" :data-init="data.init">
        <template v-if="bgSetting?.pcVideo && !mobile">
            <video class="g-bg-video g-bg-video--pc"
                   :class="[bgSetting?.fit === true || bgSetting?.fit === 'true' ? 'fit' : 'contain']" autoplay=""
                   loop=""
                   playsinline="" muted ref="videoRef"
                   v-if="!videoUpdate">
                <source :src="bgSetting.pcVideo" type="video/mp4">
            </video>
        </template>
        <template v-if="(bgSetting?.mobileVideo || bgSetting?.pcVideo) && mobile">
            <video class="g-bg-video g-bg-video--mobile"
                   :class="[bgSetting?.fit === true || bgSetting?.fit === 'true' ? 'fit' : 'contain']" autoplay=""
                   loop=""
                   playsinline="" muted ref="videoRef"
                   v-if="!videoUpdate">
                <source :src="bgSetting.mobileVideo || bgSetting.pcVideo" type="video/mp4">
            </video>
        </template>
        <g-modify :uid="data.uid" title="背景" :move="false" :remove="false" :sub="sub"
                  v-if="page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'"
                :func="enterColor">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">
                        背景圖
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/BG${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="圖片網址:" v-model.trim="bgData.pc" :preview="bgData.pc" :valid="bgData.validPC" />
                </div>
                <div class="g-edit__row">
                    <g-input label="影片網址:" v-model.trim="bgData.pcVideo" :preview="bgData.pcVideo"
                             :valid="bgData.validPCVideo" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model.trim="bgData.mobile" :preview="bgData.mobile"
                             :valid="bgData.validMobile" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版影片網址:" v-model.trim="bgData.mobileVideo" :preview="bgData.mobileVideo"
                             :valid="bgData.validMobileVideo" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label required">影片寬度:</div>
                        <g-radio label="影片滿版" name="video-fit" :value="true"
                                 v-model="bgData.fit" />
                        <g-radio label="影片自己寬度" :name="'control' + index" :value="false"
                                 v-model="bgData.fit" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group">
                        <div class="input-group__label required">背景底色:</div>
                        <div class="input-group__color">
                            <span class="input-group__color-ref" :style="`--color:${bgData.color}`"
                                  @click="openColor"></span>
                            <ColorPicker v-show="showColor" :color="bgData.color" theme="light" :sucker-hide="true"
                                         @changeColor="updateColor" />
                        </div>

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