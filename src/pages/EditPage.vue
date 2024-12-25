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
import { UpdateEventContent, ApproveEvent, GetPageType } from "../api";
import GLoading from "../components/GLoading.vue";
import draggable from "vuedraggable";
import { onUnmounted } from 'vue';

const store = mainStore()
const t = templateStore()
const { content, loading, pageTypeSeq } = storeToRefs(store);
let saveLightbox = ref(false);
let approveLightbox = ref(false);
let approveEndLightbox = ref(false);
let homeLightbox = ref(false);
let eventListLightbox = ref(false);
let messageText = ref("");
let messageLightbox = ref(false);
let gAreas = ref([]);
let isObserving = ref(true);
let footerTop = ref(null);
const componentCount = ref(0);
const totalComponentCount = ref(0);
provide('$addComponent', () => {
    componentCount.value += 1;
});
provide('$componentCount', componentCount);
if (store.content.length == 0 && (store.config.flag == 0 || store.config.flag == 4)) {
    store.setContent(JSON.parse(JSON.stringify(t.template[store.config.pageTypeSeq].content)));
}
if (store.config.flag == 2 && store.content.length == 0) {
    store.setContent(JSON.parse(JSON.stringify(t.template[store.config.pageTypeSeq].content)));
}
// store.toggleLoading(true)

let gAreaComponents = computed(() => {
    return content.value.filter((v, i) => {
        return v.component === "GArea"
    })
})

// 當pageTypeSeq == 1，content.value.length > 0時，檢查裡面的update為true時，改為false,，如果conrent為empty時則移除
if (store.pageTypeSeq == 1 && content.value.length > 0) {
    content.value = content.value.map(item => {
        if (item.update === true) {
            return { ...item, update: false };
        }
        return item;
    }).filter(item => Object.keys(item).length > 0); // Remove empty content
}
// 當pageTypeSeq == 2，content.value.length > 0時，檢查裡面的update為true時，改為false,，如果conrent為empty時則移除，當component == GArea時，裡面的content.subContent.length > 0時，檢查裡面的update為true時，改為false,，如果conrent為empty時則移除+
if (store.pageTypeSeq == 2 && content.value.length > 0) {
    content.value = content.value.map(item => {
        // Handle GArea components
        if (item.component === "GArea" && item.content && item.content.subContent) {
            // Process subContent within GArea
            item.content.subContent = item.content.subContent
                .map(subItem => {
                    if (subItem.update === true) {
                        return { ...subItem, update: false };
                    }
                    return subItem;
                })
                .filter(subItem => Object.keys(subItem).length > 0); // Remove empty subContent
        }

        // Handle update flag for main item
        if (item.update === true) {
            return { ...item, update: false };
        }
        return item;
    }).filter(item => Object.keys(item).length > 0); // Remove empty content
}

console.log(content.value)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getVisibility(rect) {
    const windowHeight = window.innerHeight;
    const top = Math.max(0, rect.top);
    const bottom = Math.min(windowHeight, rect.bottom);
    return (bottom - top) / rect.height;
}

