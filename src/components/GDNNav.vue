<script>
export default {
    name: "GDNNav",
    label: "選單區塊",
    limit: 1,
    order: [5, 5],
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
let navData = reactive({});
let navSetting = reactive({})
let loading = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        pcMarginTop: 104,
        mobileMarginTop: 80,
        pcItemMarginBottom: 0,
        mobileItemMarginBottom: 0,
        navs: [{
            pc: "",
            effectCheck: false,
            effectImg: "",
            effectImgW: "",
            effectImgH: "",
            validEffectImg: true,
            mobile: "",
            w: "",
            h: "",
            mw: "",
            mh: "",
            link: "",
            validPC: true,
            validMobile: true,
            validLink: true,
            target: true
        }],
    }
}
Object.assign(navData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    Object.assign(navData, cloneDeep(props.data.content));
    Object.assign(navSetting, cloneDeep(props.data.content))
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(navData, cloneDeep(props.data.content));
        Object.assign(navSetting, cloneDeep(props.data.content));
        if (navData.navs.length) {
            navData.navs.forEach((v, i) => {
                if (v.target == undefined) {
                    v.target = true
                }
            })
            navSetting.navs.forEach((v, i) => {
                if (v.target == undefined) {
                    v.target = true
                }
            })
        }
        if ($addComponent) {
            $addComponent();
        }
    }
})

const addInsertMenu = (index) => {
    const nav = {
        pc: "",
        effectCheck: false,
        effectImg: "",
        effectImgW: "",
        effectImgH: "",
        validEffectImg: true,
        mobile: "",
        w: "",
        h: "",
        mw: "",
        mh: "",
        link: "",
        validPC: true,
        validMobile: true,
        validLink: true,
        target: true
    };

    navData.navs.push(nav)
};

const removeMenu = (deleteIndex) => {
    if (navData.navs.length > 1) {
        navData.navs.splice(deleteIndex, 1);
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = navData.navs[index];
    var _content = [...navData.navs.slice(0, index), ...navData.navs.slice(index + 1)];
    navData.navs = _content;
    navData.navs.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < navData.navs.length - 1) {
        const temp = navData.navs[index];
        navData.navs[index] = navData.navs[index + 1];
        navData.navs[index + 1] = temp;
    }
}

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

async function validateAll(data) {
    let isValid = true;
    for (const item of data.navs) {
        if (!item.pc || !CheckUrl(item.pc)) {
            item.validPC = false;
            isValid = false;
        } else {
            item.validPC = true;
        }

        if (item.mobile && !CheckUrl(item.mobile)) {
            item.validMobile = false;
            isValid = false;
        } else {
            item.validMobile = true;
        }

        if (item.pc) {
            const pcImageValid = await CheckImage(item.pc);
            if (!pcImageValid) {
                item.validPC = false;
                isValid = false;
            } else {
                const pcImageDimensions = await imageInfo("pc", item.pc);
                if (pcImageDimensions) {
                    item.w = pcImageDimensions.width;
                    item.h = pcImageDimensions.height;
                    item.validPC = true;
                } else {
                    item.validPC = false;
                    isValid = false;
                }
            }
        }
        if (item.mobile) {
            const mobileImageValid = await CheckImage(item.mobile);
            if (!mobileImageValid) {
                item.validMobile = false;
                isValid = false;
            } else {
                const mobileImageDimensions = await imageInfo("mobile", item.mobile);
                if (mobileImageDimensions) {
                    item.mw = mobileImageDimensions.width;
                    item.mh = mobileImageDimensions.height;
                    item.validMobile = true;
                } else {
                    item.validMobile = false;
                    isValid = false;
                }
            }
        }
        if (item.effectCheck) {
            if (item.effectImg) {
                const pcImageValid = await CheckImage(item.effectImg);
                if (!pcImageValid) {
                    item.validEffectImg = false;
                    isValid = false;
                } else {
                    const pcImageDimensions = await imageInfo("pc", item.effectImg);
                    if (pcImageDimensions) {
                        item.effectImgW = pcImageDimensions.width;
                        item.effectImgH = pcImageDimensions.height;
                        item.validEffectImg = true;
                    } else {
                        item.validEffectImg = false;
                        isValid = false;
                    }
                }
            } else {
                item.validEffectImg = false;
                isValid = false;
            }
        }
        if (item.link && !CheckUrl(item.link)) {
            item.validLink = false;
            isValid = false;
        } else {
            item.validLink = true;
        }
    }
    return isValid;
}

