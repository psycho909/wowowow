<script>
export default {
    name: "GDNNav",
    label: "選單區塊",
    limit: 1,
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
let navData = reactive({});
let navSetting = reactive({})
let loading = ref(true);
const initData = () => {
    return {
        navs: [{
            pc: "",
            mobile: "",
            w: "",
            h: "",
            mw: "",
            mh: "",
            link: "",
            validPC: true,
            validMobile: true,
            validLink: true,
        }],
    }
}
Object.assign(navData, initData());

watchEffect(async () => {
    if (props.data.update) {
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
        Object.assign(navSetting, cloneDeep(props.data.content))
    }
})

const addInsertMenu = (index) => {
    const nav = {
        pc: "",
        mobile: "",
        w: "",
        h: "",
        mw: "",
        mh: "",
        link: "",
        validPC: true,
        validMobile: true,
        validLink: true,
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
                item.w = pcImageDimensions.width;
                item.h = pcImageDimensions.height;
                item.validPC = true;
            }
        }
        if (item.mobile) {
            const mobileImageValid = await CheckImage(item.mobile);
            if (!mobileImageValid) {
                item.validMobile = false;
                isValid = false;
            } else {
                const mobileImageDimensions = await imageInfo("mobile", item.mobile);
                item.mw = mobileImageDimensions.width;
                item.mh = mobileImageDimensions.height;
                item.validMobile = true;
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
        "--nav-mobile": item.mobile ? `url(${item.mobile})` : "",
        "--nav-w": `${item.w}`,
        "--nav-h": `${item.h}`,
        "--nav-mw": item.mw ? `${item.mw}` : "",
        "--nav-mh": item.mh ? `${item.mh}` : "",
    };

    return {
        ...cssProps,
    };
}

const onSubmit = async () => {
    loadingShow()
    const isNavDataValid = await validateAll(navData);
    if (isNavDataValid) {
        let data = cloneDeep(navData);
        store.updateCpt(props.data.uid, data, props.sub);
        Object.assign(navSetting, data);
    }

    loadingHide()
}

const onReset = () => {
    Object.assign(navData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
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
    <div class="g-dn_nav">
        <div class="g-dn_nav-container">
            <template v-for="(item, index) in navSetting.navs">
                <a href="javascript:;" class="g-dn_nav-item" :style="transformNavsToCSSProps(item)"
                   :data-init="data.init"></a>
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
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
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
                                    <g-input label="手機版圖片網址:" v-model.trim="item.mobile" :preview="item.mobile"
                                             :valid="item.validMobile" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="連結:" v-model.trim="item.link"
                                             :valid="item.validLink" />
                                </div>
                            </div>
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