import { LogModel } from "./../../models/Log";
import { connectDB } from "../../db";
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import * as path from "path";
import * as http from "http";
import { addLog, clearLogs, deleteLog, sendLogs } from "./utils/logs";

// ! Connectamos a nuestra DB
connectDB();

let mainWindow: BrowserWindow;

let isDev = false;
const isMac = process.platform === "darwin" ? true : false;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      // contextIsolation: true,
      // nodeIntegration: false,

      // !Solucion para el error de global en el window, pero no es la mejor la mejor es el preload.js
      nodeIntegration: true, // Habilita la integración de Node.js en el renderer
      contextIsolation: false, // Deshabilita el aislamiento de contexto
    },
  });

  if (isDev) {
    const startURL = "http://localhost:3000";

    const checkServer = () => {
      http
        .get(startURL, (res) => {
          if (res.statusCode === 200) {
            mainWindow.loadURL(startURL);
            mainWindow.show();
            mainWindow.webContents.openDevTools();
          } else {
            setTimeout(checkServer, 1000); // Reintentar después de 1 segundo si no está listo
          }
        })
        .on("error", () => {
          setTimeout(checkServer, 1000); // Reintentar si hay un error de conexión
        });
    };

    mainWindow.hide(); // Ocultar la ventana hasta que el contenido esté listo
    checkServer(); // Comenzar a verificar si el servidor está listo
  } else {
    // Parece ser que en prod no es necesario especificar dist ya que originalmente va a estar en esa carpeta c:
    const mainHtml = path.resolve(__dirname, "index.html");
    mainWindow.loadFile(mainHtml);
  }
};

app.on("ready", () => {
  createWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});

const menu: any = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  { role: "fileMenu" },
  { role: "editMenu" },
  {
    label: "Logs",
    submenu: [{ label: "Clear Logs", click: () => clearLogs(mainWindow) }],
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// ! Load Logs
ipcMain.on("logs:load", () => sendLogs(mainWindow));

// ! Create log 😱
ipcMain.on("logs:add", (event, item) => addLog(event, item, mainWindow));

// ! Delete log
ipcMain.on("logs:delete", (event, id) => deleteLog(event, id, mainWindow));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
