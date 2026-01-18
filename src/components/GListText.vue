<script>
export default {
    name: "GListText",
    label: "條列式區塊",
    order: [11, 16], type: [1,2,3]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data", "sub"])
let showEdit = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let listTextData = reactive({});
let listTextSetting = reactive({})
let styleValid = ref(true);
let loading = ref(true);
let _listTextDataLength = ref(1);
const initData = () => {
    return {
        num: 1,
        align: "left",
        style: "",
        opacity: 1,
        validStyle: true,
        collapseNum: 5,
        listTexts: [
            {
                title: "",
                icon: "",
                validTitle: true,
                validIcon: true,
                nested: [
                    {
                        text: "",
                        url: "",
                        open: false,
                        validText: true
                    }
                ]
            }
        ],
        mt: 0, mb: 54, mobile_mt: 0, mobile_mb: 0,
    }
}
Object.assign(listTextData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        if (Object.keys(props.data.content).length > 0) {
            if (props.data.content.opacity === undefined) {
                props.data.content.opacity = 1;
            }
            Object.assign(listTextData, cloneDeep(props.data.content));
            Object.assign(listTextSetting, cloneDeep(props.data.content));
            _listTextDataLength.value = listTextData.num;
            if (listTextData.opacity == undefined) {
                listTextData.opacity = 1;
            }
            if (listTextSetting.opacity == undefined) {
                listTextSetting.opacity = 1;
            }
        }
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        if (props.data.content.opacity === undefined) {
            props.data.content.opacity = 1;
        }
        Object.assign(listTextData, cloneDeep(props.data.content));
        Object.assign(listTextSetting, cloneDeep(props.data.content));
        _listTextDataLength.value = listTextData.num;
        if (listTextData.opacity == undefined) {
            listTextData.opacity = 1;
        }
        if (listTextSetting.opacity == undefined) {
            listTextSetting.opacity = 1;
        }
    }
})

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

async function validateListTextData(data) {
    let isValid = true;

    for (const item of data.listTexts) {
        if (item.title.trim() === "") {
            item.validTitle = false;
            isValid = false;
        } else {
            item.validTitle = true;
        }

        if (item.icon.trim() !== "") {
            const isImageValid = await CheckImage(item.icon);
            item.validIcon = isImageValid;
            if (!isImageValid) {
                isValid = false;
            } else {
                const pcImageDimensions = await imageInfo("pc", item.icon);
                if (pcImageDimensions) {
                    item.w = pcImageDimensions.width;
                    item.h = pcImageDimensions.height;
                    item.validIcon = true;
                } else {
                    item.validIcon = false;
                    isValid = false;
                }
            }
        } else {
            item.validIcon = true;
        }

        for (const nestedItem of item.nested) {
            if (nestedItem.text.trim() === "") {
                nestedItem.validText = false;
                isValid = false;
            } else {
                nestedItem.validText = true;
            }
        }
    }

    return isValid;
}

const cssVar = computed(() => {
    return {
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ? props.data.content.mobile_mt : props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ? props.data.content.mobile_mb : props.data.content.mb,
        "--opacity": props.data.content.opacity === undefined ? 1 : props.data.content.opacity,
    }
})

const longestNestedLength = computed(() => {
    let longestNestedLength = 0;
    for (const listItem of listTextData.listTexts) {
        const nestedLength = listItem.nested.length;
        if (nestedLength > longestNestedLength) {
            longestNestedLength = nestedLength;
        }
    }
    return longestNestedLength;
})

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const addInsertMenu = (index) => {
    if (index == slideData.slides.length) {
        listTextData.listTexts.push({
            title: "",
            icon: "",
            nested: [
                {
                    text: "",
                    url: "",
                    open: false
                }
            ]
        })
        if (listTextData.num > listTextData.listTexts.length) {
            listTextData.num = listTextData.listTexts.length;
        }
        return;
    }
    listTextData.listTexts = [...listTextData.listTexts.slice(0, index + 1), {
        title: "",
        icon: "",
        nested: [
            {
                text: "",
                url: "",
                open: false
            }
        ]
    }, ...slideData.slides.slice(index + 1)];
    if (listTextData.num > listTextData.listTexts.length) {
        listTextData.num = listTextData.listTexts.length;
    }
}

