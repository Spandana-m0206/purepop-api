const cluster = require("cluster");
const os = require("os");
const dotenv = require("dotenv");
const listEndpoints = require("express-list-endpoints");
const { connectDB } = require("./config/database");

dotenv.config();

const PORT = process.env.PORT || 3000;
const numCPUs = Number(process.env.WORKER_COUNT) || os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master cluster setting up ${numCPUs} workers`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("online", (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = require("./app");

  connectDB()
    .then(() => {
      const endpoints = listEndpoints(app);
      console.log("✅ Registered Routes:");
      endpoints.forEach((endpoint) => {
        endpoint.methods.forEach((method) => {
          console.log(`${method} ${endpoint.path}`);
        });
      });

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}, Worker ${process.pid}`);
      });
    })
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB:", err.message);
      process.exit(1);
    });
}