const handleScroll = debounce(() => {
    if (store.pageTypeSeq == 2) {
        let maxVisibleArea = null;
        let maxVisibility = 0;

        gAreas.value.forEach((gArea, index) => {
            const gAreaRect = gArea.getBoundingClientRect();
            const visibility = getVisibility(gAreaRect);

            if (visibility > maxVisibility) {
                maxVisibility = visibility;
                maxVisibleArea = {
                    group: gAreaComponents.value[index].group,
                    uid: gAreaComponents.value[index].uid
                };
            }
        });

        // 只有当可见度超过 50% 时才更新
        if (maxVisibleArea && maxVisibility > 0.3) {
            store.setCurrentArea(maxVisibleArea.group);
            store.setTargetArea(maxVisibleArea.uid);
        }
        // gAreas.value.forEach((gArea, index) => {
        //     const gAreaRect = gArea.getBoundingClientRect();
        //     if (gAreaRect.top <= window.innerHeight && gAreaRect.bottom >= 0) {
        //         store.setCurrentArea(gAreaComponents.value[index].group)
        //         store.setTargetArea(gAreaComponents.value[index].uid)
        //     }
        // });
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
    } else {
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
}, 100); // 100ms 的防抖延迟

watch(content.value, (newVal) => {
    gAreas.value = document.querySelectorAll(".g-area")
})

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
    document.getElementsByTagName("HTML")[0].setAttribute("data-type", store.config.pageTypeSeq)
    document.querySelector("#app").classList.add("edit");
    let gAreaCount = 0;
    let totalSubContentLength = 0;
    const componentLength = content.value.length;
    if (store.pageTypeSeq == 2) {
        for (let i = 0; i < componentLength; i++) {
            if (content.value[i].component === "GArea") {
                gAreaCount++;
                if (content.value[i].content && content.value[i].content.subContent) {
                    totalSubContentLength += content.value[i].content.subContent.length;
                }
            }
        }
        handleArea(1)
        store.setTargetArea(1)
        gAreas.value = document.querySelectorAll(".g-area")
        // window.addEventListener('scroll', handleScroll);
    } else {
        handleArea("main")
    }
    window.addEventListener('scroll', handleScroll);
    totalComponentCount.value = componentLength + totalSubContentLength;
    watch(componentCount, (newVal) => {
        if (newVal >= totalComponentCount.value) {
            // if (store.pageTypeSeq == 2) {
            //     handleScroll()
            // }
            // store.toggleLoading(false)
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === 's' && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            if (loading.value) {
                return;
            }
            loadingShow();
            var data = store.config;
            data.detail = JSON.stringify(store.content);
            Object.keys(data).forEach((v, i) => {
                if (data[v] == null) {
                    data[v] = "";
                }
            })
            messageText.value = "";
            UpdateEventContent(store.otp, data).then((res) => {
                let { code, message, url, listData } = res.data;
                if (code != 1) {
                    messageText.value = message;
                    messageLightbox.value = true;
                    loadingHide()
                    return { code };
                }
                return {
                    code, data, message, url
                };
            }).then((res) => {
                if (res.code == 1) {
                    store.setStorageState(store.$state, "EditPage");
                    store.setUpdateTime();
                    store.setSave(true);
                    messageText.value = "已存檔完成";
                    messageLightbox.value = true;
                } else {
                    messageText.value = `存檔失敗 ${res.message}`;
                    messageLightbox.value = true;
                }
            }).finally(() => {
                loadingHide()
            })
        }
    }, false);
})
onUnmounted(() => {
    console.log("onUnmounted")
    window.removeEventListener('scroll', handleScroll);
})
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

const checkInit = computed(() => {
    if (pageTypeSeq.value == 1) {
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
            if (Object.keys(content.value).length >= 3 || Object.keys(content.value).length == 1) {
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
    }
    if (pageTypeSeq.value == 2) {
        if (content.value.length > 1) {
            return true
        } else {
            var areaMain = content.value.find((v, i) => {
                return v.name == 'home';
            });
            if (areaMain.content.subContent.length > 0) {
                var checkBg = areaMain.content.subContent.find((v, i) => {
                    return v.component == "GBg"
                })
                var checkIcon = areaMain.content.subContent.find((v, i) => {
                    return v.component == "GIcon"
                })
                var checkLogo = areaMain.content.subContent.find((v, i) => {
                    return v.component == "GLogo"
                })
                var checkNav = areaMain.content.subContent.find((v, i) => {
                    return v.component == "GDNNav"
                })
                var checkImg = areaMain.content.subContent.find((v, i) => {
                    return v.component == "GDNImg"
                })
                if (areaMain.content.subContent.length == 1) {
                    return true;
                } else {
                    if (checkBg && checkIcon && checkNav && checkImg && checkLogo) {
                        var b = areaMain.content.subContent.filter((v, i) => {
                            return (v.component == "GBg" && !v.init) || (v.component == "GIcon" && !v.init) || (v.component == "GLogo" && !v.init) || (v.component == "GDNNav" && !v.init) || (v.component == "GDNImg" && !v.init);
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
            order: components[m].order,
            type: components[m].type
        }
    });
})

const contentFilter = computed(() => {
    return content.value.filter((com, i) => {
        return com.component !== 'GBg' && com.component !== 'GFixed' && com.component !== 'GSlogan' && com.component !== 'GTop' && com.component !== 'GWatermark' && com.component !== 'GMusic' && com.component !== 'GLang'
    })
})

const contentBg = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GBg'
    })
})

const contentFixed = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GFixed'
    })
})

const contentSlogan = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GSlogan'
    })
})

const contentTop = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GTop'
    })
})

const contentWatermark = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GWatermark'
    })
})

