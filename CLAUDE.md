# CLAUDE.md · Receita de landing page para consultório (saúde / profissional liberal)

Este arquivo descreve como este site foi construído para que o Claude (ou qualquer pessoa) consiga
**reproduzir um site do mesmo padrão para outro cliente**. O site de referência é o da
Dra. Patrícia Moreira, cirurgiã-dentista em Samambaia (DF), que está nesta mesma pasta.

Ao começar um site novo: copie esta pasta, preencha a **Ficha do cliente** abaixo e siga o
**Processo passo a passo**. Tudo que muda de um cliente para outro está marcado como `{{PLACEHOLDER}}`.

---

## 1. Ficha do cliente (preencher antes de codar)

```yaml
nome_exibicao:      "{{NOME}}"                 # ex.: Dra. Patrícia Moreira
profissao:          "{{PROFISSAO}}"            # ex.: Cirurgiã-Dentista
conselho:           "{{CONSELHO-UF NUMERO}}"   # ex.: CRO-DF 17048 (obrigatório em publicidade de saúde)
cidade_bairro:      "{{BAIRRO}} · {{CIDADE}}"  # ex.: Samambaia · Brasília
endereco:           "{{RUA, NÚMERO, COMPLEMENTO}}"
cep:                "{{CEP}}"
uf:                 "{{UF}}"
telefone_exibicao:  "{{(DD) 9XXXX-XXXX}}"
whatsapp_e164:      "{{55DDNUMERO}}"           # só dígitos, ex.: 5561992871031
instagram_url:      "{{https://www.instagram.com/usuario/}}"
instagram_handle:   "{{@usuario}}"
dominio:            "{{https://www.dominio.com.br/}}"
horarios:                                       # 0 = domingo ... 6 = sábado
  seg: "08:00-21:00"
  ter: "08:00-18:00"
  qua: "08:00-21:00"
  qui: "08:00-18:00"
  sex: "08:00-21:00"
  sab: "08:00-18:00"
  dom: "fechado"
servicos:            ["{{SERVIÇO 1}}", "{{SERVIÇO 2}}", "..."]   # 4 a 8 itens
diferenciais:        ["{{ex.: atende à noite}}", "{{ex.: toda a família}}", "{{ex.: acompanhamento pós}}"]
publico:             "{{ex.: famílias e adultos do bairro e região}}"
objetivo:            "gerar agendamentos pelo WhatsApp"
fotos:               ["retrato profissional", "caso antes/depois (opcional)", "consultório (opcional)"]
paleta:              "{{definida pelo cliente OU derivada das fotos}}"
convenios_pagamento: "{{a confirmar}}"
depoimentos:         "não usar, salvo pedido expresso do cliente"   # ver Lições aprendidas
```

Se algo da ficha estiver faltando, **não invente dados factuais** (número do conselho, convênios,
preços, formações). Deixe um marcador visível como `[inserir]` e liste na entrega o que falta.

---

## 2. Stack e princípios

- **HTML + CSS + JavaScript puro.** Sem framework, sem build, sem dependências npm.
  Abre direto com duplo clique ou com `python3 -m http.server 8080`.
- Hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger).
- Único recurso externo: **Google Fonts** (com `preconnect` e `display=swap`).
- Ícones em **sprite SVG inline** no fim do `index.html` (`<symbol id="i-...">` + `<use href="#i-...">`).
- Imagens em **WebP**, em 3 larguras para a foto principal; `og-image.jpg` 1200×630 para compartilhamento.
- Idioma pt-BR, textos reais (nada de Lorem ipsum), tom acolhedor e direto, frases curtas.

## 3. Estrutura de pastas

```
site-{{cliente}}/
├── index.html            # todo o conteúdo; cada seção marcada com <!-- ===== NOME ===== -->
├── css/styles.css        # tokens no topo (:root), mobile-first, índice numerado no cabeçalho
├── js/main.js            # IIFE sem dependências; cada bloco só roda se o elemento existir
├── assets/
│   ├── img/              # {{slug}}-480/720/918.webp, antes.webp, depois.webp, og-image.jpg
│   └── icons/favicon.svg # monograma com as iniciais do cliente
├── README.md             # como rodar, tabela "o que mudar / onde", pendências
└── CLAUDE.md             # este arquivo
```

