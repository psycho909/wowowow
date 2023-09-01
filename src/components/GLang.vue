<script>
export default {
    name: "GLang",
    label: "多國語系物件",
    limit: 1,
    order: 1
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let langData = reactive({});
let langSetting = reactive({})
let langOptions = ref([{
    text: "繁體中文",
    value: "zh"
}, {
    text: "英文",
    value: "en"
}, {
    text: "日文",
    value: "ja"
}])
let loading = ref(true);
const initData = () => {
    return {
        default: "",
        langs: [{
            name: "",
            url: "",
            val: ""
        }]
    }
}
Object.assign(langData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        Object.assign(langData, cloneDeep(props.data.content));
        Object.assign(langSetting, cloneDeep(props.data.content))
    }

})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(langData, cloneDeep(props.data.content));
        Object.assign(langSetting, cloneDeep(props.data.content))
    }
})

const addInsertMenu = (index) => {
    const lang = {
        name: "",
        url: "",

    };
    langData.langs.push(lang)
};

const removeMenu = (deleteIndex) => {
    if (langData.langs.length > 1) {
        langData.langs.splice(deleteIndex, 1);
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = langData.langs[index];
    var _content = [...langData.langs.slice(0, index), ...langData.langs.slice(index + 1)];
    langData.langs = _content;
    langData.langs.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < langData.langs.length - 1) {
        const temp = langData.langs[index];
        langData.langs[index] = langData.langs[index + 1];
        langData.langs[index + 1] = temp;
    }
}

const onSubmit = async () => {
    let data = cloneDeep(langData)
    store.updateCpt(props.data.uid, data);
    Object.assign(langSetting, data);
}

const onReset = () => {
    Object.assign(langData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        loadingHide()
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(langData, cloneDeep(props.data.content));
    } else {
        Object.assign(langData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

</script>
<template>
    <Teleport to="body">
        <div class="g-lang">
            <div class="g-lang-container" :data-num="langSetting.num">
                <template v-for="lang in langSetting.langs">
                    <a :href="lang.url">{{ lang.name }}</a>
                </template>
                <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
            </div>
            <g-edit v-model:showEdit="showEdit">
                <template #edit-close>
                    <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
                </template>
                <template #edit-content>
                    <div class="edit-title__box">
                        <div class="edit-title__text">多國語系物件
                            <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Image.html"
                               class="edit-title__q" target="_blank"></a>
                        </div>
                    </div>
                    <div class="g-edit__row" v-for="(lang, index) in langData.langs" :key="lang">
                        <div class="g-edit__col">
                            <div class="g-edit__group">
                                <a href="javascript:;" class="icon icon-add" @click="addInsertMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-remove" @click="removeMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                                <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                            </div>
                            <div class="g-edit__group">
                                <div class="g-edit__col">
                                    <g-select label="語系:" v-model="lang.val" :options="langOptions" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="語系名稱:" v-model.trim="lang.name" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="網址:" v-model.trim="lang.url" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">開啟方式:</div>
                                    <g-radio label="其他語系預設使用" name="default" :value="lang.val" v-model="langData.default" />
                                </div>
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
    </Teleport>
</template>