// src/component/MovieCard.jsx
import PropTypes from 'prop-types'
import { memo } from 'react'
import { Card, Rate, Tag, Skeleton } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'

const MovieCardComponent = ({
  movie,
  onDetailClick,
  isFavorite,
  onToggleFavorite,
  genreNameById,
}) => {
  const {
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
    genre_ids,
  } = movie

  // 若提供了 TMDB 类型映射则优先使用
  const resolveGenreName = (id) => {
    if (genreNameById && genreNameById[id]) return genreNameById[id]
    // 兜底：少量常见类型的本地映射
    const fallback = {
      28: '动作',
      35: '喜剧',
      18: '剧情',
      14: '奇幻',
      27: '恐怖',
      878: '科幻',
    }
    return fallback[id] || '未知'
  }

  return (
    <Card
      hoverable
      className="movie-card overflow-hidden"
      cover={
        <div className="relative group cursor-pointer" onClick={onDetailClick}>
          <Skeleton active loading={!poster_path} className="w-full">
            <img
              src={
                poster_path
                  ? `https://image.tmdb.org/t/p/w500/${poster_path}`
                  : '/no-movie.png'
              }
              alt={title}
              className="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = '/no-movie.png'
                e.target.alt = '海报不可用'
              }}
            />
          </Skeleton>
          {/* 收藏按钮 */}
          <button
            type="button"
            className="absolute top-2 right-2 p-1.5 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(movie)
            }}
            aria-label={isFavorite ? '移除收藏' : '加入收藏'}>
            {isFavorite ? (
              <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
            ) : (
              <HeartOutlined style={{ color: '#cecefb', fontSize: 16 }} />
            )}
          </button>
          {/* 底部信息渐变条 */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
            <h3 className="text-white font-bold text-base line-clamp-1">
              {title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-white/90">
              <Rate
                disabled
                defaultValue={vote_average / 2}
                count={5}
                style={{ fontSize: 14 }}
              />
              <span className="text-sm">
                {vote_average ? vote_average.toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      }>
      {/* 标签与基础信息 */}
      <div className="mt-2 flex flex-wrap gap-1">
        {genre_ids.slice(0, 3).map((genreId) => (
          <Tag key={genreId} color="purple">
            {resolveGenreName(genreId)}
          </Tag>
        ))}
        {original_language && (
          <Tag color="blue" className="capitalize">
            {original_language}
          </Tag>
        )}
        {release_date && (
          <Tag color="default">{release_date.split('-')[0]}</Tag>
        )}
      </div>
    </Card>
  )
}

const MovieCard = memo(MovieCardComponent)

export default MovieCard

MovieCardComponent.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    vote_average: PropTypes.number,
    poster_path: PropTypes.string,
    release_date: PropTypes.string,
    original_language: PropTypes.string,
    genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  onDetailClick: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func.isRequired,
  genreNameById: PropTypes.object,
}
