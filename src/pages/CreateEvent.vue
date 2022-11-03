<script setup>
import { storeToRefs } from "pinia";
import GCheckbox from '../elements/GCheckbox.vue';
import GDate from '../elements/GDate.vue';
import GInput from '../elements/GInput.vue';
import GSelect from '../elements/GSelect.vue';
import GTime from '../elements/GTime.vue';
import GTextarea from '../elements/GTextarea.vue';
import GHome from "../components/GHome.vue";
import axios from "axios";
import { mainStore } from "../store/index";
import { GetGames, AddEventList } from "../api";
import { loadingShow, loadingHide } from "../Tool";
const store = mainStore()
const { content, flag } = storeToRefs(store);
let createLightbox = ref(false)
let loading = ref(true)
let gameOptions = ref([{ guid: 1, gameName: "A" }, { guid: 2, gameName: "BN" }])
let valid = reactive({
    gameSelected: true,
    beginDate: true,
    endDate: true,
    eventName: true,
})
let eventConfig = reactive({
    gameseq: "",
    beginDate: new Date(),
    beginTime: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    },
    endDate: new Date(),
    endTime: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    },
    eventName: "",
    cookie: false,
    header: false,
    webtitle: "",
    webDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogUrl: "",
    script: "",
    flag: 0,
    pageTypeSeq: "",
    detail: "",
    createUser: "",
    createTime: "",
    updateUser: "",
    updateTime: ""
})
let message = ref("");
let messageLightbox = ref(false);

onMounted(() => {
    // loadingShow()
    // GetGames(1).then((res) => {
    //     let { code, message, url, listData } = res.data;
    //     if (code != 1) {
    //         return;
    //     }
    //     loadingHide()
    //     gameOptions.value = listData;
    //     loading.value = false;
    //     return res;
    // }).then((res) => {
    //     // 狀態 (0=編輯中/1=審核中/2=審核通過/3=刪除/4=審核不過)
    //     if (store.config) {
    //         eventConfig = { ...eventConfig, ...store.edit };
    //         store.setConfig({});
    //         return;
    //     }
    //     eventConfig.pageTypeSeq = store.pageTypeSeq;
    // })
})
const onSubmit = () => {
    var start, end, data;
    // if (eventConfig.beginDate && eventConfig.beginTime) {
    //     start = +new Date(`${eventConfig.beginDate.getFullYear()}/${eventConfig.beginDate.getMonth() + 1}/${eventConfig.beginDate.getDate()} ${eventConfig.beginTime.hours}:${eventConfig.beginTime.minutes}`);
    //     valid.beginDate = true;
    // } else {
    //     valid.beginDate = false;
    // }
    // if (eventConfig.endDate && eventConfig.endTime) {
    //     end = +new Date(`${eventConfig.endDate.getFullYear()}/${eventConfig.endDate.getMonth() + 1}/${eventConfig.endDate.getDate()} ${eventConfig.endTime.hours}:${eventConfig.endTime.minutes}`);
    //     valid.endDate = true;
    // } else {
    //     valid.endDate = false;
    // }

    // if ((start && end) && (end >= start)) {
    //     valid.beginDate = false;
    //     valid.endDate = false;
    // } else {
    //     valid.beginDate = true;
    //     valid.endDate = true;
    // }

    // if (eventConfig.gameseq < 0 || !eventConfig.gameseq) {
    //     valid.gameSelected = false;
    // } else {
    //     valid.gameSelected = true;
    // }

    // if (eventConfig.eventName.length > 0) {
    //     valid.eventName = true;
    // } else {
    //     valid.eventName = false;
    // }
    var validCheck = Object.keys(valid).every(function (v, i) {
        return valid[v] == true;
    })
    if (validCheck) {
        data = { ...eventConfig };
        data.beginDate = new Date(`${data.beginDate.getFullYear()}/${data.beginDate.getMonth() + 1}/${data.beginDate.getDate()} ${data.beginTime.hours}:${data.beginTime.minutes}`);
        data.endDate = new Date(`${data.endDate.getFullYear()}/${data.endDate.getMonth() + 1}/${data.endDate.getDate()} ${data.endTime.hours}:${data.endTime.minutes}`);
        console.log(data)
        // axios.post("http://localhost:3000/config/", {
        //     listData: eventConfig
        // }).then((res) => {
        //     return store.setCreateEvent(eventConfig)
        // }).then((res) => {
        //     createLightbox.value = true;
        // })
    }
}
const onReset = () => {
    eventConfig = {
        gameseq: "",
        beginDate: new Date(),
        beginTime: {
            hours: new Date().getHours(),
            minutes: new Date().getMinutes()
        },
        endDate: new Date(),
        endTime: {
            hours: new Date().getHours(),
            minutes: new Date().getMinutes()
        },
        eventName: "",
        cookie: false,
        header: false,
        webtitle: "",
        webDescription: "",
        ogTitle: "",
        ogDescription: "",
        ogUrl: "",
        script: "",
        flag: 0,
        createUser: "",
        createTime: "",
        updateUser: "",
        updateTime: ""
    }
}

