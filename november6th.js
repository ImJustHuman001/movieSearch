async function getMovie() {
  const query = document.getElementById('movieInput').value.trim();
  const apiKey = "8c3fd933bb3073dd2252491989cb484221bc24843da7ca863d3b64cf3c174c2b";
  const url = `https://api.trakt.tv/search/movie?query=${query}`;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": apiKey
      }
    });

    const data = await response.json();

    if (data.length === 0) {
      resultDiv.innerHTML = "No movie found 😢";
      return;
    }

    const movie = data[0].movie;

    // Get detailed info for rating and overview
    const detailsUrl = `https://api.trakt.tv/movies/${movie.ids.slug}?extended=full`;
    const detailsResponse = await fetch(detailsUrl, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": apiKey
      }
    });

    const details = await detailsResponse.json();

    // Build poster image from TMDB ID if available
    let posterUrl = "";
    if (movie.ids.tmdb) {
      posterUrl = `https://image.tmdb.org/t/p/w500/${movie.ids.tmdb}.jpg`;
    }

    // Display movie info
    resultDiv.innerHTML = `
      <h3>${movie.title} (${movie.year})</h3>
      ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title} Poster" class="poster">` : ""}
      <p><strong>Rating:</strong> ${details.rating ? details.rating.toFixed(1) : "N/A"}</p>
      <p><strong>Overview:</strong> ${details.overview || "No overview available."}</p>
    `;

  } catch (error) {
    resultDiv.innerHTML = "Error fetching data.";
    console.error("Error:", error);
  }
}
