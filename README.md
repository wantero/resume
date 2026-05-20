# William Pavei Antero - Professional Resume

Static GitHub Pages resume for international opportunities.

## Files

- `index.html`: public web resume.
- `styles.css`: responsive and print-ready styling.
- `resume.md`: ATS-friendly Markdown version for recruiters and application portals.
- `tools/validate-page.mjs`: optional Playwright validation script for local visual QA.

## Publish With GitHub Pages

1. Create a GitHub repository, for example `wantero/resume`.
2. Add these files to the repository root.
3. Commit and push to GitHub.
4. In GitHub, open `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `Deploy from a branch`.
6. Select the `main` branch and `/root`, then save.
7. GitHub will publish the page at `https://wantero.github.io/resume/`.

If the repository is named `wantero.github.io`, GitHub Pages can publish it at `https://wantero.github.io/`.

## Local Preview

Open `index.html` in a browser, or run a simple static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Optional Validation

If Playwright is installed locally, validate desktop and mobile rendering with:

```bash
node tools/validate-page.mjs http://127.0.0.1:8000/index.html /tmp
```

## Privacy Note

This resume includes direct email and phone contact information. For a public repository, consider replacing the phone number with LinkedIn contact routing if reducing spam exposure is important.
