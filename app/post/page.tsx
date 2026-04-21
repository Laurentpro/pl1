'use client'
import { useTranslation } from '@/i18n/useTranslation'
import PostForm from '@/components/post/PostForm'

export default function PostPage() {
  const { t } = useTranslation()
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('post.title')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('post.subtitle')}</p>
      </div>
      <PostForm />
    </div>
  )
}
