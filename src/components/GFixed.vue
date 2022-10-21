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
import colors, { style1, style2 } from "../colors";
const props = defineProps(["data"])
const store = mainStore()
const { content, MODE, page } = storeToRefs(store);
let showEdit = ref(false);
let menuToggle = ref(false);
let fixedSetting = ref({})
let fixedData = reactive({
    position: "",
    hamburger: "",
    style: "",
    menus: []
})

var _index = content.value.body.findIndex((v, i) => v.uid == props.data.uid);

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
const addPushMenu = () => {
    fixedData.menus.push({ text: "", link: "", target: false })
}

const addInsertMenu = (index) => {
    if (index == fixedData.menus.length) {
        fixedData.menus.push({ text: "", link: "", target: false })
        return;
    }
    fixedData.menus = [...fixedData.menus.slice(0, index + 1), { text: "", link: "", target: false }, ...fixedData.menus.slice(index + 1)];
}
const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        console.log(123)
        fixedData.menus = fixedData.menus.slice(0, fixedData.menus.length - 1)
    } else {
        fixedData.menus = [...fixedData.menus.slice(0, index), ...fixedData.menus.slice(index + 1)]
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
const closeBtn = () => {
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
    showEdit.value = false;
    content.value.body[_index].update = false;
}

const openMenu = () => {
    menuToggle.value = true;
}

const closeMenu = () => {
    menuToggle.value = false;
}
</script>
<template>
    <div class="g-fixed__hamburger" :class="[fixedSetting.hamburger]" @click="openMenu"></div>
    <div class="g-fixed" :class="[fixedSetting.position,fixedSetting.hamburger,menuToggle?'on':'']"
         :style="colors[fixedSetting.style]">
        <a href="javascript:;" class="g-fixed__close" @click="closeMenu"></a>
        <div class="g-fixed-container">
            <a :href="[menu.link?menu.link:'javascript:;']" class="g-fixed__menu"
               :target="[menu.target?'_blank':'_self']" v-for="menu in fixedSetting.menus">{{menu.text}}</a>
        </div>
        <g-modify :uid="data.uid" :move="false" v-if="MODE == 'development' && page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="MODE == 'development' && page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動式選單<a href="javascript:;" class="edit-title__q"></a></div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label">*出現位置:</div>
                    <g-radio label="左" name="position" value="left" v-model="fixedData.position" />
                    <g-radio label="右" name="position" value="right" v-model="fixedData.position" />
                    <g-radio label="上" name="position" value="top" v-model="fixedData.position" />
                    <g-radio label="下" name="position" value="bottom" v-model="fixedData.position" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label">*手機版漢堡選單出現位置:</div>
                    <g-radio label="左" name="hamburger" value="hamburger-left" v-model="fixedData.hamburger" />
                    <g-radio label="右" name="hamburger" value="hamburger-right" v-model="fixedData.hamburger" />
                </div>
                <div class="g-edit__row">
                    <g-select label="*主題顏色" :group="true" :options="[style1,style2]" v-model="fixedData.style" />
                </div>
                <div class="g-edit__row">
                    <span class="input-group__label">選單數目</span>
                    <div>{{fixedData.menus.length}}</div>
                    <a href="javascript:;" class="input-group__click icon icon-add" @click="addPushMenu"></a>
                    <a href="javascript:;" class="input-group__click icon icon-remove" @click="removeMenu"></a>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col" v-for="(menu,index) in fixedData.menus">
                        <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                        <a href="javascript:;" class="icon icon-remove" :class="[index == 0?'v-hidden':'']"
                           @click="removeMenu(index)"></a>
                        <g-input placeholder="*請輸入選單文字" v-model="menu.text" />
                        <g-input placeholder="*請輸入連結或URL" v-model="menu.link" />
                        <div class="edit-radio__box">
                            <div class="input-group__label">另開視窗:</div>
                            <g-radio label="是" :name="`target${index}`" :value="true" v-model="menu.target" />
                            <g-radio label="否" :name="`target${index}`" :value="false" v-model="menu.target" />
                        </div>
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