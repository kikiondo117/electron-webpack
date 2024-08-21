import { type BrowserWindow } from "electron";
import { LogModel } from "../../../models/Log";

export const sendLogs = async (mainWindow: BrowserWindow) => {
  try {
    const logs = await LogModel.find().sort({ created: 1 });
    mainWindow.webContents.send("logs:get", JSON.stringify(logs));
  } catch (err) {
    console.log("ERROR :C", err);
  }
};

export const addLog = async (
  event: any,
  item: any,
  mainWindow: BrowserWindow
) => {
  try {
    await LogModel.create(item);
    sendLogs(mainWindow);
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteLog = async (
  event: any,
  id: any,
  mainWindow: BrowserWindow
) => {
  try {
    await LogModel.findOneAndDelete({ _id: id });
    sendLogs(mainWindow);
  } catch (error) {
    console.log("error", error);
  }
};

export const clearLogs = async (mainWindow: BrowserWindow) => {
  try {
    await LogModel.deleteMany({});
    mainWindow.webContents.send("logs:clear");
  } catch (error) {
    console.log("error", error);
  }
};
