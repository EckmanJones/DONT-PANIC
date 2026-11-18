# Standalone Windows app — DONT PANIC!!!

Same classroom handoff as **Literal Order**: build a zip, drop on Desktop, double-click the `.exe`. Offline after that.

Details: [`windows/README.md`](./windows/README.md).

## Quick path

```bat
cd accounting-game-mice
npm install
cd windows
npm install
npm run pack:win
```

Rename/copy `windows\dist\Dont-Panic-*-win-x64.zip` → Desktop **`Dont-Panic.zip`**, extract to **`Dont-Panic\`**, run **`DONT PANIC!!!.exe`**.

CI artifact name: **`dont-panic-windows`**.
