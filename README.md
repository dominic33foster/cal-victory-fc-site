# Cal Victory FC

Static homepage build for a rebranded soccer club site based on the structure of [bricenosoccer.com/home](https://www.bricenosoccer.com/home).

## Preview locally

Run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Publish publicly

This repo is now set up for GitHub Pages deployment through [`.github/workflows/deploy.yml`](/Users/dominicbriceno/Documents/New%20project/.github/workflows/deploy.yml).

Because this workspace has no Git remote yet, the remaining steps are:

1. Create a GitHub repository for this site.
2. Add it as the remote for this local repo.
3. Commit and push the files to the `main` branch.
4. In the GitHub repository, open `Settings` -> `Pages`.
5. Under `Build and deployment`, choose `GitHub Actions` as the source.
6. Wait for the `Deploy Cal Victory FC Site` workflow to finish.
7. Your site will publish at the GitHub Pages URL GitHub provides.

If you want a custom domain later, GitHub Pages also supports that.

## Files

- `index.html` contains the page structure and content.
- `styles.css` contains the responsive visual system and layout.
- `script.js` handles the mobile navigation, reveal animations, footer year, and new player registration form behavior.
- `assets/cal-victory-crest.svg` is the custom crest used in the site header and hero.
- `.github/workflows/deploy.yml` deploys the static site to GitHub Pages on each push to `main`.
- `.nojekyll` prevents GitHub Pages from trying to process the site with Jekyll.

## Notes

- Contact details now reflect Cal Victory FC's current email, phone, mailing address, and Facebook page.
- The registration form currently validates in the browser, saves draft progress locally, and prepares families for the club's GotSport registration flow. It does not yet send submissions to a central database or admin dashboard.
- The only remaining registration placeholder is the direct Cal Victory FC GotSport URL.
- The page is self-contained and does not require a build step.
