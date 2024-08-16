<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
// import components from "../Components1.js";
import components from "../Components.js";
import GLoading from "../components/GLoading.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, getBrowserLocales, getUrlSearchParams } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);
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
onMounted(() => {
    loading.value = true;
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    footer.prod = store.config.gameName || 'bf!遊戲';
    footer.theme = store.config.footer == 1 ? 'light' : 'dark';
    totalComponentCount.value = content.value.length;
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
            gf_updateFooter(footer)
        }, 0);
    } else {
        // 偵測Footer的加入
        setTimeout(() => {
            gf_updateFooter(footer)
        }, 0);
    }
    window.addEventListener('scroll', handleScroll);
    watch(componentCount, (newVal) => {
        if (newVal >= totalComponentCount.value) {
            loading.value = false;
        }
    });

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