# serignolli.com

Site pessoal, estático, em três páginas:

| rota | arquivo | o que é |
|---|---|---|
| `/` | `index.html` → `src/App.tsx` | hub: exemplos de cada categoria, trabalho sob encomenda e contato. O lado de negócio |
| `/projetos` | `projetos.html` → `src/CatalogApp.tsx` | catálogo com todos os projetos, em faixas por categoria |
| `/curriculo` | `curriculo.html` → `src/ResumeApp.tsx` | quem é o Gabriel: sobre, habilidades, PDF do currículo |

Nasceu da união do hub `sobre.serignolli.com` (React, spec original em `docs/SPEC-hub-pessoal.md`) com
o portfólio antigo em Angular. O estilo e a estrutura são os do hub; o conteúdo do
portfólio virou a página de currículo, e os projetos dele foram pra página principal.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # tsc --noEmit + vite build -> dist/
npm run preview  # serve o dist/
```

## Adicionar um projeto

1. Adicione um objeto em `src/data/projects.ts`, com a `category` e as `tags` certas
2. Coloque o print em `public/shots/<id>.webp` (16:10, ~1200×750, < 80KB)

Nada mais. Nenhum JSX, nenhuma cor, nenhum componente novo. O projeto aparece no
catálogo sozinho, na faixa da categoria, com as `tags` como etiquetas no card.

As categorias decidem a seção e a faixa, e mudar a `category` move o projeto sozinho:

| `category` | na principal | faixa do catálogo |
|---|---|---|
| `tool` | Ferramentas | Ferramentas |
| `client` | Exemplos, dentro de "Trabalho sob encomenda" | Feitos para clientes |
| `lab` | Jogos e brincadeiras | Jogos e brincadeiras |

**Na principal só entram os projetos com `featured: true`** (a ideia é dois por
categoria); o catálogo mostra todos. Grupo sem nenhum projeto em destaque não renderiza
nada. Em `client`, a `description` descreve o problema resolvido, não a ferramenta.

Links: `url` é o site, `repo` o repositório público. O card abre o site, ou o
repositório quando não houver site (ex.: app desktop); com os dois, o catálogo mostra
um link "Código" à parte. Repositório privado não entra.

Projetos com `status: 'soon'` não precisam de link: o card não é clicável e ganha o
selo "em breve".

Os prints de `public/shots/` saem do print original (fora do repositório) com ffmpeg
(ajuste o último número do `crop` pra mover o recorte na horizontal):

```bash
ffmpeg -i X.png -vf "scale=1200:750:force_original_aspect_ratio=increase,crop=1200:750:0:0" -c:v libwebp -quality 78 public/shots/x.webp
```

## O catálogo

`/projetos` tem uma faixa por categoria (ordem em `CATEGORY_ORDER`) com os projetos em
fila horizontal: rola com o dedo no celular e com as setas no desktop, que só aparecem
quando a fila não cabe.

## O parâmetro `?from=`

Os sites individuais linkam para `https://serignolli.com/?from=<id>`, usando
o mesmo `id` de `projects.ts`. Um `id` desconhecido é ignorado em silêncio e o valor
cru nunca é renderizado na página.

O projeto de origem sobe para a primeira posição **do próprio grupo** e ganha o selo
"você veio daqui"; o banner aparece no topo da área de projetos.

Hoje: o numixy.com deve apontar para `https://serignolli.com/?from=numixy`, e o Moiré
aponta para `https://serignolli.com/?from=moire`.

## O desenho do hero

Troca todo dia, e é sempre um desenho do [Moiré](https://moire.serignolli.com/): uma
forma girada várias vezes no mesmo centro. A geometria é a do gerador, portada em
`src/data/moire.ts` (precisa continuar igual à de `moire/src/core/`), e os padrões ficam
em `src/data/artPatterns.ts`:

- **Dia comum:** forma, cópias, passo do giro e variações sorteados de novo a cada dia,
  com uma onda lenta do calendário só como viés do ângulo do degradê. Dois dias seguidos
  são duas peças diferentes. Sempre na paleta do site
- **Data especial:** forma e cores do tema. São 14: Ano Novo, Carnaval, St. Patrick,
  Páscoa, Dia das Mães, Namorados (BR e EUA), festa junina, Dia dos Pais, Sete de
  Setembro, Dia das Crianças, Halloween, Thanksgiving e Natal. As móveis são calculadas,
  não escritas ano a ano
- Adicionar uma data = um id em `FIXED`, um padrão em `THEMES` e o rótulo em
  `content.artDates`. Nenhum componente é tocado

Ao abrir a página o desenho pulsa três vezes, de leve, pra mostrar que é clicável (não
pulsa com `prefers-reduced-motion`). Clicar abre o modal que credita o gerador: fecha no
× do canto, e o único botão do corpo abre no Moiré o desenho do dia, com os mesmos
parâmetros e as cores dos tokens resolvidas em hex. Enquanto `artGenerator.url` (em `content.ts`) estiver
vazia, esse botão não aparece e volta sozinho quando a URL for preenchida.

## Currículo

Página própria, `/curriculo`. Textos em `src/data/resume.ts` (o "Sobre mim" segue o
PDF: ao atualizar um, atualize o outro), PDF em
`public/assets/resume/` (mesmo caminho do portfólio antigo, pra links antigos não
quebrarem). A seção "Currículo" da página principal e o trilho levam até ela; o
destino sai de `curriculum.url` em `src/data/content.ts`.

## Apoio

Não existe seção de apoio nesta página: o pedido fica dentro de cada projeto, no
momento em que a ferramenta acabou de funcionar.

## Cores

Todas em `src/styles/tokens.css`. Não escrever cor literal em nenhum outro arquivo.

## Fonte

Inter variável self-hosted em `public/fonts/inter-variable.woff2`, extraída de
`@fontsource-variable/inter@5.3.0` (subset latin). Sem CDN em runtime.

## Arquivos que ainda são placeholder

- `public/og.png`

Gerados com ffmpeg nas dimensões corretas. Substituir pelos arquivos reais mantendo
os mesmos nomes e proporções.

## Deploy

Vercel, framework Vite, build `npm run build`, output `dist`. Sem variáveis de
ambiente e sem rewrite de SPA: são dois HTML estáticos, e o `cleanUrls` do
`vercel.json` serve `projetos.html` em `/projetos` e `curriculo.html` em `/curriculo`.

O domínio antigo do hub (`sobre.serignolli.com`) deve redirecionar pra
`serignolli.com` mantendo a query, pros links `?from=` já publicados continuarem valendo.
