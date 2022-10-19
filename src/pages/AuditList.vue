<script setup>
import { onMounted, onUpdated } from "vue";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";

let openEventOff = ref(false)
let eventFilter = reactive({
    eventName: "",
    startDate: ref(new Date()),
    endDate: ref(new Date()),
    gameType: "",
    gameStatus: "",
})

let options1 = [{ value: 1, text: "11" }, { value: 2, text: "22" }]
let options2 = [{ value: 1, text: "33" }, { value: 2, text: "44" }]

let eventData = [{}, {}, {}]

let sort = ref("")
let totalPage = ref(10)
let currentPage = ref(1)

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
})


onUpdated(() => {
    console.log(123)

})

const onSort = (type) => {
    if (type == sort.value) {
        return;
    }
    switch (type) {
        case "game":
            sort.value = "game";
            break;
        case "date":
            sort.value = "date";
            break;
        case "event":
            sort.value = "event";
            break;
        case "create":
            sort.value = "create";
            break;
        case "status":
            sort.value = "status";
            break;
    }
}
const onSearch = () => {
    console.log(eventFilter)
}

const eventOff = (event) => {
    openEventOff.value = true;
}

const onSubmit = () => {
    openEventOff.value = false;
}
const onCancel = () => {
    openEventOff.value = false;
}
</script>
<template>
    <div class="container">
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
                    <g-date v-model="eventFilter.startDate" />
                </div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.endDate" />
                </div>
            </div>
            <div class="event-list__col">
                <g-select label="遊戲類別:" v-model="eventFilter.gameType" :options="options1" />
                <g-select label="狀態" v-model="eventFilter.gameStatus" :options="options2" />
            </div>
            <div class="event-list__col">
                <a href="javascript:;" class="btn btn__search" @click="onSearch">搜尋</a>
            </div>
        </div>

        <div class="event-list__content">
            <div class="event-list__head">
                <div class="event-list__title">
                    <a href="javascript:;" :class="[sort=='game'?'on':'']"
                       @click="onSort('game')">遊戲名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" :class="[sort=='date'?'on':'']"
                       @click="onSort('date')">活動區間</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" :class="[sort=='event'?'on':'']"
                       @click="onSort('event')">活動名稱</a>
                </div>
                <div class="event-list__title">
                    <a href="javascript:;" :class="[sort=='status'?'on':'']"
                       @click="onSort('status')">狀態</a>
                </div>
            </div>
            <div class="event-list__body">
                <div class="event-list__box" v-for="(event,index) in eventData">
                    <div class="event-list__item">遊戲名稱遊戲名稱</div>
                    <div class="event-list__item">
                        <div class="event-list__date">20220112-20220801</div>
                    </div>
                    <div class="event-list__item"><a href="javascript:;"
                           :target="[false?'_blank':'']">活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱</a></div>
                    <div class="event-list__item">
                        <!-- 待下架/已上線 -->
                        <div class="event-list__status" v-if="true">
                            <div class="event-list__status-item">待下架</div>
                            <div class="event-list__status-item"><a class="event-list__btn-off" href="javascript:;"
                                   @click="eventOff(index)">下架</a></div>
                        </div>

                        <!-- 已結束-->
                        <div class="event-list__status" v-if="false">
                            <div class="event-list__status-item">已結束</div>
                        </div>
                        <!-- 已下架 -->
                        <div class="event-list__status" v-if="false">
                            <div class="event-list__status-item end">已下架</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="pagination__box">
            <a href="javascript:;" class="btn btn__prev" :class="[currentPage == 1?'disabled':'']" @click="prev">上一頁</a>
            <div class="pagination__page">
                <span class="on">{{currentPage}}</span>/
                <span>{{totalPage}}</span>
            </div>
            <a href="javascript:;" class="btn btn__next" :class="[currentPage == totalPage?'disabled':'']"
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
                <a href="javascript:;" class="btn btn__reset" @click="onCancel">取消</a>
            </template>
        </g-lightbox>
    </div>
</template>