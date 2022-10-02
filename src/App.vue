
<script setup>
import { storeToRefs } from "pinia";
import GRadio from "./components/GRadio.vue";
import GSelect from "./components/GSelect.vue";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import Home from "./pages/Home.vue";
import Page from "./pages/Page.vue";
import SelectType from "./pages/SelectType.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);


let selected = ref("")
const InsertGA = (GA) => {
	window.addEventListener("DOMContentLoaded", function () {
		var body = document.getElementsByTagName("body")[0];
		var noscript = document.createElement("noscript");
		var iframe = document.createElement("iframe");
		iframe.src = "https://www.googletagmanager.com/gtag/js?id=" + GA;
		iframe.height = 0;
		iframe.width = 0;
		iframe.style = "display: none; visibility: hidden";
		noscript.append(iframe);
		body.insertAdjacentElement("afterbegin", noscript);

		window.dataLayer = window.dataLayer || [];
		function gtag() { dataLayer.push(arguments); }
		gtag('js', new Date());

		gtag('config', GA);
	});
};

const getVal = () => {
	InsertGA("UA-124678311-1")
	console.log(selected.value)
}
const options = [{ value: 1, text: "一" }, { value: 2, text: "二" }]
</script>
    
<template>
	<g-select v-model="selected" :options="options"></g-select>
	<g-radio></g-radio>
	<button type="button" @click="getVal">我是按鈕</button>
	<Home></Home>
	<SelectType></SelectType>
	<CreateEvent></CreateEvent>
	<EventList></EventList>
	<Page></Page>
</template>
    