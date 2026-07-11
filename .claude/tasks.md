# Tasks

## In Progress
- [ ] Generate `index.<folder>.json` files across `src/`, mirroring folder structure. Each entry: purpose, propsIn (name/type/required/default/description), propsOut/emits, dependencies, usedBy (reverse dependency — requires full-tree import scan, not per-file), sideEffects, gotchas, relatedData (db.json schema link where applicable). 

## Backlog


## Done
- [x] Fix empty `src` crash on `<Img>` when no image uploaded yet (AnimateImage.jsx)