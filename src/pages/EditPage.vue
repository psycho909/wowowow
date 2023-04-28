<script>
export default {
    components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "../Components.js";
import GMenu from "../components/GMenu.vue";
import { mainStore } from "../store/index";
import { templateStore } from "../store/template";
import GLightbox from "../components/GLightbox.vue";
import { loadingShow, loadingHide } from "../Tool";
import { UpdateEventContent, ApproveEvent } from "../api";
import draggable from "vuedraggable";

const store = mainStore()
const t = templateStore()
const { content } = storeToRefs(store);
let saveLightbox = ref(false);
let approveLightbox = ref(false);
let approveEndLightbox = ref(false);
let homeLightbox = ref(false);
let eventListLightbox = ref(false);
let messageText = ref("");
let messageLightbox = ref(false);

onMounted(() => {
    if (store.content.length == 0 && (store.config.flag == 0 || store.config.flag == 4)) {
        store.setContent(JSON.parse(JSON.stringify(t.template[store.config.pageTypeSeq].content)));
    }
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
})

const cssVar = computed(() => {
    if (content.value.length > 0) {
        let bg = content.value.filter((c, i) => {
            return c.component == "GBg"
        })
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
})

const checkInit = computed(() => {
    if (content.value.length > 0) {
        var a = content.value.map((v, i) => {
            return v.component;
        });
        var checkBG = a.find((v, i) => {
            return v == "GBg";
        });
        var checkSlogan = a.find((v, i) => {
            return v == "GSlogan";
        });
        if (Object.keys(content.value).length > 3 || Object.keys(content.value).length == 1) {
            return true;
        } else {
            if (checkBG && checkSlogan) {
                var b = content.value.filter((v, i) => {
                    return (v.component == "GBg" && !v.init) || (v.component == "GSlogan" && !v.init);
                });
                if (b.length > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    }
})

const menu = computed(() => {
    return Object.keys(components).map((m, i) => {
        return {
            title: m,
            label: components[m].label,
            limit: components[m].limit || 0,
            status: true,
            order: components[m].order
        }
    });
})

const contentFilter = computed(() => {
    return content.value.filter((com, i) => {
        return com.component !== 'GBg'
    })
})

const onEvent = (type) => {
    var data = store.config;
    data.detail = JSON.stringify(store.content);
    Object.keys(data).forEach((v, i) => {
        if (data[v] == null) {
            data[v] = "";
        }
    })
    switch (type) {
        case "home":
            homeLightbox.value = true;
            break;
        case "approve":
            approveLightbox.value = true;
            break;
        case "preview":
            store.setStorageState(store.$state, "EditPage");
            store.setPage("Preview");
            break;
        case "save":
            loadingShow();
            UpdateEventContent(store.otp, data).then((res) => {
                let { code, message, url, listData } = res.data;
                if (code != 1) {
                    messageText.value = message;
                    messageLightbox.value = true;
                    loadingHide()
                    return;
                }
                return data;
            }).then((res) => {
                store.setStorageState(store.$state, "EditPage");
                store.setUpdateTime();
                store.setSave(true);
                saveLightbox.value = true;
            }).finally(() => {
                loadingHide()
            })
            break;
        case "eventList":
            eventListLightbox.value = true;
            break;
    }
}

const onApproveSubmit = () => {
    if (store.config.flag == 4 && !store.save) {
        approveLightbox.value = false;
        messageText.value = "請先存檔在送審";
        messageLightbox.value = true;
        return;
    }
    loadingShow();
    var data = store.config;
    data.detail = JSON.stringify(store.content);
    data.flag = 1;
    Object.keys(data).forEach((v, i) => {
        if (data[v] == null) {
            data[v] = "";
        }
    })
    UpdateEventContent(store.otp, data).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            loadingHide()
            return;
        }
        return ApproveEvent(store.otp, data);
    }).then((res) => {
        if (res) {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                messageText.value = message;
                messageLightbox.value = true;
                loadingHide()
                return;
            }
            approveLightbox.value = false;
            return data;
        }
    }).then((res) => {
        approveEndLightbox.value = true;
    }).finally(() => {
        loadingHide()
    });
}

const onApproveEnd = () => {
    store.setSave(true);
    store.setPage("EventList")
}

const onHomeSubmit = () => {
    store.setInit();
    store.setPage("Home")
    t.$reset();
}

const onEventListSubmit = () => {
    store.setPage("EventList");
    t.$reset();
}

const onCancel = (type) => {
    if (type == "回首頁") {
        homeLightbox.value = false;
    }
    if (type == "送審") {
        approveLightbox.value = false;
    }
    if (type == "列表") {
        eventListLightbox.value = false;
    }
}
const log = (e) => {
    console.log("change")
    let cpt;
    let cptIndex;
    let uid;
    if (e.added) {
        cpt = e.added.element;
        cptIndex = e.added.newIndex + 1;
        if (!cpt.status) {
            return;
        }
        let data = {
            cpt: cpt.title
        };
        store.drgAddCpt(data, cptIndex);
        store.setUpdateTime();
        if (store.first) {
            store.setFirst(false);
        }
    }
    if (e.moved) {
        cpt = e.moved;
        uid = e.moved.element.uid;
        cptIndex = e.moved.newIndex + 1;
        store.dragMoveCpt(uid, cptIndex);
    }
}

const moveLog = () => {
    console.log("move")
}
const startLog = () => {
    console.log("start")
}
</script>
<template>
    <section class="wrap development" :data-type="store.config.pageTypeSeq" :style="cssVar">
        <component is="GBg" :data="content[0]"></component>
        <draggable
                   class="dragArea list-group"
                   :list="contentFilter"
                   :force-fallback="true"
                   :fallback-tolerance="1"
                   :scroll-sensitivity="100"
                   :animation="300"
                   @start="startLog"
                   @change="log"
                   @move="moveLog"
                   group="component"
                   item-key="uid">

            <template #item="{ element }">
                <component :is="element.component" :data="element"></component>
            </template>
        </draggable>
        <img v-if="!checkInit" style="display:block;margin:0 auto;max-width: 100%;"
             src="https://alpha-tw.beanfun.com/3KO/removable/pchome/images/component.png" alt="">
    </section>
    <g-menu :menu="menu" />
    <div class="page-control__group">
        <a href="javascript:;" class="page-control__btn" @click="onEvent('save')">存檔</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('preview')">預覽</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('approve')">送審</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('eventList')">回列表</a>
        <a href="javascript:;" class="page-control__btn" @click="onEvent('home')">回首頁</a>
    </div>

    <!-- 回首頁 -->
    <g-lightbox v-model:showLightbox="homeLightbox">
        <template #lightbox-content>
            <div class="text-center">若尚未存檔會遺失目前設定，是否確定回到首頁</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onHomeSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel('回首頁')">取消</a>
        </template>
    </g-lightbox>
    <!-- 回列表 -->
    <g-lightbox v-model:showLightbox="eventListLightbox">
        <template #lightbox-content>
            <div class="text-center">若尚未存檔會遺失目前設定，是否確定回到列表</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onEventListSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel('列表')">取消</a>
        </template>
    </g-lightbox>

    <!-- 送審 -->
    <g-lightbox v-model:showLightbox="approveLightbox">
        <template #lightbox-content>
            <div class="text-center">送審前請先確認已存檔！是否確定送審活動【{{ store.config.eventName }}】送審後將無法繼續編輯，是否確認送審？</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onApproveSubmit">確認</a>
            <a href="javascript:;" class="btn btn__reset" @click="onCancel('送審')">取消</a>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="approveEndLightbox" :close="false">
        <template #lightbox-content>
            <div class="text-center">已送審成功</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onApproveEnd">確認</a>
        </template>
    </g-lightbox>

    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="saveLightbox">
        <template #lightbox-content>
            <div class="text-center">已存檔完成</div>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ messageText }}</div>
        </template>
    </g-lightbox>
</template>