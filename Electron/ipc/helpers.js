/**
 * lets create it as a skelecton to allow to be used by others
 * 
 * **/
import { randomUUID } from 'crypto';

export async function MakeUnRedMessageToSeen(db, chatId) {
    const updateUnread = db.prepare(`
        UPDATE chats
        SET unreadCount = 0
        WHERE id = ?
        `);
    const result = updateUnread.run(chatId);

    if (result.changes > 0) {
        console.log(`Unread count for chat ${chatId} successfully updated!`);
    } else {
        console.log(`No chat found with id ${chatId}, nothing updated.`);
    }
}

export async function searchAllMessages(db, query) {
    try {
        let messages;

        if (query && query.trim() !== "") {
            messages = db
                .prepare(`
          SELECT *
          FROM messages
          WHERE body LIKE ?
          ORDER BY ts ASC
        `)
                .all(`%${query}%`);
        }

        return messages; // returns an array of all messages (possibly filtered)
    } catch (err) {
        console.error("Error searching messages:", err);
        return [];
    }
}
export async function sendMesasge(db, message, chatid) {
    try {
        const id = randomUUID();
         let lastTimestamp = Date.now() ;
        const insertMsg = db.prepare(
            'INSERT INTO messages (id, chatId, sender, body, ts) VALUES (?, ?, ?, ?, ?)'
        );
        
     const dfd=   insertMsg.run(id, chatid, "You", message,lastTimestamp);
     let stmt= db.prepare(`
        SELECT *
        FROM messages
        WHERE id = ?
        ORDER BY ts DESC
        LIMIT 1
      `);
      stmt = stmt.all(id);
      
      db.prepare('UPDATE chats SET lastMessageAt = ? WHERE id = ?').run(lastTimestamp, chatid);
        return stmt; // returns an array of all messages (possibly filtered)
    } catch (err) {
        console.error("Error searching messages:", err);
        return [];
    }
}
