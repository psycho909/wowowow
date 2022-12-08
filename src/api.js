import axios from "axios";

const apiRequest = axios.create({
	baseURL: "/api/GamaEvent/"
});

// 取得遊戲列表
export const GetGames = (otp = 1) => {
	return apiRequest({
		method: "post",
		url: "GetGames",
		headers: { "Content-Type": "application/json" },
		params: {
			otp
		}
	});
};

// 取得活動列表
export const GetEventList = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "GetEventList",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 取得模板列表
export const GetPageType = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "GetPageType",
		headers: { "Content-Type": "application/json" },
		params: {
			otp
		}
	});
};

// 新增活動
export const AddEventList = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "AddEventList",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 送審/審核
export const ApproveEvent = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "ApproveEvent",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 取得審核過活動
export const GetApprovedEvent = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "GetApprovedEvent",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 下架審核過活動
export const UpdateApprovedEvent = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "UpdateApprovedEvent",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 更新活動內容
export const UpdateEventContent = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "UpdateEventContent",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};

// 更新活動設定
export const UpdateEvent = (otp = 1, data) => {
	return apiRequest({
		method: "post",
		url: "UpdateEvent",
		headers: { "Content-Type": "application/json" },
		data,
		params: {
			otp
		}
	});
};
export const GetApprovedEventMain = (url, eventSeq) => {
	return apiRequest({
		method: "post",
		url: "GetApprovedEvent",
		headers: { "Content-Type": "application/json" },
		data: {
			url,
			eventSeq
		}
	});
};
