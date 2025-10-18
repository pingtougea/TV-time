import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  lazy,
  Suspense,
} from 'react'
import { Select, Pagination } from 'antd'
import SearchBar from './component/SearchBar.jsx'
import Spinner from './component/Spinner'
import MovieCard from './component/MovieCard'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'
import {
  tmdb,
  getMovieDetails as tmdbGetMovieDetails,
} from './services/tmdb.js'
import { useDebounce } from 'react-use'
const MovieDetailModal = lazy(() => import('./component/MovieDetailModal'))
const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [movieList, setMovieList] = useState([])
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [trendingMovies, setTrendingMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [favorites, setFavorites] = useState([])
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [currentUser] = useState('default_user')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [genreNameById, setGenreNameById] = useState({})
  const [favoritesPage, setFavoritesPage] = useState(1)
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  // 计算当前用户在本地存储中的收藏键名
  const favoritesStorageKey = useMemo(
    () => `tvtime_favorites_${currentUser}`,
    [currentUser]
  )

  // 初始加载收藏
  useEffect(() => {
    try {
      const raw = localStorage.getItem(favoritesStorageKey)
      if (raw) {
        setFavorites(JSON.parse(raw))
      }
    } catch (e) {
      console.warn('Failed to load favorites from localStorage', e)
    }
  }, [favoritesStorageKey])

  // 同步收藏到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites))
    } catch (e) {
      console.warn('Failed to persist favorites to localStorage', e)
    }
  }, [favorites, favoritesStorageKey])

  // 切换收藏
  const handleToggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id)
      if (exists) {
        return prev.filter((m) => m.id !== movie.id)
      }
      // 仅存储必要字段
      const minimal = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average ?? 0,
        release_date: movie.release_date ?? '',
        original_language: movie.original_language ?? '',
        genre_ids: movie.genre_ids || [],
      }
      return [minimal, ...prev]
    })
  }

  const isFavorite = (movieId) => favorites.some((m) => m.id === movieId)

  const handleMovieDetail = async (movie) => {
    setSelectedMovie(movie)
    setIsDetailVisible(true)
    setIsDetailLoading(true)
    try {
      // 获取更详细信息（可取消）
      const controller = new AbortController()
      const details = await tmdbGetMovieDetails(movie.id, controller.signal)
      setSelectedMovie(details)
    } catch (error) {
      console.error(`Error fetching movie details. ${error}`)
    } finally {
      setIsDetailLoading(false)
    }
  }

  // 仅保留排序；类型筛选已移除
  const handleSortChange = (value) => {
    setSortBy(value)
    setSearchTerm('')
    setPage(1)
  }

  const fetchMovies = useCallback(
    async (query = '', requestedPage = 1) => {
      // 分页：任何页码都显示主 loading
      setIsLoading(true)
      setErrorMessage('')
      try {
        const controller = new AbortController()
        const data = query
          ? await tmdb.searchMovies({
              query,
              page: requestedPage,
              signal: controller.signal,
            })
          : await tmdb.getDiscoverMovies({
              sortBy,
              page: requestedPage,
              signal: controller.signal,
            })

        const results = Array.isArray(data.results) ? data.results : []
        // 分页：每次翻页直接替换当前列表
        setMovieList(results)
        // 更新分页信息，限制最大页数为 500
        if (typeof data.page === 'number') setPage(data.page)
        if (typeof data.total_pages === 'number')
          setTotalPages(Math.min(data.total_pages, 500))
        if (query && results.length > 0) {
          await updateSearchCount(query, data.results[0])
        }
      } catch (error) {
        console.error(`Error in fetchMovies. ${error}`)
        setErrorMessage('Error fetching movies. Please try again later!')
      } finally {
        setIsLoading(false)
      }
    },
    [sortBy]
  )
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`)
    }
  }
  useEffect(() => {
    // 搜索变更时重置到第一页
    setPage(1)
    fetchMovies(debouncedSearchTerm, 1)
  }, [debouncedSearchTerm, fetchMovies])

  // 当排序变化时重新加载
  useEffect(() => {
    setPage(1)
    fetchMovies(debouncedSearchTerm, 1)
  }, [sortBy, debouncedSearchTerm, fetchMovies])

  // 加载 TMDB 类型映射，用于显示真实类型名称
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await tmdb.getGenres('zh-CN')
        if (data && Array.isArray(data.genres)) {
          const map = {}
          data.genres.forEach((g) => {
            map[g.id] = g.name
          })
          setGenreNameById(map)
        }
      } catch (e) {
        console.warn('Failed to load TMDB genres', e)
      }
    }
    loadGenres()
  }, [])
  useEffect(() => {
    loadTrendingMovies()
  }, [])
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="/hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You&apos;ll
              Enjoy Without the Hassle
            </h1>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2 className="mt-[20px]">Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.searchTerm} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2>ALL Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <>
                {/* 排序下拉（热门/评分/最新） */}
                <div className="mb-6 flex justify-end">
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ width: 200 }}
                    aria-label="排序方式"
                    variant="borderless"
                    popupMatchSelectWidth
                    classNames={{
                      popup: { root: '!bg-[#0f0d23] !text-[#cecefb]' },
                    }}
                    className="!bg-[#0f0d23] !text-[#cecefb] !border !border-[#2a2748] !rounded-md">
                    <Select.Option value="popularity.desc">
                      热门优先
                    </Select.Option>
                    <Select.Option value="vote_average.desc">
                      评分优先
                    </Select.Option>
                    <Select.Option value="release_date.desc">
                      最新上映
                    </Select.Option>
                  </Select>
                </div>
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onDetailClick={() => handleMovieDetail(movie)}
                      isFavorite={isFavorite(movie.id)}
                      onToggleFavorite={handleToggleFavorite}
                      genreNameById={genreNameById}
                    />
                  ))}
                </ul>
                {/* 我的收藏（分页） */}
                {favorites.length > 0 && (
                  <section className="mt-10">
                    <h2 className="mb-3">我的收藏</h2>
                    <ul>
                      {favorites
                        .slice((favoritesPage - 1) * 8, favoritesPage * 8)
                        .map((movie) => (
                          <MovieCard
                            key={`fav-${movie.id}`}
                            movie={movie}
                            onDetailClick={() => handleMovieDetail(movie)}
                            isFavorite={isFavorite(movie.id)}
                            onToggleFavorite={handleToggleFavorite}
                            genreNameById={genreNameById}
                          />
                        ))}
                    </ul>
                    {favorites.length > 8 && (
                      <div className="mt-4 flex justify-center gap-2">
                        <button
                          className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50"
                          disabled={favoritesPage === 1}
                          onClick={() =>
                            setFavoritesPage((p) => Math.max(1, p - 1))
                          }>
                          上一页
                        </button>
                        <span className="text-gray-300 text-sm py-1">
                          {favoritesPage} / {Math.ceil(favorites.length / 8)}
                        </span>
                        <button
                          className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50"
                          disabled={
                            favoritesPage >= Math.ceil(favorites.length / 8)
                          }
                          onClick={() =>
                            setFavoritesPage((p) =>
                              Math.min(Math.ceil(favorites.length / 8), p + 1)
                            )
                          }>
                          下一页
                        </button>
                      </div>
                    )}
                  </section>
                )}
                {/* 分页控件 */}
                {movieList.length > 0 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      current={page}
                      pageSize={20}
                      total={Math.min(totalPages * 20, 10000)}
                      showSizeChanger={false}
                      onChange={(p) => {
                        // 确保页码在有效范围内
                        const validPage = Math.min(Math.max(p, 1), 500)
                        setPage(validPage)
                        fetchMovies(debouncedSearchTerm, validPage)
                        try {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        } catch {
                          /* no-op */
                        }
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </section>

          <Suspense fallback={<Spinner />}>
            <MovieDetailModal
              visible={isDetailVisible}
              movie={selectedMovie}
              onClose={() => setIsDetailVisible(false)}
              isLoading={isDetailLoading}
              isFavorite={selectedMovie ? isFavorite(selectedMovie.id) : false}
              onToggleFavorite={handleToggleFavorite}
            />
          </Suspense>
          {/* 电影Card */}
          {/* 主要内容 */}
        </div>
      </div>
    </main>
  )
}
export default App
