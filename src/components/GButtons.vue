<script>
    export default {
        name: "GButtons",
        label: "快速按鈕",
        order: [6, 11],
        type: [1, 2, 3]
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
    import { cloneDeep } from 'lodash-es';
    import { GetPageType } from "../api";
    import { watchEffect } from "vue";

    // Props 定義
    const props = defineProps({
        data: {
            type: Object,
            required: true
        },
        sub: {
            type: Boolean,
            default: false
        }
    });

    // Store 和注入
    const store = mainStore();
    const { page, pageTypeSeq } = storeToRefs(store);
    // 響應式狀態
    const showEdit = ref(false);
    const _buttonsDataLength = ref(1);
    const loading = ref(true);

    // 按鈕數據初始化函數
    function createInitialData() {
        return {
            num: 1,
            align: "left",
            style: "",
            validStyle: true,
            opacity: 1,
            randomCode: Math.random().toString(36).substring(2, 6),
            type: "text",
            gap: true,
            buttons: [{
                text: "",
                validText: true,
                url: "",
                validUrl: true,
                target: true,
                hoverEffect: 0,
                changeEffect: false,
                change: ""
            }],
            mt: 0,
            mb: 54,
            mobile_mt: 0,
            mobile_mb: 0,
        };
    }

    // 按鈕數據
    const buttonsData = reactive(createInitialData());
    const buttonsSetting = reactive({});

    // 計算屬性
    const cssVar = computed(() => ({
        "--mt": props.data.content.mt,
        "--mb": props.data.content.mb,
        "--mobile_mt": props.data.content.mobile_mt ?? props.data.content.mt,
        "--mobile_mb": props.data.content.mobile_mb ?? props.data.content.mb,
        "--opacity": props.data.content.opacity ?? 1
    }));

    const status = computed(() => store.page !== "EditPage");

    // 初始化數據
    function initializeData(data) {
        if (!data) return;

        // 設置默認值
        data.opacity ??= 1;
        data.randomCode ??= Math.random().toString(36).substring(2, 6);

        // 克隆數據
        Object.assign(buttonsData, cloneDeep(data));
        Object.assign(buttonsSetting, cloneDeep(data));

        // 設置按鈕數量
        _buttonsDataLength.value = buttonsData.num;

        // 初始化按鈕屬性
        [buttonsData, buttonsSetting].forEach(data => {
            data.buttons?.forEach(button => {
                button.target ??= true;
            });
        });
    }

    // 監聽數據變化
    watchEffect(() => {
        showEdit.value = props.data.update;
        if (props.data.update) {
            store.toggleLoading(false);
        }

        if (!props.data.update && Object.keys(props.data.content).length > 0) {
            initializeData(props.data.content);
        }
    });

    // 按鈕操作方法
    const onUp = (index) => {
        if (index <= 0) return;
        const buttons = buttonsData.buttons;
        [buttons[index], buttons[index - 1]] = [buttons[index - 1], buttons[index]];
    };

    const onDown = (index) => {
        const buttons = buttonsData.buttons;
        if (index >= buttons.length - 1) return;
        [buttons[index], buttons[index + 1]] = [buttons[index + 1], buttons[index]];
    };

    watch(() => buttonsData.type, (newType) => {
        if (newType) {
            // 這樣修改 buttons 不會再次觸發此 watch
            buttonsData.buttons = [{
                text: "",
                validText: true,
                url: "",
                validUrl: true,
                target: true,
                hoverEffect: 0,
                effect: false,
                change: ""
            }];
        }
    });

    const addInsertMenu = () => {
        if (buttonsData.buttons.length == 8) {
            return;
        }
        buttonsData.buttons.push({
            text: "",
            validText: true,
            url: "",
            validUrl: true,
            target: true,
            hoverEffect: 0,
            effect: false,
            change: ""
        })
    }

    const removeMenu = () => {
        if (buttonsData.buttons.length == 1) {
            return;
        }
        buttonsData.buttons = buttonsData.buttons.slice(0, -1)
    }

    // 驗證方法
    function validateButtonsData(data) {
        const validations = {
            style: () => {
                data.validStyle = data.style.trim() !== "";
                return data.validStyle;
            },
            buttons: () => data.buttons.every(button => {
                button.validText = button.text.trim().length > 0;
                button.validUrl = button.url.trim() !== "";
                return button.validText && button.validUrl;
            })
        };

        return Object.values(validations).every(validate => validate());
    }

    function validateMargins() {
        const margins = {
            mt: 'validMt',
            mb: 'validMb',
            mobile_mt: 'validMmt',
            mobile_mb: 'validMmb'
        };

        return Object.entries(margins).every(([margin, validKey]) => {
            buttonsData[validKey] = buttonsData[margin] >= 0;
            return buttonsData[validKey];
        });
    }

    // 表單提交
    const onSubmit = async () => {
        loadingShow();

        const isValidData = validateButtonsData(buttonsData);
        const isValidMargins = validateMargins();

        if (!isValidData || !isValidMargins) {
            loadingHide();
            return;
        }

        const data = cloneDeep(buttonsData);
        store.updateCpt(props.data.uid, data, props.sub);
        Object.assign(buttonsSetting, data);
        await GetPageType(store.otp);
    };

    // 重置和關閉方法
    const onReset = () => Object.assign(buttonsData, createInitialData());

    const closeBtn = () => {
        if (props.data.init) {
            showEdit.value = false;
            store.removeCpt(props.data.uid, props.sub);
            document.querySelector("body").classList.remove("ov-hidden");
            loadingHide();
            return;
        }

        Object.assign(buttonsData,
            Object.keys(props.data.content).length > 0
                ? cloneDeep(props.data.content)
                : createInitialData()
        );

        showEdit.value = false;
        store.editCptClose(props.data.uid, props.sub);
    };

    // 生命週期鉤子
    onMounted(async () => {
        await nextTick();
        if (Object.keys(props.data.content).length > 0) {
            initializeData(props.data.content);
        }
    });
</script>

<template>
    <div class="g-buttons" :style="[colors[buttonsSetting.style], cssVar]" :id="props.data.id">
        <div class="g-buttons-container" :data-num="buttonsSetting.num" :data-align="buttonsSetting.align"
             :data-gap="buttonsSetting.gap">
            <template v-for="(button, index) in buttonsSetting.buttons" :key="index">
                <a :href="store.status !== 'edit' ? button.url : 'javascript:;'"
                   :target="store.status !== 'edit' && (button.target === true || button.target === 'true') ? '_blank' : '_self'"
                   :id="`g-buttons-${buttonsSetting.randomCode}-${index}`"
                   :data-changeEffect="button.changeEffect"
                   :data-change="button.change"
                   :data-hover="button.hoverEffect"
                   class="g-buttons__btn">
                    <template v-if="buttonsSetting.type == 'img'">
                        <img :src="button.text" alt="">
                        <img :src="button.change" alt="" v-if="button.change !== ''">
                    </template>
                    {{ button.text }}
                </a>
            </template>
            <g-modify v-if="page === 'EditPage'" :uid="data.uid" :sub="sub" />
        </div>
        <g-edit v-model:showEdit="showEdit">
            <template #edit-close>
                <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
            </template>
            <template #edit-content>
                <div class="g-edit__id">#{{ props.data.id }}</div>
                <div class="edit-title__box">
                    <div class="edit-title__text">
                        快速按鈕
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Buttons${pageTypeSeq}.html`"
                           class="edit-title__q" target="_blank">
                        </a>
                    </div>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕樣式:</div>
                    <g-radio label="文字" name="text" value="text" v-model="buttonsData.type" />
                    <g-radio label="圖片" name="img" value="img" v-model="buttonsData.type" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕位置:</div>
                    <g-radio v-for="pos in ['left', 'center', 'right']"
                             :key="pos"
                             :label="{ 'left': '左', 'center': '中', 'right': '右' }[pos]"
                             name="align"
                             :value="pos"
                             v-model="buttonsData.align" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色:"
                              :group="true"
                              :options="[style1, style2]"
                              :required="true"
                              :valid="buttonsData.validStyle"
                              v-model="buttonsData.style" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">透明度:</div>
                    <input type="range"
                           id="opacity"
                           name="opacity"
                           min="0"
                           max="1"
                           step="0.01"
                           v-model="buttonsData.opacity" />
                    <span>{{ parseInt(buttonsData.opacity * 100) }}%</span>
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕間距:</div>
                    <g-radio label="有" name="gap" :value="true" v-model="buttonsData.gap" />
                    <g-radio label="無" name="gap" :value="false" v-model="buttonsData.gap" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">按鈕數量:</div>
                    <div>{{ buttonsData.buttons.length }}</div>
                    <div class="g-edit__group ml-1 text-align-left">
                        <a href="javascript:;" class="icon icon-add"
                           @click="addInsertMenu"></a>
                        <a href="javascript:;" class="icon icon-remove"
                           @click="removeMenu"></a>
                    </div>
                </div>
                <div class="g-edit__row" v-for="(item, index) in buttonsData.buttons" :key="index">
                    <div class="g-edit__col">
                        <div class="g-edit__group">
                            <a href="javascript:;"
                               class="icon icon-up"
                               @click="onUp(index)"
                               :class="{ disabled: index === 0 }">up</a>
                            <a href="javascript:;"
                               class="icon icon-down"
                               @click="onDown(index)"
                               :class="{ disabled: index === buttonsData.buttons.length - 1 }">down</a>
                        </div>
                        <div class="g-edit__group">
                            <div class="g-edit__col">
                                <g-input :label="buttonsData.type == 'text' ? '按鈕文字：' : '圖片網址：'"
                                         type="text"
                                         v-model="item.text"
                                         :required="true"
                                         :valid="item.validText" />
                            </div>
                            <div class="g-edit__col">
                                <g-input label="按鈕連結:"
                                         type="text"
                                         v-model="item.url"
                                         :required="true"
                                         :valid="item.validUrl" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label">另開視窗:</div>
                                <g-radio v-for="opt in [{ label: '是', value: true }, { label: '否', value: false }]"
                                         :key="opt.value"
                                         :label="opt.label"
                                         :name="'attribute' + index"
                                         :value="opt.value"
                                         v-model="item.target" />
                            </div>
                            <div class="g-edit__col">
                                <g-select label="滑鼠移過效果:"
                                          :group="false"
                                          :options="[{ text: '無', value: 0 }, { text: '滑動切換', value: 'slide' }, { text: '漸變切換', value: 'fade' }]"
                                          :required="true"
                                          v-model="buttonsData.buttons[index].hoverEffect" />
                            </div>
                            <div class="g-edit__col">
                                <div class="input-group__label required">特效:</div>
                                <g-radio label="無" :name="'effect'+index" :value="false"
                                         v-model="buttonsData.buttons[index].changeEffect" />
                                <g-radio :label="buttonsData.type == 'text' ? '換字' : '換圖'" :name="'effect'+index" :value="true"
                                         v-model="buttonsData.buttons[index].changeEffect" />
                            </div>
                            <div class="g-edit__col" v-if="buttonsData.buttons[index].changeEffect == 'true'">
                                <g-input :label="buttonsData.type == 'text' ? '更換按鈕文字：' : '更換圖片網址：'"
                                         type="text"
                                         v-model="buttonsData.buttons[index].change"
                                         :required="true" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="g-edit__row">
                    <template v-for="(field, index) in [
                        { label: 'PC間距上:', model: 'mt', valid: 'validMt' },
                        { label: 'PC間距下:', model: 'mb', valid: 'validMb' },
                        { label: 'Mobile間距上:', model: 'mobile_mt', valid: 'validMmt' },
                        { label: 'Mobile間距下:', model: 'mobile_mb', valid: 'validMmb' }
                    ]" :key="index">
                        <div class="g-edit__col w50">
                            <g-input :label="field.label"
                                     type="number"
                                     v-model="buttonsData[field.model]"
                                     @change="handleNumber"
                                     warning="間距請勿設定為負值"
                                     :valid="buttonsData[field.valid]" />
                        </div>
                    </template>
                </div>
                <div class="edit-btn__box">
                    <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                    <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                </div>
            </template>
        </g-edit>
    </div>
</template>

<style scoped>
.icon.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>