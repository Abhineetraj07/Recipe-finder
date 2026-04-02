<h1 align="center">🍽️ Recipe Finder</h1>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Spoonacular-Recipe_API-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/YouTube-Fallback_API-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />
  <img src="https://img.shields.io/badge/Netlify-Live_Demo-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />
</p>

<p align="center">
  Search millions of recipes, save your favourites, and fall back to YouTube tutorials when no recipe data is available — all with dark mode support and a clean responsive UI.
</p>

<p align="center">
  <a href="https://recipe-finder-abhineet.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-recipe--finder--abhineet.netlify.app-00C7B7?style=for-the-badge" />
  </a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Recipe Search** | Search by keyword with real-time Spoonacular API results |
| 📹 **YouTube Fallback** | Auto-fetches YouTube tutorials when no recipe data exists |
| 💾 **Favourites** | Save and manage favourite recipes via Firebase Firestore |
| 👤 **Auth** | Login / signup with Firebase Authentication |
| 🌓 **Dark Mode** | Toggle light/dark themes for better accessibility |
| 📱 **Responsive** | Seamless experience on desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Authentication** | Firebase Authentication |
| **Database** | Firebase Firestore (real-time favourites sync) |
| **Recipe Data** | Spoonacular API |
| **Video Fallback** | YouTube Data API v3 |
| **Hosting** | Netlify |

---

## 🚀 Quick Start

### 1. Clone

```bash
git clone https://github.com/Abhineetraj07/Recipe-finder.git
cd Recipe-finder
```

### 2. Configure Firebase

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password) and **Firestore Database**
3. Copy your `firebaseConfig` object into the project's JS config file

### 3. Add API Keys

Get your keys from:
- 🍴 [Spoonacular API](https://spoonacular.com/food-api) — recipe data
- 📺 [Google Cloud Console](https://console.cloud.google.com/) — YouTube Data API v3

Add them to your config file:

```javascript
const SPOONACULAR_API_KEY = "your_key_here";
const YOUTUBE_API_KEY = "your_key_here";
```

### 4. Run Locally

Open `index.html` directly in your browser, or serve with a local server:

```bash
# Using VS Code Live Server extension, or:
npx serve .
```

---

## 📱 Live Demo

🔗 **[recipe-finder-abhineet.netlify.app](https://recipe-finder-abhineet.netlify.app/)**

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request.

---

## 👨‍💻 Author

**Abhineet Raj** · CS @ SRM Institute of Science & Technology
🌐 [Portfolio](https://aabhineet07-portfolio.netlify.app/) · 🐙 [GitHub](https://github.com/Abhineetraj07)

---

## 📄 License

This project is licensed under the **MIT License**.
