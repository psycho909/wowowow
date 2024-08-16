<script>
export default {
    name: "GMusic",
    label: "音樂播放器",
    limit: 1,
    order: 13, type: [1, 2]
}
</script>
<script setup>
import { storeToRefs } from "pinia";
import { mainStore } from "../store/index";
import GInput from "../elements/GInput.vue";
import GRadio from '../elements/GRadioo.vue';
import GSelect from '../elements/GSelect.vue';
import GLightbox from './GLightbox.vue';
import colors, { style1, style2 } from "../colors";
import { CheckImage, CheckUrl, imgLoading, handleNumber, loadingShow, loadingHide } from "../Tool";
import { cloneDeep } from 'lodash-es'
import { GetPageType } from "../api";
const props = defineProps(["data"])
let showEdit = ref(false);
const store = mainStore()
const { page, pageTypeSeq } = storeToRefs(store);
let content = cloneDeep(props.data.content);
let musicData = reactive({});
let musicSetting = reactive({})
const audioPlayer = ref(null);
const musicIndex = ref(0);
const soundOn = ref(false);
const toggleBox = ref(false);
const $addComponent = inject('$addComponent');
let marquee = ref(null)
let marqueeInterval = null;
let marqueePosition = 0;
const initData = () => {
    return {
        style: "",
        validStyle: true,
        position: "left-bottom",
        download: false,
        mobileShow: false, musicToggle: true,
        musics: [{
            name: "",
            validName: true,
            url: "",
            validUrl: true
        }]
    }
}
Object.assign(musicData, initData());

watchEffect(async () => {
    if (props.data.update) {
        store.toggleLoading(false)
        showEdit.value = true;
    } else {
        showEdit.value = false;
    }
    if (!props.data.update) {
        Object.assign(musicData, cloneDeep(props.data.content));
        Object.assign(musicSetting, cloneDeep(props.data.content))
    }
    if (musicSetting.musicToggle == 'true' || musicSetting.musicToggle === true) {
        toggleBox.value = false
    } else {
        toggleBox.value = true
    }
})
onMounted(async () => {
    await nextTick()
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(musicData, cloneDeep(props.data.content));
        Object.assign(musicSetting, cloneDeep(props.data.content))
        if ($addComponent) {
            $addComponent();
        }
        if (musicSetting.musicToggle == 'true' || musicSetting.musicToggle === true) {
            toggleBox.value = false
        } else {
            toggleBox.value = true
        }
    }
})

const addInsertMenu = (index) => {
    const tab = {
        name: "",
        url: ""
    };

    musicData.musics.push(tab)
};

const removeMenu = (deleteIndex) => {
    if (musicData.musics.length > 1) {
        musicData.musics.splice(deleteIndex, 1);
    }

}

const onUp = (index) => {
    if (index - 1 < 0) {
        return;
    }
    var _temp = musicData.musics[index];
    var _content = [...musicData.musics.slice(0, index), ...musicData.musics.slice(index + 1)];
    musicData.musics = _content;
    musicData.musics.splice(index - 1, 0, _temp);
}

const onDown = (index) => {
    if (index < musicData.musics.length - 1) {
        const temp = musicData.musics[index];
        musicData.musics[index] = musicData.musics[index + 1];
        musicData.musics[index + 1] = temp;
    }
}

const status = computed(() => {
    return store.page == "EditPage" ? false : true;
})

const mobileCheck = computed(() => {
    if ((musicSetting.mobileShow == 'true' || musicSetting.mobileShow == true)) {
        return true
    } else {
        return false
    }
})

const currentMusic = computed(() => {
    if (musicSetting.musics) {
        if (musicSetting.musics.length === 0) {
            return { name: "", url: "" }; // Return empty object if musics array is empty
        }
    } else {
        return { name: "", url: "" }; // Return empty object if musics array is empty
    }

    return musicSetting.musics[musicIndex.value];
});

const openPop = (data) => {
    data.pop.show = true
}

