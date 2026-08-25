import { Check, ChevronDown, Languages } from 'lucide-react'
import { DropdownMenu } from 'radix-ui'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage ?? i18n.language
  const languages = ['en', 'id', 'ko', 'zh-CN'] as const

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'group inline-flex h-10 items-center gap-2 rounded-xl border border-[#5B4BDB]/10 bg-white/90 px-3 text-sm font-medium text-[#5146C7] shadow-sm backdrop-blur-md transition-colors hover:bg-[#F3F0FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BDB]/20 data-[state=open]:bg-[#F3F0FF]',
            className,
          )}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          <span>{t(`languages.${currentLanguage}`)}</span>
          <ChevronDown className="h-4 w-4 text-[#6D6880] transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden="true" />
          <span className="sr-only">{t('languageSelector.label')}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-44 overflow-hidden rounded-xl border border-[#5B4BDB]/10 bg-white/95 p-1 text-[#252238] shadow-xl shadow-[#5B4BDB]/15 outline-none backdrop-blur-md"
        >
          <DropdownMenu.Label className="px-2 py-1.5 text-xs font-medium text-[#6D6880]">
            {t('languageSelector.label')}
          </DropdownMenu.Label>
          {languages.map((language) => (
            <DropdownMenu.Item
              key={language}
              onSelect={() => void i18n.changeLanguage(language)}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-[#F3F0FF] data-[highlighted]:text-[#43358F]"
            >
              <span className="flex-1">{t(`languages.${language}`)}</span>
              {currentLanguage === language && <Check className="h-4 w-4 text-[#5B4BDB]" aria-hidden="true" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
