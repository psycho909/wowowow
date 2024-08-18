<script>
export default {
    name: "GButtons",
    label: "快速按鈕",
    order: [5, 5], type: [1, 2]
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
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let _buttonsDataLength = ref(1);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let buttonsData = reactive({});
let buttonsSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
const $addComponent = inject('$addComponent');
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
            target: true
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(buttonsData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(buttonsData, cloneDeep(props.data.content));
            Object.assign(buttonsSetting, cloneDeep(props.data.content));
            _buttonsDataLength.value = buttonsData.num;
            buttonsData.buttons.forEach((v, i) => {
                if (v.target == undefined) {
                    v.target = true
                }
            })
            buttonsSetting.buttons.forEach((v, i) => {
                if (v.target == undefined) {
                    v.target = true
                }
            })
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(buttonsData, cloneDeep(props.data.content));
        Object.assign(buttonsSetting, cloneDeep(props.data.content));
        _buttonsDataLength.value = buttonsData.num;
        if ($addComponent) {
            $addComponent();
        }
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
                validText: true,
                url: "",
                validUrl: true,
                target: true
            });
        }
    } else if (diff < 0) {
        console.log("IN")
        buttonsData.buttons = buttonsData.buttons.slice(0, num); // 直接截斷至新數量
        console.log(buttonsData.buttons)
    }

    buttonsData.num = num; // 更新 num
    _buttonsDataLength.value = num;
}

function validateButtonsData(data) {
    let isValid = true;
    if (data.style.trim() === "") {
        data.validStyle = false;
        isValid = false;
    } else {
        data.validStyle = true;
    }
    for (const button of data.buttons) {
        if (button.text.trim() === "" || button.text.trim().length <= 0) {
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
    buttonsData.validMt = true;
    buttonsData.validMb = true;
    buttonsData.validMmt = true;
    buttonsData.validMmb = true;
    if (buttonsData.mt < 0) {
        buttonsData.validMt = false;
    }
    if (buttonsData.mb < 0) {
        buttonsData.validMb = false;
    }
    if (buttonsData.mobile_mt < 0) {
        buttonsData.validMmt = false;
    }
    if (buttonsData.mobile_mb < 0) {
        buttonsData.validMmb = false;
    }
    if (buttonsData.validMt && buttonsData.validMb && buttonsData.validMmt && buttonsData.validMmb) {
        if (isValidData) {
            let data = cloneDeep(buttonsData);
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(buttonsSetting, data);
            GetPageType(store.otp)
        } else {
            loadingHide();
        }
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
    <div class="g-buttons" :style="[colors[buttonsSetting.style], cssVar]">
        <div class="g-buttons-container" :data-num="buttonsSetting.num" :data-align="buttonsSetting.align">
            <template v-for="button in buttonsSetting.buttons">
                <a :href="[store.status != 'edit' ? button.url : 'javascript:;']"
                   :target="[store.status != 'edit' ? button.target == true || button.target == 'true' ? '_blank' : '_self' : '_self']"
                   class="g-buttons__btn">{{ button.text }}</a>
            </template>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">快速按鈕
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Buttons${pageTypeSeq}.html`"
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
                                <g-input label="按鈕文字:" type="text" v-model="item.text" :required="true"
                                         :valid="item.validText" />
                            </div>
                            <div class="g-edit__col">
                                <g-input label="按鈕連結:" type="text" v-model="item.url" :required="true"
                                         :valid="item.validUrl" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label">另開視窗:</div>
                                <g-radio label="是" :name="'attribute' + index" :value="true"
                                         v-model="item.target" />
                                <g-radio label="否" :name="'attribute' + index" :value="false"
                                         v-model="item.target" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="buttonsData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="buttonsData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="buttonsData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="buttonsData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="buttonsData.mobile_mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="buttonsData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="buttonsData.mobile_mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="buttonsData.validMmb" />
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