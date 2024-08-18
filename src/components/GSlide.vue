<script>
export default {
    name: "GSlide",
    label: "輪播-純圖片",
    order: [4, 4],
    type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GCkedit from '../elements/GCkedit.vue';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GSwiper from '../elements/GSwiper.vue';
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let slideSetting = reactive({});
let slideUpdate = ref(false);
let loading = ref(true);
let slideData = reactive({})
let slideNumValid = ref(true);
let styleValid = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        group: true,
        control: 'all',
        num: 1, mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0, autoplay: {
            open: false,
            delay: 3,
            validDelay: true
        },
        slides: [{
            pc: "", mobile: "", type: "", url: "", attribute: false, validPC: true, validMobile: true, validUrl: true,
            card: {
                title: "",
                text: "",
                style: "",
                url: ""
            },
            pop: {
                show: false, type: "text",
                align: "left",
                style: "",
                styleValid: true,
                text: "",
                validText: true,
                title: "",
                validTitle: true,
                img: "",
                validImg: true,
                slides: [{
                    pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                }],
                closeCheckRedirect: false,
                closeRedirect: "",
                validCloseRedirect: true,
                num: 1,
                control: 'all',
                thumb: true,
                autoplay: {
                    open: false,
                    delay: 2,
                    validDelay: true
                },
            },
            target: {
                link: "",
                attribute: true, validUrl: true,
            },
            effectCheck: false,
            effectImg: "", validEffectImg: true
        }],
    }
};
Object.assign(slideData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(slideData, cloneDeep(props.data.content));
            Object.assign(slideSetting, cloneDeep(props.data.content));
            slideData.slides.forEach((slide, index) => {
                if (!slide.card) {
                    slide.card = {
                        title: "",
                        text: "",
                        style: "",
                        url: ""
                    }
                }
                if (!slide.pop) {
                    slide.pop = {
                        show: false, type: "text",
                        align: "left",
                        style: "",
                        styleValid: true,
                        text: "",
                        validText: true,
                        title: "",
                        validTitle: true,
                        img: "",
                        validImg: true,
                        slides: [{
                            pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                        }],
                        closeCheckRedirect: false,
                        closeRedirect: "",
                        validCloseRedirect: true,
                        num: 1,
                        control: 'all',
                        thumb: true,
                        autoplay: {
                            open: false,
                            delay: 2,
                            validDelay: true
                        }
                    }
                }
                if (!slide.effectCheck) {
                    slide.effectCheck = false;
                    slide.effectImg = "";
                    slide.validEffectImg = true;
                }
            })
            slideSetting.slides.forEach((slide, index) => {
                if (!slide.card) {
                    slide.card = {
                        title: "",
                        text: "",
                        style: "",
                        url: ""
                    }
                }
                if (!slide.pop) {
                    slide.pop = {
                        show: false, type: "text",
                        align: "left",
                        style: "",
                        styleValid: true,
                        text: "",
                        validText: true,
                        title: "",
                        validTitle: true,
                        img: "",
                        validImg: true,
                        slides: [{
                            pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                        }],
                        closeCheckRedirect: false,
                        closeRedirect: "",
                        validCloseRedirect: true,
                        num: 1,
                        control: 'all',
                        thumb: true,
                        autoplay: {
                            open: false,
                            delay: 2,
                            validDelay: true
                        }
                    }
                }
                if (!slide.effectCheck) {
                    slide.effectCheck = false;
                    slide.effectImg = "";
                    slide.validEffectImg = true;
                }
            })
            imgLoading(slideData.slides);
        }
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;
    }
})
onMounted(async () => {
    await nextTick();
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(slideData, cloneDeep(props.data.content));
        Object.assign(slideSetting, cloneDeep(props.data.content));
        slideData.slides.forEach((slide, index) => {
            if (!slide.card) {
                slide.card = {
                    title: "",
                    text: "",
                    style: "",
                    url: ""
                }
            }
            if (!slide.pop) {
                slide.pop = {
                    show: false, type: "text",
                    align: "left",
                    style: "",
                    styleValid: true,
                    text: "",
                    validText: true,
                    title: "",
                    validTitle: true,
                    img: "",
                    validImg: true,
                    slides: [{
                        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                    }],
                    closeCheckRedirect: false,
                    closeRedirect: "",
                    validCloseRedirect: true,
                    num: 1,
                    control: 'all',
                    thumb: true,
                    autoplay: {
                        open: false,
                        delay: 2,
                        validDelay: true
                    }
                }
            }
            if (!slide.effectCheck) {
                slide.effectCheck = false;
                slide.effectImg = "";
                slide.validEffectImg = true;
            }
        })
        slideSetting.slides.forEach((slide, index) => {
            if (!slide.card) {
                slide.card = {
                    title: "",
                    text: "",
                    style: "",
                    url: ""
                }
            }
            if (!slide.pop) {
                slide.pop = {
                    show: false, type: "text",
                    align: "left",
                    style: "",
                    styleValid: true,
                    text: "",
                    validText: true,
                    title: "",
                    validTitle: true,
                    img: "",
                    validImg: true,
                    slides: [{
                        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                    }],
                    closeCheckRedirect: false,
                    closeRedirect: "",
                    validCloseRedirect: true,
                    num: 1,
                    control: 'all',
                    thumb: true,
                    autoplay: {
                        open: false,
                        delay: 2,
                        validDelay: true
                    }
                }
            }
            if (!slide.effectCheck) {
                slide.effectCheck = false;
                slide.effectImg = "";
                slide.validEffectImg = true;
            }
        })
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
            if ($addComponent) {
                $addComponent();
            }
        })
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

