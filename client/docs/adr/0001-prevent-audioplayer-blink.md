# ADR-0001 – Prevent AudioPlayer Blink via Stable Row IDs & Direct Track Passing

## Context/Forces

In our track management UI, each row’s identity directly impacts component lifecycle. Currently, React Table defaults to using the array index as a key. When the track list changes: on adding, updating, or deleting - every subsequent row's index shifts, triggering React to unmount and remount those rows. This unmount/remount cycle breaks inline components like `<AudioPlayer>`, interrupting playback and degrading user experience.

At the same time, fixing that insertion case isn’t enough, our page logic relies on four separate helper functions (`openEdit(id)`, `openDelete(id)`, etc.) that each perform an `Array.find()` to recover the full `Track` object from its `id`. This pattern introduces redundant lookups, inflates boilerplate, and couples component rendering to id-based state resolution.

We do not want to introduce heavy state libraries or large refactors just to solve this.  
We only need a small, clear change that removes the blink and simplifies the code we already find verbose.

## Decision

We will stabilise row keys and pass complete `Track` objects to action handlers.

1. **Row key stability**

   Add the following to the `useReactTable` configuration:
   ```ts
   getRowId: (row) => row.id;
   ```

This ensures React always uses the immutable database `id` as the key, rather than the array index.

2. **Direct object passing**
   
   Change all column and table handler signatures from:
   ```ts
   (id: string) => void
   ```

   to:

   ```ts
   (track: Track) => void
   ```
   Then update each cell to call its handler with `row.original`.

3. **Remove redundant look-ups**
   
   Delete the four `openXxx(id)` callbacks and invoke state setters (`setEditingTrack`, `setDeletingTrack`, etc.) directly with the passed `Track` object.

## Rationale

Eliminates remounts: because the parent no longer performs a find() on every change, React keeps the same Track reference; the row and its `<AudioPlayer>` stay mounted, so music playback no longer stops.

Less code & indirection: removing four useCallback wrappers and four find() calls shrinks the page component and makes data flow easier to follow.

Fewer renders: avoiding extra state updates and look-ups slightly reduces render time on large tables.

### Rejected alternatives

Row-level memo/key juggling: would also curb remounts but adds complexity and still leaves the parent look-ups in place.

Global player state: persisting the player outside the table was over-engineering for this small glitch.

## Status
Proposed - 29.05.2025

## Consequences

Positive:

- **user experience**: audio playback and UI remain stable during CRUD actions;
- **cleaner component interface**: handlers accept one well-defined argument, prop drilling of IDs and extra look-ups are gone;
- **less boilerplate**: deleted +-40 lines of callback/lookup code and state setters are passed straight to the table;
- **Performance**: fewer find() calls and state changes mean slightly faster renders on large datasets.

Negative/Trade-offs:

- **larger prop payloads**: full `Track` objects (rather than lightweight `id` strings) are passed down;
- **potential stale snapshots**: if a track is updated externally (e.g. via real-time socket), a modal holding an earlier `Track` object may become outdated (not valuable for now);  
- **tighter coupling**: both the table and page components depend on the exact `Track` shape, any change to that interface demands coordinated updates.

Overall, the adjustment is tiny in code but big in usability, and it keeps the architecture clean.
