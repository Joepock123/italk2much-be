export type Chat = {
  chatId: number;
  createdAt: Date;
  lastTouched: Date;
  participants: Array<User>;
  messages: Array<Message>;
};

export type Message = {
  messageId: string;
  chatId: string;
  ownerId: string;
  ownerName?: string;
  createdAt: number;
  lastTouched: number;
  text: string;
};

export type User = {
  id: string;
  name: string;
};
