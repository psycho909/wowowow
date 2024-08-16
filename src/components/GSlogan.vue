<script>
export default {
    name: "Slogan",
    label: "主標圖",
    limit: 1,
    order: 2,
    type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { reactive, watchEffect } from 'vue';
import GRadio from '../elements/GRadioo.vue';
import GInput from "../elements/GInput.vue";
import { mainStore } from "../store/index";
import { CheckImage, CheckUrl, handleNumber } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page, content: allContent, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let sloganSetting = reactive({})
let sloganData = reactive({})
const $addComponent = inject('$addComponent');
const initData = () => {
    return {
        link: "",
        mt: pageTypeSeq.value == 2 ? 0 : "250",
        mb: pageTypeSeq.value == 2 ? 0 : "24",
        mobile_mt: 0,
        mobile_mb: 0,
        pc: "",
        mobile: "", validPC: true, validMobile: true, validUrl: true, target: true
    }
};

Object.assign(sloganData, initData());
const imageInfo = async (type, url) => {
    return new Promise((resolve, reject) => {
        var elem = new Image();
        elem.onload = () => {
            const dimensions = {
                width: elem.width,
                height: elem.height
            };
            resolve(dimensions);
        };
        elem.onerror = () => resolve(null);
        elem.src = url;
    });
};
watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(sloganData, cloneDeep(props.data.content));
        Object.assign(sloganSetting, cloneDeep(props.data.content));
        if (!sloganSetting.w) {
            if (sloganData.target == undefined) {
                sloganSetting.target = true;
            }
            if (sloganSetting.target == undefined) {
                sloganSetting.target = true;
            }
            if (sloganSetting.pc) {
                const pcImageDimensions = await imageInfo("pc", sloganSetting.pc);
                if (pcImageDimensions) {
                    sloganSetting.w = pcImageDimensions.width;
                    sloganSetting.h = pcImageDimensions.height;
                }
            } else {
                sloganSetting.w = 1000;
                sloganSetting.h = 187;
            }
            if (sloganSetting.mobile) {
                const mobileImageDimensions = await imageInfo("mobile", sloganSetting.mobile);
                if (mobileImageDimensions) {
                    sloganSetting.mw = mobileImageDimensions.width;
                    sloganSetting.mh = mobileImageDimensions.height;
                }
            } else {
                sloganSetting.mw = 1000;
                sloganSetting.mh = 187;
            }
        }
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
        if (!sloganSetting.w) {
            if (sloganSetting.pc) {
                const pcImageDimensions = await imageInfo("pc", sloganSetting.pc);
                if (pcImageDimensions) {
                    sloganSetting.w = pcImageDimensions.width;
                    sloganSetting.h = pcImageDimensions.height;
                }

            } else {
                sloganSetting.w = 1000;
                sloganSetting.h = 187;
            }
            if (sloganSetting.mobile) {
                const mobileImageDimensions = await imageInfo("mobile", sloganSetting.mobile);
                if (mobileImageDimensions) {
                    sloganSetting.mw = mobileImageDimensions.width;
                    sloganSetting.mh = mobileImageDimensions.height;
                }

            } else {
                sloganSetting.mw = 1000;
                sloganSetting.mh = 187;
            }
        }
        if ($addComponent) {
            $addComponent();
        }
    }
})



function transformNavsToCSSProps(item) {
    const cssProps = {
        "--slogan-pc": `url(${item.pc})`,
        "--slogan-mobile": item.mobile ? `url(${item.mobile})` : "",
        "--slogan-w": `${item.w}`,
        "--slogan-h": `${item.h}`,
        "--slogan-mw": item.mw ? `${item.mw}` : "",
        "--slogan-mh": item.mh ? `${item.mh}` : "",
    };
    return {
        ...cssProps,
    };
}


