<script>
export default {
    name: "Fixed",
    label: "浮動選單",
    limit: 1,
    order: 3
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GInput from '../elements/GInput.vue';
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import { mainStore } from "../store/index";
import colors, { style1, style2 } from "../colors";
import { CheckUrl } from "../Tool";
import { cloneDeep } from 'lodash-es'
const props = defineProps(["data"])
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let showEdit = ref(false);
let menuToggle = ref(false);
let fixedSetting = reactive({});
let fixedMenuValid = ref(true);
let styleValid = ref(true);
let fixedData = reactive({})
const initData = () => {
    return {
        position: "left",
        hamburger: "hamburger-left",
        style: "",
        menus: []
    }
};

Object.assign(fixedData, initData());

watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(fixedData, cloneDeep(props.data.content));
            Object.assign(fixedSetting, cloneDeep(props.data.content));
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(fixedData, cloneDeep(props.data.content));
        Object.assign(fixedSetting, cloneDeep(props.data.content));
        if (fixedSetting.position == 'top') {
            $(window).on("scroll", function () {
                let scrollTop = $(this).scrollTop();
                if (scrollTop >= $(".wrap").offset().top) {
                    $(".g-fixed").addClass("fixed")
                } else {
                    $(".g-fixed").removeClass("fixed")
                }
            })
        }
    }
})
const addPushMenu = () => {
    if (fixedData.menus.length > 15) {
        fixedMenuValid.value = false;
        return;
    }
    if (fixedData.menus.length > 0) {
        fixedMenuValid.value = true;
    }
    fixedData.menus.push({ text: "", link: "", target: false, validText: true, validUrl: true })
}

const addInsertMenu = (index) => {
    if (fixedData.menus.length > 15) {
        fixedMenuValid.value = false;
        return;
    }
    if (fixedData.menus.length > 0) {
        fixedMenuValid.value = true;
    }
    if (index == fixedData.menus.length) {
        fixedData.menus.push({ text: "", link: "", target: false, validText: true, validUrl: true })
        return;
    }
    fixedData.menus = [...fixedData.menus.slice(0, index + 1), { text: "", link: "", target: false, validText: true, validUrl: true }, ...fixedData.menus.slice(index + 1)];
}
const removeMenu = (index) => {
    if (fixedData.menus.length < 16) {
        fixedMenuValid.value = true;
    }
    if (fixedData.menus.length == 0) {
        fixedMenuValid.value = false;
    }
    if (!toString.call(index).includes("Number")) {
        fixedData.menus = fixedData.menus.slice(0, fixedData.menus.length - 1)
    } else {
        fixedData.menus = [...fixedData.menus.slice(0, index), ...fixedData.menus.slice(index + 1)]
    }
}

const onSubmit = () => {
    let data = {};
    if (fixedData.menus.length == 0) {
        fixedMenuValid.value = false;
    } else {
        fixedMenuValid.value = true;
    }
    if (fixedData.style == "") {
        styleValid.value = false;
    } else {
        styleValid.value = true;
    }
    fixedData.menus.forEach(function (v, i) {
        if (v.text.length > 0) {
            v.validText = true;
        } else {
            v.validText = false;
        }
        if (v.link.length > 0) {
            if (!CheckUrl(v.link)) {
                v.validUrl = false;
            } else {
                v.validUrl = true;
            }
        } else {
            v.validUrl = false;
        }
    })
    var validCheck = fixedData.menus.every(function (v, i) {
        return v.validText == true && v.validUrl == true
    })
    if (validCheck && fixedMenuValid.value && styleValid.value) {
        $("#loadingProgress").show();
        let data = cloneDeep(fixedData);
        store.updateCpt(props.data.uid, data);
        Object.assign(fixedSetting, data);
    }
}
const onReset = () => {
    Object.assign(fixedData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(fixedData, cloneDeep(props.data.content));
    } else {
        Object.assign(fixedData, initData());

    }
    showEdit.value = false;
    props.data.update = false;
}

const openMenu = () => {
    menuToggle.value = true;
    document.querySelector("body").classList.add("ov-hidden");
}

const closeMenu = () => {
    menuToggle.value = false;
    document.querySelector("body").classList.remove("ov-hidden");
}
</script>
<template>
    <div class="g-fixed__hamburger" :class="[fixedSetting.hamburger]" @click="openMenu"></div>
    <div class="g-fixed" :class="[fixedSetting.position, fixedSetting.hamburger, menuToggle ? 'on' : '']"
         :style="colors[fixedSetting.style]">
        <a href="javascript:;" class="g-fixed__close" @click="closeMenu"></a>
        <div class="g-fixed-container">
            <div class="g-fixed__list">
                <template v-if="store.status == 'edit'">
                    <a :href="[menu.link ? menu.link : 'javascript:;']" class="g-fixed__menu"
                       :target="[menu.target == 'true' ? '_blank' : '_blank']" v-for="menu in fixedSetting.menus">{{
                           menu.text
                       }}</a>
                </template>
                <template v-if="store.status != 'edit'">
                    <a :href="[menu.link ? menu.link : 'javascript:;']" class="g-fixed__menu"
                       :target="[menu.target == 'true' ? '_blank' : '_self']" v-for="menu in fixedSetting.menus">{{
                           menu.text
                       }}</a>
                </template>
            </div>
        </div>
        <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">浮動選單
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Fixed.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">出現位置:</div>
                    <g-radio label="左" name="position" value="left" v-model="fixedData.position" />
                    <g-radio label="右" name="position" value="right" v-model="fixedData.position" />
                    <g-radio label="上" name="position" value="top" v-model="fixedData.position" />
                    <g-radio label="下" name="position" value="bottom" v-model="fixedData.position" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">手機版漢堡選單出現位置:</div>
                    <g-radio label="左" name="hamburger" value="hamburger-left" v-model="fixedData.hamburger" />
                    <g-radio label="右" name="hamburger" value="hamburger-right" v-model="fixedData.hamburger" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                              v-model="fixedData.style" :valid="styleValid" />
                </div>
                <div class="g-edit__row">
                    <span class="input-group__label" :class="[fixedMenuValid ? '' : 'warning']">選單數目</span>
                    <div>{{ fixedData.menus.length }}</div>
                    <a href="javascript:;" class="input-group__click icon icon-add" @click="addPushMenu"></a>
                    <a href="javascript:;" class="input-group__click icon icon-remove" @click="removeMenu"></a>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col" v-for="(menu, index) in fixedData.menus">
                        <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                        <a href="javascript:;" class="icon icon-remove" :class="[index == 0 ? 'v-hidden' : '']"
                           @click="removeMenu(index)"></a>
                        <g-input placeholder="*選單文字" v-model="menu.text" :valid="menu.validText" />
                        <g-input placeholder="*連結" v-model.trim="menu.link" :valid="menu.validUrl" />
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