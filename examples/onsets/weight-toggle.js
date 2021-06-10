(function() {
    const template = document.createElement("template");
    template.innerHTML = `
        <link rel="stylesheet" href="weight-toggle.css">
  
        <div class="container">
          <button class="on"></button>
          <div class="collapsible">
            <input type="number" step="0.01"  min="0.0" max="1.0" placeholder="weighting">
          </div>
        </div>
    `;
  
    class WeightToggle extends HTMLElement {
      constructor() {
        super();
  
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
  
        // init variables
        this.container = null;
        this.name = null;
        this.checkbox = null;
        this.weightBox = null;
        this.label = null;
      }
  
      connectedCallback() {
        this.container = this.shadowRoot.querySelector('.container');
        this.name = this.getAttribute("name");
        
        this.checkbox = this.shadowRoot.querySelector('button');
        this.checkbox.innerText = prettifyName(this.name);
        this.checkbox.addEventListener("click", (e) => {
          this.checkbox.classList.toggle("off");
          this.checkbox.classList.toggle("on");
          this.toggleContainer();
        });
      }
  
      // further element-specific methods here:
      toggleContainer() {
        return;
      }
    }
  
    // auxiliary funcs/classes here:
    function prettifyName(str) {
      let result = "";
      const noVowelsRegex = /(?:$|[^aeiouy]|\b)+[^aeiouy]{3,}(?:$|[^aeiouy]|\b)+/g;
      // if three or more consecutive consonants, capitalize all
      if (str.match(noVowelsRegex)) {
        result = str.toUpperCase().split("_");
      } else {
        result = str.split("_");
        // else capitalize only first letter
        result = result.map(substr => substr.startCase());
      }
  
      return result.join(" ");
    }
  
    String.prototype.startCase = function() {
      return this.replace(/(?:^\D|\b\D)/g, function(match) {
        return match.toUpperCase();
      });
    };
  
    window.customElements.define("weight-toggle", WeightToggle);
  }())
  