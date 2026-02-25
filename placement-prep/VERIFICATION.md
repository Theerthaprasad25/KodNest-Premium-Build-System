# JD Analysis — Verification Steps

## 1. Skill Extraction

**Sample JD to test** (paste into Resources → Analyze Job Description):

```
We are looking for a Full Stack Developer at TechCorp.

Requirements:
- Strong DSA and problem-solving skills
- Experience with React, Node.js, and Express
- Knowledge of SQL, MongoDB, and PostgreSQL
- Familiarity with AWS, Docker, and Kubernetes
- Understanding of REST APIs and GraphQL
- Python or Java programming experience
- CI/CD and Linux experience
```

**Expected extracted skills:**
- Core CS: DSA
- Languages: Java, Python
- Web: React, Node.js, Express, REST, GraphQL
- Data: SQL, MongoDB, PostgreSQL
- Cloud/DevOps: AWS, Docker, Kubernetes, CI/CD, Linux

**Verify:** Results page shows "Key Skills Extracted" with tags grouped by category.

---

## 2. History Persistence

1. Analyze a JD (Resources → paste JD → Analyze)
2. Note the company/role and readiness score
3. Refresh the page (F5 or Ctrl+R)
4. Go to **History** in the sidebar
5. **Verify:** Your analysis appears with date, company/role, and score
6. Click the entry
7. **Verify:** Results page opens with the same analysis
8. Refresh on Results page
9. **Verify:** Results still show (URL has `?id=...` so it persists)

---

## 3. Readiness Score

| Input | Points |
|-------|--------|
| Base | 35 |
| +5 per detected category (max 6 categories) | up to 30 |
| Company provided | +10 |
| Role provided | +10 |
| JD length > 800 chars | +10 |
| **Cap** | 100 |

**Test:** Use the sample JD above with company "TechCorp" and role "Full Stack Developer". Extend the JD to > 800 chars (add more requirements) to get the +10. Expected: 35 + 30 + 10 + 10 + 10 = 95 (or 100 if capped).

---

## 4. General Fresher Stack

**Minimal JD** (no keywords):

```
Looking for a fresher to join our team. Good communication skills required.
```

**Verify:** Results show "General fresher stack" under Key Skills Extracted.

---

## 5. Offline

- No external APIs or scraping
- All logic runs in the browser
- Data stored in localStorage
- Works offline after first load

---

## 6. Interactive Skill Toggles & Live Score

1. Open Results for any analysis
2. In "Key Skills Extracted", each skill has a toggle: "Need practice" (default) / "I know this"
3. Click a skill toggle to switch between states
4. **Verify:** Readiness Score updates in real-time (+2 per "I know", -2 per "Need practice")
5. Refresh the page (F5)
6. **Verify:** Toggle states and score persist
7. Go to History → click the same entry
8. **Verify:** Same toggles and score

---

## 7. Export Tools

1. On Results page, find:
   - "Copy 7-day plan" (on 7-Day Plan card)
   - "Copy round checklist" (on Round-wise Checklist card)
   - "Copy 10 questions" (on 10 Likely Interview Questions card)
   - "Download as TXT" (in Export card)
2. Click each copy button → paste elsewhere → **Verify:** Plain text copied
3. Click "Download as TXT" → **Verify:** Single .txt file downloads with all sections

---

## 8. Action Next Box

1. On Results page, scroll to bottom
2. **Verify:** "Action Next" card shows top 3 weak skills (those marked "Need practice")
3. **Verify:** Suggests "Start Day 1 plan now."

---

## 9. Company Intel

**When company name is provided**, Results shows a "Company Intel" card with:
- Company name
- Industry (inferred from JD keywords or "Technology Services")
- Estimated size: Startup (<200), Mid-size (200–2000), Enterprise (2000+)
- Typical Hiring Focus (template based on size)
- Note: "Demo Mode: Company intel generated heuristically."

**Test scenarios:**

| Company   | Expected Size   |
|-----------|-----------------|
| Amazon    | Enterprise      |
| Infosys   | Enterprise      |
| TCS       | Enterprise      |
| Freshworks| Mid-size        |
| Acme Corp | Startup (unknown) |

---

## 10. Round Mapping

Round mapping changes based on **company size + detected skills**.

**Test scenario A — Enterprise + DSA:**
- Company: "Amazon", JD with "DSA"
- Expected: Round 1: Online Test (DSA + Aptitude), Round 2: Technical (DSA + Core CS), Round 3: Tech + Projects, Round 4: HR

**Test scenario B — Startup + React/Node:**
- Company: "Acme Startup", JD with "React" and "Node.js"
- Expected: Round 1: Practical Coding, Round 2: System Discussion, Round 3: Culture Fit

**Test scenario C — No company:**
- Company: (empty)
- Round Mapping still shows (uses Startup default)

**Verify:** Each round has "Why this round matters" explanation. Display is vertical timeline.

---

## 11. Input Validation (Resources)

1. Go to Resources → Analyze Job Description
2. **JD required:** Leave JD empty → Analyze button disabled
3. **JD < 200 chars:** Paste a short JD (e.g. 50 chars) → Calm warning appears: "This JD is too short to analyze deeply. Paste full JD for better output."
4. **Company and Role:** Remain optional (can analyze with JD only)

---

## 12. Schema Consistency

Every saved entry has:
- `id`, `createdAt`, `company`, `role`, `jdText`
- `extractedSkills`: `{ coreCS, languages, web, data, cloud, testing, other }` (all arrays)
- `roundMapping`: `[{ roundTitle, focusAreas[], whyItMatters }]`
- `checklist`: `[{ roundTitle, items[] }]`
- `plan7Days`: `[{ day, focus, tasks[] }]`
- `questions`, `baseScore`, `skillConfidenceMap`, `finalScore`, `updatedAt`

---

## 13. Default "Other" When No Skills

**Minimal JD** (no keywords): "Looking for fresher. Good communication."

**Verify:** `other` = ["Communication", "Problem solving", "Basic coding", "Projects"]. Plan/checklist/questions adapt.

---

## 14. Score Stability

- **baseScore:** Computed only on Analyze. Never changes after save.
- **finalScore:** Changes only when user toggles skill confidence.
- **Toggle test:** Analyze → note baseScore → toggle skills → finalScore updates → refresh → persists. baseScore unchanged.

---

## 15. History Robustness (Corrupted Entry)

**Simulate:** In DevTools → Application → Local Storage, edit `placement-prep-analysis-history` to add a malformed entry (e.g. `{"id":"x"}` without `jdText`).

**Verify:** History loads valid entries. Corrupted ones skipped. Message: "One saved entry couldn't be loaded. Create a new analysis."
