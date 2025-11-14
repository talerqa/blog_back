export type RateLimit = {
  ip: string;
  url: {
    baseUrl: string;
    originalUrl: string;
  };
  date: string;
};