function validateMusicData(data) {
    let isValid = true;

    for (const music of data.musics) {
        if (music.name.trim() === "") {
            music.validName = false;
            isValid = false;
        } else {
            music.validName = true;
        }

        if (music.url.trim() === "") {
            music.validUrl = false;
            isValid = false;
        } else {
            music.validUrl = true;
        }
    }

    return isValid;
}

const onSubmit = async () => {
    loadingShow()
    let isValidData = validateMusicData(musicData);
    if (isValidData) {
        let data = cloneDeep(musicData)
        store.updateCpt(props.data.uid, data);
        Object.assign(musicSetting, data);
        GetPageType(store.otp)
    } else {
        loadingHide()
    }

}

const prev = async () => {
    if (musicSetting.musics.length === 0) {
        return; // Don't proceed if musics array is empty
    }
    musicIndex.value = (musicIndex.value - 1 + musicSetting.musics.length) % musicSetting.musics.length;
    if (soundOn.value) {
        audioPlayer.value.load();
        await nextTick();
        audioPlayer.value.play();
        marqueePosition = 0
        document.querySelector(".g-music__title").style.transform = `translateX(${marqueePosition}px)`;
        startMarquee()
    }

};

const next = async () => {
    if (musicSetting.musics.length === 0) {
        return; // Don't proceed if musics array is empty
    }
    if (musicSetting.musics.length === 1 && audioPlayer.currentTime > 0) {
        audioPlayer.currentTime = 0;
    } else {
        musicIndex.value = (musicIndex.value + 1) % musicSetting.musics.length;
    }
    if (soundOn.value) {
        audioPlayer.value.load();
        await nextTick();
        audioPlayer.value.play();
        marqueePosition = 0
        document.querySelector(".g-music__title").style.transform = `translateX(${marqueePosition}px)`;
        startMarquee()
    }
};

const startPlayback = () => {
    audioPlayer.value.play();
};

const toggleSound = () => {
    soundOn.value = !soundOn.value;
    if (!soundOn.value) {
        stopMarquee()
        audioPlayer.value.pause(); // Pause music if soundOn is false
    } else if (soundOn.value && !audioPlayer.paused) {
        startMarquee()
        audioPlayer.value.play(); // Play music if soundOn is true and audioPlayer was playing
    }
};

const onReset = () => {
    Object.assign(musicData, initData());
}

const closeBtn = () => {
    if (props.data.init) {
        showEdit.value = false;
        store.removeCpt(props.data.uid, props.sub);
        document.querySelector("body").classList.remove("ov-hidden");
        loadingHide()
        return;
    }
    if (Object.keys(props.data.content).length > 0) {
        Object.assign(musicData, cloneDeep(props.data.content));
    } else {
        Object.assign(musicData, initData());
    }
    showEdit.value = false;
    store.editCptClose(props.data.uid, props.sub)
}

