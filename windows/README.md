# DONT PANIC!!! — Windows app

Offline **Electron** wrapper (same classroom pattern as Literal Order). Double-click **`DONT PANIC!!!.exe`** — no browser server.

Game UI is the Vite/React app in the parent folder. `npm run sync-game` builds it and copies `dist/` into `game/` before run/pack.

---

## Requirements (Windows build machine)

- **Node.js 18+**
- Internet once (Electron / builder deps)

---

## Dev run

```bat
cd accounting-game-mice
npm install
cd windows
npm install
npm start
```

---

## Build Windows zip (classroom artifact)

**On a Windows laptop:**

```bat
cd accounting-game-mice
npm install
cd windows
npm install
npm run pack:win
```

Output:

`windows\dist\Dont-Panic-0.1.0-win-x64.zip`

Unzip → double-click **`DONT PANIC!!!.exe`**. Offline after build.

**Optional portable single `.exe`:**

```bat
npm run pack:win:portable
```

→ `windows\dist\Dont-Panic.exe`

CI uploads the zip as artifact **`dont-panic-windows`**.

---

## Put on the classroom laptop Desktop (overwrite)

| What you copy | Desktop path |
| --- | --- |
| Zip for handoff | `%USERPROFILE%\Desktop\Dont-Panic.zip` |
| Extracted app folder | `%USERPROFILE%\Desktop\Dont-Panic\` |

1. Close the app if open.
2. Delete any existing Desktop **`Dont-Panic`** / **`Dont-Panic.zip`**.
3. Copy the new zip → Desktop as **`Dont-Panic.zip`**, extract to **`Dont-Panic`**.
4. Open **`Desktop\Dont-Panic\DONT PANIC!!!.exe`**.
5. Maximize / project.

Unsigned build — SmartScreen may warn once (**More info → Run anyway**).