const addInsertMenu = (index) => {
    if (index == slideData.slides.length) {
        slideData.slides.push({
            pc: "", mobile: "", type: "", url: "", attribute: false, validPC: true, validMobile: true, validUrl: true,
            card: {
                title: "",
                text: "",
                style: "",
                url: ""
            },
            pop: {
                show: false, type: "text",
                align: "left",
                style: "",
                styleValid: true,
                text: "",
                validText: true,
                title: "",
                validTitle: true,
                img: "",
                validImg: true,
                slides: [{
                    pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                }],
                closeCheckRedirect: false,
                closeRedirect: "",
                validCloseRedirect: true,
                num: 1,
                control: 'all',
                thumb: true,
                autoplay: {
                    open: false,
                    delay: 2,
                    validDelay: true
                },
            },
            target: {
                link: "",
                attribute: true, validUrl: true,
            },
            effectCheck: false,
            effectImg: "", validEffectImg: true

        })
        if (slideData.num > slideData.slides.length) {
            slideData.num = slideData.slides.length;
        }
        return;
    }
    slideData.slides = [...slideData.slides.slice(0, index + 1), {
        pc: "", mobile: "", type: "", url: "", attribute: false, validPC: true, validMobile: true, validUrl: true,
        card: {
            title: "",
            text: "",
            style: "",
            url: ""
        },
        pop: {
            show: false, type: "text",
            align: "left",
            style: "",
            styleValid: true,
            text: "",
            validText: true,
            title: "",
            validTitle: true,
            img: "",
            validImg: true,
            slides: [{
                pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
            }],
            closeCheckRedirect: false,
            closeRedirect: "",
            validCloseRedirect: true,
            num: 1,
            control: 'all',
            autoplay: {
                open: false,
                delay: 2,
                validDelay: true
            },
        },
        target: {
            link: "",
            attribute: true, validUrl: true,
        },
        effectCheck: false,
        effectImg: "", validEffectImg: true

    }, ...slideData.slides.slice(index + 1)];
    if (slideData.num > slideData.slides.length) {
        slideData.num = slideData.slides.length;
    }
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        slideData.slides = slideData.slides.slice(0, slideData.slides.length - 1)
    } else {
        slideData.slides = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)]
    }
    if (slideData.num > slideData.slides.length) {
        slideData.num = slideData.slides.length;
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = slideData.slides[index];
    var _content = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)];
    slideData.slides = _content;
    slideData.slides.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index + 1 >= slideData.slides.length) {
        return;
    }
    var _temp = slideData.slides[index];
    var _content = [...slideData.slides.slice(0, index), ...slideData.slides.slice(index + 1)];
    slideData.slides = _content;
    slideData.slides.splice(index + 1, 0, _temp);
}

