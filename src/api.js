import axios from "axios";

const apiRequest = axios.create({
	baseURL: "http://localhost:3000"
});

export const GetData = () => {
	return apiRequest.get("/data");
};

export const PostData = (data) => {
	return apiRequest.post("/data", data);
};
