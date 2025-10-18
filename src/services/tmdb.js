const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function buildOptions (signal) {
  return {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    signal,
  }
}

export async function fetchJson (endpoint, signal) {
  const response = await fetch(endpoint, buildOptions(signal))
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`TMDB request failed: ${response.status} ${text}`)
  }
  return response.json()
}

export function getDiscoverMovies ({ sortBy, page = 1, signal }) {
  const endpoint = `${API_BASE_URL}/discover/movie?sort_by=${encodeURIComponent(
    sortBy
  )}&page=${page}`
  return fetchJson(endpoint, signal)
}

export function searchMovies ({ query, page = 1, signal }) {
  const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
    query
  )}&page=${page}`
  return fetchJson(endpoint, signal)
}

export function getMovieDetails (movieId, signal) {
  const endpoint = `${API_BASE_URL}/movie/${movieId}?append_to_response=credits,videos`
  return fetchJson(endpoint, signal)
}

export function getGenres (language = 'zh-CN', signal) {
  const endpoint = `${API_BASE_URL}/genre/movie/list?language=${language}`
  return fetchJson(endpoint, signal)
}

export const tmdb = {
  getDiscoverMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
}


