# Site · Dra. Carolina Leal, Odontologia Especializada

Site institucional da clínica no Guará II (Brasília-DF), focado em gerar agendamentos pelo WhatsApp.
HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

> O repositório se chama `dr-patricia-moreira` porque abrigava o site de outra cliente. Esse site antigo continua no histórico do Git (commit `feb17b8`).

## Como rodar

Basta abrir o `index.html` no navegador. Para testar como em produção (recomendado), sirva a pasta localmente:

```bash
python3 -m http.server 8080
# acesse http://localhost:8080
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
├── index.html            # todo o conteúdo e as seções
├── css/styles.css        # estilos (tokens no topo, mobile-first)
├── js/main.js            # menu, animações, abas, carrossel, horários e formulário
└── assets/
    ├── img/              # fachada em WebP (480 e 765px) + imagem de compartilhamento
    └── icons/favicon.svg # dente da marca em fundo cobalto
```

## Como editar

| O que mudar | Onde |
|---|---|
| Cores, fontes, espaçamentos | `css/styles.css`, bloco `:root` (design tokens) |
| Textos das seções | `index.html`, cada seção tem um comentário `<!-- ===== NOME ===== -->` |
| Tratamentos | `index.html`: um botão `role="tab"` + um painel `role="tabpanel"` por tratamento, e o `<select id="tratamento">` do formulário |
| Telefone do WhatsApp | links `wa.me/5561995158616` no `index.html` e a constante `WHATSAPP` em `js/main.js` |
| Horários | tabela em `index.html` **e** o objeto `HOURS` em `js/main.js` (usado no "Aberto agora") |
| Depoimentos | seção `#depoimentos` em `index.html` |

Procure por `TROCAR` e `CONFIRMAR` no `index.html` para achar tudo o que ainda é provisório.

## Pendências antes de publicar

1. **Depoimentos:** os quatro atuais são exemplos. Troque por avaliações reais (ex.: Google), com autorização dos pacientes.
2. **Fotos provisórias do Unsplash:** retrato da Dra. (seção Sobre) e três fotos da galeria. Substitua por fotos reais em WebP, até ~1200px de largura. Se uma foto externa não carregar, o espaço aparece em azul-claro, sem quebrar o layout.
3. **CRO-DF** da responsável técnica no rodapé (`[número]`), exigido em publicidade odontológica.
4. Confirmar a **lista de especialidades**, a formação da Dra. na seção Sobre e as respostas sobre **convênios e pagamento**.
5. Incluir o **Instagram** no rodapé (linha comentada) e trocar o domínio `dracarolinaleal.com.br` nas tags `canonical`, `og:url`, `og:image` e no JSON-LD.

## Decisões de design

- **Conceito:** a fachada azul com o reflexo do céu e o dente branco da marca. No topo, a foto real da fachada aparece dentro da silhueta do dente, que se desenha ao abrir a página, sobre um "céu" cobalto com nuvens lentas.
- **Paleta:** cobalto `#1F45C9` (marca e botões), noite `#0D1A3A` (texto e rodapé), porcelana `#F4F7FB` (fundo), céu `#D6E3FF` (apoio) e sol `#FFC94D` (detalhes). Combinações de texto passam no contraste WCAG AA.
- **Fontes:** Young Serif (títulos) + Schibsted Grotesk (texto), via Google Fonts, carregadas sem bloquear a renderização.
- **Tratamentos** em painel com abas, em vez de cards repetidos. A primeira consulta é numerada porque é uma sequência real, com uma linha que se preenche ao rolar.

## Animações

- Entrada do topo: título linha a linha, contorno do dente desenhado e foto revelada.
- Elementos entram suavemente ao rolar (IntersectionObserver), em cascata.
- Troca animada entre tratamentos, carrossel de depoimentos, FAQ com ícone animado, menu mobile com cortina.
- Tudo desliga com `prefers-reduced-motion`.

## Acessibilidade e desempenho

- HTML semântico, link "Pular para o conteúdo", foco visível, menu mobile com `aria-expanded`, Esc para fechar e foco preso no menu.
- Abas no padrão WAI-ARIA (setas, Home e End), carrossel navegável por teclado e botões, FAQ com `<details>` nativo.
- Formulário com rótulos, mensagens de erro claras e máscara de telefone. Não envia nada para servidor: monta a mensagem e abre o WhatsApp.
- "Aberto agora" e o dia de hoje na tabela calculados no fuso de Brasília.
- Alvos de toque ≥ 44px, sem rolagem horizontal (testado em 360, 768, 1024 e 1440px).
- Lighthouse (mobile, servidor local): 100 em Performance, Acessibilidade, Boas práticas e SEO.
- Dados estruturados `schema.org/Dentist`, meta tags de SEO, Open Graph e favicon.