Ordem fixa do `styles.css`: 1. Tokens · 2. Reset e base · 3. Utilitários e componentes ·
4. Header e menu · 5. Seções (hero → footer) · 6. Animações · 7. Breakpoints · 8. Movimento reduzido.

## 4. Design tokens (modelo)

A paleta deve sair **das fotos e da identidade do cliente**, não de um template. No site de
referência ela foi tirada do fundo do retrato e do blazer da Dra. Mantenha os mesmos *papéis* de cor
e troque só os valores:

```css
:root {
  /* Cores: papéis fixos, valores por cliente */
  --c-linen: #F6F1EA;      /* {{fundo principal claro}} */
  --c-sand: #E8DED1;       /* {{blocos alternados}} */
  --c-sand-deep: #DCCFBE;  /* {{bordas e divisores}} */
  --c-espresso: #2A1F1A;   /* {{texto e seções escuras}} */
  --c-espresso-2: #3A2C25; /* {{variação do escuro}} */
  --c-muted: #6B5B50;      /* {{texto secundário, AA sobre os dois fundos claros}} */
  --c-clay: #9A4A33;       /* {{destaque / CTAs}} */
  --c-clay-dark: #7E3A27;  /* {{hover do destaque}} */
  --c-gold: #B8976B;       /* {{detalhes decorativos, só linhas finas}} */
  --c-gold-light: #CDB28A; /* {{detalhes e foco sobre fundo escuro}} */
  --c-on-dark: #F1E9DF;    /* {{texto sobre escuro}} */
  --c-on-dark-muted: #D9C9B4;

  /* Tipografia: par display + texto (Google Fonts) */
  --f-display: "Fraunces", Georgia, serif;          /* {{fonte display}} */
  --f-body: "Outfit", "Segoe UI", system-ui, sans-serif; /* {{fonte de texto}} */

  /* Escala fluida com clamp() */
  --fs-xs: clamp(0.78rem, 0.76rem + 0.1vw, 0.84rem);
  --fs-sm: clamp(0.9rem, 0.87rem + 0.15vw, 0.97rem);
  --fs-base: clamp(1rem, 0.96rem + 0.2vw, 1.09rem);
  --fs-md: clamp(1.12rem, 1.05rem + 0.35vw, 1.3rem);
  --fs-lg: clamp(1.35rem, 1.2rem + 0.75vw, 1.75rem);
  --fs-xl: clamp(2rem, 1.55rem + 2.2vw, 3.3rem);
  --fs-hero: clamp(2.45rem, 1.7rem + 3.9vw, 4.9rem);

  /* Espaços */
  --sp-1: .25rem; --sp-2: .5rem; --sp-3: .75rem; --sp-4: 1rem;
  --sp-5: 1.5rem; --sp-6: 2rem; --sp-7: 3rem; --sp-8: 4rem;
  --section-y: clamp(4.5rem, 3rem + 7vw, 9rem);
  --gutter: clamp(1rem, 0.5rem + 2.5vw, 2.5rem);
  --container: 76rem;

  /* Forma e movimento */
  --radius-sm: .5rem; --radius: 1rem; --radius-lg: 1.75rem;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --dur: .35s;
  --header-h: 4.5rem;
}
```

Regras de design:
- Fontes: evite Arial, Inter e Roboto como principal. Par usado na referência: **Fraunces + Outfit**.
  Uma serifada com personalidade nos títulos e uma sans limpa no texto funciona bem para saúde.
- Destaque (`--c-clay`) só em CTAs, palavras em `<em>` dos títulos e foco. Fuja do azul hospitalar
  e de gradientes roxos.