const contentMusic = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GMusic'
    })
})

const contentLang = computed(() => {
    return content.value.filter((com, i) => {
        return com.component == 'GLang'
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
            console.log(checkInit.value)
            if (!checkInit.value) {
                messageText.value = "請先編輯內容";
                messageLightbox.value = true;
                return;
            }
            GetPageType(store.otp)
            store.setStorageState(store.$state, "EditPage").then((res) => {
                store.setPage("Preview", {
                    eventSeq: store.$state.config.eventSeq,
                    gameseq: store.$state.config.gameseq,
                });
            }).catch((err) => {
                messageText.value = `文字區塊內使用的圖片容量過大</br>
                無法正常使用預覽功能</br>
                請改用圖片區塊+文字區塊來呈現，謝謝！`;
                messageLightbox.value = true;
            });

            break;
        case "save":
            loadingShow();
            messageText.value = "";
            UpdateEventContent(store.otp, data).then((res) => {
                let { code, message, url, listData } = res.data;
                if (code != 1) {
                    messageText.value = message;
                    messageLightbox.value = true;
                    loadingHide()
                    return { code };
                }
                return {
                    code, data, message, url
                };
            }).then((res) => {
                if (res.code == 1) {
                    store.setStorageState(store.$state, "EditPage");
                    store.setUpdateTime();
                    store.setSave(true);
                    messageText.value = "已存檔完成";
                    messageLightbox.value = true;
                } else {
                    messageText.value = `存檔失敗 ${res.message}`;
                    messageLightbox.value = true;
                }
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
    let temp = 0;
    GetPageType(store.otp)
    if (contentBg.value.length) {
        temp += 1;
    }
    if (contentFixed.value.length) {
        temp += 1;
    }
    if (contentSlogan.value.length) {
        temp += 1;
    }
    if (contentTop.value.length) {
        temp += 1;
    }
    if (contentWatermark.value.length) {
        temp += 1;
    }
    if (contentMusic.value.length) {
        temp += 1;
    }
    if (contentLang.value.length) {
        temp += 1;
    }
    if (e.added) {
        cpt = e.added.element;
        cptIndex = e.added.newIndex + temp;
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
        cptIndex = e.moved.newIndex + temp;
        store.dragMoveCpt(uid, cptIndex);
    }
}

const moveLog = () => {
    // console.log("move")
}
const startLog = () => {
    console.log("start")
}

const handleArea = (type) => {
    store.setCurrentArea(type)
}
</script>
<template>
    <GLoading :loading="loading"></GLoading>
    <label for="component" class="wrap development"
           :data-type="store.config.pageTypeSeq" :style="cssVar"
           :class="[store.group.name == 'main' && store.config.pageTypeSeq != 1 ? 'focus' : '']">
        <input id="component" type="radio" name="area" value="main" checked @change="handleArea">
        <template v-if="contentBg.length">
            <component is="GBg" :data="contentBg[0]"></component>
        </template>
        <template v-if="contentSlogan.length">
            <component is="GSlogan" :data="contentSlogan[0]"></component>
        </template>
        <template v-if="contentFixed.length">
            <template v-if="contentFixed.length > 1">
                <template v-for="f in contentFixed">
                    <component is="GFixed" :data="f"></component>
                </template>
            </template>
            <template v-else>
                <component is="GFixed" :data="contentFixed[0]"></component>
            </template>
        </template>
        <template v-if="contentTop.length">
            <component is="GTop" :data="contentTop[0]"></component>
        </template>
        <template v-if="contentWatermark.length">
            <component is="GWatermark" :data="contentWatermark[0]"></component>
        </template>
        <template v-if="contentMusic.length">
            <component is="GMusic" :data="contentMusic[0]"></component>
        </template>
        <template v-if="contentLang.length">
            <component is="GLang" :data="contentLang[0]"></component>
        </template>
        <draggable class="dragArea list-group" :class="[checkInit ? '' : 'checkInit']" :list="contentFilter"
                   :force-fallback="true" :fallback-tolerance="1" :scroll-sensitivity="100" :animation="300"
                   filter=".filtered"
                   @start="startLog" @change="log" @move="moveLog" group="main" item-key="uid">

            <template #item="{ element }">
                <component :is="element.component" :data="element"></component>
            </template>
        </draggable>

    </label>
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
            <div v-html="messageText"></div>
        </template>
    </g-lightbox>
</template>