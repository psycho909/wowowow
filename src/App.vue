<script>
export default {
	components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "./ComponentGroup.js";
import InputRadio from "./components/InputRadio.vue";
import MenuSide from "./components/MenuSide.vue";
import SelectOptions from "./components/SelectOptions.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);
const menu = computed(() => {
	return Object.keys(components).map((m, i) => {
		return {
			title: m,
			label: components[m].label
		}
	});
})

let selected = ref("")
const getVal = () => {
	console.log(selected.value)
}
const options = [{ value: 1, text: "一" }, { value: 2, text: "二" }]
</script>

<template>
	<SelectOptions v-model="selected" :options="options"></SelectOptions>
	<InputRadio></InputRadio>
	<button @click="getVal">GET</button>
	<hr>
	<MenuSide :menu="menu"></MenuSide>
	<hr>
	<CreateEvent></CreateEvent>
	<pre>{{content.body}}</pre>
	<template v-for="block in content.body">
		<component :is="block.component" :content="block"></component>
	</template>
</template>
