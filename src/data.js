// Case-study copy is kept in the language it was originally written/awarded in (English).
// UI chrome, navigation and the About section are translated — see src/i18n/*.js.

export const contact = {
  email: "ludovicapiro411@gmail.com",
  // `phone` is the display form; `whatsapp` is the same number in the digits-only
  // E.164 form wa.me requires (no "+", spaces or punctuation).
  phone: "+39 346 305 7831",
  whatsapp: "393463057831",
  behance: "https://www.behance.net/ludovicapiro",
  instagram: "https://instagram.com/lodevicapire",
  linkedin: "https://www.linkedin.com/in/ludovica-piro-55327116a/",
  spotify: "https://open.spotify.com/user/ludovicainespiro",
  // TODO: real CV URL needed. While this is empty the CV button is not
  // rendered at all, rather than shipping a dead link.
  cv: "",
};

// Order, titles, clients and copy are taken literally from the client's
// PORTFOLIO deck — it is her own layout document, so it outranks anything
// scraped from the old ludovicapiro.com.
//
// `video` is what the deck lists under each work:
//   { kind: "youtube" | "vimeo" | "file", id }  → embeddable, we can play it
//   { kind: "page", url }                       → a link to her old site, which
//                                                 holds no media; a real file or
//                                                 an embed link is still needed.
export const projects = [
  {
    id: "sakerhet",
    title: "Säkerhet",
    brand: "IKEA Italy",
    agency: "DDB Italy",
    tag: "[ˈsäkərhēt | safety, protection]",
    summary:
      "The first lock designed to convert a closet into a shelter from domestic violence.",
    body: [
      "In Italy 9 out of 10 women don't report domestic violence, fearing not to be supported by the institutions.",
      "The draft law A.S.2530 would be a way to protect them by assuring the rightful persecution of violent partners. But it's still pending since February 2022.",
      "Therefore, up to today, Italian women still have to find other ways to protect themselves.",
    ],
    recognition:
      "Six Cannes Lions shortlists, Gold at Eurobest and Gerety Awards, Silver at Epica Awards and Golden Drum.",
    // `media` is an ordered list, laid out the way the deck lays the slides out:
    // the case-study board first, then the film, then supporting photography.
    // `layout` picks the grid — "full" is one per row, "grid-2" a 2x2, "grid-3"
    // three columns.
    media: [
      { layout: "full", images: ["sakerhet-board.webp"] },
      // Her own file — no hosted link was supplied for this one. It is 31 MB, so
      // it loads only on play: preload="metadata" plus a poster means visiting
      // the page costs nothing.
      { video: { kind: "file", url: "sakerhet.mp4", poster: "sakerhet-board.webp" } },
    ],
  },
  {
    id: "365-days",
    title: "365 Days",
    brand: "Emergency International",
    agency: "Ogilvy Italy",
    summary: "The most special day of all will be the day with no more war.",
    body: [
      "Every day is dedicated to an international day: to travel, lovers, animals, family. But for millions of people in many parts of the world, war changes the meaning of every day.",
      "The film was distributed internationally on the brand's social channels, on billboards and on LA7 television starting December 30, 2024.",
    ],
    media: [
      { layout: "full", images: ["365-days-board.webp"] },
      { video: { kind: "vimeo", id: "1071362378", h: "5b5db4281c" } },
    ],
  },
  {
    id: "more-than-mechanics",
    // Three portrait executions, three columns — as the slide sets them.
    media: [
      {
        layout: "grid-3",
        images: ["mechanics-director.webp", "mechanics-chef.webp", "mechanics-vet.webp"],
      },
    ],
    title: "More Than Mechanics",
    brand: "Iveco Group",
    agency: "Ogilvy Italy",
    summary: "Being an IVECO mechanic means being much more than a mechanic.",
    body: [
      "Many technical careers are still affected by the misconception that they are merely 'Plan B' options. IVECO challenges this perception by putting its technical careers on the same level as traditional dream jobs. Because being an IVECO mechanic means being much more than a mechanic.",
    ],
  },
  {
    id: "no-more-excuses",
    title: "No More Excuses",
    brand: "Volkswagen Italy",
    agency: "DDB Italy",
    summary: "The only barriers left are the ones we make up.",
    body: [
      "Prejudices have slowed down the shift to electric. To promote the ID. family, Francesco Totti plays with these very prejudices, turning them into excuses that protect his car from everyday challenges.",
      "The film was distributed internationally on the brand's social channels, on billboards and on LA7 television starting December 30, 2024.",
    ],
    media: [
      { video: { kind: "vimeo", id: "906706215", h: "7ab8abde94" } },
      { video: { kind: "vimeo", id: "906708069", h: "8d60ba8f24" } },
    ],
  },
  {
    id: "everyday-emergencies",
    title: "Everyday Emergencies",
    brand: "Emergency International",
    agency: "Ogilvy Italy",
    summary: "For someone every day is an emergency. For real.",
    body: [
      "We often use war-related expressions to describe intense work situations, even though they're not connected to war.",
      "&ldquo;There ain't no peace.&rdquo;<br />&ldquo;It's going to be a bloodbath.&rdquo;<br />&ldquo;It's a long shot.&rdquo;",
      "The most commonly used expression help reveal the real meaning of the word 'emergency' for all the people who are living in war zones.",
    ],
    recognition: "Special OOH during Inter-Milan's Derby.",
    media: [
      { layout: "full", images: ["emergencies-board.webp"] },
      { video: { kind: "vimeo", id: "1018653590", h: "060a6299e1" } },
      { layout: "full", images: ["emergencies-posters.webp"] },
      // The four OOH photographs sit 2x2 on the slide.
      {
        layout: "grid-2",
        images: [
          "emergencies-ooh-1.webp",
          "emergencies-ooh-2.webp",
          "emergencies-ooh-3.webp",
          "emergencies-ooh-4.webp",
        ],
      },
    ],
  },
  {
    id: "not-open-to-discriminations",
    title: "Not open to discriminations",
    brand: "WPP Group",
    agency: "Ogilvy Italy",
    summary:
      "Orientation, tendencies and inclination belong to the professional sphere. Nothing else.",
    body: [
      "For over 40% of the LGBTQIA+ community, sexual orientation is a penalizing factor in the workplace. WPP is 'not open to discriminations' and demonstrates that terms such as 'orientation,' 'tendencies,' and 'inclination' in the workplace should refer exclusively to the professional sphere, and never to sexual orientation or gender identity.",
    ],
    languages: "ITA, PT, ES, ENG",
    // One set per language: three posters each for Italian and Portuguese, and
    // a single composite for Spanish and English.
    media: [
      {
        layout: "grid-3",
        label: "ITA",
        images: [
          "discriminations-ita-1.webp",
          "discriminations-ita-2.webp",
          "discriminations-ita-3.webp",
        ],
      },
      {
        layout: "grid-3",
        label: "PT",
        images: [
          "discriminations-pt-1.webp",
          "discriminations-pt-2.webp",
          "discriminations-pt-3.webp",
        ],
      },
      { layout: "full", label: "ES", images: ["discriminations-es.webp"] },
      { layout: "full", label: "ENG", images: ["discriminations-eng.webp"] },
    ],
  },
  {
    id: "ci-sta",
    title: "Ci Sta",
    brand: "Sanbittèr (Nestlé)",
    agency: "Ogilvy Italy",
    summary: "It's appealing. It works. It fits.",
    body: [
      "Among Gen Zers and millennials, the expression 'ci sta' is widely used with a meaning similar to 'cool.' That's why we felt it could work perfectly as the brand's tagline.",
      "Why? Because, just like 'cool,' 'ci sta' has a double meaning. It describes something appealing and relevant, but also something that works, fits or feels right. This richness of meaning helped us connect with our audience, highlight the product's strengths, and define a new brand positioning.",
    ],
    media: [{ video: { kind: "youtube", id: "QI_ci6w-STc" } }],
  },
  {
    id: "the-couples",
    title: "The Couples",
    brand: "Volkswagen Italy",
    agency: "DDB Italy",
    summary:
      "On Valentine's Day, celebrate love without forgetting to give everyone else a gift too.",
    body: [
      "On Valentine's Day, the streets fill with couples in love. Volkswagen invites them to celebrate their love without forgetting to give everyone else a gift too.",
    ],
    media: [{ video: { kind: "vimeo", id: "788324836", h: "000fdf0f6f" } }],
  },
  {
    id: "segunda-mao",
    title: "Segunda Mão",
    brand: "IKEA Portugal",
    agency: "UZINA",
    summary:
      "To begin another life, furniture just has to be given a hand. A second hand.",
    body: [
      "Furniture goes through different stages of life too. Of those who have lived with it. To begin another one, you just have to give it a hand. A second hand.",
    ],
    media: [
      {
        layout: "grid-2",
        images: ["segunda-mao-1.webp", "segunda-mao-2.webp"],
      },
    ],
  },
  {
    id: "colecao-para-animais",
    title: "Coleção para animais",
    brand: "IKEA Portugal",
    // The deck names no agency for this one; UZINA is likely but not stated, so
    // it is left blank rather than guessed.
    agency: "",
    summary:
      "A collection for pets — and an invitation for humans to reclaim their spaces.",
    body: [
      "IKEA has launched a collection dedicated to pets. But cats and dogs love their owners' belongings. The campaign builds on this insight to introduce the new collection, inviting humans to reclaim their spaces.",
    ],
    media: [
      { layout: "full", images: ["colecao-board.webp"] },
      {
        layout: "grid-2",
        images: [
          "colecao-lisabo.webp",
          "colecao-kivik.webp",
          "colecao-kallax.webp",
          "colecao-sandtrav.webp",
        ],
      },
    ],
    needsInfo: "Agency not named in the deck — confirm before publishing.",
  },
  {
    id: "liga-te",
    title: "Liga-te",
    brand: "FOCA FC Lisboa",
    agency: "UZINA",
    summary: "The league is ready. You just have to step onto the pitch.",
    body: [
      "Foca FC is a women's and LGBTQIA+ football collective based in Lisbon, created to build an independent, inclusive league for anyone who has felt excluded from the game.",
      "Based on the insight that starting is often the hardest part, the campaign centres on the idea: 'The league is ready. You just have to step onto the pitch.' Across posters and social media, empty spaces represent the only thing still missing: you.",
    ],
    // Her own script, in Portuguese. Kept in the original language on purpose —
    // it is the work, not interface copy.
    //
    // Set as verse rather than prose: the piece is built on an anaphora
    // ("Quantas vezes…"), which only reads as one when each repetition starts a
    // line. `stanzas` is a list of stanzas, each a list of lines — the words and
    // punctuation are hers, untouched; only the line breaks are ours.
    script: {
      label: "Radio script",
      lang: "pt",
      stanzas: [
        [
          "Quantas vezes não começaste",
          "só pelo esforço de dar o primeiro passo?",
          "E ficaste sentado no banco de suplentes.",
        ],
        ["Quantas vezes em vez de vestires a camisola,", "acabaste a vestir o pijama?"],
        [
          "Quantas vezes em vez de dares um pontapé na bola,",
          "deste um pontapé no canto do sofá?",
        ],
        [
          "Quantas vezes quiseste sentir-te vivo?",
          "Com vontade de fazer um carrinho.",
          "E como acabaste?",
          "A empurrar um carrinho de supermercado.",
        ],
        ["Quantas vezes?"],
        [
          "Está na hora de dar a volta ao jogo.",
          "A Liga já cá está.",
          "Só tens de fazer uma coisa:",
          "LIGA-TE.",
        ],
      ],
    },
    media: [
      {
        layout: "grid-2",
        images: [
          "liga-te-ooh-1.webp",
          "liga-te-ooh-2.webp",
          "liga-te-ooh-3.webp",
          "liga-te-ooh-4.webp",
        ],
      },
      {
        layout: "grid-3",
        images: [
          "liga-te-social-1.webp",
          "liga-te-social-2.webp",
          "liga-te-social-3.webp",
        ],
      },
    ],
    // Her own file, in public/work — played inline by the page's own player
    // rather than sending the listener off to Google Drive.
    audio: { label: "Radio spot", file: "liga-te-radio.mp3" },
    credits:
      "A project developed with Margarita Pignatelli (art director) under the creative direction of Teresa Verde Pinho & Inês Nogueira de Sousa.",
  },
];

