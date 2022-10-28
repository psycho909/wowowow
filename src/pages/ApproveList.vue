<script setup>
import { onMounted, onUpdated } from "vue";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";
import GHome from "../components/GHome.vue";
import { loadingShow, loadingHide } from "../Tool";
import { GetGames, GetApprovedEvent, UpdateApprovedEvent } from "../api";

let openEventOff = ref(false)
let loading = ref(true)
let eventFilter = reactive({
    eventName: "",
    beginDate: ref(""),
    endDate: ref(""),
    gameSeq: "",
    gameStatus: "",
    approvedSeq: 0
})
let gameSeqOptions = ref([])
let eventData = ref([])
let totalPage = ref(0)
let currentPage = ref(1)
let message = ref("");
let messageLightbox = ref(false);
let approvedTemp = ref({})

const prev = () => {
    let temp = currentPage.value;
    temp -= 1;
    if (temp < 1) {
        return;
    }

    currentPage.value = temp;
}
const next = () => {
    let temp = currentPage.value;
    temp += 1;
    if (temp > totalPage.value) {
        return;
    }
    currentPage.value = temp;
}
onMounted(async () => {
    await nextTick()
    loadingShow()
    GetGames(1).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        loadingHide()
        gameSeqOptions.value = listData;
        loading.value = false;
    })
})

const onSearch = () => {
    loadingShow()
    let data = { ...eventFilter };
    let { eventName, beginDate, endDate, gameSeq, approvedSeq } = data;
    GetApprovedEvent(1, { eventName, beginDate, endDate, gameSeq, approvedSeq }).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        loadingHide()
        eventData.value = listData;
        totalPage.value = Math.ceil(listData.length / 30);
    })
}

const gameSeqName = (gameseq) => {
    return gameSeqOptions.value.filter((v, i) => {
        return gameseq == v.guid
    })
}

const dateFormat = (date) => {
    let dateTime = new Date(date)
    return `${dateTime.getFullYear()}/${dateTime.getMonth() + 1}/${dateTime.getDate()}`
}

const eventStatus = (beginDate, endDate, show) => {
    let status = "待上架"
    if (show) {
        if (+new Date() >= +new Date(beginDate) && +new Date() <= +new Date(endDate)) {
            status = "已上線";
        }
        if (+new Date() >= +new Date(endDate)) {
            status = "已結束";
        }
    } else {
        status = "已下架";
    }

    return status;
}

const eventOff = (event) => {
    approvedTemp.value = event;
    openEventOff.value = true;
}

const onSubmit = () => {
    loadingShow()
    let data = { ...approvedTemp };
    data.gameSeq = data.gameseq;
    let { eventName, beginDate, endDate, gameSeq, approvedSeq } = data;
    UpdateApprovedEvent(1, { eventName, beginDate, endDate, gameSeq, approvedSeq }).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        loadingHide()
        eventData.value = listData;
        totalPage.value = Math.ceil(listData.length / 30);
        openEventOff.value = false;
        message.value = "已下架成功";
        return listData;
    }).then((res) => {
        messageLightbox.value = true;
    })
}
const onCancel = (ref) => {
    ref["value"] = false;
}
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>已審活動列表</span>
        </div>

        <div class="event-list__filter">
            <div class="event-list__col">
                <g-input label="活動名稱:" placeholder="輸入內容" v-model="eventFilter.eventName" />
            </div>
            <div class="event-list__col">
                <div class="event-list__label">日期區間:</div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.beginDate" />
                </div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.endDate" />
                </div>
            </div>
            <div class="event-list__col">
                <g-select label="遊戲類別:" v-model="eventFilter.gameSeq" :options="gameSeqOptions">
                    <template #options="option">
                        <option :value="option.option.guid">{{ option.option.gameName }}</option>
                    </template>
                </g-select>
            </div>
            <div class="event-list__col">
                <a href="javascript:;" class="btn btn__search" @click="onSearch">搜尋</a>
            </div>
        </div>

        <div class="event-list__content" v-if="eventData.length > 0">
            <div class="event-list__head">
                <div class="event-list__title">
                    <a href="javascript:;">遊戲名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">活動區間</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">活動名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">狀態</a>
                </div>
            </div>
            <div class="event-list__body">
                <div class="event-list__box" v-for="(event, index) in eventData">
                    <div class="event-list__item">{{ gameSeqName(event.gameseq)[0]?.gameName || "" }}</div>
                    <div class="event-list__item">
                        <div class="event-list__date">{{ dateFormat(event.beginDate) }}-{{ dateFormat(event.endDate) }}
                        </div>
                    </div>
                    <div class="event-list__item"><a href="javascript:;">{{ event.eventName }}</a></div>
                    <div class="event-list__item">
                        <!-- 待下架/已上線 -->
                        <div class="event-list__status">
                            <div class="event-list__status-item" :class="[event.show > 0 ? '' : 'end']">{{
                                    eventStatus(event.beginDate, event.endDate,
                                        event.show)
                            }}</div>
                            <div class="event-list__status-item" v-if="event.show > 0"><a class="event-list__btn-off"
                                   href="javascript:;"
                                   @click="eventOff(event)">下架</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination__box" v-if="eventData.length > 0">
            <a href="javascript:;" class="btn btn__prev" :class="[currentPage == 1 ? 'disabled' : '']"
               @click="prev">上一頁</a>
            <div class="pagination__page">
                <span class="on">{{ currentPage }}</span>/
                <span>{{ totalPage }}</span>
            </div>
            <a href="javascript:;" class="btn btn__next" :class="[currentPage == totalPage ? 'disabled' : '']"
               @click="next">下一頁</a>
        </div>

        <g-lightbox v-model:showLightbox="openEventOff">
            <template #lightbox-title>
                <div>注意:</div>
            </template>
            <template #lightbox-content>
                <div>若下架活動，外部將無法顯示活動頁需重新經由編輯-審核流程是否確定要下架?</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel(openEventOff)">取消</a>
            </template>
        </g-lightbox>

        <g-lightbox v-model:showLightbox="messageLightbox">
            <template #lightbox-content>
                <div>{{ message }}</div>
            </template>
        </g-lightbox>
    </div>
</template>