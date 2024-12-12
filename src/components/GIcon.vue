<script>
export default {
    name: "GIcon",
    label: "ICON區塊",
    limit: 1,
    order: [5, 6],
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
let iconData = reactive({});
let iconSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        icons: [{
            pc: "",
            effectCheck: false,
            effectImg: "",
            effectImgW: "",
            effectImgH: "",
            validEffectImg: true,
            mobile: "",
            link: "",
            validPC: true,
            validMobile: true,
            validLink: true,
            target: true
        }],
    }
}
Object.assign(iconData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    Object.assign(iconData, cloneDeep(props.data.content));
    Object.assign(iconSetting, cloneDeep(props.data.content))
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(iconData, cloneDeep(props.data.content));
        Object.assign(iconSetting, cloneDeep(props.data.content));
        if (iconData.icons.length) {
            iconData.icons.forEach((v, i) => {
                if (v.target == undefined) {
                    v.target = true
                }
            })
            iconSetting.icons.forEach((v, i) => {
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
    const icon = {
        pc: "",
        effectImg: "",
        validEffectImg: true,
        mobile: "",
        link: "",
        validPC: true,
        validMobile: true,
        validLink: true, target: true
    };
    iconData.icons.push(icon)
};

const removeMenu = (deleteIndex) => {
    if (iconData.icons.length > 1) {
        iconData.icons.splice(deleteIndex, 1);
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = iconData.icons[index];
    var _content = [...iconData.icons.slice(0, index), ...iconData.icons.slice(index + 1)];
    iconData.icons = _content;
    iconData.icons.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < iconData.icons.length - 1) {
        const temp = iconData.icons[index];
        iconData.icons[index] = iconData.icons[index + 1];
        iconData.icons[index + 1] = temp;
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
}

async function validateAll(data) {
    let isValid = true;
    for (const item of data.icons) {
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
        // if (item.effectCheck) {
        //     if (item.effectImg) {
        //         const pcImageValid = await CheckImage(item.effectImg);
        //         if (!pcImageValid) {
        //             item.validEffectImg = false;
        //             isValid = false;
        //         } else {
        //             const pcImageDimensions = await imageInfo("pc", item.effectImg);
        //             item.effectImgW = pcImageDimensions.width;
        //             item.effectImgH = pcImageDimensions.height;
        //             item.validEffectImg = true;
        //         }
        //     } else {
        //         item.validEffectImg = false;
        //         isValid = false;
        //     }
        // }
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
        "--icon-pc": `url(${item.pc})`,
        "--icon-effectImg": item.effectImg ? `url(${item.effectImg})` : undefined,
        "--icon-mobile": item.mobile ? `url(${item.mobile})` : "",
        "--icon-w": `${item.w}`,
        "--icon-h": `${item.h}`,
        "--icon-mw": item.mw ? `${item.mw}` : "",
        "--icon-mh": item.mh ? `${item.mh}` : "",
        "--icon-effectImg-w": item.effectImgW ? `${item.effectImgW}` : "",
        "--icon-effectImg-h": item.effectImgH ? `${item.effectImgH}` : "",
    };

    return {
        ...cssProps,
    };
}

const onSubmit = async () => {
    loadingShow()
    const isIconDataValid = await validateAll(iconData);
    if (isIconDataValid) {
        let data = cloneDeep(iconData);
        store.updateCpt(props.data.uid, data, props.sub);
        Object.assign(iconSetting, data);
        GetPageType(store.otp)
    }
    loadingHide()

}

const onReset = () => {
    Object.assign(iconData, initData());
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
        Object.assign(iconData, cloneDeep(props.data.content));
    } else {
        Object.assign(iconData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-icon">
        <div class="g-icon-container">
            <template v-if="store.status == 'edit'">
                <template v-for="item in iconSetting.icons">
                    <a href="javascript:;" class="g-icon-item" :data-init="data.init">
                        <span class="g-icon-item1" :style="transformNavsToCSSProps(item)"></span>
                        <span class="g-icon-item2" v-if="item.effectImg"></span>
                    </a>
                </template>
            </template>
            <template v-else>
                <template v-for="item in iconSetting.icons">
                    <a :href="item.link ? item.link : 'javascript:;'"
                       :target="[item.link ? item.target == true || item.target == 'true' ? '_blank' : '' : '']"
                       class="g-icon-item"
                       :data-init="data.init">
                        <span class="g-icon-item1" :style="transformNavsToCSSProps(item)"></span>
                        <span class="g-icon-item2" v-if="item.effectImg"></span>
                    </a>
                </template>
            </template>
            <g-modify :uid="data.uid" :sub="sub" :move=false v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">ICON區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Icon${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <template v-for="(item, index) in iconData.icons">
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
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>