const removeMenu = (index) => {
    if (!toString.call(index).includes("Number")) {
        listTextData.listTexts = listTextData.listTexts.slice(0, listTextData.listTexts.length - 1)
    } else {
        listTextData.listTexts = [...listTextData.listTexts.slice(0, index), ...listTextData.listTexts.slice(index + 1)]
    }
    if (listTextData.num > listTextData.listTexts.length) {
        listTextData.num = listTextData.listTexts.length;
    }
}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = listTextData.listTexts[index];
    var _content = [...listTextData.listTexts.slice(0, index), ...listTextData.listTexts.slice(index + 1)];
    listTextData.listTexts = _content;
    listTextData.listTexts.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index + 1 >= listTextData.listTexts.length) {
        return;
    }
    var _temp = listTextData.listTexts[index];
    var _content = [...listTextData.listTexts.slice(0, index), ...listTextData.listTexts.slice(index + 1)];
    listTextData.listTexts = _content;
    listTextData.listTexts.splice(index + 1, 0, _temp);
}

const addInsertMenu2 = (index, nestIndex) => {
    const newNest = {
        text: "",
        url: "",
        open: false
    };

    listTextData.listTexts[index].nested.push(newNest)
};

const removeMenu2 = (index, deleteIndex) => {
    listTextData.listTexts[index].nested.splice(deleteIndex, 1);
}

const onUp2 = (index, nestIndex) => {
    if (nestIndex > 0) {
        const nestList = listTextData.listTexts[index].nested;
        const currentSlide = nestList[nestIndex];
        nestList[nestIndex] = nestList[nestIndex - 1];
        nestList[nestIndex - 1] = currentSlide;
    }
}

const onDown2 = (index, nestIndex) => {
    const nestList = listTextData.listTexts[index].nested;

    if (nestIndex < slides.length - 1) {
        const currentSlide = nestList[nestIndex];
        nestList[nestIndex] = nestList[nestIndex + 1];
        nestList[nestIndex + 1] = currentSlide;
    }
}

const openPop = (data) => {
    data.pop.show = true
}

const onChange = (e) => {
    let num = e.target.value;
    if (_listTextDataLength.value <= num) {
        for (let i = 0; i < (num - _listTextDataLength.value); i++) {
            listTextData.listTexts.push({
                title: "",
                icon: "",
                nested: [
                    {
                        text: "",
                        url: "",
                        open: false
                    }
                ]
            })
        }
    } else {
        listTextData.listTexts = listTextData.listTexts.slice(0, num)
    }
    _listTextDataLength.value = num;
}

const onSubmit = async () => {
    loadingShow()
    let isValidData = await validateListTextData(listTextData);
    listTextData.validMt = true;
    listTextData.validMb = true;
    listTextData.validMmt = true;
    listTextData.validMmb = true;
    if (listTextData.mt < 0) {
        listTextData.validMt = false;
    }
    if (listTextData.mb < 0) {
        listTextData.validMb = false;
    }
    if (listTextData.mobile_mt < 0) {
        listTextData.validMmt = false;
    }
    if (listTextData.mobile_mb < 0) {
        listTextData.validMmb = false;
    }
    if (listTextData.style == "") {
        styleValid.value = false;
    } else {
        styleValid.value = true;
    }
    if (listTextData.validMt && listTextData.validMb && listTextData.validMmt && listTextData.validMmb) {
        if (styleValid.value && isValidData) {
            document.querySelector("#loadingProgress").style.display = "block";
            let data = cloneDeep(listTextData);
            store.updateCpt(props.data.uid, data, props.sub);
            Object.assign(listTextSetting, data);
            GetPageType(store.otp)

        } else {
            loadingHide()
        }
    } else {
        loadingHide()
    }


}

