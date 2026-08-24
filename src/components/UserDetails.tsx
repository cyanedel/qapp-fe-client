import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, Briefcase, CalendarDays, Edit3, Home, IdCard, Mail, MapPin, Phone, User as UserIcon } from 'lucide-react'
import { getCurrentUser } from '@/api/auth'
import { ApiError } from '@/api/response'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

export const UserDetails: React.FC = () => {
  const { t, i18n } = useTranslation()
  const authUser = useAuthStore((state) => state.user)
  const appName = t('app.name')
  const { profile, setProfile } = useUserStore()
  const [loading, setLoading] = useState(!profile)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setLoading(true)
      setError(null)

      if (!authUser) {
        setError(t('errors.AUTHENTICATION_REQUIRED', { defaultValue: t('errors.generic') }))
        setLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()

        if (isMounted) {
          setProfile(currentUser)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof ApiError
            ? t(`errors.${err.code}`, { defaultValue: t('errors.generic') })
            : t('errors.generic')
          setError(errorMessage)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [authUser, setProfile, t])

  const joinedDate = useMemo(() => {
    if (!profile?.created_at) {
      return '-'
    }

      return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(profile.created_at))
  }, [i18n.language, profile?.created_at])

  const dateOfBirth = useMemo(() => {
    if (!profile?.date_of_birth) {
      return null
    }

      return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(profile.date_of_birth))
  }, [i18n.language, profile?.date_of_birth])

  const displayName = profile?.display_name || profile?.username || t('profile.user')
  const avatarInitial = displayName.charAt(0).toUpperCase()
  const phoneNumber = [profile?.phone_country_code, profile?.phone_number].filter(Boolean).join(' ')

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">{t('common.profile')}</p>
        <h1 className="text-3xl font-bold tracking-tight">{t('common.accountInformation')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('profile.description', { appName })}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="border-border/50 shadow-lg">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-20 w-20 rounded-full object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary ring-1 ring-primary/20">
                  {avatarInitial}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl font-semibold">{loading ? t('profile.loadingProfile') : displayName}</CardTitle>
                <CardDescription>{profile?.email || t('profile.detailsPending')}</CardDescription>
              </div>
            </div>

            <Button type="button" className="w-full sm:w-auto">
              <Edit3 className="h-4 w-4" />
              {t('profile.edit')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center text-muted-foreground">
              <Spinner className="mr-2 h-5 w-5" />
              {t('profile.loading')}
            </div>
          ) : (
            <div className="space-y-6">
              <ProfileSection title={t('profile.basic')}>
                <ProfileField icon={<IdCard className="h-4 w-4" />} label={t('profile.realName')} value={profile?.real_name} />
                <ProfileField icon={<UserIcon className="h-4 w-4" />} label={t('profile.displayName')} value={profile?.display_name} />
                <ProfileField icon={<UserIcon className="h-4 w-4" />} label={t('profile.username')} value={profile?.username} />
                <ProfileField icon={<MapPin className="h-4 w-4" />} label={t('profile.placeOfBirth')} value={profile?.place_of_birth} />
                <ProfileField icon={<CalendarDays className="h-4 w-4" />} label={t('profile.dateOfBirth')} value={dateOfBirth} />
                <ProfileField icon={<UserIcon className="h-4 w-4" />} label={t('profile.gender')} value={profile?.gender} />
              </ProfileSection>

              <ProfileSection title={t('profile.contact')}>
                <ProfileField icon={<Phone className="h-4 w-4" />} label={t('profile.phone')} value={phoneNumber} />
                <ProfileField icon={<Mail className="h-4 w-4" />} label={t('common.emailAddress')} value={profile?.email} />
                <ProfileField icon={<Home className="h-4 w-4" />} label={t('profile.domicileAddress')} value={profile?.domicile_address} />
                <label className="flex items-center gap-3 rounded-xl border bg-background p-4 text-sm font-medium text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={Boolean(profile?.domicile_same_as_ktp)}
                    readOnly
                  />
                  {t('profile.sameDomicile')}
                </label>
                <ProfileField icon={<MapPin className="h-4 w-4" />} label={t('profile.ktpAddress')} value={profile?.ktp_address} />
              </ProfileSection>

              <ProfileSection title={t('profile.others')}>
                <ProfileField icon={<Briefcase className="h-4 w-4" />} label={t('profile.profession')} value={profile?.profession} />
                <ProfileField icon={<CalendarDays className="h-4 w-4" />} label={t('profile.joined')} value={joinedDate} />
              </ProfileSection>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface ProfileFieldProps {
  icon: React.ReactNode
  label: string
  value?: string | null
}

interface ProfileSectionProps {
  title: string
  children: React.ReactNode
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
    <div className="grid gap-4 sm:grid-cols-2">{children}</div>
  </section>
)

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <div className="rounded-xl border bg-background p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="break-words text-base font-medium text-foreground">{value || '-'}</p>
  </div>
)
