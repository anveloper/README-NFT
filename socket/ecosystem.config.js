module.exports = [{
  script: 'dist/server.js',
  name: 'npm',
  // exec_mode: 'cluster',
  // instances: 2,
  env_production: {
    NODE_ENV: "production"
  },
}]