// Kept in the brief's order.
// Kept in the deck's order.
export const competitions = [
  {
    id: "next-move",
    title: "The next move",
    brand: "Youtube competition",
    award: "Gold",
    format: "Unskippable short film",
    body: [
      "The video aims to encourage people to donate their 5x1000 to Sport Senza Frontiere, a non-profit organization that promotes education, inclusion and social cohesion through sports-based activities.",
      "The challenge was to come up with an idea, develop it, and produce an unskippable video in just seven days for Youtube.",
    ],
    video: { kind: "vimeo", id: "1032052495" },
  },
  {
    id: "waiting",
    title: "Waiting",
    brand: "Young Lions Competition",
    award: "Bronze",
    format: "Film",
    body: [
      "Prison should not be just a long wait. This is the message we conveyed through this video created for the Young Lions Competition, aimed at raising awareness about the conditions of juvenile detention in Milan.",
    ],
    video: {
      kind: "file",
      url: "https://freight.cargo.site/m/E2766217399974923511281066954639/Aspettare-una-vita.mp4",
    },
  },
  {
    id: "spot-the-artist",
    title: "Spot the artist",
    brand: "Young Ones (One Show)",
    award: "Silver",
    format: "Activation",
    body: [
      "Spot The Artist enhances Spotify's Your Daily Drive by bringing what's playing outside the car inside it. Through Bluetooth, drivers can discover and listen to nearby street performers as they drive by turning every journey into a new way to spot emerging talent.",
    ],
    video: { kind: "youtube", id: "GdjwD8K23vw" },
  },
  {
    id: "lego-bnbee",
    title: "Lego B&bee",
    brand: "ADCI Awards",
    award: "Bronze",
    format: "Activation",
    body: [
      "Children are often scared of bees. Yet most bees are not aggressive, and many species live solitary lives. Solitary bees play a vital role in our ecosystem, but half of them freeze to death every year.",
      "We need to give them a safe place to shelter during winter. Thanks to their modular design, LEGO bricks can become more than a toy house: they can become a real home for solitary bees.",
    ],
    video: { kind: "vimeo", id: "532708741" },
  },
];

