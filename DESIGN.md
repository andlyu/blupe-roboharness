---
name: RoboHarness × BluPe
description: Functional workspace for running and watching RoboHarness on remote YAM robots.
colors:
  blue: "#174ea6"
  blue-hover: "#0d3c85"
  focus: "#1a73e8"
  selection: "#e8f0fe"
  warning: "#8b4e0a"
  stop-ink: "#a61b14"
  available: "#188038"
  unavailable: "#8e939a"
  ink: "#202124"
  muted: "#5d6269"
  line: "#dadddf"
  paper: "#f8f9fa"
  white: "#ffffff"
  stage: "#202124"
  stage-ink: "#f1f3f4"
  stage-muted: "#c4c7cb"
  camera-well: "#171819"
  input-line: "#bdc1c6"
  secondary-line: "#b6bec8"
  hover: "#edf1f6"
  disabled: "#d8dfe8"
  disabled-ink: "#4c5764"
  keypoint: "#d3e3fd"
  keypoint-ink: "#062e6f"
typography:
  headline:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  control:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  compact:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  detail:
    fontFamily: "Arial, Helvetica, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  code:
    fontFamily: "monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  compact: "4px"
  control: "6px"
  action: "7px"
  inspection: "8px"
  surface: "12px"
  marker: "50%"
spacing:
  tight: "6px"
  control-gap: "12px"
  mobile-page: "20px"
  panel: "24px"
  workspace-gap: "30px"
  page: "36px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "13px 14px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
  button-primary-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.disabled-ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.compact}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
  button-stop:
    backgroundColor: "{colors.white}"
    textColor: "{colors.stop-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.action}"
    padding: "12px"
    width: "100%"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "11px"
    width: "100%"
  navigation:
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  navigation-active:
    backgroundColor: "{colors.selection}"
    textColor: "{colors.blue}"
  camera-tab:
    typography: "{typography.detail}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
  camera-tab-active:
    backgroundColor: "{colors.selection}"
    textColor: "{colors.blue}"
  run-panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.surface}"
    padding: "{spacing.panel}"
  camera-stage:
    backgroundColor: "{colors.stage}"
    textColor: "{colors.stage-ink}"
    rounded: "{rounded.surface}"
  inspection-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
    typography: "{typography.detail}"
    rounded: "{rounded.inspection}"
    padding: "16px"
---

# Design System: RoboHarness × BluPe

## Overview

**Creative North Star: "The Robot Workspace"**

RoboHarness inherits BluPe’s functional Operate vocabulary: quiet Arial typography, a white workspace, restrained blue controls and a charcoal camera stage. The actual camera image carries the visual weight; surrounding surfaces help a researcher observe the station and make a deliberate next action.

Controls are plain and specific. Task entry, editable runner details, approach, planning model and execution mode remain distinct. Persistent inline explanations describe the current condition, its cause and the available recovery action. Status text, timestamps and actual events carry meaning; decoration does not imply physical readiness or progress.

The interface uses flat tonal grouping and short color transitions. It has no decorative animation or progress percentage. Empty, interrupted, uncertain and unverified states stay visible in the same calm visual language as the operational workspace.

**Key Characteristics:**

- Actual, uncropped camera imagery leads the workspace.
- Blue marks actions, focus and selection; text explains state.
- Flat white and pale-gray surfaces group controls without shadows.
- Persistent inline status and event timestamps make waits inspectable.

This document applies only to this standalone research integration. It captures the implementation in `app/globals.css`, `app/page.tsx`, `components/launch-progress.tsx`, `components/run-progress.tsx` and `components/run-library.tsx`, under `PRODUCT.md` and `docs/WEBSITE-DIRECTION.md`. It records the established code-first Operate system; there is no approved visual comp.

> Evidence scope: the supplied finish-review handoff reported **ship for F1–F3 at UI-only scope**. The documenter inspected the desktop (1440px), mobile (390px) and actual-viewport (779px) captures, plus the explicitly synthetic non-actuating lifecycle fixture. Physical execution, startup timing and retained replay remain unverified. These captures establish UI appearance, not hardware acceptance.

## Colors

The frontmatter is the normative extraction of implemented color values. Descriptive names below explain their roles; CSS custom properties retain their incumbent names where they exist.

### Primary

- **Action Blue** (`blue`): enabled Run, links, selected camera controls and action text. **Deep Action Blue** (`blue-hover`) is the enabled Run hover state.
- **Focus Blue** (`focus`): the visible keyboard outline. **Selection Wash** (`selection`): active navigation and camera-tab backgrounds; selection is also carried by `aria-current` or `aria-pressed`.

### Secondary

- **Readiness Brown** (`warning`): launch-status headings and pending text. The exact heading carries the state; this accent alone is not a readiness signal.
- **Stop Red** (`stop-ink`): Stop text and inline failures. The Stop outline is a separate thin red stroke, captured in the component sidecar.
- **Available Green** (`available`) and **Unavailable Gray** (`unavailable`): the station-status dot, always paired with the station explanation.

