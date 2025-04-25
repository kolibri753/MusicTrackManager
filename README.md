# HummingTrack – Music Tracks Manager

**Genesis Front-End School 3.0**

A web app for managing music tracks: create, edit, upload, play, delete, search, sort, filter, with optional extras like bulk-delete, waveform visualization and dark/light theme.

---

## Features

**all mandatory features implemented:**

- create, read, update & delete tracks;
- upload & remove audio files;
- list view with pagination, sorting & filtering;
- search with debounce (title, artist, album);
- inline playback of uploaded files;

**optional extras:**

- bulk delete;
- audio-wave visualization;
- dark/light theme switcher;
- HummingTrack branding & slogan;

---

## development flow

if you’d like to follow my step-by-step development, see:  
https://github.com/kolibri753/MusicTrackManager

---

## getting started

### client app

**prerequisites:**

- node.js v20.13.1;

**install & run:**

```bash
git clone https://github.com/kolibri753/MusicTrackManager.git
cd MusicTrackManager/client
npm install
npm start
```

open http://localhost:3000 in your browser;

### backend

**prerequisites:**

- Node.js v20.13.0 or higher (check with `node -v`; use NVM if needed);

**install & run:**

```bash
cd MusicTrackManager
npm install
npm run dev
```

**api documentation:** http://localhost:8000/documentation

---

## tasks implemented

**main tasks:**

- open create-track modal;
- input track metadata (title, artist, album, genres as removable tags);
- validate required fields & cover image URL format;
- save metadata without file upload;
- open edit-track modal with pre-filled data;
- submit metadata updates to API;
- upload audio file (MP3/WAV) with type & size validation;
- remove or replace uploaded file;
- play uploaded file inline via HTML5 audio + waveform;
- delete track with confirmation;
- display list view with pagination, sorting, filtering;
- debounce search by title, artist, album;

**optional extras:**

- bulk delete multiple tracks;
- audio-wave visualization;
- dark/light theme toggle;
- logo & slogan branding;

---

## backend modifications

added/updated files for **“get all distinct artists”** endpoint:

- `src/controllers/tracks.controller.ts`;
- `src/utils/db.ts`;
- `src/routes.ts`;

---

## archive contents

- `client/` – React SPA (no `node_modules`);
- `package.json` at root;
- `README.md`;
- **do not include** server code provided by evaluators.

---

> © 2025 HummingTrack – Let the music take flight