// pop slide使用
const addInsertMenu2 = (imgIndex, slideIndex) => {
    const newSlide = {
        pc: "", mobile: "", open: false, url: "", attribute: false,
        validPC: true, validMobile: true, validUrl: true
    };

    slideData.slides[imgIndex].pop.slides.push(newSlide)
};

const removeMenu2 = (imgIndex, deleteIndex) => {
    if (slideData.slides[imgIndex].pop.slides.length > 1) {
        slideData.slides[imgIndex].pop.slides.splice(deleteIndex, 1);
    }

}

const onUp2 = (imgIndex, slideIndex) => {
    if (slideIndex > 0) {
        const slides = slideData.slides[imgIndex].pop.slides;
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex - 1];
        slides[slideIndex - 1] = currentSlide;
    }
}

const onDown2 = (imgIndex, slideIndex) => {
    const slides = slideData.slides[imgIndex].pop.slides;

    if (slideIndex < slides.length - 1) {
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex + 1];
        slides[slideIndex + 1] = currentSlide;
    }
}

const validateImages = async (slideData) => {
    for (const img of slideData.slides) {
        if (img.pop.type === 'text') {
            if (img.pop.title !== "") {
                img.pop.validTitle = true;
            } else {
                img.pop.validTitle = false;
            }
        } else if (img.pop.type === 'img') {
            if (img.pop.img !== "" && (await CheckImage(img.pop.img))) {
                img.pop.validImg = true;
            } else {
                img.pop.validImg = false;
            }
        } else if (img.pop.type === 'slide') {
            img.pop.validPC = true;
            img.pop.validMobile = true;

            for (const slide of img.pop.slides) {
                if (slide.pc !== "" && (await CheckImage(slide.pc))) {
                    slide.validPC = true;
                } else {
                    slide.validPC = false;
                }

                if (slide.mobile !== "") {
                    if (await CheckImage(slide.mobile)) {
                        slide.validMobile = true;
                    } else {
                        slide.validMobile = false;
                    }
                } else {
                    slide.validMobile = true;
                }
            }
            if (img.pop.closeCheckRedirect && CheckUrl(img.pop.closeRedirect)) {
                img.pop.validCloseRedirect = true;
            } else {
                img.pop.validCloseRedirect = false;
            }

            img.pop.validPC = img.pop.slides.every((slide) => slide.validPC);
            img.pop.validMobile = img.pop.slides.every((slide) => slide.validMobile);
        }
        if (img.pop.closeCheckRedirect) {
            if (CheckUrl(img.pop.closeRedirect)) {
                img.pop.validCloseRedirect = true;
            } else {
                img.pop.validCloseRedirect = false;
            }
        } else {
            img.pop.validCloseRedirect = true;
        }
    }

    return slideData.slides.every((img) => {
        if (img.type !== 'pop') return true;
        if (img.pop.type === 'text') {
            return img.pop.validTitle && img.pop.validCloseRedirect;
        } else if (img.pop.type === 'img') {
            return img.pop.validImg && img.pop.validCloseRedirect;
        } else if (img.pop.type === 'slide') {
            return img.pop.validPC && img.pop.validMobile && img.pop.validCloseRedirect;
        }
    });
};

