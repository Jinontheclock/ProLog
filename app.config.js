// Expo reads this file instead of app.json when present. It receives the
// static app.json config as `config`, so spread it through and only layer on
// the extras + the web base URL (for hosting under /Portfolio/prolog/).

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    API_BASE_URL: process.env.API_BASE_URL,
  },
  experiments: {
    ...config.experiments,
    baseUrl: "/Portfolio/prolog",
  },
});
