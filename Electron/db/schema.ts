export default function  Dbschema(db:any){
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

}