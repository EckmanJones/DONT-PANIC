# Push this project to GitHub

This agent cannot create new GitHub repositories with the current token.
Create an **empty** private repo, then push:

1. On GitHub: **New repository** → name `DONT-PANIC` → **Private** → do **not** add README/license.
2. Then:

```bash
cd /agent/repos/DONT-PANIC
git remote add origin https://github.com/EckmanJones/DONT-PANIC.git
git push -u origin main
```

After that, open this folder as its own Cursor project / Cloud Agent environment (not Class-Notes).
