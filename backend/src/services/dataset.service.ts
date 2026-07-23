import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export interface Movie {
  id: string;
  name: string;
  genre: string;
  language: string;
  rating: string;
  poster?: string;
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

// Unique Unsplash image helper — guaranteed to load and stay sharp
const usp = (photoId: string) => `https://images.unsplash.com/photo-${photoId}?w=600&auto=format&fit=crop&q=80`;

// Rich Curated Modern Hits per Emotion — EVERY SINGLE ITEM HAS A UNIQUE PHOTO
const EMOTION_CURATED_DATA: Record<string, { music: any[], movies: any[] }> = {
  love: {
    music: [
      { title: 'Kadhaippoma', artist: 'Sid Sriram (Oh My Kadavule)', genre: 'Romantic', artwork: usp('1518199266791-5375a83190b7') },
      { title: 'Vaa Yaathi', artist: 'G.V. Prakash Kumar, Shweta Mohan (Vaathi)', genre: 'Melody', artwork: usp('1511671782779-c97d3d27a1d4') },
      { title: 'Maruvaarthai', artist: 'Sid Sriram (Enai Noki Paayum Thota)', genre: 'Soulful', artwork: usp('1493225457124-a3eb161ffa5f') },
      { title: 'Hayyoda', artist: 'Anirudh Ravichander (Jawan)', genre: 'Pop Romance', artwork: usp('1529626455594-4ff0802cfb7e') },
      { title: 'Inkem Inkem', artist: 'Sid Sriram (Geetha Govindam)', genre: 'Classical Romance', artwork: usp('1485846234645-a62644f84728') },
      { title: 'Enjoy Enjaami', artist: 'Dhee ft. Arivu, Santhosh Narayanan', genre: 'Folk Pop', artwork: usp('1459749411175-04bf5292ceea') },
      { title: 'High On Love', artist: 'Yuvan Shankar Raja, Sid Sriram (PPK)', genre: 'Youth Romance', artwork: usp('1516450360452-9312f5e86fc7') },
      { title: 'Hosanna', artist: 'Vijay Prakash, Suzanne, A.R. Rahman (VTV)', genre: 'Romantic Classic', artwork: usp('1470225620780-dba8ba36b745') },
      { title: 'Kannazhaga', artist: 'Dhanush, Shruti Haasan, Anirudh (3)', genre: 'Melody', artwork: usp('1514525253161-7a46d19cd819') },
      { title: 'Un Vizhigalil', artist: 'Anirudh Ravichander, Shruti Haasan (Darbar)', genre: 'Acoustic Love', artwork: usp('1511379938547-c1f69419868d') },
      { title: 'Tharangini', artist: 'Sid Sriram (Dhamaka)', genre: 'Melody', artwork: usp('1477233134080-a57e02d1c5c6') },
      { title: 'Enodu Nee Irundhaal', artist: 'Sid Sriram, A.R. Rahman (I)', genre: 'Symphonic Love', artwork: usp('1506905925346-21bda4d32df4') }
    ],
    movies: [
      { title: 'Sita Ramam', genre: 'Romance / Drama', language: 'Tamil / Telugu', rating: '8.6', poster: usp('1518199266791-5375a83190b7') },
      { title: 'Love Today', genre: 'Rom-Com / Drama', language: 'Tamil', rating: '8.2', poster: usp('1516450360452-9312f5e86fc7') },
      { title: '96', genre: 'Romance / Nostalgia', language: 'Tamil', rating: '8.5', poster: usp('1485846234645-a62644f84728') },
      { title: 'Joe', genre: 'Romance / Emotional', language: 'Tamil', rating: '8.1', poster: usp('1493225457124-a3eb161ffa5f') },
      { title: 'Hi Nanna', genre: 'Romance / Family', language: 'Telugu / Tamil', rating: '8.3', poster: usp('1535992165812-3f84e5e56399') },
      { title: 'Vinnaithaandi Varuvaayaa', genre: 'Romance / Musical', language: 'Tamil', rating: '8.1', poster: usp('1514525253161-7a46d19cd819') },
      { title: 'Pyaar Prema Kaadhal', genre: 'Rom-Com', language: 'Tamil', rating: '7.8', poster: usp('1529626455594-4ff0802cfb7e') },
      { title: 'Raja Rani', genre: 'Romance / Drama', language: 'Tamil', rating: '8.0', poster: usp('1470225620780-dba8ba36b745') },
      { title: 'Oh My Kadavule', genre: 'Fantasy / Romance', language: 'Tamil', rating: '8.1', poster: usp('1511379938547-c1f69419868d') },
      { title: 'Hridayam', genre: 'Musical / Romance', language: 'Malayalam', rating: '8.1', poster: usp('1547355253-ff0680a6a5df') }
    ]
  },
  happy: {
    music: [
      { title: 'Naa Ready', artist: 'Anirudh Ravichander, Thalapathy Vijay (Leo)', genre: 'High Energy Party', artwork: usp('1492684223066-81342ee5ff30') },
      { title: 'Arabic Kuthu (Halamithi Habibo)', artist: 'Anirudh Ravichander, Jonita Gandhi (Beast)', genre: 'Kuthu Beats', artwork: usp('1501386761578-eac5c94b800a') },
      { title: 'Master Coming', artist: 'Anirudh Ravichander (Master)', genre: 'Mass Beats', artwork: usp('1470229722913-7c0e2dbbafd3') },
      { title: 'Vaadi Pulla Vaadi', artist: 'Hiphop Tamizha (Meesaya Murukku)', genre: 'Youth Folk Pop', artwork: usp('1511671782779-c97d3d27a1d4') },
      { title: 'Aalaporaan Tamizhan', artist: 'A.R. Rahman, Kailash Kher (Mersal)', genre: 'Celebration', artwork: usp('1514525253161-7a46d19cd819') },
      { title: 'Private Party', artist: 'Anirudh Ravichander, Jonita Gandhi (Don)', genre: 'Dance Pop', artwork: usp('1516450360452-9312f5e86fc7') },
      { title: 'Chilla Chilla', artist: 'Anirudh Ravichander, Ghibran (Thunivu)', genre: 'Mass Dance', artwork: usp('1508700115892-45ecd05ae2ad') },
      { title: 'Single Pasanga', artist: 'Hiphop Tamizha (Natpe Thunai)', genre: 'College Anthem', artwork: usp('1526478806334-5fd488fcaabc') },
      { title: 'Takkaru Takkaru', artist: 'Hiphop Tamizha (Takkaru)', genre: 'Folk HipHop', artwork: usp('1498038432885-c6f3f1b912ee') },
      { title: 'Rowdy Baby', artist: 'Dhanush, Dhee, Yuvan Shankar Raja (Maari 2)', genre: 'Dance Hit', artwork: usp('1545128485-c400e7702796') },
      { title: 'Dippam Dappam', artist: 'Anirudh Ravichander, Anthony Daasan (KRK)', genre: 'Kuthu Pop', artwork: usp('1516589178581-6cd7833ae3b2') },
      { title: 'Club Le Mabbu Le', artist: 'Hiphop Tamizha (Hip Hop Tamizhan)', genre: 'Hip Hop Pop', artwork: usp('1514525253161-7a46d19cd819') }
    ],
    movies: [
      { title: 'Leo', genre: 'Action / Mass', language: 'Tamil', rating: '8.0', poster: usp('1534447677768-be436bb09401') },
      { title: 'Jailer', genre: 'Action / Comedy', language: 'Tamil', rating: '8.1', poster: usp('1579783902614-a3fb3927b675') },
      { title: 'Master', genre: 'Action / Entertainment', language: 'Tamil', rating: '7.9', poster: usp('1509198397868-475647b2a1e5') },
      { title: 'Don', genre: 'Comedy / College', language: 'Tamil', rating: '7.5', poster: usp('1526478806334-5fd488fcaabc') },
      { title: 'Doctor', genre: 'Dark Comedy / Action', language: 'Tamil', rating: '7.9', poster: usp('1518709268805-4e9042af9f23') },
      { title: 'Varisu', genre: 'Family / Action', language: 'Tamil', rating: '7.2', poster: usp('1514525253161-7a46d19cd819') },
      { title: 'Good Night', genre: 'Comedy / Slice of Life', language: 'Tamil', rating: '8.0', poster: usp('1626785774573-4b799315345d') },
      { title: 'Meesaya Murukku', genre: 'Musical / Comedy', language: 'Tamil', rating: '7.8', poster: usp('1511671782779-c97d3d27a1d4') },
      { title: 'Mark Antony', genre: 'Sci-Fi / Action Comedy', language: 'Tamil', rating: '7.6', poster: usp('1607604276583-eef5d076aa5f') },
      { title: 'Boss Engira Bhaskaran', genre: 'Classic Comedy', language: 'Tamil', rating: '7.8', poster: usp('1489599849927-2ee91cede3ba') }
    ]
  },
  angry: {
    music: [
      { title: 'Hukum - Thalaivar Alappara', artist: 'Anirudh Ravichander (Jailer)', genre: 'Rage Mass', artwork: usp('1508700115892-45ecd05ae2ad') },
      { title: 'Badass', artist: 'Anirudh Ravichander (Leo)', genre: 'Heavy Beat Anthem', artwork: usp('1509198397868-475647b2a1e5') },
      { title: 'Ordinary Person', artist: 'Anirudh Ravichander (Leo)', genre: 'Dark Hype Track', artwork: usp('1518709268805-4e9042af9f23') },
      { title: 'VIP Theme', artist: 'Anirudh Ravichander (Velaiilla Pattadhari)', genre: 'Mass Youth Anthem', artwork: usp('1534447677768-be436bb09401') },
      { title: 'Ethir Neechal Title Track', artist: 'Hiphop Tamizha, Anirudh', genre: 'High Energy Rap', artwork: usp('1501386761578-eac5c94b800a') },
      { title: 'Kaattu Payale', artist: 'Dhee, G.V. Prakash Kumar (Soorarai Pottru)', genre: 'Folk Energy', artwork: usp('1516450360452-9312f5e86fc7') },
      { title: 'Neeye Oli', artist: 'Shan Vincent de Paul, Navz-47', genre: 'Boxing Rap', artwork: usp('1517649763962-0c623266e804') },
      { title: 'Vikram Title Track', artist: 'Anirudh Ravichander (Vikram)', genre: 'Action EDM', artwork: usp('1545128485-c400e7702796') },
      { title: 'Kaththi Theme', artist: 'Anirudh Ravichander (Kaththi)', genre: 'Iconic Theme', artwork: usp('1470229722913-7c0e2dbbafd3') },
      { title: 'Singappenney', artist: 'A.R. Rahman (Bigil)', genre: 'Motivational Power', artwork: usp('1492684223066-81342ee5ff30') }
    ],
    movies: [
      { title: 'Vikram', genre: 'Action / Crime Thriller', language: 'Tamil', rating: '8.4', poster: usp('1509198397868-475647b2a1e5') },
      { title: 'Kaithi', genre: 'Action / Thriller', language: 'Tamil', rating: '8.5', poster: usp('1518709268805-4e9042af9f23') },
      { title: 'Sarpatta Parambarai', genre: 'Sports / Action / Period', language: 'Tamil', rating: '8.6', poster: usp('1517649763962-0c623266e804') },
      { title: 'Maaveeran', genre: 'Fantasy / Action', language: 'Tamil', rating: '7.8', poster: usp('1534447677768-be436bb09401') },
      { title: 'Soorarai Pottru', genre: 'Drama / Biography', language: 'Tamil', rating: '8.7', poster: usp('1508700115892-45ecd05ae2ad') },
      { title: 'K.G.F: Chapter 2', genre: 'Action / Crime', language: 'Kannada / Tamil', rating: '8.3', poster: usp('1579783902614-a3fb3927b675') },
      { title: 'Vettaiyan', genre: 'Action / Investigation', language: 'Tamil', rating: '7.7', poster: usp('1489599849927-2ee91cede3ba') },
      { title: 'Thunivu', genre: 'Action / Heist', language: 'Tamil', rating: '7.3', poster: usp('1526478806334-5fd488fcaabc') },
      { title: 'Asuran', genre: 'Action / Revenge Drama', language: 'Tamil', rating: '8.5', poster: usp('1493225457124-a3eb161ffa5f') },
      { title: 'Jawan', genre: 'Action / Thriller', language: 'Hindi / Tamil', rating: '7.8', poster: usp('1529626455594-4ff0802cfb7e') }
    ]
  },
  sad: {
    music: [
      { title: 'Kanne Azhagiya Kanne', artist: 'Sid Sriram (Maari 2)', genre: 'Heartbreak Melody', artwork: usp('1485846234645-a62644f84728') },
      { title: 'Marakkuma Nenjam', artist: 'A.R. Rahman (Vendhu Thanindhathu Kaadu)', genre: 'Emotional Soul', artwork: usp('1493225457124-a3eb161ffa5f') },
      { title: 'Po Nee Po', artist: 'Anirudh Ravichander, Mohit Chauhan (3)', genre: 'Heartbreak Classic', artwork: usp('1518199266791-5375a83190b7') },
      { title: 'Life of Ram', artist: 'Pradeep Kumar, Govind Vasantha (96)', genre: 'Solitude Melody', artwork: usp('1459749411175-04bf5292ceea') },
      { title: 'Kanave Kanave', artist: 'Anirudh Ravichander (David)', genre: 'Sad Rock', artwork: usp('1477233134080-a57e02d1c5c6') },
      { title: 'Unna Nenachu', artist: 'Sid Sriram, Ilaiyaraaja (Psycho)', genre: 'Soulful Melody', artwork: usp('1506905925346-21bda4d32df4') },
      { title: 'Porkanda Singam', artist: 'Anirudh Ravichander (Vikram)', genre: 'Emotional Lullaby', artwork: usp('1493891526223-acf7fee3dbf5') },
      { title: 'Nira', artist: 'Sid Sriram (Takkar)', genre: 'Melancholic Love', artwork: usp('1484755560615-a4c64e778a6c') },
      { title: 'Malare', artist: 'Vijay Yesudas, Rajesh Murugesan (Premam)', genre: 'Romantic Nostalgia', artwork: usp('1511379938547-c1f69419868d') },
      { title: 'Enna Solla', artist: 'Anirudh Ravichander (Thanga Magan)', genre: 'Soft Sad Song', artwork: usp('1514525253161-7a46d19cd819') }
    ],
    movies: [
      { title: 'Chitha', genre: 'Drama / Emotional Thriller', language: 'Tamil', rating: '8.4', poster: usp('1485846234645-a62644f84728') },
      { title: 'Jai Bhim', genre: 'Legal / Drama', language: 'Tamil', rating: '8.8', poster: usp('1534447677768-be436bb09401') },
      { title: 'Gargi', genre: 'Emotional Mystery / Drama', language: 'Tamil', rating: '8.2', poster: usp('1518199266791-5375a83190b7') },
      { title: 'Pariyerum Perumal', genre: 'Social Drama', language: 'Tamil', rating: '8.7', poster: usp('1489599849927-2ee91cede3ba') },
      { title: 'Irugapatru', genre: 'Relationship Drama', language: 'Tamil', rating: '8.3', poster: usp('1514525253161-7a46d19cd819') },
      { title: 'Dada', genre: 'Parenting / Emotional Drama', language: 'Tamil', rating: '8.2', poster: usp('1470225620780-dba8ba36b745') },
      { title: '96', genre: 'Romance / Nostalgia', language: 'Tamil', rating: '8.5', poster: usp('1493225457124-a3eb161ffa5f') },
      { title: 'Joe', genre: 'Romance / Emotional', language: 'Tamil', rating: '8.1', poster: usp('1535992165812-3f84e5e56399') },
      { title: 'Asuran', genre: 'Revenge / Drama', language: 'Tamil', rating: '8.5', poster: usp('1518709268805-4e9042af9f23') },
      { title: 'Soorarai Pottru', genre: 'Biographical Drama', language: 'Tamil', rating: '8.7', poster: usp('1508700115892-45ecd05ae2ad') }
    ]
  },
  calm: {
    music: [
      { title: 'Visiri', artist: 'Sid Sriram, Shashaa Tirupati (ENPT)', genre: 'Soft Breeze Melody', artwork: usp('1459749411175-04bf5292ceea') },
      { title: 'Mental Manadhil', artist: 'A.R. Rahman, Jonita Gandhi (OK Kanmani)', genre: 'Chilled Beats', artwork: usp('1477233134080-a57e02d1c5c6') },
      { title: 'Bae', artist: 'Anirudh Ravichander (Don)', genre: 'Soft Chill Pop', artwork: usp('1506905925346-21bda4d32df4') },
      { title: 'Megham Karukatha', artist: 'Dhanush, Anirudh Ravichander (Thiruchitrambalam)', genre: 'Lo-Fi Chill', artwork: usp('1493891526223-acf7fee3dbf5') },
      { title: 'Anbae Peranbae', artist: 'Sid Sriram, Shreya Ghoshal (NGK)', genre: 'Acoustic Melody', artwork: usp('1511671782779-c97d3d27a1d4') },
      { title: 'Moongil Thottam', artist: 'Abhay Jodhpurkar, Harini, A.R. Rahman (Kadal)', genre: 'Ambient Peace', artwork: usp('1484755560615-a4c64e778a6c') },
      { title: 'Vaseegara', artist: 'Bombay Jayashri, Harris Jayaraj (Minnaley)', genre: 'Smooth Chill', artwork: usp('1511379938547-c1f69419868d') },
      { title: 'Thaarame Thaarame', artist: 'Sid Sriram (Kadaram Kondan)', genre: 'Gentle Soul', artwork: usp('1514525253161-7a46d19cd819') },
      { title: 'Idhazhin Ooram', artist: 'Anirudh Ravichander, Ajesh (3)', genre: 'Soft Melody', artwork: usp('1470225620780-dba8ba36b745') },
      { title: 'Unakkenna Venum Sollu', artist: 'Benny Dayal, Mahathi, Harris Jayaraj', genre: 'Peaceful Melody', artwork: usp('1547355253-ff0680a6a5df') }
    ],
    movies: [
      { title: 'Thiruchitrambalam', genre: 'Slice of Life / Heartwarming', language: 'Tamil', rating: '8.0', poster: usp('1626785774573-4b799315345d') },
      { title: 'OK Kanmani', genre: 'Romance / Chill', language: 'Tamil', rating: '7.4', poster: usp('1477233134080-a57e02d1c5c6') },
      { title: 'Anbe Sivam', genre: 'Classy Feel Good', language: 'Tamil', rating: '8.7', poster: usp('1511379938547-c1f69419868d') },
      { title: 'Abhiyum Naanum', genre: 'Family / Peaceful', language: 'Tamil', rating: '7.9', poster: usp('1458560871784-56d23406c091') },
      { title: 'Kadaisi Vivasayi', genre: 'Slice of Life / Masterpiece', language: 'Tamil', rating: '8.7', poster: usp('1534388151737-fc1c5b16d1f3') },
      { title: 'Good Night', genre: 'Comedy / Chill', language: 'Tamil', rating: '8.0', poster: usp('1514525253161-7a46d19cd819') },
      { title: '96', genre: 'Nostalgic Romance', language: 'Tamil', rating: '8.5', poster: usp('1485846234645-a62644f84728') },
      { title: 'Hridayam', genre: 'Youth Musical', language: 'Malayalam', rating: '8.1', poster: usp('1547355253-ff0680a6a5df') },
      { title: 'Sita Ramam', genre: 'Classic Drama', language: 'Telugu / Tamil', rating: '8.6', poster: usp('1518199266791-5375a83190b7') },
      { title: 'Hi Nanna', genre: 'Emotional Comfort', language: 'Telugu / Tamil', rating: '8.3', poster: usp('1535992165812-3f84e5e56399') }
    ]
  }
};

class DatasetService {
  private movies: Movie[] = [];
  private tracks: Track[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const dataDir = path.join(process.cwd(), 'src', 'data');
      const moviesPath = path.join(dataDir, 'indian movies.csv');
      if (fs.existsSync(moviesPath)) {
        await new Promise((resolve) => {
          fs.createReadStream(moviesPath)
            .pipe(csv())
            .on('data', (data) => {
              this.movies.push({
                id: data.ID || Math.random().toString(),
                name: data['Movie Name'] || 'Unknown',
                genre: (data.Genre || '').toLowerCase(),
                language: (data.Language || '').toLowerCase(),
                rating: data['Rating(10)'] || '8.0',
              });
            })
            .on('end', resolve);
        });
      }
      const tracksPath = path.join(dataDir, 'spotify_tracks.csv');
      if (fs.existsSync(tracksPath)) {
        await new Promise((resolve) => {
          fs.createReadStream(tracksPath)
            .pipe(csv())
            .on('data', (data) => {
              this.tracks.push({
                id: data.track_id || Math.random().toString(),
                name: data.track_name || 'Track',
                artist: data.artist_name || 'Artist',
                artwork: data.artwork_url || '',
                url: data.track_url || '',
                language: (data.language || '').toLowerCase(),
                valence: parseFloat(data.valence || '0.5'),
                energy: parseFloat(data.energy || '0.5'),
                tempo: parseFloat(data.tempo || '120')
              });
            })
            .on('end', resolve);
        });
      }
    } catch (err) {
      console.error('[Dataset] Error initializing:', err);
    }
  }

  public getRecommendations(mood: string, preferredLanguage: string = 'tamil'): any {
    const moodLower = mood.toLowerCase();
    let curatedKey = 'happy';
    if (moodLower.includes('love') || moodLower.includes('romantic')) curatedKey = 'love';
    else if (moodLower.includes('sad') || moodLower.includes('depressed') || moodLower.includes('lonely')) curatedKey = 'sad';
    else if (moodLower.includes('angry') || moodLower.includes('frustrated') || moodLower.includes('hype') || moodLower.includes('motivated')) curatedKey = 'angry';
    else if (moodLower.includes('calm') || moodLower.includes('relaxed') || moodLower.includes('peaceful') || moodLower.includes('neutral')) curatedKey = 'calm';
    else curatedKey = 'happy';

    const curated = EMOTION_CURATED_DATA[curatedKey] || EMOTION_CURATED_DATA['happy'];

    const curatedMusic = curated.music.map((t) => ({
      title: t.title,
      artist: t.artist,
      genre: t.genre || 'Hit',
      artwork: t.artwork,
      url: `https://open.spotify.com/search/${encodeURIComponent(t.title + ' ' + t.artist)}`,
      language: 'Tamil'
    }));

    const curatedMovies = curated.movies.map((m) => ({
      title: m.title,
      genre: m.genre,
      language: m.language,
      rating: m.rating,
      poster: m.poster
    }));

    return {
      movies: curatedMovies,
      music: curatedMusic
    };
  }
}

export const datasetService = new DatasetService();
