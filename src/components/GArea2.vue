<script>
import GVideo from "./GVideo.vue";
import GText from "./GText.vue";
import GSlide from "./GSlide.vue";
import GImg from "./GImg.vue";
import GBg from "./GBg.vue";
import GSlogan from "./GSlogan.vue";
import GIcon from "./GIcon.vue";
import GLogo from "./GLogo.vue";
import GDNImg from "./GDNImg.vue";
import GDNNav from "./GDNNav.vue";
export default {
    name: "GArea",
    label: "增加頁面",
    order: 5,
    components: {
        GVideo, GImg, GText, GBg, GSlogan, GIcon, GLogo, GDNImg, GDNNav, GSlide
    }
}
</script>
<script setup>
import draggable from "vuedraggable";
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import { cloneDeep } from 'lodash-es'
import { handleNumber } from "../Tool";
const store = mainStore()
const { page, content, group, pageTypeSeq, tempGroup } = storeToRefs(store);
const props = defineProps(["data"])
let showEdit = ref(false);
let loading = ref(true);
let areaSetting = reactive({})
let areaData = reactive({});
let uid = ref(props.data.uid);
const validPreviousComponents = ["GLang", "GBg", "GFixed", "GIcon", "GLogo", "GDNNav", "GDNImg"];
const initData = () => {
    return {
        subContent: [],
        pc: {
            paddingTop: 80,
            paddingBottom: 80,
        },
        mobile: {
            paddingTop: 100,
            paddingBottom: 100,
        }
    }
}
Object.assign(areaData, initData());
watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(areaData, cloneDeep(props.data.content));
            Object.assign(areaSetting, cloneDeep(props.data.content));
            await nextTick()
            if (!isMobile.any) {
                let height = 0;
                let area = document.querySelector(".g-area[data-page='main']");
                if (document.querySelector(".g-fixed.top")) {
                    height = document.querySelector(".g-fixed.top").clientHeight;
                    area.style.marginTop = height + 'px'
                } else {
                    area.style.marginTop = height + 'px'
                }
            }
            if (areaData.pc == undefined) {
                areaData.pc.paddingTop = 80;
                areaData.pc.paddingBottom = 80;
            }
            if (areaData.mobile == undefined) {
                areaData.mobile.paddingTop = 100;
                areaData.mobile.paddingBottom = 100;
            }
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(areaData, cloneDeep(props.data.content));
        Object.assign(areaSetting, cloneDeep(props.data.content));
        await nextTick()
        if (!isMobile.any) {
            let height = 0;
            let area = document.querySelector(".g-area[data-page='main']");
            if (document.querySelector(".g-fixed.top")) {
                height = document.querySelector(".g-fixed.top").clientHeight;
                area.style.marginTop = height + 'px'
            } else {
                area.style.marginTop = height + 'px'
            }
        }
    }
})

const cssVar = computed(() => {
    let varData = {};
    if (Object.keys(areaSetting).length > 0) {
        if (areaSetting.subContent) {
            let bg = areaSetting.subContent.filter((c, i) => {
                return c.component == "GBg"
            })
            varData = {
                "--pc-padding-top": areaSetting?.pc?.paddingTop ? areaSetting.pc.paddingTop : 80,
                "--pc-padding-bottom": areaSetting?.pc?.paddingBottom ? areaSetting.pc.paddingBottom : 80,
                "--mobile-padding-top": areaSetting?.mobile?.paddingTop ? areaSetting.mobile.paddingTop : 100,
                "--mobile-padding-bottom": areaSetting?.mobile?.paddingBottom ? areaSetting.mobile.paddingBottom : 100,
            }
            if (bg[0]) {
                varData = {
                    ...varData,
                    "--area-color": bg[0].content.color,
                    "--area-pc": `url(${bg[0].content.pc})`,
                    "--area-mobile": `url(${bg[0].content.mobile ? bg[0].content.mobile : bg[0].content.pc})`,
                    "--area-w": bg[0].content.w,
                    "--area-h": bg[0].content.h,
                    "--area-mw": bg[0].content.mw,
                    "--area-mh": bg[0].content.mh,
                }
            }
            return varData
        }
    }
})
const contentBg = computed(() => {
    if (content.value) {
        let area = content.value.filter((com, i) => {
            return com.component == 'GArea' && com.uid == uid.value
        })[0]
        if (area) {
            return area.content.subContent.filter((s, i) => {
                return s.component == 'GBg'
            })
        }
    }
})
const contentSlogan = computed(() => {
    if (content.value) {
        let area = content.value.filter((com, i) => {
            return com.component == 'GArea' && com.uid == uid.value
        })[0]
        if (area) {
            return area.content.subContent.filter((s, i) => {
                return s.component == 'GSlogan'
            })
        }
    }

})

