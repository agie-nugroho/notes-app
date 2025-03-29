import "./components/index.js";

let currentView = "active";

function renderNotes() {
  const notesList = document.getElementById("notes-list");
  const sectionTitle = document.getElementById("notes-section-title");
  notesList.innerHTML = "";

  const filteredNotes = notesData.filter((note) =>
    currentView === "active" ? !note.archived : note.archived
  );

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
    noteElement.style.animationDelay = `${index * 0.1}s`;
    notesList.appendChild(noteElement);
  });
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
