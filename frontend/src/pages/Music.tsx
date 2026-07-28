import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Play, Heart, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API } from '../context/AuthContext';

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  mood: string;
  artwork: string;
  url: string;
}

const EMOTIONS = ['Love', 'Happy', 'Sad', 'Angry', 'Calm', 'Motivated', 'Nostalgic', 'Excited'];

// Helper for Unsplash photos
const usp = (id: string) => `https://images.unsplash.com/photo-${id}?w=500&auto=format&fit=crop&q=80`;

// Rich curated fallback songs per emotion — always shown if API fails
const FALLBACK_TRACKS: Record<string, Omit<Track, 'id' | 'mood'>[]> = {
  Love: [
    { name: 'Kadhaippoma',        artist: 'Sid Sriram (Oh My Kadavule)',          genre: 'Romantic',         artwork: usp('1518199266791-5375a83190b7'), url: 'https://open.spotify.com/search/Kadhaippoma%20Sid%20Sriram' },
    { name: 'Vaa Yaathi',         artist: 'G.V. Prakash Kumar, Shweta Mohan',     genre: 'Melody',           artwork: usp('1511671782779-c97d3d27a1d4'), url: 'https://open.spotify.com/search/Vaa%20Yaathi' },
    { name: 'Maruvaarthai',       artist: 'Sid Sriram (ENPT)',                    genre: 'Soulful',          artwork: usp('1493225457124-a3eb161ffa5f'), url: 'https://open.spotify.com/search/Maruvaarthai%20Sid%20Sriram' },
    { name: 'Hayyoda',            artist: 'Anirudh Ravichander (Jawan)',           genre: 'Pop Romance',      artwork: usp('1529626455594-4ff0802cfb7e'), url: 'https://open.spotify.com/search/Hayyoda%20Anirudh' },
    { name: 'Inkem Inkem',        artist: 'Sid Sriram (Geetha Govindam)',          genre: 'Classical Romance',artwork: usp('1485846234645-a62644f84728'), url: 'https://open.spotify.com/search/Inkem%20Inkem%20Sid%20Sriram' },
    { name: 'High On Love',       artist: 'Yuvan Shankar Raja, Sid Sriram',        genre: 'Youth Romance',    artwork: usp('1516450360452-9312f5e86fc7'), url: 'https://open.spotify.com/search/High%20On%20Love%20Sid%20Sriram' },
    { name: 'Hosanna',            artist: 'Vijay Prakash, A.R. Rahman (VTV)',      genre: 'Romantic Classic', artwork: usp('1470225620780-dba8ba36b745'), url: 'https://open.spotify.com/search/Hosanna%20AR%20Rahman' },
    { name: 'Kannazhaga',         artist: 'Dhanush, Shruti Haasan (3)',            genre: 'Melody',           artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Kannazhaga%20Anirudh' },
    { name: 'Un Vizhigalil',      artist: 'Anirudh Ravichander (Darbar)',          genre: 'Acoustic Love',    artwork: usp('1511379938547-c1f69419868d'), url: 'https://open.spotify.com/search/Un%20Vizhigalil' },
    { name: 'Tharangini',         artist: 'Sid Sriram (Dhamaka)',                 genre: 'Melody',           artwork: usp('1477233134080-a57e02d1c5c6'), url: 'https://open.spotify.com/search/Tharangini%20Sid%20Sriram' },
    { name: 'Enjoy Enjaami',      artist: 'Dhee ft. Arivu, Santhosh Narayanan',   genre: 'Folk Pop',         artwork: usp('1459749411175-04bf5292ceea'), url: 'https://open.spotify.com/search/Enjoy%20Enjaami' },
    { name: 'Enodu Nee Irundhaal',artist: 'Sid Sriram, A.R. Rahman (I)',          genre: 'Symphonic Love',   artwork: usp('1506905925346-21bda4d32df4'), url: 'https://open.spotify.com/search/Enodu%20Nee%20Irundhaal' },
  ],
  Happy: [
    { name: 'Naa Ready',           artist: 'Anirudh Ravichander, Vijay (Leo)',      genre: 'High Energy Party',artwork: usp('1492684223066-81342ee5ff30'), url: 'https://open.spotify.com/search/Naa%20Ready%20Leo' },
    { name: 'Arabic Kuthu',        artist: 'Anirudh, Jonita Gandhi (Beast)',         genre: 'Kuthu Beats',      artwork: usp('1501386761578-eac5c94b800a'), url: 'https://open.spotify.com/search/Arabic%20Kuthu%20Beast' },
    { name: 'Master Coming',       artist: 'Anirudh Ravichander (Master)',           genre: 'Mass Beats',       artwork: usp('1470229722913-7c0e2dbbafd3'), url: 'https://open.spotify.com/search/Master%20Coming%20Anirudh' },
    { name: 'Vaadi Pulla Vaadi',   artist: 'Hiphop Tamizha (Meesaya Murukku)',      genre: 'Youth Folk Pop',   artwork: usp('1511671782779-c97d3d27a1d4'), url: 'https://open.spotify.com/search/Vaadi%20Pulla%20Vaadi' },
    { name: 'Aalaporaan Tamizhan', artist: 'A.R. Rahman, Kailash Kher (Mersal)',    genre: 'Celebration',      artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Aalaporaan%20Tamizhan' },
    { name: 'Private Party',       artist: 'Anirudh Ravichander, Jonita (Don)',      genre: 'Dance Pop',        artwork: usp('1516450360452-9312f5e86fc7'), url: 'https://open.spotify.com/search/Private%20Party%20Anirudh' },
    { name: 'Chilla Chilla',       artist: 'Anirudh Ravichander (Thunivu)',          genre: 'Mass Dance',       artwork: usp('1508700115892-45ecd05ae2ad'), url: 'https://open.spotify.com/search/Chilla%20Chilla%20Thunivu' },
    { name: 'Rowdy Baby',          artist: 'Dhanush, Dhee, Yuvan (Maari 2)',         genre: 'Dance Hit',        artwork: usp('1545128485-c400e7702796'), url: 'https://open.spotify.com/search/Rowdy%20Baby%20Maari' },
    { name: 'Dippam Dappam',       artist: 'Anirudh (KRK)',                          genre: 'Kuthu Pop',        artwork: usp('1516589178581-6cd7833ae3b2'), url: 'https://open.spotify.com/search/Dippam%20Dappam%20Anirudh' },
    { name: 'Single Pasanga',      artist: 'Hiphop Tamizha (Natpe Thunai)',          genre: 'College Anthem',   artwork: usp('1526478806334-5fd488fcaabc'), url: 'https://open.spotify.com/search/Single%20Pasanga' },
    { name: 'Takkaru Takkaru',     artist: 'Hiphop Tamizha',                         genre: 'Folk HipHop',      artwork: usp('1498038432885-c6f3f1b912ee'), url: 'https://open.spotify.com/search/Takkaru%20Takkaru' },
    { name: 'Club Le Mabbu Le',    artist: 'Hiphop Tamizha',                         genre: 'Hip Hop Pop',      artwork: usp('1492684223066-81342ee5ff30'), url: 'https://open.spotify.com/search/Club%20Le%20Mabbu%20Le' },
  ],
  Sad: [
    { name: 'Kanne Azhagiya Kanne', artist: 'Sid Sriram (Maari 2)',              genre: 'Heartbreak Melody',  artwork: usp('1485846234645-a62644f84728'), url: 'https://open.spotify.com/search/Kanne%20Azhagiya%20Kanne' },
    { name: 'Marakkuma Nenjam',     artist: 'A.R. Rahman (VTK)',                 genre: 'Emotional Soul',     artwork: usp('1493225457124-a3eb161ffa5f'), url: 'https://open.spotify.com/search/Marakkuma%20Nenjam' },
    { name: 'Po Nee Po',            artist: 'Anirudh, Mohit Chauhan (3)',         genre: 'Heartbreak Classic', artwork: usp('1518199266791-5375a83190b7'), url: 'https://open.spotify.com/search/Po%20Nee%20Po%20Anirudh' },
    { name: 'Life of Ram',          artist: 'Pradeep Kumar, Govind Vasantha (96)',genre: 'Solitude Melody',   artwork: usp('1459749411175-04bf5292ceea'), url: 'https://open.spotify.com/search/Life%20of%20Ram%2096' },
    { name: 'Kanave Kanave',        artist: 'Anirudh Ravichander (David)',        genre: 'Sad Rock',           artwork: usp('1477233134080-a57e02d1c5c6'), url: 'https://open.spotify.com/search/Kanave%20Kanave%20Anirudh' },
    { name: 'Unna Nenachu',         artist: 'Sid Sriram, Ilaiyaraaja (Psycho)',  genre: 'Soulful Melody',    artwork: usp('1506905925346-21bda4d32df4'), url: 'https://open.spotify.com/search/Unna%20Nenachu%20Sid%20Sriram' },
    { name: 'Porkanda Singam',      artist: 'Anirudh Ravichander (Vikram)',       genre: 'Emotional Lullaby', artwork: usp('1493891526223-acf7fee3dbf5'), url: 'https://open.spotify.com/search/Porkanda%20Singam' },
    { name: 'Nira',                 artist: 'Sid Sriram (Takkar)',               genre: 'Melancholic Love',   artwork: usp('1484755560615-a4c64e778a6c'), url: 'https://open.spotify.com/search/Nira%20Sid%20Sriram' },
    { name: 'Malare',               artist: 'Vijay Yesudas (Premam)',            genre: 'Romantic Nostalgia', artwork: usp('1511379938547-c1f69419868d'), url: 'https://open.spotify.com/search/Malare%20Premam' },
    { name: 'Enna Solla',           artist: 'Anirudh Ravichander (Thanga Magan)',genre: 'Soft Sad Song',      artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Enna%20Solla%20Anirudh' },
  ],
  Angry: [
    { name: 'Hukum - Thalaivar Alappara', artist: 'Anirudh Ravichander (Jailer)', genre: 'Rage Mass',       artwork: usp('1508700115892-45ecd05ae2ad'), url: 'https://open.spotify.com/search/Hukum%20Jailer%20Anirudh' },
    { name: 'Badass',                     artist: 'Anirudh Ravichander (Leo)',    genre: 'Heavy Beat',       artwork: usp('1509198397868-475647b2a1e5'), url: 'https://open.spotify.com/search/Badass%20Leo%20Anirudh' },
    { name: 'Ordinary Person',            artist: 'Anirudh Ravichander (Leo)',    genre: 'Dark Hype',        artwork: usp('1518709268805-4e9042af9f23'), url: 'https://open.spotify.com/search/Ordinary%20Person%20Leo' },
    { name: 'VIP Theme',                  artist: 'Anirudh Ravichander',          genre: 'Mass Youth Anthem',artwork: usp('1534447677768-be436bb09401'), url: 'https://open.spotify.com/search/VIP%20Theme%20Anirudh' },
    { name: 'Ethir Neechal Title Track',  artist: 'Hiphop Tamizha, Anirudh',     genre: 'High Energy Rap',  artwork: usp('1501386761578-eac5c94b800a'), url: 'https://open.spotify.com/search/Ethir%20Neechal%20Title' },
    { name: 'Kaattu Payale',              artist: 'Dhee, G.V. Prakash (Soorarai)',genre: 'Folk Energy',      artwork: usp('1516450360452-9312f5e86fc7'), url: 'https://open.spotify.com/search/Kaattu%20Payale' },
    { name: 'Neeye Oli',                  artist: 'Shan Vincent de Paul, Navz-47',genre: 'Boxing Rap',       artwork: usp('1517649763962-0c623266e804'), url: 'https://open.spotify.com/search/Neeye%20Oli%20Navz47' },
    { name: 'Vikram Title Track',         artist: 'Anirudh Ravichander (Vikram)', genre: 'Action EDM',       artwork: usp('1545128485-c400e7702796'), url: 'https://open.spotify.com/search/Vikram%20Title%20Track' },
    { name: 'Kaththi Theme',              artist: 'Anirudh Ravichander (Kaththi)',genre: 'Iconic Theme',      artwork: usp('1470229722913-7c0e2dbbafd3'), url: 'https://open.spotify.com/search/Kaththi%20Theme' },
    { name: 'Singappenney',               artist: 'A.R. Rahman (Bigil)',          genre: 'Motivational Power',artwork: usp('1492684223066-81342ee5ff30'), url: 'https://open.spotify.com/search/Singappenney%20Bigil' },
  ],
  Calm: [
    { name: 'Visiri',              artist: 'Sid Sriram (ENPT)',                    genre: 'Soft Breeze',    artwork: usp('1459749411175-04bf5292ceea'), url: 'https://open.spotify.com/search/Visiri%20Sid%20Sriram' },
    { name: 'Mental Manadhil',     artist: 'A.R. Rahman, Jonita (OK Kanmani)',     genre: 'Chilled Beats',  artwork: usp('1477233134080-a57e02d1c5c6'), url: 'https://open.spotify.com/search/Mental%20Manadhil' },
    { name: 'Bae',                 artist: 'Anirudh Ravichander (Don)',            genre: 'Soft Chill Pop', artwork: usp('1506905925346-21bda4d32df4'), url: 'https://open.spotify.com/search/Bae%20Anirudh%20Don' },
    { name: 'Megham Karukatha',    artist: 'Dhanush, Anirudh (Thiruchitrambalam)',genre: 'Lo-Fi Chill',    artwork: usp('1493891526223-acf7fee3dbf5'), url: 'https://open.spotify.com/search/Megham%20Karukatha' },
    { name: 'Anbae Peranbae',      artist: 'Sid Sriram, Shreya Ghoshal (NGK)',    genre: 'Acoustic Melody',artwork: usp('1511671782779-c97d3d27a1d4'), url: 'https://open.spotify.com/search/Anbae%20Peranbae%20Sid%20Sriram' },
    { name: 'Moongil Thottam',     artist: 'A.R. Rahman (Kadal)',                 genre: 'Ambient Peace',  artwork: usp('1484755560615-a4c64e778a6c'), url: 'https://open.spotify.com/search/Moongil%20Thottam' },
    { name: 'Vaseegara',           artist: 'Bombay Jayashri, Harris Jayaraj',     genre: 'Smooth Chill',   artwork: usp('1511379938547-c1f69419868d'), url: 'https://open.spotify.com/search/Vaseegara%20Harris%20Jayaraj' },
    { name: 'Thaarame Thaarame',   artist: 'Sid Sriram (Kadaram Kondan)',         genre: 'Gentle Soul',    artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Thaarame%20Thaarame%20Sid%20Sriram' },
    { name: 'Idhazhin Ooram',      artist: 'Anirudh, Ajesh (3)',                  genre: 'Soft Melody',    artwork: usp('1470225620780-dba8ba36b745'), url: 'https://open.spotify.com/search/Idhazhin%20Ooram%20Anirudh' },
    { name: 'Unakkenna Venum Sollu',artist: 'Benny Dayal, Mahathi, Harris Jayaraj',genre: 'Peaceful',      artwork: usp('1547355253-ff0680a6a5df'), url: 'https://open.spotify.com/search/Unakkenna%20Venum%20Sollu' },
  ],
  Motivated: [
    { name: 'Singappenney',        artist: 'A.R. Rahman (Bigil)',            genre: 'Motivational Power',artwork: usp('1492684223066-81342ee5ff30'), url: 'https://open.spotify.com/search/Singappenney%20Bigil' },
    { name: 'Kaattu Payale',       artist: 'Dhee, G.V. Prakash (Soorarai)', genre: 'Folk Energy',       artwork: usp('1516450360452-9312f5e86fc7'), url: 'https://open.spotify.com/search/Kaattu%20Payale' },
    { name: 'VIP Theme',           artist: 'Anirudh Ravichander',            genre: 'Mass Youth Anthem', artwork: usp('1534447677768-be436bb09401'), url: 'https://open.spotify.com/search/VIP%20Theme%20Anirudh' },
    { name: 'Naa Ready',           artist: 'Anirudh Ravichander (Leo)',      genre: 'High Energy',       artwork: usp('1501386761578-eac5c94b800a'), url: 'https://open.spotify.com/search/Naa%20Ready%20Leo' },
    { name: 'Vikram Title Track',  artist: 'Anirudh Ravichander (Vikram)',   genre: 'Action EDM',        artwork: usp('1545128485-c400e7702796'), url: 'https://open.spotify.com/search/Vikram%20Title%20Track' },
    { name: 'Ethir Neechal',       artist: 'Hiphop Tamizha, Anirudh',       genre: 'Hustle Anthem',     artwork: usp('1470229722913-7c0e2dbbafd3'), url: 'https://open.spotify.com/search/Ethir%20Neechal' },
    { name: 'Hukum',               artist: 'Anirudh (Jailer)',               genre: 'Power Mass',        artwork: usp('1508700115892-45ecd05ae2ad'), url: 'https://open.spotify.com/search/Hukum%20Jailer' },
    { name: 'Aalaporaan Tamizhan', artist: 'A.R. Rahman, Kailash Kher',     genre: 'Celebration',       artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Aalaporaan%20Tamizhan' },
    { name: 'Master Coming',       artist: 'Anirudh Ravichander (Master)',   genre: 'Mass Beats',        artwork: usp('1509198397868-475647b2a1e5'), url: 'https://open.spotify.com/search/Master%20Coming%20Anirudh' },
    { name: 'Badass',              artist: 'Anirudh Ravichander (Leo)',      genre: 'Heavy Beat',        artwork: usp('1518709268805-4e9042af9f23'), url: 'https://open.spotify.com/search/Badass%20Leo%20Anirudh' },
  ],
  Nostalgic: [
    { name: 'Vaseegara',        artist: 'Bombay Jayashri, Harris Jayaraj',  genre: 'Classic Melody',     artwork: usp('1511379938547-c1f69419868d'), url: 'https://open.spotify.com/search/Vaseegara' },
    { name: 'Kadhal Sadugudu', artist: 'Yuvan Shankar Raja (Dum Dum Dum)', genre: 'Retro Hit',           artwork: usp('1459749411175-04bf5292ceea'), url: 'https://open.spotify.com/search/Kadhal%20Sadugudu' },
    { name: 'Po Nee Po',        artist: 'Anirudh, Mohit Chauhan (3)',       genre: 'Timeless Heartbreak', artwork: usp('1518199266791-5375a83190b7'), url: 'https://open.spotify.com/search/Po%20Nee%20Po' },
    { name: 'Ennavale Adi Ennavale',artist: 'A.R. Rahman',                 genre: 'Classic Romance',     artwork: usp('1477233134080-a57e02d1c5c6'), url: 'https://open.spotify.com/search/Ennavale%20Adi%20Ennavale' },
    { name: 'Hosanna',          artist: 'Vijay Prakash, A.R. Rahman',      genre: 'Classic Love',        artwork: usp('1470225620780-dba8ba36b745'), url: 'https://open.spotify.com/search/Hosanna%20AR%20Rahman' },
    { name: 'Malare',           artist: 'Vijay Yesudas (Premam)',          genre: 'Nostalgic Romance',   artwork: usp('1485846234645-a62644f84728'), url: 'https://open.spotify.com/search/Malare%20Premam' },
    { name: 'Life of Ram',      artist: 'Pradeep Kumar (96)',               genre: 'Nostalgia Song',      artwork: usp('1493225457124-a3eb161ffa5f'), url: 'https://open.spotify.com/search/Life%20of%20Ram' },
    { name: 'Kannazhaga',       artist: 'Dhanush, Shruti Haasan, Anirudh', genre: 'Timeless Melody',     artwork: usp('1514525253161-7a46d19cd819'), url: 'https://open.spotify.com/search/Kannazhaga' },
    { name: 'Mental Manadhil',  artist: 'A.R. Rahman (OK Kanmani)',        genre: 'Chill Nostalgia',     artwork: usp('1506905925346-21bda4d32df4'), url: 'https://open.spotify.com/search/Mental%20Manadhil' },
    { name: 'Mundhinam Paarthene',artist: 'Yuvan Shankar Raja',            genre: 'Vintage Romance',     artwork: usp('1493891526223-acf7fee3dbf5'), url: 'https://open.spotify.com/search/Mundhinam%20Paarthene' },
  ],
  Excited: [
    { name: 'Naa Ready',          artist: 'Anirudh (Leo)',               genre: 'High Energy Party', artwork: usp('1492684223066-81342ee5ff30'), url: 'https://open.spotify.com/search/Naa%20Ready%20Leo' },
    { name: 'Arabic Kuthu',       artist: 'Anirudh (Beast)',             genre: 'Kuthu Beats',       artwork: usp('1501386761578-eac5c94b800a'), url: 'https://open.spotify.com/search/Arabic%20Kuthu' },
    { name: 'Rowdy Baby',         artist: 'Dhanush, Dhee, Yuvan',       genre: 'Dance Anthem',      artwork: usp('1545128485-c400e7702796'), url: 'https://open.spotify.com/search/Rowdy%20Baby' },
    { name: 'Chilla Chilla',      artist: 'Anirudh (Thunivu)',           genre: 'Mass Dance',        artwork: usp('1516589178581-6cd7833ae3b2'), url: 'https://open.spotify.com/search/Chilla%20Chilla%20Thunivu' },
    { name: 'Private Party',      artist: 'Anirudh, Jonita (Don)',       genre: 'Dance Pop',         artwork: usp('1516450360452-9312f5e86fc7'), url: 'https://open.spotify.com/search/Private%20Party%20Anirudh' },
    { name: 'Vaadi Pulla Vaadi',  artist: 'Hiphop Tamizha',              genre: 'Folk Pop Banger',   artwork: usp('1511671782779-c97d3d27a1d4'), url: 'https://open.spotify.com/search/Vaadi%20Pulla%20Vaadi' },
    { name: 'Badass',             artist: 'Anirudh (Leo)',               genre: 'Heavy Beat',        artwork: usp('1509198397868-475647b2a1e5'), url: 'https://open.spotify.com/search/Badass%20Leo' },
    { name: 'Dippam Dappam',      artist: 'Anirudh (KRK)',               genre: 'Kuthu Pop',         artwork: usp('1498038432885-c6f3f1b912ee'), url: 'https://open.spotify.com/search/Dippam%20Dappam' },
    { name: 'Vikram Title Track', artist: 'Anirudh (Vikram)',            genre: 'Action EDM',        artwork: usp('1517649763962-0c623266e804'), url: 'https://open.spotify.com/search/Vikram%20Title%20Track' },
    { name: 'Hukum',              artist: 'Anirudh (Jailer)',            genre: 'Power Mass',        artwork: usp('1508700115892-45ecd05ae2ad'), url: 'https://open.spotify.com/search/Hukum%20Jailer' },
  ],
};

const Music: React.FC = () => {
  const { currentEmotion } = useTheme();
  const [selectedEmotion, setSelectedEmotion] = useState<string>(currentEmotion || 'Happy');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentEmotion && EMOTIONS.includes(currentEmotion)) {
      setSelectedEmotion(currentEmotion);
    }
  }, [currentEmotion]);

  const buildTracks = (rawTracks: any[]): Track[] =>
    rawTracks.map((t, i) => ({
      id: `${selectedEmotion}-${i}`,
      name: t.name || t.title || 'Track',
      artist: t.artist || 'Artist',
      genre: t.genre || 'Hit',
      mood: selectedEmotion,
      artwork: t.artwork || '',
      url: t.url || `https://open.spotify.com/search/${encodeURIComponent((t.name || t.title || '') + ' ' + (t.artist || ''))}`,
    }));

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/ai/recommendations?emotion=${encodeURIComponent(selectedEmotion)}`);
        const fetched = res.data.recommendations?.music || [];
        if (fetched.length > 0) {
          setTracks(buildTracks(fetched));
        } else {
          const fb = FALLBACK_TRACKS[selectedEmotion] || FALLBACK_TRACKS['Happy'];
          setTracks(buildTracks(fb));
        }
      } catch {
        // API unreachable — always show rich curated tracks
        const fb = FALLBACK_TRACKS[selectedEmotion] || FALLBACK_TRACKS['Happy'];
        setTracks(buildTracks(fb));
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [selectedEmotion]);

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Headphones className="text-accent" size={28} />
          Music for Your Mood
        </h1>
        <p className="text-white/50 mt-1">
          Curated modern tracks matched specifically for your <span className="text-accent font-medium">{selectedEmotion}</span> vibe
        </p>
      </motion.div>

      {/* Emotion Selector Pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {EMOTIONS.map((emo) => (
          <button
            key={emo}
            onClick={() => setSelectedEmotion(emo)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              selectedEmotion === emo
                ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-105'
                : 'bg-surface/80 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {emo}
          </button>
        ))}
      </div>

      {/* Tracks Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-accent" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  // Open YouTube Music search - no login needed, works on all devices
                  const query = encodeURIComponent(`${track.name} ${track.artist}`);
                  window.open(`https://music.youtube.com/search?q=${query}`, '_blank');
                }}
                className="bg-surface/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Album Cover Art */}
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-accent/30 to-accent/5 mb-4 flex items-center justify-center relative overflow-hidden shadow-md">
                    <img
                      src={track.artwork}
                      alt={track.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = usp('1511671782779-c97d3d27a1d4');
                      }}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover Play overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] gap-2">
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/50 text-white"
                      >
                        <Play size={22} className="ml-0.5 fill-white" />
                      </motion.div>
                      <span className="text-[10px] text-white/70 font-medium">YouTube Music</span>
                    </div>
                  </div>

                  {/* Track Info */}
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-accent transition-colors">{track.name}</h3>
                  <p className="text-white/50 text-xs truncate mt-0.5">{track.artist}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-white/70 font-medium border border-white/10">
                    {track.genre}
                  </span>
                  <button
                    onClick={(e) => toggleLike(e, track.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      size={16}
                      className={likedIds.has(track.id) ? 'fill-pink-500 text-pink-500' : ''}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Music;
