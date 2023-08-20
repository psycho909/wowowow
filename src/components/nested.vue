<script>
import draggable from "vuedraggable";

export default {
    props: {
        tasks: {
            required: true,
            type: Array
        }
    },
    components: {
        draggable
    },
    name: "nested-draggable"
};
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
const store = mainStore();
const log = (evt) => {
    console.log("evt", evt);
}
const moveLog = (e) => {
    console.log("menu move", e)
}
const start = (e) => {
    console.log("menu start", e)
}
const end = (e) => {
    console.log(e)
}
</script>
<template>
    <draggable
               class="list-group"
               filter=".filtered"
               :sort="false"
               :force-fallback="true"
               :fallback-tolerance="1"
               :scroll-sensitivity="100"
               :list="tasks"
               :group="store.group"
               @start="start"
               @end="end"
               @change="log"
               @move="moveLog"
               item-key="label">
        <template #item="{ element }">
            <div>
                <p v-if="element.label">{{ element.label }}</p>
                <template v-if="element?.elements">
                    <span class="g-menu__title filtered">{{ element.title }}</span>
                    <nested-draggable :tasks="element.elements" />
                </template>
            </div>
        </template>
    </draggable>
</template>

<style scoped>
.dragArea {
    min-height: 50px;
    outline: 1px dashed;
}
</style>