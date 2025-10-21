module.exports = {
  apps : [
    {
      name    : "anime-backend",
      script  : "./backend/server.js",
      cwd     : "./backend",
      watch   : true,
      ignore_watch : ["node_modules", "database.sqlite", "logs"],
      env: {
        "NODE_ENV": "development"
      },
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      err_file: "./logs/error.log"
    },
    {
      name    : "anime-frontend",
      script  : "npm",
      args    : "run dev",
      cwd     : "./",
      watch   : true,
      ignore_watch : ["node_modules", "dist", "logs"],
      env: {
        "NODE_ENV": "development"
      },
      log_file: "./logs/combined.log",
      out_file: "./logs/out.log",
      err_file: "./logs/error.log"
    }
  ]
}