<script>
    export default {
        name: "GFixed",
        label: "浮動選單",
        limit: 1,
        order: [3, 4],
        type: [1, 2, 3]
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
    import { GetPageType } from "../api";
    const props = defineProps(["data"])
    const store = mainStore()
    const { page, pageTypeSeq } = storeToRefs(store);
    let content = cloneDeep(props.data.content);
    let showEdit = ref(false);
    let menuToggle = ref(false);
    let fixedRef = ref(null)
    let fixedData = reactive({})
    let fixedSetting = reactive({});
    let fixedMenuValid = ref(true);
    let styleValid = ref(true);
    let toggleStatus = ref(false)
    let scroll = ref(false);
    const initData = () => {
        return {
            position: "left",
            hamburger: "hamburger-left",
            style: "",
            menus: [{ text: "", link: "", target: false, validText: true, validUrl: true }],
            type: "normal",
            top: true,
            collapse: false,
            status: true,
            collapseText: "",
            direction: "center",
            opacity: 1
        }
    };

    Object.assign(fixedData, initData());

    watchEffect(async () => {
        if (props.data.update) {
            store.toggleLoading(false)
            showEdit.value = true;
        } else {
            showEdit.value = false;
        }
        if (!props.data.update) {
            if (Object.keys(props.data.content).length > 0) {
                if (props.data.content.type === undefined) {
                    props.data.content.type = "normal"
                }
                if (props.data.content.top === undefined) {
                    props.data.content.top = true
                }
                if (props.data.content.collapse === undefined) {
                    props.data.content.collapse = false
                }
                if (props.data.content.direction === undefined) {
                    props.data.content.direction = "center"
                }
                Object.assign(fixedData, cloneDeep(props.data.content));
                Object.assign(fixedSetting, cloneDeep(props.data.content));
                if (fixedSetting.type == 'collapse') {
                    if (fixedSetting.status == false || fixedSetting.status == 'false') {
                        toggleStatus.value = false;
                    }
                    if (fixedSetting.status == true || fixedSetting.status == 'true') {
                        toggleStatus.value = true;
                    }

                } else {
                    toggleStatus.value = true;
                }
                await nextTick()
                if (!isMobile.any) {
                    let height = 0;
                    let area = document.querySelector(".g-area[data-page='main']");
                    if (area) {
                        if (document.querySelector(".g-fixed.top")) {
                            height = document.querySelector(".g-fixed.top").clientHeight;
                            area.style.marginTop = height + 'px'
                            // area.style.setProperty('--fixed-top', height)
                        } else {
                            area.style.marginTop = height + 'px'
                            // area.style.setProperty('--fixed-top', height)
                        }
                    }
                }
                if (props.data.content.opacity === undefined) {
                    props.data.content.opacity = 1;
                }
                if (fixedRef.value.scrollHeight > window.innerHeight) {
                    scroll.value = true
                } else {
                    scroll.value = false
                }
                if (fixedData.opacity == undefined) {
                    fixedData.opacity = 1;
                }
                if (fixedSetting.opacity == undefined) {
                    fixedSetting.opacity = 1;
                }
            }
        }
        if (fixedData.position) {
            if (fixedData.position == 'top' || fixedData.position == 'bottom') {
                fixedData.collapse = false;
                fixedData.status = true;
                fixedData.type = "normal"
            }
        }
        if (fixedData.type) {
            if (fixedData.type == 'normal') {
                fixedData.collapseText = "";
                fixedData.collapse = false;
                fixedData.status = true;
            } else if (fixedData.type == 'collapse') {
                fixedData.collapse = true;
            }
        }
    })
    // 定义滚动事件处理函数
    function handleScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let wrap = document.querySelector(".wrap");
        let wrapTop = wrap.getBoundingClientRect().top;
        let gFixed = document.querySelector(".g-fixed");
        if (scrollTop >= wrapTop) {
            gFixed.classList.add("fixed");
        } else {
            gFixed.classList.remove("fixed");
        }
    }
    onMounted(async () => {
        await nextTick()
        if (Object.keys(props.data.content).length > 0) {
            if (props.data.content.opacity === undefined) {
                props.data.content.opacity = 1;
            }
            if (props.data.content.type === undefined) {
                props.data.content.type = "normal"
            }
            if (props.data.content.top === undefined) {
                props.data.content.top = true
            }
            if (props.data.content.collapse === undefined) {
                props.data.content.collapse = false
            }
            if (props.data.content.direction === undefined) {
                props.data.content.direction = "center"
            }
            Object.assign(fixedData, cloneDeep(props.data.content));
            Object.assign(fixedSetting, cloneDeep(props.data.content));
            if (fixedSetting.type == 'collapse') {
                toggleStatus.value = fixedSetting.status;
            } else {
                toggleStatus.value = "";
            }
            if (fixedSetting.position == 'top') {
                if (store.page == 'Preview') {
                    if (document.querySelector(".g-fixed.top")) {
                        document.querySelector(".g-fixed.top").style.setProperty('--preview', document.querySelector(".g-fixed.top").offsetHeight)
                        document.querySelector(".g-fixed.top").classList.add("preview")
                        // document.querySelector(".wrap").style.setProperty('--padding-top', document.querySelector(".g-fixed.top").offsetHeight)

                    } else {
                        document.querySelector(".g-fixed").style.setProperty('--preview', '')
                        // document.querySelector(".wrap").style.setProperty('--padding-top', '')
                        document.querySelector(".g-fixed").classList.remove("preview")
                    }
                }
                window.addEventListener("scroll", handleScroll);
                // document.querySelector(".wrap").style.setProperty('--padding-top', document.querySelector(".g-fixed.top").offsetHeight)
            } else {
                window.removeEventListener("scroll", handleScroll);
                // document.querySelector(".wrap").style.setProperty('--padding-top', '')
            }
            if (fixedData.opacity == undefined) {
                fixedData.opacity = 1;
            }
            if (fixedSetting.opacity == undefined) {
                fixedSetting.opacity = 1;
            }
        }
        if (document.querySelector('.g-fixed').offsetHeight > window.innerHeight) {
            scroll.value = true
        } else {
            scroll.value = false
        }
    })

    onUnmounted(() => {
        window.removeEventListener("scroll", handleScroll);
        if (fixedData.position == 'top') {
            if (!isMobile.any) {
                let height = 0;
                let area = document.querySelector(".g-area[data-page='main']");
                if (area) {
                    area.style.marginTop = height + 'px'
                    // area.style.setProperty('--fixed-top', height)
                }
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
    // 按鈕操作方法
    const onUp = (index) => {
        if (index <= 0) return;
        const menu = fixedData.menus;
        [menu[index], menu[index - 1]] = [menu[index - 1], menu[index]];
    };

    const onDown = (index) => {
        const menu = fixedData.menus;
        if (index >= menu.length - 1) return;
        [menu[index], menu[index + 1]] = [menu[index + 1], menu[index]];
    };
    const onSubmit = () => {
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
            document.querySelector("#loadingProgress").style.display = "block";
            let data = cloneDeep(fixedData);
            store.updateCpt(props.data.uid, data);
            Object.assign(fixedSetting, data);
            GetPageType(store.otp)
        }
    }
    const onReset = () => {
        Object.assign(fixedData, initData());
    }
    const closeBtn = () => {
        if (props.data.init) {
            showEdit.value = false;
            store.removeCpt(props.data.uid, props.sub);
            document.querySelector("body").classList.remove("ov-hidden");
            return;
        }
        if (Object.keys(props.data.content).length > 0) {
            Object.assign(fixedData, cloneDeep(props.data.content));
        } else {
            Object.assign(fixedData, initData());

        }
        showEdit.value = false;
        store.editCptClose(props.data.uid, props.sub)
    }

    const openMenu = () => {
        menuToggle.value = true;
        document.querySelector("body").classList.add("ov-hidden");
    }

    const closeMenu = () => {
        menuToggle.value = false;
        document.querySelector("body").classList.remove("ov-hidden");
    }
    const toggleMenu = () => {
        console.log(toggleStatus.value)
        if (toggleStatus.value === false || toggleStatus.value === 'false') {
            toggleStatus.value = true;
        } else if (toggleStatus.value === true || toggleStatus.value === 'true') {
            toggleStatus.value = false;
        }
    }

    const goTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // 平滑滾動效果
        });
    }
    const cssVar = computed(() => {
        return {
            "--opacity": props.data.content.opacity === undefined ? 1 : props.data.content.opacity,
        }
    })
    watch(
        () => fixedData.type,
        (newValue, oldValue) => {
            // 判斷：如果新值是 'img' OR 舊值是 'img'
            if (newValue === 'img' || oldValue === 'img') {

                // 確保不是在同一個值之間變動（防禦性檢查）
                if (newValue !== oldValue) {
                    fixedData.menus = [
                        { text: "", link: "", target: false, validText: true, validUrl: true }
                    ];
                }
            }
        }
    );
