// Single source of truth for all interface copy.
// The site interface is English-only; the *content* (short stories) is still
// multilingual — that lives in src/data.js, not here.
export default {
  meta: {
    title: "Ludovica Piro — Senior Creative Copywriter & Author",
    // First person — this is what shows up as the share-preview text on
    // WhatsApp, LinkedIn and the like, so it should sound like her talking
    // rather than a bio written about her.
    description:
      "I'm Ludovica, a Senior Creative Copywriter and author based in Madrid, at TBWA\\España. I write a lot, sleep a little and dream big — Cannes Lions-shortlisted work for IKEA, Volkswagen, Emergency International and more.",
  },
  // The deck writes the menu as one line: "About, works, competitions, personal
  // projects". Her capitalisation is kept exactly — only the first item is
  // capitalised, because it reads as a sentence.
  nav: {
    home: "Home",
    about: "About",
    work: "Works",
    competitions: "Competitions",
    personal: "Personal Projects",
  },
  // The short forms the nav falls back to when the bar is tight. They are the
  // same words now — "projects" alone read as a different section from
  // "personal projects", which is the one place the abbreviation cost meaning.
  navShort: {
    home: "Home",
    about: "About",
    work: "Works",
    competitions: "Competitions",
    personal: "Personal Projects",
  },
  hero: {
    // The multilingual greeting is hers, not interface chrome — it survives the
    // English-only decision because it's part of how she introduces herself.
    greeting: "Hi, Hola, Olá, Ciao",
    // Two parts, not one string: on a phone the line is too long to hold and
    // would otherwise break wherever it ran out of room — mid-title, usually.
    // Splitting it here puts the break after her name, which is where it should
    // fall. On anything wider the parts sit inline and read as one sentence.
    role: ["I'm Ludovica,", "Senior Creative Copywriter and author."],
    tagline: "I write a lot, sleep a little and dream big.",
  },
  about: {
    heading: "About",
    // Verbatim from her PORTFOLIO deck, which supersedes both the old
    // ludovicapiro.com and anything scraped from it. [[Double brackets]] mark
    // the phrases the deck picks out; the site sets them in full ink rather than
    // the deck's red, since there is no red in the palette. Each
    // paragraph is an array of lines because the line breaks are hers — she's a
    // copywriter, the breaks are part of the writing, so they are preserved
    // rather than reflowed.
    bioHeading: ["Nice to meet you!", "I'm Ludovica,"],
    bio: [
      [
        "I was born and raised in Palermo (Sicily) and I've put down roots in different cities throughout this 30-year journey of experiencing life (to the fullest).",
      ],
      [
        "I'm currently based in [[Madrid]],",
        "where I work as a [[Senior Creative Copywriter]]",
        "at TBWA\\España (ex DDB Spain).",
      ],
    ],
    paragraphs: [
      [
        "The room I love the most is the movie theater.",
        "The room I love the least is the waiting room.",
      ],
      [
        "I'm passionate about [[stand-up comedy, screenwriting, photography and learning languages]].",
      ],
      [
        "I currently speak 4: spanish, portuguese, english and italian.",
        "So I could call myself a polyglot wannabe.",
        "Or maybe I'm just hyperactive?",
        "Surely deeply curious.",
      ],
    ],
    // The line she closes on. `lead` runs at body size; `line` is the one that
    // lands, set at the same size as the "Nice to meet you" that opens the page
    // — those two are the only things on About that are meant to stand out.
    closing: {
      lead: "Yes, because",
      line: "even when I go nowhere, my mind goes everywhere.",
    },
    // Sits under the pair of images on the home page. Contains inline markup on
    // purpose (the work title and "mental gymnastics" are italicised), so it is
    // injected unescaped. The deck stacks the two photos vertically and the copy
    // says "on top" / "below", so the layout follows the words rather than the
    // other way round.
    caption: [
      "The one on top is me, while the one below <em>Forchette parlanti</em>, a work by Bruno Munari.",
      "I've always found his teachings on <em>mental gymnastics</em> inspiring. He is one of my favourite artists, together with Erik Kessels, Saul Steinberg and many others.",
    ],
    profileAlt: "Ludovica Piro",
    munariAlt: "Forchette parlanti, a work by Bruno Munari",
    // The deck's About page opens with a black-and-white photograph of a hand in
    // the left column. That file has not been supplied, so the slot renders a
    // visible note instead of an empty box.
    handAlt: "A hand, photographed in black and white",
    handPending: "The left-hand image from the deck has not been supplied yet.",
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
    agency: "Agency:",
    recognition: "Recognition",
    back: "Back to works",
    seeAll: "See all works",
  },
  competitions: {
    heading: "Competitions",
    // Not shown on the page any more — the index is a plain list like Works.
    // It stays as the section's meta description, where a sentence explaining
    // what these are is still worth having for search results.
    metaDescription: "Self-initiated work and competition entries.",
    back: "Back to competitions",
  },
  // The deck's fourth section. It holds the short stories and Poetry Camera.
  personal: {
    heading: "Personal Projects",
    // Sits under the page heading, not under "Short Stories" — it covers both
    // strands (stories and Poetry Camera), so it belongs to the page, not to
    // one half of it.
    note: "Full of copywriting. Fully covered by copyright.",
    storiesHeading: "Short Stories",
    poetryHeading: "Poetry Camera",
    back: "Back to Personal Projects",
  },
  // The player on the radio spot: the button says what the next click will do.
  audio: {
    play: "Play",
    pause: "Pause",
  },
  stories: {
    heading: "Short Stories",
    read: "Read",
    close: "Close",
  },
  // TEMPORARY — the passphrase gate on "Sete di verità". Remove along with
  // STORY_PASSPHRASE and the `locked` flag in src/data.js.
  lock: {
    kicker: "Protected",
    note: "This one is not public yet. Enter the passphrase to read it.",
    label: "Passphrase",
    submit: "Read",
    wrong: "That is not it. Try again.",
  },
  // Shown wherever the deck names something she has not sent yet.
  pending: {
    text: "Text still to come.",
    media: "Video still to come.",
    watch: "Watch",
    watchOn: "Watch on ludovicapiro.com",
    languages: "Available in",
    credits: "Credits",
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
