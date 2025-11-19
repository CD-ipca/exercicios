/**
 * Comparação entre abordagens REST e SOAP
 * Exemplos práticos para Aula 6 - Arquitetura de Web Services
 */

// ==================== REST vs SOAP ====================

// ==================== EXEMPLO REST ====================

// Exemplo de cliente REST usando Fetch API (navegador) ou Axios (Node.js)
async function exemploClienteREST() {
  console.log("======= EXEMPLO CLIENTE REST =======");

  // 1. Obter lista de produtos
  console.log("\nGET /api/produtos - Obter todos os produtos");
  // Construção da URL com parâmetros de consulta
  const url = 'https://api.exemplo.com/api/produtos?categoria=eletronicos&ordenar=preco';

  try {
    // Request HTTP simples
    const resposta = await fetch(url);
    const produtos = await resposta.json();

    console.log("Resposta:", produtos);
    // Exemplo de output: { "produtos": [{"id": 1, "nome": "Smartphone", "preco": 999}, ...] }

    // 2. Obter um produto específico
    console.log("\nGET /api/produtos/1 - Obter produto específico");
    const produtoResposta = await fetch('https://api.exemplo.com/api/produtos/1');
    const produto = await produtoResposta.json();

    console.log("Resposta:", produto);
    // Exemplo de output: {"id": 1, "nome": "Smartphone", "preco": 999}

    // 3. Criar um novo produto
    console.log("\nPOST /api/produtos - Criar novo produto");
    const novoProduto = {
      nome: "Tablet",
      preco: 499,
      categoria: "eletronicos",
      stock: 50
    };

    const criarResposta = await fetch('https://api.exemplo.com/api/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoProduto)
    });

    const produtoCriado = await criarResposta.json();
    console.log("Resposta:", produtoCriado);
    // Exemplo de output: {"id": 4, "nome": "Tablet", "preco": 499, ...}

    // 4. Atualizar um produto
    console.log("\nPUT /api/produtos/4 - Atualizar produto");
    const atualizarResposta = await fetch('https://api.exemplo.com/api/produtos/4', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        preco: 449, stock: 45
      })
    });

    const produtoAtualizado = await atualizarResposta.json();
    console.log("Resposta:", produtoAtualizado);

    // 5. Excluir um produto
    console.log("\nDELETE /api/produtos/4 - Excluir produto");
    const excluirResposta = await fetch('https://api.exemplo.com/api/produtos/4', {
      method: 'DELETE'
    });

    console.log("Status:", excluirResposta.status);
    // Exemplo de output: 204 (No Content)

  } catch (error) {
    console.error("Erro ao comunicar com a API REST:", error);
  }
}

// ==================== EXEMPLO SOAP ====================

// Exemplo de cliente SOAP
async function exemploClienteSOAP() {
  console.log("\n\n======= EXEMPLO CLIENTE SOAP =======");

  try {
    // 1. Definir envelope SOAP para obter lista de produtos
    const envelopeListarProdutos = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:ser="http://servicos.exemplo.com/">
        <soapenv:Header/>
        <soapenv:Body>
          <ser:listarProdutos>
            <categoria>eletronicos</categoria>
            <ordenacao>preco</ordenacao>
          </ser:listarProdutos>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    console.log("\nSOAP Request - Listar Produtos:");
    console.log(envelopeListarProdutos);

    // Exemplo de chamada SOAP usando fetch
    const resposta = await fetch('https://servicos.exemplo.com/ProdutosService', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://servicos.exemplo.com/listarProdutos'
      },
      body: envelopeListarProdutos
    });

    const respostaText = await resposta.text();
    console.log("Resposta SOAP:", respostaText);
    // Exemplo simplificado de resposta
    /*
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Body>
          <ser:listarProdutosResponse>
            <produtos>
              <produto>
                <id>1</id>
                <nome>Smartphone</nome>
                <preco>999</preco>
                <categoria>eletronicos</categoria>
              </produto>
              <!-- Mais produtos aqui -->
            </produtos>
          </ser:listarProdutosResponse>
        </soapenv:Body>
      </soapenv:Envelope>
    */

    // 2. Obter um produto específico
    const envelopeObterProduto = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:ser="http://servicos.exemplo.com/">
        <soapenv:Header/>
        <soapenv:Body>
          <ser:obterProduto>
            <id>1</id>
          </ser:obterProduto>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    console.log("\nSOAP Request - Obter Produto:");
    console.log(envelopeObterProduto);

    // 3. Criar um novo produto
    const envelopeCriarProduto = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:ser="http://servicos.exemplo.com/">
        <soapenv:Header/>
        <soapenv:Body>
          <ser:criarProduto>
            <produto>
              <nome>Tablet</nome>
              <preco>499</preco>
              <categoria>eletronicos</categoria>
              <stock>50</stock>
            </produto>
          </ser:criarProduto>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    console.log("\nSOAP Request - Criar Produto:");
    console.log(envelopeCriarProduto);

  } catch (error) {
    console.error("Erro ao comunicar com o serviço SOAP:", error);
  }
}