const musicToggle = () => {

    toggleBox.value = !toggleBox.value
}
const startMarquee = () => {
    let marqueeElement = marquee.value;
    let temp1 = 0;
    let tempWidth = -document.querySelector(".g-music__title-box").scrollWidth;
    let innerWidth = document.querySelector(".g-music__title-box").clientWidth;
    let titleWidth = document.querySelector(".g-music__title").clientWidth;
    console.log(titleWidth, innerWidth)
    if (titleWidth <= innerWidth) {
        temp1 = -titleWidth;
    } else {
        temp1 = tempWidth
    }
    console.log(temp1)
    clearInterval(marqueeInterval);
    marqueeInterval = setInterval(() => {
        marqueePosition -= 1;
        if (marqueePosition < temp1) {
            marqueePosition = document.querySelector(".g-music__title-box").offsetWidth;
        }
        marqueeElement.style.transform = `translateX(${marqueePosition}px)`;
    }, 50);
};
const stopMarquee = () => {
    if (marqueeInterval) {
        clearInterval(marqueeInterval);
    }
};
</script>
<template>
    <Teleport to="body">
        <div class="g-music"
             :class="[toggleBox ? 'g-music--close' : '', mobileCheck ? 'mobileShow' : '']"
             :data-position="[musicSetting.position]"
             :style="[colors[musicSetting.style]]">
            <div class="g-music-container">
                <div class="g-music__box"
                     :class="[toggleBox ? 'closed' : '', musicSetting.musics?.length > 1 ? 'size1' : 'size2']">
                    <audio ref="audioPlayer" :src="currentMusic.url" @ended="next"></audio>
                    <a href="javascript:;" class="g-music__toggle" @click="musicToggle"></a>
                    <a href="javascript:;" class="g-music__prev" @click="prev"
                       v-if="musicSetting.musics?.length > 1">上一首</a>
                    <a href="javascript:;" @click="toggleSound" class="g-music__control"
                       :class="[soundOn ? 'paused' : 'playing']"></a>
                    <a href="javascript:;" class="g-music__next" @click="next"
                       v-if="musicSetting.musics?.length > 1">下一首</a>
                    <div class="g-music__anim" :class="[soundOn ? 'moving' : '']" v-if="!toggleBox"></div>
                    <a href="javascript:;" class="g-music__anim " :class="[soundOn ? 'moving' : '']"
                       @click="musicToggle"
                       v-else></a>
                    <div class="g-music__title-box">
                        <div :key="currentMusic.name" class="g-music__title" :class="[soundOn ? 'marquee' : '']"
                             ref="marquee">
                            {{ currentMusic.name }}</div>
                    </div>
                </div>
                <g-modify :uid="data.uid" :move="false" v-if="page == 'EditPage'" />
            </div>
            <g-edit v-model:showEdit="showEdit">
                <template #edit-close>
                    <a href="javascript:;" class="g-edit__close icon icon-close" @click="closeBtn">close</a>
                </template>
                <template #edit-content>
                    <div class="edit-title__box">
                        <div class="edit-title__text">音樂播放器
                            <a :href="`https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/GamaEvent/Music${pageTypeSeq}.html`"
                               class="edit-title__q" target="_blank"></a>
                        </div>
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">按鈕位置:</div>
                        <g-radio label="左下" name="position" value="left-bottom" v-model="musicData.position" />
                        <g-radio label="右下" name="position" value="right-bottom" v-model="musicData.position" />
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">預設模式:</div>
                        <g-radio label="展開" name="musicToggle" :value="true" v-model="musicData.musicToggle" />
                        <g-radio label="收合" name="musicToggle" :value="false" v-model="musicData.musicToggle" />
                    </div>
                    <div class="g-edit__row">
                        <div class="input-group__label required">手機版是否顯示:</div>
                        <g-radio label="是" name="mobileShow" :value="true" v-model="musicData.mobileShow" />
                        <g-radio label="否" name="mobileShow" :value="false" v-model="musicData.mobileShow" />
                    </div>
                    <div class="g-edit__row" v-for="(music, index) in musicData.musics" :key="index">
                        <div class="g-edit__col">
                            <div class="g-edit__group">
                                <a href="javascript:;" class="icon icon-add"
                                   @click="addInsertMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-remove"
                                   @click="removeMenu(index)"></a>
                                <a href="javascript:;" class="icon icon-up"
                                   @click="onUp(index)">up</a>
                                <a href="javascript:;" class="icon icon-down"
                                   @click="onDown(index)">down</a>
                            </div>
                            <div class="g-edit__group">
                                <div class="g-edit__col">
                                    <g-input label="歌曲顯示名稱:" v-model.trim="music.name" :required="true"
                                             :valid="music.validName" />
                                </div>
                                <div class="g-edit__col">
                                    <g-input label="音樂檔案網址:" v-model.trim="music.url" :required="true"
                                             :valid="music.validUrl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="edit-btn__box">
                        <a href="javascript:;" class="btn btn__submit" @click="onSubmit">確認送出</a>
                        <a href="javascript:;" class="btn btn__reset" @click="onReset">清除重填</a>
                    </div>
                </template>
            </g-edit>
        </div>
    </Teleport>
</template>