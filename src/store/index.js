import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "CreateEvent",
			MODE: "",
			type: "",
			config: [],
			content: {
				body: [
					{
						component: "GFixed",
						uid: 99,
						content: {
							position: "left",
							hamburger: "hamburger-right",
							style: "grayscale2",
							menus: [
								{
									text: "選單內容1",
									link: "",
									target: false
								},
								{
									text: "選單內容2",
									link: "",
									target: false
								},
								{
									text: "選單內容3",
									link: "",
									target: false
								},
								{
									text: "選單內容4",
									link: "",
									target: false
								},
								{
									text: "選單內容5",
									link: "",
									target: false
								}
							]
						},
						update: false
					},
					{
						component: "GBg",
						uid: 1,
						content: {
							color: "#070508",
							pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/bg.jpg",
							mobile: "",
							w: 1920,
							h: 958,
							mw: "",
							mh: ""
						},
						update: false
					},
					{
						component: "GSlogan",
						uid: 16,
						content: {
							link: "",
							mt: "250",
							mb: "24",
							pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slogan.jpg",
							mobile: "",
							w: "",
							h: "",
							mw: "",
							mh: ""
						},
						update: false
					},
					{
						component: "GSlide",
						uid: 70,
						content: {
							num: 1,
							slides: [
								{
									pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slide.jpg",
									mobile: "",
									open: false,
									url: "",
									attribute: false
								},
								{
									pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slide.jpg",
									mobile: "",
									url: "",
									attribute: false
								},
								{
									pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slide.jpg",
									mobile: "",
									url: "",
									attribute: false
								},
								{
									pc: "https://alpha-tw.beanfun.com/3KO/removable/pchome/images/slide.jpg",
									mobile: "",
									url: "",
									attribute: false
								}
							]
						},
						update: false
					},
					{
						component: "GText",
						uid: 59,
						content: {
							align: "align-left",
							style: "yellow2",
							text: '<p>本活動皆由官方統一提供角色設定，各血盟盟主可於報名時決定所有成員欲於競賽中使用的職業，</p><p>&nbsp;報名血盟含盟主共25名成員中，需完整包含11種職業&nbsp;</p><p>【官方提供角色】僅複製原伺服器報名參賽角色的「血盟資料、角色名稱」至活動伺服器中，而角色職業、等級、性別、變身、魔法娃娃、裝備…等，皆採用官方統一提供之角色設定，非原角色資訊。&nbsp;</p><p>點我看<a href="https://www.xiaopiu.com/web/byId?type=project&amp;id=615d656dd50bdb146bab2295">【官方提供角色】</a></p><p>&nbsp;</p><p>&nbsp; 1.旗幟戰菁英賽第六季賽事採用問卷報名，並由血盟盟主為代表透過線上問卷進行報名。須完整填寫隊伍及成員資訊。後續官方將從報名的血盟中，由系統隨機挑選出60組血盟並區分資格賽Ａ組及Ｂ組各30個血盟參加資格賽。若因血盟移轉、角色所屬血盟…等與報名資料不符，將視同棄權參賽資格，且不進行遞補或調整。 &nbsp;</p><p>&nbsp;</p><p>2.報名時除盟主/守護騎士不可更換職業外，其餘成員可選取與正式伺服器角色不同職業。 &nbsp;</p><p>&nbsp;</p><p>3.報名血盟含盟主共25名成員中，需完整包含11種職業，未符合條件者將不予入選資格賽。 隊伍人數最多25人，最少15人，須依據下拉選單中的『11種職業』進行賽事角色職業分配。 &nbsp;</p><p>&nbsp;</p><p>4.2022/06/29(三)晚間20:00前於遊戲官網公布資格賽入選血盟名稱以及成員名單，Ａ組及Ｂ組之名單將另行公告。 ※注意，資格賽名單公布後不可再更換組別。&nbsp;</p><p>&nbsp;</p><p>&nbsp;5.如有血盟有重複報名，將以最後收到的一份報名資料 &nbsp;開放報名時間：2022/06/23～2022/06/26間23:59 【提醒：報名時若使用特殊字元創立隊伍名稱，有可能會發生隊伍名稱無法正常顯示問題， 網頁顯示問題不會影響報名或賽事進行，若後續有獲選參賽系統將會使用原遊戲內血盟名稱創建隊伍】 &nbsp;</p>'
						},
						update: false
					},
					{
						component: "GVideo",
						uid: 5,
						content: {
							num: "4",
							type: "click",
							videos: [
								{
									url: "M7lc1UVf-VE",
									show: false
								},
								{
									url: "M7lc1UVf-VE",
									show: false
								},
								{
									url: "M7lc1UVf-VE",
									show: false
								},
								{
									url: "M7lc1UVf-VE",
									show: false
								}
							]
						},
						update: false
					}
				]
			}
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.body.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		addCpt(data) {
			var uid = uuidv4();
			if (data.cpt == "GFixed") {
				this.content.body = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.body];
				return;
			}
			if (data.cpt == "GSlogan") {
				let bgIndex = this.content.body.findIndex((v, i) => {
					return v.component == "GBg";
				});
				this.content.body = [...this.content.body.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.body.slice(bgIndex + 1)];
				return;
			}
			this.content.body.push({ component: data.cpt, uid, content: {}, update: true, init: true });
		},
		removeCpt(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			}
		},
		updateCpt(uid, data) {
			var _index = this.getIndex(uid);
			if (_index > -1) {
				this.content.body[_index].content = data;
				this.content.body[_index].update = false;
				this.content.body[_index].init = false;
			}
		},
		editCptOpen(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body[_index].update = true;
			}
		},
		editCptClose(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content.body[_index].update = false;
			}
		},
		upCpt(data) {
			var _index = this.getIndex(data);
			if (_index - 1 < 0 || this.content.body[_index - 1].component == "GBg" || this.content.body[_index - 1].component == "GSlogan") {
				return;
			}
			var _temp = this.content.body[_index];
			var _content = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			this.content.body = _content;
			this.content.body.splice(_index - 1, 0, _temp);
		},
		downCpt(data) {
			var _index = this.getIndex(data);
			if (_index + 1 >= this.content.body.length) {
				return;
			}
			var _temp = this.content.body[_index];
			var _content = [...this.content.body.slice(0, _index), ...this.content.body.slice(_index + 1)];
			this.content.body = _content;
			this.content.body.splice(_index + 1, 0, _temp);
		},
		setPage(data) {
			this.page = data;
		},
		setType(data) {
			this.type = data;
		},
		setConfig(data) {
			this.config = data;
		},
		setContent(data) {
			this.content = data;
		},
		async setCreateEvent(data) {
			let done = await data;
			this.setConfig(done);
			return done;
		},
		async setSave(data) {
			let done = await data;
			this.setContent(done);
			return done;
		}
	}
});
