<script>
export default {
    name: "GTabs",
    label: "頁籤區塊",
    order: [9, 14],
    type: [1, 2]
}
</script>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GSwiper from '../elements/GSwiper2.vue';
import GCkedit from '../elements/GCkeditSimple.vue';
import GLightbox from './GLightbox.vue';
import GYoutube from '../elements/GYoutube.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide, extractVideoID } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let tabsData = reactive({});
let tabsSetting = reactive({})
let videoUpdate = ref(false);
let slideUpdate = ref(false);
let tabBox = ref(null);
let boxRef = ref("");
let tabRef = ref("");
let tabPop = ref(false);
let tabPopShow = ref(false);
let tabPopHide = ref(false);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        style: "",
        validStyle: true,
        activeTab: 0,
        opacity: 1,
        tabs: [{
            name: "",
            validName: true,
            title: "",
            type: "img",
            img: {
                pc: "",
                mobile: "",
                type: "",
                validPC: true,
                validMobile: true,
                pop: {
                    show: false, type: "text",
                    align: "left",
                    text: "",
                    img: "",
                    validImg: true,
                    slides: [{
                        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                    }],
                    closeCheckRedirect: false,
                    closeRedirect: "",
                    validRedirect: true,
                    num: 1,
                    control: 'all',
                    thumb: true,
                    autoplay: {
                        open: false,
                        delay: 2,
                        validDelay: true
                    }
                },
                target: {
                    link: "",
                    validLink: true,
                    attribute: true, validUrl: true,
                }
            },
            video: {
                app: true,
                url: "",
                validUrl: true,
                preview: false,
                type: "click",
                show: false
            },
            text: {
                align: "left",
                text: "",
                validText: true,
                type: "all"
            }
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(tabsData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (props.data.content.opacity === undefined) {
            props.data.content.opacity = 1;
        }
        if (props.data.content.type) {
            props.data.content.tabs.forEach((v, i) => {
                v.type = props.data.content.type
            })
        }
        Object.assign(tabsData, cloneDeep(props.data.content));
        Object.assign(tabsSetting, cloneDeep(props.data.content))
        if (tabsData.type) {
            tabsData.tabs.forEach((v, i) => {
                v.type = tabsData.type
            })
            tabsData.type = null;
        }
        if (tabsSetting.type) {
            tabsSetting.tabs.forEach((v, i) => {
                v.type = tabsSetting.type
            })
            tabsSetting.type = null;
        }
        if (tabsData.opacity == undefined) {
            tabsData.opacity = 1;
        }
        if (tabsSetting.opacity == undefined) {
            tabsSetting.opacity = 1;
        }
        videoUpdate.value = true;
        slideUpdate.value = true;
        await nextTick();
        videoUpdate.value = false;
        slideUpdate.value = false;
        // getHeightOfTabBoxes()
        // getWidthOfTab()
    }
})


onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        if (props.data.content.opacity === undefined) {
            props.data.content.opacity = 1;
        }
        if (props.data.content.type) {
            props.data.content.tabs.forEach((v, i) => {
                v.type = props.data.content.type
            })
        }
        Object.assign(tabsData, cloneDeep(props.data.content));
        Object.assign(tabsSetting, cloneDeep(props.data.content))
        if (tabsData.type) {
            tabsData.tabs.forEach((v, i) => {
                v.type = tabsData.type
            })
        }
        if (tabsSetting.type) {
            tabsSetting.tabs.forEach((v, i) => {
                v.type = tabsSetting.type
            })
        }
        if (tabsData.opacity == undefined) {
            tabsData.opacity = 1;
        }
        if (tabsSetting.opacity == undefined) {
            tabsSetting.opacity = 1;
        }
        await nextTick();
        let tabListWidth = document.querySelector('.g-tabs__tab-list').clientWidth;
        let tabLiWidthTotal = 0;
        document.querySelectorAll('.g-tabs__tab-list li').forEach((item) => {
            tabLiWidthTotal += item.clientWidth
        })
        if (tabLiWidthTotal > tabListWidth) {
            tabPopHide.value = true;
        } else {
            tabPopHide.value = false;
        }
        if ($addComponent) {
            $addComponent();
        }
    }
})