// CV records for the About page. Order is the brief's order, deliberately — it
// is not sorted chronologically. `dates` is omitted where the brief gave none
// rather than guessed at.
export const cv = {
  education: [
    { school: "Brother Lisboa", detail: "Creative Intensive", dates: "June–August 2026" },
    {
      school: "Accademia di Comunicazione",
      detail: "Master in Copywriting and Advertising",
      dates: "Oct. 2020 – May 2021",
    },
    {
      school: "Politecnico di Milano — Poli.design",
      detail: "Master in Brand Communication",
    },
    {
      school: "University of Palermo",
      detail: "Faculty of Law — 110 cum laude",
      dates: "Sept. 2012 – July 2018",
    },
    {
      school: "Universidade da Coruña",
      detail: "Faculty of Law and Sociology (Erasmus+)",
      dates: "Sept. 2015 – Sept. 2016",
    },
    { school: "Classical Studies High School", detail: "", dates: "2007–2012" },
  ],
  experience: [
    {
      agency: "TBWA\\España / DDB Spain (Madrid)",
      role: "Senior Creative Copywriter",
      clients: "BBVA",
    },
    {
      agency: "AUGE (Milan)",
      role: "Creative Copywriter",
      clients: "Gran Pavesi (Barilla)",
    },
    {
      agency: "UZINA (Lisbon)",
      role: "Creative Copywriter — ADCE Agency Exchange Program",
      dates: "November – December 2025",
      clients: "IKEA, ERA",
    },
    {
      agency: "Ogilvy & Mather (Milan)",
      role: "Creative Copywriter",
      dates: "September 2023 – April 2026",
      clients:
        "IKEA, Electrolux Professional, Sanbittèr, Nutella, IVECO, Emergency (NGO)",
      pitches: "IKEA, Electrolux Professional, Sanbittèr (Sanpellegrino Group)",
    },
    {
      agency: "DDB (Milan)",
      role: "Creative Copywriter",
      dates: "Jan. 2022 – Sept. 2023",
      clients: "IKEA, Volkswagen, Zurich, Tanqueray (DIAGEO)",
      pitches: "Tanqueray (DIAGEO)",
    },
    {
      agency: "TBWA (Milan)",
      role: "Junior Creative Copywriter",
      dates: "May 2021 – Jan. 2022",
      clients: "Iliad, Cargill, Carrera Eyewear, Loro Piana, GNV, Frosta frozen foods",
    },
    {
      agency: "HAVAS PR (Milan)",
      role: "Media Relations Account",
      dates: "May 2019 – Oct. 2020",
      clients:
        "Reckitt Benckiser (Durex, Finish), Peugeot, OPPO, Courmayeur Mont Blanc, Imperial Brands",
    },
  ],
  // Each line links through to the piece it was awarded for, so a recruiter can
  // go straight from the prize to the work. `page`/`id` name the route; an entry
  // without them renders as plain text rather than a link to nowhere.
  //
  // Every agency award here is for Säkerhet — it is the only IKEA Italy campaign
  // in the deck, and its own page lists the same set of prizes.
  recognitions: {
    personal: [
      {
        text: "YouTube Awards, 7Days Brief — Gold, Unskippable short film: The Next Move",
        page: "competition",
        id: "next-move",
      },
      {
        text: "Young Lions Competition — Bronze, Film: Waiting",
        page: "competition",
        id: "waiting",
      },
      {
        text: "One Show — Silver, Activation: Spot The Artist (Spotify)",
        page: "competition",
        id: "spot-the-artist",
      },
      {
        text: "ADCI Awards — Bronze, Activation: Lego B&Bee (Lego)",
        page: "competition",
        id: "lego-bnbee",
      },
    ],
    agencies: [
      {
        text: "Cannes Lions — 6 Shortlists + Glass Lions: Säkerhet (IKEA)",
        page: "project",
        id: "sakerhet",
      },
      { text: "Eurobest — 1 Gold & 1 Silver (IKEA)", page: "project", id: "sakerhet" },
      { text: "Epica Awards — 1 Silver (IKEA)", page: "project", id: "sakerhet" },
      {
        text: "Gerety Awards — 1 Gold & 2 Silver (IKEA)",
        page: "project",
        id: "sakerhet",
      },
      { text: "ADCI Awards — Gold (IKEA)", page: "project", id: "sakerhet" },
    ],
  },
};

