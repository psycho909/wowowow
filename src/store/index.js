import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash-es";

export const mainStore = defineStore("main", {
	state: () => {
		return {
			page: "Home",
			loading: false,
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
			group: { name: "main", pull: "clone", put: false },
			tempGroup: {},
			position: {
				from: null,
				to: null
			},
			targetArea: 1
		};
	},
	getters: {
		getIndex: (state) => (id) => {
			return state.content.findIndex((v, i) => v.uid == id);
		}
	},
	actions: {
		toggleLoading(data) {
			if (data) {
				this.loading = data;
			} else {
				setTimeout(() => {
					this.loading = data;
				}, 400);
			}
		},
		setForm(data) {
			this.position.from = data;
		},
		setTo(data) {
			this.position.to = data;
		},
		setCurrentArea(data) {
			this.group.name = data;
		},
		setTargetArea(data) {
			this.targetArea = data;
		},
		changeDrgGroup(data) {
			this.group.name = data;
		},
		drgAddCpt(data, index) {
			var uid = uuidv4();
			let component = { component: data.cpt, uid, content: {}, update: true, init: true };
			let temp = [...this.content.slice(0, index), component, ...this.content.slice(index)];
			this.content = temp;
		},
		// 拖曳新增子元件
		// uid: 目標區塊的uid
		// data: 拖曳的元件資料
		// index: 目標區塊位子的index
		async drgAddSubCpt(uid, data, index) {
			console.log(uid, data, index);
			var subUid = uuidv4();
			let subComponent;
			let areaIndex = this.content.findIndex((item) => item.uid == uid);
			// 如果是在區塊內新增元件
			if (data.cpt) {
				if (this.content[areaIndex].content.subContent[index] != undefined) {
					if (this.content[areaIndex].content.subContent[index].component == "GSlogan") {
						return;
					}
				}
				subComponent = { component: data.cpt, uid: subUid, content: {}, update: true, init: true };
				this.content[areaIndex].content.subContent.splice(index, 0, subComponent);
			} else {
				// 拖曳到其他區塊執行新增元件
				subComponent = data;
				this.move = true;
				if (this.content[areaIndex].content.subContent.filter((item) => item.component == "GBg").length > 0) {
					index += 1;
				}
				if (this.content[areaIndex].content.subContent[index] != undefined) {
					// 當目標區塊位子是GSlogan則新增在下一個位子
					if (this.content[areaIndex].content.subContent[index].component == "GSlogan") {
						index += 1;
					}
				}
				this.content[areaIndex].content.subContent.splice(index, 0, subComponent);
			}
		},
		addCpt(data) {
			var uid = uuidv4();
			if (data.cpt == "GLang") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GWatermark") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GMusic") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GTop") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GFixed") {
				this.content = [{ component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content];
				return;
			}
			if (data.cpt == "GSlogan") {
				if (this.pageTypeSeq == 2) {
					var _index = this.getIndex(this.targetArea);
					let bgIndex = this.content[_index].content.subContent.findIndex((v, i) => {
						return v.component == "GBg";
					});
					this.content[_index].content.subContent = [...this.content[_index].content.subContent.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content[_index].content.subContent.slice(bgIndex + 1)];
					return;
				} else {
					let bgIndex = this.content.findIndex((v, i) => {
						return v.component == "GBg";
					});
					this.content = [...this.content.slice(0, bgIndex + 1), { component: data.cpt, uid, content: {}, update: true, init: true }, ...this.content.slice(bgIndex + 1)];
					return;
				}
			}
			if (data.cpt == "GArea") {
				let group = uid;
				this.tempGroup = { ...this.group, targetArea: this.targetArea };
				if (this.pageTypeSeq == 2) {
					this.group.name = "Child";
					group = "Child";
					this.targetArea = uid;
				} else {
					this.group.name = "main";
				}
				this.content.push({
					component: data.cpt,
					uid,
					group: group,
					content: {
						pc: {
							paddingTop: 80,
							paddingBottom: 80
						},
						mobile: {
							paddingTop: 100,
							paddingBottom: 100
						},
						subContent: [
							{
								component: "GBg",
								uid: uid + 1,
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
								uid: uid + 2,
								content: {
									link: "",
									mt: 0,
									mb: 0,
									pc: "https://tw.hicdn.beanfun.com/beanfun/GamaWWW/GamaEvent/assets/css/images/slogan.png",
									mobile: "",
									validPC: true,
									validMobile: true,
									validUrl: true,
									target: true
								},
								update: false,
								init: true,
								first: true
							}
						]
					},
					update: true,
					init: true,
					name: uid
				});
				return;
			}
			if (this.group.name != "main") {
				var _index = this.getIndex(this.targetArea);
				this.content[_index].content.subContent.push({ component: data.cpt, uid, content: {}, update: true, init: true });
				return;
			}
			this.content.push({ component: data.cpt, uid, content: {}, update: true, init: true });
		},
		removeCpt(data, sub = false, areaUid = null) {
			if (sub) {
				if (areaUid) {
					let areaIndex = this.content.findIndex((item) => item.uid == areaUid);
					const subContentIndex = this.content[areaIndex].content.subContent.findIndex((subItem) => subItem.uid === data);
					if (subContentIndex !== -1) {
						this.content[areaIndex].content.subContent.splice(subContentIndex, 1);
					}
				} else {
					for (let i = 0; i < this.content.length; i++) {
						if (this.content[i].component === "GArea") {
							const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === data);
							if (subContentIndex !== -1) {
								this.content[i].content.subContent.splice(subContentIndex, 1);
								return true; // Return true to indicate the deletion was successful
							}
						}
					}
				}

				return false; // Return false if deletion was not possible
			} else {
				var _index = this.getIndex(data);
				if (_index > -1) {
					this.content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
				}
			}
		},
		updateCpt(uid, data, sub) {
			console.log(uid,data)
			let _index, findComponent;
			if (sub) {
				findComponent = this.content.find((item) => {
					if (item.content.subContent) {
						return item.content.subContent.find((subItem) => subItem.uid === uid);
					}
					return item.uid === uid;
				});
				_index = findComponent.content.subContent.findIndex((v, i) => v.uid == uid);
				findComponent.content.subContent[_index].content = JSON.parse(JSON.stringify(data));
				findComponent.content.subContent[_index].update = false;
				findComponent.content.subContent[_index].init = false;
				findComponent.content.subContent[_index].id = findComponent.content.subContent[_index].component+"_"+findComponent.content.subContent[_index].uid.split("-")[0];
				findComponent.content.subContent.forEach((v, i) => {
					if (v.component == "GSlogan") {
						v.first = false;
					}
				});
			} else {
				_index = this.getIndex(uid);
				if (_index > -1) {
					this.content[_index].content = JSON.parse(JSON.stringify(data));
					this.content[_index].update = false;
					this.content[_index].init = false;
					this.content[_index].first = false;
					this.content[_index].id = this.content[_index].component+"_"+this.content[_index].uid.split("-")[0];
					this.content.forEach((v, i) => {
						if (v.component == "GSlogan") {
							v.first = false;
						}
					});
				}
			}
			$("#loadingProgress").hide();
		},
		editCptOpen(data, sub = false) {
			if (sub) {
				console.log("sub");
				for (let i = 0; i < this.content.length; i++) {
					if (this.content[i].component === "GArea") {
						const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === data);
						if (subContentIndex !== -1) {
							this.loading = true;
							this.content[i].content.subContent[subContentIndex].update = true;
							return true;
						}
					}
				}
				return false;
			} else {
				var _index = this.getIndex(data);
				if (_index > -1) {
					console.log("edit");
					this.loading = true;
					this.content[_index].update = true;
				}
			}
		},
		editCptClose(data, sub = false) {
			if (sub) {
				for (let i = 0; i < this.content.length; i++) {
					if (this.content[i].component === "GArea") {
						const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === data);
						if (subContentIndex !== -1) {
							this.content[i].content.subContent[subContentIndex].update = false;
							return true; // Return true to indicate the update was successful
						}
					}
				}
				return false;
			} else {
				var _index = this.getIndex(data);
				if (_index > -1) {
					this.content[_index].update = false;
				}
			}
		},
		dragMoveCpt(uid, index, sub = false) {
			if (sub) {
				for (let i = 0; i < this.content.length; i++) {
					if (this.content[i].component === "GArea") {
						const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === uid);
						if (subContentIndex > 0) {
							this.move = true;
							if (this.content[i].content.subContent[index] == undefined) {
								return;
							}
							if (this.content[i].content.subContent[index].component == "GSlogan") {
								return;
							}
							let component = this.content[i].content.subContent[subContentIndex];
							var _content = [...this.content[i].content.subContent.slice(0, subContentIndex), ...this.content[i].content.subContent.slice(subContentIndex + 1)];
							this.content[i].content.subContent = _content;
							this.content[i].content.subContent.splice(index, 0, component);
						}
					}
				}
				return false;
			} else {
				if (this.content[index].name == "home" || this.content[index].name == "main") {
					return false;
				}
				var _index = this.getIndex(uid);
				this.move = true;
				var component = this.content[_index];
				var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
				this.content = _content;
				this.content.splice(index, 0, component);
			}
		},
		upCpt(data, sub) {
			if (sub) {
				for (let i = 0; i < this.content.length; i++) {
					if (this.content[i].component === "GArea") {
						const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === data);
						if (subContentIndex > 0) {
							const removedSubContent = this.content[i].content.subContent.splice(subContentIndex, 1)[0];
							this.content[i].content.subContent.splice(subContentIndex - 1, 0, removedSubContent);
							return true; // Return true to indicate the move was successful
						}
					}
				}
				return false;
			} else {
				const validPreviousComponents = ["GFixed", "GBg", "GSlogan", "GTop", "GWatermark", "GMusic"];
				const _index = this.getIndex(data);
				if (_index - 1 <= 0 || validPreviousComponents.includes(this.content[_index - 1].component)) {
					return;
				}

				this.move = true;
				var _temp = this.content[_index];
				var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
				this.content = _content;
				this.content.splice(_index - 1, 0, _temp);
			}
		},
		downCpt(data, sub) {
			if (sub) {
				for (let i = 0; i < this.content.length; i++) {
					if (this.content[i].component === "GArea") {
						const subContentIndex = this.content[i].content.subContent.findIndex((subItem) => subItem.uid === data);
						if (subContentIndex !== -1 && subContentIndex < this.content[i].content.subContent.length - 1) {
							const removedSubContent = this.content[i].content.subContent.splice(subContentIndex, 1)[0];
							this.content[i].content.subContent.splice(subContentIndex + 1, 0, removedSubContent);
							return true; // Return true to indicate the move was successful
						}
					}
				}
				return false;
			} else {
				var _index = this.getIndex(data);
				if (_index + 1 >= this.content.length) {
					return;
				}
				this.move = true;
				var _temp = this.content[_index];
				var _content = [...this.content.slice(0, _index), ...this.content.slice(_index + 1)];
				this.content = _content;
				this.content.splice(_index + 1, 0, _temp);
			}
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
		setStorageState(state, page,device="pc") {
			return new Promise((resolve, reject) => {
				let { content, config } = state;
				let temp = {};
				temp.page = page;
				temp.previewContent = content;
				temp.previewConfig = config;
				temp.previewConfig.device=device;
				console.log(temp)
				try {
					window.localStorage.setItem("state", JSON.stringify(temp));
					resolve(true);
				} catch (e) {
					reject(e);
				}
			});
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
