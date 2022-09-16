import axios from "axios";

const apiRequest = axios.create({
	baseURL: "/api/E20220914/"
});

export const GetServerList = (data) => {
	return apiRequest.post("GetServerList", data);
};