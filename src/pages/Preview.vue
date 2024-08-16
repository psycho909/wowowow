<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GCookie from "../components/GCookie.vue";
import GLoading from "../components/GLoading.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, pageInfo, getBrowserLocales, getUrlSearchParams } from "../Tool";
// import gameFooter from "../gameFooter";
import topBar from "../topBar";
const store = mainStore()
let state = null;
let lanBrowser = getBrowserLocales()[0];
let lanParams = getUrlSearchParams("lan");
const loading = ref(false);
const componentCount = ref(0);
const totalComponentCount = ref(0);
let isObserving = ref(true);
let footerTop = ref(null);
provide('$addComponent', () => {
    componentCount.value += 1;
});
provide('$componentCount', componentCount);

if (window.localStorage.getItem("state")) {
    // state = JSON.parse(window.sessionStorage.getItem("state"));
    state = JSON.parse(window.localStorage.getItem("state"));
    store.setState(state);
}
let { previewConfig, previewContent } = storeToRefs(store);
let footer = {}
function handleScroll() {
    const footerElement = document.querySelector(".UNI-footer");
    if (!footerElement) return;
    const rect = footerElement.getBoundingClientRect();
    let observeLimit = window.innerHeight - rect.top;
    if (rect.top <= window.innerHeight && observeLimit > 0) {
        footerTop.value = observeLimit;
        triggerEnterEvent();
        isObserving.value = false;
    } else if (rect.top > window.innerHeight && !isObserving.value) {
        footerTop.value = null;
        triggerExitEvent();
        isObserving.value = true;
    }
}
function triggerEnterEvent() {
    const musicElement = document.querySelector(".g-music");
    const watermarkElement = document.querySelector(".g-watermark");
    const topElement = document.querySelector(".g-top");
    const menuElement = document.querySelector(".g-fixed.bottom");
    if (musicElement) {
        musicElement.style.setProperty('--bottom', footerTop.value);
        musicElement.setAttribute('data-observer', true);
    }
    if (watermarkElement) {
        if (watermarkElement.getAttribute("data-position") == 'left-bottom' || watermarkElement.getAttribute("data-position") == 'right-bottom') {
            watermarkElement.style.setProperty('--bottom', footerTop.value);
            watermarkElement.setAttribute('data-observer', true);
        }
    }
    if (topElement) {
        topElement.style.setProperty('--bottom', footerTop.value);
        topElement.setAttribute('data-observer', true);
    }
    if (menuElement) {
        menuElement.style.setProperty('--bottom', footerTop.value);
        menuElement.setAttribute('data-observer', true);
    }
}
function triggerExitEvent() {
    const musicElement = document.querySelector(".g-music");
    const watermarkElement = document.querySelector(".g-watermark");
    const topElement = document.querySelector(".g-top");
    const menuElement = document.querySelector(".g-fixed.bottom");
    if (musicElement) {
        musicElement.style.setProperty('--bottom', '');
        musicElement.setAttribute('data-observer', false);
    }
    if (watermarkElement) {
        if (watermarkElement.getAttribute("data-position") == 'left-bottom' || watermarkElement.getAttribute("data-position") == 'right-bottom') {
            watermarkElement.style.setProperty('--bottom', '');
            watermarkElement.setAttribute('data-observer', false);
        }
    }
    if (topElement) {
        topElement.style.setProperty('--bottom', '');
        topElement.setAttribute('data-observer', false);
    }
    if (menuElement) {
        menuElement.style.setProperty('--bottom', footerTop.value);
        menuElement.setAttribute('data-observer', false);
    }
}
onMounted(async () => {
    loading.value = true;
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", previewConfig.value.pageTypeSeq);
    document.querySelector("body").className = "preview";
    footer.prod = previewConfig.value.gameName;
    footer.theme = previewConfig.value.footer == 1 ? 'light' : 'dark';
    // totalComponentCount.value = previewContent.value.length;
    let gAreaCount = 0;
    let totalSubContentLength = 0;
    const componentLength = previewContent.value.length;
    for (let i = 0; i < componentLength; i++) {
        if (previewContent.value[i].component === "GArea") {
            gAreaCount++;
            if (previewContent.value[i].content && previewContent.value[i].content.subContent) {
                totalSubContentLength += previewContent.value[i].content.subContent.length;
            }
        }
    }
    totalComponentCount.value = componentLength + totalSubContentLength;
    pageInfo(previewConfig);
    if (footer.prod == "櫻桃小丸子") {
        if (lanParams) {
            if (lanParams == "zh") {
                footer.prod = "櫻桃小丸子";
            } else {
                footer.prod = "櫻桃小丸子EN";
            }
        } else {
            if (lanBrowser == "zh") {
                footer.prod = "櫻桃小丸子";
            } else {
                footer.prod = "櫻桃小丸子EN";
            }
        }
        // 偵測Footer的加入
        setTimeout(() => {
            gf_updateFooter(footer)
        }, 0);
    } else {
        // 偵測Footer的加入
        setTimeout(() => {
            gf_updateFooter(footer)
        }, 0);
    }
    document.title = previewConfig.value.webtitle;
    if (Number(previewConfig.value.cookie) == 1) {
        if (document.querySelector("#cookieBarWrap")) {
            document.querySelector("#cookieBarWrap").classList.add("on");
        }
    }
    if (previewConfig.value.header == 1) {
        // topBar(previewConfig.value.gameName)
        if (previewConfig.value.gameName == "新瑪奇B") {
            previewConfig.value.gameName = "新瑪奇"
        }
        setTimeout(function () {
            (function (gobal) {
                var s = document.createElement("script");
                s.async = 1;
                s.src = "https://alpha-tw.beanfun.com/3KO/removable/pchome/js/topbar.js";
                s.id = "top-bar";
                //產品
                s.setAttribute("prod", previewConfig.value.gameName);

                $("head")
                    .append(s)
                    .ready(function () {
                        gobal.callTopBar;
                    });
            })(window);
        }, 0);
    }
    watch(componentCount, (newVal) => {
        if (newVal >= totalComponentCount.value) {
            loading.value = false;
        }
    });
    window.addEventListener('scroll', handleScroll);
})
onUnmounted(() => {
    console.log("onUnmounted")
    window.removeEventListener('scroll', handleScroll);
})
const cssVar = computed(() => {
    if (previewContent?.value.length > 0) {
        let bg = previewContent.value.filter((c, i) => {
            return c.component == "GBg"
        })
        if (bg.length) {
            return {
                "--color": bg[0].content.color,
                "--pc": `url(${bg[0].content.pc})`,
                "--mobile": `url(${bg[0].content.mobile ? bg[0].content.mobile : bg[0].content.pc})`,
                "--w": bg[0].content.w,
                "--h": bg[0].content.h,
                "--mw": bg[0].content.mw,
                "--mh": bg[0].content.mh,
            }
        }

    }
})
</script>
<template>
    <!-- <section class="page-preview">(預覽模式)</section> -->
    <GLoading :loading="loading"></GLoading>
    <section class="wrap" :data-type="previewConfig.pageTypeSeq" :style="cssVar">
        <template v-for="block in previewContent">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <GCookie v-if="(previewConfig.cookie == 1)" :data="previewConfig"></GCookie>
</template>