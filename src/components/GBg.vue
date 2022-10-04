<script>
export default {
    name: "Background",
    label: "背景圖"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from 'vue';
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage } from "../Tool";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content } = storeToRefs(store);
let bgData = reactive({
    color: "#000",
    pc: "",
    mb: "",
    w: "",
    h: "",
    mw: "",
    mh: ""
})
var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
const imageInfo = (type, url) => {
    var img = new Image();
    img.onload = function () {
        if (type == "pc") {
            bgData.w = img.width
            bgData.h = img.height
        }
        if (type == "mb") {
            bgData.mw = img.width
            bgData.mh = img.height
        }
    };
    img.src = url
}
// https://tw.hicdn.beanfun.com/beanfun/promo/Lineage/E20220930/assets/img/bg.jpg
watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (CheckImage(bgData.pc)) {
        imageInfo("pc", bgData.pc)
    }
    if (CheckImage(bgData.mb)) {
        imageInfo("mb", bgData.mb)
    }

})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            bgData[v] = props.data.content[v];
        })
    }
})
onUpdated(() => {

})
onUnmounted(() => {

})
const updateColor = (color) => {
    bgData.color = color.hex
}
const colorBlur = () => {
    console.log("blurText")
}

const submit = () => {
    var data = { ...bgData }
    store.updateCpt(props.data.uid, data)
}
const reset = () => {

}
</script>
<template>
    <div class="g-bg">
        <div class="g-bg-container">
            <g-modify :uid="data.uid" title="背景底圖" :move="false" :remove="false" />
            <g-edit v-model:showEdit="showEdit">
                <template #edit-content>
                    <div class="edit-title__box">
                        <div class="edit-title__text">背景圖</div>
                        <a href="javascript:;" class="edit-title__q"></a>
                    </div>
                    <div class="edit-input__box">
                        <g-input label="*圖片網址:" v-model="bgData.pc" :preview="bgData.pc" />
                    </div>
                    <div class="edit-input__box">
                        <g-input label="手機版圖片網址:" v-model="bgData.mb" :preview="bgData.mb" />
                    </div>
                    <div class="edit-input__box">
                        <g-input label="背景底色:" v-model="bgData.color" :color="bgData.color" />
                        <ColorPicker :color="bgData.color" theme="light" :sucker-hide="true" @changeColor="updateColor"
                                     @blur="colorBlur" tabindex="0" />
                    </div>
                    <div class="edit-btn__box">
                        <a href="javascript:;" class="btn btn__submit" @click="submit">確認送出</a>
                        <a href="javascript:;" class="btn btn__reset" @click="reset">清除重填</a>
                    </div>
                </template>
            </g-edit>
        </div>
    </div>
</template>