### Neutral

- **Workspace White** (`white`), **Panel Paper** (`paper`) and **Divider Gray** (`line`): the page, control grouping and structural rules.
- **Reading Ink** (`ink`) and **Secondary Ink** (`muted`): main text and supporting explanations.
- **Stage Charcoal** (`stage`), **Camera Well** (`camera-well`), **Stage White** (`stage-ink`) and **Stage Gray** (`stage-muted`): the camera shell, image letterboxing and legible feed metadata.
- **Input Line** (`input-line`), **Secondary Line** (`secondary-line`) and **Hover Wash** (`hover`): form outlines, secondary button outlines and ordinary button hover.
- **Disabled Fill** (`disabled`) and **Disabled Ink** (`disabled-ink`): the disabled Run state, kept fully opaque for legibility.
- **Point Wash** (`keypoint`) and **Point Ink** (`keypoint-ink`): numbered image-point markers, with a white border.

**The State in Words Rule.** Pair every status color with explicit text; an available-station dot is not proof that the runtime can execute.

## Typography

**Body and heading font:** Arial (with Helvetica and sans-serif fallbacks). **Data font:** platform monospace. No display face or external font dependency is part of the system.

The hierarchy is compact and operational. The frontmatter records the desktop text roles. Page headlines reduce on mobile (25px); task and identity fields increase on mobile (16px) so text entry remains readable without browser zoom. The brand is a quiet text lockup (20px, reducing to 18px in the compact header), rather than an oversized display statement.

- **Headline:** the workspace and reading-page title; medium weight with tight tracking.
- **Title:** run-panel and section headings. Replay titles use a smaller medium-weight variation (17px, 500).
- **Body:** ordinary reading copy and native control inheritance.
- **Action / Control / Compact:** Run and Stop labels, text entry/navigation, and secondary actions respectively.
- **Label / Detail / Code:** form labels, status and camera metadata, then native-pixel coordinates and structured event/configuration data. Numeric timestamps use tabular figures where implemented.
- **Reading measure:** method prose stays within a readable line length (70–75ch). Supporting camera and form explanations are shorter.

**The Plain Type Rule.** Use the incumbent sans hierarchy for controls and explanations; reserve monospace for pixel coordinates and recorded structured data.

## Layout

The page uses a centered workspace container (maximum width 1480px, including its horizontal padding), a separate full-width header and a quiet footer rule. The current workspace puts the camera before the task panel in document order. The camera grows while the run panel stays narrow on wide screens; content below it carries current-run events, method context and acceptance links. Reading views use a narrower container (980px). This is the current surface composition, not a requirement that every future screen reproduce the same grid.

| Width | Implemented structure |
| --- | --- |
| 1600px and wider | Flexible camera column plus 350px run panel; 30px gap. |
| 1051–1599px | Flexible camera column plus 330px run panel; 30px gap. |
| 1001–1050px | Flexible camera column plus 300px run panel; 20px gap, compact header and panel padding. |
| 761–1000px | One grid column; camera and run panel are full width. The 779px reviewed viewport uses this structure. |
| 760px and narrower | One vertical flow with a 28px camera-to-panel gap; 20px page inset. Header wraps into brand and navigation rows; station selection spans the heading width. |

The frontmatter spacing entries are extracted recurring intervals, not a newly introduced CSS spacing framework. Desktop main padding is 34px above and 36px at the sides; mobile main padding changes to 26px above and 20px at the sides. Run-panel insets are 24px by default, 20px in the compact desktop range and 22px on mobile. Controls wrap rather than overlap. At the mobile breakpoint, buttons, selects, summaries and the runner-confirmation row have a touch-target minimum (44px).

The image region holds a wide frame (16:9) using `object-fit: contain`. It never crops a wrist, object or image edge to fill the well. Fullscreen removes the outer radius and centers the camera stage.

**The Full Frame Rule.** Contain camera imagery inside the stage; preserve every source pixel and let unused space remain dark.

## Elevation & Depth

No shadows are implemented. Pale panel tone separates task controls from the page; the dark stage separates camera content; thin rules group identity, status, method, events and replay entries. Focus is a crisp outline (3px with a 3px offset), not a glow. Do not infer extra UI surface colors from the sidecar’s derived tonal-ramp previews.

**The Flat Surface Rule.** Separate regions with tone, spacing and thin borders; the current system has no shadows.

## Shapes

The shape language is restrained: softly rounded camera/run surfaces, smaller rounded fields and buttons, circular status dots and numbered point markers. The frontmatter holds the extracted radius steps. Controls keep thin solid borders where present; inspection uses its own intermediate radius. Camera media is clipped only by the outer stage, while its source image is contained inside the well. Avoid giving ordinary content the visual mass of the camera stage.

## Components

### Buttons

