<script setup>
import { storeToRefs } from "pinia";
import GCheckbox from '../elements/GCheckbox.vue';
import GRadio from '../elements/GRadioo.vue';
import GDate from '../elements/GDate.vue';
import GInput from '../elements/GInput.vue';
import GSelect from '../elements/GSelect.vue';
import GTime from '../elements/GTime.vue';
import GHome from "../components/GHome.vue";
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
    url: "", gA4Name: ""
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
            loadingHide()
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
    if (eventConfig.eventName.length > 0 && eventConfig.eventName.length <= 200) {
        valid.eventName = true;
    } else {
        valid.eventName = false;
    }
    if (eventConfig.webtitle.length > 0 && eventConfig.webtitle.length <= 200) {
        valid.webtitle = true;
    } else {
        valid.webtitle = false;
    }
    if (eventConfig.webDescription) {
        if (eventConfig.webDescription.length > 200) {
            valid.webDescription = false;
        } else {
            valid.webDescription = true;
        }
    } else {
        valid.webDescription = true;
    }
    if (eventConfig.ogTitle) {
        if (eventConfig.ogTitle.length > 200) {
            valid.ogTitle = false;
        } else {
            valid.ogTitle = true;
        }
    } else {
        valid.ogTitle = true;
    }
    if (eventConfig.ogDescription) {
        if (eventConfig.ogDescription.length > 200) {
            valid.ogDescription = false;
        } else {
            valid.ogDescription = true;
        }
    } else {
        valid.ogDescription = true;
    }
    if (eventConfig.ogUrl) {
        if (!await CheckImage(eventConfig.ogUrl)) {
            valid.ogUrl = false;
        } else {
            valid.ogUrl = true;
        }
    } else {
        valid.ogUrl = true;
    }
    if (eventConfig.ga) {
        if (eventConfig.ga.length > 500) {
            valid.ga = false;
        } else {
            valid.ga = true;
        }
    } else {
        valid.ga = true;
    }
    if (eventConfig.gtm) {
        if (eventConfig.gtm.length > 500) {
            valid.gtm = false;
        } else {
            valid.gtm = true;
        }
    } else {
        valid.gtm = true;
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
                    loadingHide()
                    return;
                }
                createText.value = "活動已更新完成";
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
                    messageText.value = message;
                    messageLightbox.value = true;
                    loadingHide()
                    return;
                }
                data.eventSeq = eventSeq;
                data.detail = t.template[data.pageTypeSeq].content;
                return store.setData(data);
            }).then((res) => {
                status.value = "create";
                createText.value = "活動已建立成功";
                createLightbox.value = true;
            }).finally(() => {
                loadingHide()
            })
        }

    }
}
const onReset = () => {
    eventConfig.gameseq = "";
    eventConfig.beginDate = "";
    eventConfig.beginTime.hours = "";
    eventConfig.beginTime.minutes = "";
    eventConfig.endDate = "";
    eventConfig.endTime.hours = "";
    eventConfig.endTime.minutes = "";
    eventConfig.eventName = "";
    eventConfig.cookie = 0;
    eventConfig.header = 0;
    eventConfig.webtitle = "";
    eventConfig.webDescription = "";
    eventConfig.ogTitle = "";
    eventConfig.ogDescription = "";
    eventConfig.ogUrl = "";
    eventConfig.script = "";
    eventConfig.flag = 0;
    eventConfig.createUser = "";
    eventConfig.createTime = "";
    eventConfig.updateUser = "";
    eventConfig.updateTime = "";
    eventConfig.ga = "";
    eventConfig.gtm = "";
    eventConfig.gA4Name = "";
    GAToggle.value = false;
    GTMToggle.value = false;
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
            <span class="page-title--style">網柑達</span>
            <span>{{ Object.keys(store.config).length > 0 ? '編輯活動' : '新增活動' }}</span>
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
                <div class="create-config__input" :class="[valid.beginDate ? '' : 'error']">
                    <g-date v-model="eventConfig.beginDate" :valid="valid.beginDate" />
                </div>
                <div class="create-config__input" :class="[valid.beginDate ? '' : 'error']">
                    <g-time v-model="eventConfig.beginTime" :valid="valid.beginDate" />
                </div>
            </div>
            <div class="create-config__col">
                <div class="create-config__label required">下架日期:</div>
                <div class="create-config__input" :class="[valid.endDate ? '' : 'error']">
                    <g-date v-model="eventConfig.endDate" :valid="valid.endDate" />
                </div>
                <div class="create-config__input" :class="[valid.endDate ? '' : 'error']">
                    <g-time v-model="eventConfig.endTime" :valid="valid.endDate" />
                </div>
            </div>
            <div class="create-config__col">
                <g-input label="活動名稱" placeholder="輸入內容" v-model="eventConfig.eventName" :valid="valid.eventName"
                         max="200"
                         :required="true" />
            </div>
            <div class="create-config__col">
                <div class="input-group__label required">Footer顏色:</div>
                <g-radio label="黑" name="footer" value="0" v-model="eventConfig.footer" />
                <g-radio label="白" name="footer" value="1" v-model="eventConfig.footer" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="COOKIE政策" v-model="eventConfig.cookie" trueValue="1" falseValue="0" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="HEADER" v-model="eventConfig.header" trueValue="1" falseValue="0" />(手機版不會顯示HEADER)
            </div>
            <!-- <div class="create-config__col">
                        <g-checkbox label="Footer" v-model="eventConfig.footer.open" trueValue="1" falseValue="0" />
                        <div class="create-config__col" v-if="eventConfig.footer.open == 1">
                            <g-radio label="dark" name="theme" value="dark" v-model="eventConfig.footer.theme" />
                            <g-radio label="light" name="theme" value="light" v-model="eventConfig.footer.theme" />
                        </div>
                    </div> -->
            <div class="create-config__col">
                <g-input label="網頁標題" placeholder="輸入內容" v-model="eventConfig.webtitle" :valid="valid.webtitle"
                         max="200" :required="true" />
            </div>
            <div class="create-config__col">
                <g-input label="網頁說明" placeholder="輸入內容" v-model="eventConfig.webDescription"
                         :valid="valid.webDescription" max="200" />
            </div>
            <div class="create-config__col">
                <g-input label="FB標題" placeholder="輸入內容" v-model="eventConfig.ogTitle" :valid="valid.ogTitle"
                         max="200" />
            </div>
            <div class="create-config__col">
                <g-input label="FB說明" placeholder="輸入內容" v-model="eventConfig.ogDescription"
                         :valid="valid.ogDescription" max="200" />
            </div>
            <div class="create-config__col">
                <g-input label="FB縮圖URL" placeholder="輸入內容" v-model="eventConfig.ogUrl"
                         :preview="eventConfig.ogUrl" :valid="valid.ogUrl" maxlength="50" />
            </div>
            <div class="create-config__col">
                <g-checkbox label="GA" v-model="GAToggle" />
                <div class="create-config__col" v-if="GAToggle == true || GAToggle == 'true'">
                    <g-input placeholder="輸入內容:G-XXXXXXX" v-model="eventConfig.ga" :valid="valid.ga" maxlength="500" />
                </div>
            </div>
            <div class="create-config__col">
                <g-checkbox label="GTM" v-model="GTMToggle" />
                <div class="create-config__col" v-if="GTMToggle == true || GTMToggle == 'true'">
                    <g-input placeholder="輸入內容:GTM-XXXXX" v-model="eventConfig.gtm" :valid="valid.gtm"
                             maxlength="500" />
                </div>
            </div>
            <!-- <div class="create-config__col">
                        <g-textarea label="其它行銷script" v-model="eventConfig.script" />
                    </div> -->
            <div class="create-btn__group">
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                <a href="javascript:;" class="btn btn__submit" @click="onEvent('eventList')"
                   v-if="Object.keys(store.config).length > 0">回列表</a>
            </div>
        </div>
    </div>
    <!-- 已存檔完成 -->
    <g-lightbox v-model:showLightbox="createLightbox">
        <template #lightbox-close>
            <a href="javascript:;" class="g-lightbox__close icon-close" @click="closeBtn">close</a>
        </template>
        <template #lightbox-content>
            <div class="text-center">{{ createText }}</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onComplete">確認</a>
        </template>
    </g-lightbox>
    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div>{{ messageText }}</div>
        </template>
    </g-lightbox>
</template>