import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface Movie {
  id: string;
  name: string;
  genre: string;
  language: string;
  rating: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  artwork: string;
  url: string;
  language: string;
  valence: number;
  energy: number;
  tempo: number;
}

class DatasetService {
  private movies: Movie[] = [];
  private tracks: Track[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const dataDir = path.join(process.cwd(), 'src', 'data');
      
      // Load Movies
      const moviesPath = path.join(dataDir, 'indian movies.csv');
      if (fs.existsSync(moviesPath)) {
        await new Promise((resolve) => {
          fs.createReadStream(moviesPath)
            .pipe(csv())
            .on('data', (data) => {
              this.movies.push({
                id: data.ID,
                name: data['Movie Name'],
                genre: (data.Genre || '').toLowerCase(),
                language: (data.Language || '').toLowerCase(),
                rating: data['Rating(10)']
              });
            })
            .on('end', resolve);
        });
        console.log(`[Dataset] Loaded ${this.movies.length} movies.`);
      }

      // Load Tracks
      const tracksPath = path.join(dataDir, 'spotify_tracks.csv');
      if (fs.existsSync(tracksPath)) {
        await new Promise((resolve) => {
          fs.createReadStream(tracksPath)
            .pipe(csv())
            .on('data', (data) => {
              this.tracks.push({
                id: data.track_id,
                name: data.track_name,
                artist: data.artist_name,
                artwork: data.artwork_url,
                url: data.track_url,
                language: (data.language || '').toLowerCase(),
                valence: parseFloat(data.valence || '0'),
                energy: parseFloat(data.energy || '0'),
                tempo: parseFloat(data.tempo || '0')
              });
            })
            .on('end', resolve);
        });
        console.log(`[Dataset] Loaded ${this.tracks.length} tracks.`);
      }

      this.initialized = true;
    } catch (err) {
      console.error('[Dataset] Error loading CSV datasets:', err);
    }
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public getRecommendations(mood: string, preferredLanguage: string = 'english'): any {
    if (!this.initialized) {
      return {
        movies: [{ title: 'Dataset Loading...', genre: 'Wait a moment' }],
        music: [{ title: 'Dataset Loading...', artist: 'Please wait' }]
      };
    }

    const moodLower = mood.toLowerCase();
    const langLower = preferredLanguage.toLowerCase();
    
    // Default pool
    let moviePool = this.movies;
    let trackPool = this.tracks;

    // Optional: Filter by language if provided (fallback to english/hindi/tamil if strict match fails)
    if (langLower) {
      const langFilteredMovies = this.movies.filter(m => m.language.includes(langLower));
      if (langFilteredMovies.length > 10) moviePool = langFilteredMovies;

      const langFilteredTracks = this.tracks.filter(t => t.language.includes(langLower));
      if (langFilteredTracks.length > 10) trackPool = langFilteredTracks;
    }

    // Helper for fast randomized sampling with early termination
    const sample = (pool: any[], predicate: (item: any) => boolean, targetCount: number) => {
      const results = [];
      const visited = new Set();
      let attempts = 0;
      const maxAttempts = Math.min(pool.length, 1000); // Prevent infinite loops

      while (results.length < targetCount && attempts < maxAttempts) {
        const idx = Math.floor(Math.random() * pool.length);
        if (!visited.has(idx)) {
          visited.add(idx);
          if (predicate(pool[idx])) {
            results.push(pool[idx]);
          }
        }
        attempts++;
      }
      return results;
    };

    let filteredMovies: Movie[] = [];
    let filteredTracks: Track[] = [];

    // Mood heuristics (Early Termination Sampling)
    if (moodLower.includes('happy') || moodLower.includes('joy') || moodLower.includes('excited')) {
      filteredMovies = sample(moviePool, m => m.genre.includes('comedy') || m.genre.includes('family'), 3);
      filteredTracks = sample(trackPool, t => t.valence > 0.6 && t.energy > 0.6, 3);
    } 
    else if (moodLower.includes('sad') || moodLower.includes('depressed')) {
      filteredMovies = sample(moviePool, m => m.genre.includes('drama') || m.genre.includes('romance'), 3);
      filteredTracks = sample(trackPool, t => t.valence < 0.4 && t.energy < 0.4, 3);
    }
    else if (moodLower.includes('angry') || moodLower.includes('frustrated')) {
      filteredMovies = sample(moviePool, m => m.genre.includes('action') || m.genre.includes('thriller'), 3);
      filteredTracks = sample(trackPool, t => t.energy > 0.7 && t.tempo > 120, 3);
    }
    else {
      // Relaxed / Neutral
      filteredMovies = sample(moviePool, m => m.genre.includes('drama') || m.genre.includes('biography'), 3);
      filteredTracks = sample(trackPool, t => t.energy < 0.5 && t.valence > 0.4, 3);
    }

    // Fallback if filters are too strict
    if (filteredMovies.length < 3) {
      filteredMovies = [...filteredMovies, ...this.shuffleArray([...moviePool]).slice(0, 3 - filteredMovies.length)];
    }
    if (filteredTracks.length < 3) {
      filteredTracks = [...filteredTracks, ...this.shuffleArray([...trackPool]).slice(0, 3 - filteredTracks.length)];
    }

    // Pick random 3
    const selectedMovies = this.shuffleArray([...filteredMovies]).slice(0, 3);
    const selectedTracks = this.shuffleArray([...filteredTracks]).slice(0, 3);

    return {
      movies: selectedMovies.map(m => ({
        title: m.name,
        genre: m.genre,
        language: m.language,
        rating: m.rating
      })),
      music: selectedTracks.map(t => ({
        title: t.name,
        artist: t.artist,
        artwork: t.artwork,
        url: t.url,
        language: t.language
      }))
    };
  }
}

export const datasetService = new DatasetService();
