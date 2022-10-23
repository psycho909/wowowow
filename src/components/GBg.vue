<script>
export default {
    name: "Background",
    label: "背景圖",
    limit: 1
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
const props = defineProps(["data"])
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let showEdit = ref(false);
let showColor = ref(false)
let bgData = reactive({
    color: "#fff",
    pc: "",
    mobile: "",
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
        if (type == "mobile") {
            bgData.mw = img.width
            bgData.mh = img.height
        }
    };
    img.src = url
}
watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (CheckImage(bgData.pc)) {
        imageInfo("pc", bgData.pc)
    }
    if (CheckImage(bgData.mobile)) {
        imageInfo("mobile", bgData.mobile)
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
const colorBlur = () => {
    console.log("blurText")
}

const onSubmit = () => {
    let data = { ...bgData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            bgData[v] = props.data.content[v];
        })
    } else {
        bgData = {
            color: "#fff",
            pc: "",
            mobile: "",
            w: "",
            h: "",
            mw: "",
            mh: ""
        }
    }
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
const closeBtn = ()=> {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            bgData[v] = props.data.content[v];
        })
    } else {
        bgData = {
            color: "#fff",
            pc: "",
            mobile: "",
            w: "",
            h: "",
            mw: "",
            mh: ""
        }
    }
    showEdit.value = false;
    content.value.body[_index].update = false;
}
</script>
<template>
    <div class="g-bg">
        <g-modify :uid="data.uid" title="背景底圖" :move="false" :remove="false"
                  v-if="MODE == 'development' && page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'"
                :func="enterColor">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">
                        背景圖
                        <a href="javascript:;" class="edit-title__q"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="*圖片網址:" v-model="bgData.pc" :preview="bgData.pc" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model="bgData.mobile" :preview="bgData.mobile" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group">
                        <div class="input-group__label">*背景底色:</div>
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