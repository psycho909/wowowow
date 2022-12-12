import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "EditPage",
			status: "edit",
			MODE: "",
			pageTypeSeq: "",
			config: {},
			content: [
				{
					component: "GBg",
					uid: 1,
					content: {
						color: "#fff",
						pc: "",
						mobile: "",
						w: 1920,
						h: 958,
						mw: "",
						mh: "",
						validPC: true,
						validMobile: true
					},
					update: false,
					init: false
				},
				{
					component: "GSlogan",
					uid: 2,
					content: {
						link: "",
						mt: "250",
						mb: "24",
						pc: "",
						mobile: "",
						validPC: true,
						validMobile: true,
						validUrl: true
					},
					update: false,
					init: false
				}
			],
			eventListFilter: {},
			eventListData: [],
			eventListCurrent: 1,
			eventListMessage: 0,
			approveListFilter: {},
			approveListData: [],
			approveListCurrent: 1,
			otp: "",
			updateTime: "",
			save: false
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		addCpt(data) {
			var uid = uuidv4();
			if (data.cpt == "GFixed") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GSlogan") {
				let bgIndex = this.content.findIndex((v, i) => {
					return v.component == "GBg";
				});
				this.content = [...this.content.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.slice(bgIndex + 1)];
				return;
			}
			this.content.push({ component: data.cpt, uid, content: {}, update: true, init: true });
		},
		removeCpt(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
			}
		},
		updateCpt(uid, data) {
			var _index = this.getIndex(uid);
			if (_index > -1) {
				this.content[_index].content = data;
				this.content[_index].update = false;
				this.content[_index].init = false;
			}
		},
		editCptOpen(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content[_index].update = true;
			}
		},
		editCptClose(data) {
			var _index = this.getIndex(data);
			if (_index > -1) {
				this.content[_index].update = false;
			}
		},
		upCpt(data) {
			var _index = this.getIndex(data);
			if (_index - 1 < 0 || this.content[_index - 1].component == "GBg" || this.content[_index - 1].component == "GSlogan") {
				return;
			}
			var _temp = this.content[_index];
			var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
			this.content = _content;
			this.content.splice(_index - 1, 0, _temp);
		},
		downCpt(data) {
			var _index = this.getIndex(data);
			if (_index + 1 >= this.content.length) {
				return;
			}
			var _temp = this.content[_index];
			var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
			this.content = _content;
			this.content.splice(_index + 1, 0, _temp);
		},
		setUpdateTime(data) {
			this.updateTime = data || new Date();
		},
		setEventListFilter(filter, current, data, message) {
			this.eventListFilter = filter;
			this.eventListData = data;
			this.eventListCurrent = current;
			this.eventListMessage = message;
		},
		setApproveListFilter(filter, current, data) {
			this.approveListFilter = filter;
			this.approveListData = data;
			this.approveListCurrent = current;
		},
		setSave(data) {
			this.save = data;
		},
		setInit() {
			this.content = [];
			this.config = {};
			this.pageTypeSeq = "";
			this.status = "";
			this.eventListFilter = {};
			this.eventListData = [];
			this.eventListCurrent = 1;
			this.eventListMessage = 0;
		},
		setStorageState(state, page) {
			let temp = { ...state };
			temp.page = page;
			window.sessionStorage.setItem("state", JSON.stringify(temp));
		},
		async setState(data) {
			const pathName = window.location.href.includes("Preview");
			Object.keys(this.$state).forEach((v, i) => {
				this.$state[v] = data[v];
			});
			if (pathName) {
				this.page = "Preview";
				this.status = "";
			}
		},
		setPage(data, back) {
			if (data == "Preview") {
				let page = window.location.pathname.split("/");
				let path = [...page.slice(0, page.length - 1), "Preview?OTP=" + this.otp];
				window.open(path.join("/"));
				return;
			}
			if (back) {
				let page = window.location.pathname.split("/");
				let path = [...page.slice(0, page.length - 1), "Index?OTP=" + this.otp];
				window.location.href = path.join("/");
				return;
			}
			this.page = data;
		},
		setContent(data) {
			this.content = data;
		},
		setStatus(data) {
			this.status = data;
		},
		setOTP(data) {
			this.otp = data;
		},
		async setConfig(data) {
			this.config = data;
			return data;
		},
		async setData(data) {
			this.pageTypeSeq = data.pageTypeSeq;
			this.updateTime = data.updateTime;
			this.config = data;
			if (data?.detail) {
				if (Object.prototype.toString.call(data.detail).includes("String")) {
					this.content = JSON.parse(data.detail);
				} else {
					this.content = data.detail;
				}
			} else {
				this.content = [];
			}
			return data;
		}
	}
});
