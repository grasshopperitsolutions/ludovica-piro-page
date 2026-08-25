// Single source of truth for all interface copy.
// The site interface is English-only; the *content* (short stories) is still
// multilingual — that lives in src/data.js, not here.
export default {
  meta: {
    title: "Ludovica Piro — Senior Creative Copywriter & Author",
    description:
      "Ludovica Piro is a Senior Creative Copywriter and author based in Madrid, at TBWA\\España. Cannes Lions-shortlisted work for IKEA, Volkswagen, Emergency International and more.",
  },
  nav: {
    home: "Home",
    about: "About",
    work: "Works",
    competitions: "Competitions",
    stories: "Short Stories",
    open: "Open menu",
    close: "Close menu",
  },
  // Shown as the current-section tag inside the nav pill, where the full names
  // crowd the bar on narrow screens. The menu itself keeps the full names.
  navShort: {
    home: "Home",
    about: "About",
    work: "Works",
    competitions: "Competitions",
    stories: "Stories",
  },
  hero: {
    // The multilingual greeting is hers, not interface chrome — it survives the
    // English-only decision because it's part of how she introduces herself.
    greeting: "Hi, Hola, Olá, Ciao",
    role: "I'm Ludovica, Senior Creative Copywriter and author.",
    tagline: "I write a lot, sleep less and dream big.",
  },
  about: {
    heading: "About",
    // Verbatim from the brief. Each paragraph is an array of lines because the
    // line breaks are hers — she's a copywriter, the breaks are part of the
    // writing, so they're preserved rather than reflowed.
    paragraphs: [
      [
        "The room I love the most is the movie theater.",
        "The room I love the least is the waiting room.",
      ],
      [
        "I'm passionate about stand-up comedy, screenwriting, photography and learning languages.",
        "I currently speak four — Spanish, Portuguese, English and Italian, of course.",
        "So I could call myself a polyglot wannabe.",
        "Or maybe I'm just hyperactive.",
        "Surely deeply curious.",
      ],
      [
        "Here you'll find the work I created at international advertising agencies, along with personal projects and short stories.",
        "Because even when I go nowhere, my mind goes everywhere.",
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
    expertiseValue: "Senior Creative Copywriter",
    // Longer bio, used on the About page only.
    bioHeading: "Hey, I'm Ludovica.",
    bio: [
      [
        "I was born and raised in Palermo (Sicily) and I've put down roots in different cities throughout this 30-year journey of experiencing life (to the fullest).",
        "I'm currently based in Madrid, where I work as a Senior Creative Copywriter at TBWA\\España.",
      ],
    ],
    educationHeading: "Education",
    experienceHeading: "Experience",
    recognitionsHeading: "Recognitions",
    recognitionsPersonal: "Personal projects",
    recognitionsAgencies: "Agencies",
    clientsLabel: "Clients",
    pitchesLabel: "Pitches won",
  },
  work: {
    heading: "Works",
    agency: "Agency where I worked on it:",
    recognition: "Recognition",
    back: "Back to works",
    seeAll: "See all works",
  },
  competitions: {
    heading: "Competitions",
    subheading: "Self-initiated work and competition entries.",
    back: "Back to competitions",
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
  // Marker shown on entries that are still missing content. The site is private
  // while it's being built, so these are visible to Ludovica as a to-do list.
  needsInfoLabel: "Missing enough data",
  theme: { light: "Light", dark: "Dark", auto: "System" },
  footer: { rights: "All rights reserved." },
};
