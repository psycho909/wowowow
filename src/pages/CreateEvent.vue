<script setup>
import { storeToRefs } from "pinia";
import GCheckbox from '../elements/GCheckbox.vue';
import GRadio from '../elements/GRadioo.vue';
import GDate from '../elements/GDate.vue';
import GInput from '../elements/GInput.vue';
import GSelect from '../elements/GSelect.vue';
import GTime from '../elements/GTime.vue';
import GTextarea from '../elements/GTextarea.vue';
import GHome from "../components/GHome.vue";
import axios from "axios";
import { mainStore } from "../store/index";
import { templateStore } from "../store/template";
import { GetGames, AddEventList, UpdateEvent } from "../api";
import { loadingShow, loadingHide, CheckImage } from "../Tool";
const store = mainStore()
const { content } = storeToRefs(store);
const t = templateStore()
let loading = ref(true)
let gameOptions = ref([])
let valid = reactive({
    gameseq: true,
    beginDate: true,
    endDate: true,
    eventName: true,
    webtitle: true,
    webDescription: true,
    ogTitle: true,
    ogDescription: true,
    ogUrl: true,
    ga: true,
    gtm: true,
})
let GAToggle = ref(false);
let GTMToggle = ref(false);
let eventConfig = reactive({
    eventSeq: 0,
    gameseq: 0,
    beginDate: new Date(),
    beginTime: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    },
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    endTime: {
        hours: new Date().getHours(),
        minutes: new Date().getMinutes()
    },
    eventName: "",
    cookie: 0,
    header: 0,
    footer: 0,
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
    updateTime: "",
    ga: "",
    gtm: "",
    url: "",
})
let messageText = ref("");
let messageLightbox = ref(false);
let createText = ref("");
let createLightbox = ref(false);
let status = ref("");
onMounted(() => {
    loadingShow()
    GetGames(store.otp).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            return;
        }
        gameOptions.value = listData;
        loading.value = false;
        return res;
    }).then((res) => {
        if (Object.keys(store.config).length > 0) {
            Object.assign(eventConfig, store.config);
            if (store.config.gtm) {
                GTMToggle.value = true;
            }
            if (store.config.ga) {
                GAToggle.value = true;
            }
            return;
        }
        eventConfig.pageTypeSeq = store.pageTypeSeq;
    }).finally(() => {
        loadingHide()
    })
})
const onSubmit = async () => {
    var start, end, data, beginDate, endDate;
    if (eventConfig.beginDate && eventConfig.beginTime) {
        beginDate = new Date(eventConfig.beginDate);
        start = +new Date(`${beginDate.getFullYear()}/${beginDate.getMonth() + 1}/${beginDate.getDate()} ${eventConfig.beginTime.hours}:${eventConfig.beginTime.minutes}`);
        valid.beginDate = true;
    } else {
        valid.beginDate = false;
    }
    if (eventConfig.endDate && eventConfig.endTime) {
        endDate = new Date(eventConfig.endDate);
        end = +new Date(`${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()} ${eventConfig.endTime.hours}:${eventConfig.endTime.minutes}`);
        valid.endDate = true;
    } else {
        valid.endDate = false;
    }
    if ((start && end) && (end >= start) && (end != start)) {
        valid.beginDate = true;
        valid.endDate = true;
    } else {
        valid.beginDate = false;
        valid.endDate = false;
    }

    if (Number(eventConfig.gameseq) > 0) {
        valid.gameseq = true;
    } else {
        valid.gameseq = false;
    }
    if (eventConfig.eventName.length > 0 && eventConfig.eventName.length <= 50) {
        valid.eventName = true;
    } else {
        valid.eventName = false;
    }
    if (eventConfig.webtitle.length > 0 && eventConfig.webtitle.length <= 50) {
        valid.webtitle = true;
    } else {
        valid.webtitle = false;
    }
    if (eventConfig.webDescription) {
        if (eventConfig.webDescription.length > 50) {
            valid.webDescription = false;
        } else {
            valid.webDescription = true;
        }
    }
    if (eventConfig.ogTitle) {
        if (eventConfig.ogTitle.length > 20) {
            valid.ogTitle = false;
        } else {
            valid.ogTitle = true;
        }
    }
    if (eventConfig.ogDescription) {
        if (eventConfig.ogDescription.length > 50) {
            valid.ogDescription = false;
        } else {
            valid.ogDescription = true;
        }
    }
    if (eventConfig.ogUrl) {
        if (!await CheckImage(eventConfig.ogUrl)) {
            valid.ogUrl = false;
        } else {
            valid.ogUrl = true;
        }
    }
    if (eventConfig.ga) {
        if (eventConfig.ga.length > 500) {
            valid.ga = false;
        } else {
            valid.ga = true;
        }
    }
    if (eventConfig.gtm) {
        if (eventConfig.gtm.length > 500) {
            valid.gtm = false;
        } else {
            valid.gtm = true;
        }
    }
    var validCheck = Object.keys(valid).every(function (v, i) {
        return valid[v] == true;
    })
    if (validCheck) {
        data = { ...eventConfig };
        beginDate = new Date(data.beginDate);
        endDate = new Date(data.endDate);
        data.beginDate = `${beginDate.getFullYear()}/${beginDate.getMonth() + 1}/${beginDate.getDate()} ${data.beginTime.hours}:${data.beginTime.minutes}`;
        data.endDate = `${endDate.getFullYear()}/${endDate.getMonth() + 1}/${endDate.getDate()} ${data.endTime.hours}:${data.endTime.minutes}`;
        data.gameName = gameOptions.value.filter((v, i) => {
            return v.guid == data.gameseq
        })[0].gameName;
        Object.keys(data).forEach((v, i) => {
            if (data[v] == null) {
                data[v] = "";
            }
        })
        loadingShow();
        if (store.status == "edit") {
            UpdateEvent(store.otp, data).then((res) => {
                let { code, message, url, listData } = res.data;
                if (code != 1) {
                    messageText.value = message;
                    messageLightbox.value = true;
                    return;
                }
                createText.value = "?????????????????????";
                createLightbox.value = true;
                store.setStatus("");
                store.setSave(true);
                store.setPage("EventList")

            }).finally(() => {
                loadingHide()
            })
        } else {
            data.pageTypeSeq = store.pageTypeSeq;
            AddEventList(store.otp, data).then((res) => {
                let { code, message, url, listData, data: eventSeq } = res.data;
                if (code != 1) {
                    message.value = message;
                    messageLightbox.value = true;
                    return;
                }
                data.eventSeq = eventSeq;
                data.detail = t.template[data.pageTypeSeq].content;
                return store.setData(data);
            }).then((res) => {
                status.value = "create";
                createText.value = "?????????????????????";
                createLightbox.value = true;
            }).finally(() => {
                loadingHide()
            })
        }

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
        cookie: 0,
        header: 0,
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
const onComplete = () => {
    if (status.value == "edit") {
        store.setPage("EventList")
    } else {
        store.setPage("EditPage")
    }
}

const closeBtn = () => {
    store.setPage("EditPage")
}

const onEvent = (type) => {
    switch (type) {
        case "home":
            store.setInit();
            store.setPage("Home")
            break;
        case "editPage":
            store.setPage("EditPage");
            break;
        case "eventList":
            store.setPage("EventList");
            break;
    }
}
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">?????????</span>
            <span>{{ Object.keys(store.config).length > 0 ? '????????????' : '????????????' }}</span>
        </div>
        <div class="create-content">
            <div class="create-config__col">
                <g-select label="????????????" :options="gameOptions" v-model="eventConfig.gameseq"
                          :valid="valid.gameseq" :required="true">
                    <template #options="option">
                        <option :value="option.option.guid">{{ option.option.gameName }}</option>
                    </template>
                </g-select>
            </div>
            <div class="create-config__col">
                <div class="create-config__label required">????????????:</div>
                <div class="create-config__input" :class="[valid.beginDate ? '' : 'error']">
                    <g-date v-model="eventConfig.beginDate" :valid="valid.beginDate" />
                </div>
                <div class="create-config__input" :class="[valid.beginDate ? '' : 'error']">
                    <g-time v-model="eventConfig.beginTime" :valid="valid.beginDate" />
                </div>
            </div>
            <div class="create-config__col">
                <div class="create-config__label required">????????????:</div>
                <div class="create-config__input" :class="[valid.endDate ? '' : 'error']">
                    <g-date v-model="eventConfig.endDate" :valid="valid.endDate" />
                </div>
                <div class="create-config__input" :class="[valid.endDate ? '' : 'error']">
                    <g-time v-model="eventConfig.endTime" :valid="valid.endDate" />
                </div>
            </div>
            <div class="create-config__col">
                <g-input label="????????????" placeholder="????????????" v-model="eventConfig.eventName" :valid="valid.eventName"
                         maxlength="50"
                         :required="true" />
            </div>
            <div class="create-config__col">
                <div class="input-group__label required">Footer??????:</div>
                <g-radio label="???" name="footer" value="0" v-model="eventConfig.footer" />
                <g-radio label="???" name="footer" value="1" v-model="eventConfig.footer" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="COOKIE??????" v-model="eventConfig.cookie" trueValue="1" falseValue="0" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="HEADER" v-model="eventConfig.header" trueValue="1" falseValue="0" />
            </div>
            <!-- <div class="create-config__col">
                <g-checkbox label="Footer" v-model="eventConfig.footer.open" trueValue="1" falseValue="0" />
                <div class="create-config__col" v-if="eventConfig.footer.open == 1">
                    <g-radio label="dark" name="theme" value="dark" v-model="eventConfig.footer.theme" />
                    <g-radio label="light" name="theme" value="light" v-model="eventConfig.footer.theme" />
                </div>
            </div> -->
            <div class="create-config__col">
                <g-input label="????????????" placeholder="????????????" v-model="eventConfig.webtitle" :valid="valid.webtitle"
                         maxlength="50" :required="true" />
            </div>
            <div class="create-config__col">
                <g-input label="????????????" placeholder="????????????" v-model="eventConfig.webDescription"
                         :valid="valid.webDescription" maxlength="50" />
            </div>
            <div class="create-config__col">
                <g-input label="FB??????" placeholder="????????????" v-model="eventConfig.ogTitle" :valid="valid.ogTitle"
                         maxlength="20" />
            </div>
            <div class="create-config__col">
                <g-input label="FB??????" placeholder="????????????" v-model="eventConfig.ogDescription"
                         :valid="valid.ogDescription" maxlength="50" />
            </div>
            <div class="create-config__col">
                <g-input label="FB??????URL" placeholder="????????????" v-model="eventConfig.ogUrl"
                         :preview="eventConfig.ogUrl" :valid="valid.ogUrl" maxlength="50" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="GA" v-model="GAToggle" />
                <div class="create-config__col" v-if="GAToggle == 'true'">
                    <g-input placeholder="????????????:G-XXXXXXX" v-model="eventConfig.ga" :valid="valid.ga" maxlength="500" />
                </div>
            </div>
            <div class="create-config__col">
                <g-checkbox label="GTM" v-model="GTMToggle" />
                <div class="create-config__col" v-if="GTMToggle == 'true'">
                    <g-input placeholder="????????????:GTM-XXXXX" v-model="eventConfig.gtm" :valid="valid.gtm"
                             maxlength="500" />
                </div>
            </div>
            <!-- <div class="create-config__col">
                <g-textarea label="????????????script" v-model="eventConfig.script" />
            </div> -->
            <div class="create-btn__group">
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">????????????</a>
                <a href="javascript:;" class="btn btn__reset" @click="onReset">????????????</a>
                <a href="javascript:;" class="btn btn__submit" @click="onEvent('eventList')"
                   v-if="Object.keys(store.config).length > 0">?????????</a>
            </div>
        </div>
    </div>
    <!-- ??????????????? -->
    <g-lightbox v-model:showLightbox="createLightbox">
        <template #lightbox-close>
            <a href="javascript:;" class="g-lightbox__close icon-close" @click="closeBtn">close</a>
        </template>
        <template #lightbox-content>
            <div class="text-center">{{ createText }}</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onComplete">??????</a>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ messageText }}</div>
        </template>
    </g-lightbox>
</template>