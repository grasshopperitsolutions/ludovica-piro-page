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
  // Her CV. A bare filename is a file in public/, resolved against the build's
  // base path; an absolute URL would be used as given. Empty renders the button
  // inert with a tooltip rather than shipping a dead link.
  cv: "Ludovica-Piro-CV.pdf",
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
    body: [
      "Among Gen Zers and millennials, the expression 'ci sta' is widely used with a meaning similar to 'cool.' That's why we felt it could work perfectly as the brand's tagline.",
      "Why? Because, just like 'cool,' 'ci sta' has a double meaning. It describes something appealing and relevant, but also something that works, fits or feels right. This richness of meaning helped us connect with our audience, highlight the product's strengths, and define a new brand positioning.",
    ],
    media: [{ video: { kind: "youtube", id: "QI_ci6w-STc" } }],
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
    // No agency line: the deck never named one, and the page credits the
    // people who made it instead.
    agency: "",
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
    // Her own credits, in her own capitalisation.
    credits: [
      "Creative Director: Teresa Verde Pinho",
      "Art Director: Margarita Pignatelli",
    ],
  },
  {
    id: "liga-te",
    title: "Liga-te",
    brand: "FOCA FC Lisboa",
    agency: "Brother Lisboa",
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
    credits: [
      "Creative Directors: Teresa Verde Pinho & Inês Nogueira de Sousa",
      "Art Director: Margarita Pignatelli",
    ],
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
    { school: "Brother Lisboa", detail: "Creative Intensive", dates: "Jun–Aug 2026" },
    {
      school: "Accademia di Comunicazione",
      detail: "Master in Copywriting and Advertising",
      dates: "Oct 2020 – May 2021",
    },
    {
      school: "Politecnico di Milano — Poli.design",
      detail: "Master in Brand Communication",
      dates: "Sept 2018 – May 2020",
    },
    {
      school: "University of Palermo",
      detail: "Faculty of Law — 110 cum laude",
      dates: "Sept 2012 – Jul 2018",
    },
    {
      school: "Universidade da Coruña",
      detail: "Faculty of Law and Sociology (Erasmus+)",
      dates: "Sept 2015 – Sept 2016",
    },
    { school: "Classical Studies High School", detail: "", dates: "2007–2012" },
  ],
  experience: [
    {
      agency: "TBWA\\España (ex DDB Spain)",
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
      dates: "Nov – Dec 2025",
      clients: "IKEA, ERA",
    },
    {
      agency: "Ogilvy & Mather (Milan)",
      role: "Creative Copywriter",
      dates: "Sept 2023 – Apr 2026",
      clients:
        "IKEA, Electrolux Professional, Sanbittèr, Nutella, IVECO, Emergency (NGO)",
      pitches: "IKEA, Electrolux Professional, Sanbittèr (Sanpellegrino Group)",
    },
    {
      agency: "DDB (Milan)",
      role: "Creative Copywriter",
      dates: "Jan 2022 – Sept 2023",
      clients: "IKEA, Volkswagen, Zurich, Tanqueray (DIAGEO)",
      pitches: "Tanqueray (DIAGEO)",
    },
    {
      agency: "TBWA (Milan)",
      role: "Junior Creative Copywriter",
      dates: "May 2021 – Jan 2022",
      clients: "Iliad, Cargill, Carrera Eyewear, Loro Piana, GNV, Frosta frozen foods",
    },
    {
      agency: "HAVAS PR (Milan)",
      role: "Media Relations Account",
      dates: "May 2019 – Oct 2020",
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
   (No More Excuses, Ci Sta) fall back to that film, played muted
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

  return previewFromFilm(project.media?.find((m) => m.video)?.video);
}

// A competition is only ever its film — there is no board or photography — so
// its index row previews straight from that. Shared with previewFor so the two
// lists behave identically: same muted, looping, chrome-less playback.
export function previewForCompetition(competition) {
  return previewFromFilm(competition.video);
}

function previewFromFilm(film) {
  if (!film) return null;

  if (film.kind === "file") {
    // Competitions link an absolute URL; works name a file in public/work.
    return /^https?:/.test(film.url)
      ? { type: "video", url: film.url }
      : { type: "video", file: film.url };
  }

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
  // Extracted from her PDF (src/assets — gitignored original, not shipped).
  // The source uses an "fi"/"fl" ligature the PDF's font never mapped to
  // Unicode, so the extracted text dropped every occurrence outright
  // ("in uencer", "guarda sso"); those are restored here from context
  // (influencer, fisso, ...). A few short lines of pure page decoration sat
  // between stanzas as extraction noise ("if if if") and are simply dropped,
  // not merged into the surrounding text. Apostrophes are straightened to
  // match the house style already used in "Di desideri e sederi".
  {
    id: "sete-ita",
    title: "Sete di verità",
    lang: "ITA",
    content: `<p>Trent'anni. Che bell'età.<br/>Inizia con il tre, il numero perfetto,<br/>e poi diventa un'escalation di numeri direttamente<br/>proporzionali alle aspettative che la società ha su di te.<br/><br/>Tipo: se hai trentunanni l'aspettativa è solo una.<br/>Avere un lavoro stabile.<br/>Se ne hai trentadue devi avere un lavoro e un danzato.<br/>Se ne hai trentatré: lavoro, danzato e bebè.<br/>E così via.<br/><br/>Ad ogni modo, chi se ne frega,<br/>puoi sempre scegliere di vivere la vita che desideri,<br/>mollare tutto, fare l'influencer e trasferirti in Cambogia.<br/><br/>Ma c'è una cosa che accomuna tutti. I primi dolori.<br/>E no, non quelli sentimentali, che per i più esperti<br/>iniziano già verso i quindici anni.<br/><br/>Altri tipi di dolori. Quelli alla schiena.<br/>Se ti alleni perché ti alleni,<br/>se non ti alleni perché stai seduto tutto il giorno davanti al pc.<br/>Non hai scampo. Devi andare dall'osteopata.<br/>E l'osteopata è uno di quelli che ha la schiena dritta.<br/>In tutti i sensi.<br/>Ti ritrovi nel suo studio.<br/>Ti spogli e cerchi di rilassarti,<br/>L'osteopata, invece, ti guarda fisso con occhi impenetrabili.<br/>Ti giri e lui ti chiede: &ldquo;Lei beve?&rdquo;<br/><br/>E tu tutta intimorita, rispondi:<br/>&ldquo;Beh si&hellip; ogni tanto&hellip; i fine settimana&hellip;&rdquo;.<br/>Mentre pensi a tutti i gin tonic della sera prima,<br/>ti rendi conto che è calato il silenzio.<br/>Si riferiva all'acqua.<br/><br/>A quel punto, cerchi di recuperare:<br/>&ldquo;ahah, mi scusi pensavo fosse la solita domanda sul fumo e sull'alcol.&rdquo;<br/>Vorresti sprofondare e in effetti sprofondi davvero.<br/>Sul suo lettino.<br/><br/>Dopo diverse manovre non sei più sicura di riuscire a camminare.<br/>Sicuramente il dolore alla schiena non lo senti più<br/>perché adesso hai altri dolori più forti in altre parti del corpo.<br/>Ti fa male anche l'anima perché ti senti giudicata.<br/><br/>Riprende il discorso sull'acqua:<br/>&ldquo;Mi raccomando si ricordi di bere di più&rdquo;.<br/>A quel punto, ti ricordi che il motivo per cui ti trovi lì<br/>è proprio quello: l'acqua.<br/><br/>E quindi incalzi, ti difendi e gli rispondi con aria di sfida:<br/>&ldquo;Guardi che il dolore mi è venuto dopo avere<br/>sollevato le casse d'acqua.<br/>È per questo che sono qui.<br/>È per questo che bevo poco.&rdquo;<br/><br/>Sì, perché è il momento di dire una grande verità:<br/>la cosa peggiore per una ragazza quando si lascia,<br/>sapete qual è?<br/>Dovere comprare l'acqua.<br/>Da sola.<br/><br/>È il momento in cui ti senti caduta più in basso.<br/>Perché stai letteralmente strisciando.<br/>Con quelle casse da 90Kg che quasi ti si staccano le braccia.<br/>E per di più non hai l'ascensore a casa.<br/><br/>Dovrebbe esserci una clausola anteriore<br/>alla rottura di una relazione: io continuerò a ricordarti<br/>dove hai messo la macchina, ma tu, ti prego,<br/>continua a comprarmi l'acqua!<br/><br/>E invece no.<br/><br/>La vostra relazione è giunta al termine e<br/>mentre lo vedi piangere per la rottura,<br/>corri a prendere una brocca.<br/>Nessuna goccia d'acqua deve andare sprecata.<br/>Sai già che dopo qualche settimana ti lascerai morirai di sete.<br/>E, invece, quello che farai nelle giornate successive<br/>sarà comprare una sola, singola, bottiglia d'acqua.<br/>E la parcellizzerai.<br/><br/>Da quel momento in avanti, lei vivrà con te:<br/>la porterai al lavoro, in palestra, a letto.<br/>Si sostituirà al tuo ex ragazzo.<br/><br/>Agli ospiti che verranno a trovarti,<br/>da quel momento in avanti,<br/>offrirai del Malbec Reserva,<br/>del gin, del caffè, del latte,<br/>qualsiasi cosa tranne l'acqua.<br/><br/>Insomma, mentre stai pensando a tutto questo,<br/>l'osteopata che ha dei muscoli enormi ed è alto sei metri,<br/>ti dice che dovresti sempre avere delle casse d'acqua in casa.<br/><br/>E tu pensi che sia un complotto: perché quelle casse d'acqua<br/>si trasformeranno in dolore alla schiena<br/>che si trasformeranno in soldi per lui.<br/>Pensate quanta liquidità.<br/><br/>E voi direte: nel 2026 la spesa te la spediscono a casa.<br/>E questa è, in teoria, un'ottima trovata.<br/>Peccato che costi di più di una seduta di terapia.<br/>E quindi? Sapete qual è la soluzione?<br/>Trovare un danzato possibilmente Acquario.</p>`,
  },
  {
    id: "sete-pt",
    title: "Sede de verdade",
    lang: "PT",
    content: `<p>Trinta anos. Que bela idade.<br/>Começa com o três, o número perfeito,<br/>e depois transforma-se numa escalada de números diretamente<br/>proporcional às expectativas que a sociedade tem sobre ti.<br/><br/>Tipo: se tens trinta e um anos, a expectativa é só uma.<br/>Ter um trabalho estável.<br/>Se tens trinta e dois, tens de ter um trabalho e um namorado.<br/>Se tens trinta e três: trabalho, namorado e bebé.<br/>E assim por diante.<br/><br/>De qualquer forma, quem se importa.<br/>Também podes escolher viver a vida que quiseres,<br/>largar tudo, tornar-te influencer e mudar-te para o Camboja.<br/><br/>Mas há uma coisa que nos une a todos.<br/>As primeiras dores.<br/><br/>E não, não as sentimentais, que para os mais<br/>experientes começam logo por volta dos quinze anos.<br/>Outros tipos de dores. As das costas.<br/><br/>Se treinas, dói porque treinas.<br/>Se não treinas, dói porque passas o dia inteiro sentada à frente do computador.<br/>Não há escapatória. Tens de ir ao osteopata.<br/>E o osteopata é daqueles<br/>que têm a coluna direita.<br/>Em todos os sentidos.<br/><br/>Dás por ti no consultório dele.<br/>Despes-te e tentas relaxar,<br/>ele encara-te fixamente com um olhar impenetrável.<br/><br/>Viras-te e ele pergunta: &ldquo;Bebes?&rdquo;<br/>E tu, toda intimidada, respondes:<br/>&ldquo;Bem&hellip; sim&hellip; de vez em quando&hellip; aos fins de semana&hellip;&rdquo;<br/>Enquanto pensas em todos os gins tónicos da noite anterior,<br/>apercebes-te de que caiu o silêncio.<br/><br/>Ele referia-se à água.<br/><br/>A esse ponto, tentas recuperar:<br/>&ldquo;ahah, desculpe, pensei que fosse a pergunta habitual sobre tabaco e álcool.&rdquo;<br/>Queres afundar-te. E, de facto, afundas-te mesmo.<br/>Na marquesa dele.<br/><br/>Depois de várias manobras, já não tens a certeza de conseguir andar.<br/>O mais certo é que a dor nas costas já não a sentes,<br/>porque agora tens outras dores mais fortes noutras partes do corpo.<br/>Dói-te também a alma, porque te sentes julgada.<br/><br/>Ele volta ao tema da água:<br/>&ldquo;Faça o favor de beber mais água&rdquo;.<br/>Nesse momento, lembras-te de que a razão pela qual estás ali<br/>é precisamente essa: a água.<br/><br/>E então insistes, defendes-te e respondes-lhe com um ar desafiante:<br/>&ldquo;Olhe que a dor só apareceu depois de ter<br/>levantado os garrafões de água.<br/>É por isso que estou aqui.<br/>É por isso que bebo pouca água.&rdquo;<br/><br/>Sim, porque chegou o momento de dizer uma grande verdade:<br/>a pior coisa para uma rapariga quando acaba uma relação,<br/>sabem qual é?<br/>Ter de comprar água.<br/>Sozinha.<br/><br/>É o momento em que sentes que caíste mais baixo.<br/>Porque estás literalmente a rastejar.<br/>Com aquelas caixas de 90 quilos que quase te arrancam os braços.<br/>E, para piorar, não tens elevador em casa.<br/><br/>Devia existir uma cláusula antes do fim de uma relação:<br/>eu continuo a lembrar-te onde estacionaste o carro,<br/>mas tu, por favor, continua a comprar-me a água!<br/><br/>Mas não.<br/><br/>A vossa relação acabou e, enquanto<br/>o vês a chorar pela separação,<br/>corres a buscar um jarro.<br/>Nem uma gota de água pode ser desperdiçada.<br/>Já sabes que, passadas umas semanas, vais deixar-te morrer de sede.<br/><br/>E, no entanto, o que vais fazer nos dias seguintes<br/>é comprar apenas uma única garrafa de água.<br/>E racioná-la.<br/><br/>A partir desse momento, ela vai viver contigo:<br/>levá-la-ás para o trabalho, para o ginásio, em a cama.<br/><br/>Vai substituir o teu ex-namorado.<br/><br/>Aos convidados que vierem visitar-te, a partir daí,<br/>vais oferecer Malbec Reserva, gin, café, leite,<br/>qualquer coisa menos água.<br/><br/>Enfim, enquanto pensas em tudo isto,<br/>o osteopata, que tem uns músculos enormes<br/>e mede uns seis metros de altura,<br/>diz-te que devias ter sempre caixas de água em casa.<br/><br/>E tu pensas que isto é uma conspiração:<br/>porque essas caixas de água<br/>vão transformar-se em dores nas costas,<br/>que se vão transformar em dinheiro para ele.<br/>Pensem na liquidez.<br/><br/>E vocês vão dizer: em 2026, as compras chegam à casa.<br/>E, em teoria, é uma ótima ideia.<br/>Pena é custar mais do que uma sessão de terapia.<br/><br/>Então? Sabem qual é a solução?<br/>Encontrar um namorado, preferencialmente Aquário.</p>`,
  },
  {
    id: "sete-es",
    title: "Sed de verdad",
    lang: "ES",
    content: `<p>Treinta años. Qué hermosa edad.<br/>Empieza con el tres, el número perfecto,<br/>y luego se convierte en una escalada de números directamente<br/>proporcional a las expectativas que la sociedad tiene sobre ti.<br/><br/>Es decir: si tienes treinta y un años, la expectativa es solo una.<br/>Tener un trabajo estable.<br/>Si tienes treinta y dos, tienes que tener trabajo y novio.<br/>Si tienes treinta y tres: trabajo, novio y bebé.<br/>Y así sucesivamente.<br/><br/>De cualquier forma, ¿a quién le importa?<br/>También puedes elegir vivir la vida que quieras,<br/>dejarlo todo, convertirte en influencer y mudarte a Camboya.<br/><br/>Pero hay algo que nos une a todos.<br/>Los primeros dolores.<br/>Y no, no los sentimentales, que para los más<br/>experimentados empiezan ya alrededor de los quince años.<br/><br/>Otro tipo de dolores. Los de espalda.<br/>Si entrenas, duele porque entrenas.<br/>Si no entrenas, duele porque pasas todo el día sentada delante del ordenador.<br/>No hay escapatoria. Tienes que ir al osteópata.<br/><br/>Y el osteópata, a pesar de ser de esos obsesionados con estirar, es un estirado.<br/><br/>Te encuentras en su consulta.<br/>Te desnudas e intentas relajarte,<br/>él te mira fijamente con una mirada impenetrable.<br/><br/>Te das la vuelta y él pregunta: &ldquo;¿Bebes?&rdquo;<br/>Y tú, toda intimidada, respondes:<br/>&ldquo;Bueno&hellip; sí&hellip; de vez en cuando&hellip; los fines de semana&hellip;&rdquo;<br/><br/>Mientras piensas en todos los gin tonic de la noche anterior,<br/>te das cuenta de que ha caído el silencio.<br/>Se refería al agua.<br/><br/>En ese momento, intentas recomponerte:<br/>&ldquo;Jajaja, perdón, pensé que era la pregunta habitual sobre tabaco y alcohol.&rdquo;<br/>Quieres desaparecer.<br/>Y, por lo menos, parte de ti lo hace.<br/>En su camilla.<br/><br/>Después de varias maniobras, ya no estás segura de poder caminar.<br/>Lo más probable es que el dolor de espalda ya no lo sientas,<br/>porque ahora tienes otros dolores más fuertes en otras partes del cuerpo.<br/>Te duele también el alma, porque te sientes juzgada.<br/><br/>Él vuelve al tema del agua:<br/>&ldquo;Por favor, beba más agua.&rdquo;<br/>En ese momento recuerdas que la razón por la que estás allí<br/>es precisamente esa: el agua.<br/><br/>Y entonces insistes, te defiendes y le respondes con aire desafiante:<br/>&ldquo;Mire que el dolor me vino después de haber<br/>levantado las garrafas de agua.<br/>Por eso estoy aquí.<br/>Por eso bebo poca agua.&rdquo;<br/><br/>Sí, porque ha llegado el momento de decir una gran verdad:<br/>la peor cosa para una mujer cuando termina una relación,<br/>¿sabéis cuál es?<br/>Tener que comprar el agua.<br/>Sola.<br/><br/>Es el momento en el que sientes que has caído más bajo.<br/>Porque estás literalmente arrastrándote.<br/>Con esas cajas de 90 kilos que casi te arrancan los brazos.<br/>Y, para colmo, no tienes ascensor en casa.<br/><br/>Debería existir una cláusula antes del final de una relación:<br/>yo sigo recordándote dónde aparcaste el coche,<br/>pero tú, por favor, ¡sigue comprándome el agua!<br/><br/>Pero no.<br/><br/>Vuestra relación se ha acabado y, mientras<br/>lo ves llorar por la ruptura,<br/>corres a buscar una jarra.<br/>Ni una sola gota de agua puede desperdiciarse.<br/><br/>Ya sabes que, pasadas unas semanas,<br/>vas a dejarte morir de sed.<br/><br/>Y, sin embargo, lo que vas a hacer en los días siguientes<br/>es comprar solo una única botella de agua.<br/>Y racionarla.<br/><br/>A partir de ese momento, va a vivir contigo:<br/>la llevarás al trabajo, al gimnasio, a la cama.<br/>Sustituirá a tu exnovio.<br/><br/>A los invitados que vengan a visitarte, a partir de entonces,<br/>les ofrecerás Malbec Reserva, ginebra, café, leche,<br/>cualquier cosa menos agua.<br/><br/>En fin, mientras piensas en todo esto,<br/>el osteópata, que tiene unos músculos enormes<br/>y mide unos seis metros de altura,<br/>te dice que deberías tener siempre cajas de agua en casa.<br/><br/>Y tú piensas que esto es una conspiración:<br/>porque esas cajas de agua<br/>se van a transformar en dolores de espalda,<br/>que se van a transformar en dinero para él.<br/>Pensad en la liquidez.<br/><br/>Y vosotros diréis: en 2026, las compras llegan a casa.<br/>Y, en teoría, es una idea estupenda.<br/>Lástima que cueste más que una sesión de terapia.<br/><br/>¿Entonces? ¿Sabéis cuál es la solución?<br/>Encontrar un novio, preferiblemente Acuario.</p>`,
  },
];

/* TEMPORARY — to be removed.

   The passphrase gating "Sete di verità". This is a courtesy lock, not
   security: it lives in the client bundle, so anyone who opens devtools can
   read both it and the story. It keeps the piece off the prerendered HTML and
   away from casual readers and crawlers, and nothing more. Do not use this
   pattern for anything that actually needs protecting.

   All three languages are gated together — the same text in three languages,
   so locking one and leaving the others open would protect nothing. */
export const STORY_PASSPHRASE = "Ludovic@";

// Each group is the *same* piece written in several languages — grouping them
// lets a story page offer an in-place language morph instead of treating each
// translation as an unrelated item.
export const STORY_GROUPS = [
  {
    id: "sete-di-verita",
    title: "Sete di verità",
    storyIds: ["sete-ita", "sete-pt", "sete-es"],
    // TEMPORARY: see STORY_PASSPHRASE above.
    locked: true,
  },
  {
    id: "desideri",
    title: "Di desideri e sederi",
    storyIds: ["story-ita", "story-pt", "story-es", "story-en"],
  },
];

/* The deck's second Personal Projects section: a photograph she took and the
   lines it prompted, taken verbatim from slides 46 and 47.

   `lines` are hers — each entry is a line as she broke it, not a paragraph to
   be reflowed, so they are rendered one per line. `place` carries the caption
   she set in the slide's bottom corner; Mulheres has none in the deck, so it
   is simply omitted rather than invented. */
export const POETRY_CAMERA = [
  {
    id: "mulheres",
    title: "Mulheres",
    lang: "pt",
    image: "poetry-mulheres.webp",
    alt: "Two women in white shirts, facing each other and laughing, on a sunlit street",
    lines: [
      "As mulheres",
      "que se olham",
      "e reconhecem",
      "a mesma força",
      "que anima a vida",
      "nunca estão perdidas.",
    ],
    place: "Lisboa, 5 april 2026",
  },
  {
    id: "nuvole",
    title: "Nuvole",
    lang: "it",
    image: "poetry-nuvole.webp",
    alt: "A single cloud against a deep blue sky",
    lines: [
      "Che ne sanno le nuvole",
      "della fatica di tenere i piedi per terra,",
      "della ricerca di una destinazione,",
      "del desiderio di essere altrove.",
      "Le nuvole stanno e non lo sanno.",
      "Sospese in cielo,",
      "per un attimo.",
    ],
    place: "Barcelona, 11 april 2026",
  },
];

export function poemFor(id) {
  return POETRY_CAMERA.find((p) => p.id === id);
}

export function storyGroupFor(id) {
  return STORY_GROUPS.find((g) => g.storyIds.includes(id));
}
