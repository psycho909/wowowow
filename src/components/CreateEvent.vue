<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

let date = ref(new Date())
let time = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes()
});
</script>
<template>
    <div class="create-title">
        <span class="create-title--style">網柑達</span>
        <span>新增活動</span>
    </div>
    <div class="create-content">
        <div class="create-game__box">
            <div class="create-content__label create-game__label">選擇遊戲</div>
            <div class="create-content__input">
                <select name="" id="">
                    <option value="-1">請選擇遊戲</option>
                </select>
            </div>
        </div>
        <div class="create-start__box">
            <div class="create-content__label create-start__label">上架日期</div>
            <div class="create-content__input">
                <Datepicker v-model="date" :enableTimePicker="false" :previewFormat="null" selectText="確認"
                            cancelText="取消" autoApply>
                </Datepicker>
            </div>
            <div class="create-content__input">
                <Datepicker v-model="time" :previewFormat="null" selectText="確認" cancelText="取消" timePicker />
            </div>
        </div>
        <div class="create-end__box">
            <div class="create-content__label create-end__label">上架日期</div>
            <div class="create-content__input">
                <Datepicker v-model="date" :enableTimePicker="false" :previewFormat="null" selectText="確認"
                            cancelText="取消" autoApply>
                </Datepicker>
            </div>
            <div class="create-content__input">
                <Datepicker v-model="time" :previewFormat="null" selectText="確認" cancelText="取消" timePicker />
            </div>
        </div>
        <div class="create-name__box">
            <div class="create-content__label create-ga__label">活動名稱</div>
            <div class="create-content__input"><input type="text"></div>
        </div>
        <div class="create-ga__box">
            <div class="create-content__label create-ga__label">GA</div>
            <div class="create-content__input">
                <input type="radio">
                <span class="create-radio__style"></span>
            </div>
        </div>
        <div class="create-gtm__box">
            <div class="create-content__label create-gtm__label">其它行銷script</div>
            <div class="create-content__input">
                <input type="radio">
                <span class="create-radio__style"></span>
            </div>
        </div>
        <div class="create-script__box">
            <div class="create-content__label create-script__label">COOKIE政策</div>
            <div class="create-content__input">
                <input type="radio">
                <span class="create-radio__style"></span>
            </div>
        </div>
        <div class="create-header__box">
            <div class="create-content__label create-header__label">HEADER</div>
            <div class="create-content__input">
                <input type="radio">
                <span class="create-radio__style"></span>
            </div>
        </div>
        <div class="create-footer__box">
            <div class="create-content__label create-gtm__label">FOOTER</div>
            <div class="create-content__input">
                <input type="radio">
                <span class="create-radio__style"></span>
            </div>
        </div>
        <div class="create-meta__box">
            <div class="create-content__label create-meta__label">網頁META</div>
            <div class="create-content__input"><input type="text"></div>
        </div>
        <div class="create-img__box">
            <div class="create-content__label create-img__label">縮圖</div>
            <div class="create-content__input"><input type="text"></div>
        </div>
    </div>
</template>