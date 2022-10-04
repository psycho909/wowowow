<script>
export default {
    name: "Slogan",
    label: "主標題圖片"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from 'vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage } from "../Tool";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { content } = storeToRefs(store);
let sloganSetting = ref({})
let sloganData = reactive({
    link: "",
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
            sloganData.w = img.width
            sloganData.h = img.height
        }
        if (type == "mb") {
            sloganData.mw = img.width
            sloganData.mh = img.height
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
    if (CheckImage(sloganData.pc)) {
        imageInfo("pc", sloganData.pc)
    }
    if (CheckImage(sloganData.mb)) {
        imageInfo("mb", sloganData.mb)
    }

})

onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            sloganData[v] = props.data.content[v];
        })
        sloganSetting.value["--pc"] = `url(${props.data.content.pc})`
        sloganSetting.value["--mb"] = `url(${props.data.content.mb})`
        sloganSetting.value["--w"] = props.data.content.w
        sloganSetting.value["--h"] = props.data.content.h
        sloganSetting.value["--mw"] = props.data.content.mw
        sloganSetting.value["--mh"] = props.data.content.mh
    }
})
onUpdated(() => {

})
onUnmounted(() => {

})
const submit = () => {
    var data = { ...sloganData }
    store.updateCpt(props.data.uid, data)
}
const reset = () => {

}

</script>
<template>
    <div class="g-slogan">
        <a :href="[sloganSetting.link?sloganSetting.link:'javascript:;']" class="g-slogan-container"
           :style="sloganSetting">
            <g-modify :uid="data.uid" title="主標題設定" :move="false" />
            <g-edit v-model:showEdit="showEdit">
                <template #edit-content>
                    <div class="edit-title__box">
                        <div class="edit-title__text">背景圖</div>
                        <a href="javascript:;" class="edit-title__q"></a>
                    </div>
                    <div class="edit-input__box">
                        <g-input label="*圖片網址:" v-model="sloganData.pc" :preview="sloganData.pc" />
                    </div>
                    <div class="edit-input__box">
                        <g-input label="手機版圖片網址:" v-model="sloganData.mb" :preview="sloganData.mb" />
                    </div>
                    <div class="edit-input__box">
                        <g-input label="主標連結:" v-model="sloganData.link" />
                    </div>
                    <div class="edit-btn__box">
                        <a href="javascript:;" class="btn btn__submit" @click="submit">確認送出</a>
                        <a href="javascript:;" class="btn btn__reset" @click="reset">清除重填</a>
                    </div>
                </template>
            </g-edit>
        </a>
    </div>
</template>