const BASE_URL = "https://notes-api.dicoding.dev/v2";

class ApiService {
  static async getAllNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();
    return responseJson.data;
  }

  static async addNote(note) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: "DELETE",
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: "POST",
    });
    const responseJson = await response.json();
    return responseJson;
  }

  static async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: "POST",
    });
    const responseJson = await response.json();
    return responseJson;
  }
}

export default ApiService;
