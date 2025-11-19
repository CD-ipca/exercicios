// exemplo-cliente-rest.js
const axios = require('axios');

/**
 * Cliente REST para consulta de dados de clima
 * Demonstração para Aula 6 - Arquitetura de Web Services
 */

// Função para obter dados meteorológicos de uma cidade
async function obterDadosMeteorologicos(cidade) {
  try {
    // Chave API gratuita da OpenWeatherMap (limitada)
    // Os alunos devem criar suas próprias chaves em https://openweathermap.org/api
    const API_KEY = 'sua_api_key_aqui';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&units=metric&lang=pt&appid=${API_KEY}`;

    console.log(`📡 Consultando dados meteorológicos para: ${cidade}`);

    // Fazer request HTTP GET
    const response = await axios.get(URL);

    // Verificar se a request foi bem sucedida
    if (response.status !== 200) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    // Extrair apenas os dados relevantes da resposta
    const dados = response.data;

    // Formatar os dados para um formato mais amigável
    const dadosFormatados = {
      cidade: dados.name,
      pais: dados.sys.country,
      temperatura: {
        atual: dados.main.temp,
        sensacao: dados.main.feels_like,
        minima: dados.main.temp_min,
        maxima: dados.main.temp_max
      },
      clima: {
        descricao: dados.weather[0].description,
        codigo: dados.weather[0].id,
        icone: dados.weather[0].icon
      },
      vento: {
        velocidade: dados.wind.speed,
        direcao: dados.wind.deg
      },
      humidade: dados.main.humidity,
      pressao: dados.main.pressure,
      visibilidade: dados.visibility,
      atualizadoEm: new Date(dados.dt * 1000).toLocaleString()
    };

    // Retornar dados formatados
    return dadosFormatados;
  } catch (error) {
    // Tratar diferentes tipos de erros
    if (error.response) {
      // A API retornou uma resposta com código de erro
      console.error(`❌ Erro na API (${error.response.status}):`, error.response.data);

      // Tratar erros específicos
      if (error.response.status === 404) {
        throw new Error(`A cidade "${cidade}" não foi encontrada`);
      } else if (error.response.status === 401) {
        throw new Error('Chave de API inválida ou expirada');
      } else {
        throw new Error(`Erro na API: ${error.response.status}`);
      }
    } else if (error.request) {
      // A request foi feita mas não houve resposta
      console.error('❌ Sem response da API:', error.request);
      throw new Error('Não foi possível contactar o servidor meteorológico');
    } else {
      // Erro na configuração da request
      console.error('❌ Erro na request:', error.message);
      throw new Error(`Erro ao processar a request: ${error.message}`);
    }
  }
}

/**
 * Função para obter previsão do tempo para os próximos dias
 * Demonstra outra chamada REST usando a mesma base da API
 */
async function obterPrevisaoProximosDias(cidade, dias = 5) {
  try {
    const API_KEY = 'sua_api_key_aqui';
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&units=metric&lang=pt&cnt=${dias * 8}&appid=${API_KEY}`;

    console.log(`📡 Consultando previsão para os próximos ${dias} dias em: ${cidade}`);

    const response = await axios.get(URL);

    // Agrupar previsões por dia
    const previsoesPorDia = {};

    // A API retorna previsões a cada 3 horas, precisamos agrupá-las por dia
    response.data.list.forEach(previsao => {
      const data = new Date(previsao.dt * 1000);
      const diaFormatado = data.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!previsoesPorDia[diaFormatado]) {
        previsoesPorDia[diaFormatado] = {
          data: diaFormatado,
          diaSemana: data.toLocaleDateString('pt-PT', { weekday: 'long' }),
          temperaturas: [],
          clima: [],
          icones: []
        };
      }

      previsoesPorDia[diaFormatado].temperaturas.push(previsao.main.temp);
      previsoesPorDia[diaFormatado].clima.push(previsao.weather[0].description);
      previsoesPorDia[diaFormatado].icones.push(previsao.weather[0].icon);
    });

    // Calcular médias e encontrar clima predominante para cada dia
    const previsaoFormatada = Object.values(previsoesPorDia).map(dia => {
      // Calcular temperatura média
      const tempMedia = dia.temperaturas.reduce((sum, temp) => sum + temp, 0) / dia.temperaturas.length;

      // Encontrar clima predominante (modo)
      const climaFrequencia = {};
      let climaPredominante = '';
      let maxFrequencia = 0;

      dia.clima.forEach(clima => {
        if (!climaFrequencia[clima]) climaFrequencia[clima] = 0;
        climaFrequencia[clima]++;

        if (climaFrequencia[clima] > maxFrequencia) {
          maxFrequencia = climaFrequencia[clima];
          climaPredominante = clima;
        }
      });

      // Encontrar ícone mais frequente
      const iconeFrequencia = {};
      let iconePredominante = '';
      maxFrequencia = 0;

      dia.icones.forEach(icone => {
        if (!iconeFrequencia[icone]) iconeFrequencia[icone] = 0;
        iconeFrequencia[icone]++;

        if (iconeFrequencia[icone] > maxFrequencia) {
          maxFrequencia = iconeFrequencia[icone];
          iconePredominante = icone;
        }
      });

      return {
        data: dia.data,
        diaSemana: dia.diaSemana,
        temperaturaMedia: tempMedia.toFixed(1),
        tempMin: Math.min(...dia.temperaturas).toFixed(1),
        tempMax: Math.max(...dia.temperaturas).toFixed(1),
        climaPredominante: climaPredominante,
        icone: iconePredominante
      };
    });

    return {
      cidade: response.data.city.name,
      pais: response.data.city.country,
      previsao: previsaoFormatada
    };
  } catch (error) {
    // Usar o mesmo tratamento de erro da função anterior
    if (error.response) {
      console.error(`❌ Erro na API (${error.response.status}):`, error.response.data);

      if (error.response.status === 404) {
        throw new Error(`A cidade "${cidade}" não foi encontrada`);
      } else if (error.response.status === 401) {
        throw new Error('Chave de API inválida ou expirada');
      } else {
        throw new Error(`Erro na API: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error('❌ Sem response da API:', error.request);
      throw new Error('Não foi possível contactar o servidor meteorológico');
    } else {
      console.error('❌ Erro na request:', error.message);
      throw new Error(`Erro ao processar a request: ${error.message}`);
    }
  }
}

/**
 * Função principal para demonstrar o uso do cliente REST
 */
async function demonstrarClienteREST() {
  try {
    // Consultar clima atual
    console.log('\n==== CLIMA ATUAL ====\n');
    const climaLisboa = await obterDadosMeteorologicos('Lisboa');
    console.log(JSON.stringify(climaLisboa, null, 2));

    // Consultar previsão para os próximos dias
    console.log('\n==== PREVISÃO PARA OS PRÓXIMOS DIAS ====\n');
    const previsaoPorto = await obterPrevisaoProximosDias('Porto', 3);
    console.log(JSON.stringify(previsaoPorto, null, 2));

    // Demonstrar tratamento de erro
    console.log('\n==== DEMONSTRAÇÃO DE ERRO ====\n');
    try {
      await obterDadosMeteorologicos('CidadeQueNaoExiste123');
    } catch (error) {
      console.log(`⚠️ Erro tratado: ${error.message}`);
    }

  } catch (error) {
    console.error('\n❌ Erro geral na demonstração:', error.message);
  }
}

// Executar demonstração
demonstrarClienteREST();

// Exportar funções para uso em outros módulos
module.exports = {
  obterDadosMeteorologicos,
  obterPrevisaoProximosDias
};
