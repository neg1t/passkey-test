---
name: frontend-conventions
description: Use when working in this repo on frontend pages, models, or local UI state, especially for Effector-based page flows and project-specific React component conventions
---

# Frontend Conventions

## Overview

This repo uses Effector as the default state layer for page logic. Page slices should keep React components render-focused and move data loading, modal state, and other runtime orchestration into `*.model.ts` files.

## Core Rules

- React components with props must receive a single `props` argument and destructure inside the function body.
- Page models are named `*.model.ts`.
- `model/` contains Effector logic only: gates, events, effects, stores, and samples.
- Slice-local mocks, DTO-like types, selectors, and helper builders live in `lib/`, not in `model/`.
- For admin flows, prefer DTOs, enums, and dictionary models from `shared/api/gen`; remove local mock models after the last real usage disappears.
- Backend API contracts, request/response DTOs, and endpoint services must come from generated Kubb code in `shared/api/gen`. Do not create manual API wrappers, adapters, or duplicate DTOs in `shared/api`, `pages`, `entities`, or `lib` for backend endpoints; fix/regenerate the Kubb source instead.
- Prefer Effector stores and events over local `useState` / `useEffect` for page state, modal state, loading state, and route-driven state.
- Pages connect models with `useGate(...)` and `useUnit(...)`; child components stay presentational.
- Group `useUnit([...])` calls by one local workflow; do not put unrelated page data, modal state, actions, and loading flags into one catch-all array.
- Pair related store/event units together when they represent one local workflow, for example `[activePhotoGroupId, setActivePhotoGroup]`, `[openPasswordModal, closePasswordModal]`, or `[user, userLoading]`.
- Name every `*.pending` store with `Loading`, for example `$userLoading = fetchUserFx.pending`, `$updateUserLoading = updateUserFx.pending`, or `$deleteUserLoading = deleteUserFx.pending`.
- Prefer content-level smart components over broad prop drilling when the required state already lives in Effector.
- Local `useState` is acceptable for strictly local, ephemeral UI control state such as controlled `antd` image preview `open/current`.

## React Props Pattern

```tsx
type MyComponentProps = {
  firstProp: string
  secondProp: number
}

export const MyComponent: FC<MyComponentProps> = (props) => {
  const { firstProp, secondProp } = props

  return <div>{firstProp}</div>
}
```

## Effector Pattern

```ts
const PageGate = createGate<string | undefined>()

const fetchDataFx = createEffect<string | undefined, Data | null>(
  async (id) => {
    return await mockFetch(getData(id))
  },
)

const $data = createStore<Data | null | undefined>(undefined).on(
  fetchDataFx.doneData,
  (_, data) => data,
)

sample({
  clock: PageGate.state.updates,
  target: fetchDataFx,
})
```

## Modal State

- Use `createModal()` from `shared/lib/effector-factories/create-modal.ts`.
- Store active payload and active tab/group in Effector stores.
- Open/close modal through Effector events.
- Do not keep shared modal state in local component state.

## When to Extract to `lib`

- Static mocks for temporary backend-less screens.
- Local types used only by one page slice.
- Helper builders for mock rows, tags, photo groups, and selectors by route params.

## Common Mistakes

- Destructuring props directly in component arguments.
- Putting mock datasets into `model/`.
- Managing modal visibility with `useState` when the modal is part of page workflow.
- Calling effects directly from UI handlers instead of routing actions through Effector events.
- Putting unrelated model units into one large `useUnit([...])` array.
- Naming pending stores `$submitting`, `$pending`, or `$updatingUser` instead of using a `Loading` name.
- Splitting one local Effector workflow into many isolated `useUnit(...)` calls when grouped destructuring is clearer.
- Passing model-backed state through multiple component layers instead of reading it directly in the content component that owns the workflow.
- Moving ephemeral widget-only control state into Effector when it has no page or business meaning.
- Creating manual API files or duplicate DTOs on top of the Kubb generated client instead of using generated service methods and types.
