export function initSearch() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  // Function to simulate fetching search results
  // Replace this with real API logic as needed
  async function fetchSearchResults(query) {
    // For demonstration, use dummy results:
    const dummyResults = [
      "Greek Vase",
      "Roman Coin",
      "Egyptian Painting",
      "Persian Rug",
      "Chinese Porcelain",
    ];
    return dummyResults.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Show dynamic results as the user types
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      searchResults.style.display = "none";
      searchResults.innerHTML = "";
      return;
    }

    const results = await fetchSearchResults(query);

    if (results.length > 0) {
      searchResults.innerHTML = `
        <div class="search-results-header">Results:</div>
        ${results.map((item) => `<div class="p-2">${item}</div>`).join("")}
      `;
      searchResults.style.display = "block";
    } else {
      searchResults.innerHTML = `
        <div class="p-2 text-muted">No results found</div>
      `;
      searchResults.style.display = "block";
    }
  });

  // Hide results when clicking outside the form
  document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) {
      searchResults.style.display = "none";
    }
  });

  // Handle search on Enter key press (form submission)
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      console.log(`Searching for: ${query}`);
      // Implement your final search logic here, such as:
      // window.location.href = `/search?query=${encodeURIComponent(query)}`;
    }
  });

  // Handle selecting a suggestion by clicking on it
  searchResults.addEventListener("click", (event) => {
    if (event.target.matches("div.p-2")) {
      const selectedText = event.target.textContent;
      searchInput.value = selectedText;
      searchResults.style.display = "none";
      console.log(`Selected: ${selectedText}`);
      // Implement logic if you want to search immediately after selection
    }
  });
}
