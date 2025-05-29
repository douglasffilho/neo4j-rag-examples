# Usando RAG e cache de queries com Neo4J

## Objetivo

- Cadastrar documentos no Neo4J programaticamente
- Permitir busca contextual nestes documentos usando AI para gerar as queries para o Neo4J
- Realizar armazenar as queries em forma de vetor no próprio Neo4J para recupera-las por aproximação e delegar menos chamadas à IA na direção de ser mais (estocástico -> deterministico)
