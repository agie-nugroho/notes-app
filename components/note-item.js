class NoteItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["note-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "note-id") {
      const note = notesData.find((note) => note.id === newValue);
      if (note) {
        this._note = note;
        this.render();
      }
    }
  }

  connectedCallback() {
    const noteId = this.getAttribute("note-id");
    if (noteId) {
      const note = notesData.find((note) => note.id === noteId);
      if (note) {
        this._note = note;
        this.render();
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
      .addEventListener("click", () => {
        this._note.archived = !this._note.archived;
        renderNotes();
      });

    this.shadowRoot
      .querySelector(".btn-delete")
      .addEventListener("click", () => {
        if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
          const index = notesData.findIndex(
            (note) => note.id === this._note.id
          );
          if (index !== -1) {
            notesData.splice(index, 1);
            renderNotes();
          }
        }
      });
  }
}

customElements.define("note-item", NoteItem);
