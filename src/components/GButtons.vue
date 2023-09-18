<script>
export default {
    name: "GButtons",
    label: "快速按鈕物件",
    order: 5, type: [1]
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

const props = defineProps(["data"])
let showEdit = ref(false);
let _buttonsDataLength = ref(1);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let buttonsData = reactive({});
let buttonsSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
const initData = () => {
    return {
        num: 1,
        align: "left",
        style: "",
        validStyle: true,
        buttons: [{
            text: "",
            validText: true,
            url: "",
            validUrl: true,
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(buttonsData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    Object.assign(buttonsData, cloneDeep(props.data.content));
    Object.assign(buttonsSetting, cloneDeep(props.data.content));
    _buttonsDataLength.value = buttonsData.num;
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(buttonsData, cloneDeep(props.data.content));
        Object.assign(buttonsSetting, cloneDeep(props.data.content));
        _buttonsDataLength.value = buttonsData.num;
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

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = buttonsData.buttons[index];
    var _content = [...buttonsData.buttons.slice(0, index), ...buttonsData.buttons.slice(index + 1)];
    buttonsData.buttons = _content;
    buttonsData.buttons.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < buttonsData.buttons.length - 1) {
        const temp = buttonsData.buttons[index];
        buttonsData.buttons[index] = buttonsData.buttons[index + 1];
        buttonsData.buttons[index + 1] = temp;
    }
}

const openPop = (data) => {
    data.pop.show = true
}

const onChange = (e) => {
    let num = parseInt(e.target.value); // 將字串轉換為數字
    let diff = num - buttonsData.buttons.length;

    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            buttonsData.buttons.push({
                text: "",
                url: ""
            });
        }
    } else if (diff < 0) {
        buttonsData.buttons.splice(num); // 直接截斷至新數量
    }

    buttonsData.num = num; // 更新 num
    _buttonsDataLength.value = num;
}

function validateButtonsData(data) {
    if (data.style.trim() === "") {
        data.validStyle = false;
        return false;
    } else {
        data.validStyle = true;
    }

    let isValid = true;

    for (const button of data.buttons) {
        if (button.text.trim() === "" || button.text.trim().length > 8) {
            button.validText = false;
            isValid = false;
        } else {
            button.validText = true;
        }

        if (button.url.trim() === "") {
            button.validUrl = false;
            isValid = false;
        } else {
            button.validUrl = true;
        }
    }

    return isValid;
}


const onSubmit = async () => {
    loadingShow();
    let isValidData = validateButtonsData(buttonsData);
    if (isValidData) {
        let data = cloneDeep(buttonsData);
        store.updateCpt(props.data.uid, data);
        Object.assign(buttonsSetting, data);
    } else {
        loadingHide();
    }
}

const onReset = () => {
    Object.assign(buttonsData, initData());
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
        Object.assign(buttonsData, cloneDeep(props.data.content));
    } else {
        Object.assign(buttonsData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

</script>
<template>
    <div class="g-buttons" :style="cssVar">
        <div class="g-buttons-container" :data-num="buttonsSetting.num" :data-align="buttonsSetting.align">
            <template v-for="button in buttonsSetting.buttons">
                <a :href="button.url" target="_blank" class="g-buttons__btn">{{ button.text }}</a>
            </template>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">快速按鈕物件
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕位置:</div>
                    <g-radio label="左" name="align" value="left" v-model="buttonsData.align" />
                    <g-radio label="中" name="align" value="center" v-model="buttonsData.align" />
                    <g-radio label="右" name="align" value="right" v-model="buttonsData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="buttonsData.validStyle"
                              v-model="buttonsData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕數量:</div>
                    <g-radio label="1" name="item" value="1" v-model="buttonsData.num" @change="onChange" />
                    <g-radio label="2" name="item" value="2" v-model="buttonsData.num" @change="onChange" />
                    <g-radio label="3" name="item" value="3" v-model="buttonsData.num" @change="onChange" />
                </div>
                <div class="g-edit__row" v-for="(item, index) in buttonsData.buttons" :key="index">
                    <div class="g-edit__col">
                        <div class="g-edit__group">
                            <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                            <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                        </div>
                        <div class="g-edit__group">
                            <div class="g-edit__col">
                                <g-input label="按鈕文字:" type="text" v-model="item.text" max="8" :required="true"
                                         :valid="item.validText" />
                            </div>
                            <div class="g-edit__col">
                                <g-input label="按鈕連結:" type="text" v-model="item.url" :required="true"
                                         :valid="item.validUrl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="buttonsData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="buttonsData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="buttonsData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="buttonsData.mobile_mb" @change="handleNumber" />
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