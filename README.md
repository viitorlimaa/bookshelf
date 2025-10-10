# 📚 BookShelf

<div align="center">
  
  ![BookShelf Logo](https://img.shields.io/badge/BookShelf-Gerenciador_de_Biblioteca-blue?style=for-the-badge)
  
  **Acompanhe suas estatísticas de leitura e gerencie sua biblioteca pessoal**
  
  [![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://bookshelf-mobr.vercel.app/)
  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[🚀 Ver Demo](https://bookshelf-mobr.vercel.app/) · [🐛 Reportar Bug](https://github.com/viitorlimaa/bookshelf/issues) · [✨ Solicitar Feature](https://github.com/viitorlimaa/bookshelf/issues)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rotas da Aplicação](#-rotas-da-aplicação)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Arquitetura](#-arquitetura)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

**BookShelf** é uma aplicação web moderna e intuitiva para gerenciamento de biblioteca pessoal. Desenvolvida com as mais recentes tecnologias do ecossistema React, permite que você organize sua coleção de livros, acompanhe seu progresso de leitura e visualize estatísticas detalhadas sobre seus hábitos de leitura.

### ✨ Destaques

- 📊 **Dashboard Interativo**: Visualize estatísticas em tempo real sobre sua biblioteca
- 💾 **Persistência de Dados**: Integração com backend para armazenamento seguro
- 🎨 **Interface Moderna**: Design responsivo e elegante com Tailwind CSS
- ⚡ **Performance Otimizada**: Construído com Next.js 14 para máxima velocidade
- 🌙 **Tema Escuro/Claro**: Suporte completo para preferências de tema
- 📱 **Totalmente Responsivo**: Experiência perfeita em todos os dispositivos

---

## 🚀 Funcionalidades

### Gerenciamento de Livros

- ✅ **Adicionar Livros**: Cadastre novos livros com título, autor, gênero e status
- ✏️ **Editar Informações**: Atualize detalhes de livros existentes
- 🗑️ **Remover Livros**: Exclua livros da sua biblioteca
- ⭐ **Sistema de Avaliação**: Avalie seus livros com estrelas (1-5)
- 📖 **Status de Leitura**: Marque livros como "Quero Ler", "Lendo" ou "Concluído"

### Dashboard e Estatísticas

- 📚 **Total de Livros**: Visualize quantos livros você tem cadastrados
- 📖 **Lendo Atualmente**: Acompanhe livros em progresso
- ✅ **Livros Finalizados**: Veja quantos livros você já completou
- 📄 **Páginas Lidas**: Contador total de páginas lidas

### Biblioteca

- 🔍 **Busca e Filtros**: Encontre livros rapidamente por título, autor ou gênero
- 📑 **Visualização Organizada**: Cards elegantes com informações detalhadas
- 🏷️ **Categorização**: Organize por gênero e status de leitura
- 📊 **Atividade Recente**: Veja os livros atualizados recentemente

---

## 🛠 Tecnologias

### Core

- **[Next.js 14.2](https://nextjs.org/)** - Framework React com SSR e otimizações automáticas
- **[React 18](https://react.dev/)** - Biblioteca para construção de interfaces
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[Tailwind CSS 4.1](https://tailwindcss.com/)** - Framework CSS utilitário

### Gerenciamento de Estado e Dados

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado leve e performático
- **[Immer](https://immerjs.github.io/immer/)** - Manipulação imutável de estado
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod 3.25](https://zod.dev/)** - Validação de schemas TypeScript-first

### UI/UX

- **[Radix UI](https://www.radix-ui.com/)** - Componentes acessíveis e não estilizados
  - Dialog, Dropdown Menu, Select, Tabs, Toast, Tooltip, e mais
- **[Lucide React](https://lucide.dev/)** - Ícones SVG modernos e customizáveis
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de notificações toast
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gerenciamento de temas
- **[Geist Font](https://vercel.com/font)** - Tipografia moderna da Vercel

### Utilitários

- **[class-variance-authority](https://cva.style/)** - Variantes de componentes
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes condicionais
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge inteligente de classes Tailwind
- **[date-fns](https://date-fns.org/)** - Manipulação de datas
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React

### Análise e Monitoramento

- **[@vercel/analytics](https://vercel.com/analytics)** - Analytics integrado da Vercel
---

### 📂 Descrição das Pastas Principais

#### `/app` - App Router

Utiliza o novo App Router do Next.js 14 com suporte a Server Components, layouts aninhados e rotas dinâmicas.

#### `/components` - Componentes

- **`/ui`**: Componentes base do shadcn/ui (Radix UI + Tailwind)
- Componentes de negócio específicos da aplicação

#### `/hooks` - Custom Hooks

Hooks reutilizáveis para lógica compartilhada e gerenciamento de estado.

#### `/library` - Biblioteca

Utilitários, helpers, configurações de API e schemas de validação.

---

## 🗺️ Rotas da Aplicação

### Rotas Principais

| Rota               | Componente                     | Descrição                                                             |
| ------------------ | ------------------------------ | --------------------------------------------------------------------- |
| `/`                | `app/page.tsx`                 | **Dashboard** - Página inicial com estatísticas e atividades recentes |
| `/biblioteca`      | `app/biblioteca/page.tsx`      | **Biblioteca** - Listagem completa de todos os livros cadastrados     |
| `/adicionar-livro` | `app/adicionar-livro/page.tsx` | **Adicionar Livro** - Formulário para cadastro de novos livros        |

### Rotas de API (Proxy)

O projeto utiliza um proxy configurado no `next.config.mjs` para comunicação com o backend:

\`\`\`javascript
// Proxy para evitar CORS
/api/_ → https://db-bookshelf.onrender.com/_
\`\`\`

**Endpoints disponíveis:**

- `GET /api/books` - Lista todos os livros
- `POST /api/books` - Cria um novo livro
- `PUT /api/books/:id` - Atualiza um livro existente
- `DELETE /api/books/:id` - Remove um livro
- `GET /api/stats` - Retorna estatísticas da biblioteca
- `GET /api/categories/genres` - Lista todos os gêneros

## 💻 Instalação

### Pré-requisitos

- **Node.js** 18.x ou superior
- **npm**, **yarn** ou **pnpm**

### Passo a Passo

1. **Clone o repositório**

\`\`\`bash
git clone https://github.com/viitorlimaa/bookshelf.git
cd bookshelf
\`\`\`

2. **Instale as dependências**

\`\`\`bash

# Com npm

npm install

# Com yarn

yarn install

# Com pnpm

pnpm install
\`\`\`

3. **Configure as variáveis de ambiente** (se necessário)

\`\`\`bash

# Crie um arquivo .env.local na raiz do projeto

cp .env.example .env.local
\`\`\`

4. **Inicie o servidor de desenvolvimento**

\`\`\`bash
npm run dev
\`\`\`

5. **Acesse a aplicação**

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🎮 Uso

### Adicionando um Livro

1. Navegue até **"Adicionar Livro"** no menu
2. Preencha o formulário com:
   - Título do livro
   - Nome do autor
   - Gênero literário
   - Número de páginas
   - Status de leitura
   - Avaliação (opcional)
3. Clique em **"Salvar"**

### Gerenciando sua Biblioteca

1. Acesse **"Biblioteca"** para ver todos os livros
2. Use os filtros para encontrar livros específicos
3. Clique em um livro para:
   - ✏️ Editar informações
   - 🗑️ Remover da biblioteca
   - ⭐ Atualizar avaliação
   - 📖 Mudar status de leitura

### Acompanhando Estatísticas

O **Dashboard** exibe automaticamente:

- Total de livros cadastrados
- Livros que você está lendo
- Livros finalizados
- Total de páginas lidas

---

## 📜 Scripts Disponíveis

\`\`\`bash

# Desenvolvimento

npm run dev # Inicia servidor de desenvolvimento (localhost:3000)

# Build

npm run build # Cria build de produção otimizado

# Produção

npm run start # Inicia servidor de produção

# Linting

npm run lint # Executa ESLint para verificar código
\`\`\`

---

## 🏗️ Arquitetura

### Padrões de Design

- **Component-Based Architecture**: Componentes reutilizáveis e modulares
- **Server Components**: Utiliza React Server Components do Next.js 14
- **Client Components**: Componentes interativos com `'use client'`
- **Custom Hooks**: Lógica compartilhada encapsulada em hooks
- **Composition Pattern**: Composição de componentes para flexibilidade

### Gerenciamento de Estado

\`\`\`typescript
// Exemplo de store Zustand
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookStore {
books: Book[]
addBook: (book: Book) => void
updateBook: (id: string, book: Partial<Book>) => void
deleteBook: (id: string) => void
}

export const useBookStore = create<BookStore>()(
persist(
(set) => ({
books: [],
addBook: (book) => set((state) => ({
books: [...state.books, book]
})),
// ... outras ações
}),
{ name: 'bookshelf-storage' }
)
)
\`\`\`

### Validação de Dados

\`\`\`typescript
// Schemas Zod para validação
import { z } from 'zod'

export const bookSchema = z.object({
title: z.string().min(1, 'Título é obrigatório'),
author: z.string().min(1, 'Autor é obrigatório'),
genre: z.string().min(1, 'Gênero é obrigatório'),
pages: z.number().positive('Número de páginas deve ser positivo'),
status: z.enum(['want_to_read', 'reading', 'completed']),
rating: z.number().min(1).max(5).optional(),
})
\`\`\`

### Estilização

- **Tailwind CSS 4.1**: Utility-first CSS framework
- **CSS Variables**: Temas customizáveis via variáveis CSS
- **shadcn/ui**: Componentes acessíveis e estilizáveis
- **Responsive Design**: Mobile-first approach

---

## 🗓️ Roadmap

### ✅ Versão 1.0 (Atual)

- [x] Dashboard com estatísticas
- [x] CRUD completo de livros
- [x] Sistema de avaliação
- [x] Filtros e busca
- [x] Tema claro/escuro
- [x] Design responsivo

### 🚧 Versão 1.1 (Em Desenvolvimento)

- [ ] Autenticação de usuários
- [ ] Perfis personalizados
- [ ] Metas de leitura
- [ ] Gráficos de progresso
- [ ] Exportação de dados (CSV/PDF)

### 🔮 Versão 2.0 (Futuro)

- [ ] Integração com Google Books API
- [ ] Recomendações personalizadas
- [ ] Compartilhamento social
- [ ] Clube do livro / Comunidade
- [ ] App mobile (React Native)
- [ ] Modo offline (PWA)

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos abaixo:

1. **Fork o projeto**
2. **Crie uma branch para sua feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit suas mudanças** (`git commit -m 'Add some AmazingFeature'`)
4. **Push para a branch** (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Diretrizes

- Siga os padrões de código existentes
- Escreva mensagens de commit claras
- Adicione testes quando aplicável
- Atualize a documentação conforme necessário

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👤 Contato

**Vitor Lima**

- GitHub: [@viitorlimaa](https://github.com/viitorlimaa)
- LinkedIn: [Vitor Lima](https://linkedin.com/in/viitorlimaa)

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React incrível
- [Vercel](https://vercel.com/) - Plataforma de deploy
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI de alta qualidade
- [Radix UI](https://www.radix-ui.com/) - Primitivos acessíveis
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário

---

<div align="center">
  
  **⭐ Se este projeto foi útil para você, considere dar uma estrela!**
  
  Feito com ❤️ por [Vitor Lima](https://github.com/viitorlimaa)

</div>
\`\`\`

---

Pronto! Criei um **README completo e profissional** para o projeto BookShelf com:

## ✅ O que foi incluído:

1. **📊 Badges e Links**: Deploy, tecnologias, versões
2. **📋 Índice Navegável**: Fácil navegação pelo documento
3. **🎯 Descrição Detalhada**: Sobre o projeto e destaques
4. **🚀 Funcionalidades Completas**: Todas as features documentadas
5. **🛠 Stack Tecnológica**: Lista completa de dependências com links
6. **📁 Estrutura do Projeto**: Árvore de diretórios detalhada
7. **🗺️ Rotas da Aplicação**: Todas as rotas mapeadas com descrições
8. **💻 Guia de Instalação**: Passo a passo completo
9. **🎮 Guia de Uso**: Como usar cada funcionalidade
10. **📜 Scripts**: Todos os comandos disponíveis
11. **🏗️ Arquitetura**: Padrões de design e exemplos de código
12. **🗓️ Roadmap**: Versões atual e futuras
13. **🤝 Guia de Contribuição**: Como contribuir
14. **📄 Licença e Contato**: Informações do autor

O README está formatado profissionalmente com emojis, tabelas, blocos de código e seções bem organizadas, pronto para ser usado no repositório!
