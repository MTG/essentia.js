const tagvizTemplate = document.createElement('template');
tagvizTemplate.innerHTML = `
    <style>
        #body {
            margin: 0.3rem;
            padding: 0.4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-around;

            width: 90px;
            min-height: 70px;
            height: 80px;

            box-shadow: 0 0 0.4rem 0.1rem rgba(0, 0, 0, 0.3);
            border-radius: 0.2rem;
            text-align: center;
            font-family: 'Poppins', sans-serif;
            font-size: 16px;

            // box-sizing: border-box;

            opacity: 0.3;
            filter: grayscale(1);
            background-color: white;
        }

        h3 {
            font-size: 0.85em;
            font-weight: 400;
            color: #FCA905;
            margin: 0;
        }

        hr {
            width: 100%;
            border-top: 1px solid rgb(199, 199, 199);
            border-bottom: none;
            margin: 0 auto;
        }

        #icon {
            font-size: 1.3em;
            width: 100%;
        }

        .highlight {
            border-style: solid;
            border-width: 0.2rem;
            border-color: #FCA905;
        }
    </style>

    <div id="body" class="highlight">
        <h3 id="tag-name"></h3>
        <hr>
        <div id="icon"></div>
    </div>
`;

class MusicTagViz extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(tagvizTemplate.content.cloneNode(true));

        this.breakpoint = {
            in: 0.3,
            out: 0.95
        };

        this.scale = {
            midpiece: new LineFunc(0.07, this.breakpoint.in, 0, this.breakpoint.out),
            toppiece: new LineFunc(this.breakpoint.in, 1, this.breakpoint.out, 1)
        }

        this.body = this.shadowRoot.querySelector('#body');
        this.isHighlighted = false;
    }

    connectedCallback() {
        this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
        this.shadowRoot.querySelector('#icon').innerText = this.getAttribute('icon');
    }

    _compressActivation(v) {
        // put through piecewise compression function
        if (v <= 0.07 && v >= 0) {
            return 0;
        } else if (v <= this.breakpoint.in) {
            return this.scale.midpiece.compute(v);
        } else if (v > this.breakpoint.in && v <= 1) {
            return this.scale.toppiece.compute(v);
        }
    }

    setActivation(value, interval) {
        let scaledActivation = this._compressActivation(value);
        // value: 0.0 - 1.0
        // interval: time in secs
        this.body.style.transition = `opacity ${interval}s`;
        this.body.style.filter = `grayscale(${1-scaledActivation})`;
        this.body.style.opacity = 0.3 + (scaledActivation * 0.7);
    }

    reset() {
        this.body.style.opacity = 0.3;
        this.body.style.filter = "grayscale(1)";
    }
}

window.customElements.define('music-tag-viz', MusicTagViz);

// utility calc:

class LineFunc {
    constructor(minIn, maxIn, minOut, maxOut) {
        this.b = (minOut - (minIn*maxOut/maxIn)) / ((-minIn/maxIn) + 1);
        this.m = (maxOut - this.b) / maxIn;
    }

    compute(v) {
        return this.m*v + this.b; 
    }
}