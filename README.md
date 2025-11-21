# Ashes Predictions 2025

Welcome to the official leaderboard for the SYCC Ashes Predictions 2025 competition. This site tracks the predictions and scores of all participants as the series unfolds.

## Competition Details

**Entry Fee:** $20  
**Status:** Entries are now closed.

### Scoring System
- **1 point** for correct series result
- **1 further point** for exact score
- **1 point** for each correct runs scorer / wkt taker

### Tiebreaker
Total runs scored in the 1st innings of the 1st Test.

---

## Developer Information

This project is a static website built with React, TypeScript, and Vite. It uses TailwindCSS for styling.

### Prerequisites
- Node.js (Latest LTS recommended)
- pnpm

### Getting Started

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:shashanktomar/sycc-ashes-2025-predictions.git
    cd sycc-ashes-2025-predictions
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The app will be available at `http://localhost:5173`.

### Building for Production

To build the project for production:

```bash
pnpm build
```

The output will be in the `dist` directory.

### Linting

To run the linter:

```bash
pnpm lint
```

## Data Pipeline

The application uses a robust data pipeline to fetch real-time cricket scores and update the leaderboard.

### Source
- **Provider:** Cricbuzz.com (Web Scraping)
- **Method:** `cheerio` is used to scrape match data, scores, and player statistics directly from the match scorecard page.
- **Frequency:** Updates run hourly via GitHub Actions.

### Automation
- **Script:** `scripts/update-scores.ts` handles fetching, parsing, and deduplicating data.
- **Workflow:** `.github/workflows/update-scores.yml` schedules the script execution.
- **Data Storage:** Processed data is saved to `src/data/series-data.json`, which the frontend consumes.

### Scoring Logic
Points are calculated dynamically in `Leaderboard.tsx` based on:
1.  **Series Winner:** 1 point (England/Australia/Draw).
2.  **Exact Score:** 1 point (e.g., 3-1).
3.  **Leading Run Scorer:** 1 point (England & Australia).
4.  **Leading Wicket Taker:** 1 point (England & Australia).
5.  **Tiebreaker:** Total runs in the 1st Innings of the 1st Test. Participants are sorted by closeness to the actual total.

### Running the Updater Manually

To update the scores manually, run the following command with the Cricbuzz match URL:

```bash
pnpm tsx scripts/update-scores.ts <CRICBUZZ_MATCH_URL>
```

Example:
```bash
pnpm tsx scripts/update-scores.ts https://www.cricbuzz.com/live-cricket-scorecard/108787/aus-vs-eng-1st-test-the-ashes-2025-26
```
