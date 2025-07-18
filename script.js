const spoonacularApiKey = "5acd185f60ab48daa6aa6f009f6676db";
const youtubeApiKey = "AIzaSyA0Vk_MzMjzejPfx7lglMyO7uZ56vfJUU0";

// Loader toggle
function toggleLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

// Dark mode toggle
function toggleDarkMode() {
  document.getElementById("pageBody").classList.toggle("bg-gray-900");
  document.getElementById("pageBody").classList.toggle("text-white");
  document.getElementById("pageBody").classList.toggle("text-gray-800");
  document.getElementById("pageBody").classList.toggle("bg-gray-100");
}

// Show default message in Recipes section
function showEmptyRecipesMessage() {
  document.getElementById('recipesContainer').innerHTML = `
    <div class="text-gray-500 text-center col-span-full mt-10">
      🔍 Start by searching for a recipe above.
    </div>
  `;
}

// Search Recipes
async function searchRecipes() {
  const query = document.getElementById("searchInput").value.trim();
  const cuisine = document.getElementById("cuisineSelect").value;
  const recipesContainer = document.getElementById("recipesContainer");
  const youtubeContainer = document.getElementById("youtubeContainer");

  recipesContainer.innerHTML = "";
  youtubeContainer.innerHTML = "";

  if (!query) return alert("Please enter a search term!");

  toggleLoader(true);

  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&cuisine=${encodeURIComponent(cuisine)}&number=12&apiKey=${spoonacularApiKey}`
    );
    const data = await res.json();

    if (data.results?.length > 0) {
      data.results.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition";

        card.innerHTML = `
          <img src="${recipe.image}" alt="${recipe.title}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-bold mb-2 text-gray-800 dark:text-white">${recipe.title}</h3>
            <div class="flex items-center gap-1 mb-2">
              <span class="text-yellow-400">⭐️⭐️⭐️⭐️☆</span>
              <span class="text-sm text-gray-500">(4.0)</span>
            </div>
            <a href="https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/ /g, "-")}-${recipe.id}" target="_blank" class="text-green-600 hover:underline">View Recipe</a>
            <button onclick="saveFavorite('${recipe.title}', '${recipe.image}', 'https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/ /g, "-")}-${recipe.id}')" class="mt-2 px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500">⭐ Save Favorite</button>
            <button onclick="showRecipeIngredients(${recipe.id})" class="mt-2 ml-2 px-3 py-1 bg-blue-400 text-white rounded hover:bg-blue-500">🍴 View Ingredients</button>
          </div>
        `;
        recipesContainer.appendChild(card);
      });
    } else {
      recipesContainer.innerHTML = '<p class="text-red-500">No recipes found on Spoonacular. Showing YouTube recipes instead:</p>';
    }

    await fetchYouTubeVideos(query);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipesContainer.innerHTML = '<p class="text-red-500">Error fetching recipes.</p>';
    await fetchYouTubeVideos(query);
  } finally {
    toggleLoader(false);
  }
}
async function showRecipeIngredients(recipeId) {
  toggleLoader(true);
  try {
    const content = await fetchRecipeIngredients(recipeId);
    document.getElementById("ingredientContent").innerHTML = content;
    document.getElementById("ingredientModal").classList.remove("hidden");
  } catch (error) {
    alert("Failed to load ingredients. Please try again.");
    console.error(error);
  } finally {
    toggleLoader(false);
  }
}

function closeModal() {
  document.getElementById("ingredientModal").classList.add("hidden");
}
// YouTube API
async function fetchYouTubeVideos(query) {
  const youtubeContainer = document.getElementById("youtubeContainer");
  youtubeContainer.innerHTML = "";

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " recipe")}&type=video&maxResults=8&key=${youtubeApiKey}`
    );
    const data = await res.json();

    if (!data.items?.length) {
      youtubeContainer.innerHTML = '<p class="text-red-500">No YouTube videos found.</p>';
      return;
    }

    data.items.forEach((video) => {
      const card = document.createElement("div");
      card.className = "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow";

      card.innerHTML = `
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
          <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" class="w-full h-48 object-cover">
        </a>
        <div class="p-3">
          <h3 class="text-sm font-bold">${video.snippet.title}</h3>
        </div>
      `;
      youtubeContainer.appendChild(card);
    });
  } catch (error) {
    console.error("YouTube error:", error);
    youtubeContainer.innerHTML = '<p class="text-red-500">Error loading YouTube videos.</p>';
  }
}

