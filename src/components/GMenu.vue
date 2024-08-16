<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import nestedDraggable from "./nested.vue";
import { GetPageType } from "../api";

const props = defineProps(["menu"])
const store = mainStore();
const { content, pageTypeSeq, group } = storeToRefs(store);
const menuToggle = ref(false);
const menuList = ref(props.menu);
const validPreviousComponents = ["GFixed", "GBg", "GSlogan", "GTop", "GWatermark", "GMusic", "GLang", "GArea"];
const bgStatus = computed(() => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == "GBg";
        })[0]
    }
    return {}
})

const componentStatus = (cpt) => {
    if (content.value) {
        return content.value.filter((c, i) => {
            return c.component == cpt;
        })[0]
    }
    return {}
}

const total = computed(() => {
    if (content.value) {
        if (pageTypeSeq.value == 2) {
            const result = {};
            content.value.forEach(item => {
                const uid = item.uid;
                const subContent = item.content && item.content.subContent ? item.content.subContent : [];

                const componentCount = {};
                subContent.forEach(subItem => {
                    const component = subItem.component;
                    componentCount[component] = (componentCount[component] || 0) + 1;
                });

                if (Object.keys(componentCount).length > 0) {
                    result[uid] = componentCount;
                }
            });
            return result
        } else {
            return content.value.reduce((p, v, i) => {
                if (!p[v.component]) {
                    p[v.component] = 1
                } else {
                    p[v.component] += 1
                }
                return p
            }, {})
        }
    }
    return {}
})
const menuFilter = computed(() => {
    if (!menuList) return [];

    if (pageTypeSeq.value === 1) {
        const filteredMenu = props.menu
            .filter(item => item.type.includes(1))
            .map(v => ({
                ...v,
                status: total.value[v.title] !== v.limit
            }))
            .sort((a, b) => a.order - b.order);

        const validPreviousMenu = filteredMenu.filter(v => validPreviousComponents.includes(v.title));

        const remainingMenu = filteredMenu.filter(v => !validPreviousComponents.includes(v.title));
        const groupedMenu = [];
        let currentGroup = null;

        for (const element of remainingMenu) {
            if (element.title.startsWith("GSlide")) {
                if (!currentGroup || currentGroup.title !== "輪播區塊") {
                    currentGroup = { title: "輪播區塊", elements: [], order: 4 };
                    groupedMenu.push(currentGroup);
                }
                currentGroup.elements.push(element);
            } else if (element.title.startsWith("GImg")) {
                if (!currentGroup || currentGroup.title !== "圖片區塊") {
                    currentGroup = { title: "圖片區塊", elements: [], order: 5 };
                    groupedMenu.push(currentGroup);
                }
                currentGroup.elements.push(element);
            } else {
                groupedMenu.push(element);
            }
        }
        return [...validPreviousMenu, ...groupedMenu]
            .sort((a, b) => {
                // 如果是分组，使用第一个元素的 order
                const orderA = a.elements ? a.elements[0].order : a.order;
                const orderB = b.elements ? b.elements[0].order : b.order;
                return orderA - orderB;
            });
    }

    if (pageTypeSeq.value == 2) {
        // First condition: Filter and sort specific menu items
        const specificItems = props.menu
            .filter(item => item.type.includes(2))
            .filter(v => ["GArea", "GFixed", "GWatermark", "GMusic", "GLang", "GTop"].includes(v.title))
            .sort((a, b) => a.order - b.order);

        // Second condition: Based on group value
        if (group.value.name == 1) {
            const homeComponent = ["GLogo", "GIcon", "GBg", "GDNNav", "GDNImg"];
            return props.menu
                .filter(v => homeComponent.includes(v.title))
                .sort((a, b) => a.order - b.order)
                .map(v => ({
                    ...v,
                    group: group.value.name,
                    drag: false
                }));
        } else {
            const homeComponent = ["GBg", "GSlogan", "GVideo", "GText", "GSlide", "GImg", "GListText", "GAccordion", "GButtons", "GImgText", "GSlideText", "GTabs"];

            if (group.value.name == 'main') {
                return;
            }

            const filteredMenu = props.menu
                .filter(v => homeComponent.includes(v.title))
                .sort((a, b) => a.order - b.order)
                .map(v => ({
                    ...v,
                    group: group.value.name
                }));

            const groupedMenu = [];
            let currentGroup = null;

            for (const element of filteredMenu) {
                if (element.title.startsWith("GSlide")) {
                    if (!currentGroup || currentGroup.title !== "輪播區塊") {
                        currentGroup = { title: "輪播區塊", elements: [] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else if (element.title.startsWith("GImg")) {
                    if (!currentGroup || currentGroup.title !== "圖片區塊") {
                        currentGroup = { title: "圖片區塊", elements: [] };
                        groupedMenu.push(currentGroup);
                    }
                    currentGroup.elements.push(element);
                } else {
                    groupedMenu.push(element);
                }
            }

            return groupedMenu;
        }
    }

    // If pageTypeSeq.value is not 2, no action is taken

    return [];
});
const add = (cpt) => {
    if (cpt.title == "GBg") {
        if (bgStatus.value?.content?.pc) {
            bgStatus.value.update = true;
            return;
        } else {
            bgStatus.value.update = true;
            return;
        }
    }
    if (cpt.title == "GSlogan") {
        if (componentStatus("GSlogan")) {
            componentStatus("GSlogan").update = true;
            return;
        }

    }
    if (cpt.title == "GFixed") {
        if (componentStatus("GFixed")) {
            componentStatus("GFixed").update = true;
            return;
        }
    }
    if (cpt.title == "GWatermark") {
        if (componentStatus("GWatermark")) {
            componentStatus("GWatermark").update = true;
            return;
        }
    }
    if (cpt.title == "GTop") {
        if (componentStatus("GTop")) {
            componentStatus("GTop").update = true;
            return;
        }
    }
    if (cpt.title == "GMusic") {
        if (componentStatus("GMusic")) {
            componentStatus("GMusic").update = true;
            return;
        }
    }
    if (cpt.title == "GLang") {
        if (componentStatus("GLang")) {
            componentStatus("GLang").update = true;
            return;
        }
    }
    if (!cpt.status) {
        return;
    }
    let data = {
        cpt: cpt.title
    };
    store.addCpt(data);
    store.setUpdateTime();
    if (store.first) {
        store.setFirst(false);
    }
}

const onOpen = () => {
    menuToggle.value = true
}
const onClose = () => {
    menuToggle.value = false
}
</script>
<template>
    <Teleport to="body">
        <div class="g-menu" :class="[menuToggle ? 'open' : '']">
            <a href="javascript:;" class="g-menu__open icon-open" @click="onOpen"></a>
            <a href="javascript:;" class="g-menu__close icon-close" @click="onClose"></a>

            <div class="g-menu__wrap">
                <nested-draggable :tasks="menuFilter" v-if="menuFilter" />
            </div>
        </div>
    </Teleport>
</template>