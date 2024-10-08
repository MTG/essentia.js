import effnetMoodHappy from './effnet-based/mood_happy-discogs-effnet-1.onnx?url';
import effnetMoodSad from './effnet-based/mood_sad-discogs-effnet-1.onnx?url';
import effnetMoodRelaxed from './effnet-based/mood_relaxed-discogs-effnet-1.onnx?url';
import effnetMoodAggressive from './effnet-based/mood_aggressive-discogs-effnet-1.onnx?url';
import effnetDanceability from './effnet-based/danceability-discogs-effnet-1.onnx?url';
import effnetApproachability from './effnet-based/approachability_regression-discogs-effnet-1.onnx?url';
import effnetEngagement from './effnet-based/engagement_regression-discogs-effnet-1.onnx?url';

export default {
  heads: {
    "mood_happy": {
      name: "Mood Happy",
      url: {
        effnet: effnetMoodHappy
      }
    },
    "mood_sad": {
      name: "Mood Sad",
      url: {
        effnet: effnetMoodSad
      }
    },
    "mood_relaxed": {
      name: "Mood Relaxed",
      url: {
        effnet: effnetMoodRelaxed
      }
    },
    "mood_aggressive": {
      name: "Mood Aggressive",
      url: {
        effnet: effnetMoodAggressive
      }
    },
    "danceability": {
      name: "Danceability",
      url: {
        effnet: effnetDanceability
      }
    },
    "approachability": {
      name: "Approachability",
      url: {
        effnet: effnetApproachability
      }
    },
    "engagement": {
      name: "Engagement",
      url: {
        effnet: effnetEngagement
      }
    }
  }
}