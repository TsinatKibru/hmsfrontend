import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: null,
  open: false,
  notifications: [],
  purchaserNotifications: [],
  pchNotifications: [],
  adminnotifications: [],
  cheffpurchaserNotifications: [],
  cashiernotifications: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.role = null;
    },
    showMenu: (state) => {
      state.open = true;
    },
    showNotification: (state) => {
      state.open = false;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action) => {
      const notificationIdToRemove = action.payload;
      const index = state.notifications.findIndex(
        (notification) => notification.id === notificationIdToRemove
      );

      if (index !== -1) {
        state.notifications.splice(index, 1);
      }
    },
    removeAllNotifications: (state) => {
      state.notifications = [];
    },
    addPchNotification: (state, action) => {
      state.pchNotifications.push(action.payload);
    },
    removePchNotification: (state, action) => {
      const notificationIdToRemove = action.payload;
      const index = state.pchNotifications.findIndex(
        (notification) => notification.id === notificationIdToRemove
      );

      if (index !== -1) {
        state.pchNotifications.splice(index, 1);
      }
    },
    removeAllPchNotifications: (state) => {
      state.pchNotifications = [];
    },

    addPurchaserNotification: (state, action) => {
      state.purchaserNotifications.push(action.payload);
    },
    removeAllPurchaserNotification: (state) => {
      state.purchaserNotifications = [];
    },
  },
});

const store = configureStore({
  reducer: appSlice.reducer,
});

export const {
  loginSuccess,
  logout,
  showMenu,
  showNotification,
  addNotification,
  addPchNotification,
  removeAllNotifications,
  removeAllPchNotifications,
  removeNotification,
  removePchNotification,
  addPurchaserNotification,
  removeAllPurchaserNotification,
} = appSlice.actions;

export default store;
