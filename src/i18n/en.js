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
  },
  // Narrow screens swap in these shorter labels — the full names crowd the bar
  // on a phone. Both are rendered; CSS decides which one is visible.
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
    // Verbatim from her own Information page on Cargo (691401.cargo.site/information),
    // which supersedes the copy scraped from the old ludovicapiro.com. Each
    // paragraph is an array of lines because the line breaks are hers — she's a
    // copywriter, the breaks are part of the writing, so they are preserved
    // rather than reflowed.
    bioHeading: ["Nice to meet you!", "I'm Ludovica."],
    bio: [
      [
        "I was born and raised in Palermo (Sicily) and I've put down roots in different cities throughout this 30-year journey of experiencing life (to the fullest).",
      ],
      [
        "I'm currently based in Madrid,",
        "where I work as a Senior Creative Copywriter",
        "at TBWA\\España (ex DDB Spain).",
      ],
    ],
    paragraphs: [
      [
        "The room I love the most is the movie theater.",
        "The room I love the least is the waiting room.",
      ],
      [
        "I'm passionate about stand-up comedy, screenwriting, photography and learning languages.",
      ],
      [
        "I currently speak 4: spanish, portuguese, english and italian (of course).",
        "So I could call myself a polyglot wannabe.",
        "Or maybe I'm just hyperactive?",
        "Surely deeply curious.",
      ],
    ],
    // The line she closes on, set apart from the paragraphs above it.
    closing: ["Yes, because", "even when I go nowhere,", "my mind goes everywhere."],
    // Sits under the pair of images on the home page. Contains inline markup on
    // purpose (the work title and "mental gymnastics" are italicised), so it is
    // injected unescaped. Her Cargo page stacks the two photos and says "on top"
    // / "below"; ours sit side by side, so the positions read left/right.
    caption: [
      "On the left, that's me.",
      "On the right, <em>Forchette parlanti</em>, a work by Bruno Munari.",
      "I've always found his teachings on <em>mental gymnastics</em> inspiring. He is one of my favourite artists, together with Erik Kessels, Saul Steinberg and many others.",
    ],
    profileAlt: "Ludovica Piro",
    munariAlt: "Forchette parlanti, a work by Bruno Munari",
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
    // Shown under stand-in media, so it's never mistaken for the real thing.
    placeholderMedia: "Placeholder image — waiting on the real media.",
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
    // Bottom-left corner of the home page, where every link is a single word.
    cvShort: "CV",
    cvPending: "CV download as soon as provided!",
    emailLabel: "Email",
    phoneLabel: "Phone",
  },
  // Marker shown on entries that are still missing content. The site is private
  // while it's being built, so these are visible to Ludovica as a to-do list.
  needsInfoLabel: "Missing enough data",
  // Labels for the flower toggle — it says what the next click will do.
  theme: {
    toDark: "Switch to dark",
    toLight: "Switch to light",
  },
  footer: { rights: "All rights reserved." },
};
