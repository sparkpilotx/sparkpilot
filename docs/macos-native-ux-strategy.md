## macOS‑Native UX Strategy (Draft)

### Goals
- Deliver consistent macOS‑native UX across all windows.
- Default to OS surfaces for platform affordances; renderer focuses on content.
- Enforce the approach via code structure, tokens, and codegen rules.

### Pillars
- **OS‑first**: menus, dialogs, sheets, tray, notifications use Electron native APIs.
- **Token‑driven UI**: renderer visuals derive from `globals.css` tokens synced to system appearance.
- **Renderer content‑only**: Treat UI in renderer as in‑window content only. Keep it subtle, token‑driven, and aligned with macOS HIG (spacing, typography, motion).
- **Minimal, validated bridges**: preload exposes small, Zod‑validated APIs for OS concerns; domain data flows via tRPC.
- **Strict security defaults**: `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, CSP locked down.

### Responsibilities
- **Main (Electron)**
  - Window creation with macOS conventions.
  - Native menu, tray, context menu, dialog orchestration.
  - System appearance sync (dark mode, accent, contrast, reduced motion).
  - tRPC server and Prisma (main‑only).
- **Preload**
  - Expose `native` APIs: `appearance`, `windowFocus`, `dialogs`, `contextMenu`, `shell`, `clipboard`.
  - All payloads Zod‑validated.
- **Renderer**
  - React UI using Tailwind v4 + shadcn/ui with tokens.
  - `AppearanceProvider` to sync CSS variables.
  - Shared window chrome using `.app-region-*`.
  - tRPC client for domain calls; no Node/Electron imports.

### Default Window Specification
- `titleBarStyle: 'hiddenInset'`, `transparent: true`, `vibrancy: 'sidebar'`, `visualEffectState: 'active'`, `roundedCorners: true`.
- `trafficLightPosition: { x: 12, y: 14 }`; `.app-region-drag` on non‑interactive chrome only.
- Security: `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`.
- Preload: `dist/preload/native.js` with only the minimal bridges above.

### Rendering & Styling
- Single source of truth: `src/renderer/src/styles/globals.css`.
  - CSS vars: `--accent`, `--ring`, tokens for `bg-*`, `text-*`, `border`, selection, states.
  - Attach `data-theme="light|dark"` to `:root` for color‑scheme.
- Components:
  - Use CVA + `cn()`; variants: `variant` (primary|secondary|outline|ghost), `size` (sm|md|lg).
  - shadcn/ui for complex widgets (Dialog, Popover, Menu, Tooltip…).
  - No hardcoded colors/shadows; respect macOS density and motion.
- Accessibility:
  - Keyboard parity, visible focus via tokenized `ring`.
  - Respect `prefers-reduced-motion`, high contrast.

### Minimal shadcn/ui set (curated)
- Include now (tech-only):
  - Popover, Tooltip, DropdownMenu
  - Dialog (for in-window flows only; use native Electron `dialog` sheets for OS prompts)
  - Tabs, Select, ScrollArea
  - Accessibility helper: Radix `VisuallyHidden`
- Defer/avoid for now:
  - Toast (prefer OS `Notification`), Menubar/ContextMenu (use native `Menu`/`menu.popup()`)
  - AlertDialog, Sheet clones (use native sheets)
  - Command, HoverCard, Accordion, NavigationMenu, ToggleGroup, Calendar/DatePicker, Resizable panes
- Our primitives (tokenized + CVA, no shadcn import):
  - Button, Input, Textarea, Checkbox, RadioGroup, Switch, Slider, Progress, Label, Separator, Card, Skeleton


### IPC/tRPC Strategy
- Domain data: tRPC only (`src/main/trpc/*`, HTTP batching + SSE).
- OS/windowing: preload bridges only, Zod‑validated input/output.
- CSP: `default-src 'self'`, `connect-src` includes tRPC base URL.

### Cursor Codegen Rules (Authoritative)
- **Windows**
  - Use the shared window factory; don’t hand‑roll `BrowserWindow` options.
  - Always set `.app-region-drag` on non‑interactive chrome; wrap controls in `.app-region-no-drag`.
- **Styling**
  - Only use tokens from `globals.css`. No inline styles or hardcoded colors.
  - Do not customize scrollbars; keep native scroll behavior.
  - Treat UI in renderer as in‑window content only; keep it subtle, token‑driven, and aligned with macOS HIG (spacing, typography, motion). Avoid replacing native dialogs/menus with custom components.
- **Components**
  - Functional components with explicit `Props` and explicit return types; avoid `React.FC`.
  - Accept `children` only when needed; keep props minimal and typed.
- **State**
  - Local state via `useState`/`useReducer`; feature context if needed; Zustand only for global app state.
- **Main/Preload boundaries**
  - Renderer never imports Node/Electron.
  - All preload API inputs/outputs must be Zod‑validated.
- **UX primitives**
  - Use native `dialog` for file pickers, save dialogs, message boxes (attach as sheets to a window).
  - Use `Menu` for app/context menus; rely on macOS roles for standard commands.
  - Use `Notification` for OS‑level events; avoid in‑window toasts for system notifications.
- **Security**
  - Keep `contextIsolation`, `sandbox`, `nodeIntegration` flags as defaults.
  - No new libraries without approval; respect pinned versions.
- **Tests**
  - Add Playwright/Electron runner checks for dark mode, accent application, keyboard nav on critical flows.

### Code Infrastructure Plan
- **Main**
  - `src/main/windows/create-window.ts`: standard window factory with macOS defaults and security flags.
  - `src/main/native/appearance.ts`: emits `{ isDarkMode, reduceMotion, highContrast, accentColorHex }`; broadcasts changes.
  - `src/main/native/menu.ts`: app menu (roles), tray builder (click to open, context menu).
  - `src/main/native/context-menu.ts`: role‑based context menus for text/input/link.
  - `src/main/native/dialogs.ts`: thin wrappers for `showOpenDialog`/`showSaveDialog`/`showMessageBox` with optional sheet attachment.
- **Preload**
  - `src/preload/native.ts`: expose `appearance`, `windowFocus`, `dialogs`, `contextMenu`, `shell`, `clipboard`; all outputs Zod‑validated.
- **Renderer**
  - `src/renderer/src/providers/appearance.tsx`: subscribes to `native.appearance`; sets CSS vars and `data-theme`.
  - `src/renderer/src/components/window-chrome.tsx`: shared chrome layout with drag/no‑drag regions and tokens.
  - `src/renderer/src/styles/globals.css`: define tokens; utilities for `.app-region-*`.

### Directory Layout
- `src/main/windows/*` – window factories and window‑specific wiring
- `src/main/native/*` – OS integrations (menus, dialogs, context menu, appearance)
- `src/preload/native.ts` – exposed OS bridges
- `src/main/trpc/*` – domain APIs (server)
- `src/renderer/src/providers/*` – app providers (`AppearanceProvider`)
- `src/renderer/src/components/*` – primitives and chrome
- `src/renderer/src/styles/globals.css` – tokens and utilities
- `src/renderer/src/lib/trpc.ts` – tRPC client config

### Adoption Playbook
- **New window**
  - Use `createWindow({ route, width, height })`.
  - Include `WindowChrome` in layout; apply `.app-region-*` properly.
  - Wrap app in `AppearanceProvider`.
- **Native dialogs**
  - Call `window.native.dialogs.*` with schemas; attach to current window for sheets.
- **Context menus**
  - Determine kind (`text` | `input` | `link`); call `window.native.contextMenu.show(kind)`; main will `popup()` with role items.
- **Menus and tray**
  - Set application menu once at startup via `setAppMenu()`.
  - Use `setTray(() => showMainWindow())` with a simple role menu.

### Review Checklist (Definition of Done)
- **Visual**: uses tokens only; respects dark mode, accent, focus/blur states; motion follows system.
- **Accessibility**: keyboard navigation works; focus rings visible; ARIA present via Radix.
- **macOS conventions**: native menus, sheets, roles; title bar and traffic lights aligned; context menus native.
- **Security**: BrowserWindow hardened; preload surface minimal and validated; CSP aligned with tRPC.
- **Boundaries**: no Node/Electron in renderer; all OS actions via preload; domain via tRPC.

### Testing & Validation
- **Unit**: Zod schemas for preload APIs; token helpers.
- **Integration**: Playwright driving Electron build to verify:
  - Dark/light theme swap updates tokens.
  - Accent color propagates to focus ring and key components.
  - Standard menu roles operate (Undo/Redo/Cut/Copy/Paste).
  - Dialog sheets attach to the right window.
- **Manual**: HIG spot checks, contrast checks, reduced motion.

### Risks & Mitigations
- Vibrancy performance on low‑end GPUs → feature flag to fall back to opaque backgrounds.
- Accent color inconsistencies across macOS versions → normalize to RGB hex; provide fallback token.
- Overuse of custom widgets → enforce native dialogs/menus through code review and lints.

### Rollout Plan
- Phase 1: Implement infra (window factory, appearance bridge, menus/tray, context menu, preload APIs, tokens, provider).
- Phase 2: Migrate existing windows to `WindowChrome`, replace custom modals with native dialogs, wire context menus.
- Phase 3: Accessibility and interaction polish; add tests; performance tuning and flags.

### Electron 31→37 macOS deltas (adopt)
- **Context menus: Writing Tools & Services (36+)**
  - When popping up menus for editable text, pass the focused frame to enable system Writing Tools/Services.
  - Example:
    ```ts
    import { BrowserWindow, Menu } from 'electron';
    const win = BrowserWindow.getFocusedWindow();
    const menu = Menu.buildFromTemplate([{ role: 'copy' }, { role: 'paste' }]);
    menu.popup({ window: win!, frame: win!.webContents.focusedFrame });
    ```
- **Menu sublabels on macOS ≥ 14.4 (35.5+)**
  - Use `sublabel` for supplemental hints where useful. Degrades gracefully on older macOS.
  - Example: `{ label: 'Open', sublabel: '⌘O', click: onOpen }`.
- **System screen capture picker (32.x+)**
  - Prefer the macOS system picker for screen capture via `desktopCapturer`/`setDisplayMediaRequestHandler` rather than custom UIs.
  - Keep entitlements and prompts native; request thumbnails only when needed for performance.
- **Vibrancy transitions (35.x)**
  - Smoothly animate vibrancy changes (e.g., on focus/blur or theme change) using the updated vibrancy APIs.
  - Apply subtle transitions aligned with HIG; avoid heavy motion when `reduceMotion` is enabled.
- **Optional CSS corner smoothing (37.x)**
  - Where supported, consider `-electron-corner-smoothing` alongside `border-radius` to better match macOS corner curvature.
  - Guard behind feature detection and keep usage minimal for consistency.
- **Preload script management (35.x)**
  - Migrate from deprecated `session.getPreloads/setPreloads` to the redesigned preload script APIs (`registerPreloadScript`, `unregisterPreloadScript`, `getPreloadScripts`).
- **Extensions API move (36.x)**
  - Use `session.extensions.*` for extension operations instead of legacy `session.*` methods/events.
- **Image API rename (37.x)**
  - Replace `NativeImage.getBitmap()` with `NativeImage.toBitmap()`.
- **Theme signaling**
  - Continue to rely on `nativeTheme`'s `updated` event and `systemPreferences` accent/contrast events in the appearance bridge; these remain canonical across platforms.

### Migration checklist (31→37)
- Replace any usage of `session.getPreloads/setPreloads` → use preload script registration APIs.
- Update `NativeImage.getBitmap()` → `toBitmap()`.
- Audit `session` extension calls → move to `session.extensions`.
- Update context menu popups for editable areas to pass `webContents.focusedFrame` to enable Writing Tools/Services.
- Where appropriate, add `sublabel` to menu items (macOS ≥ 14.4) for clarity; keep labels concise.
- Prefer system screen capture picker; avoid custom overlays.
- Keep vibrancy transitions subtle; animate changes thoughtfully and respect `reduceMotion`.
- Optionally adopt CSS corner smoothing where supported; keep token-driven rounding consistent.
### Open Questions
- Support strategy for non‑macOS platforms (feature flags, fallbacks)?
- Which windows need non‑standard chrome (frameless popovers, compact panels)?
- Any user preferences to override vibrancy or accent use within the app?
