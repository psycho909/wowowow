<script setup>
import { onMounted, onUpdated } from "vue";
import GLightbox from "../components/GLightbox.vue";
import GDate from "../elements/GDate.vue";
import GInput from "../elements/GInput.vue";
import GSelect from "../elements/GSelect.vue";

let openCheckSubmit = ref(false)
let openSubmitEvent = ref(false)
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
    types.value = [
        { type: "B", name: "B" }, { type: "B", name: "B" }, { type: "B", name: "B" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }
    ]
    currentPage.value = temp;
}
onMounted(async () => {
    await nextTick()
})


onUpdated(() => {
    console.log(123)

})

const onSort = (type) => {
    switch (type) {
        case "game":
            break;
        case "date":
            break;
        case "event":
            break;
        case "create":
            break;
        case "status":
            break;
    }
}
const onSearch = () => {
    console.log(eventFilter)
}
</script>
<template>
    <div class="container">
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>活動列表</span>
        </div>

        <div class="event-list__filter">
            <div class="event-list__box">
                <g-input label="活動名稱" placeholder="輸入內容" v-model="eventFilter.eventName" />
            </div>
            <div class="event-list__box">
                <div class="event-list__label">日期區間</div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.startDate" />
                </div>
                <div class="event-list__input">
                    <g-date v-model="eventFilter.endDate" />
                </div>
            </div>
            <div class="event-list__box">
                <g-select label="遊戲類別" v-model="eventFilter.gameType" :options="options1" />
                <g-select label="狀態" v-model="eventFilter.gameStatus" :options="options2" />
            </div>
            <div class="event-list__box">
                <a href="javascript:;" class="btn btn__search" @click="onSearch">搜尋</a>
            </div>
        </div>

        <div class="event-list__content">
            <div class="event-list__head">
                <a href="javascript:;" class="event-list__title" :class="[sort=='game'?'on':'']"
                   @click="onSort('game')">遊戲名稱</a>
                <a href="javascript:;" class="event-list__title" :class="[sort=='date'?'on':'']"
                   @click="onSort('date')">活動區間</a>
                <a href="javascript:;" class="event-list__title" :class="[sort=='event'?'on':'']"
                   @click="onSort('event')">活動名稱</a>
                <a href="javascript:;" class="event-list__title" :class="[sort=='create'?'on':'']"
                   @click="onSort('create')">人員名稱</a>
                <a href="javascript:;" class="event-list__title" :class="[sort=='status'?'on':'']"
                   @click="onSort('status')">狀態</a>
            </div>
            <div class="event-list__body">
                <div class="event-list__box" v-for="event in eventData">
                    <div class="event-list__item">遊戲名稱</div>
                    <div class="event-list__item">20220112-20220801</div>
                    <a href="javascript:;" class="event-list__item">活動名稱活動名稱活動名稱活動名稱活動名稱</a>
                    <div class="event-list__item">創建活動人員名稱</div>
                    <div class="event-list__item">
                        <div>編輯中</div>
                        <div>審核中</div>
                        <div>審核通過</div>

                        <div>編輯|預覽|送審</div>
                        <div>瀏覽|審核</div>
                        <div>瀏覽|待審核</div>
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

        <g-lightbox v-model:showLightbox="openCheckSubmit">
            <template #edit-title>
                <div>是否確定送審活動</div>
            </template>
            <template #edit-content>
                <div>活動名稱</div>
            </template>
        </g-lightbox>
        <g-lightbox v-model:showLightbox="openSubmitEvent">
            <template #edit-title>
                <div>審核活動</div>
            </template>
            <template #edit-content>
                <div>活動名稱</div>
            </template>
        </g-lightbox>
    </div>
</template>