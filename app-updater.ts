import { BrowserWindow as BrowserWindowElectron } from "electron"
import { autoUpdater } from "electron-updater"
import * as os from "os"
import { isDev } from "./app/util"

export default class AppUpdater {
  private updateReady: boolean = false;

  constructor() {
    if (isDev()) {
      return;
    }

    const platform = os.platform()
    if (platform === "linux") {
      return;
    }

    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log

    autoUpdater.signals.updateDownloaded(it => {
      this.notify("A new update is ready to install", `Version ${it.version} is downloaded and will be automatically installed on Quit`)
      this.updateReady = true;
    });

    autoUpdater.checkForUpdates()
  }

  installUpdateIfAvailable() {
    if (this.updateReady) {
      autoUpdater.quitAndInstall();
    }
  }

  hasUpdate() {
    return this.updateReady;
  }

  notify(title: string, message: string): void {
    let windows = BrowserWindowElectron.getAllWindows()
    if (windows.length == 0) {
      return
    }

    windows[0].webContents.send("notify", title, message)
  }
}