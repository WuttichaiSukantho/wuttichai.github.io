import { Button } from '@components/ui/button';
import { ThemeToggle } from '@components/ui/theme-toggle';
import { languageStore } from '@store/language-store';
import { navbarStore } from '@store/navbar-store';
import { AnimatePresence, motion, type Transition } from 'framer-motion';
import {
  BookOpen,
  BriefcaseBusiness,
  Gamepad2,
  GraduationCap,
  Home,
  Layers3,
  Mail,
  Menu,
  User,
  X,
} from 'lucide-react';
import { observer } from 'mobx-react';
import { Component, type MouseEvent, useEffect, useRef } from 'react';

const ICONS = {
  home: Home,
  playground: Gamepad2,
  'about-hero': User,
  'about-story': BookOpen,
  experience: BriefcaseBusiness,
  'tech-stack': Layers3,
  education: GraduationCap,
  contact: Mail,
} as const;

const activeTransition: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 36,
  mass: 0.7,
};

function getNavButtonClass(mobile: boolean, isActive: boolean): string {
  if (mobile) {
    return isActive
      ? 'group relative flex min-h-12 items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-semibold text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70'
      : 'group relative flex min-h-12 items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-white/10 hover:bg-white/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70';
  }

  return isActive
    ? 'group relative flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-[0.72rem] font-semibold tracking-wide text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 xl:px-3.5 xl:text-xs'
    : 'group relative flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-[0.72rem] font-semibold tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 xl:px-3.5 xl:text-xs';
}

