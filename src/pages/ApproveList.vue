<script setup>
import { mainStore } from "../store/index";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";
import GHome from "../components/GHome.vue";
import { loadingShow, loadingHide } from "../Tool";
import { GetGames, GetApprovedEvent, UpdateApprovedEvent } from "../api";

const store = mainStore()
let openEventOff = ref(false)
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
let total = ref(5)
let currentPage = ref(1)
let messageText = ref("");
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

const eventDataSlice = computed(() => {
    if (eventData.value.length == 0) {
        return []
    }
    return eventData.value.slice(currentPage.value * total.value - total.value, currentPage.value * total.value)
})

const onSearch = () => {
    loadingShow()
    let data = { ...eventFilter };
    let { eventName, beginDate, endDate, gameSeq, approvedSeq } = data;
    GetApprovedEvent(store.otp, { eventName, beginDate, endDate, gameSeq, approvedSeq }).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            return;
        }
        eventData.value = listData || [];
        currentPage.value = 1;
        totalPage.value = Math.ceil(eventData.value.length / total.value);
        store.setApproveListFilter(data, currentPage.value, listData);
    }).finally(() => {
        loadingHide()
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

const onSaveTemp = () => {
    store.setEventListFilter({ ...eventFilter }, currentPage.value, eventData.value);
}

const eventStatus = (beginDate, endDate, show) => {
    let status = "?????????"
    if (show == 0) {
        status = "?????????";
    } else {
        if (+new Date() >= +new Date(beginDate) && +new Date() <= +new Date(endDate)) {
            status = "?????????";
        }
        if (+new Date() >= +new Date(endDate)) {
            status = "?????????";
        }
    }

    return status;
}

const eventOff = (event) => {
    approvedTemp.value = event;
    openEventOff.value = true;
}

const onSubmit = () => {
    loadingShow()
    let data = {};
    data.eventName = approvedTemp.value.eventName;
    data.beginDate = approvedTemp.value.beginDate;
    data.endDate = approvedTemp.value.endDate;
    data.approvedSeq = approvedTemp.value.approvedSeq;
    data.gameSeq = "" + approvedTemp.value.gameseq;
    Object.keys(data).forEach((v, i) => {
        if (data[v] == null) {
            data[v] = "";
        }
    })
    UpdateApprovedEvent(store.otp, data).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            return;
        }
        eventData.value.forEach((v, i) => {
            if (v.gameseq == data.gameSeq) {
                v.show = 0;
            }
        })

        openEventOff.value = false;
        return res;
    }).then((res) => {
        messageText.value = "???????????????";
        messageLightbox.value = true;
    }).finally(() => {
        loadingHide()
    })
}
const onCancel = (type) => {
    if (type == "??????") {
        openEventOff.value = false;
    }
}

onMounted(async () => {
    await nextTick()
    loadingShow()
    GetGames(store.otp).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            return;
        }
        gameSeqOptions.value = listData;
        if (Object.keys(store.approveListFilter).length) {
            Object.keys(eventFilter).forEach((v, i) => {
                eventFilter[v] = store.approveListFilter[v];
            })
            eventData.value = store.approveListData || [];
            currentPage.value = store.approveListCurrent;
            if (store.approveListData) {
                totalPage.value = Math.ceil(store.approveListData.length / total.value);
            } else {
                totalPage.value = 0;
            }
        } else {
            onSearch();
        }
    }).finally(() => {
        loadingHide()
    })
})
</script>
<template>
    <div class="container">
        <g-home />
        <div class="page-title">
            <span class="page-title--style">?????????</span>
            <span>??????????????????</span>
        </div>

        <div class="event-list__filter">
            <div class="event-list__col">
                <g-input label="????????????:" placeholder="????????????" v-model="eventFilter.eventName" />
            </div>
            <div class="event-list__col">
                <div class="event-list__label">????????????:</div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.beginDate" />
                </div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.endDate" />
                </div>
            </div>
            <div class="event-list__col">
                <g-select label="????????????:" v-model="eventFilter.gameSeq" :options="gameSeqOptions">
                    <template #options="option">
                        <option :value="option.option.guid">{{ option.option.gameName }}</option>
                    </template>
                </g-select>
            </div>
            <div class="event-list__col">
                <a href="javascript:;" class="btn btn__search" @click="onSearch">??????</a>
            </div>
        </div>

        <div class="event-list__content" v-if="eventData.length > 0">
            <div class="event-list__head">
                <div class="event-list__title">
                    <a href="javascript:;">????????????</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">????????????</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">????????????</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;">??????</a>
                </div>
            </div>
            <div class="event-list__body">
                <div class="event-list__box" v-for="(event, index) in eventDataSlice">
                    <div class="event-list__item">{{ gameSeqName(event.gameseq)[0]?.gameName || "" }}</div>
                    <div class="event-list__item">
                        <div class="event-list__date">{{ dateFormat(event.beginDate) }}-{{ dateFormat(event.endDate) }}
                        </div>
                    </div>
                    <div class="event-list__item"><a href="javascript:;">{{ event.eventName }}</a></div>
                    <div class="event-list__item">
                        <div class="event-list__status">
                            <div class="event-list__status-item" :class="[event.show == 0 ? '' : 'end']">{{
                                    eventStatus(event.beginDate, event.endDate,
                                        event.show)
                            }}</div>
                            <div class="event-list__status-item" v-if="(event.show == 1)"><a class="event-list__btn-off"
                                   href="javascript:;"
                                   @click="eventOff(event)">??????</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="event-list__content" v-else>
            <div class="event-list__null">??????????????????</div>
        </div>
        <div class="pagination__box" v-if="eventData.length > 0">
            <a href="javascript:;" class="btn btn__prev" :class="[currentPage == 1 ? 'disabled' : '']"
               @click="prev">?????????</a>
            <div class="pagination__page">
                <span class="on">{{ currentPage }}</span>/
                <span>{{ totalPage }}</span>
            </div>
            <a href="javascript:;" class="btn btn__next" :class="[currentPage == totalPage ? 'disabled' : '']"
               @click="next">?????????</a>
        </div>

        <g-lightbox v-model:showLightbox="openEventOff">
            <template #lightbox-title>
                <div>??????:</div>
            </template>
            <template #lightbox-content>
                <div>?????????????????????????????????????????????????????????????????????-??????????????????????????????????</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit">??????</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel('??????')">??????</a>
            </template>
        </g-lightbox>

        <g-lightbox v-model:showLightbox="messageLightbox">
            <template #lightbox-content>
                <div>{{ messageText }}</div>
            </template>
        </g-lightbox>
    </div>
</template>