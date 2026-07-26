# Known Limitations & Future Roadmap (v1.0)

While MoodVerse is fully functional and production-ready, the following roadmap items exist for future phases (v1.1+).

## 1. Local Dataset Parsing
- backend loads embedded dataset files (`indian movies.csv` and `spotify_tracks.csv`) on startup for fast lookup.
- **Future Plan**: Migrate static CSV datasets directly into MongoDB collections with vector search.

## 2. Recommendation ML Fine-Tuning
- Current recommendations use curated emotional heuristic mappings.
- **Future Plan**: Fine-tune custom collaborative filtering models based on user click-through patterns.
