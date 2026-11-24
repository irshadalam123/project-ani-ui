import { Menu } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { mobileNav } from '@/components/layout/navigation';
import { cn } from '@/lib/cn';
import { useAppDispatch } from '@/store/hooks';
import { setMobileMenuOpen } from '@/store/uiSlice';

export function MobileNav() {
  const dispatch = useAppDispatch();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-surface md:hidden"
      aria-label="Mobile"
    >
      {mobileNav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium',
              isActive ? 'text-brand' : 'text-muted',
            )
          }
        >
          <item.icon className="size-4" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
      <button
        type="button"
        className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium text-muted"
        onClick={() => dispatch(setMobileMenuOpen(true))}
      >
        <Menu className="size-4" aria-hidden="true" />
        More
      </button>
    </nav>
  );
}