/* What the works index shows when a row is rested on.

   First choice is the work's own first still. Works that are only a film
   (No More Excuses, Ci Sta, The Couples) fall back to that film, played muted
   and looping with the player's chrome hidden — a moving preview is truer to
   those works than any frame we could pick, and far better than borrowing
   another campaign's board.

   Two shapes come back: `{ type, file }` for something in public/work, which
   the caller resolves against the base path, and `{ type: "embed", url }` for a
   Vimeo/YouTube player, which is already absolute. */
export function previewFor(project) {
  if (project.preview) return project.preview;

  const stills = project.media?.find((m) => m.images?.length);
  if (stills) return { type: "image", file: stills.images[0] };

  const film = project.media?.find((m) => m.video)?.video;
  if (!film) return null;

  if (film.kind === "file") return { type: "video", file: film.url };

  // Query strings are assembled by hand rather than with URLSearchParams: this
  // module is imported by the browser and by the Node prerenderer, and every
  // value here is a literal we control.
  if (film.kind === "vimeo") {
    // `background=1` strips the controls, title and byline, leaving the picture.
    const hash = film.h ? `&h=${film.h}` : "";
    return {
      type: "embed",
      url: `https://player.vimeo.com/video/${film.id}?background=1&autoplay=1&muted=1&loop=1${hash}`,
    };
  }

  if (film.kind === "youtube") {
    // YouTube needs the id repeated in `playlist` before it will honour `loop`.
    return {
      type: "embed",
      url: `https://www.youtube-nocookie.com/embed/${film.id}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playlist=${film.id}`,
    };
  }

  return null;
}

