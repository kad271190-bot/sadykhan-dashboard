'use client'
import { useState, useCallback } from 'react'
import { PenLine, ListOrdered, Zap, History, Instagram, CheckCircle2, XCircle } from 'lucide-react'
import ContentCreator from './ContentCreator'
import ContentQueue from './ContentQueue'
import AutoStorySettings from './AutoStorySettings'
import { InstagramPost } from '@/types'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

type Tab = 'create' | 'queue' | 'auto' | 'history'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'create',  label: 'Создать',    icon: PenLine },
  { id: 'queue',   label: 'Очередь',    icon: ListOrdered },
  { id: 'auto',    label: 'Авто-сторис', icon: Zap },
  { id: 'history', label: 'История',    icon: History },
]

function generateId() {
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function InstagramPublisher() {
  const [tab, setTab]           = useState<Tab>('create')
  const [posts, setPosts]       = useState<InstagramPost[]>([])
  const [publishing, setPublishing] = useState<string | null>(null)
  const [toast, setToast]       = useState<{ ok: boolean; msg: string } | null>(null)

  function showToast(ok: boolean, msg: string) {
    setToast({ ok, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const handleAdd = useCallback((draft: Omit<InstagramPost, 'id' | 'createdAt'>) => {
    const post: InstagramPost = {
      ...draft,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => [post, ...prev])
    setTab('queue')
    showToast(true, `${draft.type === 'story' ? 'Сторис' : draft.type === 'reel' ? 'Рилс' : 'Пост'} добавлен в очередь`)
  }, [])

  const handlePublish = useCallback(async (post: InstagramPost) => {
    setPublishing(post.id)
    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data = await res.json() as { mediaId?: string; error?: string }

      if (data.error) {
        setPosts(prev => prev.map(p =>
          p.id === post.id ? { ...p, status: 'failed', error: data.error } : p
        ))
        showToast(false, data.error ?? 'Ошибка публикации')
      } else {
        setPosts(prev => prev.map(p =>
          p.id === post.id
            ? { ...p, status: 'published', publishedAt: new Date().toISOString(), instagramMediaId: data.mediaId, error: undefined }
            : p
        ))
        showToast(true, 'Успешно опубликовано в Instagram!')
      }
    } catch {
      setPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, status: 'failed', error: 'Ошибка сети' } : p
      ))
      showToast(false, 'Ошибка сети')
    } finally {
      setPublishing(null)
    }
  }, [])

  const handleDelete = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id))
  }, [])

  const queue    = posts.filter(p => p.status !== 'published')
  const history  = posts.filter(p => p.status === 'published')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
        >
          <Instagram className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Instagram Publisher</h1>
          <p className="text-xs text-gray-400">AI-агент для публикации контента</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-full">{queue.length} в очереди</span>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full">{history.length} опубликовано</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
        {TABS.map(t => {
          const Icon = t.icon
          const isActive = tab === t.id
          const badge = t.id === 'queue' ? queue.length : t.id === 'history' ? history.length : 0
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all',
                isActive ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              {badge > 0 && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold"
                  style={{ background: isActive ? '#F5813F' : '#9ca3af' }}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {tab === 'create'  && <ContentCreator onAdd={handleAdd} />}
      {tab === 'queue'   && (
        <ContentQueue
          posts={queue}
          publishing={publishing}
          onPublish={handlePublish}
          onDelete={handleDelete}
        />
      )}
      {tab === 'auto'    && <AutoStorySettings />}
      {tab === 'history' && <PublishHistory posts={history} onDelete={handleDelete} />}

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white z-50 transition-all',
          toast.ok ? 'bg-[#3A9EA5]' : 'bg-red-500'
        )}>
          {toast.ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── Inline history component ──────────────────────────────────────
function PublishHistory({ posts, onDelete }: { posts: InstagramPost[]; onDelete: (id: string) => void }) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
        Нет опубликованных материалов.
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
          <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
            {post.mediaUrl ? (
              <img src={post.mediaUrl} alt="" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 line-clamp-2">{post.caption}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle2 className="w-3 h-3" />
                {post.publishedAt ? format(parseISO(post.publishedAt), 'd MMM yyyy, HH:mm', { locale: ru }) : ''}
              </span>
              {post.instagramMediaId && <span className="font-mono">{post.instagramMediaId}</span>}
              {post.aiGenerated && <span className="text-purple-500">AI</span>}
            </div>
          </div>
          <button
            onClick={() => onDelete(post.id)}
            className="shrink-0 text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded border border-transparent hover:border-red-100 transition-colors"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
