<script setup>
import { mainStore } from "../store/index";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";
import GHome from "../components/GHome.vue";
import { loadingShow, loadingHide } from "../Tool";
import { CopyEvent, GetGames, GetEventList, ApproveEvent, AddEventList, UpdateEvent } from "../api";

const store = mainStore()
let approveLightbox = ref(false)
let approvedLightbox = ref(false)
let copyLightbox = ref(false)
let eventFilter = reactive({
    eventName: "",
    beginDate: ref(""),
    endDate: ref(""),
    gameseq: "",
    flag: "",
    sort: ""
})

let gameSeqOptions = ref([])
let flagOptions = ref([{ value: "", text: "" }, { value: 0, text: "編輯中" }, { value: "1", text: "審核中" }, { value: "2", text: "審核通過" }])
let eventData = ref([])
let totalPage = ref(0)
let total = ref(30)
let currentPage = ref(1)
let approveTemp = ref({});
let messageText = ref("");
let messageLightbox = ref(false);
let messageAccess = ref(0);

if (window.sessionStorage.getItem("state")) {
    window.sessionStorage.removeItem("state")
}

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
    return eventData.value.slice(currentPage.value * total.value - total.value, currentPage.value * total.value);
})

const onSort = (type) => {
    if (type == eventFilter.sort) {
        eventFilter.sort = "";
    } else {
        eventFilter.sort = type;
    }
    onSearch();
}
const onSearch = () => {
    loadingShow()
    if (eventFilter.beginDate == null) {
        eventFilter.beginDate = "";
    }
    if (eventFilter.endDate == null) {
        eventFilter.endDate = "";
    }
    let data = { ...eventFilter };
    GetEventList(store.otp, data).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            loadingHide()
            return;
        }
        eventData.value = listData || [];
        messageAccess.value = message;
        if (store.save) {
            currentPage.value = store.eventListCurrent;
            if (store.eventListData) {
                totalPage.value = Math.ceil(store.eventListData.length / total.value);
            } else {
                totalPage.value = 0;
            }
        } else {
            currentPage.value = 1;
            if (eventData.value.length) {
                totalPage.value = Math.ceil(eventData.value.length / total.value);
            } else {
                totalPage.value = 0;
            }

        }
        store.setEventListFilter(data, currentPage.value, listData, message);
        store.setSave(false);
    }).finally(() => {
        loadingHide()
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
        case 4:
            return "審核不過"
    }
}

const dateFormat = (date) => {
    let dateTime = new Date(date)
    return `${dateTime.getFullYear()}/${("" + (dateTime.getMonth() + 1)).padStart(2, 0)}/${("" + dateTime.getDate()).padStart(2, 0)} ${("" + dateTime.getHours()).padStart(2, 0)}:${("" + dateTime.getMinutes()).padStart(2, 0)}`
}

const onSaveTemp = () => {
    store.setEventListFilter({ ...eventFilter }, currentPage.value, eventData.value, messageAccess.value);
}

const onEditEvent = (event) => {
    let data = { ...event };
    data.beginTime = {
        hours: "", minutes: ""
    };
    data.endTime = {
        hours: "", minutes: ""
    };
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()

    store.setConfig(data).then((res) => {
        store.setStatus("edit");
        store.setPage("CreateEvent");
        onSaveTemp();
    });

}
const onEditDetail = (event) => {
    let data = { ...event };
    data.beginTime = {
        hours: "", minutes: ""
    };
    data.endTime = {
        hours: "", minutes: ""
    };
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.beginTime.hours = new Date(data.beginDate).getHours()
    data.beginTime.minutes = new Date(data.beginDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()
    data.endTime.hours = new Date(data.endDate).getHours()
    data.endTime.minutes = new Date(data.endDate).getMinutes()
    store.setData(data).then((res) => {
        store.setStatus("edit");
        store.setPage("EditPage");
        onSaveTemp();
    });
}
const onPreview = async (event) => {
    if (event.detail == null) {
        messageText.value = "請先編輯內容";
        messageLightbox.value = true;
        return;
    }
    await store.setData(event)
    store.setStorageState(store.$state, "EventList").then((res) => {
        store.setPage("Preview", {
            eventSeq: event.eventSeq,
            gameseq: event.gameseq,
        })
    }).catch((err) => {
        messageText.value = `文字區塊內使用的圖片容量過大</br>
                無法正常使用預覽功能</br>
                請改用圖片區塊+文字區塊來呈現，謝謝！`;
        messageLightbox.value = true;
    });

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

const onSubmit = (type) => {
    var data = { ...approveTemp.value }
    Object.keys(data).forEach((v, i) => {
        if (data[v] == null) {
            data[v] = "";
        }
    })
    loadingShow();
    if (type == '送審') {
        data.flag = 1;
        ApproveEvent(store.otp, data).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                messageText.value = message;
                messageLightbox.value = true;
                loadingHide()
                return code;
            }
            eventData.value.forEach((v, i) => {
                if (v.eventSeq == data.eventSeq) {
                    v.flag = 1;
                }
            })
            return code;
        }).then((res) => {
            if (res == 1) {
                messageText.value = "已送審成功";
                messageLightbox.value = true;
                store.setSave(true);
                onSaveTemp();
                onSearch();
            }
        }).finally(() => {
            approveLightbox.value = false;
            loadingHide()
        })
    }
    if (type == '審核通過') {
        data.flag = 2;
        ApproveEvent(store.otp, data).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                messageText.value = message;
                messageLightbox.value = true;
                loadingHide()
                return code;
            }
            eventData.value.forEach((v, i) => {
                if (v.eventSeq == data.eventSeq) {
                    v.flag = 2;
                }
            })

            return code;
        }).then((res) => {
            if (res == 1) {
                messageText.value = "已審核成功";
                messageLightbox.value = true;
                store.setSave(true);
                onSaveTemp();
                onSearch();
            }
        }).finally(() => {
            approvedLightbox.value = false;
            loadingHide()
        })
    }
    if (type == '審核不通過') {
        data.flag = 4;
        ApproveEvent(store.otp, data).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                messageText.value = message;
                messageLightbox.value = true;
                loadingHide()
                return code;
            }
            eventData.value.forEach((v, i) => {
                if (v.eventSeq == data.eventSeq) {
                    v.flag = 2;
                }
            })
            return code;
        }).then((res) => {
            if (res == 1) {
                messageText.value = "審核不通過";
                messageLightbox.value = true;
                store.setSave(true);
                onSaveTemp();
                onSearch();
            }
        }).finally(() => {
            approvedLightbox.value = false;
            loadingHide()
        })
    }
    if (type == "複製活動") {
        CopyEvent(store.otp, data).then((res) => {
            let { code, message, url, listData } = res.data;
            if (code != 1) {
                messageText.value = message;
                messageLightbox.value = true;
                loadingHide()
                return
            }
            store.setSave(true);
            // onSaveTemp();
            onSearch();
            messageText.value = `<h2>已複製成功</h2><br/>請記得調整相關活動時間與活動名稱等資訊`;
            messageLightbox.value = true;
        }).finally(() => {
            approveTemp.value = {};
            copyLightbox.value = false;
            loadingHide()
        })
    }
}

