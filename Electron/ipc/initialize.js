import { ipcMain } from 'electron';
// import Database from 'sqlite3';
import initDB from '../db/index.ts';
import { MakeUnRedMessageToSeen, sendMesasge } from './helpers.ts';
const db = initDB()


db.prepare(`
  CREATE TABLE IF NOT EXISTS chats (
    id TEXT PRIMARY KEY,
    title TEXT,
    unreadCount INTEGER,
    lastMessageAt INTEGER
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    chatId TEXT,
    sender TEXT,
    body TEXT,
    ts INTEGER,
    FOREIGN KEY(chatId) REFERENCES chats(id)
  )
`).run();

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_messages_chatId
  ON messages(chatId)
`).run();

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt
  ON chats(lastMessageAt)
`).run();

db.prepare(`
  CREATE INDEX IF NOT EXISTS idx_messages_ts
  ON messages(ts)
`).run();


// Seed sample data if empty
if (db.prepare('SELECT COUNT(*) AS count FROM chats').get().count === 0) {
  const insertChat = db.prepare('INSERT INTO chats (id, title, unreadCount, lastMessageAt) VALUES (?, ?, ?, ?)');
  insertChat.run('chat1', 'General', 2, Date.now());
  insertChat.run('chat2', 'Random', 0, Date.now());

  const insertMsg = db.prepare('INSERT INTO messages (id, chatId, sender, body, ts) VALUES (?, ?, ?, ?, ?)');
  insertMsg.run('msg1', 'chat1', 'Alice', 'Hello!', Date.now());
  insertMsg.run('msg2', 'chat1', 'Bob', 'Hi there!', Date.now());
}


// IPC handlers
export function registerChatHandlers() {
  ipcMain.handle('get-chats', (_event, offset = 0) => {
    const stmt = db.prepare(`
      SELECT *
      FROM chats
      ORDER BY lastMessageAt DESC
      LIMIT 50 OFFSET ?
    `);
    return stmt.all(offset);
  });



  ipcMain.handle('get-messages', async (_event, chatId, before) => {

    ////// let update the data before any a action 
    await MakeUnRedMessageToSeen(db, chatId)

    let stmt;
    console.log({before});
    

    if (before) {
      stmt = db.prepare(`
        SELECT *
        FROM messages
        WHERE chatId = ? AND ts < ?
        ORDER BY ts ASC
        LIMIT 200
      `);
      stmt = stmt.all(chatId, before);
    } else {
      stmt = db.prepare(`
        SELECT *
        FROM messages
        WHERE chatId = ?
        ORDER BY ts ASC
        LIMIT 200
      `);
      stmt = stmt.all(chatId);
    }
    // console.log(stmt);
    

    return stmt
  });
  ipcMain.handle("send-message", (_event, chatId, message) => {

   return sendMesasge(db,chatId, message, )
  })
  ipcMain.handle("update-red-messages", (_event, chatId) => {

    const updateUnread = db.prepare(`
      UPDATE chats
      SET unreadCount = 0
      WHERE id = ?
      `);

    const stmt = db.prepare(`
        SELECT *
        FROM messages
        WHERE chatId = ?
        ORDER BY ts DESC
        LIMIT 50
      `);
    const dd = stmt.all(chatId);
    console.log({ chatId, dd }, "----");

    updateUnread.run(chatId);
  })
}
