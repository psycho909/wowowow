<script>
export default {
    name: "GAccordion",
    label: "手風琴文字",
    order: 5
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GCkedit from '../elements/GCkedit.vue';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let accordionSetting = reactive({})
let accordionData = reactive({});
let styleValid = ref(true);
let loading = ref(true);
let bodyRefs = ref([])
const initData = () => {
    return {
        align: "left",
        style: "",
        validStyle: true,
        accordions: [{
            prefix: "",
            validPrefix: true,
            title: "",
            validTitle: true,
            content: "",
            validContent: true,
            collapse: true
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(accordionData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(accordionData, cloneDeep(props.data.content));
            Object.assign(accordionSetting, cloneDeep(props.data.content));
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(accordionData, cloneDeep(props.data.content));
        Object.assign(accordionSetting, cloneDeep(props.data.content));
        bodyRefs.value.forEach(item => {
            item.style = `--max-height:${item.scrollHeight}`
        });
    }
})

const addInsertMenu = (index) => {
    const accordion = {
        prefix: "",
        title: "",
        content: "",
        collapse: true
    };

    accordionData.accordions.push(accordion)
};

const removeMenu = (deleteIndex) => {
    if (accordionData.accordions.length > 1) {
        accordionData.accordions.splice(deleteIndex, 1);
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = accordionData.accordions[index];
    var _content = [...accordionData.accordions.slice(0, index), ...accordionData.accordions.slice(index + 1)];
    accordionData.accordions = _content;
    accordionData.accordions.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < accordionData.accordions.length - 1) {
        const temp = accordionData.accordions[index];
        accordionData.accordions[index] = accordionData.accordions[index + 1];
        accordionData.accordions[index + 1] = temp;
    }
}

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

function validateAccordionData(data) {
    if (data.style.trim() === "") {
        data.validStyle = false;
        return false;
    } else {
        data.validStyle = true;
    }

    let isValid = true;

    for (const accordion of data.accordions) {
        if (accordion.prefix.trim() !== "" && accordion.prefix.trim().length > 5) {
            accordion.validPrefix = false;
            isValid = false;
        } else {
            accordion.validPrefix = true;
        }

        if (accordion.title.trim() === "" || accordion.title.trim().length > 30) {
            accordion.validTitle = false;
            isValid = false;
        } else {
            accordion.validTitle = true;
        }

        if (accordion.content.trim() === "") {
            accordion.validContent = false;
            isValid = false;
        } else {
            accordion.validContent = true;
        }
    }

    return isValid;
}

const onSubmit = async () => {
    loadingShow()
    let isValidData = validateAccordionData(accordionData);

    if (isValidData) {
        let data = cloneDeep(accordionData);
        store.updateCpt(props.data.uid, data);
        Object.assign(accordionSetting, data);
    }
    loadingHide()
}

const onReset = () => {
    Object.assign(accordionData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        loadingHide()
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(accordionData, cloneDeep(props.data.content));
    } else {
        Object.assign(accordionData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

const toggleAccordion = (index) => {
    if (accordionSetting.accordions[index].collapse.toString() == 'true') {
        accordionSetting.accordions[index].collapse = 'false';
    } else {
        accordionSetting.accordions[index].collapse = 'true'
    }
}

</script>
<template>
    <div class="g-accordion" :style="cssVar">
        <div class="g-accordion-container">
            <template v-for="(accordion, index) in accordionSetting.accordions" :key="index">
                <div class="g-accordion__item">
                    <div class="g-accordion__header" @click="toggleAccordion(index)">{{ accordion.title }} {{
                        accordion.collapse.toString() }}</div>
                    <div class="g-accordion__body" :class="[accordion.collapse.toString() == 'true' ? '' : 'active']"
                         ref="bodyRefs">
                        <div class="g-accordion__content" v-html="accordion.content"></div>
                    </div>
                </div>
            </template>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">手風琴文字物件
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">對齊方向:</div>
                    <g-radio label="左" name="align" value="left" v-model="accordionData.align" />
                    <g-radio label="中" name="align" value="center" v-model="accordionData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="accordionData.validStyle"
                              v-model="accordionData.style" />
                </div>
                <template v-for="(accordion, index) in accordionData.accordions">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <div class="g-edit__group shrink-0">
                                <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                                <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                            </div>
                            <div class="g-edit__group">
                                <div class="g-edit__col">
                                    <g-input label="標題前綴字:" type="text" v-model.trim="accordion.prefix" max="5"
                                             :valid="accordion.validPrefix" warning="5字以內" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="標題:" type="text" v-model.trim="accordion.title" :required="true"
                                             max="30" :valid="accordion.validTitle" />
                                </div>
                                <div class="g-edit__col items-start">
                                    <div class="input-group__label">內文:</div>
                                    <g-ckedit v-model:modelValue="accordion.content" :valid="accordion.validContent" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">預設收起:</div>
                        <g-radio label="是" :name="'collapse' + index" :value="true" v-model="accordion.collapse" />
                        <g-radio label="否" :name="'collapse' + index" :value="false" v-model="accordion.collapse" />
                    </div>
                </template>

                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="accordionData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="accordionData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="accordionData.mobile_mt"
                                 @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="accordionData.mobile_mb"
                                 @change="handleNumber" />
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