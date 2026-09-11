import { languageStore } from '@store/language-store';
import type { NotFoundRouteProps } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { Component } from 'react';

export class NotFound extends Component<NotFoundRouteProps> {
  override render() {
    return (
      <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#09090b] text-center text-white overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center px-4"
        >
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
            className="mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-400 uppercase backdrop-blur-md"
          >
            404 · {languageStore.t('notFound.title')}
          </motion.span>

          <h1 className="mb-2 text-9xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            404
          </h1>

          <p className="mb-8 max-w-md text-base text-zinc-400">
            {languageStore.t('notFound.description')}
          </p>

          <Link
            to="/"
            className="group relative inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 shadow-lg shadow-black/50"
          >
            <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>{languageStore.t('notFound.home')}</span>
          </Link>
        </motion.div>
      </div>
    );
  }
}

export const NotFoundComponent = (props: NotFoundRouteProps) => <NotFound {...props} />;
