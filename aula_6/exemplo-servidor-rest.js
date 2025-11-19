// exemplo-servidor-rest.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Servidor REST para API de Livros
 * Demonstração para Aula 6 - Arquitetura de Web Services
 */

// Middleware para processar JSON nas requests
app.use(express.json());

// Middleware para logs simples
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Dados simulados (em memória)
let livros = [
  {
    id: 1,
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    ano: 1899,
    genero: 'Romance',
    disponivel: true
  },
  {
    id: 2,
    titulo: 'O Processo',
    autor: 'Franz Kafka',
    ano: 1925,
    genero: 'Ficção',
    disponivel: true
  },
  {
    id: 3,
    titulo: 'Ensaio sobre a Cegueira',
    autor: 'José Saramago',
    ano: 1995,
    genero: 'Ficção',
    disponivel: false
  },
  {
    id: 4,
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    ano: 1943,
    genero: 'Fábula',
    disponivel: true
  },
  {
    id: 5,
    titulo: 'Memórias Póstumas de Brás Cubas',
    autor: 'Machado de Assis',
    ano: 1881,
    genero: 'Romance',
    disponivel: true
  }
];

// Contador para próximo ID
let proximoId = livros.length + 1;

// Rota para a raiz - Documentação da API
app.get('/', (req, res) => {
  res.json({
    api: 'API de Biblioteca v1.0',
    descricao: 'API REST de exemplo para gestão de livros',
    rotas: [
      { metodo: 'GET', caminho: '/api/livros', descricao: 'Lista todos os livros' },
      { metodo: 'GET', caminho: '/api/livros/:id', descricao: 'Obtém um livro específico' },
      { metodo: 'POST', caminho: '/api/livros', descricao: 'Adiciona um novo livro' },
      { metodo: 'PUT', caminho: '/api/livros/:id', descricao: 'Atualiza um livro existente' },
      { metodo: 'DELETE', caminho: '/api/livros/:id', descricao: 'Remove um livro' },
      { metodo: 'GET', caminho: '/api/livros/pesquisa', descricao: 'pesquisa livros por autor, título ou gênero' }
    ],
    filtros: [
      { parametro: 'autor', exemplo: '/api/livros?autor=Machado' },
      { parametro: 'disponivel', exemplo: '/api/livros?disponivel=true' },
      { parametro: 'genero', exemplo: '/api/livros?genero=Romance' }
    ],
    paginacao: [
      { parametro: 'pagina', padrao: 1 },
      { parametro: 'limite', padrao: 10 }
    ]
  });
});

// GET /api/livros - Listar todos os livros
app.get('/api/livros', (req, res) => {
  let resultado = [...livros];

  // Processamento de filtros
  if (req.query.autor) {
    const autorPesquisa = req.query.autor.toLowerCase();
    resultado = resultado.filter(livro =>
      livro.autor.toLowerCase().includes(autorPesquisa)
    );
  }

  if (req.query.disponivel !== undefined) {
    const disponivel = req.query.disponivel === 'true';
    resultado = resultado.filter(livro => livro.disponivel === disponivel);
  }

  if (req.query.genero) {
    const generoPesquisa = req.query.genero.toLowerCase();
    resultado = resultado.filter(livro =>
      livro.genero.toLowerCase().includes(generoPesquisa)
    );
  }

  // Processamento de paginação
  const pagina = parseInt(req.query.pagina) || 1;
  const limite = parseInt(req.query.limite) || resultado.length;

  const inicio = (pagina - 1) * limite;
  const fim = inicio + limite;

  // Informações de paginação
  const paginacao = {
    total: resultado.length,
    pagina: pagina,
    limite: limite,
    totalPaginas: Math.ceil(resultado.length / limite)
  };

  // Retornar resultados paginados
  res.json({
    paginacao: paginacao,
    livros: resultado.slice(inicio, fim)
  });
});

// GET /api/livros/:id - Obter um livro específico
app.get('/api/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const livro = livros.find(livro => livro.id === id);

  if (!livro) {
    return res.status(404).json({
      erro: 'Livro não encontrado',
      mensagem: `O livro com ID ${id} não existe na biblioteca`
    });
  }

  res.json(livro);
});

