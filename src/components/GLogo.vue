<script>
export default {
    name: "GLogo",
    label: "LOGO區塊",
    limit: 1,
    order: 5,
    type: [2]
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
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let logoData = reactive({});
let logoSetting = reactive({})
let loading = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        link: "",
        pc: "",
        mobile: "", validPC: true, validMobile: true, validLink: true, target: true
    }
}
Object.assign(logoData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(logoData, cloneDeep(props.data.content));
            Object.assign(logoSetting, cloneDeep(props.data.content))
            if (logoData.target == undefined) {
                logoData.target = true
            }
            if (logoSetting.target == undefined) {
                logoSetting.target = true
            }
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(logoData, cloneDeep(props.data.content));
        Object.assign(logoSetting, cloneDeep(props.data.content))
        if ($addComponent) {
            $addComponent();
        }
    }
})

const cssVar = computed(() => {
    let varData = {};
    if (Object.keys(logoSetting).length > 0) {
        varData = {
            ...varData,
            "--logo-pc": `url(${logoSetting.pc})`,
            "--logo-mobile": `url(${logoSetting.mobile ? logoSetting.mobile : logoSetting.pc})`,
            "--logo-w": logoSetting.w,
            "--logo-h": logoSetting.h,
            "--logo-mw": logoSetting.mw,
            "--logo-mh": logoSetting.mh,
        }
        return varData
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const openPop = (data) => {
    data.pop.show = true
}

const imageInfo = async (type, url) => {
    return new Promise((resolve, reject) => {
        var elem = new Image();
        elem.onload = () => {
            const dimensions = {
                width: elem.width,
                height: elem.height
            };
            resolve(dimensions);
        };
        elem.onerror = () => resolve(null);
        elem.src = url;
    });
};

async function validateLogoData(logoData) {
    let isValid = true;
    if (!logoData.pc || !CheckUrl(logoData.pc)) {
        logoData.validPC = false;
        isValid = false;
    } else {
        logoData.validPC = true;
    }

    if (logoData.mobile && !CheckUrl(logoData.mobile)) {
        logoData.validMobile = false;
        isValid = false;
    } else {
        logoData.validMobile = true;
    }
    if (logoData.pc) {
        const pcImageValid = await CheckImage(logoData.pc);
        if (!pcImageValid) {
            logoData.validPC = false;
            isValid = false;
        } else {
            const pcImageDimensions = await imageInfo("pc", logoData.pc);
            if (pcImageDimensions) {
                logoData.w = pcImageDimensions.width;
                logoData.h = pcImageDimensions.height;
                logoData.validPC = true;
            } else {
                logoData.validPC = false;
                isValid = false;
            }
        }

    }

    if (logoData.mobile) {
        const mobileImageValid = await CheckImage(logoData.mobile);
        if (!mobileImageValid) {
            logoData.validMobile = false;
            isValid = false;
        } else {
            const mobileImageDimensions = await imageInfo("mobile", logoData.mobile);
            if (mobileImageDimensions) {
                logoData.mw = mobileImageDimensions.width;
                logoData.mh = mobileImageDimensions.height;
                logoData.validMobile = true;
            } else {
                logoData.validMobile = false;
                isValid = false;
            }
        }

    }

    if (logoData.link && !CheckUrl(logoData.link)) {
        logoData.validLink = false;
        isValid = false;
    } else {
        logoData.validLink = true;
    }

    return isValid;
}

const onSubmit = async () => {
    loadingShow()
    const isLogoDataValid = await validateLogoData(logoData);
    if (isLogoDataValid) {
        let data = cloneDeep(logoData);
        store.updateCpt(props.data.uid, data, props.sub);
        Object.assign(logoSetting, data);
        GetPageType(store.otp)
    }

    loadingHide()
}

const onReset = () => {
    Object.assign(logoData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        if (Object.keys(props.data.content).length == 0) {
            store.removeCpt(props.data.uid, props.sub);
        }
        document.querySelector("body").classList.remove("ov-hidden");
        store.editCptClose(props.data.uid, props.sub)
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(logoData, cloneDeep(props.data.content));
    } else {
        Object.assign(logoData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-logo" :data-init="data.init">
        <template v-if="store.status != 'edit'">
            <a :href="[logoSetting.link ? logoSetting.link : 'javascript:;']"
               :target="[logoSetting.link ? logoSetting.target == true || logoSetting.target == 'true' ? '_blank' : '' : '']"
               class="g-logo-container" :style="cssVar"></a>
        </template>
        <template v-else>
            <a href="javascript:;" class="g-logo-container" :style="cssVar" :data-init="data.init"></a>
        </template>
        <g-modify :uid="data.uid" :move="false" :sub="sub" v-if="page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">LOGO
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Logo${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="圖片網址:" v-model.trim="logoData.pc" :preview="logoData.pc" :required="true"
                             :valid="logoData.validPC" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model.trim="logoData.mobile" :preview="logoData.mobile"
                             :valid="logoData.validMobile" />
                </div>
                <div class="g-edit__row">
                    <g-input label="連結:" v-model.trim="logoData.link" :valid="logoData.validLink" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label">另開視窗:</div>
                        <g-radio label="是" :name="'attribute'" :value="true"
                                 v-model="logoData.target" />
                        <g-radio label="否" :name="'attribute'" :value="false"
                                 v-model="logoData.target" />
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