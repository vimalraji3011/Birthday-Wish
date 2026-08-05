/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE TO MAKE THE SURPRISE YOURS
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything the visitor reads or sees lives here. Nothing below this file
 *  needs to change to personalise the experience.
 *
 *  Swapping in real photos:
 *    1. Drop your images into `public/memories/`
 *    2. Point each `src` at them, e.g. "/memories/goa-trip.jpg"
 *    3. Keep roughly the listed aspect ratio so the mosaic stays balanced
 */

export const friend = {
  /** Shown throughout the site — the guest of honour. */
  name: "KUTTA",
  /** Used in the letter's greeting. Try their nickname here. */
  greeting: "My dearest friend",
  /** Appears in the browser tab and link previews. */
  pageTitle: "Happy Birthday, KUTTA",
};

export const welcome = {
  eyebrow: "A little something, made just for you",
  headline: "Someone very special deserves something magical.",
  sub: "So I built you a whole night sky. Scroll gently — the story unfolds as you go.",
  scrollHint: "Scroll to begin",
};

/** Scene 3 — typed out one paragraph at a time. */
export const typedMessage: string[] = [
  "Sila per namma life-la vandhu poiduvanga... aana sila per mattum namma life-oda oru part-ah maariduvanga.",
  "Nee andha second type. Yosikkama message panna thonra ore aal, effort illama sirikka veikkura aal, edhaiyum yosikkama nambura aal.",
  "Innaiku ellarum un birthday celebrate panranga. Aana unmaiya sollanum-na, naan unna romba naalave celebrate pannitu dhaan iruken.",
  "So... Happy Birthday CONTENT,KUTTA, en favourite human. ❤️ Indha surprise, indha site... mothamum unakkaga mattum dhaan.",
  ];

export const giftScene = {
  eyebrow: "Scene four",
  title: "I left something here for you",
  hint: "Tap the box",
  opened: "Happy Birthday KUTTA!",
  openedSub: "The music's playing. Keep scrolling — there's so much more.",
};

/**
 * Scene 5 — the photo mosaic.
 * `span` controls the tile footprint on desktop: "tall" | "wide" | "square".
 */
export type Memory = {
  src: string;
  alt: string;
  caption: string;
  date: string;
  span: "tall" | "wide" | "square";
};

export const memories: Memory[] = [
  {
    src: "/memories/memory-1.jpg",
    alt: "Warm dusk gradient with drifting light",
    caption: "The day we decided we were stuck with each other",
    date: "Where it started",
    span: "tall",
  },
  {
    src: "/memories/memory-2.jpg",
    alt: "Golden confetti light on a deep violet field",
    caption: "That laugh nobody else understood",
    date: "Our inside joke",
    span: "wide",
  },
  {
    src: "/memories/memory-3.jpg",
    alt: "Rose and gold bokeh over a night sky",
    caption: "Midnight conversations that solved nothing and everything",
    date: "3 a.m. club",
  span: "square",
  },
  {
    src: "/memories/memory-4.jpg",
    alt: "Aurora ribbons in pink and purple",
    caption: "The trip we planned badly and loved completely",
    date: "Adventure #1",
    span: "wide",
  },
  {
    src: "/memories/memory-5.jpg",
    alt: "Soft candlelight glow in warm amber",
    caption: "You showing up when you didn't have to",
    date: "The day it mattered",
    span: "tall",
  },
  {
    src: "/memories/memory-6.jpg",
    alt: "Starlit gradient with floating sparks",
    caption: "And every ordinary day in between",
    date: "Still going",
    span: "square",
  },
];

/** Scene 6 — vertical timeline. */
export type TimelineEntry = {
  title: string;
  when: string;
  body: string;
  glyph: string;
};

