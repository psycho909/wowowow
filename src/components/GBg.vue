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
import { nextTick, reactive, watchEffect } from 'vue';
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage, getVideoInfo, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
const props = defineProps(["data", "sub"])
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let showEdit = ref(false);
let showColor = ref(false);
let bgData = reactive({});
let bgSetting = reactive({});
let videoRef = ref(null);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        color: "#fff",
        pc: "",
        mobile: "",
        w: "",
        h: "",
        mw: "",
        mh: "",
        validPC: true,
        validMobile: true,
        type: {
            pc: "img", mobile: "img"
        }
    }
};

Object.assign(bgData, initData());

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
watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(bgData, cloneDeep(props.data.content));
            Object.assign(bgSetting, cloneDeep(props.data.content));
            if (!bgData.type) {
                bgData.type = {
                    pc: "img", mobile: "img"
                }
            }
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(bgData, cloneDeep(props.data.content));
        Object.assign(bgSetting, cloneDeep(props.data.content));
        if (!bgData.type) {
            bgData.type = {
                pc: "img", mobile: "img"
            }
        } else {
            if (bgData.type.pc == 'video' || bgData.type.mobile == 'video') {
                videoRef.value.addEventListener('loadeddata', () => {
                    if ($addComponent) {
                        $addComponent("BG");
                    }
                });
            } else {
                if ($addComponent) {
                    $addComponent("BG");
                }
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

function isImageOrMp4(url) {
    var ext = url.split('.').pop().toLowerCase();
    return (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'mp4');
}

const onSubmit = async () => {
    loadingShow();
    let data = {};
    bgData.validMobile = true;
    if (bgData.pc.length == 0) {
        bgData.validPC = false;
    } else {
        console.log(bgData.pc)
        if (!await CheckImage(bgData.pc)) {
            if (!isImageOrMp4(bgData.pc)) {
                bgData.validPC = false;
            } else {
                try {
                    let videoInfo = await getVideoInfo(bgData.pc);
                    if (videoInfo.size > 5) {
                        bgData.validPC = false;
                    } else {
                        bgData.validPC = true;
                        bgData.type.pc = "video"
                    }
                } catch (err) {
                    bgData.validPC = false;
                }
            }
        } else {
            bgData.validPC = true;
            bgData.type.pc = "img"
        }
    }
    if (bgData.mobile.length > 0) {
        if (!await CheckImage(bgData.mobile)) {
            if (!isImageOrMp4(bgData.mobile)) {
                bgData.validMobile = false;
            } else {
                try {
                    let videoInfo = await getVideoInfo(bgData.pc);
                    if (videoInfo.size > 5) {
                        bgData.validMobile = false;
                    } else {
                        bgData.validMobile = true;
                        bgData.type.mobile = "video"
                    }
                } catch (err) {
                    bgData.validMobile = false;
                }
            }
        } else {
            bgData.validMobile = true;
            bgData.type.mobile = "img"
        }
    } else {
        bgData.validMobile = true;
    }

    if (bgData.validPC && bgData.validMobile) {
        if (bgData.type.pc == "img") {
            await imageInfo("mobile", bgData.mobile);
        }
        if (bgData.type.mobile == "img") {
            await imageInfo("pc", bgData.pc);
        }
        data = { ...bgData };
        store.updateCpt(props.data.uid, data, props.sub);
    } else {
        loadingHide();
    }
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
    <div class="g-bg">
        <template v-if="bgSetting?.type?.pc == 'video'">
            <video class="bg-video" autoplay="" loop="" playsinline="" ref="videoRef">
                <source :src="bgSetting.pc" type="video/mp4">
            </video>
        </template>
        <template v-if="bgSetting?.type?.mobile == 'video'">
            <video class="bg-video" autoplay="" loop="" playsinline="" ref="videoRef">
                <source :src="bgSetting.mobile" type="video/mp4">
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
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/BG.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="圖片/影片網址:" v-model.trim="bgData.pc" :preview="bgData.pc" :valid="bgData.validPC"
                             :required="true" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片/影片網址:" v-model.trim="bgData.mobile" :preview="bgData.mobile"
                             :valid="bgData.validMobile" />
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