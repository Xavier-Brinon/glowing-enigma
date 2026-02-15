To start a new project—such as a **Gallery SPA using TanStack**—you
must shift your mindset from being a programmer to being a
**"micromanager of a team of insanely brilliant but also bloody stupid
experts"**. This approach replaces "vibe coding" with a structured
lifecycle managed through four distinct AI agent profiles.

### **Phase 1: Creating the Agent Profiles**
Before writing any code, you use **Claude Desktop** to generate the
"System Prompts" that define each agent's personality and constraints.
You should not use a generic prompt; instead, tell Claude Desktop the
specific project details (TanStack, SPA, Gallery) so it can tailor the
agent's expertise.

1.  **The Requirements Analyst:**
    *   **Profile:** An expert in business analysis and user
        experience who "interviews" you to eliminate ambiguity.
    *   **Goal:** To produce a `requirements.md` (or `proposal.md` in
        OpenSpec) that contains success criteria and constraints.
    *   **System Prompt Instruction:** "You are a requirements
        analyst. Gather information and constraints to produce a
        document a solution architect can use".

2.  **The Solution Architect:**
    *   **Profile:** A technical lead expert in **TanStack**, React,
        and architectural patterns (like gRPC or MVVM).
    *   **Goal:** To read the `requirements.md` and produce a
        `spec.md` (or `design.md`), which breaks the project into
        components, implementation phases, and specific tasks.
    *   **System Prompt Instruction:** "You are a solution architect.
        Read the requirements and engage with the user to design the
        solution and plan the implementation".

3.  **The Developer:**
    *   **Profile:** A meticulous coder who follows **Test-Driven
        Development (TDD)** and writes heavily commented code.
    *   **Goal:** To execute the `spec.md` in the **smallest
        increments possible**, creating a new git branch for every
        single task.
    *   **System Prompt Instruction:** "You are a developer. Work in
        small increments. Write tests first, then make them pass.
        Create a git branch for every task".

4.  **The Reviewer:**
    *   **Profile:** A "picky" technical auditor who enforces coding
        standards and looks for edge cases.
    *   **Goal:** To analyze the developer's work using `git log` and
        `git diff` and produce a **transient `comments.md` file** for
        the developer to address.
    *   **System Prompt Instruction:** "You are a technical reviewer.
        Analyze commits for correctness, style, and missed edge
        cases".

---

### **Phase 2: Project Initialization & Environment Setup**
Once profiles are ready, set up your workspace:

1.  **Initialize Claude Code:** In your terminal, run `claude` and
    then `/init` to create a `claude.md` file.
2.  **Set Standards:** In `claude.md`, define your **TanStack coding
    style**, build commands (e.g., `npm run dev`), and team
    guidelines.
3.  **Configure MCP Servers:** Attach **Context 7** to allow agents to
    access documentation for TanStack and web APIs, and **Serena** to
    allow agents to search code symbols efficiently via LSP.
4.  **Initialize OpenSpec:** Run `openspec init` and select
    `claude-code`. This creates the `specs`, `changes`, and `tasks.md`
    structure needed to track your progress.

---

### **Phase 3: The Step-by-Step Workflow**

**Step 1: Requirements Gathering (The Analyst)**
Run Claude CLI with the Analyst prompt: `claude --system-prompt-file analyst.md`. Spend an hour or two answering its questions about the gallery's features (e.g., Lightbox, filtering, infinite scroll) until it produces the `requirements.md`.

**Step 2: Technical Planning (The Architect)**
Switch to the Architect persona. It will analyze your requirements and populate the **OpenSpec `design.md`**. It should break the SPA into phases, such as:
*   *Phase 1:* Project scaffolding with TanStack Query and Router.
*   *Phase 2:* Image fetching and grid layout.
*   *Phase 3:* Detailed view and Lightbox.

**Step 3: Feature Implementation (The Developer)**
For the first task (e.g., "Setup TanStack Query"):
1.  Use OpenSpec to create a "change" (e.g., `openspec new-change add-query`).
2.  Start the Developer persona and use the command **`/opsx apply add-query`**.
3.  The Developer will write the tests, then the code, and commit to a new branch.

**Step 4: Quality Control (The Reviewer)**
1.  Exit the developer session and start the **Reviewer** persona.
2.  Ask it to review the branch. It will generate a `comments.md`.
3.  Switch back to the **Developer** to address the comments.
4.  **Repeat** this loop until the Reviewer is satisfied, then merge the branch.

### **Crucial Micromanagement Rules**
*   **Context Limit:** Run `/context` often. If you exceed **100,000 tokens**, exit and restart the session to keep the AI from becoming "stupid" or stuck.
*   **Total Resets:** If the AI "cocks it up," perform a `git reset --hard` and make it try the task again from a fresh session.
*   **Documentation:** Ensure all code is commented; the Developer persona is perfect for this task.