const onSubmit = async () => {
    loadingShow();
    let data = {}
    var validDelay;
    slideData.validMt = true;
    slideData.validMb = true;
    slideData.validMmt = true;
    slideData.validMmb = true;
    if (slideData.mt < 0) {
        slideData.validMt = false;
    }
    if (slideData.mb < 0) {
        slideData.validMb = false;
    }
    if (slideData.mobile_mt < 0) {
        slideData.validMmt = false;
    }
    if (slideData.mobile_mb < 0) {
        slideData.validMmb = false;
    }
    for (let i = 0; i < slideData.slides.length; i++) {
        if (slideData.slides[i].pc.length == 0) {
            slideData.slides[i].validPC = false;
        } else {
            if (!await CheckImage(slideData.slides[i].pc)) {
                slideData.slides[i].validPC = false;
            } else {
                slideData.slides[i].validPC = true;
            }
        }

        if (slideData.slides[i].mobile.length > 0) {
            if (!await CheckImage(slideData.slides[i].mobile)) {
                slideData.slides[i].validMobile = false;
            } else {
                slideData.slides[i].validMobile = true;
            }
        } else {
            slideData.slides[i].validMobile = true;
        }

        if (slideData.slides[i].url.length > 0) {
            if (!CheckUrl(slideData.slides[i].url)) {
                slideData.slides[i].validUrl = false;
            } else {
                slideData.slides[i].validUrl = true;
            }
        } else {
            slideData.slides[i].validUrl = true;
        }

        if (slideData.slides[i].effectCheck == true || slideData.slides[i].effectCheck == "true") {
            if (!await CheckImage(slideData.slides[i].effectImg)) {
                slideData.slides[i].validEffectImg = false;
            } else {
                slideData.slides[i].validEffectImg = true;
            }
        } else {
            slideData.slides[i].validEffectImg = true;
        }
        if (slideData.slides[i].pop.style == "") {
            slideData.slides[i].pop.styleValid = false;
        } else {
            slideData.slides[i].pop.styleValid = true;
        }
    }

    if (slideData.autoplay.open) {
        if (isNaN(Number(slideData.autoplay.delay))) {
            slideData.autoplay.validDelay = false;
            validDelay = false;
        } else {
            slideData.autoplay.validDelay = true;
            validDelay = true;
        }
    } else {
        validDelay = true;
    }
    const isDataValid = await validateImages(slideData);

    var validCheck = slideData.slides.every(function (v, i) {
        return v.validPC == true && v.validMobile == true && v.validUrl == true && v.validEffectImg == true;
    })
    if (slideData.slides.length >= Number(slideData.num)) {
        slideNumValid.value = true;
    } else {
        slideNumValid.value = false;
    }
    if (slideData.validMt && slideData.validMb && slideData.validMmt && slideData.validMmb) {
        if (validCheck && validDelay && slideNumValid.value && isDataValid) {
            $("#loadingProgress").show();
            let data = cloneDeep(slideData);
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(slideSetting, data);
            imgLoading(slideData.slides).then((res) => {
                loading.value = false;
            })
            slideUpdate.value = true;
            await nextTick();
            slideUpdate.value = false;
            GetPageType(store.otp)
        } else {
            loadingHide();
        }
    } else {
        loadingHide();
        return;
    }

}
const onReset = () => {
    Object.assign(slideData, initData());
}
const closeBtn = () => {
    loadingShow()
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        loadingHide()
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(slideData, cloneDeep(props.data.content));
        imgLoading(slideData.slides).then((res) => {
            loading.value = false;
        })
    } else {
        Object.assign(slideData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
    loadingHide()
}

</script>
<template>
    <div class="g-slide" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-slide-container" :data-num="slideSetting.num">
            <template v-if="!loading">
                <g-swiper :data="slideSetting" :status="status" v-if="!slideUpdate" />
            </template>
            <template v-else>
                <div class="g-swiper"></div>
            </template>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">輪播區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Slide${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇輪播數量:</div>
                    <g-radio label="單格輪播" name="item" value="1" v-model="slideData.num" />
                    <g-radio label="雙格輪播" name="item" value="2" v-model="slideData.num" />
                    <g-radio label="三格輪播" name="item" value="3" v-model="slideData.num" />
                    <g-radio label="四格輪播" name="item" value="4" v-model="slideData.num" />
                    <div class="error" v-if="!slideNumValid">放置圖片數量不得小於所選輪播數量</div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">切換方式:</div>
                    <g-radio label="一次換一組" name="group" :value="true" v-model="slideData.group" />
                    <g-radio label="一次換一張" name="group" :value="false" v-model="slideData.group" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label required">自動輪播:</div>
                        <g-radio label="開啟" name="open" :value="true" v-model="slideData.autoplay.open" />
                        <g-radio label="關閉" name="open" :value="false" v-model="slideData.autoplay.open" />
                    </div>
                    <div class="g-edit__col" v-if="slideData.autoplay.open == 'true'">
                        <g-input label="秒數:" v-model="slideData.autoplay.delay" :valid="slideData.autoplay.validDelay"
                                 :required="true" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">輪播切換按鈕:</div>
                    <g-radio label="左右箭頭" name="control" value="navigation" v-model="slideData.control" />
                    <g-radio label="下方點點" name="control" value="pagination" v-model="slideData.control" />
                    <g-radio label="都不顯示" name="control" value="no" v-model="slideData.control" />
                    <g-radio label="都要顯示" name="control" value="all" v-model="slideData.control" />
                </div>
                <div class="g-edit__row" v-for="(slide, index) in slideData.slides">
                    <div class="g-edit__col">
                        <div class="g-edit__group">
                            <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                            <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                            <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                            <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                        </div>
                        <div class="g-edit__group">
                            <div class="g-edit__col">
                                <g-input label="圖片網址:" v-model.trim="slide.pc" :valid="slide.validPC"
                                         :preview="slide.pc"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <g-input label="手機版圖片網址:" v-model.trim="slide.mobile" :preview="slide.mobile" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label">圖片特效:</div>
                                <g-radio label="無" :name="'effect' + index" :value="false"
                                         v-model="slide.effectCheck" />
                                <g-radio label="換圖" :name="'effect' + index" :value="true"
                                         v-model="slide.effectCheck" />
                            </div>
                            <div class="g-edit__col" v-if="slide.effectCheck == 'true'">
                                <g-input label="更換圖片網址:" v-model.trim="slide.effectImg" :preview="slide.effectImg"
                                         :required="true"
                                         :valid="slide.validEffectImg" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label required">開啟方式:</div>
                                <g-radio label="無" :name="'type' + index" value="" v-model="slide.type" />
                                <g-radio label="POP視窗" :name="'type' + index" value="pop" v-model="slide.type" />
                                <g-radio label="連結跳轉" :name="'type' + index" value="link" v-model="slide.type" />
                            </div>
                            <template v-if="slide.type == 'pop'">
                                <div class="g-edit__col">
                                    <div class="input-group__label required">POP內容:</div>
                                    <g-radio label="純文字" :name="'popType' + index" value="text"
                                             v-model="slide.pop.type" />
                                    <g-radio label="圖片" :name="'popType' + index" value="img"
                                             v-model="slide.pop.type" />
                                    <g-radio label="POP SLIDE" :name="'popType' + index" value="slide"
                                             v-model="slide.pop.type" />
                                </div>

                                <template v-if="slide.pop.type == 'text'">
                                    <div class="g-edit__col">
                                        <g-input label="POP標題:" v-model="slide.pop.title"
                                                 :valid="slide.pop.validTitle" />
                                    </div>
                                    <div class="g-edit__row">
                                        <div class="input-group__label required">對齊方向:</div>
                                        <g-radio label="左" :name="'align' + index" value="left"
                                                 v-model="slide.pop.align" />
                                        <g-radio label="中" :name="'align' + index" value="center"
                                                 v-model="slide.pop.align" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-select label="主題顏色" :group="true" :options="[style1, style2]"
                                                  :required="true"
                                                  :valid="slide.pop.styleValid"
                                                  v-model="slide.pop.style" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-ckedit v-model="slide.pop.text" />
                                    </div>
                                </template>
                                <template v-if="slide.pop.type == 'img'">
                                    <div class="g-edit__col">
                                        <g-input label="POP圖片網址:" v-model.trim="slide.pop.img"
                                                 :valid="slide.pop.validImg"
                                                 :preview="slide.pop.img"
                                                 :required="true" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-select label="主題顏色:" :group="true" :options="[style1, style2]"
                                                  :required="true"
                                                  :valid="slide.pop.styleValid"
                                                  v-model="slide.pop.style" />
                                    </div>
                                </template>
                                <template v-if="slide.pop.type == 'slide'">
                                    <div class="g-edit__row">
                                        <div class="g-edit__col">
                                            <g-select label="主題顏色:" :group="true" :options="[style1, style2]"
                                                      :required="true"
                                                      :valid="slide.pop.styleValid"
                                                      v-model="slide.pop.style" />
                                        </div>
                                        <div class="g-edit__col">
                                            <div class="input-group__label required">自動輪播:</div>
                                            <g-radio label="開啟" :name="'popAutoplay' + index" :value="true"
                                                     v-model="slide.pop.autoplay.open" />
                                            <g-radio label="關閉" :name="'popAutoplay' + index" :value="false"
                                                     v-model="slide.pop.autoplay.open" />
                                        </div>
                                        <div class="g-edit__col" v-if="slide.pop.autoplay.open == 'true'">
                                            <g-input label="秒數:" v-model="slide.pop.autoplay.delay"
                                                     :valid="slide.pop.autoplay.validDelay"
                                                     :required="true" />
                                        </div>
                                        <div class="g-edit__col">
                                            <div class="input-group__label required">輪播切換方式:</div>
                                            <g-radio label="左右箭頭" :name="'popControl' + index" value="navigation"
                                                     v-model="slide.pop.control" />
                                            <g-radio label="下方點點(或預覽)" :name="'popControl' + index" value="pagination"
                                                     v-model="slide.pop.control" />
                                            <g-radio label="都不顯示" :name="'popControl' + index" value="no"
                                                     v-model="slide.pop.control" />
                                            <g-radio label="都要顯示" :name="'popControl' + index" value="all"
                                                     v-model="slide.pop.control" />
                                        </div>
                                        <template
                                                  v-if="slide.pop.control == 'pagination' || slide.pop.control == 'all'">
                                            <div class="g-edit__col">
                                                <div class="input-group__label required">點點改為預覽圖:</div>
                                                <g-radio label="是" :name="'thumb' + index" :value="true"
                                                         v-model="slide.pop.thumb" />
                                                <g-radio label="否" :name="'thumb' + index" :value="false"
                                                         v-model="slide.pop.thumb" />
                                            </div>
                                        </template>
                                    </div>
                                    <div class="g-edit__row" v-for="(popSlide, slideIndex) in slide.pop.slides">
                                        <div class="g-edit__col">
                                            <div class="g-edit__group">
                                                <a href="javascript:;" class="icon icon-add"
                                                   @click="addInsertMenu2(index, slideIndex)"></a>
                                                <a href="javascript:;" class="icon icon-remove"
                                                   @click="removeMenu2(index, slideIndex)"></a>
                                                <a href="javascript:;" class="icon icon-up"
                                                   @click="onUp2(index, slideIndex)">up</a>
                                                <a href="javascript:;" class="icon icon-down"
                                                   @click="onDown2(index, slideIndex)">down</a>
                                            </div>
                                            <div class="g-edit__group">
                                                <div class="g-edit__col">
                                                    <g-input label="圖片網址:" v-model.trim="popSlide.pc"
                                                             :valid="popSlide.validPC" :preview="popSlide.pc"
                                                             :required="true" />
                                                </div>
                                                <div class="g-edit__col">
                                                    <g-input label="手機版圖片網址" v-model.trim="popSlide.mobile"
                                                             :preview="popSlide.mobile"
                                                             :valid="popSlide.validMobile" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">POP視窗關閉是否跳轉:</div>
                                    <g-radio label="是" :name="'redirect' + index" :value="true"
                                             v-model="slide.pop.closeCheckRedirect" />
                                    <g-radio label="否" :name="'redirect' + index" :value="false"
                                             v-model="slide.pop.closeCheckRedirect" />
                                </div>
                                <div class="g-edit__col" v-if="slide.pop.closeCheckRedirect == 'true'">
                                    <g-input label="跳轉連結:" v-model.trim="slide.pop.closeRedirect" />
                                </div>
                            </template>
                            <template v-if="slide.type == 'link'">
                                <div class="g-edit__col">
                                    <g-input label="連結" v-model.trim="slide.url" :valid="slide.validUrl" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">另開視窗:</div>
                                    <g-radio label="是" :name="'attribute' + index" :value="true"
                                             v-model="slide.attribute" />
                                    <g-radio label="否" :name="'attribute' + index" :value="false"
                                             v-model="slide.attribute" />
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="slideData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="slideData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="slideData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="slideData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="slideData.mobile_mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="slideData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="slideData.mobile_mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="slideData.validMmb" />
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