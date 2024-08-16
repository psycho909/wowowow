<script>
export default {
    name: "GImg",
    label: "圖片-純圖片",
    order: 5,
    type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GCkedit from '../elements/GCkedit.vue';
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GSwiper from '../elements/GSwiper2.vue';
import { mainStore } from "../store/index";
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let _imgDataLength = ref(1);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let imgData = reactive({});
let imgSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
let slideUpdate = ref(false);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        num: 1,
        imgs: [{
            pc: "",
            mobile: "",
            type: "",
            validPC: true,
            validMobile: true,
            validEffectImg: true,
            effectCheck: false,
            effectImg: "",
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
                    delay: 3,
                    validDelay: true
                }
            },
            target: {
                link: "",
                attribute: true, validUrl: true,
            }
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(imgData, initData());
watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(imgData, cloneDeep(props.data.content));
            Object.assign(imgSetting, cloneDeep(props.data.content));
            imgData.imgs.forEach((img, index) => {
                if (!img.card) {
                    img.card = {
                        title: "",
                        text: "",
                        style: "",
                        url: ""
                    }
                }
                if (!img.pop.autoplay) {
                    img.pop.autoplay = {
                        open: false,
                        delay: 3,
                        validDelay: true
                    }
                }
                if (img.pop.thumb == undefined) {
                    img.pop.thumb = true;
                }
                if (!img.effectCheck) {
                    img.effectCheck = false;
                    img.effectImg = "";
                    img.validEffectImg = true;
                }
            })
            imgSetting.imgs.forEach((img, index) => {
                if (!img.card) {
                    img.card = {
                        title: "",
                        text: "",
                        style: "",
                        url: ""
                    }
                }
                if (!img.pop.autoplay) {
                    img.pop.autoplay = {
                        open: false,
                        delay: 3,
                        validDelay: true
                    }
                }
                if (img.pop.thumb == undefined) {
                    img.pop.thumb = true;
                }
                if (!img.effectCheck) {
                    img.effectCheck = false;
                    img.effectImg = "";
                    img.validEffectImg = true;
                }
            })
            _imgDataLength.value = imgData.num;
            imgLoading(imgData.imgs).then((res) => {
                loading.value = false;
            })
        }
        slideUpdate.value = true;
        await nextTick();
        slideUpdate.value = false;

    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(imgData, cloneDeep(props.data.content));
        Object.assign(imgSetting, cloneDeep(props.data.content));
        imgData.imgs.forEach((img, index) => {
            if (!img.card) {
                img.card = {
                    title: "",
                    text: "",
                    style: "",
                    url: ""
                }
            }
            if (!img.pop.autoplay) {
                img.pop.autoplay = {
                    open: false,
                    delay: 3,
                    validDelay: true
                }
            }
            if (img.pop.thumb == undefined) {
                img.pop.thumb = true;
            }
            if (!img.effectCheck) {
                img.effectCheck = false;
                img.effectImg = "";
                img.validEffectImg = true;
            }
        })
        imgSetting.imgs.forEach((img, index) => {
            if (!img.card) {
                img.card = {
                    title: "",
                    text: "",
                    style: "",
                    url: ""
                }
            }
            if (!img.pop.autoplay) {
                img.pop.autoplay = {
                    open: false,
                    delay: 3,
                    validDelay: true
                }
            }
            if (img.pop.thumb == undefined) {
                img.pop.thumb = true;
            }
            if (!img.effectCheck) {
                img.effectCheck = false;
                img.effectImg = "";
                img.validEffectImg = true;
            }
        })
        _imgDataLength.value = imgData.num;
        imgLoading(imgData.imgs).then((res) => {
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

const addInsertMenu = (imgIndex, slideIndex) => {
    const newSlide = {
        pc: "", mobile: "", open: false, url: "", attribute: false,
        validPC: true, validMobile: true, validUrl: true
    };

    imgData.imgs[imgIndex].pop.slides.push(newSlide)
};

const removeMenu = (imgIndex, deleteIndex) => {
    if (imgData.imgs[imgIndex].pop.slides.length > 1) {
        imgData.imgs[imgIndex].pop.slides.splice(deleteIndex, 1);
    }

}

const onUp = (imgIndex, slideIndex) => {
    if (slideIndex > 0) {
        const slides = imgData.imgs[imgIndex].pop.slides;
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex - 1];
        slides[slideIndex - 1] = currentSlide;
    }
}

const onDown = (imgIndex, slideIndex) => {
    const slides = imgData.imgs[imgIndex].pop.slides;

    if (slideIndex < slides.length - 1) {
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex + 1];
        slides[slideIndex + 1] = currentSlide;
    }
}

