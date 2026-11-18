# Experiment: DONT PANIC!!! (Ch.11 · incremental)

**Title:** **DONT PANIC!!!**  
**Syllabus lock:** Blocher **Chapter 11 only**.  
**Firm role:** planet **factory** — manufacture planets; forge WIP cores, not purchased asteroid inventory.

## Incremental loop

1. **Custom offer bank** — draw random offers; **Accept** or **Reject** (relevant CM + capacity)  
2. **Forge core (LO4)** — sell at going rate or process further with capacity left  
3. **Upgrade Bay** — spend credits on finishing bays, lower finishing VC, forge feed, offer desk, credit multiplier, board-crisis unlock  
4. **Next cycle** — stronger factory, same Ch.11 rules  

Progress (cycle, upgrades, credits) saves in `localStorage`.

Board crises (LO2 / LO3 / LO5) unlock via the **Board crisis channel** upgrade.

**Fiction wrapper:** light Guide tone — original prose only. Ch.11 wins if flavor conflicts.

**Windows:** [`STANDALONE.md`](./STANDALONE.md)

```bash
cd accounting-game-mice && npm install && npm run dev
```
