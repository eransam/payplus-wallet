import path from "path";

const isDocker = process.env.DOCKER_ENV === "true";

export const LOGS_DIR = isDocker
  ? "/app/logs"
  : path.join(__dirname, "../../logs");
