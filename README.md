# Sakura Cat Desktop
A cozy sakura-and-cat virtual desktop. React + TypeScript + Vite + Tailwind 4 + Framer Motion.

    npm install
    npm run dev

Included: desktop shell (time-of-day sky, sakura tree, falling petals, sleeping + wandering cats), draggable/minimizable/maximizable windows with focus layering, dock, World Clock (Intl.DateTimeFormat, IANA zones, DST automatic), Five in a Row (PvP / vs computer, 3 levels, score saved).
Also: Calendar (notes), Music Player (add MP3s to `public/audio/`), Photo Booth (camera only after "Open camera"), Mood Tracker, Notebook, To-do, Settings.
Also: Avatar Creator (PNG export), Sticker Collection (37 original SVG stickers, board + PNG export), and a desktop music widget sharing one audio player with the Music window.
Add an app by creating a component in `src/apps/` and adding one entry to `APPS` in `src/App.tsx`.

## Inspiration notes
Patterns borrowed from the public repo page of a desktop-OS-style project (structure only, no code or art): boot-to-desktop flow, taskbar clock, flying mood feedback, pet/terminal mini apps, pixel sprites, switchable wallpapers. All icons, sprites and text here are original.

## Redesign notes
- Wallpapers live in `public/wallpapers/` (right-click the desktop, long-press on touch, or use Settings to switch).
- Dock icons are cropped from your icon sheet into `public/icons/` (all eight, including Five in a Row).
- `public/audio/meow.mp3` plays when you click the cat.
- The pet is OFF by default. Pick Spotted Cat (`public/cat/spotted.webp`, from your GIF) or Space Cat (Lottie) in Settings or the right-click menu. Clicking it meows and shows a rotating affirmation (`src/data/affirmations.ts`). `public/cat/peek.mp4` is the draggable polaroid.
- Cat Pet is a Tamagotchi: the frame is your artwork (`public/icons/pet-device.webp`, LCD cleared), the pixel cat and screen are drawn live in `src/apps/Pet.tsx`. Needs (food, joy, energy) drift down with real time and are saved locally.
