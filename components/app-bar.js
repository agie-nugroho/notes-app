class AppBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["logo", "title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot.querySelector(".app-bar")) {
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const logo = this.getAttribute("logo") || "📝";
    const title = this.getAttribute("title") || "Aplikasi Catatan";

    this.shadowRoot.innerHTML = `
        <style>
          .app-bar {
            background: linear-gradient(135deg, #5b86e5, #36d1dc);
            color: white;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: center;
            align-items: center;
          }
          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .logo {
            font-size: 28px;
            margin-right: 10px;
          }
          @media (max-width: 480px) {
            .app-bar {
              padding: 15px;
            }
            h1 {
              font-size: 20px;
            }
            .logo {
              font-size: 24px;
            }
          }
        </style>
        
        <div class="app-bar">
          <span class="logo">${logo}</span>
          <h1>${title}</h1>
        </div>
      `;
  }
}

// Register custom element
customElements.define("app-bar", AppBar);
