<script setup>
import { computed } from "vue";
import { mainStore } from "../store/index";
import GLightbox from "../components/GLightbox.vue";
import { GetPageType } from "../api";

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
const checkUp = computed(() => {
    const validPreviousComponents = ["GFixed", "GBg", "GSlogan", "GTop", "GWatermark", "GMusic"];
    if (props.sub) {
        for (let i = 0; i < store.content.length; i++) {
            if (store.content[i].component === "GArea") {
                const subContentIndex = store.content[i].content.subContent.findIndex(subItem => subItem.uid === props.uid);
                if (subContentIndex > -1) {
                    if (subContentIndex - 1 <= 0 || validPreviousComponents.includes(store.content[i].content.subContent[subContentIndex - 1]?.component)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }
    } else {
        const index = store.getIndex(props.uid)
        if (index - 1 <= 0 || validPreviousComponents.includes(store.content[index - 1]?.component) || store.content[index - 1]?.name == 'main' || store.content[index - 1]?.name == 'home') {
            return false;
        } else {
            return true;
        }
    }
})

const checkDown = computed(() => {
    if (props.sub) {
        let valid = false;
        for (let i = 0; i < store.content.length; i++) {
            if (store.content[i].component === "GArea") {
                const subContentIndex = store.content[i].content.subContent.findIndex(subItem => subItem.uid === props.uid);
                if (subContentIndex > -1) {
                    if (subContentIndex + 1 < store.content[i].content.subContent.length) {
                        valid = true
                    } else {
                        valid = false
                    }
                }
            }
        }
        return valid
    } else {
        let index = store.getIndex(props.uid);
        if (index + 1 < store.content.length) {
            return true
        } else {
            return false
        }
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
    store.upCpt(props.uid, props.sub);
}
const onDown = () => {
    store.downCpt(props.uid, props.sub);
}
const onEdit = () => {
    console.log("Edit")
    GetPageType(store.otp)
    store.editCptOpen(props.uid, props.sub);
}

</script>
<template>
    <div class="g-modify">
        <div class="g-modify-title">{{ title }}</div>
        <div class="g-modify-btn__group" v-if="move">
            <a href="javascript:;" class="icon icon-drag">drag</a>
            <a href="javascript:;" class="icon icon-up" @click="onUp" v-if="checkUp">up</a>
            <a href="javascript:;" class="icon icon-down" @click="onDown"
               v-if="checkDown">down</a>
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