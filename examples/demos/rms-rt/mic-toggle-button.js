/* 
    DOCS

    Public CSS properties for mic-toggle-button component:
        font-size
        --button-color
        --text-color
        --meter-dot-color
*/


const meterDotSize = 0.4;
const mainTemplate = document.createElement('template');
mainTemplate.innerHTML = `
    <style>
        :host {
            font-size: 1em;
            box-sizing: border-box;
            display: inline-block;

            --button-color: #ff5a5f;
            --button-color-active: #ac4142;
            --text-color: #000000;
            --meter-dot-color: #eeff41;
        }

        * {
            --meter-dot-size: ${meterDotSize}em;
            --icon-text-space: 0.65em;
        }
        
        button {	
            background-color: var(--button-color);
            background-origin: border-box;
            
            font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
            border-radius: 0.3em;
            border: 0;
            padding: 0.4em 0.95em 0.4em 0.8em;
            color: var(--text-color);
            font-size: inherit;
            
            display: flex;
            align-items: center;
        }
        
        button:hover {
            cursor: pointer;
            color: white;
            background-color: var(--button-color-active);
        }

        button:active {
            background-color: var(--button-color-active);
        }
        
        button:hover path {
            fill: white;
        }

        path {
            fill: var(--text-color);
        }
        
        .mic-icon {
            margin-right: var(--icon-text-space);
        }
        
        .button-text {
            margin: 0;
        }
        
        .meter-container {
            display: flex;
            align-items: center;
            
            margin-right: var(--icon-text-space);
            max-height: 1em;
        }
        
        .meter-dot {
            width: var(--meter-dot-size);
            height: var(--meter-dot-size);
            margin: calc(0.15 * var(--meter-dot-size));
            
            border-radius: calc(0.5 * var(--meter-dot-size));
            
            background-color: var(--meter-dot-color);
        }
    </style>

    <button>
        <p class="button-text">Start</p>
    </button>
`;

const micOffTemplate = document.createElement('template');
micOffTemplate.innerHTML = `
<svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 36 36">
<path d="M30 17h-2c0 1.8-.5 3.5-1.4 5l1.5 1.5c1.2-2 1.8-4.2 1.9-6.5z" class="clr-i-solid clr-i-solid-path-1" fill="#fff"/>
<path d="M25 17V9c0-3.9-3.2-7-7.1-6.9c-2.9 0-5.6 1.9-6.5 4.7l13 13c.4-.9.6-1.9.6-2.8z" class="clr-i-solid clr-i-solid-path-2" fill="#fff"/>
<path d="M25.2 26.6l6.9 6.9l1.4-1.4L4 2.6L2.6 4l8.4 8.4V17c0 3.9 3.1 7 7 7c1.3 0 2.5-.3 3.6-1l2.2 2.2C22.1 26.4 20.1 27 18 27c-5.4.2-9.8-4.1-10-9.4V17H6c.1 6.2 4.8 11.4 11 12v3h-3c-.6 0-1 .4-1 1s.4 1 1 1h8c.6 0 1-.4 1-1s-.4-1-1-1h-3v-3c2.2-.2 4.4-1 6.2-2.4z" class="clr-i-solid clr-i-solid-path-3" fill="#fff"/></svg>
`;

const meterTemplate = document.createElement('template');
meterTemplate.innerHTML = `
    <div class="meter-container">
        <div class="meter-dot meter-side"></div>
        <div class="meter-dot meter-center"></div>
        <div class="meter-dot meter-side"></div>
    </div>
`;


class MicToggleButton extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' })
        .appendChild(mainTemplate.content.cloneNode(true));

        // init variables
        this.button = this.shadowRoot.querySelector('button');
        this.button.prepend(micOffTemplate.content.cloneNode(true));

        this.buttonText = this.shadowRoot.querySelector(".button-text");

        this.meterHeight = meterDotSize;

        this.audio = {
            isRecording: false,
            gumStream: null,
            audioCtx: null,
            nodes: {
                mic: null,
                analyser: null
            },
            analyserData: null,
        };

        this.animationID = 0; // animation loop ID
    }

    connectedCallback() {
        this.audio.ctx = new AudioContext();

        navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then((stream) => {
            this.audio.gumStream = stream;
            this.audio.nodes.mic = this.audio.ctx.createMediaStreamSource(this.audio.gumStream);
            this.audio.nodes.analyser = this.audio.ctx.createAnalyser();
            this.audio.nodes.analyser.fftSize = 2 * 128;
        });

        this.button.onclick = (ev) => {
            if (!this.audio.isRecording) {
                this._startAudio();
            } else {
                this._stopAudio();
            }
        };
    }

    // Private:

    _getRMS(sig) {
        let n = sig.length;
        let sumOfSquares = sig.reduce((acc, val) => acc + val**2, 0);
        
        return Math.sqrt(sumOfSquares/n);
    }

    _draw() {
        const meterContainer = this.shadowRoot.querySelector(".meter-container");
        const meterSides = this.shadowRoot.querySelectorAll(".meter-side");
        const meterCenter = this.shadowRoot.querySelector(".meter-center");
        
        this.animationID = window.requestAnimationFrame(()=>{this._draw()});
        
        this.audio.nodes.analyser.getFloatTimeDomainData(this.audio.analyserData);
        let rms = this._getRMS(this.audio.analyserData);
        
        let compressedRMS = (6 + Math.log10(rms) * 1 / Math.log(2)) / 6;
        if (compressedRMS < 0) {
            compressedRMS = 0;
        }

        meterSides.forEach((elm) => {
            elm.style.height = `${Math.abs(0.45 * compressedRMS) + this.meterHeight}em`;
        });
        meterCenter.style.height = `${Math.abs(0.85 * compressedRMS) + this.meterHeight}em`;
    }

    _startAudio () {
        if (this.audio.ctx.state == "suspended") {
            this.audio.ctx.resume();
        }

        this.audio.analyserData = new Float32Array(this.audio.nodes.analyser.frequencyBinCount);
            
        this.audio.nodes.mic.connect(this.audio.nodes.analyser);
        
        this.audio.isRecording = true;
        this.buttonText.innerText = "Stop";
        this.shadowRoot.querySelector('.mic-icon').replaceWith(meterTemplate.content.cloneNode(true));
        this._draw();
    }

    _stopAudio () {
        const meterContainer = this.shadowRoot.querySelector(".meter-container");
        const meterSides = this.shadowRoot.querySelectorAll(".meter-side");
        const meterCenter = this.shadowRoot.querySelector(".meter-center");
        this.buttonText.innerText = "Start";
        
        this.audio.ctx.suspend().then(() => {
            this.audio.nodes.mic.disconnect();
            this.audio.nodes.analyser.disconnect();
            
            this.audio.gumStream = null;
            cancelAnimationFrame(this.animationID);
            
            meterSides.forEach((elm) => {
                elm.style.height = `${this.meterHeight}em`;
            });
            meterCenter.style.height = `${this.meterHeight}em`;
            
            meterContainer.replaceWith(micOffTemplate.content.cloneNode(true));
            
            this.audio.isRecording = false;
        });
    }

    // Public interface:
    connectToAudioNode(audioNode) {
        this.audio.nodes.mic.connect(audioNode);
    }
}

window.customElements.define('mic-toggle-button', MicToggleButton);