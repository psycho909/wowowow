<script>
import GVideo from "./GVideo.vue";
import GText from "./GText.vue";
import GBg from "./GBg.vue";
import GSlogan from "./GSlogan.vue";
export default {
    name: "GArea",
    label: "區塊",
    order: 5,
    components: {
        GVideo, GText, GBg, GSlogan
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
const { page, content } = storeToRefs(store);
const props = defineProps(["data"])
let showEdit = ref(false);
let loading = ref(true);
let areaSetting = reactive({})
let areaData = reactive({});
let uid = ref(props.data.uid);
const initData = () => {
    return {
        subContent: [],
        mt: 0, mb: 0, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(areaData, initData());
watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(areaData, cloneDeep(props.data.content));
            Object.assign(areaSetting, cloneDeep(props.data.content));
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(areaData, cloneDeep(props.data.content));
        Object.assign(areaSetting, cloneDeep(props.data.content));
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
                "--mt": areaSetting.mt,
                "--mb": areaSetting.mb,
                "--mobile_mt": areaSetting.mobile_mt ? areaSetting.mobile_mt : areaSetting.mt,
                "--mobile_mb": areaSetting.mobile_mb ? areaSetting.mobile_mb : areaSetting.mb,
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

const contentFilter = computed(() => {
    if (content.value) {
        let area = content.value.filter((com, i) => {
            return com.component == 'GArea' && com.uid == uid.value
        })[0]

        if (area) {
            return area.content.subContent.filter((com, i) => {
                return com.component !== 'GBg' && com.component !== 'GFixed' && com.component !== 'GSlogan'
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
    store.updateCpt(props.data.uid, data);
    Object.assign(areaSetting, data);
}
const onReset = () => {
    Object.assign(areaData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
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
    if (e.added) {
        cpt = e.added.element;
        cptIndex = e.added.newIndex + 1;
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
    // if (e.moved) {
    //     cpt = e.moved;
    //     uid = e.moved.element.uid;
    //     cptIndex = e.moved.newIndex + 1;
    //     store.dragMoveCpt(uid, cptIndex);
    // }
}
</script>
<template>
    <div class="g-area" :style="cssVar" :class="[loading ? 'loading' : '']"
         v-if="page != 'EditPage'">
        <div class="g-area-container">
            <template v-for="block in areaSetting.subContent" :key="block.uid">
                <component :is="block.component" :data="block"></component>
            </template>
        </div>
    </div>
    <label class="g-area" :id="uid" :style="cssVar"
           :class="[loading ? 'loading' : '', store.group.name == uid ? 'focus' : '']" v-else>
        <input type="radio" name="area" :id="uid" :value="uid" @change="handleArea">
        <template v-if="contentBg.length">
            <component is="GBg" :data="contentBg[0]" :sub="true"></component>
        </template>
        <template v-if="contentSlogan.length">
            <component is="GSlogan" :data="contentSlogan[0]" :sub="true"></component>
        </template>
        <div class="g-area-container">
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
                       v-if="store.page == 'EditPage'">

                <template #item="{ element }">
                    <component :is="element.component" :data="element" :sub="true"></component>
                </template>
            </draggable>
            <template v-for="block in contentFilter" :key="block.uid" v-else>
                <component :is="block.component" :data="block"></component>
            </template>
            <g-modify :uid="data.uid" v-if="page == 'EditPage'" />
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
                        <g-input label="PC間距上:" type="number" v-model="areaData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="areaData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="areaData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="areaData.mobile_mb" @change="handleNumber" />
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