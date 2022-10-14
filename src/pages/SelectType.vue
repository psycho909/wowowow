<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore()
const { content } = storeToRefs(store);

let types = ref([
    { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }, { type: "A", name: "A" }
])



const selectType = (type) => {
    store.$patch(state => {
        state.type = type
        state.page = "CreateEvent"
    })
}
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
</script>
<template>
    <div class="container">
        <div class="page-title">
            <span class="page-title--style">網柑達</span>
            <span>選擇樣板</span>
        </div>
        <div class="select-type__content">
            <div class="select-type__box" v-for="t in types" @click="selectType(t.type)">
                <a href="javascript:;" class="select-type__type"></a>
                <div class="select-type__name">{{t.name}}</div>
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
    </div>
</template>