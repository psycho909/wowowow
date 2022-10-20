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
import { mainStore } from "../store/index";
import colors, { style1, style2 } from "../colors";

const props = defineProps(["data"])
let showEdit = ref(false);
let textSetting = ref({})
let textData = reactive({
    align: "align-left",
    style: "",
    text: ""
})

const store = mainStore()
const { content, MODE, page } = storeToRefs(store);

var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (content.value.body[_index]) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    }
})
let editors = ref(null)
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
            style: "",
            text: ""
        }
    }
}
const closeBtn = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            textData[v] = props.data.content[v];
            textSetting.value[v] = props.data.content[v];
        })
    } else {
        textData = {
            align: "align-left",
            style: "",
            text: ""
        }
    }
    showEdit.value = false;
    content.value.body[_index].update = false;
}
</script>
<template>
    <div class="g-text" :class="[textSetting.align]" :style="colors[textSetting.style]">
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
                    <div class="input-group__label">對其方向:</div>
                    <g-radio label="左" name="align" value="align-left" v-model="textData.align" />
                    <g-radio label="中" name="align" value="align-center" v-model="textData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色" :group="true" :options="[style1,style2]" v-model="textData.style" />
                </div>
                <div class="g-edit__row">
                    <g-ckedit v-model="textData.text" />
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>