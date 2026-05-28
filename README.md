# Cadastro de Tarefas — React + JSON Server

Aplicação desenvolvida em **React com Vite** que consome uma API fake criada com **JSON Server**, permitindo listar e cadastrar tarefas via requisições HTTP (`fetch`).

## Tecnologias

- React 19
- Vite
- JSON Server
- Fetch API
- Hooks: `useState` e `useEffect`

## Requisitos atendidos

- Projeto React + Vite
- Arquivo `db.json` configurado
- JSON Server rodando localmente
- Listagem de dados com `fetch`
- Uso de `useState` e `useEffect`
- Formulário com 3 campos (título, descrição, prioridade)
- Cadastro via POST
- Atualização da lista após o cadastro
- Interface organizada

## Como executar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar a API (JSON Server)

Em um terminal:

```bash
npm run api
```

A API ficará disponível em: `http://localhost:3000/tarefas`

### 3. Iniciar o frontend (React)

Em outro terminal:

```bash
npm run dev
```

Acesse o endereço exibido no terminal (geralmente `http://localhost:5173`).

## Estrutura da API

| Método | Endpoint              | Descrição              |
|--------|-----------------------|------------------------|
| GET    | `/tarefas`            | Lista todas as tarefas |
| POST   | `/tarefas`            | Cadastra nova tarefa   |

### Exemplo de objeto tarefa

```json
{
  "id": "1",
  "titulo": "Estudar React",
  "descricao": "Revisar hooks useState e useEffect",
  "prioridade": "alta",
  "concluida": false
}
```

## Publicação no GitHub

1. Crie um repositório no GitHub.
2. Na pasta do projeto, execute:

```bash
git init
git add .
git commit -m "feat: aplicação de cadastro de tarefas com React e JSON Server"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

3. Envie o link do repositório na entrega da atividade.

## Autor

Desenvolvimento Web Front-End — UNI
