// scripts.js

document.addEventListener("DOMContentLoaded", () => {
  // ---------- 1. Handle Upload Form Submission ----------
  const uploadForm = document.querySelector("form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const module = document.getElementById("module").value.trim();
      const qualification = document.getElementById("qualification").value.trim();
      const description = document.getElementById("description").value.trim();
      const fileInput = document.getElementById("file");
      const file = fileInput.files[0];

      if (!file) {
        alert("Please upload a file before submitting.");
        return;
      }

      const note = {
        id: Date.now(),  // unique ID
        module,
        qualification,
        description,
        fileName: file.name,
      };

      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      notes.push(note);
      localStorage.setItem("notes", JSON.stringify(notes));

      alert("Note uploaded successfully!");
      uploadForm.reset();
      window.location.href = "myNotes.html";
    });
  }

  // ---------- 2. Load Notes from localStorage ----------
  const notes = JSON.parse(localStorage.getItem("notes")) || [];

  // ---------- 2a. Browse Notes Page ----------
  const browseContainer = document.querySelector(".note-gallery");
  if (browseContainer) {
    browseContainer.innerHTML = ""; // clear hardcoded cards
    if (notes.length === 0) {
      browseContainer.innerHTML = "<p>No notes uploaded yet.</p>";
    } else {
      notes.forEach((note) => {
        const card = document.createElement("div");
        card.classList.add("note-card");
        card.innerHTML = `
          <h3>Module: ${note.module}</h3>
          <p>Qualification: ${note.qualification}</p>
          <p><em>${note.description || "No description provided."}</em></p>
          <button onclick="alert('Downloading ${note.fileName}')">Download</button>
        `;
        browseContainer.appendChild(card);
      });
    }
  }

  // ---------- 2b. My Notes Page ----------
  const myNotesContainer = document.querySelector(".notes-section");
  if (myNotesContainer) {
    const noteCardsContainer = document.createElement("div");
    noteCardsContainer.classList.add("my-notes-cards");
    myNotesContainer.appendChild(noteCardsContainer);

    if (notes.length === 0) {
      noteCardsContainer.innerHTML = "<p>No notes uploaded yet.</p>";
    } else {
      notes.forEach((note) => {
        const card = document.createElement("div");
        card.classList.add("note-card");
        card.setAttribute("data-id", note.id); // store id for reference
        card.innerHTML = `
          <h3>${note.module}</h3>
          <p><strong>Qualification:</strong> ${note.qualification}</p>
          <p><strong>Description:</strong> ${note.description || "No description provided."}</p>
          <p><strong>File:</strong> ${note.fileName}</p>
          <a href="#" onclick="alert('Downloading ${note.fileName}')">Download</a>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;
        noteCardsContainer.appendChild(card);

        // --- Edit functionality ---
        card.querySelector(".edit-btn").addEventListener("click", () => {
          const newModule = prompt("Enter new module name:", note.module);
          if (newModule === null) return;
          const newQualification = prompt("Enter new qualification:", note.qualification);
          if (newQualification === null) return;
          const newDescription = prompt("Enter new description:", note.description);
          if (newDescription === null) return;

          note.module = newModule.trim();
          note.qualification = newQualification.trim();
          note.description = newDescription.trim();

          localStorage.setItem("notes", JSON.stringify(notes));

          // Update card UI
          card.querySelector("h3").textContent = note.module;
          card.querySelector("p:nth-of-type(1)").innerHTML = `<strong>Qualification:</strong> ${note.qualification}`;
          card.querySelector("p:nth-of-type(2)").innerHTML = `<strong>Description:</strong> ${note.description}`;
          alert("Note updated successfully!");
        });

        // --- Delete functionality ---
        card.querySelector(".delete-btn").addEventListener("click", () => {
          if (confirm(`Are you sure you want to delete "${note.module}"?`)) {
            // Remove from array
            const index = notes.findIndex(n => n.id === note.id);
            if (index > -1) {
              notes.splice(index, 1);
              localStorage.setItem("notes", JSON.stringify(notes));
              card.remove();
            }
          }
        });
      });
    }
  }
});