const onSubmit = async () => {
    let data = {};
    sloganData.validMobile = true;
    sloganData.validMt = true;
    sloganData.validMb = true;
    sloganData.validMmt = true;
    sloganData.validMmb = true;
    if (sloganData.pc.length == 0) {
        sloganData.validPC = false;
    } else {
        if (!await CheckImage(sloganData.pc)) {
            sloganData.validPC = false;
        } else {
            const pcImageDimensions = await imageInfo("pc", sloganData.pc);
            sloganData.w = pcImageDimensions.width;
            sloganData.h = pcImageDimensions.height;
            sloganData.validPC = true;
        }
    }
    if (sloganData.mobile.length > 0) {
        if (!await CheckImage(sloganData.mobile)) {
            sloganData.validMobile = false;
        } else {
            const mobileImageDimensions = await imageInfo("mobile", sloganData.mobile);
            sloganData.mw = mobileImageDimensions.width;
            sloganData.mh = mobileImageDimensions.height;
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
    if (sloganData.mt < 0) {
        sloganData.validMt = false;
    }
    if (sloganData.mb < 0) {
        sloganData.validMb = false;
    }
    if (sloganData.mobile_mt < 0) {
        sloganData.validMmt = false;
    }
    if (sloganData.mobile_mb < 0) {
        sloganData.validMmb = false;
    }
    if (sloganData.validMt && sloganData.validMb && sloganData.validMmt && sloganData.validMmb) {
        if (sloganData.validPC && sloganData.validMobile && sloganData.validUrl) {
            $("#loadingProgress").show();
            data = cloneDeep(sloganData);
            Object.assign(sloganSetting, data);
            GetPageType(store.otp)
            if (props.sub) {
                store.updateCpt(props.data.uid, data, true)
            } else {
                store.updateCpt(props.data.uid, data)
            }
        }
    }
}
const onReset = () => {
    Object.assign(sloganData, initData());
}
const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        if (store.content.length == 2) {
            var a = store.content.map((v, i) => {
                return v.component;
            });
            var checkBG = a.find((v, i) => {
                return v == "GBg";
            });
            var checkSlogan = a.find((v, i) => {
                return v == "GSlogan";
            });
            if (checkBG && checkSlogan) {
                var b = store.content.filter((v, i) => {
                    return (v.component == "GBg" && v.init) || (v.component == "GSlogan" && v.init);
                });
                if (b.length == 2) {
                    showEdit.value = false;
                    store.editCptClose(props.data.uid, props.sub)
                    store.removeCpt(props.data.uid, props.sub);
                    return;
                }
            } else {
                store.removeCpt(props.data.uid, props.sub);
            }
        } else {
            store.removeCpt(props.data.uid, props.sub);
        }
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
const checkInit = computed(() => {
    if (page.value === "Preview") return true;
    if (props.data.first) {
        return false;
    } else {
        return true;
    }

})
</script>
<template>
    <div class="g-slogan" :class="[checkInit ? '' : 'checkInit']" :style="cssVar">
        <template v-if="store.status != 'edit'">
            <a :href="[sloganSetting.link ? sloganSetting.link : 'javascript:;']" class="g-slogan-container"
               :target="[sloganSetting.target == 'true' || sloganSetting.target == true ? '_blank' : '']"
               :style="transformNavsToCSSProps(sloganSetting)"
               v-if="!(data.content.pc == 'https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slogan.png')">
                <picture>
                    <source media="(max-width:768px)" :srcset="sloganSetting.mobile || sloganSetting.pc" />
                    <img :srcset="sloganSetting.pc" :src="sloganSetting.pc" alt="" />
                </picture>
            </a>
        </template>
        <template v-else>
            <a href="javascript:;" class="g-slogan-container" :style="transformNavsToCSSProps(sloganSetting)">
                <picture>
                    <source media="(max-width:768px)" :srcset="sloganSetting.mobile || sloganSetting.pc" />
                    <img :srcset="sloganSetting.pc" :src="sloganSetting.pc" alt="" />
                </picture>
                <g-modify :uid="data.uid" title="主標圖" :move="false" :sub="sub" v-if="page == 'EditPage'" />
            </a>
        </template>
        <img v-if="!checkInit" class="notice-img"
             style="display:block;margin:16px auto 0;max-width: 100%;"
             src="https://alpha-tw.beanfun.com/3KO/removable/pchome/images/component.png" alt="">
        <g-edit v-model:showEdit="showEdit" :uid="data.uid" v-if="page == 'EditPage'">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">主標圖
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Slogan${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <g-input label="圖片網址:" v-model.trim="sloganData.pc" :preview="sloganData.pc" :required="true"
                             :valid="sloganData.validPC" />
                </div>
                <div class="g-edit__row">
                    <g-input label="手機版圖片網址:" v-model.trim="sloganData.mobile" :preview="sloganData.mobile"
                             :valid="sloganData.validMobile" />
                </div>
                <div class="g-edit__row">
                    <g-input label="連結:" v-model.trim="sloganData.link" :valid="sloganData.validUrl" />
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col">
                        <div class="input-group__label">另開視窗:</div>
                        <g-radio label="是" :name="'attribute'" :value="true"
                                 v-model="sloganData.target" />
                        <g-radio label="否" :name="'attribute'" :value="false"
                                 v-model="sloganData.target" />
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="sloganData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="sloganData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="sloganData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="sloganData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="sloganData.mobile_mt"
                                 @change="handleNumber" warning="間距請勿設定為負值" :valid="sloganData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="sloganData.mobile_mb"
                                 @change="handleNumber" warning="間距請勿設定為負值" :valid="sloganData.validMmb" />
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