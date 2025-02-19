import Logo from './logo'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { Session } from '@supabase/supabase-js'
import {
  ArrowRight,
  LogOut,
  MoonIcon,
  SunIcon,
  Trash,
  Undo,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export function NavBar({
  session,
  showLogin,
  signOut,
  onSocialClick,
  onGoToAccount,
}: {
  session: Session | null
  showLogin: () => void
  signOut?: () => void
  onSocialClick?: (target: 'github' | 'x' | 'discord') => void
  onGoToAccount?:() => void
}) {

  return (
    <nav className="flex h-14 p-4 bg-white sticky top-0 z-50  border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center">
        <Link href="/" className="flex items-center gap-2 " target="_blank">
          <Logo width={24} height={24} />
          <h1 className="whitespace-pre font-bold">Product Generate Fragments </h1>
        </Link>
        
      </div>
      {/* <div className="flex items-center gap-1 md:gap-4">
   
        {session ? (
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          session.user.user_metadata?.avatar_url ||
                          'https://avatar.vercel.sh/' + session.user.email
                        }
                        alt={session.user.email}
                      />
                    </Avatar>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>My Account</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuItem  onClick={ ()=>{console.log("clicked");  onGoToAccount()}} className="flex flex-col">
                <span className="text-sm">My Account</span>
                <span className="text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
             
              <DropdownMenuItem onClick={() => onSocialClick('github')}>
                <GitHubLogoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Star us on GitHub
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="default" onClick={showLogin}>
            Sign in
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div> */}
    </nav>
  )
}
