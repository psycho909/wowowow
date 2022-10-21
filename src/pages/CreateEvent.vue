<script setup>
import { storeToRefs } from "pinia";
import GCheckbox from '../elements/GCheckbox.vue';
import GDate from '../elements/GDate.vue';
import GInput from '../elements/GInput.vue';
import GSelect from '../elements/GSelect.vue';
import GTime from '../elements/GTime.vue';
import GTextarea from '../elements/GTextarea.vue';
import axios from "axios";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);
let createLightbox = ref(false)
let gameOptions = [{ value: 1, text: "一" }, { value: 2, text: "二" }]
let eventConfig = reactive({
    gameSelected: "",
    startDate: new Date(),
    startTime: {
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
    title: "",
    description: "",
    fbTitle: "",
    fbDescription: "",
    fbImage: "",
    GA: "",
    GTM: "",
    script: ""
})
const onSubmit = () => {
    axios.post("http://localhost:3000/config/", {
        listData: eventConfig
    }).then((res) => {
        return store.setCreateEvent(eventConfig)
    }).then((res) => {
        // createLightbox.value=true;
        store.$patch(state => {
            state.page = "EditPage"
        })
    })
}
const onReset = () => {
    eventConfig = {
        gameSelected: "",
        startDate: new Date(),
        startTime: {
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
        title: "",
        description: "",
        fbTitle: "",
        fbDescription: "",
        fbImage: "",
        GA: "",
        GTM: "",
        script: ""
    }
}
</script>
<template>
    <div class="container">
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>新增活動</span>
        </div>
        <div class="create-content">
            <div class="create-config__col">
                <g-select label="*選擇遊戲" :options="gameOptions" v-model="eventConfig.gameSelected" />
            </div>
            <div class="create-config__col">
                <div class="create-config__label">*上架日期:</div>
                <div class="create-config__input">
                    <g-date v-model="eventConfig.startDate" />
                </div>
                <div class="create-config__input">
                    <g-time v-model="eventConfig.startTime" />
                </div>
            </div>
            <div class="create-config__col">
                <div class="create-config__label">*下架日期:</div>
                <div class="create-config__input">
                    <g-date v-model="eventConfig.endDate" />
                </div>
                <div class="create-config__input">
                    <g-time v-model="eventConfig.endTime" />
                </div>
            </div>
            <div class="create-config__col">
                <g-input label="*活動名稱" placeholder="輸入內容" v-model="eventConfig.eventName" />
            </div>

            <div class="create-config__col">
                <g-checkbox label="COOKIE政策" v-model="eventConfig.cookie" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="HEADER" v-model="eventConfig.header" />
            </div>
            <div class="create-config__col">
                <g-input label="網頁標題" placeholder="輸入內容" v-model="eventConfig.title" />
            </div>
            <div class="create-config__col">
                <g-input label="網頁說明" placeholder="輸入內容" v-model="eventConfig.description" />
            </div>
            <div class="create-config__col">
                <g-input label="FB標題" placeholder="輸入內容" v-model="eventConfig.fbTitle" />
            </div>
            <div class="create-config__col">
                <g-input label="FB說明" placeholder="輸入內容" v-model="eventConfig.fbDescription" />
            </div>
            <div class="create-config__col">
                <g-input label="FB縮圖URL" placeholder="輸入內容" v-model="eventConfig.fbImage" preview="true" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="GA" v-model="eventConfig.GA" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="GTM" v-model="eventConfig.GTM" />
            </div>
            <div class="create-config__col">
                <g-textarea label="其它行銷script" v-model="eventConfig.script" />
            </div>
            <div class="create-btn__group">
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                <a href="javascript:;" class="btn btn__reset" @click="reset">清除重填</a>
            </div>
        </div>
    </div>
    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="createLightbox" :action="false">
        <template #lightbox-content>
            <div class="text-center">已存檔完成</div>
        </template>
    </g-lightbox>
</template>