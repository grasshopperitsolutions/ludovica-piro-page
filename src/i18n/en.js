// Single source of truth for all interface copy.
// The site interface is English-only; the *content* (short stories) is still
// multilingual — that lives in src/data.js, not here.
export default {
  meta: {
    title: "Ludovica Piro — Creative Copywriter & Author",
    description:
      "Ludovica Piro is a creative copywriter and author based in Italy. Cannes Lions-shortlisted work for IKEA, Volkswagen, Emergency ONG and more.",
  },
  nav: {
    home: "Home",
    work: "Works",
    personal: "Personal Projects",
    stories: "Short Stories",
    contact: "Contact",
    open: "Open menu",
    close: "Close menu",
  },
  hero: {
    greeting: "Hi, I'm Ludovica!",
    role: "Creative Copywriter and author.",
    tagline: "I write a lot, sleep less and dream big.",
  },
  about: {
    heading: "About",
    // Verbatim from ludovicapiro.com. Each paragraph is an array of lines
    // because the line breaks are hers — she's a copywriter, the breaks are
    // part of the writing, so they're preserved rather than reflowed.
    paragraphs: [
      [
        "The room I love the most is the movie theater.",
        "The room I love the least is the waiting room.",
      ],
      [
        "I'm passionate about spinning stories, chasing insights and learning languages.",
        "I currently speak four. So I could call myself a polyglot wannabe.",
        "Or maybe I'm just hyperactive.",
        "Surely deeply curious.",
      ],
      [
        "Here you'll find the work I created at international advertising agencies, along with personal projects and short stories.",
        "Because when I go nowhere, my mind goes everywhere.",
      ],
    ],
    // Sits under the pair of images. Contains inline markup on purpose (the
    // work title is italicised), so it is injected unescaped.
    caption: [
      "On the left, that's me.",
      "On the right, <em>Forchette parlanti</em>, a work by Bruno Munari.",
      "I've always found his teachings on mental gymnastics inspiring. He is one of my favourite artists, together with Erik Kessels and many others.",
    ],
    profileAlt: "Ludovica Piro",
    munariAlt: "Forchette parlanti, a work by Bruno Munari",
    languagesLabel: "Languages",
    languagesValue: "Italian, English, Spanish, Portuguese",
    expertiseLabel: "Expertise",
    expertiseValue: "Creative Copywriter",
  },
  work: {
    heading: "Works",
    agency: "Agency where I worked on it:",
    recognition: "Recognition",
    back: "Back to works",
    seeAll: "See all works",
  },
  personal: {
    heading: "Personal Projects",
    subheading: "Self-initiated work and competition entries.",
    competitionsHeading: "For competitions",
    comingSoonHeading: "Coming soon",
    back: "Back to personal projects",
  },
  stories: {
    heading: "Short Stories",
    subheading: "Full of copywriting. Fully covered by copyright.",
    read: "Read",
    close: "Close",
  },
  contact: {
    heading: "Contact",
    cv: "Download CV",
    cvPending: "CV download as soon as provided!",
    emailLabel: "Email",
    phoneLabel: "Phone",
  },
  theme: { light: "Light", dark: "Dark", auto: "System" },
  footer: { rights: "All rights reserved." },
};
