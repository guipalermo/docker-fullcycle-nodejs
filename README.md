# docker-fullcycle-nodejs

1 - Copie os arquivos .env.example dos diretórios `/` e `/node` para os arquivos .env

```    
cp .env.example .env
```

Com os dois arquivos .env criados. Faça as modificações de acesso ao Banco de Dados.

2 - Para executar o projeto e já realizar o build da aplicação, execute:

```    
docker-compose up -d
```

Após seguir estes passos, a aplicação ficará disponível no endereço `http://localhost:8080/`.