export const timeline: TimelineEntry[] = [
  {
    title: "First Meeting",
    when: "The beginning",
    body: "Namma first pesuna exact words ippo rendu perukkume neyabagam illa I think CONTENT than una kuputi irukpan nu nenaikaran. Ana andha conversation mudinja apram, pala varushama therinja maari oru feel vandhuduchu.",
    glyph: "✨",
  },
  {
    title: "Funny Moments",
    when: "Constantly, still",
    body: "Namma rendu perukkulla irukkura jokes... mathavangalukku oru percent kooda puriyaadhu. Oru chinna look pothum, enna sollanum-nu rendu perukkume purinjidum. Andha moments ellam nenachaale involuntary-ah sirippu vandhudum... cheeks-e valikkura alavukku. ❤️😂",
    glyph: "😂",
  },
  {
    title: "Adventures",
    when: "Whenever we got the chance",
    body: "Wrong turns, terrible planning, questionable snacks — and somehow the best days of the year, every single time.",
    glyph: "🧭",
  },
  {
    title: "Best Memories",
    when: "Kept safe",
    body: "The quiet ones I return to most: long drives, late talks, and you telling me it was going to be fine when I really needed to hear it.",
    glyph: "💫",
  },
  {
    title: "Today's Birthday",
    when: "Right now",
    body: "Life-la marakka mudiyadha moments-na perusa nadandhadhu illa... Aimless short drives... midnight conversations... reason illaama sirichadhu... un kooda irukkura andha peaceful comfort... Mukkiyama... naan break aagara maadhiri irundha nerathula, 'Ellam okay aagidum' nu nee sonna andha oru sentence... Adhu enakku appo thevaiyana confidence-um, comfort-um dhaan. ❤️",
    glyph: "🎂",
  },
];

/** Scene 7 — click-to-flip cards. */
export type Reason = {
  title: string;
  glyph: string;
  teaser: string;
  message: string;
};

export const reasons: Reason[] = [
  {
    title: "Your Smile",
    glyph: "🌞",
    teaser: "It changes rooms",
    message:
      "You walk in and the temperature of the room changes. I've watched it happen a hundred times. You have no idea you're doing it.",
  },
  {
    title: "Your Kindness",
    glyph: "🤍",
    teaser: "Quiet and constant",
    message:
      "You're kind in the way that doesn't want an audience — remembering small things, checking in first, making people feel easy to love.",
  },
  {
    title: "Your Support",
    glyph: "🛡️",
    teaser: "Never once conditional",
    message:
      "You've believed in things I said out loud before I believed them myself. That's a rare thing to give someone, and you give it freely.",
  },
  {
    title: "Your Caring Nature",
    glyph: "🌱",
    teaser: "You notice everything",
    message:
      "You catch the shift in someone's voice before they've said anything is wrong. Being cared for by you feels like being paid attention to.",
  },
  {
    title: "Your Funny Moments",
    glyph: "🎭",
    teaser: "Comic timing, unmatched",
    message:
      "You have ruined my composure in serious situations more times than I can count, and I would not change a thing about that.",
  },
  {
    title: "Your Positivity",
    glyph: "🌈",
    teaser: "Stubbornly hopeful",
    message:
      "Not the fake kind. The kind that looks at something difficult and says 'okay, so what do we do about it' — and then actually does it.",
  },
];

export const cakeScene = {
  eyebrow: "Scene eight",
  title: "Make a wish",
  hint: "Tap the candles to blow them out",
  done: "Wish sent. I hope it finds you.",
};

export const fireworksScene = {
  headline: "Happy Birthday KUTTA!",
  sub: "Every light up there is one more reason I'm glad you were born.",
};

/** Scene 10 — the handwritten letter. */
export const letter = {
  paragraphs: [
    "Thank you. For every single time you showed up, answered late at night, sat with me in the quiet, and stayed when it would have been easier not to.",
    "Friendship like ours isn't luck. It's you choosing, over and over, to be someone I can count on. I notice. I always notice.",
    "This year, I hope life is generous with you. I hope you get happiness that doesn't need explaining, work that makes you proud, health that lets you enjoy all of it, and reasons to laugh until you can't breathe.",
    "And whatever this year brings — I'm right here. Same as always.",
  ],
  signOff: "With Love,",
  signature: "Your Best Friend ❤️",
  postscript: "P.S. Play it again. I made the music too.",
};

export const seo = {
  title: friend.pageTitle,
  description:
    "A cinematic birthday surprise — starlight, confetti, memories, and a handwritten letter. Made with love for someone who deserves something magical.",
  keywords: [
    "birthday surprise",
    "happy birthday",
    "interactive birthday website",
    "birthday wishes for best friend",
    "friendship",
  ],
};
