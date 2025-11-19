# Aula 6 - Arquitetura de Web Services
## Exercícios Práticos

### 📚 Objetivos dos Exercícios
- Aplicar conceitos fundamentais de Web Services
- Praticar a comunicação com APIs REST
- Desenvolver um serviço web simples
- Explorar diferentes formatos de dados (JSON, XML)
- Compreender a diferença entre SOAP e REST na prática


#### 2. Instalação de Pacotes Essenciais
```bash
# Criar pasta para os exercícios
mkdir aula06-webservices
cd aula06-webservices

# Inicializar package.json
npm init -y

# Instalar dependências
npm install axios express nodemon
npm install -D jest

# Atualizar package.json para incluir scripts
```

Editar o `package.json` para adicionar scripts úteis:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

#### 3. Ferramentas para Testes de API
- **Opção 1: Instalar Postman** - [Download Postman](https://www.postman.com/downloads/)
- **Opção 2: Extensão Thunder Client** para VS Code
- **Opção 3: Utilizar cURL na linha de comando**

**✅ Checkpoint:** Todos devem ter o ambiente configurado antes de prosseguir.

---


## 🔍 Introdução a WSDL e SOAP

### Exercício: Analisando e Consumindo um Serviço SOAP

#### Analisar um arquivo WSDL

Examinar um arquivo WSDL de exemplo `temperatura.wsdl`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions name="TemperatureService"
  targetNamespace="http://exemplo.com/servicos/temperatura"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://exemplo.com/servicos/temperatura"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">

  <!-- Definição dos tipos de dados -->
  <types>
    <xsd:schema targetNamespace="http://exemplo.com/servicos/temperatura">
      <xsd:element name="ConverterCelsiusParaFahrenheitRequest">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="temperaturaCelsius" type="xsd:double"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
      <xsd:element name="ConverterCelsiusParaFahrenheitResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="temperaturaFahrenheit" type="xsd:double"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>
    </xsd:schema>
  </types>

  <!-- Definição das mensagens -->
  <message name="ConverterCelsiusParaFahrenheitInput">
    <part name="parameters" element="tns:ConverterCelsiusParaFahrenheitRequest"/>
  </message>
  <message name="ConverterCelsiusParaFahrenheitOutput">
    <part name="parameters" element="tns:ConverterCelsiusParaFahrenheitResponse"/>
  </message>

  <!-- Definição do portType (interface) -->
  <portType name="TemperaturaPortType">
    <operation name="ConverterCelsiusParaFahrenheit">
      <input message="tns:ConverterCelsiusParaFahrenheitInput"/>
      <output message="tns:ConverterCelsiusParaFahrenheitOutput"/>
    </operation>
  </portType>

  <!-- Definição do binding -->
  <binding name="TemperaturaBinding" type="tns:TemperaturaPortType">
    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="ConverterCelsiusParaFahrenheit">
      <soap:operation soapAction="http://exemplo.com/servicos/temperatura/ConverterCelsiusParaFahrenheit"/>
      <input>
        <soap:body use="literal"/>
      </input>
      <output>
        <soap:body use="literal"/>
      </output>
    </operation>
  </binding>

  <!-- Definição do serviço -->
  <service name="TemperaturaService">
    <port name="TemperaturaPort" binding="tns:TemperaturaBinding">
      <soap:address location="http://exemplo.com/servicos/temperatura"/>
    </port>
  </service>
</definitions>
```

#### Analisar uma mensagem SOAP de request e response

Exemplo de request SOAP:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope 
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="http://exemplo.com/servicos/temperatura">
  <SOAP-ENV:Body>
    <ns1:ConverterCelsiusParaFahrenheitRequest>
      <ns1:temperaturaCelsius>25.0</ns1:temperaturaCelsius>
    </ns1:ConverterCelsiusParaFahrenheitRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

Exemplo de resposta SOAP:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope 
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="http://exemplo.com/servicos/temperatura">
  <SOAP-ENV:Body>
    <ns1:ConverterCelsiusParaFahrenheitResponse>
      <ns1:temperaturaFahrenheit>77.0</ns1:temperaturaFahrenheit>
    </ns1:ConverterCelsiusParaFahrenheitResponse>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
```

#### Implementar um cliente SOAP básico

```javascript
// soap-client.js
const axios = require('axios');
const fs = require('fs');

// Função para enviar uma request SOAP
async function chamarServicoSOAP(temperaturaCelsius) {
  // XML para a request SOAP
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope 
  xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ns1="http://exemplo.com/servicos/temperatura">
  <SOAP-ENV:Body>
    <ns1:ConverterCelsiusParaFahrenheitRequest>
      <ns1:temperaturaCelsius>${temperaturaCelsius}</ns1:temperaturaCelsius>
    </ns1:ConverterCelsiusParaFahrenheitRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>`;

  try {
    // Serviço SOAP público para testes
    const url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso';
    
    const response = await axios.post(url, soapEnvelope, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://exemplo.com/servicos/temperatura/ConverterCelsiusParaFahrenheit'
      }
    });

    console.log('Resposta completa:');
    console.log(response.data);
    
    // TODO: Extrair a temperatura em Fahrenheit da resposta XML
    // DICA: Pode usar uma biblioteca como 'xml2js' para parsing
    
    return {
      celsius: temperaturaCelsius,
      fahrenheit: 'EXTRAIR DA RESPOSTA'
    };
  } catch (error) {
    console.error('Erro ao chamar serviço SOAP:', error.message);
    throw new Error('Falha ao converter temperatura');
  }
}

// Função para testar
async function testarSOAP() {
  try {
    const resultado = await chamarServicoSOAP(25.0);
    console.log('Resultado da conversão:', resultado);
  } catch (error) {
    console.error(error.message);
  }
}

testarSOAP();
```

### 📝 Questões para Discussão
1. Quais as principais diferenças estruturais entre SOAP e REST?
2. Em quais cenários SOAP seria preferível a REST?
3. Como o WSDL facilita a integração entre sistemas?

---

## 📚 Trabalho para Casa

### 1. Pesquisa Aprofundada
Escolher um dos temas e preparar um resumo curto (máx. 1 página):
- GraphQL vs REST
- Autenticação e segurança em Web Services
- Estratégias de versionamento de APIs
- Sistemas de mensageria e sua relação com Web Services

---

## 🔗 Recursos Adicionais

### Documentação Oficial
- [MDN Web Docs: HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [RESTful API Design](https://restfulapi.net/)
- [W3C SOAP Specifications](https://www.w3.org/TR/soap/)

### Livros Recomendados
- "RESTful Web APIs" - Leonard Richardson, Mike Amundsen
- "Building Microservices" - Sam Newman
- "Web Services Essentials" - Ethan Cerami

### Tutoriais e Cursos
- [RESTful Web Services Tutorial](https://www.tutorialspoint.com/restful/)
- [Understanding SOAP](https://www.w3schools.com/xml/xml_soap.asp)

