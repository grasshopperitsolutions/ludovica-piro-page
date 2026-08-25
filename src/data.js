// Case-study copy is kept in the language it was originally written/awarded in (English).
// UI chrome, navigation and the About section are translated — see src/i18n/*.js.

// Short display lines used as the *artwork* on project tiles and nav hover
// previews — for a copywriter the words are the visual, so tiles set these in
// Coconat rather than showing a placeholder image. Every line is taken
// verbatim (or trimmed) from the campaign copy in `projects` below; nothing
// here is invented. Anything without an entry falls back to its `summary`.
export const PLATE_LINES = {
  sakerhet: "A closet becomes a shelter.",
  "no-more-excuses": "The only barriers left are the ones we make up.",
  "365-days": "The most special day will be the day with no more war.",
  "everyday-emergencies": "The real emergency is to abolish war.",
  "ci-sta": "It's appealing. It works. It fits.",
  discrimination: "Orientation belongs to the professional sphere. Nothing else.",
  "the-couples": "For the celebration of lovers, give singles a gift.",
  "more-than-mechanics": "Much more than just being a mechanic.",
};

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
      "Cannes Lions: 6 shortlists + Glass Lions. Eurobest: 1 Gold & 1 Silver. Gerety Awards: 1 Gold & 2 Silver. Epica Awards: 1 Silver. ADCI Awards: Gold. Golden Drum: Silver.",
  },
  {
    id: "no-more-excuses",
    title: "No More Excuses",
    brand: "Volkswagen Italy",
    agency: "DDB Italy",
    summary: "Francesco Totti debunks electric-car myths for the ID. family.",
    body: [
      "Prejudices have slowed down the shift to electric.",
      "To promote the ID. family, Francesco Totti plays with these very prejudices, turning them into excuses that protect his car from everyday challenges.",
      "Because everything has already been said about electric. And today, the only barriers left are the ones we make up.",
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
      "The film, distributed internationally on the brand's social channels, on billboards across Italian cities and on TV on LA7 starting December 30th 2024, shows people seemingly enjoying their passions, families and ideals.",
      "A girl travels, children play hide-and-seek and lovers kiss. However, a twist reveals war's impact: the girl is fleeing, the children are hiding from a soldier and the lovers are sharing a farewell kiss.",
    ],
  },
  {
    id: "everyday-emergencies",
    title: "Everyday Emergencies",
    brand: "Emergency International",
    agency: "Ogilvy Italy",
    summary: "Everyday there are real emergencies.",
    body: [
      "We often use war-related expressions to describe intense work situations, even though they're not connected to war — “there ain't no peace”, “it's going to be a bloodbath”, “it's a long shot.”",
      "The most commonly used expressions help reveal the real meaning of the word “emergency” for all the people who are living in war zones.",
      "A reminder for everyone to consider how devastating the consequences of war can be on people's lives. Because for Emergency, the real emergency is to abolish war, once and for all.",
    ],
    recognition: "Special OOH during the Inter-Milan derby, OOH across Italy.",
    // Award boards from the SwissTransfer batch. They arrived labelled only
    // "EMERGENCY", so which of the two Emergency works they belong to is
    // unconfirmed — parked here pending Ludovica's answer.
    images: ["emergency-board.webp", "emergency-eurobest.webp"],
    downloads: [{ file: "emergency-adci-board.pdf", label: "ADCI board (PDF)" }],
    needsInfo: "Confirm these boards belong to this piece and not to 365 Days.",
  },
  {
    id: "ci-sta",
    title: "Ci Sta",
    brand: "Sanbittèr (Nestlé)",
    agency: "Ogilvy Italy",
    summary: "A new, younger positioning for a Nestlé Group classic.",
    body: [
      "The goal of this pitch was clearly to win it. But first and foremost, it was about finding a new positioning for this non-alcoholic beverage from the Nestlé Group, one that felt younger and fresher.",
      "Among Gen-Z and Millennials, the expression “ci sta” is widely used with a meaning similar to “cool” — which is why it works perfectly as the brand's payoff.",
      "Just like “cool”, “ci sta” has a double meaning: it describes something appealing and relevant, but also something that “works” and “fits”. This richness allowed us to build on a phrase already used by our target audience, while clearly communicating the product's strengths.",
    ],
  },
  {
    id: "discrimination",
    title: "Not Open to Discriminations",
    brand: "WPP Group",
    agency: "Ogilvy Italy",
    summary: "Fighting orientation bias in the workplace.",
    body: [
      "For over 40% of the LGBTQIA+ community, sexual orientation is a penalizing factor in the workplace.",
      "WPP is “not open to discriminations” and demonstrates that terms such as “orientation,” “tendencies,” and “inclination” in the workplace should refer exclusively to the professional sphere, and never to sexual orientation or gender identity.",
    ],
  },
  {
    id: "the-couples",
    title: "The Couples",
    brand: "Volkswagen Italy",
    agency: "DDB Italy",
    summary: "A Valentine's Day gift for the singles left behind.",
    body: [
      "On Valentine's Day, streets fill with couples in love, openly exchanging affection without paying attention to those around them.",
      "For the celebration of lovers, Volkswagen invites couples not to forget to take the car to kiss and, above all, to give singles a gift.",
    ],
  },
  {
    id: "more-than-mechanics",
    title: "More Than Mechanics",
    brand: "Iveco Group",
    agency: "Ogilvy Italy",
    summary: "Elevating a technical career beyond “Plan B”.",
    body: [
      "Many technical careers are still affected by a social bias that sees them as “Plan B” options.",
      "IVECO elevates the role of its mechanics to the same level as so-called dream jobs, because being an IVECO mechanic means much more than just “being a mechanic.”",
    ],
  },
  // The three below are listed in the brief but no copy was supplied. They are
  // published deliberately incomplete: `needsInfo` renders a visible marker so
  // Ludovica can see exactly what is outstanding while the site is still
  // private. Fill in `summary`/`body` and delete the flag.
  {
    id: "segunda-mao",
    title: "Segunda Mão",
    brand: "IKEA Portugal",
    agency: "UZINA Lisbon",
    summary: "",
    body: [],
    needsInfo: "Missing enough data — summary, case-study copy and media needed.",
  },
  {
    id: "colecao-para-animais",
    title: "Coleção para animais",
    brand: "IKEA Portugal",
    agency: "UZINA Lisbon",
    summary: "",
    body: [],
    needsInfo: "Missing enough data — summary, case-study copy and media needed.",
  },
  {
    id: "liga-te",
    title: "Liga-te",
    brand: "FOCA FC Lisboa",
    agency: "UZINA Lisbon",
    summary: "",
    body: [],
    needsInfo: "Missing enough data — summary, case-study copy and media needed.",
  },
];

