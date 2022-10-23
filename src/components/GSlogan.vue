<script>
export default {
    name: "Slogan",
    label: "主標題圖片",
    limit: 1
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
const { content, MODE, page } = storeToRefs(store);
let sloganSetting = ref({})
let sloganData = reactive({
    link: "",
    mt: "250",
    mb: "24",
    pc: "",
    mobile: "",
    w: "",
    h: "",
    mw: "",
    mh: ""
})
var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (content.value.body[_index]) {
        Object.keys(props.data.content).forEach((v, i) => {
            sloganData[v] = props.data.content[v];
            sloganSetting.value[v] = props.data.content[v];
        })
    }
})

const cssVar = computed(() => {
    let slogan = content.value.body.filter((c, i) => {
        return c.component == "GSlogan"
    })
    return {
        "--mt": slogan[0].content.mt,
        "--mb": slogan[0].content.mb,
    }
})

onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            sloganData[v] = props.data.content[v];
            sloganSetting.value[v] = props.data.content[v];
        })
    }
})
const onSubmit = () => {
    let data = { ...sloganData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            sloganData[v] = props.data.content[v];
        })
    } else {
        sloganData = {
            link: "",
            mt: "250",
            mb: "24",
            pc: "",
            mobile: "",
            w: "",
            h: "",
            mw: "",
            mh: ""
        }
    }
}
const closeBtn = () => {
    if (content.value.body[_index].init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            sloganData[v] = props.data.content[v];
        })
    } else {
        sloganData = {
            link: "",
            mt: "250",
            mb: "24",
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
    <div class="g-slogan">
        <a :href="[sloganSetting.link?sloganSetting.link:'javascript:;']" class="g-slogan-container" :style="cssVar">
            <picture>
                <source media="(max-width:768px)" :srcset="sloganSetting.mobile" />
                <img :srcset="sloganSetting.pc" :src="sloganSetting.pc" alt="" />
            </picture>
            <g-modify :uid="data.uid" title="主標題設定" :move="false" v-if="MODE == 'development' && page == 'EditPage'" />
        </a>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">主標圖<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="間距上:" v-model="sloganData.mt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="間距下:" v-model="sloganData.mb" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="*圖片網址:" v-model="sloganData.pc" :preview="sloganData.pc" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model="sloganData.mobile" :preview="sloganData.mobile" />
                </div>
                <div class="g-edit__row">
                    <g-input label="主標連結:" v-model="sloganData.link" />
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>