const onCancel = (type) => {
    if (type == "送審") {
        approveLightbox.value = false;
    }
    if (type == "審核") {
        approvedLightbox.value = false;
    }
    if (type == "複製活動") {
        copyLightbox.value = false;
    }
}

const onCopy = (event) => {
    approveTemp.value = event;
    copyLightbox.value = true;
}

onMounted(async () => {
    await nextTick()
    loadingShow()
    GetGames(store.otp).then((res) => {
        let { code, message, url, listData } = res.data;
        if (code != 1) {
            messageText.value = message;
            messageLightbox.value = true;
            loadingHide()
            return;
        }
        gameSeqOptions.value = [{ guid: "", gameName: "" }, ...listData];
        if (Object.keys(store.eventListFilter).length) {
            Object.keys(eventFilter).forEach((v, i) => {
                eventFilter[v] = store.eventListFilter[v];
            })
            if (!store.save) {
                eventData.value = store.eventListData || [];
                currentPage.value = store.eventListCurrent;
                messageAccess.value = store.eventListMessage;
                if (store.eventListData) {
                    totalPage.value = Math.ceil(store.eventListData.length / total.value);
                } else {
                    totalPage.value = 0;
                }
                loadingHide()
            } else {
                onSearch();
            }
        } else {
            onSearch();
        }
    })
})
</script>
<template>
    <div class="container event-list__container">
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
                    <a href="javascript:;">編號</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'gameseq' ? 'on' : '']"
                       @click="onSort('gameseq')">遊戲名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" class="arrow" :class="[eventFilter.sort == 'beginDate' ? 'on' : '']"
                       @click="onSort('beginDate')">活動區間</a>
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
                <div class="event-list__box" v-for="event in eventDataSlice">
                    <div class="event-list__item">{{
                        event.eventSeq
                    }}</div>
                    <div class="event-list__item" :class="[gameSeqName(event.gameseq)[0]?.gameName ? '' : 'end']">{{
                        gameSeqName(event.gameseq)[0]?.gameName || "遊戲已下架"
                    }}</div>
                    <div class="event-list__item">
                        <div class="event-list__date">{{ dateFormat(event.beginDate) }}-{{ dateFormat(event.endDate) }}
                        </div>
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
                                <a href="javascript:;" class="event-list__btn event-list__btn-copy"
                                   v-if="(event.flag != 1)"
                                   @click="onCopy(event)">複製活動</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-edit"
                                   v-if="(event.flag != 1)"
                                   @click="onEditEvent(event)">編輯活動</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-content"
                                   v-if="(event.flag != 1)"
                                   @click="onEditDetail(event)">編輯內容</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-preview"
                                   @click="onPreview(event)">預覽</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-approve"
                                   v-if="event.flag == 0"
                                   @click="onApprove(event, '送審')">送審</a>
                                <a href="javascript:;" class="event-list__btn event-list__btn-approved"
                                   v-if="(event.flag == 1 && messageAccess == 1)"
                                   @click="onApprove(event, '審核')">審核</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="event-list__content" v-else>
            <div class="event-list__null">目前沒有資料</div>
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
                <div>活動名稱【{{ approveTemp.eventName }}】</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit('送審')">確認</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel('送審')">取消</a>
            </template>
        </g-lightbox>
        <g-lightbox v-model:showLightbox="approvedLightbox">
            <template #lightbox-title>
                <div>審核活動:</div>
            </template>
            <template #lightbox-content>
                <div>活動名稱【{{ approveTemp.eventName }}】</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit('審核通過')">審核通過</a>
                <a href="javascript:;" class="btn btn__unapprove" @click="onSubmit('審核不通過')">審核不通過</a>
            </template>
        </g-lightbox>
        <g-lightbox v-model:showLightbox="copyLightbox">
            <template #lightbox-title>
                <div>是否確認要複製此活動？</div>
            </template>
            <template #lightbox-btn>
                <a href="javascript:;" class="btn btn__submit" @click="onSubmit('複製活動')">確認</a>
                <a href="javascript:;" class="btn btn__reset" @click="onCancel('複製活動')">取消</a>
            </template>
        </g-lightbox>

        <g-lightbox v-model:showLightbox="messageLightbox">
            <template #lightbox-content>
                <div v-html="messageText"></div>
            </template>
        </g-lightbox>
    </div>
</template>