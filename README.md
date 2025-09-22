# 📚 Bookshelf

**Bookshelf** é uma aplicação web moderna para gerenciar sua biblioteca pessoal. Desenvolvida com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**, ela permite adicionar, editar, excluir e filtrar livros de forma intuitiva.

---

## ⚙️ Tecnologias Utilizadas

* **Next.js 13**: Framework React para renderização do lado do servidor e geração de sites estáticos.
* **React**: Biblioteca para construção de interfaces de usuário.
* **TypeScript**: Superset do JavaScript que adiciona tipagem estática.
* **Tailwind CSS**: Framework utilitário para estilização rápida e responsiva.
* **Zustand**: Gerenciamento de estado leve e sem boilerplate.
* **Lucide Icons**: Conjunto de ícones SVG para React.

---

## 🚀 Funcionalidades

* **Cadastro de livros**: Adicione livros à sua biblioteca com título, autor, gênero e status de leitura.
* **Edição de livros**: Atualize as informações de um livro existente.
* **Exclusão de livros**: Remova livros da sua biblioteca.
* **Filtros dinâmicos**: Filtre livros por título, autor, gênero e status de leitura.
* **Feedback visual**: Exibição de mensagens de sucesso e carregamento de forma clara e intuitiva.
* **Visualização de progresso**: Monitora páginas lidas e percentual de leitura.
* **Responsivo**: Funciona em qualquer tamanho de tela.

---

## 📦 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/viitorlimaa/bookshelf.git
cd bookshelf
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Executar o projeto

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testes

Para rodar os testes, utilize:

```bash
pnpm test
```

> Obs: Os testes devem ser implementados conforme a necessidade do projeto.

---

## 🛠️ Estrutura do Projeto

```
📦 bookshelf
├── 📁 app
│   ├── 📁 components
│   ├── 📁 hooks
│   ├── 📁 lib
│   ├── 📁 public
│   ├── 📁 styles
│   ├── 📄 layout.tsx
│   └── 📄 page.tsx
├── 📄 .gitignore
├── 📄 next.config.mjs
├── 📄 package.json
├── 📄 pnpm-lock.yaml
└── 📄 tsconfig.json
```

* **app/components**: Componentes reutilizáveis da interface.
* **app/hooks**: Hooks personalizados.
* **app/lib**: Funções utilitárias e configuração de estado global.
* **app/public**: Arquivos estáticos, como imagens e fontes.
* **app/styles**: Arquivos de estilo global.
* **app/layout.tsx**: Layout principal da aplicação.
* **app/page.tsx**: Página inicial da aplicação.

---

## ⚡ Deploy

Você pode hospedar o **Bookshelf** em qualquer plataforma compatível com **Next.js**, como:

* [Vercel](https://vercel.com/)
* [Netlify](https://www.netlify.com/)
* [Render](https://render.com/)

Para deploy no **Vercel**, basta:

```bash
vercel
```

---
## ✨ Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b minha-feature`).
3. Faça commit das suas alterações (`git commit -m 'Minha feature'`).
4. Faça push para a branch (`git push origin minha-feature`).
5. Abra um Pull Request explicando suas alterações.

---

## 🤝 Contato

Desenvolvido por **Vitor Lima**.
[GitHub](https://github.com/viitorlimaa)
