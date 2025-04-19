class LoadingIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      .loading-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .loader {
        position: relative;
        width: 80px;
        height: 80px;
      }

      .circle {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #5b86e5;
        animation: bounce 1.2s ease-in-out infinite;
      }

      .circle:nth-child(1) {
        top: 8px;
        left: 0;
        animation-delay: 0s;
      }

      .circle:nth-child(2) {
        top: 0;
        left: 32px;
        animation-delay: -0.2s;
        background-color: #48a1f3;
      }

      .circle:nth-child(3) {
        top: 8px;
        right: 0;
        animation-delay: -0.4s;
        background-color: #36c9f6;
      }

      .circle:nth-child(4) {
        bottom: 8px;
        right: 0;
        animation-delay: -0.6s;
        background-color: #24d8fa;
      }

      .circle:nth-child(5) {
        bottom: 0;
        left: 32px;
        animation-delay: -0.8s;
        background-color: #15e8db;
      }

      .circle:nth-child(6) {
        bottom: 8px;
        left: 0;
        animation-delay: -1.0s;
        background-color: #09f8bb;
      }

      .text {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        font-family: sans-serif;
        font-size: 14px;
        color: #5b86e5;
        animation: pulse 1.5s ease-in-out infinite;
      }

      @keyframes bounce {
        0%, 100% {
          transform: scale(0.6);
          opacity: 0.4;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
      }
    </style>

    <div class="loading-container">
      <div class="loader">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="text">Loading...</div>
      </div>
    </div>
    `;
  }
}

customElements.define("loading-indicator", LoadingIndicator);
