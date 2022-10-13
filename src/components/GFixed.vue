<script>
export default {
    name: "Fixed",
    label: "浮動式選單",
    limit: 1
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from '../elements/GInput.vue';
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import { mainStore } from "../store/index";
const props = defineProps(["data"])
const store = mainStore()
const { content } = storeToRefs(store);
let showEdit = ref(false);
let fixedSetting = ref({})
let fixedData = reactive({
    position: "",
    hamburger: "",
    style: "",
    menus: []
})

var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);
let styleOptions = [{ value: "blue", text: "一" }, { value: "red", text: "二" }]
watchEffect(() => {
    if (content.value.body[_index].update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (content.value.body[_index]) {
        Object.keys(props.data.content).forEach((v, i) => {
            fixedData[v] = props.data.content[v];
            fixedSetting.value[v] = props.data.content[v];
        })
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            fixedData[v] = props.data.content[v];
            fixedSetting.value[v] = props.data.content[v];
        })
    }
})
const addMenu = () => {
    fixedData.menus.push({ text: "", link: "", target: false })
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        fixedData.menus = fixedData.menus.slice(0, fixedData.menus.length - 1)
    } else {
        fixedData.menus = fixedData.menus.slice(0, index)
    }
}

const onSubmit = () => {
    let data = { ...fixedData }
    store.updateCpt(props.data.uid, data)
}
const onReset = () => {
    if (Object.keys(props.data.content).length > 0) {
        Object.keys(props.data.content).forEach((v, i) => {
            fixedData[v] = props.data.content[v];
            fixedSetting.value[v] = props.data.content[v];
        })
    } else {
        fixedData = {
            position: "",
            hamburger: "",
            style: "",
            menus: []
        }
    }
}
</script>
<template>
    <div class="g-fixed" :class="[fixedSetting.position,fixedSetting.hamburger]">
        <div class="g-fixed-container">
            <a :href="[menu.link?menu.link:'javascript:;']" class="g-fixed__menu"
               :target="[menu.target?'_blank':'_self']" v-for="menu in fixedSetting.menus">{{menu.text}}</a>
        </div>
        <g-modify :uid="data.uid" :move="false" />
        <g-edit v-model:showEdit="showEdit">
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動式選單</div>
                    <a href="javascript:;" class="edit-title__q"></a>
                </div>
                <div class="edit-input__box">
                    <div class="edit-radio__title">選擇出現位置:</div>
                    <g-radio label="左" name="position" value="left" v-model="fixedData.position" />
                    <g-radio label="右" name="position" value="right" v-model="fixedData.position" />
                    <g-radio label="上" name="position" value="top" v-model="fixedData.position" />
                    <g-radio label="下" name="position" value="bottom" v-model="fixedData.position" />
                </div>
                <div class="edit-input__box">
                    <div class="edit-radio__title">手機版漢堡選單出現位置:</div>
                    <g-radio label="左" name="hamburger" value="hamburger-left" v-model="fixedData.hamburger" />
                    <g-radio label="右" name="hamburger" value="hamburger-right" v-model="fixedData.hamburger" />
                </div>
                <div class="edit-input__box">
                    <g-select label="主題顏色" :options="styleOptions" v-model="fixedData.style" />
                </div>
                <div class="edit-input__box">
                    <span class="edit-num__title">選單數目</span>
                    <div>{{fixedData.menus.length}}</div>
                    <a href="javascript:;" class="icon icon-add" @click="addMenu"></a>
                    <a href="javascript:;" class="icon icon-remove" @click="removeMenu"></a>
                </div>
                <div class="edit-input__box">
                    <div class="edit-col__box" v-for="(menu,index) in fixedData.menus">
                        <g-input placeholder="請輸入選單文字" v-model="menu.text" />
                        <g-input placeholder="請輸入連結或URL" v-model="menu.link" />
                        <div class="edit-radio__box">
                            <div class="edit-radio__title">另開視窗:</div>
                            <g-radio label="是" name="target" :value="true" v-model="menu.target" />
                            <g-radio label="否" name="target" :value="false" v-model="menu.target" />
                        </div>
                        <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
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