// POST /api/livros - Adicionar um novo livro
app.post('/api/livros', (req, res) => {
  const { titulo, autor, ano, genero, disponivel = true } = req.body;

  // Validação dos dados de entrada
  if (!titulo || !autor) {
    return res.status(400).json({
      erro: 'Dados incompletos',
      mensagem: 'Os campos "titulo" e "autor" são obrigatórios'
    });
  }

  // Verificar se o livro já existe
  const livroExistente = livros.find(
    livro => livro.titulo.toLowerCase() === titulo.toLowerCase() &&
             livro.autor.toLowerCase() === autor.toLowerCase()
  );

  if (livroExistente) {
    return res.status(409).json({
      erro: 'Livro duplicado',
      mensagem: 'Um livro com este título e autor já existe',
      livroExistente: livroExistente
    });
  }

  // Criar novo livro
  const novoLivro = {
    id: proximoId++,
    titulo,
    autor,
    ano: ano || null,
    genero: genero || 'Não especificado',
    disponivel: Boolean(disponivel),
    dataCadastro: new Date().toISOString()
  };

  // Adicionar à coleção
  livros.push(novoLivro);

  // Retornar o livro criado
  res.status(201).json(novoLivro);
});

// PUT /api/livros/:id - Atualizar um livro existente
app.put('/api/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, autor, ano, genero, disponivel } = req.body;

  // Encontrar o livro
  const index = livros.findIndex(livro => livro.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: 'Livro não encontrado',
      mensagem: `O livro com ID ${id} não existe na biblioteca`
    });
  }

  // Criar cópia do livro original para comparação
  const livroOriginal = { ...livros[index] };

  // Atualizar apenas os campos fornecidos
  if (titulo !== undefined) livros[index].titulo = titulo;
  if (autor !== undefined) livros[index].autor = autor;
  if (ano !== undefined) livros[index].ano = ano;
  if (genero !== undefined) livros[index].genero = genero;
  if (disponivel !== undefined) livros[index].disponivel = Boolean(disponivel);

  // Adicionar data de atualização
  livros[index].dataAtualizacao = new Date().toISOString();

  // Retornar o livro atualizado junto com o original
  res.json({
    mensagem: 'Livro atualizado com sucesso',
    anterior: livroOriginal,
    atual: livros[index]
  });
});

// DELETE /api/livros/:id - Remover um livro
app.delete('/api/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Encontrar o livro
  const index = livros.findIndex(livro => livro.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: 'Livro não encontrado',
      mensagem: `O livro com ID ${id} não existe na biblioteca`
    });
  }

  // Armazenar livro removido
  const livroRemovido = livros[index];

  // Remover o livro
  livros.splice(index, 1);

  // Retornar sucesso (status 200 com confirmação em vez de 204 No Content)
  res.json({
    mensagem: 'Livro removido com sucesso',
    livro: livroRemovido
  });
});

// GET /api/livros/pesquisa - Pesquisa avançada (demonstra outra abordagem de filtragem)
app.get('/api/livros/pesquisa', (req, res) => {
  const { termo } = req.query;

  if (!termo || termo.length < 2) {
    return res.status(400).json({
      erro: 'Termo de pesquisa inválido',
      mensagem: 'Forneça um termo de pesquisa com pelo menos 2 caracteres'
    });
  }

  const termoPesquisa = termo.toLowerCase();

  // Pesquisa em múltiplos campos
  const resultados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(termoPesquisa) ||
    livro.autor.toLowerCase().includes(termoPesquisa) ||
    (livro.genero && livro.genero.toLowerCase().includes(termoPesquisa))
  );

  if (resultados.length === 0) {
    return res.json({
      mensagem: 'Nenhum livro encontrado para o termo de pesquisa',
      termo: termo,
      resultados: []
    });
  }

  res.json({
    termo: termo,
    total: resultados.length,
    resultados: resultados
  });
});

// Middleware para tratar rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    mensagem: `A rota ${req.method} ${req.url} não existe nesta API`
  });
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);

  res.status(500).json({
    erro: 'Erro interno do servidor',
    mensagem: 'Ocorreu um erro inesperado ao processar sua request'
  });
});

// Iniciar o servidor
if (require.main === module) {
  // Somente iniciar o servidor se este arquivo for executado diretamente
  app.listen(PORT, () => {
    console.log(`🚀 Servidor à escuta em http://localhost:${PORT}`);
    console.log('Pressione CTRL+C para encerrar');
  });
}

// Exportar app para testes ou importação
module.exports = app;