// Favorites Save & Load
async function saveFavorite(title, image, link) {
  const user = auth.currentUser;

  if (!user) {
    alert("Please log in to save favorites.");
    openLoginModal();
    return;
  }

  try {
    const userFavorites = db.collection("favorites").doc(user.uid);

    await userFavorites.set({
      items: firebase.firestore.FieldValue.arrayUnion({ title, image, link })
    }, { merge: true });

    alert("Saved to favorites!");
    loadFavorites();  // Optional: reload from Firestore
  } catch (error) {
    console.error("Error saving favorite:", error);
    alert("Error saving favorite. Please try again.");
  }
}
async function loadFavorites() {
  const user = auth.currentUser;
  const favoritesContainer = document.getElementById("favoritesContainer");
  favoritesContainer.innerHTML = "";

  if (!user) {
    favoritesContainer.innerHTML = `
      <p class="text-gray-400 text-center col-span-full mt-4">
        Please log in to view your favorites and add new ones.
      </p>
    `;
    return;
  }

  try {
    const doc = await db.collection("favorites").doc(user.uid).get();
    const data = doc.data();

    if (!data || !data.items || data.items.length === 0) {
      favoritesContainer.innerHTML = `
        <p class="text-gray-400 text-center col-span-full mt-4">
          No favorites saved yet. Start adding your favorite recipes!
        </p>
      `;
      return;
    }

    data.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition";
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2">${item.title}</h3>
          <a href="${item.link}" target="_blank" class="text-green-600 hover:underline">View Recipe</a>
        </div>
      `;
      favoritesContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading favorites:", error);
    favoritesContainer.innerHTML = '<p class="text-red-500">Error loading favorites.</p>';
  }
}
auth.onAuthStateChanged((user) => {
  const signupBtn = document.getElementById("signupBtn");
  const favoritesSection = document.getElementById("favoritesSection");

  if (user) {
    signupBtn.classList.add("hidden"); // ✅ Hide sign up
    document.getElementById("loginBtn").innerText = "👤 " + user.email;
    document.getElementById("loginBtn").onclick = logoutUser;

    favoritesSection.classList.remove("hidden");
    loadFavorites();
  } else {
    signupBtn.classList.remove("hidden"); // ✅ Show sign up
    document.getElementById("loginBtn").innerText = "🔑 Login";
    document.getElementById("loginBtn").onclick = openLoginModal;

    favoritesSection.classList.add("hidden");
  }
});
// ✅ Remove favorite from Firestore
async function removeFavorite(title) {
  const user = auth.currentUser;

  if (!user) return;

  try {
    const userFavorites = db.collection("favorites").doc(user.uid);
    const doc = await userFavorites.get();
    const data = doc.data();

    if (!data || !data.items) return;

    const updatedItems = data.items.filter(item => item.title !== title);

    await userFavorites.set({ items: updatedItems }, { merge: true });

    alert("Favorite removed successfully.");
    loadFavorites();
  } catch (error) {
    console.error("Error removing favorite:", error);
    alert("Error removing favorite. Please try again.");
  }
}
// Recipe Ingredients
async function fetchRecipeIngredients(recipeId) {
  try {
    const res = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${spoonacularApiKey}`);
    const data = await res.json();
    if (!data.extendedIngredients) return "No ingredients found.";
    return data.extendedIngredients.map(ing => `• ${ing.original}`).join("<br>");
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return "Error loading ingredients.";
  }
}
function openSignupModal() {
  closeLoginModal(); // Always close login first
  document.getElementById("signupModal").classList.remove("hidden");
}

function closeSignupModal() {
  document.getElementById("signupModal").classList.add("hidden");
}

function submitSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  signupUser(email, password);
}

function signupUser(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Welcome, " + userCredential.user.email);
      closeSignupModal();
      document.getElementById("loginBtn").innerText = "👤 " + userCredential.user.email;
      document.getElementById("loginBtn").onclick = logoutUser;
    })
    .catch((error) => {
      alert(error.message);
    });
}
function submitSignup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  signupUser(email, password);
}
// ✅ Firebase Login
function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Welcome, " + userCredential.user.email);
      closeLoginModal();
      document.getElementById("loginBtn").innerText = "👤 " + userCredential.user.email;
      document.getElementById("loginBtn").onclick = logoutUser;  // Change button to logout
    })
    .catch((error) => {
      alert(error.message);
    });
}

// ✅ Firebase Logout
function logoutUser() {
  auth.signOut()
    .then(() => {
      alert("Logged out successfully.");
      document.getElementById("loginBtn").innerText = "🔑 Login";
      document.getElementById("loginBtn").onclick = openLoginModal;
    })
    .catch((error) => {
      alert(error.message);
    });
}

// ✅ Login form submit
function submitLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  loginUser(email, password);
}

// ✅ Open/close Login modal
function openLoginModal() {
  closeSignupModal();  // ✅ Close signup if open
  document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}

// ✅ Open/close Signup modal
function openSignupModal() {
  closeLoginModal();   // ✅ Close login if open
  document.getElementById("signupModal").classList.remove("hidden");
}

function closeSignupModal() {
  document.getElementById("signupModal").classList.add("hidden");
}

// ✅ Smooth scroll to section
function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ✅ Close Login modal when clicking outside
window.addEventListener('click', (e) => {
  const loginModal = document.getElementById('loginModal');
  if (!loginModal.classList.contains('hidden') && e.target === loginModal) {
    closeLoginModal();
  }

  const signupModal = document.getElementById('signupModal'); // ✅ Also close signup modal on outside click
  if (!signupModal.classList.contains('hidden') && e.target === signupModal) {
    closeSignupModal();
  }
});

// ✅ On page load
window.onload = function() {
  loadFavorites();
  showEmptyRecipesMessage();
};