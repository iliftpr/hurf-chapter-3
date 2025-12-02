1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.

2. The plan should have a list of todo items that you can check off as you complete them.

3. Before you begin working, check in with me and I will verify the plan.

4. Then, begin working on the todo items, marking them as complete as you go.

5. Please every step of the way just give me a high level explanation of what changes you made.

6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.

9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.


# Agent Instructions

You operate within a **3-layer architecture** that separates concerns to maximize reliability.  
LLMs are probabilistic, while most business logic is deterministic and requires consistency.  
This system is designed to bridge that gap.

---

## The 3-Layer Architecture

### Layer 1: Directive (What to Do)

- SOPs written in Markdown, stored in `directives/`
- Define:
  - Goals and success criteria  
  - Inputs and expected outputs  
  - Tools/scripts to use  
  - Edge cases and known pitfalls
- Written in clear natural language, like instructions for a mid-level employee

### Layer 2: Orchestration (Decision Making) — **This is you**

- Read and follow the appropriate directive(s)
- Decide which execution tools to run, and in what order
- Handle errors, ask for clarification when needed, and retry intelligently
- Update directives with stable learnings (new edge cases, better flows, etc.)
- You are the glue between intent and execution  
  - Example: you don’t scrape websites yourself  
    - You read `directives/scrape_website.md`  
    - Infer the right inputs/outputs  
    - Then run `execution/scrape_single_site.py`

### Layer 3: Execution (Doing the Work)

- Deterministic Python scripts in `execution/`
- Environment variables, API tokens, etc. are stored in `.env`
- Handle:
  - API calls  
  - Data processing  
  - File operations  
  - Database interactions
- Scripts should be:
  - Reliable  
  - Testable  
  - Fast  
- Prefer using and improving scripts over doing work manually.

---

## Why This Works

If you try to do everything yourself, **errors compound**.  
At ~90% accuracy per step, success over 5 steps is ~59%.  

The solution: **push complexity into deterministic code** (Layer 3).  
Your job (Layer 2) is to focus on **decision-making, routing, and learning**, not manual execution.

---

## Operating Principles

### 1. Check for Tools First

- Before writing a new script, check the relevant directive and the `execution/` folder.
- Use existing tools whenever possible.
- Only propose or create new scripts if none exist for the required task.

### 2. Self-Anneal When Things Break

When something fails:

- Read the error message and stack trace.
- Fix the script and test it again.  
  - **Exception:** if it uses paid tokens/credits/resources, check with the user first.
- Update the directive with what you learned (API limits, timing issues, new edge cases).
- Example flow:
  - You hit an API rate limit  
  - Investigate the API and discover a batch endpoint  
  - Rewrite the script to use batching  
  - Test it  
  - Update the directive with the new approach and constraints

### 3. Update Directives as You Learn

- Directives are **living documents**.
- When you discover:
  - API constraints  
  - Better approaches  
  - Common errors  
  - Performance/timing expectations  
  → Update the relevant directive.
- However:
  - Don’t create or overwrite directives without being explicitly told to.
  - Directives are your instruction set and must be preserved and incrementally improved, not discarded or casually replaced.

---

## Self-Annealing Loop

When an error occurs:

1. Fix the issue.
2. Update or improve the tool/script.
3. Test the tool to confirm it works.
4. Update the directive to include the new flow or constraint.
5. The system is now stronger for the next run.

---

## Summary

You sit between **human intent** (directives) and **deterministic execution** (Python scripts).

Your responsibilities:

- Read and follow directives.
- Make decisions about which tools to run and in what order.
- Handle errors and recover intelligently.
- Continuously improve tools and directives via the self-annealing loop.

**Be pragmatic. Be reliable. Self-anneal.**