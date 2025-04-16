import { Link } from '@tanstack/react-router'
import { Button } from '~/domains/ui-system'

interface HeaderProps {
  appTitle?: string;
}

export function Header({ appTitle = 'Financial App' }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 mb-6 border-b">
      <Link
        to="/dashboard"
        className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors"
      >
        {appTitle}
      </Link>
      
      <nav className="flex gap-4">
        <Link
          to="/dashboard"
        >
          {({ isActive }: { isActive: boolean }) => (
            <Button variant={isActive ? "default" : "ghost"}>
              Dashboard
            </Button>
          )}
        </Link>

        <Link
          to="/investments"
        >
          {({ isActive }: { isActive: boolean }) => (
            <Button variant={isActive ? "default" : "ghost"}>
              Investments
            </Button>
          )}
        </Link>
      </nav>
    </header>
  )
} 