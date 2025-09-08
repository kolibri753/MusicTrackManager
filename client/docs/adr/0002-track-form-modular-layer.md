# ADR-0002 – Modular Form Layer with **react-hook-form** + Zod

## Context/Forces

The legacy `<TrackForm>` component had grown into an all-in-one block that:
- fetched data (useGenres), managed UI state, and ran manual validation all in one place;
- validation rules and Track fields were copied in several files;
- every new input meant more local state boilerplate;
- hooks returned different shapes, so every page reshaped the data.

With new forms on the roadmap, the current approach would make each page harder to maintain and test. We need an architectural refactor that:
- enforces single responsibility per module;
- centralises validation in one source of truth;
- standardizes list-fetching hooks on a shared `{ list, loading, error }` interface;
- remains lightweight - no context providers, no global state library.

## Decision

We will introduce a dedicated **Form Layer** and supporting types:

1. **Zod schema**
   *Create* `src/schemas/track.ts`

   ```ts
   export const trackFormSchema = z.object({
     title:  z.string().min(1, "Title is required"),
     artist: z.string().min(1, "Artist is required"),
     album:  z.string().optional(),
     genres: z.array(z.string()).min(1, "Select at least one genre"),
     coverImage: z.preprocess(
       v => (typeof v === "string" && v.trim() === "" ? undefined : v),
       z.string().url("Invalid URL").optional()
     ),
   });
   export type TrackFormData = z.infer<typeof trackFormSchema>;
   ```

2. **Split form into container + fields**
   *Create* `TrackForm/fields.tsx` (pure presentational) and convert the old component into `TrackForm/index.tsx`, which now only wires **react-hook-form** + Zod and exposes `initialData`, `genres`, `onSubmit`, `onCancel`.

3. **Resource typing & hooks**
   *Add* `types/resource.ts` with

   ```ts
   export interface ResourceState<T> { list: T[]; loading: boolean; error: boolean }
   export interface RefreshableResourceState<T> extends ResourceState<T> { refetch(): void }
   ```

   and adapt `useGenres`/`useArtists` to return those shapes.

4. **Move fetching up**
   Page components own `useGenres()`/`useArtists()` and pass the resulting `ResourceState` down, eliminating hidden side-effects inside the form layer.

5. **Service & type alignment**
   `TrackService` now imports `TrackFormData` from the schema barrel (`@/schemas`), so the payload validated at runtime is *exactly* what we send to the backend.

6. **House-keeping**
   *Add dependencies* `react-hook-form`, `@hookform/resolvers`, `zod`.

## Rationale

**Strong typing & single source of truth**: the schema defines both runtime rules and compile-time `TrackFormData`, eliminating drift between the UI and API layer.

**SOLID compliance**: clear separation - container handles form logic, fields handle UI, pages fetch data.

**Testability**: fields are now stateless, so Storybook/snapshot tests cost near-zero setup. The schema can be unit-tested independently.
**Extensibility**: new forms clone only 2 files and a schema, not 150 LOC of imperative code.
**Consistency**: `ResourceState` prevents ad-hoc tri-state props from diverging again.

### Rejected alternatives:
- keep manual useState + regex validation: still too much duplicated code;
- switch to Formik/React Final Form: heavier bundle, team (me) already comfortable with RHF;
- add global context for genre and artist lists: extra indirection for a local concern;
- do nothing: future forms would be even harder to build and maintain.

## Consequences

Positive:

- **Uniform developer workflow**: every form `schema -> useTrackForm -> fields`;
- **Less code churn**: +- 150 lines deleted;
- **Runtime safety**: invalid payloads are rejected before hitting the API.

Negative/trade-offs:

- **dependency weight** – +13 kB (gzipped) for RHF + Zod in the client bundle;
- **learning curve** – read about grok RHF’s `register`/`Controller` patterns and basic Zod syntax.

Overall, the architectural refactor front-loads a modest amount of work and bundle size but pays it back with clearer boundaries, safer data flow, and cheaper future evolution of the UI.
