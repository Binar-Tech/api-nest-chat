module.exports = {
  apps: [
    {
      name: 'nest-api',
      script: 'dist/main.js', // Arquivo de saída do build
      cwd: './',
      instances: 'max', // Usa todos os núcleos disponíveis
      exec_mode: 'cluster', // Modo cluster para melhor desempenho
      watch: false, // Não reiniciar automaticamente (melhor para produção)
      autorestart: true, // Reiniciar em caso de falha
      env: {
        NODE_ENV: 'production',
        PORT: 4000, // Defina a porta desejada
      },
    },
  ],
};
