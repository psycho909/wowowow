
<script setup>
import { storeToRefs } from "pinia";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import Home from "./pages/Home.vue";
import Page from "./pages/Page.vue";
import SelectType from "./pages/SelectType.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);


let selected = ref("")


const options = [{ value: 1, text: "一" }, { value: 2, text: "二" }]
const radio1 = ref("A")
const radio2 = ref("B")
const radio3 = ref("C")
const radio = ref("B")

const getVal = () => {
	console.log(radio.value)
}

</script>
    
<template>
	<!-- <g-youtube youtube="M7lc1UVf-VE" />
	<div>
		<g-radio name="toy" label="A" :value="radio1" v-model="radio" />
		<g-radio name="toy" label="B" :value="radio2" v-model="radio" />
		<g-radio name="toy" label="C" :value="radio3" v-model="radio" />
	</div>
	<g-select v-model="selected" :options="options" />
	<g-radio></g-radio>
	<button type="button" @click="getVal">我是按鈕</button> -->
	<Home v-if="store.page == 'Home'"></Home>
	<SelectType v-if="store.page == 'SelectType'"></SelectType>
	<CreateEvent v-if="store.page == 'CreateEvent'"></CreateEvent>
	<EventList v-if="store.page  == 'EventList'"></EventList>
	<Page v-if="store.page  == 'Page'"></Page>
</template>
    