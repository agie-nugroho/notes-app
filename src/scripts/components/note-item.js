import ApiService from "../data/api-service";
import {
  renderNotes,
  showFeedback,
  showLoading,
  hideLoading,
} from "../../app.js";

class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["note-id"];
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === "note-id") {
      try {
        showLoading();
        const notes = await ApiService.getAllNotes();
        hideLoading();

        const note = notes.find((note) => note.id === newValue);
        if (note) {
          this._note = note;
          this.render();
        }
      } catch (error) {
        hideLoading();
        showFeedback(
          "Error",
          "Gagal memuat catatan. Silahkan coba lagi.",
          "Error"
        );
      }
    }
  }

  async connectedCallback() {
    const noteId = this.getAttribute("note-id");
    if (noteId) {
      try {
        showLoading();
        const notes = await ApiService.getAllNotes();
        hideLoading();
        const note = notes.find((note) => note.id === noteId);
        if (note) {
          this._note = note;
          this.render();
        }
      } catch (error) {
        hideLoading();
        showFeedback(
          "Error",
          "Gagal memuat catatan. Silahkan coba lagi.",
          "Error"
        );
      }
    }
  }

  formatDate(dateString) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  }

  render() {
    if (!this._note) return;

    this.shadowRoot.innerHTML = `
        <style>
          .note-item {
            background-color: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .note-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          
          .note-title {
            margin: 0;
            color: #5b86e5;
            font-size: 18px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          
          .note-date {
            color: #999;
            font-size: 12px;
            margin-bottom: 12px;
          }
          
          .note-body {
            color: #666;
            white-space: pre-line;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            margin-bottom: 15px;
            flex-grow: 1;
          }
          
          .note-actions {
            display: flex;
            justify-content: space-between;
            margin-top: auto;
          }
          
          .btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          .btn-archive {
            background-color: #f5f5f5;
            color: #666;
          }
          
          .btn-archive:hover {
            background-color: #e0e0e0;
          }
          
          .btn-delete {
            background-color: #ffebee;
            color: #f44336;
          }
          
          .btn-delete:hover {
            background-color: #ffcdd2;
          }
          
          @media (max-width: 480px) {
            .note-title {
              font-size: 16px;
            }
            
            .btn {
              padding: 6px 10px;
              font-size: 12px;
            }
          }
        </style>
        
        <div class="note-item fade-in">
          <h3 class="note-title">${this._note.title}</h3>
          <p class="note-date">${this.formatDate(this._note.createdAt)}</p>
          <p class="note-body">${this._note.body}</p>
          <div class="note-actions">
            <button class="btn btn-archive">${
              this._note.archived ? "Batal Arsip" : "Arsipkan"
            }</button>
            <button class="btn btn-delete">Hapus</button>
          </div>
        </div>
      `;

    this.shadowRoot
      .querySelector(".btn-archive")
      .addEventListener("click", async () => {
        try {
          showLoading();
          if (this._note.archived) {
            await ApiService.unarchiveNote(this._note.id);
          } else {
            await ApiService.archiveNote(this._note.id);
          }
          hideLoading();
          renderNotes();
          showFeedback(
            "Sukses",
            `Catatan berhasil ${
              this._note.archived ? "diaktifkan" : "diarsipkan"
            }`,
            "success"
          );
        } catch (error) {
          hideLoading();
          showFeedback(
            "Error",
            `Gagal ${
              this._note.archived ? "mengaktifkan" : "mengarsipkan"
            } catatan`,
            "error"
          );
        }
      });

    this.shadowRoot
      .querySelector(".btn-delete")
      .addEventListener("click", async () => {
        try {
          showLoading();
          await ApiService.deleteNote(this._note.id);
          hideLoading();
          renderNotes();
          showFeedback("Sukses", "Catatan berhasil dihapus", "success");
        } catch (error) {
          hideLoading();
          showFeedback("Error", "Gagal menghapus catatan", "error");
        }
      });
  }
}

customElements.define("note-item", NoteItem);
