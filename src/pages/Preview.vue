<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GCookie from "../components/GCookie.vue";
import { mainStore } from "../store/index";
import { loadingShow, loadingHide, pageInfo, getBrowserLocales, getUrlSearchParams } from "../Tool";
// import gameFooter from "../gameFooter";
import topBar from "../topBar";
const store = mainStore()
let state = null;
let lanBrowser = getBrowserLocales()[0];
let lanParams = getUrlSearchParams("lan");

if (window.localStorage.getItem("state")) {
    // state = JSON.parse(window.sessionStorage.getItem("state"));
    state = JSON.parse(window.localStorage.getItem("state"));
    store.setState(state);
}
let { previewConfig, previewContent } = storeToRefs(store);
let footer = {}

onMounted(async () => {
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", previewConfig.value.pageTypeSeq);
    document.querySelector("body").className = "preview";
    footer.prod = previewConfig.value.gameName;
    footer.theme = previewConfig.value.footer == 1 ? 'light' : 'dark';

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

})
const bg = computed(() => {
    return previewContent.value.filter((c, i) => {
        return c.component == "GBg"
    })[0].content
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
    <section class="wrap" :data-type="previewConfig.pageTypeSeq" :style="cssVar">
        <template v-for="block in previewContent">
            <component :is="block.component" :data="block"></component>
        </template>
    </section>
    <GCookie v-if="(previewConfig.cookie == 1)" :data="previewConfig"></GCookie>
</template>