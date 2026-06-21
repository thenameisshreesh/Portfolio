# Portfolio Sections Overhaul — Sections 1–5

## Summary

Major redesign of Sections 1–5 of the data-structure portfolio:

| Section | DS | What Changes |
|---|---|---|
| 1 — Hero | **Stack** | Auto-pop animation on load; layout shift (stack RIGHT, popped cards LEFT); real stack visual |
| 2 — About | **Array** | Horizontal array blocks layout; all blocks visible (lower opacity), active block in front |
| 3 — Skills | **Tree** | Step-by-step edge+node generation with typed delays; root → branches → leaves sequentially |
| 4 — Projects | **Graph** | True 3-D graph with nodes, visible edges, active node pops to front in 3D space |
| 5 — Experience | **Linked List** | Same horizontal scroll-based traversal but with card-comes-to-front animation + pointer visual uniqueness |

Section 6 (Queue/Contact) — **no changes**.

---

## Open Questions

> [!IMPORTANT]
> No blocking questions. All design decisions are made below. Proceeding to plan.

---

## Proposed Changes

### Section 1 — StackHero.jsx (MAJOR REWRITE)

#### [MODIFY] StackHero.jsx

**Layout:**
- Stack container moves to the **RIGHT** side (flex-row layout)
- Popped cards appear on the **LEFT** side stacked vertically
- Stack has proper open-top visual: two vertical walls + a bottom floor, no top border — like a real stack/bucket

**Auto-pop on load:**
- On mount, after 0.4s delay, pop card 0 ("Hi, I'm Shreesh") to the left
- After 1.0s, pop card 1 ("Full Stack Developer")  
- After 1.7s, pop card 2 ("AI + Futuristic UI Builder")
- Cards accumulate on the left side (index 0, then 1, then 2 below)
- Scroll-based pop continues to work as before (or is disabled since auto-pop completes)

**Stack visual:**
- Real stack look: two tall vertical neon walls (`border-left`, `border-right`, `border-bottom`), open top
- Cards inside show index `[0]`, `[1]`, `[2]` from bottom to top
- "TOP ↑" label floats above the stack open-top
- Memory address on the left wall
- Stack floor glows

**Popped cards left panel:**
- Each popped card slides from the stack (right) to the left panel
- Cards stack vertically: 0th card at top, 1st below, 2nd below that
- Each card shows: `pop()` badge, content, subtitle

---

### Section 2 — ArrayAbout.jsx (MAJOR REWRITE)

#### [MODIFY] ArrayAbout.jsx

**Layout:**
- Show ALL 3 array blocks horizontally visible at once
- The active block (index 0, 1, or 2) is:
  - Full opacity, scaled up slightly, glowing border
  - Has `[0]`, `[1]`, `[2]` index badge on top
- Non-active blocks are visible but at **30–40% opacity**, slightly smaller
- Horizontal scroll-driven: scroll right → move to next block
- Blocks look like real array memory cells:
  - Square/rectangular boxes with index badge at top
  - Memory address below the index
  - Vertical dividers between blocks
  - "ARRAY[0]", "ARRAY[1]", "ARRAY[2]" visible
- Active block shows full content; inactive blocks show only the key label

**Navigation:**
- User scrolls vertically to advance through the array (same as before)
- Blocks slide left/right smoothly as active index changes

---

### Section 3 — TreeSkills.jsx (MAJOR REWRITE)

#### [MODIFY] TreeSkills.jsx

**Dynamic sequential generation:**
1. When section scrolls into view, start sequential animation:
   - `t=0ms` — Root node "Skills" appears (circle pulses in)
   - `t=400ms` — Left edge draws from root → "Programming" node, then "Programming" node appears
   - `t=900ms` — Right edge draws from root → "Web" node, then "Web" node appears
   - `t=1400ms` — Far-right edge draws from root → "Tools & DB" node, then appears
   - `t=1900ms` — "Programming" children edges draw one by one, nodes appear
   - `t=2500ms` — "Web" children edges draw
   - `t=3100ms` — "Tools & DB" children draw

**Visual:**
- Use SVG with animated `stroke-dashoffset` for edges (already done but make ordering correct)
- Nodes pop in with a scale spring animation
- Each node has a glowing ring pulse when it first appears
- Leaf nodes show a circular skill arc that fills up after they appear

---

### Section 4 — GraphProjects.jsx (FULL REWRITE)

#### [MODIFY] GraphProjects.jsx

**True 3D Graph:**
- Use CSS `perspective` and `transform-style: preserve-3d`
- Nodes are positioned in 3D space (x, y, z coordinates)
- SVG overlay draws **visible edges** (lines) between all interconnected nodes
- Active node zooms forward (z+300, scale 1.2), others go back (z-100, scale 0.8)
- Edges glow/pulse between the active node and its connected nodes
- Non-active nodes dim but remain visible in 3D space

**Node design:**
- Round nodes with project icon + title
- Connected by glowing animated lines
- When a node is active, its edges to other nodes light up
- Camera pan: when clicking a node, the whole graph subtly rotates so that node faces the user

**Layout:**
- Nodes in a 3D arc/sphere arrangement (hexagonal scatter)
- Active node: front-center, full size, full opacity, expanded card info below
- Others: smaller, behind, semi-transparent

---

### Section 5 — LinkedListExperience.jsx (ENHANCE)

#### [MODIFY] LinkedListExperience.jsx

**Same base as array (horizontal scroll traversal) but with LL-specific uniqueness:**
- Each node is a box divided into TWO compartments: `DATA | NEXT →`
- The `NEXT →` compartment has an animated arrow that glows when active
- Pointer `ptr` slides above nodes on scroll
- NULL node at end: dashed border, "∅ NULL" text
- When a node becomes active, it **pops forward** (scale 1.1, z-translate, glow) — like the graph section
- The pointer is a visible triangle+stem that moves smoothly
- Between nodes, show memory address arrows (like linked list diagram)

---

## Verification Plan

### Automated / Browser Testing
- Run `npm run dev` and open `http://localhost:5173`
- Verify Section 1 auto-pop fires on load with correct delays
- Verify Section 2 shows all 3 blocks with correct opacity behavior
- Verify Section 3 tree builds sequentially node-by-node
- Verify Section 4 shows a 3D graph with visible edges
- Verify Section 5 pointer moves on scroll with pop-forward effect

### Manual Checks
- Reload page → Section 1 auto-pop repeats
- Scroll through all sections checking animation quality
- Verify Section 6 (Queue) is untouched
