// src/controllers/healthController.js
const os = require('os');
const config = require('../config');

/**
 * Controlador para verificações de saúde da aplicação
 */
const healthController = {
  /**
   * Verificar status básico da API
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   */
  getBasicHealth(req, res) {
    res.status(200).json({
      status: 'success',
      message: 'API está funcionando corretamente',
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Verificar status detalhado da API com métricas do sistema
   * @param {Object} req - Objeto de request Express
   * @param {Object} res - Objeto de response Express
   */
  getDetailedHealth(req, res) {
    // Coletar informações do sistema
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    // Formatar tempo de atividade
    const formatUptime = (seconds) => {
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    // Formatar uso de memória para MB
    const formatMemory = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;

    // Coletar informações da aplicação
    const appInfo = {
      env: config.server.env,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    };

    // Coletar métricas do sistema
    const systemMetrics = {
      cpuCores: os.cpus().length,
      totalMemory: formatMemory(os.totalmem()),
      freeMemory: formatMemory(os.freemem()),
      loadAverage: os.loadavg()
    };

    // Métricas do processo
    const processMetrics = {
      pid: process.pid,
      uptime: formatUptime(uptime),
      memoryUsage: {
        rss: formatMemory(memoryUsage.rss),         // Resident Set Size
        heapTotal: formatMemory(memoryUsage.heapTotal), // V8 heap total
        heapUsed: formatMemory(memoryUsage.heapUsed),  // V8 heap used
        external: formatMemory(memoryUsage.external)   // C++ objects bound to JS
      }
    };

    // Retornar response
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      application: appInfo,
      system: systemMetrics,
      process: processMetrics
    });
  }
};

module.exports = healthController;
