<script>
export default {
    name: "Background",
    label: "背景圖"
}
</script>
<script setup>
import { Chrome } from '@ckpack/vue-color';
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from 'vue';
import { mainStore } from "../store/index";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content } = storeToRefs(store);
let bgData = reactive({
    color: "",
    pc: "",
    mb: "",
    w: "",
    h: "",
    mw: "",
    mh: ""
})
let bgColors = ref("#000")
let bgPCUrl = ref("https://tw.hicdn.beanfun.com/beanfun/promo/Lineage/E20220930/assets/img/bg.jpg")
let bgMBUrl = ref("");
var _uid = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
const imageInfo = (url) => {
    var img = new Image();
    img.onload = function () {
        console.log(img.width);
    };
    img.src = url
}
// https://tw.hicdn.beanfun.com/beanfun/promo/Lineage/E20220930/assets/img/bg.jpg
watchEffect(() => {
    if (content.value.body[_uid].update) {
        showEdit.value = true;
    }

    imageInfo(bgPCUrl.value)
    // console.log(bgPCUrl.value)
})
onMounted(() => {
})
onUpdated(() => {

})
onUnmounted(() => {

})


</script>
<template>
    <div>
        <g-modify :uid="data.uid" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">背景圖</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-img__box">
                    <div class="edit-img__title">*圖片網址:</div>
                    <input type="text" class="edit-img__input" v-model="bgPCUrl" />
                    <div class="edit-img__preview"></div>
                </div>
                <div class="edit-mobile__box">
                    <div class="edit-img__title">手機版圖片網址:</div>
                    <input type="text" class="edit-img__input" v-model="bgMBUrl" />
                    <div class="edit-img__preview"></div>
                </div>
                <div class="edit-bg_color__box">
                    <div class="edit-bg_color__title">背景底色:</div>
                    <div class="edit-bg_color__picker">
                        <Chrome v-model="bgColors" />
                    </div>
                    <div class="edit-bgColor__preview"></div>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="edit-btn__submit" @click="submit">確認送出</a>
                    <a href="javascript:;" class="edit-btn__reset" @click="reset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>