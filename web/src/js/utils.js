/*


*/

let context;
let recording = false;
var recordButton = $("recordButton");
var stopButton = $("stopButton");
var recBlob;
let sampleFreesoundUri = "https://freesound.org/data/previews/0/515_319-lq.mp3";
let recorder = null;
let audio = null;
let audioChunks = [];


getTrackFromMedia = function(audioElement) {

    // web audio api audio context
    const audioContext = new AudioContext();
    const track = audioContext.createMediaElementSource(audioElement);
    return track;
}


// adapted from https://gist.github.com/bryanjenningz/f60c42b0a2091c91bad21c91faadc88d
const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
    const start = () => mediaRecorder.start();
    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          // addSourceToAudioPlayer(audio);
          resolve({ audioBlob, audioUrl, play});
        });
        mediaRecorder.stop();
      });
    resolve({ start, stop });
});


const recordStop = async () => {

  if (recorder) {
    audio = await recorder.stop();
    recorder = null;
    addSourceToAudioPlayer(audio.audioUrl);
    $("#audio-div").show();
    $("#recordButton").prop("disabled", false);
    $("#recordButton").html('Record &nbsp;&nbsp;<i class="microphone icon"></i>');
  } else {
    recorder = await recordAudio();
    recorder.start();
    $('#recordButton').html('Stop &nbsp;&nbsp;<i class="stop icon"></i>');
    $("#recordButton").prop("disabled", false);
  }
};


// self-explanatory
addSourceToAudioPlayer = function(url) {

    $("#audio-source").attr("src", url);
    $("#audio-div")[0].pause();
    $("#audio-div")[0].load();
    $("#audio-div")[0].oncanplaythrough = $("#audio-div")[0].pause();
}


// self-explanatory
addToAudioPlayer = function(blob) {

    var blobUrl = URL.createObjectURL(blob);
    addSourceToAudioPlayer(blobUrl);
}


getBlobFileContainer = function() {
    if ($('#file-menu')[0].files.length != 0) {
        return $("#file-menu")[0].files[0];
    }
    else {
        throw "Couldn't find any files in the filecontainer. Please upload your file again."
    }
}


// self-explanatory
checkUploadFileExtension = function(blob, allowedExtensions=["wav", "mp3", 'ogg']) {

    var filename_split = blob.name.split(".")
    var fileExt = filename_split[filename_split.length - 1];
    fState = $.inArray(fileExt, allowedExtensions) > -1;
    if (!fState) {
        alert('Incompatible audio file format! Only the following file formats are supported at the moment: \n [' + allowedExtensions.join(", ") + ', ]');
        throw "uploaded un-supported audio file format";
    }
}


// submit a local file from users disk using web ui
uploadAudioFileFromMenu = function(fileContainer, uploadType) {

    let reader = new FileReader();
    var blob;

    if (uploadType === 'popup') { 
    	blob = fileContainer[0].files[0] 
    }
    else if (uploadType === 'dragndrop') { 
    	blob = fileContainer; 
    }

    reader.readAsBinaryString(blob);
    checkUploadFileExtension(blob);

    if ((blob.size / 1024 / 1024) > FILE_UPLOAD_LIMIT) {
        alert("Too big file to process! Please a upload a audio file less than " + FILE_UPLOAD_LIMIT + "mb!");
        throw "Excedees maximum upload file size limit " + FILE_UPLOAD_LIMIT + "mb!";
    }
   
    addToAudioPlayer(blob);
    console.log("file uploaded succesfully");
    $("#audio-div").show();
}


getFreesoundPreview = function(soundId, accessToken) {

	var url = "http://www.freesound.org/apiv2/search/1234" + soundId + "/?fields=id,previews"; //just for reference
	url = encodeURI(url);
	access_token = val;
	url = encodeURI(val);

	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",url);
	xmlhttp.setRequestHeader("Authorization", "Bearer " + accessToken);
	xmlhttp.onreadystatechange = parsePrevewUriFreesound;
	xmlhttp.send();
}


parsePrevewUriFreesound = function()
{
	if (this.readyState == 4){
 		var myjson = JSON.stringify(this.responseText);
		var mystr = myjson.split('\\').join('');
		var uri = mystr.substr(1).slice(0, -1);
		return uri
		}
	else {
		console.log("Failed to parse preview url from freesound.org for the given sound id ")
		return -1;
	}
}



