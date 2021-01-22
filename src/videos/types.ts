export type Video = {
  videoId: string;
  actorId: string;
  name: string;
  description: string;
  hasClapped?: boolean;
  totalClaps?: number;
  streamLink?: string;
  originalLink?: string;
  thumbnailLink?: string;
  completedAt?: string;
  convertedAt?: string;
  orderIndex?: number;
  startTime?: number;
  endTime?: number;
};
