<script setup>
import { onMounted, onUpdated } from "vue";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";
import GHome from "../components/GHome.vue";
import { loadingShow, loadingHide } from "../Tool";
import { GetGames, GetEventList, ApproveEvent } from "../api";

let approveLightbox = ref(false)
let approvedLightbox = ref(false)
let loading = ref(true)
let eventFilter = reactive({
    eventName: "",
    beginDate: ref(""),
    endDate: ref(""),
    gameseq: "",
    flag: "",
    sort: ""
})

let gameSeqOptions = ref([])
let flagOptions = ref([{ value: 0, text: "編輯中" }, { value: "1", text: "審核中" }, { value: "2", text: "審核通過" }, { value: "3", text: "刪除" }])
let eventData = ref([])
let totalPage = ref(0)
let currentPage = ref(1)
let approveTemp = ref({})
let message = ref("");
let messageLightbox = ref(false);

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

const onSort = (type) => {
    if (type == eventFilter.sort) {
        return;
    }
    eventFilter.sort = type;
    loadingShow()
    let data = { ...eventFilter };
    let { eventName, beginDate, endDate, gameseq, flag, sort } = data;
    GetEventList(1, { eventName, beginDate, endDate, gameseq, flag, sort } = data).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            return;
        }
        loadingHide()
        eventData.value = listData;
        totalPage.value = Math.ceil(listData.length / 30);
    })
}
const onSearch = () => {
    loadingShow()
    let data = { ...eventFilter };
    let { eventName, beginDate, endDate, gameseq, flag, sort } = data;
    GetEventList(1, { eventName, beginDate, endDate, gameseq, flag, sort } = data).then((res) => {
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

const eventStatus = (beginDate, endDate) => {
    let status = ""
    if (+new Date() >= +new Date(beginDate) && +new Date() <= +new Date(endDate)) {
        status = "已上線"
    }
    if (+new Date() >= +new Date(endDate)) {
        status = "已結束"
    }
    return status;
}

const flagFormat = (flag) => {
    switch (Number(flag)) {
        case 0:
            return "編輯中"
        case 1:
            return "審核中"
        case 2:
            return "審核通過"
        case 3:
            return "刪除"
        case 4:
            return "審核不過"
    }
}

const dateFormat = (date) => {
    let dateTime = new Date(date)
    return `${dateTime.getFullYear()}/${dateTime.getMonth() + 1}/${dateTime.getDate()}`
}

const onEditEvent = (eventSeq) => {
    let data = {}
    data = eventData.value.filter((v, i) => {
        return v.eventSeq == eventSeq
    })
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()

    store.setConfig(data).then((res) => {
        store.setPage("CreateEvent");
    });

}
const onEditDetail = (eventSeq) => {
    let data = {};
    data = eventData.value.filter((v, i) => {
        return v.eventSeq == eventSeq
    })
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()

    store.setData(data).then((res) => {
        store.setPage("EditPage");
    });
}
const onPreview = (data) => {
    store.setData(data).then((res) => {
        store.setPage("Preview")
    })
}

const onApprove = (event, type) => {
    approveTemp.value = event;
    if (type == '送審') {
        approveLightbox.value = true;
    }
    if (type == '審核') {
        approvedLightbox.value = true;
    }
}

const onSubmit = (ref, type) => {
    if (type == '審核') {
        ApproveEvent(1, approveTemp).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                return;
            }
            ref["value"] = false;
        })
    }
    if (type == '送審') {
        ApproveEvent(1, approveTemp).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                return;
            }
            ref["value"] = false;
        })
    }


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
            <span>活動列表</span>
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
                <g-select label="遊戲類別:" v-model="eventFilter.gameseq" :options="gameSeqOptions">
                    <template #options="option">
                        <option :value="option.option.guid">{{ option.option.gameName }}</option>
                    </template>
                </g-select>
                <g-select label="狀態" v-model="eventFilter.flag" :options="flagOptions" />
            </div>
            <div class="event-list__col">
                <a href="javascript:;" class="btn btn__search" @click="onSearch">搜尋</a>
            </div>
        </div>

        <div class="event-list__content" v-if="eventData.length > 0">
            <div class="event-list__head">
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'gameseq' ? 'on' : '']"
                       @click="onSort('gameseq')">遊戲名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'date' ? 'on' : '']"
                       @click="onSort('date')">活動區間</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'eventName' ? 'on' : '']"
                       @click="onSort('eventName')">活動名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'flag' ? 'on' : '']"
                       @click="onSort('flag')">狀態</a>
                </div>
            </div>
            <div class="event-list__body">
                <div class="event-list__box" v-for="event in eventData">
                    <div class="event-list__item">{{ gameSeqName(event.gameseq)[0]?.gameName || "" }}</div>
                    <div class="event-list__item">
                        <div class="event-list__date">{{ dateFormat(event.beginDate) }}-{{ dateFormat(event.endDate) }}
                        </div>
                        <div
                             :class="[eventStatus(event.beginDate, event.endDate) == '已上線' ? 'event-list__date-online' : 'event-list__date-end']">
                            {{ eventStatus(event.beginDate, event.endDate) }}</div>
                    </div>
                    <div class="event-list__item"><a
                           :href="[event.flag == 2 && event.approvedUrl ? event.approvedUrl : 'javascript:;']"
                           :target="[event.flag == 2 && event.approvedUrl ? '_blank' : '']">{{ event.eventName }}</a>
                    </div>
                    <div class="event-list__item">
                        <div class="event-list__status">
                            <div class="event-list__status-item" :data-status="flagFormat(event.flag)">{{
                                    flagFormat(event.flag)
                            }}</div>
                            <div class="event-list__status-item">
                                <a href="javascript:;" class="event-list__btn event-list__btn-edit"
                                   v-if="event.flag == 0 || event.flag == 2"
                                   @click="onEditEvent(event.eventSeq)">編輯活動</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-edit"
                                   v-if="event.flag == 0 || event.flag == 2"
                                   @click="onEditDetail(event.eventSeq)">編輯內容</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-preview"
                                   @click="onPreview(event.detail)">預覽</a>
                                <a href="javascript:;" class="event-list__btn" v-if="event.flag == 0"
                                   @click="onApprove(event, '送審')">送審</a>
                                <a href="javascript:;" class="event-list__btn" v-if="event.flag == 2"
                                   @click="onApprove(event, '審核')">審核</a>
                            </div>
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

        <g-lightbox v-model:showLightbox="approveLightbox">
            <template #lightbox-title>
                <div>是否確定送審活動:</div>
            </template>
            <template #lightbox-content>
                <div>活動名稱</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit(approveLightbox, '送審')">確認</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel(approveLightbox)">取消</a>
            </template>
        </g-lightbox>
        <g-lightbox v-model:showLightbox="approvedLightbox">
            <template #lightbox-title>
                <div>審核活動:</div>
            </template>
            <template #lightbox-content>
                <div>活動名稱</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit(approvedLightbox, '審核')">確認</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel(approvedLightbox)">取消</a>
            </template>
        </g-lightbox>
        <g-lightbox v-model:showLightbox="messageLightbox">
            <template #lightbox-content>
                <div>{{ message }}</div>
            </template>
        </g-lightbox>
    </div>
</template>