</script>
<template>
    <div class="g-fixed__hamburger" :class="[fixedSetting.hamburger]" @click="openMenu"></div>
    <div class="g-fixed"
         :class="[fixedSetting.position, fixedSetting.hamburger, menuToggle ? 'on' : '', fixedSetting.type == 'collapse' ? 'collapse' : '', scroll ? 'scroll' : '']"
         :style="[colors[fixedSetting.style], cssVar]"
         :data-collapse="toggleStatus"
         :data-type="fixedSetting.type"
         ref="fixedRef">
        <a href="javascript:;" class="g-fixed__close" @click="closeMenu"></a>
        <div class="g-fixed-container" :data-direction="fixedSetting.direction">
            <a href="javascript:;" class="g-fixed__collapse" v-if="fixedSetting.type == 'collapse'" @click="toggleMenu">
                {{ fixedSetting.collapseText }}
            </a>
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
                <a href="javascript:;" class="g-fixed__menu g-fixed__top" @click="goTop"
                   v-if="fixedSetting.top != 'false'">TOP</a>
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
                        <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Fixed${pageTypeSeq}.html`"
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
                <div class="g-edit__row" v-if="(fixedData.position == 'top' || fixedData.position == 'bottom')">
                    <div class="input-group__label required">方向:</div>
                    <g-radio label="置中" name="direction" value="center" v-model="fixedData.direction" />
                    <g-radio label="靠左" name="direction" value="left" v-model="fixedData.direction" />
                    <g-radio label="靠右" name="direction" value="right" v-model="fixedData.direction" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">樣式:</div>
                    <g-radio label="一般文字" name="type" value="normal" v-model="fixedData.type" />
                    <g-radio label="可收合" name="type" value="collapse" v-model="fixedData.type"
                             v-if="!(fixedData.position == 'top' || fixedData.position == 'bottom')" />
                    <g-radio label="自訂圖片" name="type" value="img" v-model="fixedData.type" />
                </div>
                <template
                          v-if="fixedData.type == 'collapse' && fixedData.type == 'img' && (fixedData.position != 'top' && fixedData.position != 'bottom')">
                    <div class="g-edit__row">
                        <div class="input-group__label required">預設狀態:</div>
                        <g-radio label="展開" name="status" :value="true" v-model="fixedData.status" />
                        <g-radio label="收合" name="status" :value="false" v-model="fixedData.status" />
                    </div>
                    <div class="g-edit__row">
                        <g-input label="收合側欄文字:" v-model="fixedData.collapseText" :valid="fixedData.collapseText" />
                    </div>
                </template>
                <div class="g-edit__row">
                    <div class="input-group__label required">回到上面按鈕:</div>
                    <g-radio label="顯示" name="top" :value="true" v-model="fixedData.top" />
                    <g-radio label="無" name="top" :value="false" v-model="fixedData.top" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">手機板選單位置:</div>
                    <g-radio label="左" name="hamburger" value="hamburger-left" v-model="fixedData.hamburger" />
                    <g-radio label="右" name="hamburger" value="hamburger-right" v-model="fixedData.hamburger" />
                </div>
                <div class="g-edit__row">
                    <g-select label="主題顏色" :group="true" :options="[style1, style2]" :required="true"
                              v-model="fixedData.style"
                              :valid="styleValid" />
                </div>
                <div class="g-edit__row">
                    <div class="input-group__label required">透明度:</div>
                    <input type="range" id="opacity" name="opacity" min="0" max="1" step="0.01" value="1"
                           v-model="fixedData.opacity" />
                    <span>{{ parseInt(fixedData.opacity * 100) }}%</span>
                </div>
                <div class="g-edit__row" v-if="fixedData.type == 'img'">
                    <g-input label="背景圖片:" placeholder="*圖片連結" type="text" v-model="fixedData.bgUrl" :required="true"
                             :valid="fixedData.validBgUrl" />
                </div>
                <div class="g-edit__row">
                    <span class="input-group__label" :class="[fixedMenuValid ? '' : 'warning']">選單數目</span>
                    <div>{{ fixedData.menus.length }}</div>
                    <a href="javascript:;" class="input-group__click icon icon-add" @click="addPushMenu"></a>
                    <a href="javascript:;" class="input-group__click icon icon-remove" @click="removeMenu"></a>
                </div>
                <div class="g-edit__row">
                    <div class="g-edit__col" v-for="(menu, index) in fixedData.menus">
                        <a href="javascript:;" class="icon icon-up mr-1" @click="onUp(index)"
                           :class="{ disabled: index === 0 }">up</a>
                        <a href="javascript:;" class="icon icon-down mr-1" @click="onDown(index)"
                           :class="{ disabled: index === fixedData.menus.length - 1 }">down</a>
                        <g-input :placeholder="fixedData.type == 'img' ? '*圖片網址' : '*選單文字'" v-model="menu.text"
                                 :valid="menu.validText" />
                        <g-input :placeholder="fixedData.type == 'img' ? '*轉導連結' : '*連結'" v-model.trim="menu.link"
                                 :valid="menu.validUrl" />
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