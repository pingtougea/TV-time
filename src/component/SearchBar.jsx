// src/component/SearchBar.jsx
import React, { useState, useEffect } from 'react'
import { AutoComplete, Input, Tag, Space } from 'antd'
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [history, setHistory] = useState([])

  // 从本地存储加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 保存搜索历史到本地存储
  const saveHistory = (term) => {
    if (!term.trim()) return

    // 去重并限制历史记录数量
    const newHistory = [term, ...history.filter((item) => item !== term)].slice(
      0,
      10
    )
    setHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // 处理搜索提交
  const handleSearch = (value) => {
    setSearchTerm(value)
    saveHistory(value)
  }

  // 清除单个历史记录
  const handleDelete = (term) => {
    const newHistory = history.filter((item) => item !== term)
    setHistory(newHistory)
    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
  }

  // 清除所有历史记录
  const clearAllHistory = () => {
    setHistory([])
    localStorage.removeItem('searchHistory')
  }

  return (
    <div className="search relative">
      <AutoComplete
        options={history.map((term) => ({ value: term }))}
        value={searchTerm}
        onChange={setSearchTerm}
        onSelect={handleSearch}
        className="w-full"
        classNames={{ popup: { root: '!bg-[#0f0d23] !text-[#cecefb]' } }}
        style={{ width: '100%' }}>
        <Input
          allowClear
          aria-label="搜索电影"
          prefix={<SearchOutlined style={{ color: '#a8b5db' }} />}
          onPressEnter={(e) => handleSearch(e.target.value)}
          placeholder="搜索电影..."
          className="bg-transparent py-3 pl-10 pr-10 text-base !text-[#cecefb] !rounded-lg"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        />
      </AutoComplete>

      {history.length > 0 && (
        <button
          type="button"
          onClick={clearAllHistory}
          className="absolute top-2 right-2 z-10 text-xs text-gray-400 hover:text-white">
          清除全部
        </button>
      )}

      {/* 显示搜索历史标签 */}
      {history.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center mb-2 w-full">
            <span className="text-sm text-gray-300">搜索历史</span>
          </div>
          <div className="flex flex-nowrap justify-start gap-2 overflow-x-auto hide-scrollbar w-full">
            {history.map((term) => (
              <Tag
                key={term}
                closable
                onClose={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleDelete(term)
                }}
                onClick={() => handleSearch(term)}
                className={`cursor-pointer chip shrink-0 ${
                  term === searchTerm ? 'is-active' : ''
                }`}
                color="#2a2748">
                {term}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar
