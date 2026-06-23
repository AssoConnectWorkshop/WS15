"use client";

import { useState } from "react";

type Category = "all" | "cute" | "majestic" | "funny" | "mythical" | "food";

const catNames: Record<Exclude<Category, "all">, string[]> = {
  cute: [
    "Mimi", "Loulou", "Câlin", "Noisette", "Praline", "Bouton", "Choupette",
    "Frimousse", "Pépette", "Cocotte", "Fifille", "Bibiche", "Doudou", "Sucre",
    "Caramel", "Cannelle", "Vanille", "Perle", "Bijou", "Poupette",
  ],
  majestic: [
    "Léon", "César", "Maximus", "Apollon", "Hercule", "Napoléon", "Voltaire",
    "Alexandre", "Cléopâtre", "Athéna", "Hera", "Victoria", "Élisabeth",
    "Ramsès", "Toutankhamon", "Nefertiti", "Sélène", "Soleil", "Impérator",
    "Maharadjah",
  ],
  funny: [
    "Patate", "Rondoudou", "Gros Minet", "Poufpouf", "Barbouille", "Binouze",
    "Cracotte", "Moustache", "Patapouf", "Bouboule", "Microbe", "Croquignolet",
    "Zigzag", "Turbulence", "Catastrophe", "Polochon", "Grabouille", "Zigoto",
    "Fripouille", "Salopard",
  ],
  mythical: [
    "Merlin", "Gandalf", "Morgane", "Ysgramor", "Fenrir", "Loki", "Freya",
    "Artemis", "Hermès", "Bastet", "Anubis", "Sekhmet", "Osiris", "Isis",
    "Thot", "Poseidon", "Hadès", "Calypso", "Orphée", "Circé",
  ],
  food: [
    "Sushi", "Tofu", "Wasabi", "Mochi", "Ramen", "Beignet", "Croissant",
    "Macaron", "Éclair", "Millefeuille", "Brioche", "Madeleine", "Chouquette",
    "Chantilly", "Tiramisu", "Panna Cotta", "Brownie", "Cookie", "Muffin",
    "Pancake",
  ],
};

const categoryLabels: Record<Exclude<Category, "all">, string> = {
  cute: "Mignons 🥰",
  majestic: "Majestueux 👑",
  funny: "Rigolos 😂",
  mythical: "Mythiques ✨",
  food: "Gourmands 🍰",
};

const categoryEmojis: Record<Exclude<Category, "all">, string> = {
  cute: "🥰",
  majestic: "👑",
  funny: "😂",
  mythical: "✨",
  food: "🍰",
};

function getAllNames() {
  return Object.values(catNames).flat();
}

function getNames(category: Category) {
  return category === "all" ? getAllNames() : catNames[category];
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function CatNamePage() {
  const [category, setCategory] = useState<Category>("all");
  const [picked, setPicked] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bouncing, setBouncing] = useState(false);

  function generate() {
    const names = getNames(category);
    const name = pickRandom(names);
    setPicked(name);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 600);
  }

  function toggleFavorite(name: string) {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  const allNames = getNames(category);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🐱</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Trouveur de Noms de Chat
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Trouvez le prénom parfait pour votre félin
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 text-center">
            Choisir une catégorie
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === "all"
                  ? "bg-orange-500 text-white shadow-md scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              Tous 🐾
            </button>
            {(Object.keys(categoryLabels) as Exclude<Category, "all">[]).map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat
                      ? "bg-orange-500 text-white shadow-md scale-105"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              )
            )}
          </div>
        </div>

        {/* Generator */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 text-center">
          {picked ? (
            <div className={`mb-6 ${bouncing ? "animate-bounce" : ""}`}>
              <div className="text-5xl font-bold text-orange-500 mb-2">
                {picked}
              </div>
              <div className="text-gray-400 text-sm">
                {category === "all"
                  ? "Toutes catégories"
                  : categoryLabels[category]}
              </div>
            </div>
          ) : (
            <div className="mb-6 text-gray-300 dark:text-gray-600 text-5xl font-bold">
              ?
            </div>
          )}

          <button
            onClick={generate}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transition-all text-lg"
          >
            {picked ? "Un autre !" : "Générer un nom 🎲"}
          </button>

          {picked && (
            <button
              onClick={() => toggleFavorite(picked)}
              className={`ml-3 px-6 py-3 rounded-2xl font-semibold transition-all text-lg ${
                favorites.includes(picked)
                  ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/20"
              }`}
            >
              {favorites.includes(picked) ? "❤️ Favori" : "🤍 Ajouter"}
            </button>
          )}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              ❤️ Mes favoris{" "}
              <span className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 text-xs px-2 py-0.5 rounded-full">
                {favorites.length}
              </span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {favorites.map((name) => (
                <span
                  key={name}
                  className="flex items-center gap-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-full text-sm font-medium"
                >
                  {name}
                  <button
                    onClick={() => toggleFavorite(name)}
                    className="text-pink-400 hover:text-pink-600 dark:hover:text-pink-200 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* All names grid */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Tous les noms ({allNames.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {allNames.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setPicked(name);
                  toggleFavorite(name);
                }}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  favorites.includes(name)
                    ? "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-medium"
                    : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-600"
                }`}
              >
                {favorites.includes(name) ? "❤️ " : ""}
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
