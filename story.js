/* Default content. You never need to edit this file: use editor.html, which saves your version in the browser. */
window.DEFAULT_STORY = {
meta: { title: "The Unread Book", friendName: "Friend", from: "Ravi" },
start: "garden",
kitten: {
  _: ["Mrrp."],
  garden: ["Mrrp.", "*yawn* Mrrp."],
  library: ["Psst. Library voice.", "Shhh. Mrrp."],
  pond: ["Mew. *splash*", "Mrrp. Do not look at the fish."],
  woods: ["Mrow. I do not trust this place.", "Mrrp. Stay close."],
  post: ["Mrrp. Special delivery.", "Mew, mew, mail."],
  observatory: ["Purrrr. Stars.", "Mrrp, so many nightlights."],
  meadow: ["Mrrrp! Butterflies!", "Mrrp. Focus. Focus."],
  final: ["Mrrp...", "*quiet purr*"]
},
worlds: {
  garden:      { name: "Moonflower Garden", kind: "garden",      sky: ["#2b2a5e", "#d79ac0"], tr: "petals" },
  library:     { name: "Floating Library",  kind: "library",     sky: ["#3a3270", "#eab7cc"], tr: "page" },
  pond:        { name: "Whispering Pond",   kind: "pond",        sky: ["#26356b", "#b9a7e6"], tr: "ripple" },
  woods:       { name: "Mischief Woods",    kind: "woods",       sky: ["#2a2154", "#c58fb5"], tr: "ink" },
  post:        { name: "Cloud Post Office", kind: "clouds",      sky: ["#7a8fd6", "#ffd9e6"], tr: "page" },
  observatory: { name: "Little Observatory",kind: "observatory", sky: ["#14143f", "#6b5aa8"], tr: "stars" },
  meadow:      { name: "Butterfly Meadow",  kind: "meadow",      sky: ["#8a9fe0", "#ffe3ec"], tr: "petals" },
  final:       { name: "The Final Letter",  kind: "final",       sky: ["#2e2a62", "#f3c6d6"], tr: "ink" }
},
clues: {
  l_m: "A flower showed me an M.", l_o: "A flower showed me an O.", l_o2: "Another flower showed me an O.", l_n: "A flower showed me an N.",
  moon_word: "The stone accepted the word MOON.", bookmark: "A bookmark points at a page that is not in the book.",
  ink: "I earned a drop of magical ink.", secret_page: "I found the page between pages.",
  pads_note: "Smallest pad wakes first, largest last.", pond_key: "The pond let me pass.",
  woods_light: "The lantern accepts me.", scope_note: "Cat first, then Crown, then Fish.",
  stamped: "My letter has a stamp.", stars_aligned: "The constellations lined up."
},
scenes: {
 garden: { world: "garden", title: "The Moonflower Garden",
  text: "The garden is awake, which is rude, because it is the middle of the night. Four flowers glow brighter than the rest, and a mossy stone nearby looks like it has opinions.",
  kitten: "Four flowers. Four letters. I am only a cat, but that sounds like a word.",
  objects: [
   { id: "f1", label: "glowing pink flower", kind: "flower", x: 190, y: 470, color: "#ff9ec4", say: "A petal curls back to show a letter: M. The flower looks smug about it.", get: ["l_m"] },
   { id: "f2", label: "glowing lavender flower", kind: "flower", x: 380, y: 500, color: "#c9a7ff", say: "A letter glows on the petal: O.", get: ["l_o"] },
   { id: "f3", label: "glowing peach flower", kind: "flower", x: 600, y: 480, color: "#ffd0a8", say: "Another O. The garden is very committed to the O.", get: ["l_o2"] },
   { id: "f4", label: "glowing rose flower", kind: "flower", x: 780, y: 505, color: "#ffb3d1", say: "The last petal reads N. Then the flower pretends it did nothing.", get: ["l_n"] },
   { id: "stone", label: "mossy stone", kind: "stone", x: 490, y: 520, puzzle: "p_moon", say: "The stone yawns and a path of moss unrolls toward the sky." },
   { id: "pd", label: "peeking panda", kind: "panda", x: 835, y: 520, say: "A panda peeks out, blinks, and vanishes. You have seen nothing." }
  ],
  choices: [
   { text: "Follow the moss path up to a floating library", go: "library", need: ["moon_word"], locked: "The path is still just moss. The stone wants a word first." },
   { text: "Slip toward the sound of water instead", go: "pond", set: ["took_pond"] }
  ] },
 library: { world: "library", title: "The Floating Library",
  text: "Shelves drift like slow boats. Books flap past, complaining about the draft. Somewhere a page is turning itself, and somewhere else a bookmark is pointing at something that is not there.",
  objects: [
   { id: "b1", label: "memoir book", kind: "book", x: 260, y: 300, color: "#e88fb0", say: "It is titled 'Nobody Reads Me: A Memoir'. It sniffs, loudly, and puts a tiny handkerchief to its cover." },
   { id: "b2", label: "cat facts book", kind: "book", x: 640, y: 430, color: "#b79be8", say: "'Cat Facts (Mostly Wrong)'. Fact one: cats are liquid. Fact two: this book has never been checked." },
   { id: "bm", label: "pointing bookmark", kind: "feather", x: 800, y: 190, say: "The bookmark points at the empty air between two shelves and refuses to elaborate.", get: ["bookmark"] },
   { id: "shelf", label: "whispering shelf", kind: "star", x: 470, y: 150, puzzle: "p_leaves", say: "A drop of magical ink slides off the shelf into your hands." }
  ],
  choices: [
   { text: "Take the ink to the Cloud Post Office", go: "post", need: ["ink"], locked: "The post office will not take blank letters. Maybe the shelf can help with ink." },
   { text: "Step through the gap the bookmark points at", go: "attic", need: ["bookmark"], locked: "There is nothing between those shelves. As far as you know." },
   { text: "Climb down to the pond", go: "pond" }
  ] },
 attic: { world: "library", title: "The Page Between Pages",
  text: "Behind the shelves is a very small room containing a very large silence. One page sits in the middle of the floor, waiting.",
  objects: [ { id: "pg", label: "loose page", kind: "page", x: 500, y: 380, say: "The page is blank until you hold it, then it quietly writes: 'Hello, curious reader. Few people look here.'", get: ["secret_page"] } ],
  choices: [ { text: "Slip back to the library", go: "library" } ] },
 pond: { world: "pond", title: "The Whispering Pond",
  text: "The water is so still it looks like the sky fell asleep. Bottles bob among the lily pads, and the ripples seem to be thinking about something.",
  objects: [
   { id: "bt", label: "bottle with a note", kind: "bottle", x: 220, y: 480, say: "Inside: 'Smallest wakes first, largest wakes last. Do not wake the medium one early. It is dramatic.'", get: ["pads_note"] },
   { id: "rip", label: "restless ripples", kind: "lily", x: 560, y: 500, puzzle: "p_pads", say: "All three pads settle, and a small gate of water opens in the reeds." },
   { id: "fsh", label: "little fish", kind: "butterfly", x: 790, y: 420, color: "#9fd0f0", say: "It is not a fish. It is a butterfly pretending to be a fish. It is not doing well." }
  ],
  choices: [
   { text: "Wade through the gate into the woods", go: "woods", need: ["pond_key"], locked: "The reeds hold hands and will not let you pass." },
   { text: "Go back to the garden", go: "garden" }
  ] },
 woods: { world: "woods", title: "Mischief Woods",
  text: "Lanterns hang from branches that were definitely not there a moment ago. A fox-shaped shadow follows you at a polite distance.",
  objects: [
   { id: "mu", label: "insistent mushroom", kind: "mushroom", x: 250, y: 500, color: "#f08fb0", say: "It insists it is not a mushroom. It is 'an umbrella for a very small rain.'" },
   { id: "ln", label: "flickering lantern", kind: "lantern", x: 620, y: 250, puzzle: "p_flame", say: "The lantern brightens and bows, rather grandly." }
  ],
  choices: [
   { text: "Trust the lantern and walk to the clouds", go: "post", need: ["woods_light"], set: ["trusted_lantern"], locked: "The lantern is not talking to you until you answer it." },
   { text: "Follow the fox-shaped shadow", go: "observatory", need: ["woods_light"], set: ["followed_fox"], locked: "The shadow waits. It wants you to answer the lantern first." }
  ] },
 post: { world: "post", title: "The Cloud Post Office",
  text: "A floating island holds one very tired mailbox. A butterfly in a tiny cap is delivering a letter to entirely the wrong flower.",
  objects: [
   { id: "bf", label: "messenger butterfly", kind: "butterfly", x: 300, y: 260, say: "'Wrong flower?' it gasps. 'Impossible. Flowers all look alike.'" },
   { id: "mb", label: "tired mailbox", kind: "mailbox", x: 600, y: 400, puzzle: "p_stamp", say: "The mailbox gives a satisfied clunk and a ribbon of stamps ripples out." }
  ],
  choices: [ { text: "Climb the ribbon up to the observatory", go: "observatory", need: ["stamped"], locked: "The ribbon will not unroll for an unstamped letter." } ] },
 observatory: { world: "observatory", title: "The Little Observatory",
  text: "The dome opens like an eyelid. Stars drift in loose clusters, waiting to be told what they are.",
  objects: [
   { id: "ts", label: "brass telescope", kind: "telescope", x: 270, y: 430, say: "Through the lens, three shapes wink: a Cat, a Crown, a Fish. One line is scratched on the tube: 'Cat first, then Crown, then Fish.'", get: ["scope_note"] },
   { id: "map", label: "star map", kind: "star", x: 640, y: 200, puzzle: "p_stars", say: "The stars slide into a line, like a sentence finally agreeing with itself." }
  ],
  choices: [ { text: "Follow the starlight down to a meadow", go: "meadow", need: ["stars_aligned"], locked: "The stars are still arguing." } ] },
 meadow: { world: "meadow", title: "The Butterfly Meadow",
  text: "Butterflies drift between glowing flowers, collecting wishes. One lands on your shoulder and waits, with the patience of someone who has all night.",
  objects: [
   { id: "b_hid", label: "hidden butterfly", kind: "butterfly", x: 770, y: 250, color: "#ffd48a", showIf: ["secret_page"], say: "A golden butterfly lands on the loose page you carry. 'Ah. A reader of hidden pages,' it whispers. 'A hidden chapter awaits.'" },
   { id: "bf1", label: "pink butterfly", kind: "butterfly", x: 300, y: 300, color: "#ff9ec4", say: "It circles your head three times. This is apparently how butterflies say hello." }
  ],
  choices: [
   { text: "Wish for a truly excellent snack", go: "final", set: ["wish_snack"] },
   { text: "Wish that every unread book finds a reader", go: "final", set: ["wish_books"] },
   { text: "Wish for a hundred more adventures", go: "final", set: ["wish_more"] }
  ] },
 final: { world: "final", title: "The Final Letter",
  text: "A quiet clearing. A small table. A lantern, a panda, a cat, and one letter waiting for {name}.",
  variants: [
   { if: ["secret_page"], text: "A quiet clearing, and a table with two letters: one for the reader, and one slipped in from the hidden chapter. The panda is reading over your shoulder. The cat is asleep on the second letter. Everyone is pretending this is normal." },
   { if: ["followed_fox"], text: "You took the shadow's shortcut, and the clearing seems pleased about it. A small table, a lantern, a panda, a cat, and one letter, still warm, waiting for {name}." }
  ],
  objects: [
   { id: "lt", label: "the letter", kind: "envelope", x: 500, y: 420, big: true,
     say: "Dear {name},\n\n[This is a placeholder. Open editor.html, find the scene called 'final', and write your own words in this letter. Write something true and specific. Keep it sincere, keep it a little funny, and keep it entirely yours.]\n\nYour friend,\n{from}" },
   { id: "hs", label: "hidden second letter", kind: "page", x: 700, y: 440, showIf: ["secret_page"], big: true, say: "A bonus note from the hidden chapter. Replace this with something extra: a joke, a thank-you, a wish for the year ahead." }
  ],
  choices: [ { text: "Close the book and begin again", go: "@restart" } ] }
},
puzzles: {
 p_moon: { type: "text", prompt: "Carved in the stone: 'Four flowers, four letters. Say what they spell and I will stop glowering.'", answers: ["moon"], needs: ["l_m", "l_o", "l_o2", "l_n"],
  locked: "The stone glowers. It wants you to look at the four glowing flowers first.",
  hints: ["Mrrp. Have you poked every glowing flower yet?", "The letters came in the order the flowers grow, left to right: M, O, O, N.", "Four letters. Something hanging over the garden at night. Look up."],
  wrong: "The stone does not move. It looks unimpressed.", win: "The stone sighs: 'Fine. Correct. Insufferable.'", reward: ["moon_word"] },
 p_leaves: { type: "choice", prompt: "The shelf whispers: 'Which of these has leaves, a spine, and a grudge about being left unread?'", options: ["A fern", "A book", "A hedgehog"], answers: ["A book"],
  hints: ["Mrrp. Leaves and a spine. You are standing in a library.", "Not the fern. The fern has leaves but no opinions."],
  wrong: "The shelf coughs politely. 'No. Think about where you are.'", win: "The shelf glows warmly. 'Finally, someone gets it.'", reward: ["ink"] },
 p_pads: { type: "sequence", prompt: "Wake the lily pads in the right order.", options: ["Medium pad", "Large pad", "Small pad"], answers: ["Small pad", "Medium pad", "Large pad"], needs: ["pads_note"],
  locked: "The ripples shrug. Maybe one of the bottles knows what they want.",
  hints: ["Mew. Bottles carry messages. Have you read the one by the reeds?", "Smallest wakes first. Largest wakes last. Medium goes in the middle, where it can be dramatic."],
  wrong: "The medium pad rolled its eyes and went back to sleep. Try again.", win: "All three pads curtsy and the reeds part.", reward: ["pond_key"] },
 p_flame: { type: "choice", prompt: "The lantern purrs: 'I light the dark, but I fear the rain. I am hot, but I have never met the Sun. What am I?'", options: ["A flame", "A firefly", "A mushroom"], answers: ["A flame"],
  hints: ["Mrow. The riddle is about the lantern's own insides.", "Hot, bright, and afraid of rain. A very small fire."],
  wrong: "The lantern flickers sadly. 'Not quite.'", win: "The lantern brightens and bows.", reward: ["woods_light"] },
 p_stamp: { type: "text", prompt: "On the mailbox: 'I sit in the corner of every letter, yet I travel the world. What am I?'", answers: ["stamp", "a stamp"],
  hints: ["Mrrp. Look at the corner of an envelope.", "It is small and sticky and it pays for the trip."],
  wrong: "The mailbox rattles. 'That is not what I am looking for.'", win: "The mailbox clunks in approval.", reward: ["stamped"] },
 p_stars: { type: "sequence", prompt: "Connect the constellations in the right order.", options: ["The Fish", "The Cat", "The Crown"], answers: ["The Cat", "The Crown", "The Fish"], needs: ["scope_note"],
  locked: "The map is blank. Maybe the telescope has something to show you.",
  hints: ["Purrr. The telescope has the order written on its tube.", "The Cat goes first, naturally. Cats always go first."],
  wrong: "The stars scatter and start again. Rude, but fair.", win: "The stars slide into a line and glow.", reward: ["stars_aligned"] }
}
};
function loadStory() { try { const s = JSON.parse(localStorage.getItem("ub_story")); if (s && s.scenes && s.worlds) return s; } catch (e) {} return JSON.parse(JSON.stringify(window.DEFAULT_STORY)); }
