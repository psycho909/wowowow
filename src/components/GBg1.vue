<script>
export default {
    name: "Background",
    label: "背景圖",
    limit: 1,
    order: 1
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { nextTick, reactive, watchEffect } from 'vue';
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage } from "../Tool";
import { cloneDeep } from 'lodash-es'
const props = defineProps(["data"])
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let showEdit = ref(false);
let showColor = ref(false)
let bgData = reactive({})
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
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(bgData, cloneDeep(props.data.content));
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
const onSubmit = async () => {
    let data = {};
    bgData.validMobile = true;
    if (bgData.pc.length == 0) {
        bgData.validPC = false;
    } else {
        if (!await CheckImage(bgData.pc)) {
            bgData.validPC = false;
        } else {
            bgData.validPC = true;
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

    if (bgData.validPC && bgData.validMobile) {
        $("#loadingProgress").show();
        await imageInfo("mobile", bgData.mobile);
        await imageInfo("pc", bgData.pc);
        data = { ...bgData };
        store.updateCpt(props.data.uid, data)
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
        <g-modify :uid="data.uid" title="背景" :move="false" :remove="false"
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
                    <g-input label="圖片網址:" v-model.trim="bgData.pc" :preview="bgData.pc" :valid="bgData.validPC"
                             :required="true" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model.trim="bgData.mobile" :preview="bgData.mobile"
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