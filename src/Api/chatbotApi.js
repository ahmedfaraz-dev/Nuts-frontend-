import { httpClient } from "./axiosInstance";

export const chatbotApi = {
  sendMessage: (message, history) => 
    httpClient.post("/chatbot/chat", { message, history })
};
