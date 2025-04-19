// src/app.js
import "./scripts/components/index.js";
import "./scripts/components/loading-indicator.js";
import ApiService from "./scripts/data/api-service.js";
import "/src/styles/style.css";

let currentView = "active";
let isLoading = false;

function showLoading() {
  const loadingElement = document.createElement("loading-indicator");
  document.body.appendChild(loadingElement);
  isLoading = true;
}

function hideLoading() {
  const loadingElement = document.querySelector("loading-indicator");
  if (loadingElement) {
    document.body.removeChild(loadingElement);
  }
  isLoading = false;
}

async function renderNotes() {
  const notesList = document.getElementById("notes-list");
  const sectionTitle = document.getElementById("notes-section-title");
  notesList.innerHTML = "";

  try {
    showLoading();

    let notes;
    if (currentView === "active") {
      notes = await ApiService.getAllNotes();
    } else {
      notes = await ApiService.getArchivedNotes(); // Panggil catatan terarsip
      console.log("Archived Notes:", notes);
    }

    hideLoading();

    const filteredNotes = notes;

    sectionTitle.textContent =
      currentView === "active" ? "Daftar Catatan" : "Catatan Terarsip";

    if (filteredNotes.length === 0) {
      notesList.innerHTML = `<p class="empty-notes">Tidak ada catatan ${
        currentView === "active" ? "aktif" : "terarsip"
      }</p>`;
      return;
    }

    filteredNotes.forEach((note, index) => {
      const noteElement = document.createElement("note-item");
      noteElement.setAttribute("note-id", note.id);
      noteElement.setAttribute("note-archived", note.archived);
      noteElement.style.animationDelay = `${index * 0.1}s`;
      notesList.appendChild(noteElement);
    });
  } catch (error) {
    hideLoading();
    showFeedback("Error", "Gagal memuat catatan. Silakan coba lagi.", "error");
  }
}

function showFeedback(title, message, type) {
  alert(`${title}: ${message}`);
}

function initTabs() {
  const activeTab = document.getElementById("tab-active");
  const archivedTab = document.getElementById("tab-archived");

  activeTab.addEventListener("click", () => {
    activeTab.classList.add("active");
    archivedTab.classList.remove("active");
    currentView = "active";
    renderNotes();
  });

  archivedTab.addEventListener("click", () => {
    archivedTab.classList.add("active");
    activeTab.classList.remove("active");
    currentView = "archived";
    renderNotes();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderNotes();
  initTabs();
});

export { renderNotes, showLoading, hideLoading, showFeedback };
