<script>
export default {
    name: "GTop",
    label: "回到TOP物件",
    limit: 1,
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
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let topData = reactive({});
let topSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        align: "left",
        type: "style",
        style: "",
        pc: "",
        mobile: "", validPC: true, validMobile: true
    }
}
Object.assign(topData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(topData, cloneDeep(props.data.content));
            Object.assign(topSetting, cloneDeep(props.data.content));
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(topData, cloneDeep(props.data.content));
        Object.assign(topSetting, cloneDeep(props.data.content));
        if ($addComponent) {
            $addComponent();
        }
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const openPop = (data) => {
    data.pop.show = true
}

async function validateTopData(data) {
    if (data.type === "img") {
        if (data.pc.trim() === "") {
            data.validPC = false;
            return false;
        } else {
            const isPCImageValid = await CheckImage(data.pc);
            data.validPC = isPCImageValid;
            if (!isPCImageValid) {
                return false;
            }
        }

        if (data.mobile.trim() !== "") {
            const isMobileImageValid = await CheckImage(data.mobile);
            data.validMobile = isMobileImageValid;
            if (!isMobileImageValid) {
                return false;
            }
        }
    } else if (data.type === "style") {
        if (data.style.trim() === "") {
            data.validStyle = false;
            return false;
        } else {
            data.validStyle = true;
        }
    }

    return true;
}

const onSubmit = async () => {
    loadingShow()
    let isValidData = await validateTopData(topData);

    if (isValidData) {
        $("#loadingProgress").show();
        let data = cloneDeep(topData);
        store.updateCpt(props.data.uid, data);
        Object.assign(topSetting, data);
    } else {
        loadingHide()
    }
}

const onReset = () => {
    Object.assign(topData, initData());
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
        Object.assign(topData, cloneDeep(props.data.content));
    } else {
        Object.assign(topData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
const goTop = () => {
    if (status.value) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滾動效果
        });
    }
}

</script>
<template>
    <div class="g-top" :data-align="topSetting.align" :data-type="topSetting.type"
         @click="goTop">
        <div class="g-top__text" :style="[colors[topSetting.style]]" v-if="topSetting.type == 'style'">TOP</div>
        <picture v-if="topSetting.type == 'img'">
            <source media="(max-width:768px)" :srcset="topSetting.mobile || topSetting.pc" />
            <img class="g-top__img" :srcset="topSetting.pc" :src="topSetting.pc" alt="" />
        </picture>
        <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">回到TOP物件
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕位置:</div>
                    <g-radio label="左" name="align" value="left" v-model="topData.align" />
                    <g-radio label="右" name="align" value="right" v-model="topData.align" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕樣式:</div>
                    <g-radio label="主題顏色" name="type" value="style" v-model="topData.type" />
                    <g-radio label="自訂圖片" name="type" value="img" v-model="topData.type" />
                </div>
                <template v-if="topData.type == 'style'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                      :valid="topData.validStyle"
                                      v-model="topData.style" />
                        </div>
                    </div>
                </template>
                <template v-if="topData.type == 'img'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-input label="圖片網址:" v-model.trim="topData.pc" :preview="topData.pc" :required="true"
                                     :valid="topData.validPC" />
                        </div>
                        <div class="g-edit__col">
                            <g-input label="手機版圖片網址:" v-model.trim="topData.mobile" :preview="topData.mobile"
                                     :valid="topData.validMobile" />
                        </div>
                    </div>
                </template>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>