const { app, BrowserWindow } = require("electron");
const path = require("path");

/**
 * Offline classroom wrapper — loads DONT PANIC!!!
 * Same handoff idea as Literal Order: unzip / portable exe → double-click.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: "#070b14",
    autoHideMenuBar: true,
    title: "DONT PANIC!!!",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const indexPath = path.join(__dirname, "game", "index.html");
  win.loadFile(indexPath);

  win.webContents.on("will-navigate", (event) => {
    event.preventDefault();
  });
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
