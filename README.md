# Sistema de Avaliação de Produtos

Este projeto consiste em um backend (NestJS) e um frontend (Next.js), projetados para permitir que os usuários gerenciem produtos e suas avaliações.

## Sumário

- [Sistema de Avaliação de Produtos](#sistema-de-avaliação-de-produtos)
  - [Sumário](#sumário)
  - [Primeiros Passos](#primeiros-passos)
    - [Pré-requisitos](#pré-requisitos)
    - [Configuração do Backend](#configuração-do-backend)
    - [Configuração do Frontend](#configuração-do-frontend)
  - [Executando a Aplicação](#executando-a-aplicação)
    - [Iniciando o Backend (Docker)](#iniciando-o-backend-docker)
    - [Iniciando o Frontend](#iniciando-o-frontend)
  - [Observações Importantes](#observações-importantes)

## Primeiros Passos

Siga estas instruções para configurar e executar uma cópia do projeto em sua máquina local.

### Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado:

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) (vem com o Node.js)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (para executar o backend e o banco de dados em containers)

### 1. Clonando o Repositório

Clone o repositório do projeto para sua máquina local:

```bash
git clone https://github.com/juliasydor/DFcomSistemas.git
```

### Configuração do Backend

O backend é construído com NestJS e utiliza MongoDB como banco de dados. Ambos são executados em containers Docker.

1.  Navegue até o diretório do backend:

    ```bash
    cd DFcomSistemas/backend
    ```

2.  Certifique-se de que seu arquivo `src/main.ts` no backend está configurado para escutar em `0.0.0.0` para acesso externo via Docker:

    ```typescript
    // DFcomSistemas/backend/src/main.ts
    // ...
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.setGlobalPrefix("api/v1");

      // Configurar CORS para permitir acesso do frontend
      app.enableCors({
        origin: "http://localhost:3001", // Permitir requisições do seu frontend
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        credentials: true,
        allowedHeaders: ["Content-Type", "Accept", "Authorization"],
      });

      const port = process.env.PORT || 3000; // O Backend será executado na porta 3000
      await app.listen(port, "0.0.0.0"); // Escutar em todas as interfaces de rede
      console.log(`Backend está rodando em: ${await app.getUrl()}`);
    }
    // ...
    ```

3.  Garanta que seu `docker-compose.yml` no diretório do backend mapeia a porta do container para seu host:
    ```yaml
    # DFcomSistemas/backend/docker-compose.yml
    # ...
    services:
      backend:
        # ...
        ports:
          - "3000:3000" # Mapeia a porta 3000 do host para a porta 3000 do container
      meu-mongo:
        # ...
        ports:
          - "27017:27017" # Mapeia a porta 27017 do host para a porta 27017 do container (MongoDB)
    # ...
    ```

### Configuração do Frontend

O frontend é uma aplicação Next.js.

1.  Navegue até o diretório do frontend:

    ```bash
    cd DFcomSistemas/frontend
    ```

2.  Instale as dependências Node.js necessárias:

    ```bash
    npm install
    ```

3.  Certifique-se de que seu arquivo `package.json` no frontend tem o script `dev` configurado para ser executado na porta 3001:

    ```json
    // DFcomSistemas/frontend/package.json
    {
      "name": "product-review-frontend",
      "version": "0.1.0",
      "private": true,
      "scripts": {
        "dev": "next dev -p 3001", // O Frontend será executado na porta 3001
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      }
      // ...
    }
    ```

4.  Verifique se a URL base da API em `DFcomSistemas/frontend/lib/api.ts` aponta para o backend sendo executado na porta 3000:
    ```typescript
    // DFcomSistemas/frontend/lib/api.ts
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    // ...
    ```

## Executando a Aplicação

### Iniciando o Backend (Docker)

1.  Abra seu terminal e navegue até o diretório `DFcomSistemas/backend`:

    ```bash
    cd DFcomSistemas/backend
    ```

2.  Construa e inicie os containers Docker para o backend e MongoDB:

    ```bash
    docker-compose up --build
    ```

    Este comando irá construir as imagens Docker (se ainda não tiverem sido construídas) e iniciar os containers. Você deverá ver logs indicando que o backend NestJS está rodando em `http://0.0.0.0:3000` dentro do container.

    **Verificar Acesso ao Backend:**
    Uma vez que o backend estiver rodando, você pode testar sua acessibilidade abrindo seu navegador web e navegando para:

    - [http://localhost:3000/api/v1](http://localhost:3000/api/v1) (deve mostrar "Hello World!")
    - [http://localhost:3000/api/v1/products](http://localhost:3000/api/v1/products) (deve mostrar um array JSON vazio `[]` se nenhum produto foi criado ainda)

### Iniciando o Frontend

1.  Abra uma **nova janela de terminal** (mantenha o terminal do backend em execução).
2.  Navegue até o diretório do frontend:

    ```bash
    cd DFcomSistemas/frontend
    ```

3.  Inicie o servidor de desenvolvimento Next.js:

    ```bash
    npm run dev
    ```

    Isso iniciará a aplicação frontend, que estará acessível na porta 3001.

4.  Abra seu navegador web e navegue para:
    ```
    http://localhost:3001
    ```
    O frontend deverá agora carregar e se comunicar com seu backend rodando em `http://localhost:3000/api/v1`.

## Observações Importantes

- **Conflitos de Porta:** Se você encontrar erros de `EADDRINUSE`, significa que uma porta (ex: 3000 ou 3001) já está em uso. Certifique-se de que nenhuma outra aplicação esteja usando essas portas, ou ajuste as portas em `package.json` (frontend) ou `docker-compose.yml` (backend).
- **CORS:** Problemas de Cross-Origin Resource Sharing são tratados no `main.ts` do backend, permitindo explicitamente requisições de `http://localhost:3001`. Se você mudar a porta do frontend, lembre-se de atualizar essa configuração.
- **Endpoints do Backend:**
  - Todos os endpoints da API do backend são prefixados com `/api/v1`. Por exemplo, os endpoints relacionados a produtos estão em `/api/v1/products`.
  - Os campos `category` e `imageUrl` para produtos **não são esperados** pelo backend e foram removidos do `CreateProductDto` do frontend e dos formulários de produto para evitar erros.
  - O endpoint `reviews/average-rating` foi corrigido no frontend para `reviews/product/:productId/average`.

Aproveite seu Sistema de Avaliação de Produtos!