const openPop = (data) => {
    data.pop.show = true
}

const onChange = (e) => {
    let num = e.target.value;
    if (_imgDataLength.value <= num) {
        for (let i = 0; i < (num - _imgDataLength.value); i++) {
            imgData.imgs.push({
                pc: "",
                mobile: "",
                type: "",
                validPC: true, validMobile: true, validEffectImg: true,
                effectCheck: false,
                effectImg: "",
                card: {
                    title: "",
                    text: "",
                    style: "",
                    url: ""
                },
                autoplay: {
                    open: false,
                    delay: 2,
                    validDelay: true
                },
                pop: {
                    show: false,
                    type: "text",
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
                    thumb: true
                },
                target: {
                    link: "",
                    attribute: true, validUrl: true,
                }
            })
        }
    } else {
        imgData.imgs = imgData.imgs.slice(0, num)
    }
    _imgDataLength.value = num;
}

const validateImages = async (imgData) => {
    for (const img of imgData.imgs) {
        if (img.pop.type === 'text') {
            if (img.pop.title !== "" && img.pop.title != undefined) {
                img.pop.validTitle = true;
            } else {
                img.pop.validTitle = false;
            }
            if (img.pop.style == "") {
                img.pop.styleValid = false;
            } else {
                img.pop.styleValid = true;
            }
        } else if (img.pop.type === 'img') {
            if (img.pop.img !== "" && (await CheckImage(img.pop.img)) && img.pop.img != undefined) {
                img.pop.validImg = true;
            } else {
                img.pop.validImg = false;
            }
            if (img.pop.style == "") {
                img.pop.styleValid = false;
            } else {
                img.pop.styleValid = true;
            }
        } else if (img.pop.type === 'slide') {
            img.pop.validPC = true;
            img.pop.validMobile = true;
            img.pop.styleValid = true;
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

    return imgData.imgs.every((img) => {
        if (img.type !== 'pop') return true;
        if (img.pop.type === 'text') {
            return img.pop.validTitle && img.pop.validCloseRedirect && img.pop.styleValid;
        } else if (img.pop.type === 'img') {
            return img.pop.validImg && img.pop.validCloseRedirect && img.pop.styleValid;
        } else if (img.pop.type === 'slide') {
            return img.pop.validPC && img.pop.validMobile && img.pop.validCloseRedirect && img.pop.styleValid;
        }
    });
};

const onSubmit = async () => {
    let validPop = false;
    loadingShow();
    imgData.validMt = true;
    imgData.validMb = true;
    imgData.validMmt = true;
    imgData.validMmb = true;
    if (imgData.mt < 0) {
        imgData.validMt = false;
    }
    if (imgData.mb < 0) {
        imgData.validMb = false;
    }
    if (imgData.mobile_mt < 0) {
        imgData.validMmt = false;
    }
    if (imgData.mobile_mb < 0) {
        imgData.validMmb = false;
    }
    for (let i = 0; i < imgData.imgs.length; i++) {
        if (imgData.imgs[i].pc.length == 0) {
            imgData.imgs[i].validPC = false;
        } else {
            if (!await CheckImage(imgData.imgs[i].pc)) {
                imgData.imgs[i].validPC = false;
            } else {
                imgData.imgs[i].validPC = true;
            }
        }

        if (imgData.imgs[i].mobile.length > 0) {
            if (!await CheckImage(imgData.imgs[i].mobile)) {
                imgData.imgs[i].validMobile = false;
            } else {
                imgData.imgs[i].validMobile = true;
            }
        } else {
            imgData.imgs[i].validMobile = true;
        }

        if (imgData.imgs[i].effectCheck == 'true' || imgData.imgs[i].effectCheck == true) {
            if (!await CheckImage(imgData.imgs[i].effectImg)) {
                imgData.imgs[i].validEffectImg = false;
            } else {
                imgData.imgs[i].validEffectImg = true;
            }
        } else {
            imgData.imgs[i].validEffectImg = true;
        }
        if (imgData.imgs[i].type == 'link') {
            if (imgData.imgs[i].target.link.length > 0) {
                if (!CheckUrl(imgData.imgs[i].target.link)) {
                    imgData.imgs[i].target.validUrl = false;
                } else {
                    imgData.imgs[i].target.validUrl = true;
                }
            } else {
                imgData.imgs[i].target.validUrl = false;
            }
        } else {
            imgData.imgs[i].target.validUrl = true;
        }
    }
    const isDataValid = await validateImages(imgData);

    var validCheck = imgData.imgs.every(function (v, i) {
        return v.validPC == true && v.validMobile == true && v.target.validUrl == true && v.validEffectImg == true;
    })
    if (imgData.validMt && imgData.validMb && imgData.validMmt && imgData.validMmb) {
        if (validCheck && isDataValid) {
            $("#loadingProgress").show();
            let data = cloneDeep(imgData);
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(imgSetting, data);
            imgLoading(imgData.imgs).then((res) => {
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
    }

}

const onReset = () => {
    _imgDataLength.value = 1;
    Object.assign(imgData, initData());
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
        Object.assign(imgData, cloneDeep(props.data.content));
        _imgDataLength.value = imgData.num;
        imgLoading(imgData.imgs).then((res) => {
            loading.value = false;
        })
    } else {
        Object.assign(imgData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub, props.sub)
    loadingHide()
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
    <div class="g-img" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-img-container" :data-num="imgSetting.num">
            <template v-if="!loading" v-for="imgs in imgSetting.imgs">
                <template v-if="store.status == 'edit'">
                    <div class="g-img__box edit" :class="[imgs.type ? '' : 'none']">
                        <div class="g-img__img-box">
                            <picture>
                                <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                                <img class="g-img__img" :srcset="imgs.pc" :src="imgs.pc" alt="" />
                            </picture>
                        </div>
                        <template v-if="imgs.card.title !== '' || imgs.card.text !== '' || imgs.card.url !== ''">
                            <div class="g-img__card">
                                <div class="g-img__card-body">
                                    <div class="g-img__card-title" v-if="imgs.card.title !== ''">{{ imgs.card.title }}</div>
                                    <div class="g-img__card-text" v-if="imgs.card.text !== ''" v-html="imgs.card.text">
                                    </div>
                                </div>
                                <a class="g-img__card-link" v-if="imgs.card.url !== ''">馬上點我看詳情</a>
                            </div>
                        </template>
                    </div>
                </template>

                <template v-if="store.status != 'edit'">
                    <template v-if="imgs.type == ''">
                        <div class="g-img__box none">
                            <div class="g-img__img-box"
                                 :class="[imgs.effectCheck == 'true' || imgs.effectCheck == true ? 'effectImg' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="imgs.mobile" />
                                    <img :srcset="imgs.pc" :src="imgs.pc" alt="" />
                                </picture>
                                <template v-if="imgs.effectCheck == 'true' || imgs.effectCheck == true">
                                    <img :src="imgs.effectImg" alt="" class="g-img__effectImg">
                                </template>
                            </div>
                            <template v-if="imgs.card.title !== '' || imgs.card.text !== '' || imgs.card.url !== ''">
                                <div class="g-img__card">
                                    <div class="g-img__card-body">
                                        <div class="g-img__card-title" v-if="imgs.card.title !== ''">{{ imgs.card.title }}
                                        </div>
                                        <div class="g-img__card-text" v-if="imgs.card.text !== ''" v-html="imgs.card.text">
                                        </div>
                                    </div>
                                    <a class="g-img__card-link" :href="imgs.card.url"
                                       v-if="imgs.card.url !== ''">馬上點我看詳情</a>
                                </div>
                            </template>
                        </div>
                    </template>
                    <template v-if="imgs.type == 'link'">
                        <template v-if="imgs.card.url != ''">
                            <div class="g-img__box">
                                <div class="g-img__img-box"
                                     :class="[imgs.effectCheck == 'true' || imgs.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                                        <img class="g-img__img" :srcset="imgs.pc" :src="imgs.pc" alt="" />
                                    </picture>
                                    <template v-if="imgs.effectCheck == 'true' || imgs.effectCheck == true">
                                        <img :src="imgs.effectImg" alt="" class="g-img__effectImg">
                                    </template>
                                </div>
                                <template v-if="imgs.card.title !== '' || imgs.card.text !== '' || imgs.card.url !== ''">
                                    <div class="g-img__card">
                                        <div class="g-img__card-body">
                                            <div class="g-img__card-title" v-if="imgs.card.title !== ''">{{ imgs.card.title
                                            }}
                                            </div>
                                            <div class="g-img__card-text" v-if="imgs.card.text !== ''"
                                                 v-html="imgs.card.text">
                                            </div>
                                        </div>
                                        <a class="g-img__card-link" :href="imgs.card.url"
                                           v-if="imgs.card.url !== ''">馬上點我看詳情</a>
                                    </div>
                                </template>
                            </div>
                        </template>
                        <template v-else>
                            <a :href="[imgs.target.link ? imgs.target.link : 'javascript:;']"
                               :target="[imgs.target.attribute == true || imgs.target.attribute == 'true' ? '_blank' : '_self']"
                               class="g-img__box">
                                <div class="g-img__img-box"
                                     :class="[imgs.effectCheck == 'true' || imgs.effectCheck == true ? 'effectImg' : '']">
                                    <picture>
                                        <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                                        <img class="g-img__img" :srcset="imgs.pc" :src="imgs.pc" alt="" />
                                    </picture>
                                    <template v-if="imgs.effectCheck == 'true' || imgs.effectCheck == true">
                                        <img :src="imgs.effectImg" alt="" class="g-img__effectImg">
                                    </template>
                                </div>
                                <template v-if="imgs.card.title !== '' || imgs.card.text !== '' || imgs.card.url !== ''">
                                    <div class="g-img__card">
                                        <div class="g-img__card-body">
                                            <div class="g-img__card-title" v-if="imgs.card.title !== ''">{{ imgs.card.title
                                            }}
                                            </div>
                                            <div class="g-img__card-text" v-if="imgs.card.text !== ''"
                                                 v-html="imgs.card.text">
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </a>
                        </template>
                    </template>
                    <template v-if="imgs.type == 'pop'">
                        <div class="g-img__box g-img__box-pop"
                             :class="[store.status == 'edit' ? 'edit' : '']"
                             data-type="pop"
                             @click="openPop(imgs)">
                            <div class="g-img__img-box"
                                 :class="[imgs.effectCheck == 'true' || imgs.effectCheck == true ? 'effectImg' : '']">
                                <picture>
                                    <source media="(max-width:768px)" :srcset="imgs.mobile || imgs.pc" />
                                    <img class="g-img__img" :srcset="imgs.pc" :src="imgs.pc" alt="" />
                                </picture>
                                <template v-if="imgs.effectCheck == 'true' || imgs.effectCheck == true">
                                    <img :src="imgs.effectImg" alt="" class="g-img__effectImg"
                                         v-if="store.status != 'edit'">
                                </template>
                            </div>
                            <template v-if="imgs.card.title !== '' || imgs.card.text !== '' || imgs.card.url !== ''">
                                <div class="g-img__card">
                                    <div class="g-img__card-body">
                                        <div class="g-img__card-title" v-if="imgs.card.title !== ''">{{ imgs.card.title }}
                                        </div>
                                        <div class="g-img__card-text" v-if="imgs.card.text !== ''" v-html="imgs.card.text">
                                        </div>
                                    </div>
                                    <a class="g-img__card-link" :href="imgs.card.url"
                                       v-if="imgs.card.url !== ''">馬上點我看詳情</a>
                                </div>
                            </template>
                            <g-lightbox v-model:showLightbox="imgs.pop.show" :style="colors[imgs.pop.style]"
                                        :class="[imgs.pop.align, imgs.pop.type, imgs.pop.type == 'slide' ? 'pop-slide' : '']">
                                <template #lightbox-title v-if="imgs.pop.type != 'slide'">{{ imgs.pop.title }}</template>
                                <template #lightbox-content>
                                    <template v-if="imgs.pop.type != 'slide'">
                                        <div class="g-lightbox__text" v-if="imgs.pop.text"
                                             v-html="imgs.pop.text"></div>
                                        <div class="g-lightbox__img" v-if="imgs.pop.img">
                                            <img :src="imgs.pop.img" alt="">
                                        </div>
                                    </template>
                                    <template v-else>
                                        <g-swiper :data="imgs.pop" :status="status" :pagination="imgs.pop.pagination"
                                                  :type="imgs.pop.type"
                                                  v-if="!slideUpdate" />
                                    </template>
                                </template>
                                <template #lightbox-btn v-if="imgs.pop.closeCheckRedirect == 'true'">
                                    <a href="javascript:;" class="g-lightbox__btn"
                                       @click="closePop(imgs, imgs.pop.closeRedirect)">確定</a>
                                </template>
                                <template #lightbox-close
                                          v-if="imgs.pop.closeCheckRedirect == 'true' || imgs.pop.closeCheckRedirect === true">
                                    <a href="javascript:;" class="g-lightbox__close icon-close"
                                       @click="closePop(imgs, imgs.pop.closeRedirect)">確定</a>
                                </template>
                            </g-lightbox>
                        </div>
                    </template>
                </template>
            </template>
            <template v-else>
                <div class="g-img__box"></div>
            </template>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">圖片區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">圖片樣式:</div>
                    <g-radio label="單一圖片" name="img" value="1" v-model="imgData.num" @change="onChange" />
                    <g-radio label="兩格圖片" name="img" value="2" v-model="imgData.num" @change="onChange" />
                    <g-radio label="三格圖片" name="img" value="3" v-model="imgData.num" @change="onChange" />
                    <g-radio label="四格圖片" name="img" value="4" v-model="imgData.num" @change="onChange" />
                </div>
                <div class="g-edit__row g-edit__block" v-for="(img, index) in imgData.imgs">
                    <div class="g-edit__col">
                        <g-input label="圖片網址:" v-model.trim="img.pc" :preview="img.pc" :required="true"
                                 :valid="img.validPC" />
                    </div>
                    <div class="g-edit__col">
                        <g-input label="手機版圖片網址:" v-model.trim="img.mobile" :preview="img.mobile"
                                 :valid="img.validMobile" />
                    </div>
                    <div class="g-edit__col">
                        <div class="input-group__label">圖片特效:</div>
                        <g-radio label="無" :name="'effect' + index" :value="false" v-model="img.effectCheck" />
                        <g-radio label="換圖" :name="'effect' + index" :value="true" v-model="img.effectCheck" />
                    </div>
                    <div class="g-edit__col" v-if="img.effectCheck == 'true'">
                        <g-input label="更換圖片網址:" v-model.trim="img.effectImg" :preview="img.effectImg" :required="true"
                                 :valid="img.validEffectImg" />
                    </div>
                    <div class="g-edit__col">
                        <div class="input-group__label required">開啟方式:</div>
                        <g-radio label="無" :name="'type' + index" value="" v-model="img.type" />
                        <g-radio label="POP視窗" :name="'type' + index" value="pop" v-model="img.type" />
                        <g-radio label="連結跳轉" :name="'type' + index" value="link" v-model="img.type" />
                    </div>
                    <template v-if="img.type == 'pop'">
                        <div class="g-edit__col">
                            <div class="input-group__label required">POP內容:</div>
                            <g-radio label="純文字" :name="'popType' + index" value="text" v-model="img.pop.type" />
                            <g-radio label="圖片" :name="'popType' + index" value="img" v-model="img.pop.type" />
                            <g-radio label="POP SLIDE" :name="'popType' + index" value="slide" v-model="img.pop.type" />
                        </div>
                        <template v-if="img.pop.type == 'text'">
                            <div class="g-edit__col">
                                <g-input label="POP標題:" v-model="img.pop.title" :required="true"
                                         :valid="img.pop.validTitle" />
                            </div>
                            <div class="g-edit__row">
                                <div class="input-group__label required">對齊方向:</div>
                                <g-radio label="左" :name="'align' + index" value="left" v-model="img.pop.align" />
                                <g-radio label="中" :name="'align' + index" value="center" v-model="img.pop.align" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="img.pop.styleValid"
                                          v-model="img.pop.style" />
                            </div>
                            <div class="g-edit__col">
                                <g-ckedit v-model="img.pop.text" />
                            </div>
                        </template>
                        <template v-if="img.pop.type == 'img'">
                            <div class="g-edit__col">
                                <g-input label="POP圖片網址:" v-model.trim="img.pop.img" :preview="img.pop.img"
                                         :valid="img.pop.validImg"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                          :valid="img.pop.styleValid"
                                          v-model="img.pop.style" />
                            </div>
                        </template>
                        <template v-if="img.pop.type == 'slide'">
                            <div class="g-edit__row">
                                <div class="g-edit__col">
                                    <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                                              :valid="img.pop.styleValid"
                                              v-model="img.pop.style" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">自動輪播:</div>
                                    <g-radio label="開啟" :name="'autoplay' + index" :value="true"
                                             v-model="img.pop.autoplay.open" />
                                    <g-radio label="關閉" :name="'autoplay' + index" :value="false"
                                             v-model="img.pop.autoplay.open" />
                                </div>
                                <div class="g-edit__col" v-if="img.pop.autoplay.open == 'true'">
                                    <g-input label="秒數:" v-model="img.pop.autoplay.delay"
                                             :valid="img.pop.autoplay.validDelay"
                                             :required="true" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">輪播切換方式:</div>
                                    <g-radio label="左右箭頭" :name="'control' + index" value="navigation"
                                             v-model="img.pop.control" />
                                    <g-radio label="下方點點(或預覽)" :name="'control' + index" value="pagination"
                                             v-model="img.pop.control" />
                                    <g-radio label="都不顯示" :name="'control' + index" value="no"
                                             v-model="img.pop.control" />
                                    <g-radio label="都要顯示" :name="'control' + index" value="all"
                                             v-model="img.pop.control" />
                                </div>
                                <template v-if="img.pop.control == 'pagination' || img.pop.control == 'all'">
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">點點改為預覽圖:</div>
                                        <g-radio label="是" :name="'thumb' + index" :value="true"
                                                 v-model="img.pop.thumb" />
                                        <g-radio label="否" :name="'thumb' + index" :value="false"
                                                 v-model="img.pop.thumb" />
                                    </div>
                                </template>
                            </div>
                            <div class="g-edit__row" v-for="(slide, slideIndex) in img.pop.slides">
                                <div class="g-edit__col">
                                    <div class="g-edit__group">
                                        <a href="javascript:;" class="icon icon-add"
                                           @click="addInsertMenu(index, slideIndex)"></a>
                                        <a href="javascript:;" class="icon icon-remove"
                                           @click="removeMenu(index, slideIndex)"></a>
                                        <a href="javascript:;" class="icon icon-up" @click="onUp(index, slideIndex)">up</a>
                                        <a href="javascript:;" class="icon icon-down"
                                           @click="onDown(index, slideIndex)">down</a>
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
                            <g-radio label="是" :name="'redirect' + index" :value="true"
                                     v-model="img.pop.closeCheckRedirect" />
                            <g-radio label="否" :name="'redirect' + index" :value="false"
                                     v-model="img.pop.closeCheckRedirect" />
                        </div>
                        <div class="g-edit__col" v-if="img.pop.closeCheckRedirect == 'true'">
                            <g-input label="跳轉連結:" v-model.trim="img.pop.closeRedirect"
                                     :valid="img.pop.validCloseRedirect" />
                        </div>
                    </template>
                    <template v-if="img.type == 'link'">
                        <div class="g-edit__col">
                            <g-input label="連結:" :required="true" v-model.trim="img.target.link"
                                     :valid="img.target.validUrl" />
                        </div>
                        <div class="g-edit__col">
                            <div class="input-group__label">另開視窗:</div>
                            <g-radio label="是" :name="'attribute' + index" :value="true"
                                     v-model="img.target.attribute" />
                            <g-radio label="否" :name="'attribute' + index" :value="false"
                                     v-model="img.target.attribute" />
                        </div>
                    </template>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="imgData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="imgData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="imgData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="imgData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="imgData.mobile_mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="imgData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="imgData.mobile_mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="imgData.validMmb" />
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