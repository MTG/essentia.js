import confounded from "../images/arousal-valence-emojis/confounded.png";
import grinning from "../images/arousal-valence-emojis/grinning.png";
import hugging_face from "../images/arousal-valence-emojis/hugging_face.png";
import pensive from "../images/arousal-valence-emojis/pensive.png";
import person_in_lotus_position from "../images/arousal-valence-emojis/person_in_lotus_position.png";
import relieved from "../images/arousal-valence-emojis/relieved.png";
import shushing_face from "../images/arousal-valence-emojis/shushing_face.png";
import sleeping from "../images/arousal-valence-emojis/sleeping.png";
import star_struck from "../images/arousal-valence-emojis/star-struck.png";
import triumph from "../images/arousal-valence-emojis/triumph.png";
import warning from "../images/arousal-valence-emojis/warning.png";
import worried from "../images/arousal-valence-emojis/worried.png";
import neutral from "../images/arousal-valence-emojis/neutral_face.png";

const emojis = [
  grinning,
  hugging_face,
  star_struck,
  warning,
  confounded,
  triumph,
  worried,
  pensive,
  sleeping,
  shushing_face,
  person_in_lotus_position,
  relieved
];

const centerVal = 5; // (5,5) is center for emomusic output range [1,9]

function isPointNearCenter(x, y, tolerance=1) {
  const mse = ((x - centerVal)**2 + (y - centerVal)**2) ** 0.5;
  return mse <= tolerance
}

export function pointToEmoji(x, y) {
  const img = new Image(40, 40);
  if (isPointNearCenter(x, y)) {
    img.src = neutral;
    return img;
  }

  let angle = Math.atan2(y-centerVal, x-centerVal) * 180/Math.PI; // in degrees
  if (angle < 0) angle += 360;
  const clockPos = Math.floor(angle/30);
  img.src = emojis[clockPos]
  return img;
}