const addInsertMenu = (index) => {
    const tab = {
        name: "",
        validName: true,
        title: "",
        img: {
            pc: "",
            mobile: "",
            type: "",
            validPC: true,
            validMobile: true,
            pop: {
                show: false, type: "text",
                align: "left",
                style: "",
                validStyle: true,
                text: "",
                img: "",
                validImg: true,
                slides: [{
                    pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
                }],
                closeCheckRedirect: false,
                closeRedirect: "",
                validRedirect: true,
                num: 1,
                control: 'all',
                thumb: true,
                autoplay: {
                    open: false,
                    delay: 2,
                    validDelay: true
                }
            },
            target: {
                link: "",
                validLink: true,
                attribute: true, validUrl: true,
            }
        },
        video: {
            app: true,
            url: "",
            validUrl: true,
            preview: false,
            type: "click",
            show: false
        },
        text: {
            align: "left",
            style: "",
            text: "",
            validText: true,
            type: "all",
            collapse: {
                num: 3,
                close: "收起-",
                open: "展開看更多+",
            },
            scrollbar: {
                num: 3,
            }
        }
    };

    tabsData.tabs.push(tab)
};

const removeMenu = (deleteIndex) => {
    if (tabsData.tabs.length > 1) {
        tabsData.tabs.splice(deleteIndex, 1);
    }

}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = tabsData.tabs[index];
    var _content = [...tabsData.tabs.slice(0, index), ...tabsData.tabs.slice(index + 1)];
    tabsData.tabs = _content;
    tabsData.tabs.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < tabsData.tabs.length - 1) {
        const temp = tabsData.tabs[index];
        tabsData.tabs[index] = tabsData.tabs[index + 1];
        tabsData.tabs[index + 1] = temp;
    }
}

const addInsertMenu2 = (index) => {
    const newSlide = {
        pc: "", mobile: "", open: false, url: "", attribute: false, validPC: true, validMobile: true, validUrl: true
    };

    tabsData.tabs[index].img.pop.slides.push(newSlide)
};

const removeMenu2 = (index, deleteIndex) => {
    if (tabsData.tabs[index].img.pop.slides.length > 1) {
        tabsData.tabs[index].img.pop.slides.splice(deleteIndex, 1);
    }

}

const onUp2 = (index, slideIndex) => {
    if (slideIndex > 0) {
        const slides = tabsData.tabs[index].img.pop.slides;
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex - 1];
        slides[slideIndex - 1] = currentSlide;
    }
}

const onDown2 = (index, slideIndex) => {
    const slides = tabsData.tabs[index].img.pop.slides;

    if (slideIndex < slides.length - 1) {
        const currentSlide = slides[slideIndex];
        slides[slideIndex] = slides[slideIndex + 1];
        slides[slideIndex + 1] = currentSlide;
    }
}

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
        "--opacity": props.data.content.opacity === undefined ? 1 : props.data.content.opacity,
    }
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const openPop = (data) => {
    if (data.pop) {
        data.pop.show = true
    } else {
        data.show = true
    }

}

