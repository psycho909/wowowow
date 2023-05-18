<script setup>
import { computed } from "vue";
import { mainStore } from "../store/index";
import GLightbox from "../components/GLightbox.vue";
const props = defineProps({
    uid: {
        type: [String, Number]
    },
    title: {
        type: String
    },
    move: {
        type: Boolean,
        default: true
    },
    edit: {
        type: Boolean,
        default: true
    },
    remove: {
        type: Boolean,
        default: true
    },
    sub: {
        type: Boolean,
        default: false
    }
})
let messageText = ref("");
let messageLightbox = ref(false);

const store = mainStore();
const checkComponent = computed(() => {
    let component = store.content[store.getIndex(props.uid) - 1]?.component;
    if (component == 'GSlogan' || component == 'GBg' || component == 'component') {
        return false;
    } else {
        return true;
    }
})
const index = computed(() => {
    return store.getIndex(props.uid);
})
const onRemove = async () => {
    store.removeCpt(props.uid, props.sub);
    await nextTick();
    messageLightbox.value = false;
}
const onUp = () => {
    store.upCpt(props.uid);
}
const onDown = () => {
    store.downCpt(props.uid);
}
const onEdit = () => {
    store.editCptOpen(props.uid);
}

</script>
<template>
    <div class="g-modify">
        <div class="g-modify-title">{{ title }}</div>
        <div class="g-modify-btn__group" v-if="move">
            <a href="javascript:;" class="icon icon-drag">drag</a>
            <a href="javascript:;" class="icon icon-up" @click="onUp" v-if="checkComponent">up</a>
            <a href="javascript:;" class="icon icon-down" @click="onDown"
               v-if="index + 1 < store.content.length">down</a>
        </div>
        <div class="g-modify-btn__group" v-if="edit">
            <a href="javascript:;" class="icon icon-edit" @click="onEdit">edit</a>
            <a href="javascript:;" class="icon icon-remove" v-if="remove"
               @click="() => messageLightbox = true">remove</a>
        </div>
    </div>

    <g-lightbox v-model:showLightbox="messageLightbox">
        <template #lightbox-content>
            <div class="text-center">確認刪除此元件嗎?</div>
        </template>
        <template #lightbox-btn>
            <a href="javascript:;" class="btn btn__submit" @click="onRemove">確認</a>
        </template>
    </g-lightbox>
</template>