<script>
export default {
    name: "Slogan",
    label: "主標圖",
    limit: 1,
    order: 2
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from 'vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl, handleNumber } from "../Tool";
import { cloneDeep } from 'lodash-es'

const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let sloganSetting = reactive({})
let sloganData = reactive({})
const initData = () => {
    return {
        link: "",
        mt: "250",
        mb: "24",
        mobile_mt: 0,
        mobile_mb: 0,
        pc: "",
        mobile: "", validPC: true, validMobile: true, validUrl: true
    }
};

Object.assign(sloganData, initData());

watchEffect(() => {
    if (props.data.update) {
        showEdit.value = true;
    } else {
        showEdit.value = false;
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
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(sloganData, cloneDeep(props.data.content));
        Object.assign(sloganSetting, cloneDeep(props.data.content));
    }
})


const onSubmit = async () => {
    let data = {};
    sloganData.validMobile = true;

    if (sloganData.pc.length == 0) {
        sloganData.validPC = false;
    } else {
        if (!await CheckImage(sloganData.pc)) {
            sloganData.validPC = false;
        } else {
            sloganData.validPC = true;
        }
    }
    if (sloganData.mobile.length > 0) {
        if (!await CheckImage(sloganData.mobile)) {
            sloganData.validMobile = false;
        } else {
            sloganData.validMobile = true;
        }
    } else {
        sloganData.validMobile = true;
    }

    if (sloganData.link.length > 0) {
        if (!CheckUrl(sloganData.link)) {
            sloganData.validUrl = false;
        } else {
            sloganData.validUrl = true;
        }
    } else {
        sloganData.validUrl = true;
    }

    if (sloganData.validPC && sloganData.validMobile && sloganData.validUrl) {
        $("#loadingProgress").show();
        data = cloneDeep(sloganData);
        store.updateCpt(props.data.uid, data, props.sub);
        Object.assign(sloganSetting, data);
    }
}
const onReset = () => {
    Object.assign(sloganData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(sloganData, cloneDeep(props.data.content));
    } else {
        Object.assign(sloganData, initData);
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}
</script>
<template>
    <div class="g-slogan" :style="cssVar">
        <template v-if="store.status != 'edit'">
            <a :href="[sloganSetting.link ? sloganSetting.link : 'javascript:;']" class="g-slogan-container">
                <picture>
                    <source media="(max-width:768px)" :srcset="sloganSetting.mobile || sloganSetting.pc" />
                    <img :srcset="sloganSetting.pc" :src="sloganSetting.pc" alt="" />
                </picture>
                <g-modify :uid="data.uid" title="主標圖" :move="false" v-if="page == 'EditPage'" :sub="sub" />
            </a>
        </template>
        <template v-else>
            <a :href="[sloganSetting.link ? sloganSetting.link : 'javascript:;']" class="g-slogan-container"
               target="_blank">
                <picture>
                    <source media="(max-width:768px)" :srcset="sloganSetting.mobile || sloganSetting.pc" />
                    <img :srcset="sloganSetting.pc" :src="sloganSetting.pc" alt="" />
                </picture>
                <g-modify :uid="data.uid" title="主標圖" :move="false" v-if="page == 'EditPage'" :sub="sub" />
            </a>
        </template>
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">主標圖
                        <a href="https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Slogan.html"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="圖片網址:" v-model.trim="sloganData.pc" :preview="sloganData.pc" :required="true"
                             :valid="sloganData.validPC" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model.trim="sloganData.mobile" :preview="sloganData.mobile"
                             :valid="validMobile" />
                </div>
                <div class="g-edit__row">
                    <g-input label="連結:" v-model.trim="sloganData.link" :valid="validUrl" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="sloganData.mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="sloganData.mb" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="sloganData.mobile_mt" @change="handleNumber" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="sloganData.mobile_mb" @change="handleNumber" />
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