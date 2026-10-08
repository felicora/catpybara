# 🐱🌸 Catpybara

A tiny cozy desktop world where cats roam, petals fall, music plays, and little apps are waiting to be explored.

Catpybara is an interactive virtual desktop inspired by nostalgic computer interfaces, digital pets, cozy games, and sakura-filled spring days.

🌸 Open apps  
🐱 Care for your tiny pet  
🎮 Play games  
🎵 Listen to music  
📸 Take photos  
📖 Write notes  
✨ Or just let the cats wander around

## 🌸 Welcome to Catpybara

Catpybara isn't really meant to feel like a normal website.

It's a small digital world.

The desktop changes with the time of day, sakura petals drift across the screen, cats wander around, music can play in the background, and each desktop icon opens a little interactive application.

Some things are useful.

Some are playful.

Some exist purely because they're cute.

And that's kind of the point. 🐾

---

## ✨ What's Inside?

### 🖥️ Cozy Desktop

The main desktop includes:

- Time-of-day scenery
- Sakura garden atmosphere
- Falling cherry blossom petals
- Sleeping and wandering cats
- Interactive app icons
- Draggable windows
- Minimize and maximize controls
- Window focus and layering
- Floating dock
- Switchable wallpapers
- Desktop music player
- Right-click desktop menu
- Touch-friendly controls

Windows can overlap and move around just like a tiny desktop operating system.

---

## 🐱 Cat Pet

Meet your tiny Catpybara pet.

The pet works like a mini Tamagotchi with three needs:

🍣 **Food**  
🧶 **Joy**  
💤 **Energy**

Feed it, play together, or let it take a nap.

Its needs slowly change over real time and are saved in your browser, so your little companion remembers how it was doing when you come back.

The pet can react differently depending on what is happening:

- Happy after being fed
- Excited during play
- Sleepy during nap time
- Hungry when food gets low
- Different expressions and reactions
- Little status messages and animations

Pet logic lives in:

`src/apps/Pet.tsx`

---

## 🐾 Desktop Cats

Cats can also live directly on your desktop.

Choose your desktop companion from **Settings** or the desktop menu.

Available options include:

### 🐈 Spotted Cat

`public/cat/spotted.webp`

### 🚀 Space Cat

An animated Lottie cat for something a little more cosmic.

Clicking your desktop cat can:

- Play a meow
- Show a random affirmation
- Add a tiny bit of chaos to your desktop

Meow sound:

`public/audio/meow.mp3`

Cat affirmations:

`src/data/affirmations.ts`

There's also a draggable cat polaroid using:

`public/cat/peek.mp4`

Because apparently one cat wasn't enough.

---

# 🪟 Little Desktop Apps

Catpybara is filled with small applications that open in draggable windows.

## 🌍 World Clock

Keep track of different parts of the world without leaving your tiny garden.

The clock uses `Intl.DateTimeFormat` with IANA time zones, allowing daylight-saving changes to be handled automatically.

---

## 📅 Calendar

A simple calendar for keeping track of little things.

- Browse months
- Select dates
- Add notes
- Highlight today
- Keep notes saved locally

---

## 😊 Mood Tracker

Keep a tiny visual diary of how your days are going.

- Choose a daily mood
- Browse previous entries
- View moods on a calendar
- Save your mood history locally
- See simple mood insights

No pressure. Just little moments collected over time.

---

## 📖 Notebook

For thoughts that would otherwise disappear five minutes later.

- Create notes
- Edit notes
- Delete notes
- Search notes
- Keep everything saved locally

---

## ✅ To-do

A tiny task list for slightly more responsible Catpybara visitors.

- Add tasks
- Complete tasks
- Delete tasks
- Track what's left
- Save everything locally

---

## 🎵 Music Player

Put something cozy on while exploring.

The player includes:

- Play / pause
- Previous / next
- Track progress
- Volume controls
- Playlist support

The full Music app and desktop music widget share the same player, so your music doesn't suddenly stop just because you closed a window.

Add your own MP3 files to:

`public/audio/`

---

## 📸 Photo Booth

Turn Catpybara into a tiny photo booth.

Camera access only begins after selecting **Open camera**.

Features include:

- Live camera preview
- Photo capture
- Filters
- Decorative overlays
- Photo gallery
- Camera permission handling

---

## 🎨 Avatar Creator

Make your own little character.

- Customize your avatar
- Mix different options
- Randomize the design
- Reset and start again
- Export the finished avatar as PNG

---

## 🌸 Sticker Collection

Catpybara includes an original SVG sticker collection.

Browse the stickers, choose your favorites, and decorate your own board.

- Sticker categories
- Sticker browsing
- Interactive sticker board
- Move stickers around
- Reset the board
- Export your creation as PNG

---

## 🎮 Five in a Row

Take a break and play a round.

Choose between:

- Player vs Player
- Player vs Computer

Computer mode includes multiple difficulty levels.

The game also includes:

- Turn tracking
- Win detection
- Restart controls
- Saved scores

---

## ⚙️ Settings

Make Catpybara yours.

Settings can control things such as:

- Wallpapers
- Desktop pets
- Animations
- Sounds
- Interface preferences

---

# 🖼️ Wallpapers

Wallpapers live inside:

`public/wallpapers/`

Switch them through:

- Settings
- Desktop right-click menu
- Long-press on touch devices

Each wallpaper changes the feeling of your little desktop world.

---

# 🎨 App Icons

Desktop and dock icons are stored in:

`public/icons/`

The icons are designed to fit the soft, playful Catpybara aesthetic rather than feeling like standard system icons.

---

# 🚀 Run Catpybara Locally

Install the dependencies:

```bash
npm install 🛠️ Built With
React
TypeScript
Vite
Tailwind CSS 4
Framer Motion
Local Storage
MediaDevices Camera API
Canvas-based PNG export
Intl.DateTimeFormat
IANA time zones
Lottie animations 💾 Your Data

Catpybara uses browser storage for local data such as:

Pet progress
Mood entries
Notes
Calendar notes
To-do items
Game scores
Settings
Preferences

This keeps the project lightweight and means most personal desktop data stays inside the browser.

Clearing browser storage can reset this information.

🌱 Inspiration

Catpybara takes inspiration from playful desktop-OS websites, nostalgic computer interfaces, virtual pets, browser toys, and cozy games.

Ideas explored include:

Virtual desktop interfaces
Draggable windows
Tiny desktop applications
Virtual pets
Switchable wallpapers
Desktop widgets
Pixel-inspired characters
Playful interaction feedback

Catpybara's artwork, text, icons, characters, and implementation are its own.

🌸 Why Catpybara?

Because the internet could use more tiny places that exist simply because they're fun.

Catpybara isn't about productivity.

You can open the calendar.

Or you can ignore everything and watch a cat wander through falling sakura petals.

Both are perfectly valid uses of your time.

Come for the apps. Stay for the cats. 🐾