// Kept in the brief's order.
export const competitions = [
  {
    id: "next-move",
    title: "The Next Move",
    format: "Unskippable short film",
    brand: "YouTube Awards, 7Days Brief",
    award: "Gold",
  },
  {
    id: "waiting",
    title: "Waiting",
    format: "Film",
    brand: "Young Lions Competition",
    award: "Bronze",
  },
  {
    id: "spot-the-artist",
    title: "Spot The Artist",
    format: "Activation",
    brand: "One Show — Spotify",
    award: "Silver",
  },
  {
    id: "lego-bnbee",
    title: "Lego B&Bee",
    format: "Activation",
    brand: "ADCI Awards — Lego",
    award: "Bronze",
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
  recognitions: {
    personal: [
      "YouTube Awards, 7Days Brief — Gold, Unskippable short film: The Next Move",
      "Young Lions Competition — Bronze, Film: Waiting",
      "One Show — Silver, Activation: Spot The Artist (Spotify)",
      "ADCI Awards — Bronze, Activation: Lego B&Bee (Lego)",
    ],
    agencies: [
      "Cannes Lions — 6 Shortlists + Glass Lions: Säkerhet (IKEA)",
      "Eurobest — 1 Gold & 1 Silver (IKEA)",
      "Epica Awards — 1 Silver (IKEA)",
      "Gerety Awards — 1 Gold & 2 Silver (IKEA)",
      "ADCI Awards — Gold (IKEA)",
    ],
  },
};

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

// All four story entries are the *same* piece written in four languages —
// grouping them lets a story page offer an in-place language morph instead of
// treating each translation as an unrelated item.
export const STORY_GROUPS = [
  {
    id: "desideri",
    storyIds: ["story-ita", "story-pt", "story-es", "story-en"],
  },
];

export function storyGroupFor(id) {
  return STORY_GROUPS.find((g) => g.storyIds.includes(id));
}