const validateTabsData = async (data) => {
    let isValid = true;

    if (data.style.trim() === "") {
        data.validStyle = false;
        isValid = false;
    } else {
        data.validStyle = true;
    }

    for (let tab of data.tabs) {
        if (tab.name.trim() === "") {
            tab.validName = false;
            isValid = false;
        } else {
            tab.validName = true;
        }

        if (data.type === "img") {
            if (tab.img.pc.trim() === "" || !(await CheckImage(tab.img.pc))) {
                tab.img.validPC = false;
                isValid = false;
            } else {
                tab.img.validPC = true;
            }

            if (tab.img.mobile.trim() !== "" && !(await CheckImage(tab.img.mobile))) {
                tab.img.validMobile = false;
                isValid = false;
            } else {
                tab.img.validMobile = true;
            }

            if (tab.img.type === "pop" && tab.img.pop.type === "img") {
                if (tab.img.pop.img.trim() === "" || !(await CheckImage(tab.img.pop.img))) {
                    tab.img.pop.validImg = false;
                    isValid = false;
                } else {
                    tab.img.pop.validImg = true;
                }
            }

            if (tab.img.type === "pop" && tab.img.pop.type === "slide") {
                for (let slide of tab.img.pop.slides) {
                    if (slide.pc.trim() === "" || !(await CheckImage(slide.pc))) {
                        slide.validPC = false;
                        isValid = false;
                    } else {
                        slide.validPC = true;
                    }
                    if (slide.mobile.trim() !== "" && !(await CheckImage(slide.mobile))) {
                        slide.validMobile = false;
                        isValid = false;
                    } else {
                        slide.validMobile = true;
                    }
                }
            }

            if (tab.img.type === "link") {
                if (tab.img.target.link.trim() === "") {
                    tab.img.target.validLink = false;
                    isValid = false;
                } else {
                    tab.img.target.validLink = true;
                }
            }
        }

        if (data.type === "video") {
            if (tab.video.url.trim() === "") {
                tab.video.validUrl = false;
                isValid = false;
            } else {
                tab.video.validUrl = extractVideoID(tab.video.url);
                if (!tab.video.validUrl) {
                    isValid = false;
                }
            }
        }

        if (data.type === "text") {
            if (tab.text.text.trim() === "") {
                tab.text.validText = false;
                isValid = false;
            } else {
                tab.text.validText = true;
            }
        }
    }

    return isValid;
};

const onSubmit = async () => {
    loadingShow()
    tabsData.validMt = true;
    tabsData.validMb = true;
    tabsData.validMmt = true;
    tabsData.validMmb = true;
    if (tabsData.mt < 0) {
        tabsData.validMt = false;
    }
    if (tabsData.mb < 0) {
        tabsData.validMb = false;
    }
    if (tabsData.mobile_mt < 0) {
        tabsData.validMmt = false;
    }
    if (tabsData.mobile_mb < 0) {
        tabsData.validMmb = false;
    }
    let isValidData = await validateTabsData(tabsData);
    if (tabsData.validMt && tabsData.validMb && tabsData.validMmt && tabsData.validMmb) {
        if (isValidData) {
            let data = cloneDeep(tabsData)
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(tabsSetting, data);

            videoUpdate.value = true;
            slideUpdate.value = true;
            await nextTick();
            videoUpdate.value = false;
            slideUpdate.value = false;
            GetPageType(store.otp)
        } else {
            loadingHide()
        }
    } else {
        loadingHide()
    }
}

