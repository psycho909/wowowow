<script>
export default {
    name: "GText",
    label: "文字區塊",
    order: 7
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import GRadio from '../elements/GRadioo.vue';
import GCkedit from '../elements/GCkedit.vue';
import GSelect from '../elements/GSelect.vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import colors, { style1, style2 } from "../colors";
import { handleNumber, loadingHide, loadingShow } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data", "sub"])
let showEdit = ref(false);
let textSetting = reactive({})
let styleValid = ref(true);
let textUpdate = ref(false);
let textData = reactive({})
let collapseStatus = ref(false);
let boxRef = ref("")
const initData = () => {
    return {
        align: "left",
        style: "",
        text: "",
        type: "all",
        collapse: {
            num: 3,
            close: "收起-",
            open: "展開看更多+",
        },
        scrollbar: {
            num: 3,
        },
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0
    }
};
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);

Object.assign(textData, initData());

watchEffect(async () => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        textUpdate.value = true;
        await nextTick();
        textUpdate.value = false;
    }
})
const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(content).length > 0) {
        Object.assign(textData, cloneDeep(props.data.content));
        Object.assign(textSetting, cloneDeep(props.data.content));
        await nextTick();
        let textBox = boxRef.value;
        if (textBox) {
            const computedStyles = getComputedStyle(textBox);
            const collapseValue = computedStyles.getPropertyValue('--collapse');
            textBox.style = `--collapse:${collapseValue};--max-height:${boxRef.value.scrollHeight}`
        }

    }
})


const onSubmit = async () => {
    if (textData.style == "") {
        styleValid.value = false;
    } else {
        styleValid.value = true;
    }
    let data = cloneDeep(textData);

    if (styleValid.value) {
        $("#loadingProgress").show();
        store.updateCpt(props.data.uid, data, props.sub);

        Object.assign(textSetting, data);
        textUpdate.value = true;
        await nextTick();
        textUpdate.value = false;
    }
}
const onReset = () => {
    Object.assign(textData, initData());
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
        Object.assign(textData, cloneDeep(props.data.content));
    } else {
        Object.assign(textData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

const collapseToggle = () => {
    collapseStatus.value = !collapseStatus.value
}
</script>
<template>
    <div class="g-text" :class="[textSetting.align]" :style="[colors[textSetting.style], cssVar]">
        <div class="g-text-container" v-if="!textUpdate">
            <div class="g-text__content" :class="[collapseStatus ? '' : 'collapse']">
                <template v-if="textSetting.type == 'all'">
                    <div class="g-text__box" v-html="textSetting.text"></div>
                </template>
                <template v-if="textSetting.type == 'collapse'">
                    <div class="g-text__box" :class="[collapseStatus ? '' : 'collapse']" v-html="textSetting.text"
                         :style="{ '--collapse': textSetting.collapse.num }" ref="boxRef"></div>
                    <a class="g-text__collapse-btn" href="javascript:;" @click="collapseToggle"
                       :style="[colors[textSetting.style]]">{{
                           collapseStatus ? textSetting.collapse.close : textSetting.collapse.open }}</a>
                </template>
                <template v-if="textSetting.type == 'scrollbar'">
                    <div class="g-text__box scrollbar" v-html="textSetting.text"
                         :style="[colors[textSetting.style], { '--scrollbar': textSetting.scrollbar.num }]"></div>
                </template>
            </div>

            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">文字區塊
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Text.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">對齊方向:</div>
                    <g-radio label="左" name="align" value="left" v-model="textData.align" />
                    <g-radio label="中" name="align" value="center" v-model="textData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="styleValid"
                              v-model="textData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">收合文字:</div>
                    <g-radio label="全部展開" name="type" value="all" v-model="textData.type" />
                    <g-radio label="摺疊收合" name="type" value="collapse" v-model="textData.type" />
                    <g-radio label="Scrollbar" name="type" value="scrollbar" v-model="textData.type" />
                </div>
                <template v-if="textData.type == 'collapse'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-input class="w-auto" label="文字超過:" type="number" v-model="textData.collapse.num" />
                            <span>行後出現Scrollbar</span>
                        </div>
                        <div class="g-edit__col">
                            <g-input label="收合後文字:" type="text"
                                     v-model="textData.collapse.close" />
                        </div>
                        <div class="g-edit__col">
                            <g-input label="收合前文字:" type="text"
                                     v-model="textData.collapse.open" />
                        </div>
                    </div>
                </template>
                <template v-if="textData.type == 'scrollbar'">
                    <div class="g-edit__row">
                        <div class="g-edit__col">
                            <g-input class="w-auto" label="文字超過:" type="number" v-model="textData.scrollbar.num" />
                            <span class="flex[1]">行後出現Scrollbar</span>
                        </div>
                    </div>
                </template>
                <div class="g-edit__row">
                    <g-ckedit v-model:modelValue="textData.text" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="textData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="textData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="textData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="textData.mobile_mb" @change="handleNumber" />
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