// src/utils/AppError.js
/**
 * Classe para erros personalizados da aplicação
 */
class AppError extends Error {
  /**
   * Cria uma instância de AppError
   * @param {string} message - Mensagem de erro
   * @param {number} statusCode - Código de status HTTP
   * @param {Object} [additionalInfo={}] - Informações adicionais sobre o erro
   */
  constructor(message, statusCode, additionalInfo = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.additionalInfo = additionalInfo;

    // Adicionar informação para capturar stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Cria um erro para recurso não encontrado
   * @param {string} resource - Nome do recurso
   * @param {string|number} id - Identificador do recurso
   * @returns {AppError}
   */
  static notFound(resource, id) {
    return new AppError(`${resource} com ID ${id} não encontrado`, 404);
  }

  /**
   * Cria um erro para request inválida
   * @param {string} message - Mensagem de erro
   * @param {Object} [details={}] - Detalhes sobre o erro
   * @returns {AppError}
   */
  static badRequest(message, details = {}) {
    return new AppError(message, 400, details);
  }

  /**
   * Cria um erro para recurso já existente
   * @param {string} resource - Nome do recurso
   * @param {string} field - Campo que causa a duplicação
   * @param {string|number} value - Valor duplicado
   * @returns {AppError}
   */
  static conflict(resource, field, value) {
    return new AppError(`${resource} com ${field} '${value}' já existe`, 409);
  }

  /**
   * Cria um erro para acesso não autorizado
   * @param {string} [message='Acesso não autorizado'] - Mensagem de erro
   * @returns {AppError}
   */
  static unauthorized(message = 'Acesso não autorizado') {
    return new AppError(message, 401);
  }

  /**
   * Cria um erro para acesso proibido
   * @param {string} [message='Acesso proibido'] - Mensagem de erro
   * @returns {AppError}
   */
  static forbidden(message = 'Acesso proibido') {
    return new AppError(message, 403);
  }
}

module.exports = AppError;
