To start a new project—such as a **Book Tracker using TanStack**—you
must shift your mindset from being a programmer to being a
**"micromanager of a team of insanely brilliant but also bloody stupid
experts"**. This approach uses OPSX (OpenSpec's fluid workflow) to manage
a lifecycle with four distinct AI agent personas.

### **Phase 1: Creating the Agent Profiles**

Before writing any code, you use **Claude Code** to generate the
"System Prompts" that define each agent's personality and constraints.
The prompts below are tailored to the Book Tracker App tracked in
implementationPlan.org.

1.  **The Requirements Analyst:**
    - **Profile:** An expert in business analysis and user
      experience who "interviews" you to eliminate ambiguity.
    - **Goal:** To produce a `proposal.md` (the OpenSpec equivalent
      of requirements.md) that contains success criteria and constraints.
    - **System Prompt Instruction:** "You are a requirements
      analyst. Gather information and constraints to produce a
      document a solution architect can use".

2.  **The Solution Architect:**
    - **Profile:** A technical lead expert in **TanStack Start**,
      React, Node.js, and architectural patterns.
    - **Goal:** To read the `proposal.md` and produce a
      `design.md`, which breaks the project into components,
      implementation phases, and specific tasks.
    - **System Prompt Instruction:** "You are a solution architect.
      Read the requirements and engage with the user to design the
      solution and plan the implementation".

3.  **The Developer:**
    - **Profile:** A meticulous coder who follows **Test-Driven
      Development (TDD)** and writes heavily commented code.
    - **Goal:** To execute the `design.md` in the **smallest
      increments possible**, creating a new git branch for every
      task.
    - **System Prompt Instruction:** "You are a developer. Work in
      small increments. Write tests first, then make them pass.
      Create a git branch for every task".

4.  **The Reviewer:**
    - **Profile:** A "picky" technical auditor who enforces coding
      standards and looks for edge cases.
    - **Goal:** To analyze the developer's work using `git log` and
      `git diff` and produce a **transient `comments.md` file** for
      the developer to address.
    - **System Prompt Instruction:** "You are a technical reviewer.
      Analyze commits for correctness, style, and missed edge
      cases".

---

### **Phase 2: Project Initialization & Environment Setup**

Once profiles are ready, set up your workspace:

1.  **Configure MCP Servers:** Attach **Context 7** to allow agents to
    access documentation for TanStack and web APIs, and **Serena** to
    allow agents to search code symbols efficiently via LSP.

2.  **Initialize OpenSpec with OPSX:** Run:

    ```bash
    openspec init --tools claude
    ```

    This creates:
    - `.claude/skills/openspec-*/SKILL.md` (editor-agnostic)
    - `.claude/commands/` (slash commands for OPSX workflow)
    - Workflow actions: `/opsx:explore`, `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive`

    **Optional Project Config:**
    Create `openspec/config.yaml` to set defaults:

    ```yaml
    schema: spec-driven
    context: |
      Tech stack: TypeScript, React, Node.js 22.5+
      Framework: TanStack Start, Router, Query
      Database: node:sqlite (built-in)
      State: XState for book lifecycle
    rules:
      proposal:
        - Include success criteria
      specs:
        - Use Given/When/Then format
      design:
        - Include XState machine definitions
    ```

---

### **Phase 3: The Step-by-Step Workflow with OPSX**

#### **Step 1: Explore Ideas (Analyst)**

```
/opsx:explore
```

Use the Analyst persona with open-ended exploration:

- Discuss what you want to track in the Book Tracker
- Clarify features (list, add, edit, delete, status)
- Validate assumptions and constraints
- When ready, move forward with: `/opsx:new`

#### **Step 2: Create Change Proposal (Analyst + Architect)**

```
/opsx:new book-tracker
```

This creates a new change with a structured proposal. The change will
evolve through artifacts as you work.

#### **Step 3: Plan Implementation (Architect)**

You have two options:

**Option A: Fast-Forward (when you have clear vision)**

```
/opsx:ff
```

Creates ALL planning artifacts in one go:

- `proposal.md` — High-level overview and goals
- `specs/` — Detailed requirements for:
  - Book creation (title, author, heard_from, expectations)
  - Reading list management (status: to-read/reading/done)
  - Book editing and deletion
- `design.md` — Technical architecture:
  - TanStack Start structure (`src/routes/`, `src/components/`)
  - Database schema (SQLite `books` table)
  - Server functions (CRUD via `createServerFn`)
  - XState machine for book lifecycle
- `tasks.md` — Implementation checklist (Phases 1-6 from implementationPlan.org)

**Option B: Incremental Build**

```
/opsx:continue
```

Builds artifacts one at a time, showing dependencies:

1. Creates `proposal.md`
2. Then `specs/` (after proposal done)
3. Then `design.md` (after specs done)
4. Then `tasks.md` (after design done)

#### **Step 4: Implement with Developer (TDD)**

```
git checkout -b phase-1-setup
/opsx:apply
```

The Developer persona:

1. Reads `tasks.md` for the current phase
2. Creates the minimal code to complete each task
3. Writes TDD tests first, then makes them pass
4. Updates `specs/`, `design.md`, or `tasks.md` if the design needs adjustment
5. Checks off completed tasks
6. Commits after each logical step

**Example workflow for Phase 1:**

