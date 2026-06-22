class Config {
  isDevelopment: boolean;
  port: number;
  databaseUrl: string;

  constructor() {
    this.isDevelopment = false;
    this.port = 3000;
    this.databaseUrl = "";
  }
}

class DevelopmentConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = true;
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUrl =
      process.env.DATABASE_URL ||
      "postgresql://payplus:payplus@localhost:5432/payplus_wallet";
  }
}

class ProductionConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = false;
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUrl = process.env.DATABASE_URL || "";
  }
}

const config =
  process.env.NODE_ENV === "production"
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default config;
