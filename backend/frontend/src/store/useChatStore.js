import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  // ✅ include get here
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); // ✅ now get() will work

    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    console.log("Sending message:", {
      messageData,
      selectedUser: selectedUser._id,
    });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      console.log("Message sent successfully:", res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not connected yet");
      return;
    }

    socket.on("newMessage", ({ newMessage }) => {
      // Check if the message is from the selected user or to the selected user
      const isMessageFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      const isMessageToSelectedUser =
        newMessage.receiverId === selectedUser._id;
      const isMessageFromMe =
        newMessage.senderId === useAuthStore.getState().authUser?._id;

      // Add message if it's part of the current conversation
      if (isMessageFromSelectedUser || isMessageToSelectedUser) {
        set({
          messages: [...get().messages, newMessage],
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket; // ✅ now getState() will work
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
