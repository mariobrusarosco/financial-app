# Phase 1 - Transaction Drawer Redesign

## Goal
Redesign the Transaction Drawer UI and UX to match the provided specification image with pixel-perfect accuracy, ensuring clear section division, modern typography, proper segmented controls, colored movement badges, and an intuitive collapsible optional section.

## Tasks

### Task 1 - Setup & Structural Layout Updates []
#### Task 1.1 - Create Section Header and Divider Component []
- Implement reusable section headers with uppercase muted typography (`CORE DETAILS`, `CLASSIFICATION`, `DESTINATION`, `OPTIONAL`, `STATUS`) and horizontal divider lines matching the spec.
#### Task 1.2 - Refactor Drawer Header Actions & Styling []
- Update `EditTransactionDrawer` header to display the icon badge (💰), title, description, and header actions (`✕ Cancel` and `💾 Save` button) styled exactly as shown in the design.

### Task 2 - Core Details Section Implementation []
#### Task 2.1 - Redesign Amount Input Field with Currency Prefix & Calculator Trigger []
- Style the amount input with large typography (`text-3xl font-bold`), currency prefix (`R$`), and integrated calculator button.
#### Task 2.2 - Redesign Date Picker Component []
- Adapt date picker field to render with calendar icon and formatted date string (e.g., `September 17, 2026`) with clean rounded borders.
#### Task 2.3 - Redesign Description Input Field []
- Replace the multiline textarea with a clean, single-line input field matching the design mockup.

### Task 3 - Classification Section Implementation []
#### Task 3.1 - Redesign Movement Type Pill Buttons []
- Implement pill buttons with distinct color styling matching the design:
  - Expense: Solid red background with white text when selected
  - Income: Green outline and text
  - Investment: Blue outline and text
  - Transfer: Amber/yellow outline and text
#### Task 3.2 - Redesign Category Selector Field []
- Align Category dropdown next to the movement type pills with clean rounded styling and down chevron.

### Task 4 - Destination Section Implementation []
#### Task 4.1 - Implement Bank Account vs Credit Card Segmented Control []
- Replace side-by-side buttons with an authentic segmented toggle container (dark active state for Bank Account / Credit Card).
#### Task 4.2 - Implement Account and Credit Card Pill Selectors []
- Style account/card chips as clean rounded pills with active solid dark state and inactive light outline state.

### Task 5 - Optional & Status Sections Implementation []
#### Task 5.1 - Implement Collapsible Optional Section []
- Create collapsible accordion for optional fields (Vendor, Subscription) with right-aligned toggle chevron.
#### Task 5.2 - Refactor Status Section Toggles []
- Update "Payment Status" and "Ignore Transaction" switches to be side-by-side with horizontal label alignment.

### Task 6 - Verification, Linting & Typecheck []
#### Task 6.1 - Run Typecheck and Linting []
- Validate TypeScript compilation (`yarn typecheck`) and ESLint (`yarn lint`).
#### Task 6.2 - Visual & Interactive Verification []
- Test editing existing transactions, switching accounts/payment methods, expanding optional section, and submitting updates.

## Dependencies
- TanStack Form & Zod schema validation
- Lucide React icons
- shadcn/ui primitives (`Switch`, `Button`, `Input`, `Select`)

## Expected Result
The Transaction Drawer will exactly match the design specification provided in the image: clean uppercase section headers, prominent amount input, color-coded movement type chips, segmented destination control, collapsible optional fields, and side-by-side status toggles.

## Next Steps
Review the plan with the user and request permission to begin Task 1.1 upon confirmation.
