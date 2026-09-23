# SPEC, Página Hub Pessoal (Gabriel Serignolli)

> **Documento histórico.** Esta é a spec original do hub, de quando ele era uma página
> única em `sobre.serignolli.com`. Depois ele foi unido ao portfólio antigo e virou o
> site `serignolli.com`, com catálogo (`/projetos`) e currículo (`/curriculo`). A
> estrutura atual está no `README.md`; aqui fica o raciocínio por trás das decisões de
> design, que continua valendo.

> Documento de especificação para execução no Claude Code.
> Todas as pendências de conteúdo estão listadas na seção 14.

---

## 1. Objetivo

Página única, estática, em domínio próprio, que serve de **hub central** para todos os
projetos web pessoais. Cada site individual (Numixy, SFX Forge, etc.) mantém seu modal de
apoio próprio e ganha apenas um link "saiba mais" apontando para cá.

A lógica é de composição: cada projeto novo passa a alimentar os anteriores, em vez de
cada site ser uma ilha.

**Prioridades, nesta ordem:**

1. Mostrar os projetos, é o miolo da página
2. Gerar contato para freelance

**Não-objetivos:**

- **Não pede apoio.** O pedido de apoio mora dentro de cada site, no momento em que a
  ferramenta acabou de funcionar, que é quando ele faz sentido. Aqui ele só diluiria as
  duas coisas que a página precisa fazer
- Não é blog, não é currículo cronológico, não tem seção de "skills" com barrinhas

---

## 2. Stack e restrições

- **React + Vite + TypeScript**
- Estático puro, **sem backend**, sem API, sem formulário que dependa de terceiros
- **Sem biblioteca de componentes.** CSS puro com variáveis (CSS custom properties)
- Sem CSS-in-JS, sem Tailwind, sem UI kit
- Responsiva de verdade, a maior parte do tráfego vem de mobile
- Deploy: **Vercel**
- Todos os links externos: `target="_blank" rel="noopener noreferrer"`

---

## 3. Estrutura de arquivos

```
src/
  main.tsx
  App.tsx
  data/
    projects.ts        // ÚNICO lugar onde projetos são editados
    content.ts         // todos os textos, pt + en
    artPatterns.ts     // formas do desenho do hero: sorteio do dia + datas especiais
  i18n/
    LanguageContext.tsx
    useT.ts
  components/
    Sidebar.tsx        // trilho lateral, só desktop
    Header.tsx         // hero
    HeroArt.tsx        // enfeite em SVG inline do hero, clicável
    ArtModal.tsx       // crédito do gerador do padrão
    LanguageToggle.tsx
    FromBanner.tsx
    ProjectCard.tsx
    ProjectGroup.tsx   // um grupo de projetos (título + grade), some se vazio
    Freelance.tsx
    Curriculum.tsx    // ponte pro currículo, no projeto de portfólio
    Contact.tsx
    Footer.tsx
  styles/
    tokens.css         // variáveis de cor, espaçamento, tipografia
    global.css
    (CSS Modules por componente OU um styles/components.css, escolha do executor,
     desde que as cores venham exclusivamente dos tokens)
public/
  shots/
    numixy.webp
    sfx-forge.webp
  og.png
  favicon.svg
```

**Regra dura:** adicionar um projeto novo no futuro deve exigir editar
`src/data/projects.ts` e colocar uma imagem em `public/shots/`. Nada mais. Nenhum JSX
tocado, nenhuma cor nova, nenhum componente novo. A página agrupa pela `category`
sozinha: mudar a categoria de um projeto no array já o move de seção.

---

## 4. Modelo de dados

### 4.1 `src/data/projects.ts`

```ts
export type Category = 'tool' | 'lab' | 'client';

export type Project = {
  id: string;              // slug estável, usado pelo parâmetro ?from=
  name: string;
  category: Category;      // define em que seção o projeto cai
  url?: string;            // ausente quando status === 'soon'
  shot: string;            // caminho em /shots/
  status?: 'live' | 'soon'; // default: 'live'
  description: {
    pt: string;            // UMA linha. máx ~90 caracteres
    en: string;
  };
  alt: {                   // texto alternativo do print, descreve o que o projeto faz
    pt: string;
    en: string;
  };
};
```

**As três categorias:**

| valor | o que é | onde aparece |
|---|---|---|
| `tool` | ferramentas úteis e abertas | seção **Ferramentas**, cards grandes |
| `lab` | jogos e experimentos | seção **Jogos e experimentos**, cards compactos |
| `client` | trabalho feito sob encomenda | bloco **Exemplos**, dentro da seção de freelance |

Motivo da separação: um único grid mistura jogo, ferramenta e trabalho de cliente com o
mesmo peso e confunde o posicionamento de freelance, um jogo não serve de prova de que eu
entrego sistemas. A mistura é boa (mostra amplitude), mas precisa de moldura.

