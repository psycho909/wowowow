<script>
export default {
	components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "./ComponentGroup.js";
import MenuSlide from "./components/MenuSide.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);
console.log(components)
const menu = computed(() => {
	return Object.keys(components).map((m, i) => {
		return {
			title: m,
			label: components[m].label
		}
	});
})
</script>

<template>
	<MenuSlide :menu="menu"></MenuSlide>
	<div>Hello</div>
	<pre>{{content.body}}</pre>
	<template v-for="block in content.body">
		<component :is="block.component" :content="block"></component>
	</template>
</template>
