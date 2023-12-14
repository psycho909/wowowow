<script>
export default {
    name: "GWatermark",
    label: "浮水印物件",
    limit: 1,
    order: 5, type: [1]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GCkedit from '../elements/GCkedit.vue';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GSwiper from '../elements/GSwiper2.vue';
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let watermarkData = reactive({});
let watermarkSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
let slideUpdate = ref(false);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        validPC: true,
        validMobile: true,
        validEffectImg: true,
        position: "left-top",
        pc: "",
        mobile: "",
        effectCheck: false,
        effectImg: "",
        mobileShow: false,
        type: "",
        target: {
            link: "",
            attribute: true, validUrl: true,
        },
        pop: {
            show: false,
            type: "text",
            align: "left",
            style: "",
            validStyle: true,
            slides: [{
                pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
            }],
            img: "",
            validImg: true,
            closeCheckRedirect: false,
            closeRedirect: "",
            validRedirect: true,
            num: 1,
            control: 'all',
            autoplay: {
                open: false,
                delay: 2,
                validDelay: true
            }
        }

    }
}
Object.assign(watermarkData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(watermarkData, cloneDeep(props.data.content));
            Object.assign(watermarkSetting, cloneDeep(props.data.content));
        }
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;
    }

})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(watermarkData, cloneDeep(props.data.content));
        Object.assign(watermarkSetting, cloneDeep(props.data.content));
        if ($addComponent) {
            $addComponent("GWatermark");
        }
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const addInsertMenu = (slideIndex) => {
    const newSlide = {
        pc: "", mobile: "", open: false, url: "", attribute: false,
        validPC: true, validMobile: true, validUrl: true
    };

    watermarkData.pop.slides.push(newSlide)
};

const removeMenu = (deleteIndex) => {
    watermarkData.pop.slides.splice(deleteIndex, 1);
}

const onUp = (slideIndex) => {
    if (slideIndex > 0) {
        const slides = watermarkData.pop.slides;
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex - 1];
        slides[slideIndex - 1] = currentSlide;
    }
}

const onDown = (slideIndex) => {
    const slides = watermarkData.pop.slides;

    if (slideIndex < slides.length - 1) {
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex + 1];
        slides[slideIndex + 1] = currentSlide;
    }
}

const openPop = (data) => {
    data.pop.show = true
}

async function validateWatermarkData(data) {
    let isValid = true;

    if (data.pc.trim() === "") {
        data.validPC = false;
        isValid = false;
    } else {
        data.validPC = await CheckImage(data.pc);
        if (!data.validPC) {
            isValid = false;
        }
    }

    if (data.effectCheck && data.effectImg.trim() === "") {
        data.validEffectImg = false;
        isValid = false;
    } else if (data.effectCheck) {
        data.validEffectImg = await CheckImage(data.effectImg);
        if (!data.validEffectImg) {
            isValid = false;
        }
    }

    if (data.mobileShow && data.mobile.trim() === "") {
        data.validMobile = false;
        isValid = false;
    } else if (data.mobileShow) {
        data.validMobile = await CheckImage(data.mobile);
        if (!data.validMobile) {
            isValid = false;
        }
    }

    if (data.type === "link" && data.target.link.trim() === "") {
        data.target.validUrl = false;
        isValid = false;
    } else {
        data.target.validUrl = true;
    }

    if (data.type === "pop" && data.pop.closeCheckRedirect && data.pop.closeRedirect.trim() === "") {
        data.pop.validRedirect = false;
        isValid = false;
    } else {
        data.pop.validRedirect = true;
    }

    if (data.type === "pop" && data.pop.style.trim() === "") {
        data.pop.validStyle = false;
        isValid = false;
    } else {
        data.pop.validStyle = true;
    }

    if (data.type === "pop" && data.pop.type === "img") {
        if (data.pop.img.trim() === "") {
            data.pop.validImg = false;
            isValid = false;
        } else {
            data.pop.validImg = await CheckImage(data.pop.img);
            if (!data.pop.validImg) {
                isValid = false;
            }
        }
    }

    if (data.type === "pop" && data.pop.type === "slide") {
        for (const slide of data.pop.slides) {
            if (slide.pc.trim() === "") {
                slide.validPC = false;
                isValid = false;
            } else {
                slide.validPC = await CheckImage(slide.pc);
                if (!slide.validPC) {
                    isValid = false;
                }
            }

            if (slide.mobile.trim() !== "") {
                slide.validMobile = await CheckImage(slide.mobile);
                if (!slide.validMobile) {
                    isValid = false;
                }
            }
        }
    }

    return isValid;
}

