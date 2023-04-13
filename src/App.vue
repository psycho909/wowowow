<script setup>
import { storeToRefs } from "pinia";
import CreateEvent from "./pages/CreateEvent.vue";
import EventList from "./pages/EventList.vue";
import ApproveList from "./pages/ApproveList.vue";
import Home from "./pages/Home.vue";
import EditPage from "./pages/EditPage.vue";
import Page from "./pages/Page.vue";
import Preview from "./pages/Preview.vue";
import PageType from "./pages/PageType.vue";
import axios from "axios";
import { mainStore } from "./store/index";
const store = mainStore()
const { page } = storeToRefs(store);
let state = null;
const params = new Proxy(new URLSearchParams(window.location.search), {
	get: (searchParams, prop) => searchParams.get(prop),
})

const pathName = (window.location.href).includes("Preview");

if (import.meta.env.MODE == "development") {
	store.setOTP(1);
} else {
	store.setOTP(params.OTP || params.otp);
}


if (!pathName) {
	// if (window.sessionStorage.getItem("state")) {
	// 	state = JSON.parse(window.sessionStorage.getItem("state"));
	// 	if (state.page == 'Preview') {
	// 		window.sessionStorage.removeItem("state")
	// 	}
	// 	if (state.page == 'EditPage') {
	// 		store.setState(state);
	// 	}
	// }
} else {
	// if (window.sessionStorage.getItem("state")) {
	// 	state = JSON.parse(window.sessionStorage.getItem("state"));
	// 	state.page = "Preview";
	// 	store.setState(state);
	// }
	if (window.localStorage.getItem("state")) {
		state = JSON.parse(window.localStorage.getItem("state"));
		state.page = "Preview";
		store.setState(state);
	}

}
onMounted(() => {
	console.log(page.value)
	document.querySelector("#app").classList.add("edit");
})
</script>
    
<template>
	<Home v-if="page == 'Home' && !pathName"></Home>
	<PageType v-if="page == 'PageType' && !pathName"></PageType>
	<CreateEvent v-if="page == 'CreateEvent' && !pathName"></CreateEvent>
	<EventList v-if="page == 'EventList' && !pathName"></EventList>
	<ApproveList v-if="page == 'ApproveList' && !pathName"></ApproveList>
	<EditPage v-if="page == 'EditPage' && !pathName"></EditPage>
	<Preview v-if="pathName"></Preview>
</template>
    