const closeBtn = () => {
    store.setPage("EditPage")
}
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>新增活動</span>
        </div>
        <div class="create-content">
            <div class="create-config__col">
                <g-select label="選擇遊戲" :options="gameOptions" v-model="eventConfig.gameseq"
                          :valid="valid.gameseq" :required="true">
                    <template #options="option">
                        <option :value="option.option.guid">{{ option.option.gameName }}</option>
                    </template>
                </g-select>
            </div>
            <div class="create-config__col">
                <div class="create-config__label required">上架日期:</div>
                <div class="create-config__input">
                    <g-date v-model="eventConfig.beginDate" :valid="valid.beginDate" />
                </div>
                <div class="create-config__input">
                    <g-time v-model="eventConfig.beginTime" :valid="valid.beginDate" />
                </div>
            </div>
            <div class="create-config__col">
                <div class="create-config__label required">下架日期:</div>
                <div class="create-config__input">
                    <g-date v-model="eventConfig.endDate" :valid="valid.endDate" />
                </div>
                <div class="create-config__input">
                    <g-time v-model="eventConfig.endTime" :valid="valid.endDate" />
                </div>
            </div>
            <div class="create-config__col">
                <g-input label="活動名稱" placeholder="輸入內容" v-model="eventConfig.eventName" :valid="valid.eventName"
                         :required="true" />
            </div>

            <div class="create-config__col">
                <g-checkbox label="COOKIE政策" v-model="eventConfig.cookie" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="HEADER" v-model="eventConfig.header" />
            </div>
            <div class="create-config__col">
                <g-input label="網頁標題" placeholder="輸入內容" v-model="eventConfig.webtitle" />
            </div>
            <div class="create-config__col">
                <g-input label="網頁說明" placeholder="輸入內容" v-model="eventConfig.webDescription" />
            </div>
            <div class="create-config__col">
                <g-input label="FB標題" placeholder="輸入內容" v-model="eventConfig.ogTitle" />
            </div>
            <div class="create-config__col">
                <g-input label="FB說明" placeholder="輸入內容" v-model="eventConfig.ogDescription" />
            </div>
            <div class="create-config__col">
                <g-input label="FB縮圖URL" placeholder="輸入內容" v-model="eventConfig.ogUrl"
                         :preview="eventConfig.ogUrl" />
            </div>
            <!-- <div class="create-config__col">
                <g-checkbox label="GA" v-model="eventConfig.GA" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="GTM" v-model="eventConfig.GTM" />
            </div> -->
            <!-- <div class="create-config__col">
                <g-textarea label="其它行銷script" v-model="eventConfig.script" />
            </div> -->
            <div class="create-btn__group">
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                <a href="javascript:;" class="btn btn__reset" @click="reset">清除重填</a>
            </div>
        </div>
    </div>
    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="createLightbox" :action="false">
        <template #lightbox-close>
            <a href="javascript:;" class="g-lightbox__close icon-close" @click="closeBtn">close</a>
        </template>
        <template #lightbox-content>
            <div class="text-center">已存檔完成</div>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ message }}</div>
        </template>
    </g-lightbox>
</template>