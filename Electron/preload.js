const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getChats: (offset) => ipcRenderer.invoke('get-chats', offset),
  getMessages: (chatId, before) => ipcRenderer.invoke('get-messages', chatId, before),
  ChargeSeenMessage: (chatId, before) => ipcRenderer.invoke('update-red-messages', chatId, before),
  sendMessage: (message, chatid, sender) => ipcRenderer.invoke('send-message', message, chatid, sender),
});
