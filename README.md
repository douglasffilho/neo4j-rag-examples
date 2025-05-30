# Usando RAG e cache de queries com Neo4J

## Objetivo

- Cadastrar documentos textuais como vetores no Neo4J programaticamente
- Permitir busca for similaridade usando Neo4J (os vetores/embeddings fazem o papel de informar o quão próximos são uns dos outros e a query é convertida em vetor para realizar a busca)
- Converter a resposta em algo direto usando Gemma3
- Realizar armazenar as queries em forma de vetor no próprio Neo4J para recupera-las por aproximação e delegar menos chamadas à IA na direção de ser mais (estocástico -> deterministico)