Run is the sole filled primary action in the task panel. It spans the panel and changes from muted disabled fill to Action Blue only when the runtime, station, task and confirmed runner details allow submission. The disabled Run style deliberately retains full opacity; other disabled buttons use reduced opacity (.55). Enabled Run darkens on hover.

Secondary actions use a thin gray outline and modest inset. Stop uses a red outline on white and remains next to the active/uncertain run controls; its label changes while the Stop request is pending. Ordinary buttons and links transition background/color over a short interval (.16s, ease-out); reduced-motion preference removes transitions. Keyboard focus remains visible on every control.

### Camera selection

Compact camera buttons use the Selection Wash for the pressed view and text labels for overhead/left-wrist/right-wrist. They are selection controls, not decorative tags. The inspect toggle sits alongside them and reports its pressed state. Mobile sizing preserves the larger touch target.

### Cards / Containers

The run panel is a flat pale grouping; it contains task entry, separate approach/model facts, limits, execution mode, runner details and persistent launch status. The camera stage is the dominant dark container. The inspection panel is a lighter subordinate region directly below the camera controls. Current-run and history areas use dividers and lists rather than a repeated dashboard-card grid.

### Inputs / Fields

Native task, name, email and select controls remain visibly editable, with white backgrounds, thin gray strokes and the control radius. Labels stay above text fields; compact settings align their label/value pairs. Task text can resize vertically and is limited by the implementation. Runner details are an expandable disclosure; identity is editable, confirmation resets when edited, and no unknown identity is invented. Keep private email out of documentation snippets.

### Navigation

The text brand anchors a quiet header. The current Workspace / Runs / Method & evidence button has a pale blue selection background and `aria-current`; external source links use a small outward-arrow icon. The paper link hides in the compact header while primary navigation remains. At mobile widths navigation takes a second row and uses a square-bottom active-tab treatment.

### Camera and image inspection

The stage labels the station, camera and feed condition. Its metadata distinguishes latest published frames, frozen inspection and interrupted feed. A source capture timestamp is labeled “Captured”; only a receive timestamp is labeled “Received.” An unavailable first frame gets a textual empty state; an interrupted feed can retain the last actual image while stating that it is reconnecting. It never inserts replacement footage.

Inspection freezes that actual image. Pointer selection uses the contained image’s native pixel geometry, and a keyboard path accepts whole-pixel X/Y coordinates inside the source bounds. Numbered markers and the coordinate list identify at most eight retained points. Changing station/camera or exiting inspection clears point selection. The explanation stays visible: these pixels have no depth or robot coordinates and do not command motion.

**The Actual Frame Rule.** Inspection freezes the displayed actual frame and labels image pixels; selected points do not imply depth, robot coordinates or motion.

### Launch and current-run status

Launch status persists beneath Run and says why submission is blocked or what the runtime is doing. Launch progress distinguishes submitting, queue admission, preparation, measured Home readiness, execution, stopping and unresolved submission. It lists Run clicked, queue entered, lease admitted, Home feedback confirmed and last-event times only when those records exist. No percentage or speculative countdown substitutes for events. An unresolved submission explains that the original request may have been accepted and directs the operator to verified status and Stop before another Run.

Current-run status, queue position, observed provider outcome, event log and recorded configuration remain inspectable below the workspace. Events retain time, message and structured details, wrap long content and scroll within a bounded log (340px). Approach “RoboHarness” remains separate from the actual planning/vision model label and execution-mode metadata. A completed status means execution ended; footage determines the object outcome.

**The Event Evidence Rule.** Show lifecycle labels and timestamps only from the corresponding observed runtime events; a fixture is not an execution record.

### Runs and replay

The run library filters by station and RoboHarness. Each row offers retained replay or an explicit check-recording action, with task, runner and episode attribution. Empty history, loading, unavailable recording and configuration gaps are written states. An available matching HTTPS recording uses native video controls and seeking; these components exist in code, but actual retained replay has not yet been verified. Do not populate history with unrelated runs.

## Do's and Don'ts

### Do:

- **Do** keep actual footage uncropped and distinguish captured time from received time.
- **Do** keep inline cause and recovery text visible beside non-ready, interrupted and unresolved states.
- **Do** preserve keyboard focus, native form controls and the mobile touch-target minimum.
- **Do** show runner attribution separately from approach, underlying model and execution mode.
- **Do** retain honest empty history and unavailable-recording states until matching RoboHarness evidence exists.
- **Do** treat the sidecar tonal ramps as derived swatch previews; the extracted frontmatter values remain the implemented palette.

### Don't:

- **Don’t** substitute mock imagery, unrelated historical footage or decorative progress for the selected station’s actual state.
- **Don’t** present image-point inspection as 3D grounding or a command to the robot.
- **Don’t** equate execution completion with successful object outcome; the footage must be assessed.
- **Don’t** use color alone to communicate readiness, error, selection or availability.
- **Don’t** publish private runner email in examples, public evidence or design-system snippets.
- **Don’t** extend this integration’s design decisions into the parent meeting experiment’s PRODUCT.md or DESIGN.md.
