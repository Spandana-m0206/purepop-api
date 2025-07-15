const cluster=require('cluster');
const os=require('os');
const listEndpoints=require('express-list-endpoints');
const dotenv=require('dotenv');

dotenv.config()

const PORT=process.env.PORT;

if(cluster.isPrimary){
    const numCPUs=Number(process.env.WORKER_COUNT) || os.cpus().length;
    console.log(`Master cluster setting up ${numCPUs} workers`);

    for (let i=0; i< numCPUs; i++){
        cluster.fork();
    }

cluster.on("online", (worker)=>{
    console.log(`Worker ${worker.process.pid} is online`);
});

cluster.on("exit",(worker,code,signal)=>{
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
    console.log("Starting a new worker");   
    cluster.fork(); 
})
} else {
  // Log all registered routes using express-list-endpoints
  const endpoints =listEndpoints(app);
  console.log("Registered Routes:");
  endpoints.forEach((endpoint)=>{
    endpoint.methods.forEach((method)=>{
        console.log(`${method} ${endpoint.path}`);
    });
  });

  app.listen(PORT, ()=>{
    console.log(`Server is running on port ${port} and worker ${process.pid}`);
  })
}