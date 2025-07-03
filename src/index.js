
document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  let addToy = false;

  // Toggle form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and render all toys
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => renderToyCard(toy));
    });

  // Render toy card
  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Like button event
    const likeBtn = card.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;
      updateLikes(toy.id, newLikes, card);
    });

    toyCollection.appendChild(card);
  }

  // Handle form submission
  toyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const image = e.target.image.value;

    const newToy = {
      name,
      image,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(res => res.json())
    .then(toy => {
      renderToyCard(toy);
      toyForm.reset(); // Clear form
    });
  });

  // Update likes
  function updateLikes(id, newLikes, card) {
    fetch(`http://localhost:3000/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(res => res.json())
    .then(updatedToy => {
      const p = card.querySelector("p");
      p.textContent = `${updatedToy.likes} Likes`;
    });
  }
});