const LanguageSwitcher = observer(() => (
  <div
    aria-label={languageStore.t('language.switch')}
    className="inline-flex h-9 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.04] p-1"
    role="toolbar"
  >
    {(['en', 'th'] as const).map((language) => (
      <button
        key={language}
        type="button"
        aria-pressed={languageStore.language === language}
        aria-label={
          language === 'en' ? languageStore.t('language.english') : languageStore.t('language.thai')
        }
        onClick={() => languageStore.setLanguage(language)}
        className={`min-h-7 min-w-8 rounded-full px-2 text-[0.65rem] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 sm:min-w-9 ${
          languageStore.language === language
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {language}
      </button>
    ))}
  </div>
));

interface NavButtonProps {
  readonly id: string;
  readonly label: string;
  readonly mobile?: boolean;
}

class NavButtonClass extends Component<NavButtonProps> {
  private readonly handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    const { id, mobile } = this.props;

    if (mobile) {
      navbarStore.setOpen(false);
      globalThis.window.requestAnimationFrame(() => navbarStore.scrollTo(id));
      return;
    }

    navbarStore.scrollTo(id);
  };

  override render(): React.ReactNode {
    const { id, label, mobile = false } = this.props;
    const Icon = ICONS[id as keyof typeof ICONS] ?? Home;
    const isActive = navbarStore.activeId === id;

    return (
      <motion.a
        href={`#${id}`}
        aria-current={isActive ? 'location' : undefined}
        onClick={this.handleClick}
        whileHover={mobile ? { x: 4 } : { y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className={getNavButtonClass(mobile, isActive)}
      >
        {isActive && (
          <motion.span
            layoutId={mobile ? 'mobile-nav-indicator' : 'desktop-nav-indicator'}
            transition={activeTransition}
            aria-hidden="true"
            className={
              mobile
                ? 'absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary shadow-[0_0_12px_rgba(220,20,60,0.8)]'
                : 'absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary xl:inset-x-3'
            }
          />
        )}
        <Icon
          aria-hidden="true"
          size={mobile ? 18 : 15}
          strokeWidth={isActive ? 2.4 : 2}
          className={`shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}
        />
        <span className="min-w-0 truncate">{label}</span>
      </motion.a>
    );
  }
}

const NavButton = observer(NavButtonClass);

const MobileNavigation = observer(() => {
  const panelRef = useRef<HTMLElement>(null);
  const isOpen = navbarStore.isOpen;

  useEffect(() => {
    if (!isOpen) return undefined;

    const firstFocusable = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstFocusable?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        navbarStore.setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    globalThis.window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {navbarStore.isOpen && (
        <>
          <motion.button
            type="button"
            aria-label={languageStore.t('nav.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => navbarStore.setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-[55] bg-black/60 backdrop-blur-[2px] xl:hidden"
          />

          <motion.aside
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label={languageStore.t('nav.menu')}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 right-0 top-[var(--header-height)] z-[60] flex w-[min(22rem,calc(100vw-1rem))] max-w-full flex-col overflow-y-auto border-l border-white/10 bg-background/98 shadow-2xl xl:hidden"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground">
                  W
                </span>
                <span
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-2xl tracking-[0.1em] text-foreground"
                >
                  WUTTICHAI
                </span>
              </div>
              <button
                type="button"
                aria-label={languageStore.t('nav.close')}
                onClick={() => navbarStore.setOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1.5 px-3 py-5 sm:px-4 sm:py-6">
              {navbarStore.navItems.map((item) => (
                <NavButton
                  key={item.id}
                  id={item.id}
                  label={languageStore.t(item.labelKey)}
                  mobile
                />
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
});

interface NavbarState {
  readonly isScrolled: boolean;
}

class NavbarClass extends Component<object, NavbarState> {
  override state: NavbarState = { isScrolled: false };

  override componentDidMount(): void {
    navbarStore.registerSections(navbarStore.navItems.map((item) => item.id));
    globalThis.window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll();
  }

  override componentWillUnmount(): void {
    globalThis.window.removeEventListener('scroll', this.handleScroll);
    navbarStore.destroy();
  }

  private readonly handleScroll = (): void => {
    const isScrolled = globalThis.window.scrollY > 12;

    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled });
    }
  };

  override render(): React.ReactNode {
    const { isScrolled } = this.state;

    return (
      <>
        <motion.header
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 28 }}
          className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
            isScrolled
              ? 'border-white/10 bg-background/90 shadow-[0_12px_35px_rgba(0,0,0,0.2)] backdrop-blur-xl'
              : 'border-white/[0.06] bg-background/70 backdrop-blur-lg'
          }`}
        >
          <div className="container-responsive flex min-h-16 items-center gap-3 py-2 sm:min-h-[4.5rem] lg:gap-5">
            <motion.button
              type="button"
              aria-label={languageStore.t('nav.homeLabel')}
              onClick={() => navbarStore.scrollTo('home')}
              whileTap={{ scale: 0.97 }}
              className="group flex min-w-0 shrink items-center gap-2 rounded-lg py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-[0_6px_18px_rgba(220,20,60,0.25)] sm:size-9">
                W
              </span>
              <span
                className="truncate text-lg tracking-[0.08em] text-foreground transition-colors group-hover:text-primary sm:text-2xl"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                WUTTICHAI
              </span>
            </motion.button>

            <nav
              aria-label={languageStore.t('nav.menu')}
              className="hidden min-w-0 flex-1 items-center justify-center xl:flex"
            >
              <div className="flex min-w-0 items-center gap-0.5 rounded-xl border border-white/[0.08] bg-black/10 p-1">
                {navbarStore.navItems.map((item) => (
                  <NavButton key={item.id} id={item.id} label={languageStore.t(item.labelKey)} />
                ))}
              </div>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
              <LanguageSwitcher />
              <ThemeToggle />

              <Button
                aria-label={languageStore.t('nav.menu')}
                aria-expanded={navbarStore.isOpen}
                aria-controls="mobile-navigation"
                variant="ghost"
                size="icon-lg"
                onClick={() => navbarStore.setOpen(!navbarStore.isOpen)}
                className="rounded-xl border border-white/10 bg-white/[0.04] text-foreground hover:bg-white/10 xl:hidden"
              >
                <motion.span
                  initial={false}
                  animate={{ rotate: navbarStore.isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid place-items-center"
                >
                  {navbarStore.isOpen ? (
                    <X size={20} aria-hidden="true" />
                  ) : (
                    <Menu size={20} aria-hidden="true" />
                  )}
                </motion.span>
              </Button>
            </div>
          </div>
        </motion.header>
        <MobileNavigation />
      </>
    );
  }
}

export const Navbar = observer(NavbarClass);
