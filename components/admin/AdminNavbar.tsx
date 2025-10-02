"use client"
import { LogOut, Moon, Settings, Sun, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function AdminNavbar() {
  const { setTheme } = useTheme()
  const { data: session } = useSession();

  return (
    <nav className='flex p-4 justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b'>
        <SidebarTrigger/>

        <div className="flex gap-4 items-center">
          {/* Theme Switcher */}
          {/* --- FIX 1: Add modal={false} --- */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {/* --- FIX 2: Add modal={false} --- */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
              <Avatar>
                  <AvatarImage src={session?.user?.image ?? undefined} />
                  <AvatarFallback>{session?.user?.name?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className='h-[1.2rem] w-[1.2rem] mr-2'/>Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className='h-[1.2rem] w-[1.2rem] mr-2'/>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className='h-[1.2rem] w-[1.2rem] mr-2'/>LogOut
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
    </nav>
  )
}
