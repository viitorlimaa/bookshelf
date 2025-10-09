📚 Bookshelf: Seu Gerenciador Pessoal de Leitura

**Deploy:** https://bookshelf-mobr.vercel.app/

✨ Destaques do Projeto (Highlights)
O Bookshelf é uma aplicação web moderna, rápida e otimizada construída com o framework Next.js, desenhada para gerenciar sua coleção pessoal de livros de maneira intuitiva e persistente. Ele se destaca pela performance de carregamento e pela experiência de usuário limpa e focada.    

⚡ Performance Otimizada: Utiliza o Next.js para renderização eficiente e o componente nativo <Image> para otimizar capas de livros, garantindo alta pontuação nos Core Web Vitals.    

💾 Persistência de Dados: Sua coleção de livros é salva localmente no navegador (Local Storage), garantindo que seus dados permaneçam intactos após o refresh ou reabertura da sessão.    

🏷️ Gerenciamento de Status: Permite categorizar livros como "Lidos" ou "Não Lidos" com facilidade, facilitando o acompanhamento de suas metas de leitura.

🎨 Design Responsivo e Moderno: Interface de usuário construída para ser acessível e responsiva em todos os dispositivos.


🚀 Built With (Tecnologias Principais)
Este projeto foi desenvolvido utilizando uma stack de tecnologias modernas e amplamente adotadas no ecossistema React, seguindo as melhores práticas de desenvolvimento Front-end.    

Categoria	Tecnologia	Justificativa
Framework Principal	Next.js (React)	Habilita Server-Side Rendering (SSR) e otimizações automáticas.
Gerenciamento de Estado	Zustand (Recomendado para Escalabilidade)	
Solução leve e de baixo boilerplate para gerenciamento reativo do estado global. 

Linguagem	JavaScript/TypeScript (Recomendado)	Tipagem opcional para maior robustez e manutenibilidade do código.
Hospedagem	Vercel	
Plataforma ideal para deploys de aplicações Next.js. 


⚙️ Getting Started (Instalação e Configuração Local)
Siga estas instruções simples para obter uma cópia local do projeto em funcionamento.    

Pré-requisitos (Prerequisites)
Para rodar o projeto localmente, você precisará ter o Node.js (versão 18+) e o gerenciador de pacotes npm ou Yarn instalados em sua máquina.    

Bash

# Verifique a versão do Node
node -v 

# Instale o npm mais recente globalmente (se necessário)
npm install npm@latest -g 
Instalação (Installation)
Clone o repositório:

Bash

git clone [https://github.com/viitorlimaa/bookshelf.git](https://github.com/viitorlimaa/bookshelf.git)
Entre no diretório do projeto:

Bash

cd bookshelf
Instale as dependências NPM:

Bash

# npm install 

Inicie o servidor de desenvolvimento:

Bash

# npm run dev

A aplicação estará acessível em http://localhost:3000.

(back to top)

📖 Uso e Funcionalidades (Usage)
O Bookshelf foi desenhado para ser um catálogo simples e eficiente para gerenciar sua biblioteca pessoal.    

Funcionalidades Principais
O aplicativo permite ao usuário manipular sua coleção de livros, garantindo que os dados sejam salvos localmente no navegador (persistência via Local Storage) e reativos dentro da sessão.

Adicionar Livro: Cadastro de novos itens na estante, incluindo título, autor e opcionalmente, uma capa.    

Gerenciamento de Status: Alternar entre "Lido" e "Não Lido" (ou "Em Progresso"), o que é vital para rastrear o progresso da leitura.    

Visualização e Filtragem: Exibição da lista completa, com capacidade de filtrar por status (Lido vs. Não Lido) e realizar buscas por título ou autor.

Edição e Remoção: Funcionalidades básicas de CRUD (Criar, Ler, Atualizar, Deletar) para gerenciar o catálogo.

(back to top)

🗺️ Roadmap de Desenvolvimento (Future Features)
O projeto tem um grande potencial para se tornar uma solução robusta e escalável. O roadmap a seguir descreve as melhorias propostas (Roadmap 1.x) para elevar o projeto ao nível de produção.    

Melhorias Prioritárias (Short-Term)
Refatoração de Estado: Migração completa para Zustand para gerenciar o estado global de forma mais eficiente, garantindo que a lógica de persistência no Local Storage seja encapsulada dentro da store.    

Integração de Testes: Implementação de testes de unidade (Jest/Vitest) para a lógica de manipulação de livros (serviços) e testes de componentes (Testing Library).

Otimização de Imagens Remotas: Configuração do next.config.js com remotePatterns e garantia do uso correto da propriedade priority no componente <Image> para as capas de livros.    

Features de Longo Prazo (Long-Term)
Integração com API Externa: Conectar-se a APIs públicas (ex: Google Books API) para permitir a busca, autocompletar e importação de dados e capas de livros, eliminando a entrada manual de dados.

Autenticação e Nuvem: Implementação de autenticação de usuário (ex: NextAuth) e migração da persistência de Local Storage para um banco de dados hospedado (ex: Supabase ou Firebase) para acesso multiplataforma.    

🤝 Contribuição (Contributing)
Contribuições tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer é extremamente apreciada.    

Se você tem sugestões para melhorar o projeto, por favor, abra uma issue com a tag "enhancement". Você também pode contribuir diretamente via Pull Request (PR):    

Faça um Fork do Projeto.

Crie sua Feature Branch (git checkout -b feature/AmazingFeature).

Commit suas Mudanças (git commit -m 'feat: Add some AmazingFeature').

Faça o Push para a Branch (git push origin feature/AmazingFeature).

Abra um Pull Request.

Consulte o arquivo CONTRIBUTING.md (se este for criado) para diretrizes detalhadas sobre o padrão de commits e estilo de código.

Agradecimentos (Acknowledgments)
Aos mantenedores do Next.js e React.

À comunidade open source por modelos de README que serviram de inspiração.    