**Regra de escrita da `description` em `client`:** descrever o PROBLEMA RESOLVIDO, não a
ferramenta. Ex.: "Substituiu o controle de clientes em planilha de um escritório de
contabilidade por um sistema web multiusuário."

Estado atual do array:

- `sfx-forge` → `tool` (ainda `status: 'soon'`, sem URL)
- `numixy` → `lab` (nome exibido "Numixy", id `numixy`)

Deixados como exemplos comentados no array, para preencher depois: `rewallet` (`tool`,
ferramenta para investidores), `portwatcher` (`tool`), `crm-contador` (`client`, versão
aberta do CRM de contabilidade) e `pagina-cliente` (`client`).

A ordem do array é a ordem de exibição **dentro de cada grupo** (exceto pela reordenação
do `?from=`, seção 6). A ordem dos grupos na página é fixa: `tool` → `lab` → `client`.

**Projetos fora por enquanto** (privados, entram no futuro como portfólio, sem link ou
com link, a decidir): bot de DCA, SaaS do contador, app de Direito. Não incluir agora.

### 4.2 `src/data/content.ts`

Todos os textos da página, com as duas línguas lado a lado. Formato:

```ts
export const content = {
  header: {
    title: { pt: '...', en: '...' },
    // ...
  },
  // ...
} as const;
```

Motivo: mantém PT e EN no mesmo lugar, então é impossível traduzir um e esquecer o
outro. Ver seção 7 para os textos.

Os títulos dos grupos ficam aqui também, num mapa indexado pela `category`:

```ts
export const groupContent: Record<Category, { heading: Localized; subtitle?: Localized }> = {
  tool:   { heading: { pt: 'Ferramentas', en: 'Tools' } },
  lab:    { heading: { pt: 'Jogos e experimentos', en: 'Games & experiments' },
            subtitle: { pt: 'Coisas que construo por diversão ou para testar uma ideia.',
                        en: 'Things I build for fun or to test an idea.' } },
  client: { heading: { pt: 'Exemplos', en: 'Examples' } },
};
```

---

## 5. Idiomas (PT / EN)

- Duas línguas: **português** (padrão para visitantes BR) e **inglês**
- Detecção inicial: `navigator.language` começa com `pt` → PT; caso contrário → EN
- Toggle visível no header (`PT / EN`, discreto, canto superior direito)
- Escolha persistida em `localStorage` (chave `lang`); a escolha manual sempre ganha da
  detecção automática
- `document.documentElement.lang` atualizado junto com a troca
- Envolver o acesso ao `localStorage` em `try/catch`, pode lançar em modo privado

Sem rotas `/en` e sem SSR. É uma página só, troca client-side.

---

## 6. Feature: `?from=` (continuidade entre projetos)

Quando alguém chega pelo link "saiba mais" de um dos sites, a URL traz o projeto de
origem: `https://sobre.serignolli.com/?from=numixy`

Comportamento:

1. Ler o parâmetro `from` da query string
2. **Validar contra os `id`s conhecidos do array `projects`.** Se não bater com nenhum,
   ignorar completamente e renderizar a página normal. Nunca renderizar o valor do
   parâmetro como texto na página, isso evita injeção de conteúdo arbitrário via link
