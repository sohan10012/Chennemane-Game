import React from 'react';
import { motion } from 'framer-motion';

const Home = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl p-8 gap-12">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-yellow-600 font-serif drop-shadow-2xl mb-4">
                    Ali Guli Mane
                </h1>
                <p className="text-xl md:text-2xl text-stone-400 font-light tracking-wide max-w-2xl mx-auto">
                    The ancient strategy game of seeds and wit.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStart('PVC')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-stone-900 border border-stone-700 rounded-3xl hover:border-amber-500/50 transition-all shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="text-5xl mb-4">🤖</div>
                    <h2 className="text-2xl font-bold text-white mb-2">VS Computer</h2>
                    <p className="text-sm text-stone-400 text-center">Challenge the AI opponent. Good for practice.</p>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onStart('PVP')}
                    className="group relative flex flex-col items-center justify-center p-8 bg-stone-900 border border-stone-700 rounded-3xl hover:border-green-500/50 transition-all shadow-2xl overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="text-5xl mb-4">👥</div>
                    <h2 className="text-2xl font-bold text-white mb-2">VS Friend</h2>
                    <p className="text-sm text-stone-400 text-center">Play locally with a friend on the same device.</p>
                </motion.button>
            </div>

            <footer className="mt-12 text-stone-600 text-xs text-center font-mono">
                Traditional board game from Karnataka, India.
            </footer>
        </div>
    );
};

export default Home;
