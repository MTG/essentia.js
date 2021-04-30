(function() {
  const template = document.createElement('template');
  template.innerHTML = `
      <style>
        :host {
          height: 35vh;
          width: 45vw;
          margin: auto;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 100;

          --button-color: #bfbfbf;
          --primary-color: #E6E6E6;
          --secondary-color: #949494;
          --tertiary-color: #545454;
          --transition-time: 0.24s;
          
          transition: visibility 0.5s, opacity 0.5s;
        }

        .container {
          background-color: var(--primary-color);
          padding: 0.66rem 2rem;

          color: var(--tertiary-color);
          border-radius: 0.33rem;
          box-shadow: 0px 0px 12px 1px var(--secondary-color);
        }

        h1 {
          font-size: 1rem;
          font-weight: 400;
        }

        hr {
          height: 1px;
          background-color: var(--secondary-color);
          border: 0.05rem solid var(--secondary-color);
        }

        p {
          font-size: 0.8rem;
          text-align: justify;
        }

        #ok-button-container {
          text-align: right;
          margin-top: 1.4rem;
        }

        #ok-button {
          display: inline;
          background-color: var(--button-color);
          padding: 0.3rem 0.9rem;

          text-decoration: none;
          color: var(--tertiary-color);
          border-radius: 0.33rem;
          box-shadow: 0 2px 5px 0px #00000015;

          transition: background-color var(--transition-time), color var(--transition-time);
        }

        #ok-button:hover {
          cursor: pointer;
          color: var(--primary-color);
          background-color: var(--secondary-color);

          transition: background-color var(--transition-time), color var(--transition-time);
        }
      </style>
      
      <div class="container">
        <h1>Title</h1>
        <hr>
        <p id="main-text">Lorem ipsum...</p>
        <p id="ok-button-container"><a id="ok-button">OK!</a></p>
      </div>
  `;

  class ExplanationModal extends HTMLElement {
      constructor() {
          super();

          this.attachShadow({ mode: 'open' });
          this.shadowRoot.appendChild(template.content.cloneNode(true));

          // init variables
      }

      connectedCallback() {
          this.shadowRoot.querySelector('h1').innerText = this.getAttribute('title');
          this.shadowRoot.querySelector('#main-text').innerText = this.getAttribute('main-text');
        
          const okButton = this.shadowRoot.querySelector('#ok-button');
          okButton.innerText = this.getAttribute('button-text');
          okButton.onclick = () => {
            this.style.opacity = "0%";
            this.style.visibility = "hidden";
          };
        
      }

      // further element-specific methods here:
  }

  window.customElements.define('explanation-modal', ExplanationModal);
})()