- Títulos com uma palavra-chave em `<em>` itálico na cor de destaque (ex.: "Do check-up de rotina à *cirurgia*").
- "Eyebrow" pequeno acima de cada título de seção (ex.: "Tratamentos", "Horários e endereço").
- Ritmo de fundos alternado entre claro, areia e escuro para separar as seções sem bordas.
- Nada de grade de cards idênticos: serviços em **lista editorial numerada** (01, 02, 03...).
- Todo par texto/fundo precisa passar **WCAG AA** (confira com uma calculadora de contraste).

## 5. Seções e ordem

| # | Seção (id) | Fundo | Conteúdo e componentes |
|---|---|---|---|
| 1 | Header (`.site-header`) | claro, borda ao rolar | Monograma SVG + nome + profissão; menu com links âncora; botão "Agendar consulta" (WhatsApp). Hambúrguer abaixo de 1024px |
| 2 | Hero (`#inicio`) | claro | Eyebrow com bairro/cidade, H1 forte com `<em>`, lead de 2 linhas, CTA principal WhatsApp + CTA secundário "Conhecer tratamentos", 3 "hero-facts" (ex.: Até 21h · Sábados · Toda a família). Foto do profissional **em arco** (`border-radius: 999px 999px r r`) com moldura deslocada em linha dourada e um selo circular com texto em `textPath` |
| 3 | Serviços (`#tratamentos`) | claro | Coluna de título + link "Quero uma avaliação →" ao lado de `<ol class="treatment-list">` numerada com título e uma frase por serviço |
| 4 | Sobre (`#sobre`) | escuro | Título, parágrafo principal maior, parágrafo de apoio e 3 princípios com ícone (escuta, cuidado, tempo) |
| 5 | Resultados (`#resultados`) | areia | Comparador **antes/depois arrastável** + botão para o Instagram. Remover a seção se não houver foto de caso |
| 6 | Horários e endereço (`#horarios`) | claro | Status "Aberto agora / Fechado agora", endereço em `<address>`, botões "Como chegar" (Maps) e "Ligar", tabela de horários com o dia de hoje destacado |
| 7 | Dúvidas (`#duvidas`) | claro/areia | 5 a 6 perguntas em `<details>` nativo (como agendar, atende família, medo/ansiedade, sensibilidade, pós-operatório, pagamento) |
| 8 | Contato (`#contato`) | escuro | Texto + lista de contatos ao lado do **formulário que abre o WhatsApp** com mensagem pronta |
| 9 | Footer | escuro | Marca + frase, navegação, contatos, endereço com botão "Como chegar", linha final com © ano automático, profissão e **número do conselho** ("Responsável técnica: CRO-DF 17048"), ícone do Instagram |
| + | Botão flutuante WhatsApp | | `.whatsapp-float` fixo no canto, some quando o menu mobile está aberto |

**Sem seção de depoimentos por padrão** (ver Lições aprendidas).

## 6. Componentes reutilizáveis (com o código-chave)

### 6.1 Links de WhatsApp
Todos os CTAs usam a mesma mensagem pré-preenchida, codificada em URL:
```html
<a class="btn btn-primary" href="https://wa.me/{{WHATSAPP_E164}}?text=Ol%C3%A1%2C%20{{NOME_URL}}!%20Gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o." target="_blank" rel="noopener">
  <svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><use href="#i-whatsapp"/></svg>
  Agendar pelo WhatsApp
</a>
```
Em `js/main.js`: `var WHATSAPP = '{{WHATSAPP_E164}}';`

### 6.2 Formulário que abre o WhatsApp (sem servidor)
Campos: Nome (obrigatório), Telefone/WhatsApp (obrigatório, mínimo 10 dígitos), Interesse
(`<select id="tratamento">` com os mesmos serviços da lista + "Outro"), Melhor período, Mensagem (opcional).
Erros com `<p class="field-error" id="{{campo}}-erro" hidden>` + `aria-invalid` e `aria-describedby`.
No envio, o JS monta o texto e chama
`window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener')`.
A primeira linha do texto é a saudação personalizada: `'Olá, {{NOME}}! Gostaria de agendar uma consulta.'`.

