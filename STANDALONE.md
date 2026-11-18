# Standalone Windows zip — DONT PANIC!!!

**No installer.** Same handoff as **Literal Order**: zip → Desktop → extract → double-click `.exe`. Offline after that.

Prefer the **[double-click HTML](./WEB.md)** for classmates who are not on Windows.

## Classroom handoff

1. Download **`Dont-Panic-vX.Y.Z.zip`** (CI artifact `dont-panic-windows-vX.Y.Z`, or build below).
2. Put it on the Desktop as **`Dont-Panic-vX.Y.Z.zip`**.
3. Extract to **`Dont-Panic-vX.Y.Z\`**.
4. Run **`DONT PANIC!!!.exe`**.
5. Maximize / project.

## Build

```bat
npm install
cd windows
npm install
npm run pack:win
```

Details: [`windows/README.md`](./windows/README.md).