const onReset = () => {
    _listTextDataLength.value = 1;
    Object.assign(listTextData, initData());
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
        Object.assign(listTextData, cloneDeep(props.data.content));
    } else {
        Object.assign(listTextData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

function transformNavsToCSSProps(item) {
    const cssProps = {
        "--icon-url": `url(${item.icon})`,
        "--icon-w": `${item.w}`,
        "--icon-h": `${item.h}`,
    };

    return {
        ...cssProps,
    };
}

</script>
<template>
    <div class="g-listText" :style="[colors[listTextSetting.style], cssVar]">
        <div class="g-listText-container">
            <div class="g-listText-content" :data-num="listTextSetting.num">
                <template v-for="(list, index) in listTextSetting.listTexts">
                    <div class="g-listText-row" :data-icon="[list.icon != '' ? true : false]"
                         :data-align="listTextSetting.align">
                        <div class="g-listText__title"><span class="g-listText__icon"
                                  :style="transformNavsToCSSProps(list)"
                                  v-if="list.icon != ''"></span>{{ list.title }}</div>
                        <div class="g-listText-col" v-for="nest in listTextSetting.listTexts[index].nested">
                            <a href="javascript:;" class="g-listText__text" v-if="page == 'EditPage'">{{ nest.text
                                }}</a>
                            <a :href="[nest.url == '' ? 'javascript:;' : nest.url]" class="g-listText__text"
                               :target="[page == 'EditPage' ? '_blank' : nest.open == 'true' || nest.open == true ? '_blank' : '']"
                               v-else>{{
                                nest.text
                            }}</a>
                        </div>
                    </div>
                </template>
            </div>
            <g-modify :uid="data.uid" :sub="sub" v-if="page == 'EditPage'" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="edit-title__box">
                    <div class="edit-title__text">區塊條列式文字
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/ListText${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank"></a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">選擇欄位數量:</div>
                    <g-radio label="單欄" name="item" value="1" v-model="listTextData.num" @change="onChange" />
                    <g-radio label="兩欄" name="item" value="2" v-model="listTextData.num" @change="onChange" />
                    <g-radio label="三欄" name="item" value="3" v-model="listTextData.num" @change="onChange" />
                    <g-radio label="四欄" name="item" value="4" v-model="listTextData.num" @change="onChange" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">對齊方向:</div>
                    <g-radio label="左" name="align" value="left" v-model="listTextData.align" />
                    <g-radio label="中" name="align" value="center" v-model="listTextData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:" :group="true" :options="[style1, style2]" :required="true"
                              :valid="styleValid"
                              v-model="listTextData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">透明度:</div>
                    <input type="range" id="opacity" name="opacity" min="0" max="1" step="0.01" value="1"
                           v-model="listTextData.opacity" />
                    <span>{{ parseInt(listTextData.opacity * 100) }}%</span>
                </div>
                <div class="g-edit__row g-edit__block" v-for="(list, index) in listTextData.listTexts">
                    <div class="g-edit__col">
                        <div class="g-edit__group">
                            <a href="javascript:;" class="icon icon-up" @click="onUp(index)">up</a>
                            <a href="javascript:;" class="icon icon-down" @click="onDown(index)">down</a>
                        </div>
                        <div class="g-edit__group">
                            <div class="g-edit__col">
                                <g-input label="標題:" type="text" v-model.trim="list.title" :valid="list.validTitle"
                                         :required="true" />
                            </div>
                            <div class="g-edit__col">
                                <g-input label="標題圖" type="text" v-model.trim="list.icon" :preview="list.icon"
                                         :valid="list.validIcon" />
                            </div>
                            <div class="g-edit__row" v-for="(nest, nestIndex) in list.nested">
                                <div class="g-edit__col">
                                    <div class="g-edit__group">
                                        <a href="javascript:;" class="icon icon-add"
                                           @click="addInsertMenu2(index, nestIndex)"></a>
                                        <a href="javascript:;" class="icon icon-remove"
                                           @click="removeMenu2(index, nestIndex)"></a>
                                        <a href="javascript:;" class="icon icon-up"
                                           @click="onUp2(index, nestIndex)">up</a>
                                        <a href="javascript:;" class="icon icon-down"
                                           @click="onDown2(index, nestIndex)">down</a>
                                    </div>
                                    <div class="g-edit__group">
                                        <div class="g-edit__col">
                                            <g-input label="文字:" type="text" v-model.trim="nest.text"
                                                     :valid="nest.validText" :required="true" />
                                        </div>
                                        <div class="g-edit__col">
                                            <g-input label="連結:" type="text" v-model.trim="nest.url" />
                                        </div>
                                        <div class="g-edit__col">
                                            <div class="input-group__label">另開視窗:</div>
                                            <g-radio label="是" :name="'open' + index + nestIndex" :value="true"
                                                     v-model="nest.open" />
                                            <g-radio label="否" :name="'open' + index + nestIndex" :value="false"
                                                     v-model="nest.open" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col w50">
                        <g-input label="PC間距上:" type="number" v-model="listTextData.mt" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="listTextData.validMt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="PC間距下:" type="number" v-model="listTextData.mb" @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="listTextData.validMb" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距上:" type="number" v-model="listTextData.mobile_mt"
                                 @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="listTextData.validMmt" />
                    </div>
                    <div class="g-edit__col w50">
                        <g-input label="Mobile間距下:" type="number" v-model="listTextData.mobile_mb"
                                 @change="handleNumber"
                                 warning="間距請勿設定為負值" :valid="listTextData.validMmb" />
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