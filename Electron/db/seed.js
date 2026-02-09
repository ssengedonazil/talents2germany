import { randomUUID } from 'crypto';
import initDB from './index.js';

export function seed() {
  const db = initDB();

  db.prepare('DELETE FROM messages').run();
  db.prepare('DELETE FROM chats').run();

  const chatTitles = ['Random', 'Project X', 'Team Updates', 'Fun Chat', "Ssengendo nazil", "Lord", "Microsoft", "Google"];
  const chats = chatTitles.map(title => ({
    id: randomUUID(),
    title,
    unreadCount: Math.floor(Math.random() * 30) + 4,
    lastMessageAt: Date.now(),
  }));

  const insertChat = db.prepare(
    'INSERT INTO chats (id, title, unreadCount, lastMessageAt) VALUES (?, ?, ?, ?)'
  );
  chats.forEach(c => insertChat.run(c.id, c.title, c.unreadCount, c.lastMessageAt));

  const users = [
    'You',

    'Alice', 'You', 'Bob', 'Charlie', 'David', 'You', 'Emma', 'Frank', 'Grace', 'You', 'Hannah', 'Isaac', 'Jack',
    'Daniel', 'You', 'Sophia', 'You', 'Michael', 'Olivia', 'Ethan', 'You', 'Liam', 'Noah', 'Sam', 'Alex', 'Chris',
    'Jordan', 'You', 'Taylor', 'You', 'Neo', 'Pixel', 'Echo', 'You', 'Nova', 'Ghost',

    'Mia', 'You', 'Ava', 'Ella', 'You', 'Aria', 'Zoe', 'You', 'Luna', 'Levi', 'Logan', 'You', 'Mason', 'Lucas',
    'Henry', 'Owen', 'Wyatt', 'You', 'Sebastian', 'Julian', 'Carter', 'Wyatt', 'Gabriel', 'Mateo', 'Ezra',

    'Nora', 'Stella', 'Hazel', 'Violet', 'You', 'Aurora', 'You', 'Penelope', 'Scarlett', 'You', 'Camila', 'Isla', 'You', 'Elijah',
    'James', 'Benjamin', 'You', 'Samuel', 'Nathan', 'Leo'
  ];

  ;

  const totalMessages = 5000;
  const insertMsg = db.prepare(
    'INSERT INTO messages (id, chatId, sender, body, ts) VALUES (?, ?, ?, ?, ?)'
  );

  let remainingMessages = totalMessages;

  chats.forEach((chat, index) => {
    const numMessages = index === chats.length - 1 ? remainingMessages : Math.floor(totalMessages / chats.length);

    remainingMessages -= numMessages;

    let lastTimestamp = Date.now() ;

    for (let i = 0; i < numMessages; i++) {
      const sender = users[Math.floor(Math.random() * users.length)];

      const sampleYourMsgs = ['Hey, how’s it going?', 'I just finished the task.', 'Let’s meet tomorrow.', 'Sounds good!', 'Thanks for the update.', 'I’ll check it out later.', 'Can we discuss this in the meeting?', 'I’m almost done with it.', 'Sure, I can handle that.', 'Got your message!', 'I’ll send the report by evening.', 'Let’s sync after lunch.', 'I’ll look into it.', 'Thanks for letting me know!', 'I agree with your suggestion.', 'Let’s review this together.', 'I’m on it.', 'All done!', 'I’ll follow up tomorrow.', 'That works for me.'];

      const sampleOtherMsgs = ['Hello!', 'Got it, thanks.', 'I will check and let you know.', 'That’s interesting!', 'See you soon.', 'Can you clarify this?', 'I’ve sent the files.', 'Please review when possible.', 'Let’s discuss this in detail.', 'Sounds perfect!', 'I’ll join the call shortly.', 'Any updates on this?', 'I’m not sure about that.', 'Thanks for the info!', 'I’ll take care of it.', 'Can we reschedule?', 'Looking forward to it!', 'That’s great news!', 'Please share the document.', 'I’ll confirm by end of day.'];

      const body = sender === 'You'
        ? sampleYourMsgs[Math.floor(Math.random() * sampleYourMsgs.length)]
        : sampleOtherMsgs[Math.floor(Math.random() * sampleOtherMsgs.length)];


      insertMsg.run(randomUUID(), chat.id, sender, body, lastTimestamp);

      chat.lastMessageAt = lastTimestamp;
    }

    db.prepare('UPDATE chats SET lastMessageAt = ? WHERE id = ?').run(chat.lastMessageAt, chat.id);
  });

  console.log('Database seeded successfully with ~500 messages across minimal chats!');
}
