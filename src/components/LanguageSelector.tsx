import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { t, i18n } = useTranslation()

  return (
    <label className={cn('flex items-center gap-2 rounded-xl border border-[#5B4BDB]/10 bg-white/90 px-3 py-2 text-sm text-[#5146C7] shadow-sm backdrop-blur-md', className)}>
      <Languages className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t('languageSelector.label')}</span>
      <select
        aria-label={t('languageSelector.label')}
        className="cursor-pointer bg-transparent font-medium outline-none"
        value={i18n.resolvedLanguage ?? i18n.language}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
      >
        <option value="en">{t('languages.en')}</option>
        <option value="id">{t('languages.id')}</option>
        <option value="ko">{t('languages.ko')}</option>
        <option value="zh-CN">{t('languages.zh-CN')}</option>
      </select>
    </label>
  )
}
