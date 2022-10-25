<script>
export default {
    name: "GText",
    label: "純文字區塊"
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GCkedit from '../elements/GCkedit.vue';
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import colors, { style1, style2 } from "../colors";

const props = defineProps(["data"])
let showEdit = ref(false);
let textSetting = ref({})
let textData = reactive({
    align: "align-left",
    style: "red1",
    text: "",
    mt: 0, mb: 54
})

const store = mainStore()
const { content, MODE, page } = storeToRefs(store);

watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (props.data) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    }
})
const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    }
})


const onSubmit = () => {
    let data = { ...textData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    } else {
        textData = {
            align: "align-left",
            style: "red1",
            text: "",
            mt: 0, mb: 54
        }
    }
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    } else {
        textData = {
            align: "align-left",
            style: "red1",
            text: "",
            mt: 0, mb: 54
        }
    }
    showEdit.value = false;
    props.data.update = false;
}
</script>
<template>
    <div class="g-text" :class="[textSetting.align]" :style="[colors[textSetting.style],cssVar]">
        <div class="g-text-container">
            <div class="g-text__content" v-html="textSetting.text"></div>
            <g-modify :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">文字區塊物件<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">對其方向:</div>
                    <g-radio label="左" name="align" value="align-left" v-model="textData.align" />
                    <g-radio label="中" name="align" value="align-center" v-model="textData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              v-model="textData.style" />
                </div>
                <div class="g-edit__row">
                    <g-ckedit v-model="textData.text" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="間距上:" v-model="textData.mt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="間距下:" v-model="textData.mb" />
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