- Task: "Scaffold TanStack Start project"
- Developer creates `app.config.ts`, `package.json`, `.nvmrc`
- Writes tests (if applicable) + implements
- Commits: "phase-1: scaffold TanStack Start project"

**If the design changes during implementation:**

- Simply edit `design.md` (XState machine, routing structure, etc.)
- Run `/opsx:continue` — it will regenerate updated instructions
- Developer picks up your changes on next apply

#### **Step 5: Quality Control with Reviewer**

After implementation is complete:

1. Generate critique: `/opsx:sync` or review the change output
2. Switch to Reviewer persona
3. Analyze code correctness, style adherence, edge cases, test coverage
4. Reviewer produces `comments.md` with specific issues and recommendations

5. Developer addresses comments
   **Repeat** this loop until Reviewer satisfied. Merge branch when approved.

#### **Step 6: Archive Complete Work**

```bash
/opsx:archive book-tracker
```

Moves the change to archive and consolidates specs into main if needed.

---

### **Phase 4: The Cycle (Repeat After Each Feature)**

1. **Explore** (`/opsx:explore`) — New idea or refinement
2. **New Change** (`/opsx:new`) — Create formal change proposal
3. **Plan** (`/opsx:ff` or `/opsx:continue`)
4. **Implement** (`/opsx:apply`) — Developer TDD implementation
5. **Review** — Reviewer critique
6. **Refine** — Developer fixes issues
7. **Archive** (`/opsx:archive`) — Consolidate completed work

---

### **Crucial Operating Rules**

- **Context Limit:** Run `/context` frequently. If exceeding **100,000 tokens**, exit and restart the session to keep AI focused.
- **Branching:** Create a git branch per phase (e.g., `phase-1-setup`, `phase-2-database`). Never merge multiple phases into one branch.
- **Fix vs. Archive:** If a change needs significantly different work, start fresh with `/opsx:new`. If it's a refinement, use `/opsx:continue` to update existing artifacts.
- **Documentation:** Ensure all code is heavily commented. The Developer persona is perfect for this task.
- **No premature merging:** Only merge main after Reviewer approves the branch.
- **Token Budget:** Monitor usage. Restart if hitting token limits.
- **No pushing to remote:** Keep changes local until Reviewer approves (or unless you explicitly want to push).
- **Type Safety:** Use strict TypeScript, no `any` types (see STYLE_GUIDE.org).
- **Error Handling:** Never swallow errors silently. Validate at boundaries.

5.  **Test OPSX:** Run `/opsx:explore` to verify the skills directory was created and confirm agent behavior.

---

### **Phase 3: The Step-by-Step Workflow**

#### **Initial Setup (The Analyst + Architect)**

Unlike the legacy workflow, OPSX uses fluid actions rather than rigid phases. Start with:

**1. Requirements Discovery (Analyst)**

- Use `/opsx:explore` to discuss ideas with an AI collaborator
- Think through the feature, validate assumptions, and clarify requirements
- When ready, transition to creating a change: `/opsx:new book-tracker`

**2. Technical Planning (Architect)**

- Use `/opsx:ff` (fast-forward) to create all planning artifacts at once
- Or use `/opsx:continue` to build incrementally:
  - Creates `proposal.md` first
  - Then `specs/` (broken down by feature)
  - Then `design.md` (technical design)
  - Finally `tasks.md` (implementation steps)

**The artifacts created:**

```
proposal.md              # High-level overview and goals
specs/                   # Detailed requirements (organized by capability)
├── book-creation/spec.md
├── book-reading/spec.md
└── book-management/spec.md
design.md              # Technical architecture and approach
tasks.md              # Step-by-step implementation checklist
```

---

#### **Implementation (The Developer)**

**Single-file approach:** For each change, create one git branch and implement tasks using:

```
git checkout -b feature/book-tracker-start

# Work through tasks in order
/opsx:apply

# The Developer persona:
# 1. Reads tasks.md
# 2. Implements checks (tests → code → verification)
# 3. Checks off completed tasks
# 4. Updates artifacts if design needs adjustment
# 5. Commits after each logical step
```

**If the design changes during implementation:**

- Simply edit `design.md`
- Run `/opsx:continue` to regenerate updated instructions
- The Developer persona will see the updated design on next apply

#### **Quality Control (The Reviewer)**

**After implementation is complete:**

1. Generate critique via OPSX: `/opsx:sync` or review the change output
2. Switch to the Reviewer persona and analyze:
   - Code correctness
   - Style adherence (see STYLE_GUIDE.org)
   - Edge cases and error handling
   - Test coverage

3. Reviewer produces `comments.md` with:
   - Specific issues found
   - Line numbers where applicable
   - Improvement recommendations
   - Whether to fix inline or archive/refactor

4. Developer addresses comments
   **Repeat** quality control until Reviewer satisfied
   Merge branch when approved

**Archiving:**

```bash
/opsx:archive book-tracker
# This cleans up and consolidates changes into main specs
```

### **Crucial Micromanagement Rules**

- **Context Limit:** Run `/context` often. If you exceed **100,000 tokens**, exit and restart the session to keep the AI from becoming "stupid" or stuck.
- **Total Resets:** If the AI "cocks it up," perform a `git reset --hard` and make it try the task again from a fresh session.
- **Documentation:** Ensure all code is commented; the Developer persona is perfect for this task.