function transformNavsToCSSProps(item) {
    const cssProps = {
        "--nav-pc": `url(${item.pc})`,
        "--nav-effectImg": item.effectImg ? `url(${item.effectImg})` : undefined,
        "--nav-mobile": item.mobile ? `url(${item.mobile})` : `url(${item.pc})`,
        "--nav-w": `${item.w}`,
        "--nav-h": `${item.h}`,
        "--nav-mw": item.mw ? `${item.mw}` : `${item.w}`,
        "--nav-mh": item.mh ? `${item.mh}` : `${item.h}`,
        "--nav-effectImg-w": item.effectImgW ? `${item.effectImgW}` : "",
        "--nav-effectImg-h": item.effectImgH ? `${item.effectImgH}` : "",
        "--nav-margin-top": item.pcMarginTop ? `${item.pcMarginTop}` : "",
        "--nav-m-margin-top": item.mobileMarginTop ? `${item.mobileMarginTop}` : item.pcMarginTop,
        "--nav-margin-bottom": item.pcMarginBottom ? `${item.pcMarginBottom}` : "",
        "--nav-m-margin-bottom": item.mobileMarginBottom ? `${item.mobileMarginBottom}` : item.pcMarginBottom,
    };

    return {
        ...cssProps,
    };
}

const onSubmit = async () => {
    loadingShow()
    const isNavDataValid = await validateAll(navData);
    navData.validMt = true;
    navData.validMb = true;
    navData.validMmt = true;
    navData.validMmb = true;
    if (navData.pcMarginTop < 0) {
        navData.validMt = false;
    }
    if (navData.mobileMarginTop < 0) {
        navData.validMb = false;
    }
    if (navData.pcItemMarginBottom < 0) {
        navData.validMmt = false;
    }
    if (navData.mobileItemMarginBottom < 0) {
        navData.validMmb = false;
    }
    if (navData.validMt && navData.validMb && navData.validMmt && navData.validMmb) {
        if (isNavDataValid) {
            let data = cloneDeep(navData);
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(navSetting, data);
            GetPageType(store.otp)
        }
    }


    loadingHide()
}

const onReset = () => {
    Object.assign(navData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        if (Object.keys(props.data.content).length == 0) {
            store.removeCpt(props.data.uid, props.sub);
        }
        document.querySelector("body").classList.remove("ov-hidden");
        store.editCptClose(props.data.uid, props.sub);
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(navData, cloneDeep(props.data.content));
    } else {
        Object.assign(navData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-dn_nav" :style="transformNavsToCSSProps(navSetting)">
        <div class="g-dn_nav-container">
            <template v-if="store.status == 'edit'">
                <template v-for="(item, index) in navSetting.navs">
                    <a href="javascript:;" class="g-dn_nav-item" :data-init="data.init" :data-effect="item.effectCheck"
                       :style="transformNavsToCSSProps(navSetting)">
                        <span class="g-dn_nav-item1" :style="transformNavsToCSSProps(item)"></span>
                        <span class="g-dn_nav-item2" v-if="item.effectCheck != 'false'"
                              :style="transformNavsToCSSProps(item)"></span>
                    </a>
                </template>
            </template>
            <template v-else>
                <template v-for="(item, index) in navSetting.navs">
                    <a :href="item.link ? item.link : 'javascript:;'"
                       :target="[item.link ? item.target == true || item.target == 'true' ? '_blank' : '' : '']"
                       class="g-dn_nav-item" :data-init="data.init" :data-effect="item.effectCheck"
                       :style="transformNavsToCSSProps(navSetting)">
                        <span class="g-dn_nav-item1" :style="transformNavsToCSSProps(item)"></span>
                        <span class="g-dn_nav-item2" v-if="item.effectCheck != 'false'"
                              :style="transformNavsToCSSProps(item)"></span>
                    </a>
                </template>
            </template>
            <g-modify :uid="data.uid" :sub="sub" :move='false' v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">選單區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/DNNav${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <template v-for="(item, index) in navData.navs">
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
                                    <g-input label="圖片網址:" v-model.trim="item.pc" :preview="item.pc" :required="true"
                                             :valid="item.validPC" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label">圖片特效:</div>
                                    <g-radio label="無" :name="'effect' + index" :value="false"
                                             v-model="item.effectCheck" />
                                    <g-radio label="換圖" :name="'effect' + index" :value="true"
                                             v-model="item.effectCheck" />
                                </div>
                                <div class="g-edit__col" v-if="item.effectCheck == 'true'">
                                    <g-input label="更換圖片網址:" v-model.trim="item.effectImg" :preview="item.effectImg"
                                             :required="true"
                                             :valid="item.validEffectImg" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="手機版圖片網址:" v-model.trim="item.mobile" :preview="item.mobile"
                                             :valid="item.validMobile" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="連結:" v-model.trim="item.link"
                                             :valid="item.validLink" />
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
                </template>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="navData.pcMarginTop" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="navData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="navData.mobileMarginTop"
                                 @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="navData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC按鈕間距下:" type="number" v-model="navData.pcItemMarginBottom"
                                 @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="navData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile按鈕間距下:" type="number" v-model="navData.mobileItemMarginBottom"
                                 @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="navData.validMmb" />
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