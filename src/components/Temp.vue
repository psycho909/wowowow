<script>
export default {
    name: "GImg",
    label: "圖片區塊",
    order: 5
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let imgData = reactive({});
let imgSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
const initData = () => {
    return {
        num: 1,
        style: "",
        imgs: [{
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(imgData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    Object.assign(imgData, cloneDeep(props.data.content));
    Object.assign(imgSetting, cloneDeep(props.data.content))
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(imgData, cloneDeep(props.data.content));
        Object.assign(imgSetting, cloneDeep(props.data.content))
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

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const openPop = (data) => {
    data.pop.show = true
}

const onSubmit = async () => {
    loadingShow()
    await imageInfo("pc", imgData.pc);
    await imageInfo("mobile", imgData.mobile);
    let data = cloneDeep(imgData);
    store.updateCpt(props.data.uid, data, props.sub);
    Object.assign(imgSetting, data);
    loadingHide()
}

const onReset = () => {
    Object.assign(imgData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(imgData, cloneDeep(props.data.content));
    } else {
        Object.assign(imgData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

const closePop = (data, url) => {
    if (store.page == "EditPage") {
        data.pop.show = false
    } else {
        window.location.href = url;
    }
}

</script>
<template>
    <div class="g-img" :style="cssVar">
        <div class="g-img-container" :data-num="imgSetting.num">
            <template v-for="imgs in imgSetting.imgs">
            </template>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">圖片區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">

                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="imgData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="imgData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="imgData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="imgData.mobile_mb" @change="handleNumber" />
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