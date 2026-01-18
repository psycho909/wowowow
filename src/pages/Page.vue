<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GLoading from "../components/GLoading.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, getBrowserLocales, getUrlSearchParams } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);
let lanBrowser = getBrowserLocales()[0];
let lanParams = getUrlSearchParams("lan");
const loading = ref(false);
let isObserving = ref(true);
let footerTop = ref(null);

const cssVar = computed(() => {
    if (content.value.length > 0) {
        let bg = content.value.filter((c, i) => {
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
function loadCSS(url) {
    const timestamp = new Date().getTime(); // 生成唯一時間戳
    const fullUrl = `${url}?_=${timestamp}`; // 加上時間戳參數
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fullUrl; // 動態設置 href

    document.head.appendChild(link); // 加入到 <head> 中
}
function fetchNonCachedJS(url) {
    // 使用時間戳動態產生唯一查詢參數
    const nonCachedUrl = `${url}?_=${new Date().getTime()}`;

    const script = document.createElement("script");
    script.src = nonCachedUrl;

    return new Promise((resolve, reject) => {
        script.onload = () => {
            console.log("成功載入最新JS資料");
            // 設置全局標記
            window.isExternalJSLoaded = true;
            // 觸發自定義事件
            window.dispatchEvent(new Event("externalJSLoaded"));
            resolve();
        };
        script.onerror = (error) => {
            console.error("獲取JS時發生錯誤:", error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}
onMounted(async () => {
    // loading.value = true;
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    footer.prod = store.config.gameName || 'bf!遊戲';
    footer.theme = store.config.footer == 1 ? 'light' : 'dark';
    document.querySelector("body").setAttribute("id", `e${store.config.eventSeq}`);
    loadCSS("https://tw.hicdn.beanfun.com/beanfun/GamaWWW/WGD/Web/assets/css/fix.css")
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
        // gameFooter(footer);
        // 偵測Footer的加入
        setTimeout(() => {
            try {
                gf_updateFooter(footer)
            } catch (e) {
                console.log(e)
            }
        }, 0);
    } else {
        if (footer.prod == "全產品") {
            footer.prod = "bf!遊戲"
        }
        if (footer.prod == "便利商店") {
            footer.prod = "便利商店口袋版"
        }
        if (footer.prod == "波拉西亞戰記") {
            footer.prod = "波拉西亞"
        }
        if (footer.prod == "救世者之樹") {
            footer.prod = "救世者之樹M"
        }
        // 偵測Footer的加入
        setTimeout(() => {
            try {
                gf_updateFooter(footer)
            } catch (e) {
                console.log(e)
            }
        }, 0);
    }
    window.addEventListener('scroll', handleScroll);
    await fetchNonCachedJS("https://tw.hicdn.beanfun.com/beanfun/GamaWWW/WGD/Web/js/fix.js")
})
onUnmounted(() => {
    console.log("onUnmounted")
    window.removeEventListener('scroll', handleScroll);
})
</script>
<template>
    <GLoading :loading="loading"></GLoading>
    <section class="wrap" :data-type="store.config.pageTypeSeq" :style="cssVar">
        <template v-for="block in content">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
</template>