import React, { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarDays, Edit3, Mail, User as UserIcon } from 'lucide-react'
import { getCurrentUser } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/store/useAuthStore'
import { useUserStore } from '@/store/useUserStore'

export const UserDetails: React.FC = () => {
  const authUser = useAuthStore((state) => state.user)
  const { profile, setProfile } = useUserStore()
  const [loading, setLoading] = useState(!profile)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      setLoading(true)
      setError(null)

      if (!authUser) {
        setError('Unable to load account information without an active session.')
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
          const errorMessage = err instanceof Error ? err.message : 'Unable to load account information.'
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
  }, [authUser, setProfile])

  const joinedDate = useMemo(() => {
    if (!profile?.created_at) {
      return '-'
    }

    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(profile.created_at))
  }, [profile?.created_at])

  const displayName = profile?.display_name || profile?.username || 'User'
  const avatarInitial = displayName.charAt(0).toUpperCase()

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Profile</p>
        <h1 className="text-3xl font-bold tracking-tight">Account information</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your Potero profile details.
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
                <CardTitle className="text-2xl font-semibold">{loading ? 'Loading profile...' : displayName}</CardTitle>
                <CardDescription>{profile?.email || 'Account details will appear here.'}</CardDescription>
              </div>
            </div>

            <Button type="button" className="w-full sm:w-auto">
              <Edit3 className="h-4 w-4" />
              Edit profile
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex min-h-48 items-center justify-center text-muted-foreground">
              <Spinner className="mr-2 h-5 w-5" />
              Loading account information...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <ProfileField icon={<UserIcon className="h-4 w-4" />} label="Display name" value={profile?.display_name} />
              <ProfileField icon={<UserIcon className="h-4 w-4" />} label="Username" value={profile?.username} />
              <ProfileField icon={<Mail className="h-4 w-4" />} label="Email address" value={profile?.email} />
              <ProfileField icon={<CalendarDays className="h-4 w-4" />} label="Joined" value={joinedDate} />
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

const ProfileField: React.FC<ProfileFieldProps> = ({ icon, label, value }) => (
  <div className="rounded-xl border bg-background p-4">
    <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="break-words text-base font-medium text-foreground">{value || '-'}</p>
  </div>
)
