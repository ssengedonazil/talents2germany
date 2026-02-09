import { ipcMain, app } from 'electron';
import Database from 'better-sqlite3';
import path from 'path';

export default  function initDB() {
 // SQLite database in user data folder
 const dbPath = path.join(app.getPath('userData'), 'chat.db');
 const db = new Database(dbPath);
 return db
}
