import WebSocket, { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { db } from './db';

export function startWSServer() {
  const wss = new WebSocketServer({ port: 8080 });

  setInterval(() => {
    const chat = db.prepare(`
      SELECT id FROM chats ORDER BY RANDOM() LIMIT 1
    `).get();

    const msg = {
      id: randomUUID(),
      chatId: chat.id,
      ts: Date.now(),
      sender: 'remote',
      body: 'New message'
    };

    db.prepare(`INSERT INTO messages VALUES (@id,@chatId,@ts,@sender,@body)`)
      .run(msg);

    db.prepare(`
      UPDATE chats SET
      lastMessageAt = ?, unreadCount = unreadCount + 1
      WHERE id = ?
    `).run(msg.ts, msg.chatId);

    wss.clients.forEach(c =>
      c.readyState === WebSocket.OPEN && c.send(JSON.stringify(msg))
    );
  }, 1500);
}
