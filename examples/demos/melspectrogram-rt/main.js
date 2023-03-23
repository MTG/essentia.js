import $ from 'jquery';

import { audioManager } from './audio.js';
import { Visualizer } from './visualisation.js';
let visualizer;

(function() {

    function onRecordClickHandler() {
        let recording = $(this).hasClass("recording");
        if (recording) {
            audioManager.stopAudio().then( () => {
                // manage button state
                $("#recordButton").removeClass("recording");
                $("#recordButton").html('Mic &nbsp;&nbsp;<i class="microphone icon"></i>');
                
                console.log("Stopped recording ...");
            });
            visualizer.drawFullSpectrogram();
            return;
        }

        $(this).prop("disabled", true);
        // empty canvas
        // visualizer.empty();
        // start microphone stream using getUserMedia and runs the feature extraction
        audioManager.startAudio()
        .then( () => {
            // start plot animation
            visualizer.drawMovingGraph();
            // set button to stop
            $("#recordButton").addClass("recording");
            $("#recordButton").html('Stop &nbsp;&nbsp;<i class="stop icon"></i>');
            $("#recordButton").prop("disabled", false);
        })
        .catch( err => {
            console.error(err);
            if (err.msg === "SAB transfer failed") {
                alert("No SharedArrayBuffer tranfer support, try another browser.");
                $("#recordButton").off('click', onRecordClickHandler);
                $("#recordButton").prop("disabled", true);
            }
        })
    }

    $(document).ready(function() {
        // check for SharedArrayBuffer support:
        try {
            const testSAB = new SharedArrayBuffer(1); 
            // add event listeners to ui objects
            $("#recordButton").on('click', onRecordClickHandler);
            visualizer = new Visualizer('displayCanvas');
        } catch (e) {
            if (e instanceof ReferenceError && !crossOriginIsolated) {
                $("#recordButton").prop('disabled', true);
                // redirect to cross-origin isolated SAB-capable version on Netlify
                window.location = "https://essentiajs-melspectrogram.netlify.app";
                return;
            }

            console.error(e);
            // Unknown malfunction: alert user and offer alternative
            // $("#recordButtonContainer").before(`
            //     <div class="ui message">
            //         <div class="header">Unable to run app</div>
            //         <p><a href="https://essentiajs-melspectrogram.netlify.app">Check out this version! <i class="external alternate icon"></i><a/></p>
            //         <p style="font-weight: 300;"><a href="https://github.com/MTG/essentia.js/issues">Let us know <i class="icon comment"></i></a></p>
            //     </div>`);
        }
    });
})();