### 6.3 Tabela de horários com "Aberto agora"
HTML: uma `<tr data-day="N">` por dia (1 = segunda ... 0 = domingo).
JS: array em minutos, índice 0 = domingo, `null` = fechado. O cálculo usa o fuso
`America/Sao_Paulo` via `Intl.DateTimeFormat`, independente do fuso do visitante, marca a linha
de hoje com `.is-today` e escreve em `[data-open-status]` (`aria-live="polite"`):
```js
// seg/qua/sex 8h-21h, ter/qui/sáb 8h-18h, dom fechado
var HOURS = [null, [480, 1260], [480, 1080], [480, 1260], [480, 1080], [480, 1260], [480, 1080]];
```
**Os horários existem em três lugares e precisam bater:** tabela HTML, array `HOURS` e
`openingHoursSpecification` do JSON-LD. Atualize também os "hero-facts" e as opções de período do formulário.

### 6.4 Comparador antes/depois
Duas imagens do mesmo tamanho e enquadramento sobrepostas; a de "antes" é recortada com
`clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. O controle é um `<input type="range">`
transparente por cima (funciona com teclado e toque) que atualiza `--pos`. Rótulos "Antes"/"Depois"
e alça visual são `aria-hidden`; o range tem `<label class="visually-hidden">`.

### 6.5 "Como chegar" (Google Maps com rota)
```
https://www.google.com/maps/dir/?api=1&amp;destination={{ENDERECO+COM+MAIS+NO+LUGAR+DE+ESPACO+CEP}}
```
Aparece na seção de horários (botão principal) **e** no rodapé, abaixo do endereço.

### 6.6 Menu mobile acessível
Botão com `aria-expanded` + `aria-controls`, texto oculto "Abrir menu / Fechar menu", ícone de 2 traços
animado. Ao abrir: foco no primeiro link, Tab preso dentro do menu, Esc fecha e devolve o foco ao
botão, clicar num link fecha. Ao passar para desktop (≥1024px) o menu volta ao estado neutro.

### 6.7 Outros detalhes
- Header ganha borda/sombra com `.is-scrolled` depois de 8px de rolagem.
- Link ativo do menu com `aria-current` via IntersectionObserver (`rootMargin: '-45% 0px -50% 0px'`).
- Animação de entrada: classe `.reveal` (opacidade + leve translate), atraso em cascata entre irmãos
  (`--delay`, até 5 × 0,07s), só se o JS carregou (`.js .reveal`) e desligada em `prefers-reduced-motion`.
- Ano do rodapé automático em `[data-year]`.
- Favicon SVG com o monograma das iniciais.

## 7. SEO e metadados (no `<head>`)

- `<html lang="pt-BR">`, `<title>{{NOME}} · {{PROFISSAO}} em {{BAIRRO}}, {{CIDADE}}</title>`
- `meta description` com serviços principais + bairro + "Agende pelo WhatsApp".
- `theme-color` = cor escura da paleta; `canonical` e `og:url` = `{{DOMINIO}}`.
- Open Graph completo (`og:type`, `og:locale=pt_BR`, `og:title`, `og:description`, `og:image`) e `twitter:card`.
- `preload` da foto do hero com `imagesrcset`/`imagesizes`; a imagem do hero tem `fetchpriority="high"`.
- **JSON-LD** `schema.org/Dentist` (ou `Physician`, `MedicalClinic`, `LocalBusiness` conforme o caso)
  com nome, telefone, endereço, `sameAs` (Instagram) e `openingHoursSpecification`.

## 8. Regras obrigatórias

**Responsividade**
- Mobile-first; breakpoints `480px`, `768px`, `1024px`, `1280px` (e um ajuste 1024–1279 se o header apertar).
- Grid e Flexbox, unidades relativas, tipografia fluida com `clamp()`.
- Imagens com `width`/`height`, `aspect-ratio`, `srcset`/`sizes` e `loading="lazy"` (exceto a do hero).
- Alvos de toque ≥ 44×44px. **Nenhuma rolagem horizontal** em nenhuma largura (`body { overflow-x: hidden }` não substitui corrigir a causa).

**Acessibilidade**
- `header`, `nav`, `main#conteudo`, `section[aria-labelledby]`, `footer`; link "Pular para o conteúdo".
- Contraste WCAG AA; `:focus-visible` visível (cor de destaque no claro, dourado no escuro).
- `alt` descritivo em fotos; ícones decorativos com `aria-hidden="true"`; `label` em todos os campos.
- FAQ com `<details>`/`<summary>`; tudo navegável por teclado.

