class Config {
  isDevelopment: boolean;
  port: number;
  databaseUrl: string;
  redisUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;

  constructor() {
    this.isDevelopment = false;
    this.port = 3001;
    this.databaseUrl = "";
    this.redisUrl = "";
    this.jwtSecret = "";
    this.jwtExpiresIn = "7d";
  }
}

class DevelopmentConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = true;
    this.port = Number(process.env.PORT) || 3001;
    this.databaseUrl =
      process.env.DATABASE_URL ||
      "postgresql://payplus:payplus@localhost:5432/payplus_wallet";
    this.redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
    this.jwtSecret = process.env.JWT_SECRET || "payplus-dev-secret-change-in-production";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }
}

class ProductionConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = false;
    this.port = Number(process.env.PORT) || 3001;
    this.databaseUrl = process.env.DATABASE_URL || "";
    this.redisUrl = process.env.REDIS_URL || "";
    this.jwtSecret = process.env.JWT_SECRET || "";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }
}

const config =
  process.env.NODE_ENV === "production"
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default config;
