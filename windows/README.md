# DONT PANIC!!! — Windows archive

Offline **Electron** wrapper — same classroom pattern as **Literal Order**.

**No installer.** Zip → extract → double-click **`DONT PANIC!!!.exe`**. Offline after unzip.

## Build

```bat
cd DONT-PANIC
npm install
cd windows
npm install
npm run pack:win
```

Output: `windows\dist\Dont-Panic-v0.1.0-win-x64.zip`  
CI copies that to **`Dont-Panic-v0.1.0.zip`**.

**Optional portable single `.exe`:**

```bat
npm run pack:win:portable
```

## Classroom handoff (Desktop overwrite)

| What | Put on Desktop as |
|------|-------------------|
| Zip | `Dont-Panic-vX.Y.Z.zip` |
| Extracted folder | `Dont-Panic-vX.Y.Z\` |
| Run | `DONT PANIC!!!.exe` |

Unsigned — SmartScreen may warn once (**More info → Run anyway**).
