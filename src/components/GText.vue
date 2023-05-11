<script>
export default {
    name: "GText",
    label: "文字區塊",
    order: 7
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GRadio from '../elements/GRadioo.vue';
import GCkedit from '../elements/GCkedit.vue';
import GSelect from '../elements/GSelect.vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import colors, { style1, style2 } from "../colors";
import { handleNumber } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let textSetting = reactive({})
let styleValid = ref(true);
let textUpdate = ref(false);
let textData = reactive({})
const initData = () => {
    return {
        align: "left",
        style: "",
        text: "",
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0
    }
};
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);

Object.assign(textData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        textUpdate.value = true;
        await nextTick();
        textUpdate.value = false;
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
onMounted(async () => {
    await nextTick()
    if (Object.keys(content).length > 0) {
        Object.assign(textData, cloneDeep(props.data.content));
        Object.assign(textSetting, cloneDeep(props.data.content));
    }
})


const onSubmit = async () => {
    if (textData.style == "") {
        styleValid.value = false;
    } else {
        styleValid.value = true;
    }
    let data = cloneDeep(textData);

    if (styleValid.value) {
        $("#loadingProgress").show();
        if (props.sub) {
            store.updateCpt(props.data.uid, data, true);
        } else {
            store.updateCpt(props.data.uid, data);
        }

        Object.assign(textSetting, data);
        textUpdate.value = true;
        await nextTick();
        textUpdate.value = false;
    }
}
const onReset = () => {
    Object.assign(textData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(textData, cloneDeep(props.data.content));
    } else {
        Object.assign(textData, initData());
    }
    showEdit.value = false;
    props.data.update = false;
}
</script>
<template>
    <div class="g-text" :class="[textSetting.align]" :style="[colors[textSetting.style], cssVar]">
        <div class="g-text-container" v-if="!textUpdate">
            <div class="g-text__content" v-html="textSetting.text"></div>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">文字區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Text.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">對齊方向:</div>
                    <g-radio label="左" name="align" value="left" v-model="textData.align" />
                    <g-radio label="中" name="align" value="center" v-model="textData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="styleValid"
                              v-model="textData.style" />
                </div>
                <div class="g-edit__row">
                    <g-ckedit v-model:modelValue="textData.text" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="textData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="textData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="textData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="textData.mobile_mb" @change="handleNumber" />
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