const onReset = () => {
    Object.assign(imgData, initData());
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
        Object.assign(tabsData, cloneDeep(props.data.content));
    } else {
        Object.assign(tabsData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

const closePop = (data, url) => {
    console.log(data, url)
    if (store.page == "EditPage") {
        data.pop.show = false
    } else {
        window.location.href = url;
    }
}

const getHeightOfTabBoxes = () => {
    const tabBoxes = tabBox.value;
    tabBox.value.forEach((tab, index) => {
        tab.style = "";
    })
    let tabHeight = tabBoxes.map((box, index) => {
        return box.clientHeight;
    });
    let maxHeight = Math.max(...tabHeight)
    tabBox.value.forEach((tab, index) => {
        tab.style = `--tab-height:${maxHeight}`;
    })
}

const getWidthOfTab = () => {
    const tabRefs = tabRef.value;
    const tabBox = document.querySelector(".g-tabs__tab-box").clientWidth;
    let tabWidth = tabRefs.reduce((p, c) => {
        return p + c.clientWidth;
    }, 0);
    tabPop.value = tabWidth > tabBox
}


const openTabPop = () => {
    tabPopShow.value = true
}

const targetTab = (index) => {
    tabPopShow.value = false
    tabsSetting.activeTab = index
}
</script>

<template>
    <div class="g-tabs" :style="[colors[tabsSetting.style], cssVar]">
        <div class="g-tabs-container">
            <div class="g-tabs__tab-box" :data-pop="tabPop">
                <ul class="g-tabs__tab-list" :data-num="tabsSetting.tabs?.length">
                    <template v-for="(tab, index) in tabsSetting.tabs" :key="index">
                        <li class="g-tabs__tab-li" @click="tabsSetting.activeTab = index"
                            :class="{ 'active': tabsSetting.activeTab === index }" ref="tabRef">{{
                            tab.name }}</li>
                    </template>
                </ul>
                <a href="javascript:;" class="g-tabs__tab-pop" @click="openTabPop" v-if="tabPopHide"></a>
            </div>
            <div class="g-tabs__content">

                <template v-for="(tab, index) in tabsSetting.tabs" :key="index">
                    <div class="g-tabs__box" :class="[tabsSetting.activeTab === index ? 'show' : '']"
                         :data-type="tab.type" ref="tabBox">
                        <div class="g-tabs__title" v-if="tab.title">
                            <span>{{ tab.title }}</span>
                            <span v-if="tab.subtitle">{{ tab.subtitle }}</span>
                        </div>
                        <div class="g-tabs__pane">
                            <template v-if="tab.type == 'img'">
                                <template v-if="tab.img.type == ''">
                                    <div class="g-img__box none">
                                        <div class="g-img__img-box">
                                            <picture>
                                                <source media="(max-width:768px)" :srcset="tab.img.mobile" />
                                                <img :srcset="tab.img.pc" :src="tab.img.pc" alt=""
                                                     @load="imageLoaded" />
                                            </picture>
                                        </div>
                                    </div>
                                </template>

                                <template v-if="tab.img.type == 'link'">
                                    <a :href="[tab.img.target.link ? tab.img.target.link : 'javascript:;']"
                                       :target="[tab.img.target.attribute == true ? '_blank' : '_self']"
                                       class="g-img__box">
                                        <div class="g-img__img-box">
                                            <picture>
                                                <source media="(max-width:768px)"
                                                        :srcset="tab.img.mobile || tab.img.pc" />
                                                <img class="g-img__img" :srcset="tab.img.pc" :src="tab.img.pc" alt=""
                                                     @load="imageLoaded" />
                                            </picture>
                                        </div>
                                    </a>
                                </template>

                                <template v-if="tab.img.type == 'pop'">
                                    <div class="g-img__box"
                                         :class="[store.status == 'edit' ? 'edit' : '']"
                                         @click="openPop(tab.img)">
                                        <div class="g-img__img-box g-img__img-box-pop">
                                            <picture>
                                                <source media="(max-width:768px)"
                                                        :srcset="tab.img.mobile || tab.img.pc" />
                                                <img class="g-img__img" :srcset="tab.img.pc" :src="tab.img.pc" alt=""
                                                     @load="imageLoaded" />
                                            </picture>
                                        </div>
                                        <g-lightbox v-model:showLightbox="tab.img.pop.show"
                                                    :class="[tab.img.pop.align, tab.img.pop.type, tab.img.pop.type == 'slide' ? 'pop-slide' : '']">
                                            <template #lightbox-title
                                                      v-if="tab.img.pop.type != 'slide' && tab.img.pop.title !== ''">{{
                                                tab.img.pop.title }}</template>

                                            <template #lightbox-content>
                                                <template v-if="tab.img.pop.type != 'slide'">
                                                    <div class="g-lightbox__text" v-if="tab.img.pop.text"
                                                         v-html="tab.img.pop.text"></div>
                                                    <div class="g-lightbox__img" v-if="tab.img.pop.img">
                                                        <img :src="tab.img.pop.img" alt="">
                                                    </div>
                                                </template>

                                                <template v-else>
                                                    <g-swiper :data="tab.img.pop" :status="status"
                                                              v-if="!slideUpdate" />
                                                </template>
                                            </template>

                                            <template #lightbox-btn
                                                      v-if="tab.img.pop.closeCheckRedirect == 'true' || tab.img.pop.closeCheckRedirect === true">
                                                <a href=" javascript:;" class="g-lightbox__btn"
                                                   @click="closePop(tab.img, tab.img.pop.closeRedirect)">確定</a>
                                            </template>

                                            <template #lightbox-close
                                                      v-if="tab.img.pop.closeCheckRedirect == 'true' || tab.img.pop.closeCheckRedirect === true">
                                                <a href="javascript:;" class="g-lightbox__close icon-close"
                                                   @click="closePop(tab.img, tab.img.pop.closeRedirect)">確定</a>
                                            </template>
                                        </g-lightbox>
                                    </div>
                                </template>
                            </template>

                            <template v-if="tab.type == 'video'">
                                <a v-if="tab.video.type == 'click'" href="javascript:;" class="g-video__box">
                                    <g-youtube :youtube="tab.video.url" v-if="!videoUpdate" :openapp="tab.video.app" />
                                </a>
                                <a v-if="tab.video.type == 'pop'" href="javascript:;"
                                   class="g-video__box g-video__box-pop"
                                   @click="openPop(tab.video)">
                                    <g-youtube :youtube="tab.video.url" :pop="true" :preview="true"
                                               :openapp="tab.video.app"
                                               v-if="!videoUpdate" />
                                    <g-lightbox v-model:showLightbox="tab.video.show"
                                                :action="false"
                                                class="lb-video">
                                        <template #lightbox-content>
                                            <div class="g-lightbox__video">
                                                <g-youtube :youtube="tab.video.url" :popopen="tab.video.show"
                                                           :popstatus="true"
                                                           :openapp="tab.video.app" />
                                            </div>
                                        </template>
                                    </g-lightbox>
                                </a>
                            </template>

                            <template v-if="tab.type == 'text'">
                                <template v-if="tab.text.type == 'all'">
                                    <div class="g-text__box" :data-align="tab.text.align" v-html="tab.text.text"></div>
                                </template>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-lightbox v-model:showLightbox="tabPopShow" :style="[colors[tabsSetting.style]]" :action="false"
                    class="lb-pop-tab">

            <template #lightbox-content>
                <ul class="g-lightbox__tab-list">
                    <li class="g-lightbox__tab-li" v-for="(tab, index) in tabsSetting.tabs"
                        :class="{ 'active': tabsSetting.activeTab === index }" @click="targetTab(index)">{{ tab.name }}
                    </li>
                </ul>
            </template>
        </g-lightbox>
        <g-edit v-model:showEdit="showEdit">

            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>

            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">頁籤區塊
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Tabs${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="tabsData.validStyle"
                              v-model="tabsData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">透明度:</div>
                    <input type="range" id="opacity" name="opacity" min="0" max="1" step="0.01" value="1"
                           v-model="tabsData.opacity" />
                    <span>{{ tabsData.opacity * 100 }}%</span>
                </div>
                <template v-for="( tab, index ) in tabsData.tabs " :key="index">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <div class="g-edit__group">
                                <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                                <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                            </div>
                            <div class="g-edit__group">
                                <div class="g-edit__col">
                                    <g-input label="頁籤名稱:" v-model.trim="tab.name" :required="true" max="8"
                                             :valid="tab.validName" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="主標:" v-model.trim="tab.title" max="20" />
                                </div>
                                <div class="g-edit__row">
                                    <div class="input-group__label required">內容樣式:</div>
                                    <g-radio label="圖片" :name="'tabtype' + index" value="img" v-model="tab.type" />
                                    <g-radio label="影片" :name="'tabtype' + index" value="video" v-model="tab.type" />
                                    <g-radio label="文字" :name="'tabtype' + index" value="text" v-model="tab.type" />
                                </div>
                                <template v-if="tab.type == 'img'">
                                    <div class="g-edit__col">
                                        <g-input label="圖片:" v-model.trim="tab.img.pc" :preview="tab.img.pc"
                                                 :required="true"
                                                 :valid="tab.img.validPC" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-input label="手機版圖片:" v-model.trim="tab.img.mobile"
                                                 :preview="tab.img.mobile" />
                                    </div>
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">開啟方式:</div>
                                        <g-radio label="無" :name="'type' + index" value="" v-model="tab.img.type" />
                                        <g-radio label="POP視窗" :name="'type' + index" value="pop"
                                                 v-model="tab.img.type" />
                                        <g-radio label="連結跳轉" :name="'type' + index" value="link"
                                                 v-model="tab.img.type" />
                                    </div>
                                    <template v-if="tab.img.type == 'pop'">
                                        <div class="g-edit__col">
                                            <div class="input-group__label required">POP內容:</div>
                                            <g-radio label="純文字" :name="'popType' + index" value="text"
                                                     v-model="tab.img.pop.type" />
                                            <g-radio label="圖片" :name="'popType' + index" value="img"
                                                     v-model="tab.img.pop.type" />
                                            <g-radio label="POP SLIDE" :name="'popType' + index" value="slide"
                                                     v-model="tab.img.pop.type" />
                                        </div>
                                        <template v-if="tab.img.pop.type == 'text'">
                                            <div class="g-edit__col">
                                                <g-input label="POP標題:" v-model="tab.img.pop.title" />
                                            </div>
                                            <div class="g-edit__row">
                                                <div class="input-group__label required">對齊方向:</div>
                                                <g-radio label="左" :name="'align' + index" value="left"
                                                         v-model="tab.img.pop.align" />
                                                <g-radio label="中" :name="'align' + index" value="center"
                                                         v-model="tab.img.pop.align" />
                                            </div>
                                            <div class="g-edit__col">
                                                <g-ckedit v-model="tab.img.pop.text" />
                                            </div>
                                        </template>

                                        <template v-if="tab.img.pop.type == 'img'">
                                            <div class="g-edit__col">
                                                <g-input label="POP圖片網址:" v-model.trim="tab.img.pop.img"
                                                         :preview="tab.img.pop.img"
                                                         :valid="tab.img.pop.validImg"
                                                         :required="true" />
                                            </div>
                                        </template>

                                        <template v-if="tab.img.pop.type == 'slide'">
                                            <div class="g-edit__row">
                                                <div class="g-edit__col">
                                                    <div class="input-group__label required">自動輪播:</div>
                                                    <g-radio label="開啟" :name="'autoplay' + index" :value="true"
                                                             v-model="tab.img.pop.autoplay.open" />
                                                    <g-radio label="關閉" :name="'autoplay' + index" :value="false"
                                                             v-model="tab.img.pop.autoplay.open" />
                                                </div>
                                                <div class="g-edit__col" v-if="tab.img.pop.autoplay.open == 'true'">
                                                    <g-input label="秒數:" v-model="tab.img.pop.autoplay.delay"
                                                             :valid="tab.img.pop.autoplay.validDelay"
                                                             :required="true" />
                                                </div>
                                                <div class="g-edit__col">
                                                    <div class="input-group__label required">輪播切換方式:</div>
                                                    <g-radio label="左右箭頭" :name="'control' + index" value="navigation"
                                                             v-model="tab.img.pop.control" />
                                                    <g-radio label="下方點點(或預覽)" :name="'control' + index"
                                                             value="pagination"
                                                             v-model="tab.img.pop.control" />
                                                    <g-radio label="都不顯示" :name="'control' + index" value="no"
                                                             v-model="tab.img.pop.control" />
                                                    <g-radio label="都要顯示" :name="'control' + index" value="all"
                                                             v-model="tab.img.pop.control" />
                                                </div>
                                            </div>
                                            <div class="g-edit__row"
                                                 v-for="( slide, slideIndex ) in tab.img.pop.slides ">
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
                                                            <g-input label="圖片網址:" v-model.trim="slide.pc"
                                                                     :valid="slide.validPC"
                                                                     :preview="slide.pc"
                                                                     :required="true" />
                                                        </div>
                                                        <div class="g-edit__col">
                                                            <g-input label="手機版圖片網址" v-model.trim="slide.mobile"
                                                                     :preview="slide.mobile"
                                                                     :valid="slide.validMobile" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="g-edit__col">
                                            <div class="input-group__label required">POP視窗關閉是否跳轉:</div>
                                            <g-radio label="是" :name="'redirect' + index" :value="true"
                                                     v-model="tab.img.pop.closeCheckRedirect" />
                                            <g-radio label="否" :name="'redirect' + index" :value="false"
                                                     v-model="tab.img.pop.closeCheckRedirect" />
                                        </div>
                                        <div class="g-edit__col" v-if="tab.img.pop.closeCheckRedirect == 'true'">
                                            <g-input label="跳轉連結:" v-model.trim="tab.img.pop.closeRedirect" />
                                        </div>
                                    </template>

                                    <template v-if="tab.img.type == 'link'">
                                        <div class="g-edit__col">
                                            <g-input label="連結:" :required="true" v-model.trim="tab.img.target.link"
                                                     :valid="tab.img.target.validLink" />
                                        </div>
                                        <div class="g-edit__col">
                                            <div class="input-group__label">另開視窗:</div>
                                            <g-radio label="是" :name="'attribute' + index" :value="true"
                                                     v-model="tab.img.target.attribute" />
                                            <g-radio label="否" :name="'attribute' + index" :value="false"
                                                     v-model="tab.img.target.attribute" />
                                        </div>
                                    </template>
                                </template>

                                <template v-if="tab.type == 'video'">
                                    <div class="g-edit__col">
                                        <g-input label="影片連結:" :required="true" v-model.trim="tab.video.url"
                                                 :valid="tab.video.validUrl" />
                                    </div>
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">影片播放方式:</div>
                                        <g-radio label="點擊直接播放" :name="'videoType' + index" value="click"
                                                 v-model="tab.video.type" />
                                        <g-radio label="點擊跳出燈箱播放" :name="'videoType' + index" value="pop"
                                                 v-model="tab.video.type" />
                                    </div>
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">手機使用YoutubeAPP開啟:</div>
                                        <g-radio label="是" :name="'app' + index" :value="true"
                                                 v-model="tab.video.app" />
                                        <g-radio label="否" :name="'app' + index" :value="false"
                                                 v-model="tab.video.app" />
                                    </div>
                                </template>

                                <template v-if="tab.type == 'text'">
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">對齊方向:</div>
                                        <g-radio label="左" :name="'textAlign' + index" value="left"
                                                 v-model="tab.text.align" />
                                        <g-radio label="中" :name="'textAlign' + index" value="center"
                                                 v-model="tab.text.align" />
                                    </div>
                                    <div class="g-edit__row">
                                        <g-ckedit v-model:modelValue="tab.text.text" :require="true"
                                                  :valid="tab.text.validText" />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="tabsData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="tabsData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="tabsData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值"
                                 :valid="tabsData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="tabsData.mobile_mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="tabsData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="tabsData.mobile_mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="tabsData.validMmb" />
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