const fixedFilter = computed(() => {
    if (content.value) {
        let area = content.value.filter((com, i) => {
            return com.component == 'GArea' && com.uid == uid.value
        })[0]

        if (area) {
            return area.content.subContent.filter((com, i) => {
                return validPreviousComponents.includes(com.component)
            })
        }
    }
})

const contentFilter = computed(() => {
    if (content.value) {
        let area = content.value.filter((com, i) => {
            return com.component == 'GArea' && com.uid == uid.value
        })[0]

        if (area) {
            return area.content.subContent.filter((com, i) => {
                return !validPreviousComponents.includes(com.component)
            })
        }
    }
})
const openPop = (data) => {
    data.pop.show = true
}
const onSubmit = async () => {
    let data = {}

    $("#loadingProgress").show();
    data = cloneDeep(areaData);
    store.updateCpt(props.data.uid, data, props.sub);
    Object.assign(areaSetting, data);
}
const onReset = () => {
    Object.assign(areaData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        store.setCurrentArea(tempGroup.value.name)
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(areaData, cloneDeep(props.data.content));
    } else {
        Object.assign(areaData, initData());
    }
    showEdit.value = false;
    props.data.update = false;
}

const handleArea = () => {
    store.setCurrentArea(uid.value)
}

const log = (e) => {
    let cpt;
    let cptIndex;
    let uid;
    let temp = 0;
    if (contentSlogan.value.length) {
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
        store.drgAddSubCpt(props.data.uid, data, cptIndex);
        store.setUpdateTime();
        if (store.first) {
            store.setFirst(false);
        }
    }
    if (e.moved) {
        uid = e.moved.element.uid;
        cptIndex = e.moved.newIndex + temp;
        store.dragMoveCpt(uid, cptIndex, true);
    }
}
</script>
<template>
    <div class="g-area" :id="uid" :style="cssVar" :data-page="[uid == 1 ? 'main' : '']"
         v-if="page != 'EditPage'">
        <div class="g-area-container">
            <template v-for="block in areaSetting.subContent" :key="block.uid">
                <component :is="block.component" :data="block"></component>
            </template>
        </div>
    </div>
    <label :id="uid" :class="['g-area', uid == 1 ? 'filtered' : '', store.group.name == uid ? 'focus' : '']" :style="cssVar"
           :data-page="[uid == 1 ? 'main' : '']"
           v-else>
        <input type="radio" name="area" :id="uid" :value="uid" @change="handleArea">
        <!-- <template v-if="contentBg.length">
            <component is="GBg" :data="contentBg[0]" :sub="true"></component>
        </template> -->
        <div class="g-area-container">
            <template v-if="fixedFilter.length">
                <template v-for="block in fixedFilter">
                    <component :is="block.component" :data="block" :sub="true"></component>
                </template>
            </template>
            <draggable
                       class="dragArea list-group"
                       :list="contentFilter"
                       :force-fallback="true"
                       :fallback-tolerance="1"
                       :scroll-sensitivity="100"
                       :animation="300"
                       :group="uid"
                       item-key="uid"
                       @change="log"
                       v-if="store.page == 'EditPage' && props.data.uid != 1">

                <template #item="{ element }">
                    <component :is="element.component" :data="element" :sub="true"></component>
                </template>
            </draggable>
            <template v-for="block in contentFilter" :key="block.uid" v-else>
                <component :is="block.component" :data="block" :sub="true"></component>
            </template>
            <template v-if="uid == 1">
                <g-modify :uid="data.uid" :edit="false" :move="false" v-if="page == 'EditPage'" />
            </template>
            <template v-else>
                <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
            </template>
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC內間距上:" type="number" v-model="areaData.pc.paddingTop" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC內間距下:" type="number" v-model="areaData.pc.paddingBottom" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile內間距上:" type="number" v-model="areaData.mobile.paddingTop"
                                 @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile內間距下:" type="number" v-model="areaData.mobile.paddingBottom"
                                 @change="handleNumber" />
                    </div>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </label>
</template>