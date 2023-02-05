const { env } = process;

export default {
  sourceUrl: env.URL ?? "https://radio.tumba.ch/stream",
  delayHours: env.DELAY_HOURS?.split(',') ?? [1, 2, 3],
  destination: {
    "host": env.HOST ?? "radio.tumba.ch",
    "port": env.PORT ?? 8000,
    "password": env.PASSWORD ?? "hackme",
    "format": env.FORMAT ?? 0, // 0 = ogg, 1 = mp3
  },
  mounts: env.MOUNTS?.split(',') ?? ["timeback-1", "timeback-2", "timeback-3"]
};
