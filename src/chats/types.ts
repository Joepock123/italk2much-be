export type Chat = {
  chatId: string;
  chatName?: string;
  ownerId?: string;
  createdAt: number;
  lastTouched: number;
  members: Array<string>;
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
