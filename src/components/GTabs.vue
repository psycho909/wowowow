<script>
export default {
    name: "GTabs",
    label: "頁籤區塊物件",
    order: 5
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GSwiper from '../elements/GSwiper2.vue';
import GCkedit from '../elements/GCkedit.vue';
import GLightbox from './GLightbox.vue';
import GYoutube from '../elements/GYoutube.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let tabsData = reactive({});
let tabsSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
let videoUpdate = ref(false);
let slideUpdate = ref(false);
let boxRef = ref("")
const initData = () => {
    return {
        style: "",
        validStyle: true,
        border: true,
        type: "img",
        activeTab: 0,
        tabs: [{
            name: "",
            validName: true,
            title: "",
            subtitle: "",
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
                validStyle: true,
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
        }],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(tabsData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        Object.assign(tabsData, cloneDeep(props.data.content));
        Object.assign(tabsSetting, cloneDeep(props.data.content))
        videoUpdate.value = true;
        slideUpdate.value = true;
        await nextTick();
        videoUpdate.value = false;
        slideUpdate.value = false;
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(tabsData, cloneDeep(props.data.content));
        Object.assign(tabsSetting, cloneDeep(props.data.content))
        await nextTick();
        let textBox = boxRef.value;
        if (textBox) {
            const computedStyles = getComputedStyle(textBox);
            const collapseValue = computedStyles.getPropertyValue('--collapse');
            textBox.style = `--collapse:${collapseValue};--max-height:${boxRef.value.scrollHeight}`
        }
    }

})

const addInsertMenu = (index) => {
    const tab = {
        name: "",
        validName: true,
        title: "",
        subtitle: "",
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
    }

    for (let tab of data.tabs) {
        if (tab.name.trim() === "") {
            tab.validName = false;
            isValid = false;
        }

        if (data.type === "img") {
            if (tab.img.pc.trim() === "" || !(await CheckImage(tab.img.pc))) {
                tab.img.validPC = false;
                isValid = false;
            }

            if (tab.img.mobile.trim() !== "" && !(await CheckImage(tab.img.mobile))) {
                tab.img.validMobile = false;
                isValid = false;
            }

            if (tab.img.type === "pop" && tab.img.pop.type === "text") {
                if (tab.img.pop.style.trim() === "") {
                    tab.img.pop.validStyle = false;
                    isValid = false;
                }
            }

            if (tab.img.type === "pop" && tab.img.pop.type === "img") {
                if (tab.img.pop.img.trim() === "" || !(await CheckImage(tab.img.pop.img))) {
                    tab.img.pop.validImg = false;
                    isValid = false;
                }
            }

            if (tab.img.type === "pop" && tab.img.pop.type === "slide") {
                for (let slide of tab.img.pop.slides) {
                    if (slide.pc.trim() === "" || !(await CheckImage(slide.pc))) {
                        slide.validPC = false;
                        isValid = false;
                    }
                    if (slide.mobile.trim() !== "" && !(await CheckImage(slide.mobile))) {
                        slide.validMobile = false;
                        isValid = false;
                    }
                }
            }

            if (tab.img.type === "link") {
                if (tab.img.target.link.trim() === "") {
                    tab.img.target.validLink = false;
                    isValid = false;
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
            if (tab.text.style.trim() === "") {
                tab.text.validStyle = false;
                isValid = false;
            }

            if (tab.text.text.trim() === "") {
                isValid = false;
            }
        }
    }

    return isValid;
};

const onSubmit = async () => {
    loadingShow()
    let isValidData = await validateTabsData(tabsData);
    if (isValidData) {
        let data = cloneDeep(tabsData)
        store.updateCpt(props.data.uid, data);
        Object.assign(tabsSetting, data);

        videoUpdate.value = true;
        slideUpdate.value = true;
        await nextTick();
        videoUpdate.value = false;
        slideUpdate.value = false;
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
    if (store.page == "EditPage") {
        data.pop.show = false
    } else {
        window.location.href = url;
    }
}

</script>
<template>
    <div class="g-tabs" :style="cssVar">
        <div class="g-tabs-container">
            <ul class="g-tabs__tab-list">
                <template v-for="(tab, index) in tabsSetting.tabs" :key="index">
                    <li class="g-tabs__tab-li" @click="tabsSetting.activeTab = index"
                        :class="{ 'active': tabsSetting.activeTab === index }">{{
                            tab.name }}</li>
                </template>
            </ul>
            <div class="g-tabs__content">
                <template v-for="(tab, index) in tabsSetting.tabs" :key="index">
                    <div class="g-tabs__box" v-show="tabsSetting.activeTab === index">
                        <div class="g-tabs__title">
                            <span>{{ tab.title }}</span>
                            <span v-if="tab.subtitle">{{ tab.subtitle }}</span>
                        </div>
                        <div class="g-tabs__pane">
                            <template v-if="tabsSetting.type == 'img'">
                                <template v-if="tab.img.type == ''">
                                    <div class="g-img__box none">
                                        <div class="g-img__img-box">
                                            <picture>
                                                <source media="(max-width:768px)" :srcset="tab.img.mobile" />
                                                <img :srcset="tab.img.pc" :src="tab.img.pc" alt="" />
                                            </picture>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="tab.img.type == 'link'">
                                    <a :href="[tab.img.target.link ? tab.img.target.link : 'javascript:;']"
                                       :target="[tab.img.target.attribute == true ? '_blank' : '_self']" class="g-img__box">
                                        <div class="g-img__img-box">
                                            <picture>
                                                <source media="(max-width:768px)" :srcset="tab.img.mobile || tab.img.pc" />
                                                <img class="g-img__img" :srcset="tab.img.pc" :src="tab.img.pc" alt="" />
                                            </picture>
                                        </div>
                                    </a>
                                </template>
                                <template v-if="tab.img.type == 'pop'">
                                    <div class="g-img__box"
                                         :class="[store.status == 'edit' ? 'edit' : '']"
                                         @click="openPop(tab.img)">
                                        <div class="g-img__img-box">
                                            <picture>
                                                <source media="(max-width:768px)" :srcset="tab.img.mobile || tab.img.pc" />
                                                <img class="g-img__img" :srcset="tab.img.pc" :src="tab.img.pc" alt="" />
                                            </picture>
                                        </div>
                                        <g-lightbox v-model:showLightbox="tab.img.pop.show"
                                                    :style="colors[tab.img.pop.style]"
                                                    :class="tab.img.pop.align">
                                            <template #lightbox-close v-if="tab.img.pop.closeCheckRedirect == 'true'">
                                                <a href="javascript:;" class="g-lightbox__close icon-close"
                                                   @click="closePop(tab.img, tab.img.pop.closeRedirect)"></a>
                                            </template>
                                            <template #lightbox-title v-if="tab.img.pop.type != 'slide'">{{
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
                                                    <g-swiper :data="tab.img.pop" :status="status" v-if="!slideUpdate" />
                                                </template>
                                            </template>
                                        </g-lightbox>
                                    </div>
                                </template>
                            </template>
                            <template v-if="tabsSetting.type == 'video'">
                                <a v-if="tab.video.type == 'click'" href="javascript:;" class="g-video__box">
                                    <g-youtube :youtube="tab.video.url" v-if="!videoUpdate" :openapp="tab.video.app" />
                                </a>
                                <a v-if="tab.video.type == 'pop'" href="javascript:;" class="g-video__box"
                                   @click="openPop(tab.video)">
                                    <g-youtube :youtube="tab.video.url" :pop="true" :preview="true"
                                               :openapp="tab.video.app"
                                               v-if="!videoUpdate" />
                                    <g-lightbox v-model:showLightbox="tab.video.show" :style="tab.video.style"
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
                            <template v-if="tabsSetting.type == 'text'">
                                <template v-if="tab.text.type == 'all'">
                                    <div class="g-text__box" v-html="tab.text.text"></div>
                                </template>
                                <template v-if="tab.text.type == 'collapse'">
                                    <div class="g-text__box" :class="[collapseStatus ? '' : 'collapse']"
                                         v-html="tab.text.text"
                                         :style="{ '--collapse': tab.text.collapse.num }" ref="boxRef"></div>
                                    <a class="g-text__collapse-btn" href="javascript:;" @click="collapseToggle"
                                       :style="[colors[tab.text.style]]">{{
                                           collapseStatus ? tab.text.collapse.close : tab.text.collapse.open }}</a>
                                </template>
                                <template v-if="tab.text.type == 'scrollbar'">
                                    <div class="g-text__box scrollbar" v-html="tab.text.text"
                                         :style="[colors[tab.text.style], { '--scrollbar': tab.text.scrollbar.num }]"></div>
                                </template>
                            </template>
                        </div>
                    </div>
                </template>
            </div>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">頁籤區塊物件
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="tabsData.validStyle"
                              v-model="tabsData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">外框顯示:</div>
                    <g-radio label="是" name="border" :value="true" v-model="tabsData.border" />
                    <g-radio label="否" name="border" :value="false" v-model="tabsData.border" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">內容樣式:</div>
                    <g-radio label="圖片" name="type" value="img" v-model="tabsData.type" />
                    <g-radio label="影片" name="type" value="video" v-model="tabsData.type" />
                    <g-radio label="文字" name="type" value="text" v-model="tabsData.type" />
                </div>
                <template v-for="(tab, index) in tabsData.tabs" :key="index">
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
                                    <g-input label="頁籤名稱:" v-model.trim="tab.name" :required="true"
                                             :valid="tab.validName" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="主標:" v-model.trim="tab.title" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="小標:" v-model.trim="tab.subtitle" />
                                </div>
                                <template v-if="tabsData.type == 'img'">
                                    <div class="g-edit__col">
                                        <g-input label="圖片:" v-model.trim="tab.img.pc" :preview="tab.img.pc"
                                                 :required="true"
                                                 :valid="tab.img.validPC" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-input label="手機版圖片:" v-model.trim="tab.img.mobile" :preview="tab.img.mobile" />
                                    </div>
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">開啟方式:</div>
                                        <g-radio label="無" :name="'type' + index" value="" v-model="tab.img.type" />
                                        <g-radio label="POP視窗" :name="'type' + index" value="pop" v-model="tab.img.type" />
                                        <g-radio label="連結跳轉" :name="'type' + index" value="link" v-model="tab.img.type" />
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
                                                <g-select label="主題顏色" :group="true" :options="[style1, style2]"
                                                          :required="true"
                                                          :valid="tab.img.pop.validStyle"
                                                          v-model="tab.img.pop.style" />
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
                                            <div class="g-edit__col">
                                                <g-select label="主題顏色" :group="true" :options="[style1, style2]"
                                                          :required="true"
                                                          :valid="tab.img.pop.validStyle"
                                                          v-model="tab.img.pop.style" />
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
                                                    <g-radio label="下方點點" :name="'control' + index" value="pagination"
                                                             v-model="tab.img.pop.control" />
                                                    <g-radio label="都不顯示" :name="'control' + index" value="no"
                                                             v-model="tab.img.pop.control" />
                                                    <g-radio label="都要顯示" :name="'control' + index" value="all"
                                                             v-model="tab.img.pop.control" />
                                                </div>
                                            </div>
                                            <div class="g-edit__row" v-for="(slide, slideIndex) in tab.img.pop.slides">
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
                                <template v-if="tabsData.type == 'video'">
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
                                        <g-radio label="是" :name="'app' + index" :value="true" v-model="tab.video.app" />
                                        <g-radio label="否" :name="'app' + index" :value="false" v-model="tab.video.app" />
                                    </div>
                                </template>
                                <template v-if="tabsData.type == 'text'">
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">對齊方向:</div>
                                        <g-radio label="左" :name="'textAlign' + index" value="left"
                                                 v-model="tab.text.align" />
                                        <g-radio label="中" :name="'textAlign' + index" value="center"
                                                 v-model="tab.text.align" />
                                    </div>
                                    <div class="g-edit__col">
                                        <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                                                  :valid="tab.text.validStyle"
                                                  v-model="tab.text.style" />
                                    </div>
                                    <div class="g-edit__col">
                                        <div class="input-group__label required">收合文字:</div>
                                        <g-radio label="全部展開" :name="'textType' + index" value="all"
                                                 v-model="tab.text.type" />
                                        <g-radio label="摺疊收合" :name="'textType' + index" value="collapse"
                                                 v-model="tab.text.type" />
                                        <g-radio label="Scrollbar" :name="'textType' + index" value="scrollbar"
                                                 v-model="tab.text.type" />
                                    </div>
                                    <template v-if="tab.text.type == 'collapse'">
                                        <div class="g-edit__row">
                                            <div class="g-edit__col">
                                                <g-input class="w-auto" label="文字超過:" :type="'number' + index"
                                                         v-model="tab.text.collapse.num" />
                                                <span>行後出現Scrollbar</span>
                                            </div>
                                            <div class="g-edit__col">
                                                <g-input label="收合後文字:" type="text"
                                                         v-model="tab.text.collapse.close" />
                                            </div>
                                            <div class="g-edit__col">
                                                <g-input label="收合前文字:" type="text"
                                                         v-model="tab.text.collapse.open" />
                                            </div>
                                        </div>
                                    </template>
                                    <template v-if="tab.text.type == 'scrollbar'">
                                        <div class="g-edit__row">
                                            <div class="g-edit__col">
                                                <g-input label="文字超過:" :type="'number' + index"
                                                         v-model="tab.text.scrollbar.num" />
                                                <span class="flex[1]">行後出現Scrollbar</span>
                                            </div>
                                        </div>
                                    </template>
                                    <div class="g-edit__row">
                                        <g-ckedit v-model:modelValue="tab.text.text" />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="tabsData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="tabsData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="tabsData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="tabsData.mobile_mb" @change="handleNumber" />
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