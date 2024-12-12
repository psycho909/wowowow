<script>
export default {
    name: "GLang",
    label: "設定多國語系",
    limit: 1,
    order: [15, 20], type: [1, 2]
}
</script>

<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let langData = reactive({});
let langSetting = reactive({})
let langOptions = ref([{
    text: "繁體中文",
    value: "zh",
}, {
    text: "英文",
    value: "en",
}, {
    text: "日文",
    value: "ja",
}])
let loading = ref(true);
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        default: "",
        theme: 0,
        langs: [{
            name: "",
            url: "",
            val: "",
            validUrl: true
        }]
    }
}
Object.assign(langData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        Object.assign(langData, cloneDeep(props.data.content));
        Object.assign(langSetting, cloneDeep(props.data.content))
        if (store.page == 'EditPage') {
            langData.theme = store.config.footer
            langSetting.theme = store.config.footer
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(langData, cloneDeep(props.data.content));
        Object.assign(langSetting, cloneDeep(props.data.content));
        if ($addComponent) {
            $addComponent();
        }
    }
})

const addInsertMenu = (index) => {
    const lang = {
        name: "",
        url: "",
        validUrl: true

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
    let check = true;
    langData.langs.forEach((v, i) => {
        if (v.url == "") {
            check = false
            v.validUrl = false
        } else {
            v.validUrl = true
        }
    })
    if (check) {
        let data = cloneDeep(langData)
        store.updateCpt(props.data.uid, data);
        Object.assign(langSetting, data);
        GetPageType(store.otp)
    }

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

const selectLang = (e) => {
    var index = langOptions.value.findIndex((v, i) => {
        return v.value == e.target.value;
    })
    // langOptions.value[index].select = true;
}

</script>

<template>
    <Teleport to="body">
        <div class="g-lang" :data-theme="langSetting.theme">
            <div class="g-lang-container" :data-num="langSetting.num">
                <template v-for="lang in langSetting.langs">
                    <a :href="lang.url" class="g-lang__link">{{ lang.name }}</a>
                </template>
                <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
            </div>
            <g-edit v-model:showEdit="showEdit">

                <template #edit-close>
                    <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
                </template>

                <template #edit-content>
                    <div class="edit-title__box">
                        <div class="edit-title__text">設定多國語系
                            <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Lang${pageTypeSeq}.html`"
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
                                    <g-select label="語系:" v-model="lang.val" :options="langOptions"
                                              @change="selectLang" />
                                </div>
                                <div class="g-edit__col">
                                    <div class="input-group__label required">開啟方式:</div>
                                    <g-radio label="其他語系預設使用" name="default" :value="lang.val"
                                             v-model="langData.default" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="語系名稱:" v-model.trim="lang.name" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="網址:" v-model.trim="lang.url" :required="true"
                                             :valid="lang.validUrl" />
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