import axios from "axios";
const api = axios.create(
	{ 
		baseURL: "/api", //�������õ��Ǻ�˷����ṩ�Ľӿ�
		timeout: 3000 
	}
);
export default api;
