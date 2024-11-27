const logger = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") console.log(...args);
};

export default logger;
