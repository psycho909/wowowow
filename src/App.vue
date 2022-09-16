<script>
export default {
	components
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import components from "./ComponentGroup.js";
import MenuSlide from "./components/MenuSlide.vue";
import { mainStore } from "./store/index";
const store = mainStore()
const { content } = storeToRefs(store);
const menu = computed(() => {
	return Object.keys(components);
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