// ==================== TABELA COMPARATIVA ====================

function mostrarTabelaComparativa() {
  console.log("\n\n======= COMPARAÇÃO REST vs SOAP =======");

  const tabela = [
    ['Característica', 'REST', 'SOAP'],
    ['Formato de dados', 'Flexível (JSON, XML, etc.)', 'Exclusivamente XML'],
    ['Protocolos', 'HTTP(S) principalmente', 'Múltiplos (HTTP, SMTP, etc.)'],
    ['Contrato', 'Opcional (OpenAPI/Swagger)', 'Obrigatório (WSDL)'],
    ['Estilo de Comunicação', 'Stateless', 'Pode ser stateful ou stateless'],
    ['Caching', 'Suportado nativamente', 'Requer implementação adicional'],
    ['Performance', 'Mais leve, menor overhead', 'Mais pesado, maior overhead'],
    ['Segurança', 'HTTPS, autenticação personalizada', 'WS-Security, mais robusto'],
    ['Uso de Bandwidth', 'Econômico', 'Maior consumo'],
    ['Curva de Aprendizado', 'Mais simples', 'Mais complexo'],
    ['Ferramentas necessárias', 'Simples (curl, Postman)', 'Mais especializadas (SoapUI)']
  ];

  // Exibir tabela formatada
  const colunas = [25, 30, 30];

  // Cabeçalho
  console.log(`┌${'─'.repeat(colunas[0])}┬${'─'.repeat(colunas[1])}┬${'─'.repeat(colunas[2])}┐`);

  // Títulos
  const titulos = tabela[0];
  console.log(`│ ${titulos[0].padEnd(colunas[0] - 2)} │ ${titulos[1].padEnd(colunas[1] - 2)} │ ${titulos[2].padEnd(colunas[2] - 2)} │`);

  console.log(`├${'─'.repeat(colunas[0])}┼${'─'.repeat(colunas[1])}┼${'─'.repeat(colunas[2])}┤`);

  // Linhas de dados
  for (let i = 1; i < tabela.length; i++) {
    const linha = tabela[i];
    console.log(`│ ${linha[0].padEnd(colunas[0] - 2)} │ ${linha[1].padEnd(colunas[1] - 2)} │ ${linha[2].padEnd(colunas[2] - 2)} │`);
  }

  console.log(`└${'─'.repeat(colunas[0])}┴${'─'.repeat(colunas[1])}┴${'─'.repeat(colunas[2])}┘`);
}

// ==================== EXEMPLOS PRÁTICOS DE DOCUMENTAÇÃO ====================

