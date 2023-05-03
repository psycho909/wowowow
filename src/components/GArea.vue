<script>
import GVideo from "./GVideo.vue";
import GText from "./GText.vue";
export default {
    name: "GArea",
    label: "區塊",
    order: 5,
    components: {
        GVideo, GText
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
const { page } = storeToRefs(store);
const props = defineProps(["data"])
let showEdit = ref(false);
let loading = ref(true);
let areaSetting = reactive({})
let areaData = reactive({});
let uid = ref(props.data.uid);
const initData = () => {
    return {
        subContent: [],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
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
    return {
        "--mt": props?.data.content.mt,
        "--mb": props?.data.content.mb,
        "--mobile_mt": props?.data.content.mobile_mt ? props?.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props?.data.content.mobile_mb ? props?.data.content.mobile_mb : props.data.content.mb,
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
        store.removeCpt(props.data.uid);
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



const log = (e) => {
    let cpt;
    let cptIndex;
    let uid;
    console.log(e)
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
    <div class="g-area" :style="cssVar" :class="[loading ? 'loading' : '']">
        <div class="g-area-container">
            <draggable
                       class="dragArea list-group"
                       :list="areaSetting.subContent"
                       :force-fallback="true"
                       :fallback-tolerance="1"
                       :scroll-sensitivity="100"
                       :animation="300"
                       :group="uid"
                       item-key="uid"
                       @change="log"
                       v-if="store.page == 'EditPage'">

                <template #item="{ element }">
                    <component :is="element.component" :data="element"></component>
                </template>
            </draggable>
            <template v-for="block in areaSetting.subContent" :key="block.uid" v-else>
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
    </div>
</template>