export const stories = [
  {
    id: "story-ita",
    title: "Di desideri e sederi",
    lang: "ITA",
    content: `<p>Quanto vanno custoditi i desideri?<br/>O quanto, al contrario, urlati al mondo?<br/><br/>Al riguardo ci sono due diverse e inconciliabili scuole di pensiero.<br/>Ovvero, due categorie di persone: gli ermetici e i fiumi in piena.<br/><br/>L'ermetico è quello a cui devi cavare le parole di bocca, quello che se ha un desiderio non te lo dice perché se te lo riferisce tu gli porti sfiga. E quel desiderio non si avvera. Non si capisce cosa gli hai fatto. Magari sei il suo migliore amico, ma lui non si fida.<br/><br/>Guarda, puoi anche essere sua madre o chatgpt versione premium. Non ne caverai niente. Lui non può neanche pronunciarlo quel desiderio. Se lo tiene per sé, chiuso a doppia mandata nella sua mente.<br/><br/>E voi starete pensando: vabbè ma, se lo tiene per sé, tu non sai che sta desiderando qualcosa. Ecco, qui ti sbagli! Lui ti dice forte e chiaro che ha un desiderio. Lui è sadico. Vuole vederti sudare dalla curiosità.<br/><br/>Insomma, questi sono i primi. Poi c'è l'altra categoria di persone. I fiumi in piena. Quelli che, invece, se hanno un obiettivo, qualcosa che desiderano ardentemente, lo devono dire a tutti. A T-U-T-T-I. SUBITO. Pure alla signora alla cassa del supermercato.<br/><br/>Eppure, rullo di tamburi, quelli come loro sono dei vincenti. Sono entusiasti, amano la vita. Probabilmente fanno un sacco di squat, ma sicuramente a forza di raccontare i loro desideri a tutti, li hanno resi reali.</p>`,
  },
  {
    id: "story-pt",
    title: "De vontades e verdades",
    lang: "PT",
    content: `<p>Até que ponto os desejos devem ser guardados?<br/>Ou, pelo contrário, gritados ao mundo?<br/><br/>A esse respeito, existem duas escolas de pensamento diferentes e inconciliáveis. Ou seja, duas categorias de pessoas: os herméticos e os sem papas na língua.<br/><br/>O hermético é aquele a quem tens de arrancar as palavras da boca, aquele que, se tem um desejo, não to diz porque, se to disser, tu dás azar. E esse desejo não se realiza.<br/><br/>Olha, podes até ser a mãe dele ou o chatgpt versão premium. Não vais arrancar nada. Ele nem sequer consegue pronunciá-lo, esse desejo. Guarda-o para si, trancado a sete chaves na sua mente.<br/><br/>Depois há a outra categoria de pessoas — os sem papas na língua. Aqueles que, se têm um objetivo, algo que desejam ardentemente, têm de o dizer a toda a gente. IMEDIATAMENTE. Até à senhora da caixa do supermercado.<br/><br/>E, no entanto, soam os tambores: pessoas como eles são vencedoras. São entusiastas, amam a vida. À força de contarem os seus desejos a toda a gente, tornaram-nos reais.</p>`,
  },
  {
    id: "story-es",
    title: "De creencias y consecuencias",
    lang: "ES",
    content: `<p>¿Cuánto deben custodiarse los deseos?<br/>¿O cuánto, por el contrario, gritarse al mundo?<br/><br/>Al respecto, hay dos diferentes e inconciliables escuelas de pensamiento. Es decir, dos categorías de personas: los herméticos y las cotorras.<br/><br/>El hermético es a quien tienes que sacarle las palabras de la boca, el que si tiene un deseo no te lo dice porque, si te lo dice, le traerás mala suerte. Y el deseo no se cumplirá.<br/><br/>Puedes ser incluso su madre o chatgpt versión premium. No le sacarás nada. Él no puede ni siquiera pronunciar aquel deseo. Lo guarda para sí mismo, cerrado a cal y canto en su mente.<br/><br/>Después hay otra categoría de personas: las cotorras. Los que, si tienen un objetivo, cualquier cosa que desean ardientemente, tienen que decírsela a todos. INMEDIATAMENTE. También a la señora que está en la caja del supermercado.<br/><br/>A pesar de eso, redoble de tambores: los que son como ellas son vencedores. Son entusiastas, aman la vida. De lo mucho que contaron sus deseos a todos, se hicieron realidad.</p>`,
  },
  {
    id: "story-en",
    title: "Desires and conspires",
    lang: "ENG",
    content: `<p>To what extent should desires be kept to oneself?<br/>Or, on the contrary, shouted to the world?<br/><br/>On this topic, there are two different and irreconcilable schools of thought. That is to say, two categories of people: the hermetic and the chatterbox.<br/><br/>The hermetic is the one you have to pry words out of, the one who, if he has a desire, won't tell you because if he says it out loud, he'll jinx it. And then it won't come true.<br/><br/>Look, you could even be his mother or the premium version of ChatGPT. You won't get anything out of him. He can't even bring himself to pronounce the desire. He keeps it to himself, locked away with seven keys in his mind.<br/><br/>Then there's the other category — the chatterbox. The one who, if he has a goal, something he deeply desires, has to tell everyone. EVERY SINGLE ONE. Immediately. Even the lady at the supermarket checkout.<br/><br/>And yet, drums roll: people like this are winners. They're enthusiastic, they love life. Because by telling everyone about their desires, they made them real.</p>`,
  },
];

