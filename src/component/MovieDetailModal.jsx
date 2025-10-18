// src/component/MovieDetailModal.jsx
import React from 'react'
import { Modal, Descriptions, Image, Tabs, Rate, Badge, Spin } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'

const MovieDetailModal = ({
  visible,
  movie,
  onClose,
  isLoading,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!movie) return null

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={window.innerWidth > 768 ? 800 : '90%'}
      destroyOnHidden
      styles={{
        header: { backgroundColor: '#171536', position: 'relative' },
        body: { backgroundColor: '#171536' },
        content: { backgroundColor: '#171536' },
      }}
      title={
        <div className="relative">
          <h2 className="pr-12">{movie.title}</h2>
          <button
            type="button"
            aria-label={isFavorite ? '移除收藏' : '加入收藏'}
            onClick={() => onToggleFavorite(movie)}
            className="p-1 rounded-md hover:bg-white/5 absolute top-1/2 -translate-y-1/2"
            style={{ right: 48 }}>
            {isFavorite ? (
              <HeartFilled style={{ color: '#ff4d4f', fontSize: '20px' }} />
            ) : (
              <HeartOutlined style={{ fontSize: '20px' }} />
            )}
          </button>
        </div>
      }>
      <Spin spinning={isLoading}>
        <div className="flex flex-col md:flex-row gap-6">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : '/no-movie.png'
            }
            alt={movie.title}
            width={200}
            className="rounded-lg self-center md:self-start"
            fallback="/no-movie.png"
            onError={() =>
              console.warn(`Failed to load poster for movie: ${movie.title}`)
            }
          />

          <div className="flex-1">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="评分">
                <Rate
                  disabled
                  defaultValue={movie.vote_average / 2}
                  count={5}
                />
                <span className="ml-2">{movie.vote_average.toFixed(1)}</span>
                <span className="ml-2 text-gray-500">
                  ({movie.vote_count} 评价)
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="上映日期">
                {movie.release_date || '未知'}
              </Descriptions.Item>

              <Descriptions.Item label="语言">
                <Badge
                  status="processing"
                  text={movie.original_language || '未知'}
                />
              </Descriptions.Item>

              <Descriptions.Item label="类型">
                {movie.genres
                  ? movie.genres.map((genre) => (
                      <Badge
                        key={genre.id}
                        color="purple"
                        className="mr-1"
                        text={genre.name}
                      />
                    ))
                  : '未知'}
              </Descriptions.Item>

              <Descriptions.Item label="时长">
                {movie.runtime ? `${movie.runtime} 分钟` : '未知'}
              </Descriptions.Item>

              <Descriptions.Item label="概述" className="pt-4">
                <p style={{ lineHeight: '1.6' }}>
                  {movie.overview || '暂无概述'}
                </p>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Tabs
          defaultActiveKey="details"
          className="mt-6"
          items={[
            {
              key: 'details',
              label: '详细信息',
              children: (
                <Descriptions column={2} className="mt-2">
                  <Descriptions.Item label="预算">
                    {movie.budget
                      ? `$${movie.budget.toLocaleString()}`
                      : '未知'}
                  </Descriptions.Item>
                  <Descriptions.Item label="票房">
                    {movie.revenue
                      ? `$${movie.revenue.toLocaleString()}`
                      : '未知'}
                  </Descriptions.Item>
                  <Descriptions.Item label=" original title">
                    {movie.original_title}
                  </Descriptions.Item>
                  <Descriptions.Item label="状态">
                    {movie.status}
                  </Descriptions.Item>
                </Descriptions>
              ),
            },
            {
              key: 'production',
              label: '制作信息',
              children:
                movie.production_companies &&
                movie.production_companies.length > 0 ? (
                  <div className="mt-2">
                    <h4>制作公司</h4>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {movie.production_companies.map((company) => (
                        <div key={company.id} className="text-center">
                          {company.logo_path ? (
                            <Image
                              src={`https://image.tmdb.org/t/p/w200/${company.logo_path}`}
                              alt={company.name}
                              width={100}
                              preview={false}
                              fallback="/no-movie.png"
                            />
                          ) : (
                            <div className="w-24 h-12 bg-[#1a1730] border border-[#2a2748] text-[#a8b5db] flex items-center justify-center rounded">
                              <span className="text-xs line-clamp-1 px-1">
                                {company.name}
                              </span>
                            </div>
                          )}
                          <p className="text-sm mt-1">{company.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>暂无制作信息</p>
                ),
            },
          ]}
        />
      </Spin>
    </Modal>
  )
}

export default MovieDetailModal
