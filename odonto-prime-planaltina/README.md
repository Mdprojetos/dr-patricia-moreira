# Odonto Prime · Planaltina-DF

Site institucional da Odonto Prime, clínica odontológica no Portal do Amanhecer, Planaltina-DF.
HTML, CSS e JavaScript puros, sem dependências nem etapa de build.

## Como rodar

Abra `index.html` no navegador, ou sirva a pasta para testar como em produção:

```bash
cd odonto-prime-planaltina
npx serve .            # ou: python3 -m http.server 8000
```

## Estrutura

```
odonto-prime-planaltina/
├── index.html            # todas as seções da página
├── css/styles.css        # tokens de design + estilos mobile-first
├── js/main.js            # menu, animações, abas, carrossel, horário, formulário
└── assets/
    ├── icons/favicon.svg # sol nascendo sobre o sorriso (marca)
    └── img/og-image.jpg  # imagem de compartilhamento (1200x630)
```

## Design

- **Conceito:** o amanhecer no cerrado, em referência ao Portal do Amanhecer. O horizonte da ilustração é a curva de um sorriso; o sol nasce atrás dele e os ipês amarelos marcam a paisagem.
- **Paleta** (tokens no topo de `css/styles.css`): verde-cerrado `#0F3B33`, ipê `#F2B630`, areia `#F7F2E8`, argila `#A8461F`, tinta `#132420`.
- **Fontes:** Bricolage Grotesque (títulos) e Figtree (texto), via Google Fonts.
- **Breakpoints:** 480, 768, 1024 e 1280px. Testado em 360, 768, 1024 e 1440px.
- **Animações:** título que sobe linha a linha, sorriso do horizonte que se desenha, sol que sobe com a rolagem, ipês que brotam, faixa de tratamentos em movimento, entradas ao rolar, abas animadas, carrossel e menu que se abre em círculo. Tudo é desligado com `prefers-reduced-motion`.

## O que trocar antes de publicar

Procure por `TROCAR` e `CONFIRMAR` no código.

| Item | Onde |
| --- | --- |
| Telefone e WhatsApp (hoje `(61) 0000-0000`) | `WHATSAPP` em `js/main.js`, texto em `index.html` (contato) e `telephone` no JSON-LD |
| Horários (hoje seg-sex 8h-18h, sáb 8h-12h) | tabela em `index.html` e `HOURS` em `js/main.js` |
| Endereço completo e referência | seção de contato e rodapé |
| Lista de tratamentos, convênios e pagamento | seções Tratamentos e Dúvidas |
| Depoimentos reais (os atuais são exemplos) | seção Depoimentos |
| Fotos da equipe, recepção e consultório (hoje Unsplash) | seções A clínica e O espaço |
| Responsável técnico e CRO-DF | rodapé |
| Instagram oficial | rodapé |
| Domínio definitivo | `canonical`, `og:url`, `og:image` e JSON-LD |

Dados encontrados em fontes públicas: razão social AF Clínica Odontológica Ltda, CNPJ 35.654.897/0001-51,
endereço Conjunto B, Lote 1C, Portal do Amanhecer, Planaltina-DF, CEP 73366-116, e a página
facebook.com/odontoprimeplandf.

## Formulário

O formulário não envia e-mail: ele valida nome e telefone e abre o WhatsApp da clínica com a mensagem pronta.
