import effnetMoodHappy from './effnet-based/mood_happy-discogs-effnet-1.onnx?url';
import effnetMoodSad from './effnet-based/mood_sad-discogs-effnet-1.onnx?url';
import effnetMoodRelaxed from './effnet-based/mood_relaxed-discogs-effnet-1.onnx?url';
import effnetMoodAggressive from './effnet-based/mood_aggressive-discogs-effnet-1.onnx?url';
import effnetDanceability from './effnet-based/danceability-discogs-effnet-1.onnx?url';
import effnetApproachability from './effnet-based/approachability_regression-discogs-effnet-1.onnx?url';
import effnetEngagement from './effnet-based/engagement_regression-discogs-effnet-1.onnx?url';
import musicnnEmomusic from './emomusic-msd-musicnn-2.onnx?url';

export default {
  "mood_happy": {
    name: "Mood Happy",
    url: effnetMoodHappy,
    embeddings: "effnet"
  },
  "mood_sad": {
    name: "Mood Sad",
    url: effnetMoodSad,
    embeddings: "effnet"
  },
  "mood_relaxed": {
    name: "Mood Relaxed",
    url: effnetMoodRelaxed,
    embeddings: "effnet"
  },
  "mood_aggressive": {
    name: "Mood Aggressive",
    url: effnetMoodAggressive,
    embeddings: "effnet"
  },
  "danceability": {
    name: "Danceability",
    url: effnetDanceability,
    embeddings: "effnet"
  },
  "approachability": {
    name: "Approachability",
    url: effnetApproachability,
    embeddings: "effnet"
  },
  "engagement": {
    name: "Engagement",
    url: effnetEngagement,
    embeddings: "effnet"
  },
  "emomusic": {
    name: "Arousal-Valence",
    url: musicnnEmomusic,
    embeddings: "musicnn"
  }
}