**Performance**
- Nada de bibliotecas; JS pequeno no fim do body; fontes com `display=swap`.
- Fotos em WebP otimizadas (retrato ~17–40 KB por largura). Meta: Lighthouse ≥ 90 em Performance, Acessibilidade e SEO.

**Publicidade em saúde**
- Exiba o **número do conselho** do responsável técnico no rodapé (exigência do CFO para dentistas;
  CFM/CRM, CRN, CREFITO etc. têm regras parecidas).
- Não prometa resultados, não use "o melhor", não publique preços sem orientação do cliente.
- Fotos de antes/depois só com autorização do paciente.

## 9. Processo passo a passo

1. **Ficha:** preencha a seção 1 com o que o cliente mandou; liste o que falta.
2. **Plano curto (antes de codar):** paleta (com a justificativa de onde saiu), par de fontes,
   lista de seções e o elemento visual marcante. Apresente e siga construindo sem esperar aprovação.
3. **Imagens:** converta as fotos para WebP. Retrato em 480/720/918px de largura com a mesma proporção;
   antes/depois recortados no mesmo tamanho; `og-image.jpg` 1200×630; favicon SVG com as iniciais.
   Se não houver foto, use placeholder de qualidade e marque `<!-- TROCAR: ... -->` no HTML.
4. **Base:** copie `index.html`, `css/styles.css` e `js/main.js` deste site e troque os tokens.
5. **Conteúdo:** reescreva todos os textos para o novo cliente (título do hero, serviços, sobre,
   FAQ). Substitua todos os dados de contato. Use busca no projeto por estes valores antigos e
   confirme que nenhum sobrou: `5561992871031`, `99287-1031`, `Patrícia`, `Patricia`,
   `drapatriciamoreira`, `Samambaia`, `QS 122`, `72304-525`, `17048`.
6. **Interações:** ajuste `WHATSAPP`, `HOURS` e a saudação do formulário em `main.js`.
7. **Teste no navegador** (Playwright/Chromium headless) em **360, 390, 768, 1024 e 1440px**:
   sem rolagem horizontal (`document.documentElement.scrollWidth <= innerWidth`), alvos ≥ 44px,
   menu abre/fecha com teclado, formulário abre o WhatsApp com o texto certo, "Como chegar" abre a rota.
   Tire capturas de desktop e celular.
8. **Entrega:** README atualizado, zip da pasta, capturas (e um PDF de prévia para o cliente, se pedido,
   sem o botão flutuante do WhatsApp cobrindo o conteúdo). Resuma o que foi feito, o que falta
   confirmar (conselho, serviços, convênios, domínio) e próximos passos.

## 10. Lições aprendidas neste projeto

- **O cliente preferiu a versão elegante e calma** (fundo creme, serifa, foto em arco). Um redesenho
  mais ousado (parede de azulejos estilo Athos Bulcão, azul e amarelo) foi rejeitado e revertido.
  Para clientes parecidos, comece pelo estilo da referência e só mude a direção se pedirem.
- **Depoimentos foram removidos a pedido do cliente**, incluindo o cartão de citação sobre a foto do
  hero e o link "Depoimentos" do menu e do rodapé. Não inclua avaliações por padrão; se o cliente
  quiser, use só textos reais com autorização.
- O Unsplash pode estar bloqueado no ambiente de build: prefira as fotos do próprio cliente.
- O Lighthouse não pôde ser rodado no ambiente; diga na entrega se a nota foi medida ou não.
- Pendências que sempre aparecem: número do conselho, lista final de serviços, formas de pagamento
  e convênios, domínio real em `canonical`/`og:url`.
