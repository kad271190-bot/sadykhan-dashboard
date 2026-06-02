'use client'
import { Image, Video, BookOpen, Clock, CheckCircle2, XCircle, Trash2, Send, Loader2, ExternalLink } from 'lucide-react'
import { InstagramPost } from '@/types'
import { cn } from '@/lib/utils'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

const TYPE_ICON = { post: Image, reel: Video, story: BookOpen }
const TYPE_LABEL = { post: 'Пост', reel: 'Рилс', story: 'Сторис' }

const STATUS_BADGE: Record<InstagramPost['status'], { label: string; cls: string }> = {
  draft:     { label: 'Черновик',   cls: 'bg-gray-100 text-gray-600' },
  scheduled: { label: 'Запланирован', cls: 'bg-blue-50 text-blue-600' },
  published: { label: 'Опубликован', cls: 'bg-green-50 text-green-600' },
  failed:    { label: 'Ошибка',     cls: 'bg-red-50 text-red-500' },
}

interface Props {
  posts: InstagramPost[]
  publishing: string | null
  onPublish: (post: InstagramPost) => void
  onDelete: (id: string) => void
}

export default function ContentQueue({ posts, publishing, onPublish, onDelete }: Props) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 text-sm">
        Очередь пуста. Создайте первую публикацию.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map(post => {
        const Icon = TYPE_ICON[post.type]
        const badge = STATUS_BADGE[post.status]
        const isPublishing = publishing === post.id
        return (
          <div key={post.id} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-start gap-3">
              {/* Media preview */}
              <div className="shrink-0 w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <Icon className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Icon className="w-3 h-3" /> {TYPE_LABEL[post.type]}
                  </span>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', badge.cls)}>
                    {badge.label}
                  </span>
                  {post.aiGenerated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                      AI
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-800 line-clamp-2 mb-1">{post.caption}</p>

                {post.hashtags.length > 0 && (
                  <p className="text-xs text-[#3A9EA5] truncate">
                    {post.hashtags.map(h => `#${h}`).join(' ')}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                  {post.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(post.scheduledAt), 'd MMM, HH:mm', { locale: ru })}
                    </span>
                  )}
                  {post.publishedAt && (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-3 h-3" />
                      {format(parseISO(post.publishedAt), 'd MMM, HH:mm', { locale: ru })}
                    </span>
                  )}
                  {post.instagramMediaId && (
                    <span className="flex items-center gap-1 text-gray-400">
                      <ExternalLink className="w-3 h-3" />
                      {post.instagramMediaId}
                    </span>
                  )}
                </div>

                {post.error && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {post.error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-col gap-1.5">
                {(post.status === 'draft' || post.status === 'failed') && (
                  <button
                    onClick={() => onPublish(post)}
                    disabled={isPublishing}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-white font-medium disabled:opacity-50 transition-opacity"
                    style={{ background: '#F5813F' }}
                  >
                    {isPublishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    {isPublishing ? '...' : 'Опубл.'}
                  </button>
                )}
                <button
                  onClick={() => onDelete(post.id)}
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
