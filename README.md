# Site · Dra. Patrícia Moreira, Cirurgiã-Dentista

Landing page institucional do consultório em Samambaia (DF), focada em gerar agendamentos pelo WhatsApp.
HTML + CSS + JavaScript puro, sem dependências nem etapa de build.

## Como rodar

Basta abrir o `index.html` no navegador. Para testar como em produção (recomendado), sirva a pasta localmente:

```bash
cd site-dra-patricia
python3 -m http.server 8080
# acesse http://localhost:8080
```

Para publicar, envie a pasta inteira para qualquer hospedagem estática (Netlify, Vercel, GitHub Pages, Hostinger etc.).

## Estrutura

```
site-dra-patricia/
├── index.html            # todo o conteúdo e as seções
├── css/styles.css        # estilos (tokens no topo, mobile-first)
├── js/main.js            # menu, animações, comparador, horários e formulário
└── assets/
    ├── img/              # fotos otimizadas em WebP + imagem de compartilhamento
    └── icons/favicon.svg # monograma PM
```

## Como editar

| O que mudar | Onde |
|---|---|
| Cores, fontes, espaçamentos | `css/styles.css`, bloco `:root` (design tokens) |
| Textos das seções | `index.html`, cada seção tem um comentário `<!-- ===== NOME ===== -->` |
| Lista de tratamentos | `index.html`, `<ol class="treatment-list">` e o `<select id="tratamento">` do formulário |
| Telefone do WhatsApp | links `wa.me/5561992871031` no `index.html` e a constante `WHATSAPP` em `js/main.js` |
| Horários | tabela em `index.html` **e** o array `HOURS` em `js/main.js` (usado para "Aberto agora") |
| Depoimentos | seção `#depoimentos` em `index.html` |
| CRO-DF | rodapé do `index.html` (atual: CRO-DF 17048) |

### Imagens

- **Retrato:** `assets/img/dra-patricia-480/720/918.webp`. Para trocar, gere as três larguras (mesma proporção) com o mesmo nome.
- **Antes/depois:** `assets/img/antes.webp` e `depois.webp`, recortadas da imagem enviada, com o mesmo enquadramento (574×280). Novos casos precisam do mesmo tamanho e alinhamento.
- **Compartilhamento (Open Graph):** `assets/img/og-image.jpg` (1200×630).
- Para incluir fotos do consultório (recepção, cadeira, equipe), use WebP com até ~1200px de largura, `loading="lazy"`, `width`/`height` definidos.

## Decisões de design

- **Paleta** tirada das fotos da marca: linho `#F6F1EA`, areia `#E8DED1`, café `#2A1F1A`, argila `#9A4A33` (CTAs) e dourado `#B8976B` (detalhes). Todas as combinações de texto passam no contraste WCAG AA.
- **Fontes:** Fraunces (títulos) + Outfit (texto), via Google Fonts.
- Retrato em arco, lista editorial numerada no lugar de cards, depoimento em destaque e comparador antes/depois arrastável.

## Acessibilidade e desempenho

- HTML semântico, link "Pular para o conteúdo", foco visível, menu mobile com `aria-expanded`, Esc para fechar e foco preso dentro do menu.
- FAQ com `<details>` nativo; comparador antes/depois é um `input range` (funciona por teclado).
- Animações com IntersectionObserver, desligadas com `prefers-reduced-motion`.
- Alvos de toque ≥ 44px, sem rolagem horizontal (testado em 360, 768, 1024 e 1440px).
- Dados estruturados `schema.org/Dentist` para o Google, meta tags de SEO e Open Graph.

## Pendências antes de publicar

1. Confirmar a lista de tratamentos e ajustar a pergunta sobre formas de pagamento/convênios.
2. Trocar o domínio `drapatriciamoreira.com.br` nas tags `canonical` e `og:url` pelo domínio real.
