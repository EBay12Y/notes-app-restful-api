function home() {
    const BASE_URL = "https://notes-api.dicoding.dev/v2";

    // Fungsi untuk menampilkan indikator loading
    function showLoadingIndicator() {
        const loadingIndicator = document.querySelector(".loader");
        loadingIndicator.style.display = "block";
    }

    // Fungsi untuk menyembunyikan indikator loading
    function hideLoadingIndicator() {
        const loadingIndicator = document.querySelector(".loader");
        loadingIndicator.style.display = "none";
    }

    // Fungsi untuk menampilkan pesan respon
    const showResponseMessage = (message = "Check your internet connection") => {
        alert(message);
    };

    // Fungsi untuk mendapatkan catatan
    const getNote = () => {
        showLoadingIndicator();

        fetch(`${BASE_URL}/notes`)
            .then(response => response.json())
            .then(responseJson => {
                hideLoadingIndicator();

                if (responseJson.error) {
                    showResponseMessage(responseJson.message);
                } else {
                    renderAllNote(responseJson.data);
                }
            })
            .catch(error => {
                hideLoadingIndicator();
                showResponseMessage(error.message);
            });
    };

    // Fungsi untuk memasukkan catatan
    const insertNote = (note) => {
        fetch(`${BASE_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        })
            .then(response => response.json())
            .then(responseJson => {
                showResponseMessage(responseJson.message);
                getNote();
            })
            .catch(error => {
                showResponseMessage(error.message);
            });
    };

    // Fungsi untuk menghapus catatan
    const removeNote = (noteId) => {
        fetch(`${BASE_URL}/notes/${noteId}`, {
            method: "DELETE",
        })
            .then(response => response.json())
            .then(responseJson => {
                showResponseMessage(responseJson.message);
                getNote();
            })
            .catch(error => {
                showResponseMessage(error.message);
            });
    };

    const renderAllNote = (notes) => {
        const noteListContainerElement =
            document.querySelector("#noteListContainer");
        const noteListElement = noteListContainerElement.querySelector("note-list");
        noteListElement.innerHTML = "";

        notes.forEach((note) => {
            noteListElement.innerHTML += `
        <div class="card">
            <div class="card-head">
              <h3 id="notesTitle">${note.title}</h3>
              <button id="deleteBtn" data-note-id="${note.id}">Delete</button>
            </div>
          <div id="notesDesc">${note.body}</div>
        </div>
        `;
        });

        const buttons = document.querySelectorAll("#deleteBtn");
        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const noteId = event.target.getAttribute("data-note-id");
                removeNote(noteId);
            });
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        const inputNoteTitle = document.querySelector("#noteTitle");
        const inputNoteDescription = document.querySelector("#noteDesc");
        const saveBtn = document.querySelector("#saveBtn");
        const form = document.querySelector('.notes-form');
        const titleInput = form.elements.noteTitle;
        const descInput = form.elements.noteDesc;
        const titleError = document.getElementById('titleError');
        const descError = document.getElementById('descError');

        saveBtn.addEventListener("click", function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
            } else {
                const note = {
                    title: inputNoteTitle.value,
                    body: inputNoteDescription.value,
                };
                insertNote(note);
            }
        });

        getNote();

        // Validasi Form custom
        titleInput.addEventListener('input', () => {
            if (titleError) {
                titleError.textContent = '';
            }
            if (!titleInput.validity.valid) {
                titleError.textContent = 'Judul harus diisi dan minimal 3 karakter.';
            }
        });

        descInput.addEventListener('input', () => {
            if (descError) {
                descError.textContent = '';
            }
            if (!descInput.validity.valid) {
                descError.textContent = 'Deskripsi harus diisi dan minimal 5 karakter.';
            }
        });

        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
            }
        });
    });
}

export default home;