3. Se bater:
   - Mostrar um banner discreto **no topo da área de projetos** (acima de Ferramentas),
     qualquer que seja o grupo de origem:
     PT: "Você chegou pelo **{nome}**, obrigado por usar. Estes são os outros projetos:"
     EN: "You came from **{nome}**, thanks for using it. Here are the other projects:"
   - O projeto de origem vai para a primeira posição **dentro do próprio grupo** e recebe
     a marcação visual (borda no tom de destaque + selo "você veio daqui" / "you came
     from here"). Projeto nenhum muda de grupo por causa do `?from=`
   - Funciona para qualquer categoria, inclusive `client`, que fica dentro da seção de
     freelance
4. Sem `?from=`: banner não aparece, ordem natural do array

O banner é um `<p>` normal com o nome vindo de `projects`, nunca da URL.

**Nota para os sites individuais** (fora do escopo desta spec, mas registrando): o link
no modal de cada site deve apontar para `https://sobre.serignolli.com/?from=<id-do-projeto>`,
com o mesmo `id` usado em `projects.ts`. Hoje: `?from=numixy` no numixy.com.

---

## 7. Seções e conteúdo

A ordem na página é exatamente esta. O freelance fica embaixo, nunca no topo.

1. Header (hero)
2. **Ferramentas** (`tool`)
3. **Jogos e experimentos** (`lab`)
4. **Trabalho sob encomenda**, com o bloco **Exemplos** (`client`) dentro dele
5. Currículo
6. Contato
7. Rodapé

**Grupo sem projetos não renderiza nada:** nem título, nem subtítulo, nem placeholder,
nem "em breve". Hoje o bloco "Exemplos" fica oculto porque não há projetos `client`.

### 7.1 Header (hero)

Ocupa quase a altura da tela. Sem foto. Sem menção a stack específica. O nome em tipo
grande, quebrado em duas linhas, com o sobrenome em gradiente roxo → azul.

**O `<h1>` carrega só o nome.** A frase de apresentação é um `<p>` separado, logo
abaixo. Além de ser o que as tags decorativas dizem que está ali, um `h1` de três linhas
de prosa é ruim de ler e ruim pra quem usa leitor de tela.

**PT:**
> **Gabriel Serignolli**
> Desenvolvedor full stack. Construo ferramentas úteis, alguns jogos por diversão e
> sistemas sob encomenda. A maior parte está aqui embaixo, aberta para qualquer um usar.

**EN:**
> **Gabriel Serignolli**
> Full stack developer. I build useful tools, a few games for fun, and custom systems
> on request. Most of it is right below, free for anyone to use.

Mais no hero:

- Botão contornado "Fale comigo" / "Get in touch", âncora para `#contact`
- **Tags de código decorativas**, em monoespaçada e tom apagado, `aria-hidden`, no fluxo
  do documento. Elas abrem no hero e **fecham no fim da página**, depois do rodapé, na
  ordem e na indentação certas, espelhando o documento de verdade:
  ```
  <html>                  ← hero
    <body>
  <h1>   … nome …   </h1>
  <p>    … frase …  </p>
  [ botão ]
        … resto da página …
      <footer>            ← rodapé
      © 2026 Gabriel Serignolli
      </footer>
    </body>               ← fim da página
  </html>
  ```
  Fechar logo abaixo do botão seria mentira: o `body` não acaba ali. Como estão no
  fluxo, e não posicionadas de forma absoluta, elas não se atropelam em largura nenhuma
- Indicador "role a página" / "scroll down" na vertical, só no desktop, na calha à
  esquerda do conteúdo
- Enfeite em SVG inline (`HeroArt.tsx` + `data/artPatterns.ts`), **que troca todo dia**:
  ver seção 7.7. Gradiente lido dos tokens, espessura e opacidade decrescendo do traço da
  frente para o do fundo (profundidade sem sombra). Sem imagem, sem biblioteca, sem
  animação. É um `<button>`, porque abre o crédito do gerador, mas continua com
  `z-index: -1`: nunca cobre texto nem rouba clique do conteúdo. Fica por último no DOM
  pra não ser a primeira parada do Tab
- Toggle de idioma **no canto superior direito da tela**, não da coluna de conteúdo

**O enfeite e o toggle são filhos do `.layout`, não do hero.** A coluna de conteúdo tem
880px e fica colada no trilho; qualquer coisa ancorada nela pararia no meio da tela. No
nível do layout os dois alcançam a borda direita: o toggle encosta no canto e o desenho
ocupa a sobra de largura inteira, sem ser cortado.

O tamanho do desenho é `min(70vw, 90vh, 1000px)`: o teto em `vh` existe pra ele nunca
estourar a altura da janela e aparecer cortado em cima ou embaixo em telas baixas. O
`.layout` tem `overflow-x: clip` pra garantir que nada disso vire barra de rolagem
horizontal, e `isolation: isolate` pra o desenho (`z-index: -1`) ficar atrás do conteúdo
e à frente do brilho de fundo.

### 7.2 Projetos

Cada grupo é um `ProjectGroup`: título, subtítulo opcional e uma grade. Cards com print,
nome, descrição de uma linha e link para o projeto.

**Ferramentas (`tool`), seção principal.** Cards grandes:
- **Mobile:** uma coluna, empilhados
- **Desktop:** `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`

**Jogos e experimentos (`lab`).** É o laboratório, precisa parecer intencional e não
secundário demais, mas visivelmente mais leve: coluna de `minmax(240px, 300px)` com
`justify-content: start`, imagem menor, mesmo `aspect-ratio` 16:10, menos padding e
tipografia um passo abaixo. O teto de 300px na coluna existe para que um card de `lab`
continue menor que um de `tool` mesmo quando é o único do grupo, com `1fr` ele esticaria
para a linha inteira e os dois ficariam do mesmo tamanho.

**Exemplos (`client`).** Uma coluna; no desktop o card é horizontal (print à esquerda em
240px, texto à direita), no mobile empilha. Projetos `client` aparecem **só** dentro da
seção de freelance, nunca no grid geral.

Cada card:
- Imagem no topo, proporção **16:10** fixa via `aspect-ratio` (evita layout shift)
- Nome (h3)
- Descrição de uma linha
- O card inteiro é clicável (link envolvendo o conteúdo), com `:hover` e `:focus-visible`
- Projetos com `status: 'soon'` mostram um selo e não são clicáveis: renderizar como
  `<article>` (não `<a>`), sem `:hover`, com a imagem em opacidade reduzida

Títulos dos grupos (em `content.ts`, PT e EN): Ferramentas / Tools, Jogos e experimentos
/ Games & experiments, Exemplos / Examples. O subtítulo de "Jogos e experimentos":
PT "Coisas que construo por diversão ou para testar uma ideia." /
EN "Things I build for fun or to test an idea."

**Rótulos dos selos** (em `content.ts`):

| chave | PT | EN |
|---|---|---|
| `badges.soon` | "em breve" | "coming soon" |
| `badges.from` | "você veio daqui" | "you came from here" |

### 7.3 Freelance

Ponto crítico: precisa ser concreto o suficiente pra pessoa se reconhecer. Abertura
ampla + situações específicas.

Abre com uma chamada que emenda nos projetos logo acima, depois as situações
específicas, depois os **Exemplos** (`client`), depois o fechamento.

**PT:**

> ## Trabalho sob encomenda
>
> Se gostou dos projetos e soluções e quer um para você, eu também trabalho sob demanda:
> entre em contato com a sua ideia e vamos conversar sobre.
>
> Se sente que precisa mas não sabe exatamente o que, veja alguns problemas típicos:
>
> - Uma planilha que virou gargalo e precisa virar um sistema integrado
> - Um processo manual e repetitivo que dá pra automatizar
> - Dois sistemas que não conversam e precisam de uma integração
> - Uma ideia que já foi validada no papel e precisa existir de verdade
>
> ### Exemplos
> *(cards dos projetos `client`; o bloco inteiro some quando não há nenhum)*
>
> Faço a parte visual, o servidor e a publicação, você não precisa montar um time nem
> contratar mais ninguém pra colocar no ar.
>
> Não tenho tabela fixa: me conte o que precisa e eu digo se faz sentido e quanto custa.

**EN:**

> ## Custom work
>
> If you liked these projects and want one of your own, I also work on demand: get in
> touch with your idea and we can talk it through.
>
> If you feel you need something but aren't sure what, here are some typical problems:
>
> - A spreadsheet that became a bottleneck and needs to become an integrated system
> - A manual, repetitive process that could be automated
> - Two systems that don't talk to each other and need an integration
> - An idea that's already validated on paper and needs to actually exist
>
> ### Examples
> *(cards for the `client` projects; the whole block disappears when there are none)*
>
> I handle the interface, the server and the deployment, you don't need to put together
> a team or hire anyone else to get it live.
>
> No fixed price list: tell me what you need and I'll say whether it makes sense and what
> it would cost.

Sem valores na página, conforme decidido.

### 7.4 Contato

E-mail visível + LinkedIn como secundário. **Sem formulário**, sem backend, um
formulário exigiria um serviço de terceiros, adicionaria latência e criaria um caminho
onde a mensagem pode sumir sem ninguém perceber.

- E-mail como `<a href="mailto:...">` em destaque, **mais** um botão "copiar" ao lado
  (`navigator.clipboard.writeText`, com feedback de 2s trocando o rótulo para "copiado");
  se a Clipboard API falhar ou não existir, o botão simplesmente não aparece
- LinkedIn: link discreto abaixo
- E-mail: `serignolli.software@hotmail.com`
- LinkedIn: `https://www.linkedin.com/in/gabriel-moreno-serignolli/`

PT: "Fale comigo" / EN: "Get in touch".

### 7.5 Currículo

Ponte para o currículo, que hoje vive no projeto de **portfólio**, separado deste. Fica
entre o freelance e o contato de propósito: quem chegou até ali já viu o que eu construo
e pode querer o histórico formal antes de escrever.

**PT:**
> ## Currículo
>
> Se você prefere o formato tradicional, com formação, experiência e as tecnologias que
> uso no dia a dia, está tudo lá.
>
> [Ver currículo completo →]

**EN:** mesma coisa, com "Résumé" e "See the full résumé".

O destino sai de **uma constante só**, `curriculum.url` em `content.ts`. Quando os dois
projetos forem unidos, é o único ponto a ajustar:

- caminho relativo (`/curriculo`, o valor atual) se o currículo ficar no mesmo domínio
- URL completa se ficar em outro

O componente decide sozinho como abrir: endereço externo vai em aba nova com
`rel="noopener noreferrer"`, caminho interno navega na própria aba. Não há JSX a tocar
na hora da fusão.

No trilho lateral ele aparece como mais um item (**Currículo** / **Résumé**), apontando
pra âncora da seção, não pro link externo: o trilho navega a página, e é dentro da seção
que se sai dela.

### 7.6 Rodapé

Nome + ano. Nada mais: `© {ano} Gabriel Serignolli`, com o ano vindo de
`new Date().getFullYear()` (não hardcoded).

Vem envolvido pelas tags decorativas `<footer>` / `</footer>`, e logo abaixo dele as
tags `</body>` e `</html>` fecham o que o hero abriu. O respiro que separa o rodapé do
contato fica no `.footer-block`, não no `.footer`, senão a tag de abertura descolaria do
bloco e ficaria grudada na seção anterior.

---

### 7.7 O padrão do hero

O desenho não é fixo: **cada dia tem o seu, e ele vale só por aquele dia.** Tudo mora em
`src/data/artPatterns.ts`; nenhum componente é tocado pra mudar ou acrescentar padrão.

**Como a forma nasce.** Três famílias de curva, todas paramétricas, todas desenhadas do
mesmo jeito: o traço é repetido N vezes com um atraso de fase mínimo acumulado, e é o
atraso que dá o efeito de fita líquida, as curvas quase se sobrepõem, se cruzam, e o
feixe parece escorrer.

| família | o que é | do que ela dá conta |
|---|---|---|
| `harmonograph` | curva de dois pêndulos em frequências diferentes | o padrão "normal" da casa |
| `rose` | roseta, `r = base + amp·cos(k·θ) + amp2·cos(k2·θ)` | trevo, ovo, folha, teia, fogos, losango, árvore |
| `heart` | a paramétrica clássica do coração | Dia dos Namorados |
| `flame` | gota afilada com a borda ondulando | festa junina |

A roseta sozinha resolve quase todas as datas: `k` ímpar dá `k` pétalas, `k` par dá `2k`
(por isso o trevo de quatro folhas é `k: 2`), `base: 1` fecha o contorno e transforma
pétala em ondulação, e `stretchX`/`stretchY` esticam o resultado.

A **segunda harmônica** (`k2`/`amp2`, opcionais) recorta os lados do contorno em degraus.
É o que transforma o triângulo da árvore de Natal numa árvore com galhos: `k: 3` faz o
triângulo, `k2: 9` faz três degraus em cada lado.

A `flame` é a curva da gota, `y = sin(θ)·sin(θ/2)^taper`, com a borda multiplicada por uma
ondulação. Ela nasce deitada e o `rotation` põe de pé; como cada traço do feixe desloca a
ondulação, o conjunto parece fogo se mexendo.

**Dia comum.** O peso está no sorteio do dia: **família da curva, frequências e número de
pétalas são escolhidos de novo toda manhã**, e são justamente os parâmetros que mais mudam
a cara do desenho. Quem abre a página dois dias seguidos vê duas peças diferentes, não a
mesma respirando. Uma vez a cada quatro dias, mais ou menos, a roseta abre em pétalas
soltas (`base: 0`) em vez de contorno fechado, que é a virada mais brusca do conjunto.

Por baixo continua uma onda lenta sobre o número do dia (`Math.sin(dia / período)`), mas
só como viés das amplitudes e do giro: ela dá uma maré à sequência ao longo das semanas
sem segurar o desenho preso ao de ontem.

Medido sobre 20 dias seguidos, a distância média entre a curva de um dia e a do seguinte
fica perto de **90% do raio** do desenho, e a família de curva troca em cerca de 40% das
viradas.

O sorteio é determinístico a partir da data local: todo mundo que abre a página no mesmo
dia vê o mesmo desenho, ele troca sozinho na virada, e nada é guardado nem pedido a
servidor nenhum.

**A paleta do dia comum é sempre a do site.** A forma varia à vontade, a cor não: cor é
assinatura, e trocar ela todo dia faria a página parecer outra.

**Datas especiais.** Nelas a forma lembra a data e a cor acompanha. As cores ficam em
tokens próprios (`--art-gold`, `--art-green`, `--art-orange`...), dessaturados de
propósito pra conviver com o preto sem virar enfeite de loja, e **não entram em texto,
botão nem borda**.

| data | quando | forma |
|---|---|---|
| Ano Novo | 31/12 e 1/1 | fogos, 12 pontas finas |
| Carnaval | Páscoa − 48 e − 47 | serpentina, a mais embaralhada |
| St. Patrick | 17/3 | trevo de quatro folhas |
| Páscoa | Sexta-feira Santa e domingo | ovo em pé |
| Dia das Mães | 2º domingo de maio | flor de seis lóbulos |
| Dia dos Namorados | 12/6 (BR) e 14/2 (EUA) | coração |
| Festa junina | 23 e 24/6 | chama de fogueira |
| Dia dos Pais | 2º domingo de agosto | escudo, ponta pra baixo |
| Sete de Setembro | 7/9 | losango, como o da bandeira |
| Dia das Crianças | 12/10 | cata-vento |
| Halloween | 31/10 | teia |
| Thanksgiving | 4ª quinta de novembro | folha |
| Natal | 24 e 25/12 | árvore, triângulo com galhos em degraus |

As móveis são todas calculadas, nenhuma é escrita à mão ano a ano: a Páscoa sai do
algoritmo gregoriano anônimo, o Carnaval conta pra trás a partir dela, e Dia das Mães,
Dia dos Pais e Thanksgiving saem da enésima ocorrência de um dia da semana no mês.

**Ficaram de fora de propósito:** Tiradentes, Finados, Proclamação da República e
Consciência Negra. São feriados, mas não datas que se comemoram com enfeite; dar uma
forma decorativa a data de memória ou de luto soa mal, e é melhor não ter do que ter
errado.

**Adicionar uma data** = um id em `FIXED` (ou uma regra móvel em `holidayFor`), um padrão
em `THEMES` e o rótulo PT/EN em `content.artDates`. Nada além disso.

**O modal de crédito.** Clicar no desenho abre `ArtModal.tsx`, um `<dialog>` nativo, que
credita o gerador e oferece a visita. Nativo por causa do que vem de graça: foco preso
dentro do modal, Esc fechando e leitura correta por leitor de tela, sem uma linha de JS
pra isso.

Fechar é um **×** no canto superior direito. O único botão do corpo é o de ir pro
gerador, pra não haver dúvida sobre qual é a ação que importa ali.

O evento `close` é ouvido **no DOM**, não pelo `onClose` do React: o React não entrega
esse evento de forma confiável (ele não borbulha), e sem o ouvinte nativo o Esc fecharia
o modal deixando o estado em aberto, travando a segunda abertura.

O link de visita leva os parâmetros do padrão na query string (`artQuery`), pra o gerador
abrir já mostrando o mesmo desenho. Vão `seed` e `theme`, que bastam se o gerador usar
este mesmo algoritmo, e também os números crus, pra ele conseguir reconstruir o desenho
sem compartilhar código.

**Enquanto `artGenerator.url` estiver vazia**, o modal continua funcionando: explica o
padrão e esconde o botão de visitar. Ele nunca aponta pra um link que não existe, e o
botão volta sozinho quando a URL for preenchida.

**Conferir os padrões.** Dois jeitos, os dois fora do site publicado:

- `npm run padroes` escreve `exemplos/padroes/` (pasta ignorada pelo git, é saída
  gerada): um SVG por data especial, mais um `index.html` que põe os feriados e duas
  semanas de dias comuns lado a lado. Aceita um
  ano (`npm run padroes -- 2027`) pras datas móveis. O script importa o mesmo código da
  página, então o que sai ali é o que aparece no site; as cores são lidas de
  `tokens.css`, não copiadas à mão
- Na página, o desenho é sempre o do dia. Pra ver outros dias sem esperar a virada, o
  caminho é o script acima, que aceita qualquer data

---

## 8. Design

### 8.1 Tokens (`styles/tokens.css`)

Dark único, sem modo claro, sem toggle de tema. **Preto como base, roxo como destaque,
azul escuro como segundo tom.** O azul quase nunca aparece sozinho, ele fecha os
gradientes do roxo (nome no hero, traço dos títulos, feixe do hero).

```css
:root {
  /* superfícies */
  --bg:           #08080C;   /* preto da página */
  --bg-2:         #0B0B12;
  --surface:      #101019;
  --surface-2:    #16162A;
  --border:       #22223A;
  --border-soft:  rgba(139, 92, 246, 0.16);

  /* texto */
  --text:         #F4F4F8;
  --text-muted:   #9C9CB4;   /* 7.2:1 sobre --bg */
  --text-faint:   #5B5B78;   /* só em enfeite, nunca em conteúdo */

  /* destaque */
  --accent:       #8B5CF6;   /* roxo */
  --accent-hover: #A78BFA;
  --accent-text:  #A78BFA;   /* roxo em texto, o --accent reprova AA */
  --accent-blue:  #3B5BDB;   /* azul escuro */
  --accent-deep:  #1B2A6B;   /* azul mais escuro, fundo dos gradientes */
  --accent-soft:  rgba(139, 92, 246, 0.14);
  --accent-glow:  rgba(139, 92, 246, 0.20);
  --blue-glow:    rgba(59, 91, 219, 0.16);

  /* espaçamento */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;

  /* raio e sombra */
  --radius:    14px;
  --radius-sm: 8px;
  --shadow:    0 1px 3px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 18px 40px -24px rgba(0, 0, 0, 0.9);

  /* largura */
  --maxw:   880px;
  --rail-w: 156px;

  /* tipografia de enfeite (tags de código do hero) */
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
```

O fundo preto ganha duas manchas radiais fixas (`body::before`, `--accent-glow` em cima
à direita e `--blue-glow` à esquerda) só pra não ficar chapado. É decoração, fica atrás
de tudo e não recebe evento nenhum.

**Nenhuma cor literal fora deste arquivo.** Todo componente usa `var(--...)`.

Uso do destaque: links, `:hover` dos cards, botão do hero, traço à esquerda dos títulos
de seção, marcadores da lista de casos, selo do `?from=`. Não colorir textos longos. O
roxo aparece pouco e por isso funciona.

### 8.2 Tipografia

- **Inter**, peso variável, self-hosted (`@fontsource-variable/inter` ou `.woff2` em
  `public/fonts/`). Não carregar de CDN externo
- `font-display: swap`
- `<link rel="preload">` apenas no arquivo da Inter efetivamente usado
- Fallback: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif`
- Carregar **um** peso variável, não uma família de pesos estáticos
- Escala: corpo 16px mobile / 17px desktop, `line-height: 1.6`; h1 ~2rem; h2 ~1.4rem

### 8.3 Layout

- Container `max-width: var(--maxw)`, centralizado, `padding-inline: var(--space-2)`
- Espaçamento vertical generoso entre seções (`--space-5`)
- Mobile-first: escrever o CSS base para telas pequenas e subir com
  `@media (min-width: 720px)`
- **Trilho lateral** (`Sidebar.tsx`), só a partir de `min-width: 1100px`: iniciais GS,
  papel, links para as seções que existem (grupo vazio não vira link), LinkedIn e
  e-mail no pé. É o único elemento `position: fixed` da interface, junto com a camada
  decorativa de fundo. **No mobile o trilho não existe** (`display: none`), barra fixa
  em tela pequena come área útil, que é o motivo original da regra
- Com o trilho na tela, o conteúdo **não é centralizado**: ele fica colado no trilho
  (`margin-inline: 0` + `padding-left: var(--space-4)`) e a sobra de largura fica toda
  à direita. Centralizar abriria um vão entre o menu e o texto e quebraria a leitura de
  bloco único. Abaixo de 1100px o container volta a ser centralizado
- Os links do trilho são âncoras (`#tools`, `#lab`, `#freelance`, `#contact`) e a
  rolagem é animada com `scroll-behavior: smooth` no `html`, mais
  `scroll-margin-top` nas seções. Sem JS, e o bloco de `prefers-reduced-motion`
  desliga a animação

---

## 9. Performance

- **Imagens:** WebP, largura 1200px, proporção 16:10, alvo < 80KB cada. `width` e
  `height` explícitos no `<img>` **e** `aspect-ratio` no CSS, pra não haver layout shift
- `loading="lazy"` em todas as imagens **exceto** a do primeiro card (essa é
  `loading="eager"` + `fetchpriority="high"`)
- Sem biblioteca de animação, sem ícones via pacote, se precisar de ícone, SVG inline
- Sem analytics de terceiros nesta versão
- Nenhuma dependência de runtime além de `react` e `react-dom`

**Metas:** Lighthouse mobile ≥ 95 em Performance e Accessibility; CLS = 0; bundle JS
gzipado < 60KB.

---

## 10. Acessibilidade

- HTML semântico: `<header>`, `<main>`, `<section>`, `<footer>`, hierarquia de headings
  sem pular nível
- `alt` descritivo em cada print, descrever o que o projeto faz, não "screenshot do Numix"
- `:focus-visible` visível em todo elemento interativo (outline no tom de destaque, 2px)
- Contraste mínimo AA: conferir `--text-muted` sobre `--surface` (se ficar abaixo de
  4.5:1, clarear `--text-muted`)
- Toggle de idioma com `aria-label` e `aria-pressed`
- `prefers-reduced-motion`: desativar transições

---

## 11. SEO e compartilhamento

Isso importa na prática: o link vai ser colado em WhatsApp, LinkedIn e Discord, e o
preview vem daqui.

- `<title>`: "Gabriel Serignolli, projetos e trabalho sob encomenda"
- `<meta name="description">` em português (idioma do público majoritário):
  > "Projetos web abertos pra qualquer um usar, e desenvolvimento de sistemas sob
  > encomenda. Feito por Gabriel Serignolli, desenvolvedor full stack."
- `og:title`: igual ao `<title>`
- `og:description`: igual ao `description`
- Esses textos ficam **estáticos no `index.html`, só em português**: crawlers não rodam o
  toggle client-side, então não adianta traduzi-los em runtime. O `<html lang>` do arquivo
  nasce `pt-BR` e só muda depois, no cliente
- **Open Graph:** `og:title`, `og:description`, `og:image` (1200×630, em `/og.png`),
  `og:url`, `og:type="website"`
- `twitter:card = summary_large_image`
- `<link rel="canonical">` com o domínio final
- Favicon SVG

Domínio: **`sobre.serignolli.com`** (decidido).

- `canonical`: `https://sobre.serignolli.com/`, sempre a raiz, **sem** o `?from=`
  (senão cada projeto de origem vira uma URL duplicada aos olhos dos buscadores)
- `og:url`: mesmo valor do canonical
- Os links "saiba mais" dos sites individuais apontam para
  `https://sobre.serignolli.com/?from=<id>`

Guardar o domínio em **uma constante só** (`src/data/content.ts`), usada pelo canonical e
pelo OG.

---

## 12. Deploy

- Vercel, projeto Vite (build `npm run build`, output `dist`)
- Domínio customizado configurado no painel da Vercel + DNS
- Sem variáveis de ambiente
- **Redirect de `/index.html` não é necessário**, é SPA de rota única; não configurar
  rewrite de SPA, já que não há rotas

---

## 13. Critérios de aceite

- [ ] Adicionar um projeto = editar `projects.ts` + colocar `.webp` em `public/shots/`. Nada mais
- [ ] `?from=numixy` reordena os cards, mostra o banner e marca o card de origem
- [ ] `?from=qualquercoisa` inválido é ignorado silenciosamente, sem renderizar o valor na página
- [ ] Toggle PT/EN troca 100% dos textos da página, inclusive descrições dos projetos e `<html lang>`
- [ ] Escolha de idioma sobrevive a um reload
- [ ] Todos os links externos abrem em aba nova com `rel="noopener noreferrer"`
- [ ] Nenhuma cor literal fora de `tokens.css`
- [ ] Zero layout shift ao carregar as imagens
- [ ] Legível e usável em viewport de 360px de largura
- [ ] Lighthouse mobile ≥ 95 em Performance e Accessibility
- [ ] Botão de copiar e-mail funciona e dá feedback visual
- [ ] Ordem na página: header → ferramentas → jogos e experimentos → freelance (com
      Exemplos) → currículo → contato → rodapé
- [ ] O link do currículo sai de `curriculum.url` e abre em aba nova só quando a URL for
      externa
- [ ] Com o trilho visível, o conteúdo fica colado nele, não centralizado na tela
- [ ] Clicar num item do trilho rola com animação até a seção, e sem animação quando o
      sistema pede movimento reduzido
- [ ] Projetos aparecem agrupados por `category`, na ordem `tool` → `lab` → `client`
- [ ] Grupos vazios não renderizam nada
- [ ] Projetos `client` aparecem só dentro da seção de freelance, nunca no grid geral
- [ ] Cards `lab` são visivelmente mais compactos que cards `tool`, inclusive quando há
      um só no grupo
- [ ] `?from=numixy` destaca o Numixy dentro de "Jogos e experimentos" e mostra o banner
      no topo da área de projetos
- [ ] Mudar a `category` de um projeto no array o move de seção sem nenhuma outra edição
- [ ] Todos os textos novos existem em PT e EN
- [ ] O desenho do hero muda de um dia pro outro, e a diferença é visível de cara: outra
      família de curva, outras frequências ou outro número de pétalas
- [ ] Em data especial o desenho vira a forma da data; fora delas, a paleta é a do site
- [ ] Clicar no desenho abre o modal, o Esc fecha, e clicar de novo reabre
- [ ] Com `artGenerator.url` vazia o modal aparece sem o botão de visitar
- [ ] O trilho lateral some abaixo de 1100px e não sobra nenhum elemento fixo no mobile

---

## 14. Pendências do Gabriel

**Resolvido:**

- [x] Domínio final: `sobre.serignolli.com`
- [x] E-mail de contato: `serignolli.software@hotmail.com`
- [x] URL do LinkedIn: `https://www.linkedin.com/in/gabriel-moreno-serignolli/`
- [x] URL do Numixy: `https://numixy.com` (nome exibido e `id`: `numixy`)
- [x] URL do SFX Forge: não existe ainda, entra como `status: 'soon'`, sem link
- [x] Apoio: **não entra nesta página**, fica dentro de cada projeto. O link do Buy Me a
      Coffee (`https://buymeacoffee.com/gabrielserignolli`) segue valendo lá, não aqui

**Ainda falta:**

- [ ] **Apontar `curriculum.url` em `content.ts`** para o endereço final do currículo na
      hora de unir este projeto com o de portfólio. Hoje está em `/curriculo`
- [ ] **Preencher `artGenerator` em `content.ts`** (`name` e `url`) quando o gerador de
      padrões estiver no ar, e conferir se os nomes dos parâmetros de `artQuery` batem
      com os que ele lê na query string. Depois, entrar em `projects.ts` como `tool`

- [ ] **Colocar os prints em `public/shots/`**: `numixy.webp` e `sfx-forge.webp`
      (16:10, ~1200px de largura, < 80KB). Se os arquivos estiverem em PNG/JPG, converter
- [ ] **Imagem Open Graph** (1200×630, `public/og.png`): pode ser gerada a partir dos
      tokens de cor
- [ ] Criar o subdomínio `sobre` no DNS de `serignolli.com` apontando para a Vercel
- [ ] Atualizar o modal do `numixy.com` para apontar para
      `https://sobre.serignolli.com/?from=numixy`