// Each group is the *same* piece written in four languages —
// grouping them lets a story page offer an in-place language morph instead of
// treating each translation as an unrelated item.
// Each group is one piece; its entries are the languages it exists in.
// "Sete di verità" is listed in the deck in three languages but none of the text
// has been supplied yet — the group is declared so the page shows what is coming
// and says plainly that it is missing.
export const STORY_GROUPS = [
  {
    id: "sete-di-verita",
    title: "Sete di verità",
    storyIds: [],
    plannedLangs: ["ITA", "ES", "PT"],
    plannedTitles: ["Sete di verità", "Sed de verdad", "Sed de verdade"],
    needsInfo: "Text not supplied yet — ITA, ES and PT versions are all pending.",
  },
  {
    id: "desideri",
    title: "Di desideri e sederi",
    storyIds: ["story-ita", "story-pt", "story-es", "story-en"],
  },
];

// The deck's second Personal Projects section. Titles only so far.
export const POETRY_CAMERA = [
  { id: "mulheres", title: "Mulheres" },
  { id: "nuvole", title: "Nuvole" },
];

// Her drawings, from ludovicapiro.com. A third strand of Personal projects,
// alongside the short stories and Poetry Camera.
export const DRAWINGS = [
  {
    id: "isola-delle-femmine",
    title: "Isola delle femmine",
    file: "isola-delle-femmine.webp",
  },
  { id: "senza-fiato", title: "Senza fiato", file: "senza-fiato.webp" },
];

export function storyGroupFor(id) {
  return STORY_GROUPS.find((g) => g.storyIds.includes(id));
}
