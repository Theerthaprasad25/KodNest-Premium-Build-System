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