const onSubmit = async () => {
    loadingShow()
    let isValidData = await validateWatermarkData(watermarkData);
    if (isValidData) {
        $("#loadingProgress").show();
        let data = cloneDeep(watermarkData);
        store.updateCpt(props.data.uid, data);
        Object.assign(watermarkSetting, data);
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;
    } else {
        loadingHide()
    }
}

const onReset = () => {
    Object.assign(watermarkData, initData());
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
        Object.assign(watermarkData, cloneDeep(props.data.content));
    } else {
        Object.assign(watermarkData, initData());
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
    <div class="g-watermark" :style="[colors[watermarkSetting.style]]" :data-position="watermarkSetting.position"
         :data-type="watermarkSetting.type">
        <template v-if="store.status == 'edit'">
            <div class="g-watermark__box edit" :class="[watermarkSetting.type ? '' : 'none']">
                <div class="g-watermark__img-box">
                    <picture>
                        <source media="(max-width:768px)" :srcset="watermarkSetting.mobile || watermarkSetting.pc" />
                        <img class="g-watermark__img" :srcset="watermarkSetting.pc" :src="watermarkSetting.pc" alt="" />
                    </picture>
                </div>
            </div>
        </template>
        <template v-if="store.status != 'edit'">
            <template v-if="watermarkSetting.type == ''">
                <div class="g-watermark__box none"
                     :class="[watermarkSetting.mobileShow === true || watermarkSetting.mobileShow === 'true' ? 'mobileShow' : '']">
                    <div class="g-watermark__img-box" :class="[watermarkSetting.effectCheck == 'true' ? 'effectImg' : '']">
                        <picture>
                            <source media="(max-width:768px)" :srcset="watermarkSetting.mobile" />
                            <img :srcset="watermarkSetting.pc" :src="watermarkSetting.pc" alt="" />
                        </picture>
                        <template v-if="watermarkSetting.effectCheck == 'true'">
                            <img :src="watermarkSetting.effectImg" alt="" class="g-watermark__effectImg">
                        </template>
                    </div>
                </div>
            </template>
            <template v-if="watermarkSetting.type == 'link'">
                <a :href="[watermarkSetting.target.link ? watermarkSetting.target.link : 'javascript:;']"
                   :target="[watermarkSetting.target.attribute == true ? '_blank' : '_self']" class="g-watermark__box"
                   :class="[watermarkSetting.mobileShow === true || watermarkSetting.mobileShow === 'true' ? 'mobileShow' : '']">
                    <div class="g-watermark__img-box" :class="[watermarkSetting.effectCheck == 'true' ? 'effectImg' : '']">
                        <picture>
                            <source media="(max-width:768px)" :srcset="watermarkSetting.mobile || watermarkSetting.pc" />
                            <img class="g-watermark__img" :srcset="watermarkSetting.pc" :src="watermarkSetting.pc" alt="" />
                        </picture>
                        <template v-if="watermarkSetting.effectCheck == 'true'">
                            <img :src="watermarkSetting.effectImg" alt="" class="g-watermark__effectImg">
                        </template>
                    </div>
                </a>
            </template>
            <template v-if="watermarkSetting.type == 'pop'">
                <div class="g-watermark__box"
                     :class="[store.status == 'edit' ? 'edit' : '', watermarkSetting.mobileShow === true || watermarkSetting.mobileShow === 'true' ? 'mobileShow' : '']"
                     @click="openPop(watermarkSetting)">
                    <div class="g-watermark__img-box"
                         :class="[watermarkSetting.effectCheck == 'true' ? 'effectImg' : '']">
                        <picture>
                            <source media="(max-width:768px)" :srcset="watermarkSetting.mobile || watermarkSetting.pc" />
                            <img class="g-watermark__img" :srcset="watermarkSetting.pc" :src="watermarkSetting.pc" alt="" />
                        </picture>
                        <template v-if="watermarkSetting.effectCheck == 'true'">
                            <img :src="watermarkSetting.effectImg" alt="" class="g-watermark__effectImg"
                                 v-if="store.status != 'edit'">
                        </template>
                    </div>

                    <g-lightbox v-model:showLightbox="watermarkSetting.pop.show" :style="colors[watermarkSetting.pop.style]"
                                :class="[watermarkSetting.pop.align, watermarkSetting.pop.type == 'slide' ? 'pop-slide' : '']">
                        <template #lightbox-close v-if="watermarkSetting.pop.closeCheckRedirect == 'true'">
                            <a href="javascript:;" class="g-lightbox__close icon-close"
                               @click="closePop(watermarkSetting, watermarkSetting.pop.closeRedirect)"></a>
                        </template>
                        <template #lightbox-title v-if="watermarkSetting.pop.type != 'slide'">{{ watermarkSetting.pop.title
                        }}</template>
                        <template #lightbox-content>
                            <template v-if="watermarkSetting.pop.type != 'slide'">
                                <div class="g-lightbox__text" v-if="watermarkSetting.pop.text"
                                     v-html="watermarkSetting.pop.text"></div>
                                <div class="g-lightbox__img" v-if="watermarkSetting.pop.img">
                                    <img :src="watermarkSetting.pop.img" alt="">
                                </div>
                            </template>
                            <template v-else>
                                <g-swiper :data="watermarkSetting.pop" :status="status" v-if="!slideUpdate" />
                            </template>
                        </template>
                    </g-lightbox>
                </div>
            </template>
        </template>
        <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮水印物件
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">位置:</div>
                    <g-radio label="左上" name="position" value="left-top" v-model="watermarkData.position" />
                    <g-radio label="右上" name="position" value="right-top" v-model="watermarkData.position" />
                    <g-radio label="左中" name="position" value="left-middle" v-model="watermarkData.position" />
                    <g-radio label="右中" name="position" value="right-middle" v-model="watermarkData.position" />
                    <g-radio label="左下" name="position" value="left-bottom" v-model="watermarkData.position" />
                    <g-radio label="右下" name="position" value="right-bottom" v-model="watermarkData.position" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <g-input label="圖片:" v-model.trim="watermarkData.pc" :preview="watermarkData.pc" :required="true"
                                 :valid="watermarkData.validPC" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label">圖片特效:</div>
                        <g-radio label="無" name="effect" :value="false" v-model="watermarkData.effectCheck" />
                        <g-radio label="換圖" name="effect" :value="true" v-model="watermarkData.effectCheck" />
                    </div>
                    <div class="g-edit__col" v-if="watermarkData.effectCheck == 'true'">
                        <g-input label="更換圖片網址:" v-model.trim="watermarkData.effectImg" :preview="watermarkData.effectImg"
                                 :required="true"
                                 :valid="watermarkData.validEffectImg" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label">是否顯示於手機版:</div>
                    <g-radio label="是" name="mobileShow" :value="true" v-model="watermarkData.mobileShow" />
                    <g-radio label="否" name="mobileShow" :value="false" v-model="watermarkData.mobileShow" />
                </div>
                <template v-if="watermarkData.mobileShow == 'true'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-input label="手機版圖片:" v-model.trim="watermarkData.mobile" :preview="watermarkData.mobile"
                                     :required="true"
                                     :valid="watermarkData.validMobile" />
                        </div>
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="input-group__label required">開啟方式:</div>
                    <g-radio label="無" name="type" value="" v-model="watermarkData.type" />
                    <g-radio label="POP視窗" name="type" value="pop" v-model="watermarkData.type" />
                    <g-radio label="連結跳轉" name="type" value="link" v-model="watermarkData.type" />
                </div>
                <template v-if="watermarkData.type == 'pop'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <div class="input-group__label required">POP內容:</div>
                            <g-radio label="純文字" name="popType" value="text" v-model="watermarkData.pop.type" />
                            <g-radio label="圖片" name="popType" value="img" v-model="watermarkData.pop.type" />
                            <g-radio label="POP SLIDE" name="popType" value="slide"
                                     v-model="watermarkData.pop.type" />
                        </div>
                        <template v-if="watermarkData.pop.type == 'text'">
                            <div class="g-edit__col">
                                <g-input label="POP標題:" v-model="watermarkData.pop.title" />
                            </div>
                            <div class="g-edit__row">
                                <div class="input-group__label required">對齊方向:</div>
                                <g-radio label="左" name="align" value="left" v-model="watermarkData.pop.align" />
                                <g-radio label="中" name="align" value="center"
                                         v-model="watermarkData.pop.align" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="watermarkData.pop.validStyle"
                                          v-model="watermarkData.pop.style" />
                            </div>
                            <div class="g-edit__col">
                                <g-ckedit v-model="watermarkData.pop.text" />
                            </div>
                        </template>
                        <template v-if="watermarkData.pop.type == 'img'">
                            <div class="g-edit__col">
                                <g-input label="POP圖片網址:" v-model.trim="watermarkData.pop.img"
                                         :preview="watermarkData.pop.img"
                                         :valid="watermarkData.pop.validImg"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="watermarkData.pop.validStyle"
                                          v-model="watermarkData.pop.style" />
                            </div>
                        </template>
                        <template v-if="watermarkData.pop.type == 'slide'">
                            <div class="g-edit__row">
                                <div class="g-edit__col">
                                    <div class="input-group__label required">自動輪播:</div>
                                    <g-radio label="開啟" name="autoplay" :value="true"
                                             v-model="watermarkData.pop.autoplay.open" />
                                    <g-radio label="關閉" name="autoplay" :value="false"
                                             v-model="watermarkData.pop.autoplay.open" />
                                </div>
                                <div class="g-edit__col" v-if="watermarkData.pop.autoplay.open == 'true'">
                                    <g-input label="秒數:" v-model="watermarkData.pop.autoplay.delay"
                                             :valid="watermarkData.pop.autoplay.validDelay"
                                             :required="true" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">輪播切換方式:</div>
                                    <g-radio label="左右箭頭" name="control" value="navigation"
                                             v-model="watermarkData.pop.control" />
                                    <g-radio label="下方點點" name="control" value="pagination"
                                             v-model="watermarkData.pop.control" />
                                    <g-radio label="都不顯示" name="control" value="no"
                                             v-model="watermarkData.pop.control" />
                                    <g-radio label="都要顯示" name="control" value="all"
                                             v-model="watermarkData.pop.control" />
                                </div>
                            </div>
                            <div class="g-edit__row" v-for="(slide, slideIndex) in watermarkData.pop.slides">
                                <div class="g-edit__col">
                                    <div class="g-edit__group">
                                        <a href="javascript:;" class="icon icon-add"
                                           @click="addInsertMenu(slideIndex)"></a>
                                        <a href="javascript:;" class="icon icon-remove"
                                           @click="removeMenu(slideIndex)"></a>
                                        <a href="javascript:;" class="icon icon-up" @click="onUp(slideIndex)">up</a>
                                        <a href="javascript:;" class="icon icon-down"
                                           @click="onDown(slideIndex)">down</a>
                                    </div>
                                    <div class="g-edit__group">
                                        <div class="g-edit__col">
                                            <g-input label="圖片網址:" v-model.trim="slide.pc" :valid="slide.validPC"
                                                     :preview="slide.pc"
                                                     :required="true" />
                                        </div>
                                        <div class="g-edit__col">
                                            <g-input label="手機版圖片網址" v-model.trim="slide.mobile" :preview="slide.mobile"
                                                     :valid="slide.validMobile" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <div class="g-edit__col">
                            <div class="input-group__label required">POP視窗關閉是否跳轉:</div>
                            <g-radio label="是" name="redirect" :value="true"
                                     v-model="watermarkData.pop.closeCheckRedirect" />
                            <g-radio label="否" name="redirect" :value="false"
                                     v-model="watermarkData.pop.closeCheckRedirect" />
                        </div>
                        <div class="g-edit__col" v-if="watermarkData.pop.closeCheckRedirect == 'true'">
                            <g-input label="跳轉連結:" v-model.trim="watermarkData.pop.closeRedirect" :required="true"
                                     :valid="watermarkData.pop.validRedirect" />
                        </div>
                    </div>
                </template>
                <template v-if="watermarkData.type == 'link'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-input label="連結:" :required="true" v-model.trim="watermarkData.target.link"
                                     :valid="watermarkData.target.validUrl" />
                        </div>
                        <div class="g-edit__col">
                            <div class="input-group__label">另開視窗:</div>
                            <g-radio label="是" name="attribute" :value="true"
                                     v-model="watermarkData.target.attribute" />
                            <g-radio label="否" name="attribute" :value="false"
                                     v-model="watermarkData.target.attribute" />
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