function mostrarDocumentacaoAPI() {
  console.log("\n\n======= DOCUMENTAÇÃO DE APIS =======");

  console.log("\n1. Exemplo de Swagger/OpenAPI (para REST):");
  const swaggerExample = `
  openapi: 3.0.0
  info:
    title: API de Produtos
    version: 1.0.0
    description: API para gerenciamento de produtos
  paths:
    /api/produtos:
      get:
        summary: Listar todos os produtos
        parameters:
          - name: categoria
            in: query
            schema:
              type: string
          - name: ordenar
            in: query
            schema:
              type: string
        responses:
          '200':
            description: Lista de produtos
            content:
              application/json:
                schema:
                  type: array
                  items:
                    $ref: '#/components/schemas/Produto'
      post:
        summary: Criar um novo produto
        requestBody:
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NovoProduto'
        responses:
          '201':
            description: Produto criado
  components:
    schemas:
      Produto:
        type: object
        properties:
          id:
            type: integer
          nome:
            type: string
          preco:
            type: number
  `;
  console.log(swaggerExample);

  console.log("\n2. Exemplo de WSDL (para SOAP):");
  const wsdlExample = `
  <?xml version="1.0" encoding="UTF-8"?>
  <definitions name="ProdutosService"
    targetNamespace="http://servicos.exemplo.com/"
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="http://servicos.exemplo.com/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    
    <types>
      <xsd:schema targetNamespace="http://servicos.exemplo.com/">
        <xsd:element name="Produto">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="id" type="xsd:int"/>
              <xsd:element name="nome" type="xsd:string"/>
              <xsd:element name="preco" type="xsd:decimal"/>
            </xsd:sequence>
          </xsd:complexType>
        </xsd:element>
        
        <xsd:element name="listarProdutosRequest">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="categoria" type="xsd:string" minOccurs="0"/>
              <xsd:element name="ordenacao" type="xsd:string" minOccurs="0"/>
            </xsd:sequence>
          </xsd:complexType>
        </xsd:element>
        
        <xsd:element name="listarProdutosResponse">
          <xsd:complexType>
            <xsd:sequence>
              <xsd:element name="produtos" minOccurs="0" maxOccurs="unbounded" 
                           type="tns:Produto"/>
            </xsd:sequence>
          </xsd:complexType>
        </xsd:element>
      </xsd:schema>
    </types>
    
    <message name="listarProdutosRequest">
      <part name="parameters" element="tns:listarProdutosRequest"/>
    </message>
    <message name="listarProdutosResponse">
      <part name="parameters" element="tns:listarProdutosResponse"/>
    </message>
    
    <portType name="ProdutosPortType">
      <operation name="listarProdutos">
        <input message="tns:listarProdutosRequest"/>
        <output message="tns:listarProdutosResponse"/>
      </operation>
    </portType>
    
    <binding name="ProdutosBinding" type="tns:ProdutosPortType">
      <soap:binding style="document" 
                   transport="http://schemas.xmlsoap.org/soap/http"/>
      <operation name="listarProdutos">
        <soap:operation soapAction="http://servicos.exemplo.com/listarProdutos"/>
        <input><soap:body use="literal"/></input>
        <output><soap:body use="literal"/></output>
      </operation>
    </binding>
    
    <service name="ProdutosService">
      <port name="ProdutosPort" binding="tns:ProdutosBinding">
        <soap:address location="https://servicos.exemplo.com/ProdutosService"/>
      </port>
    </service>
  </definitions>
  `;
  console.log(wsdlExample);
}

// ==================== EXECUÇÃO DOS EXEMPLOS ====================

// Função para demonstrar todos os exemplos
function executarDemonstracoes() {
  console.log("=================================================");
  console.log("   DEMONSTRAÇÃO DE REST vs SOAP - AULA 6");
  console.log("=================================================");

  // Mostrar tabela comparativa
  mostrarTabelaComparativa();

  // Demonstrar exemplos de clientes
  exemploClienteREST();
  exemploClienteSOAP();

  // Mostrar exemplos de documentação
  mostrarDocumentacaoAPI();

  console.log("\n\n=================================================");
  console.log("  CONCLUSÃO: Escolha baseada nas necessidades  ");
  console.log("=================================================");
  console.log(`
  ✅ REST: Mais simples, leve e adequado para a maioria das aplicações web modernas,
     especialmente quando performance e simplicidade são importantes.
     
  ✅ SOAP: Mais robusto, com melhor padronização e segurança integrada,
     adequado para sistemas corporativos complexos ou legados que exigem
     garantias formais de comunicação.
  `);
}

// Executar demonstrações
// Descomente para testar: executarDemonstracoes();

// Exportar funções
module.exports = {
  exemploClienteREST,
  exemploClienteSOAP,
  mostrarTabelaComparativa,
  mostrarDocumentacaoAPI,
  executarDemonstracoes
};
