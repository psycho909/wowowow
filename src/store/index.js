import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "Home",
			status: "",
			MODE: "",
			pageTypeSeq: "",
			config: {},
			content: [],
			eventListFilter: {},
			eventListData: [],
			eventListCurrent: 1,
			eventListMessage: 0,
			approveListFilter: {},
			approveListData: [],
			approveListCurrent: 1,
			otp: "",
			updateTime: "",
			save: false,
			move: false,
			previewConfig: {},
			previewContent: [],
			group: { name: "component", pull: "clone", put: false }
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		changeDrgGroup(data) {
			this.group.name = data;
		},
		drgAddCpt(data, index) {
			var uid = uuidv4();
			let component = { component: data.cpt, uid, content: {}, update: true, init: true };
			let temp = [...this.content.slice(0, index), component, ...this.content.slice(index)];
			this.content = temp;
		},
		drgAddSubCpt(uid, data, index) {
			var subUid = uuidv4();
			var _index = this.getIndex(uid);
			let subComponent = { component: data.cpt, subUid, content: {}, update: true, init: true };
			let tempContent = this.content[_index].content;
			tempContent.subContent.push(subComponent);
			let temp = [...this.content.slice(0, _index), tempContent, ...this.content.slice(_index)];
			this.content = temp;
		},
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
			if (data.cpt == "GArea") {
				this.content.push({ component: data.cpt, uid, content: {}, update: true, init: true, name: uid });
				return;
			}
			if (this.group.name != "component") {
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
				this.content[_index].content = JSON.parse(JSON.stringify(data));
				this.content[_index].update = false;
				this.content[_index].init = false;
			}
			$("#loadingProgress").hide();
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
		dragMoveCpt(uid, index) {
			var _index = this.getIndex(uid);
			this.move = true;
			var component = this.content[_index];
			var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
			this.content = _content;
			this.content.splice(index, 0, component);
		},
		upCpt(data) {
			var _index = this.getIndex(data);
			if (_index - 1 < 0 || this.content[_index - 1].component == "GBg" || this.content[_index - 1].component == "GSlogan") {
				return;
			}
			this.move = true;
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
			this.move = true;
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
		setMove() {
			this.move = false;
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
			this.approveListFilter = {};
			this.approveListData = [];
			this.approveListCurrent = 1;
			this.updateTime = "";
		},
		setStorageState(state, page) {
			let { content, config } = state;
			// let temp = { ...state };
			let temp = {};
			temp.page = page;
			temp.previewContent = content;
			temp.previewConfig = config;
			// window.sessionStorage.setItem("state", JSON.stringify(temp));
			window.localStorage.setItem("state", JSON.stringify(temp));
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
