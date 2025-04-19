import ApiService from "../data/api-service";
import {
  renderNotes,
  showFeedback,
  showLoading,
  hideLoading,
} from "../../app.js";

class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "max-title-length",
      "max-body-length",
      "placeholder-title",
      "placeholder-body",
    ];
  }

  connectedCallback() {
    this.render();
    this.initEvent();
  }

  render() {
    const maxTitleLength = this.getAttribute("max-title-length") || 50;
    const maxBodyLength = this.getAttribute("max-body-length") || 1000;
    const placeholderTitle =
      this.getAttribute("placeholder-title") || "Judul catatan";
    const placeholderBody =
      this.getAttribute("placeholder-body") || "Isi catatan";

    this.shadowRoot.innerHTML = `
        <style>
          .note-form {
            background-color: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .form-group {
            margin-bottom: 20px;
            position: relative;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
          }
          
          .form-control {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          
          .form-control:focus {
            outline: none;
            border-color: #5b86e5;
            box-shadow: 0 0 0 3px rgba(91, 134, 229, 0.2);
          }
          
          .form-control.invalid {
            border-color: #f44336;
          }
          
          .form-group textarea {
            min-height: 120px;
            resize: vertical;
          }
          
          .error-message {
            color: #f44336;
            font-size: 12px;
            margin-top: 5px;
            display: none;
          }
          
          .error-message.visible {
            display: block;
          }
          
          .character-count {
            position: absolute;
            right: 10px;
            bottom: 10px;
            font-size: 12px;
            color: #999;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 3px 6px;
            border-radius: 4px;
          }
          
          .submit-btn {
            background: linear-gradient(135deg, #5b86e5, #36d1dc);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            width: 100%;
          }
          
          .submit-btn:hover {
            box-shadow: 0 4px 10px rgba(91, 134, 229, 0.3);
          }
          
          .submit-btn:disabled {
            background: #cccccc;
            cursor: not-allowed;
          }
          
          @media (max-width: 768px) {
            .note-form {
              padding: 15px;
            }
            
            .form-control {
              padding: 10px 12px;
            }
            
            .submit-btn {
              padding: 10px 16px;
            }
          }
        </style>
        
        <form class="note-form" id="note-form">
          <div class="form-group">
            <label for="title">Judul</label>
            <input type="text" id="title" class="form-control" placeholder="${placeholderTitle}" maxlength="${maxTitleLength}" required>
            <div class="error-message" id="title-error">Judul tidak boleh kosong</div>
            <div class="character-count"><span id="title-count">0</span>/${maxTitleLength}</div>
          </div>
          
          <div class="form-group">
            <label for="body">Isi Catatan</label>
            <textarea id="body" class="form-control" placeholder="${placeholderBody}" maxlength="${maxBodyLength}" required></textarea>
            <div class="error-message" id="body-error">Isi catatan tidak boleh kosong</div>
            <div class="character-count"><span id="body-count">0</span>/${maxBodyLength}</div>
          </div>
          
          <button type="submit" class="submit-btn" id="submit-btn" disabled>Simpan Catatan</button>
        </form>
      `;
  }

  initEvent() {
    const form = this.shadowRoot.querySelector("#note-form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleError = this.shadowRoot.querySelector("#title-error");
    const bodyError = this.shadowRoot.querySelector("#body-error");
    const submitBtn = this.shadowRoot.querySelector("#submit-btn");
    const titleCount = this.shadowRoot.querySelector("#title-count");
    const bodyCount = this.shadowRoot.querySelector("#body-count");

    titleInput.addEventListener("input", () => {
      const value = titleInput.value.trim();
      titleCount.textContent = value.length;

      if (value === "") {
        titleInput.classList.add("invalid");
        titleError.classList.add("visible");
      } else {
        titleInput.classList.remove("invalid");
        titleError.classList.remove("visible");
      }

      this.checkFormValidity(titleInput, bodyInput, submitBtn);
    });

    // validasi
    bodyInput.addEventListener("input", () => {
      const value = bodyInput.value.trim();
      bodyCount.textContent = value.length;

      if (value === "") {
        bodyInput.classList.add("invalid");
        bodyError.classList.add("visible");
      } else {
        bodyInput.classList.remove("invalid");
        bodyError.classList.remove("visible");
      }

      this.checkFormValidity(titleInput, bodyInput, submitBtn);
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      if (title !== "" && body !== "") {
        const newNote = {
          title,
          body,
        };

        try {
          showLoading();
          await ApiService.addNote(newNote);
          hideLoading();

          titleInput.value = "";
          bodyInput.value = "";
          titleCount.textContent = "0";
          bodyCount.textContent = "0";
          submitBtn.disabled = true;

          renderNotes();
          this.showNotification("Catatan berhasil ditambahkan!");
        } catch (error) {
          hideLoading();
          showFeedback("Error", "Gagal menambahkan catatan", "error");
        }
      }
    });
  }

  checkFormValidity(titleInput, bodyInput, submitBtn) {
    if (titleInput.value.trim() !== "" && bodyInput.value.trim() !== "") {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transition: all 0.3s ease;
        transform: translateY(100px);
      `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateY(0)";
    }, 10);

    setTimeout(() => {
      notification.style.transform = "translateY(100px)";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

customElements.define("note-input", NoteInput);
