import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Pit = ({ seeds, index, onClick, isPlayable, owner, isHighlighted, justSown }) => {
    // Memoize random positions so they don't jump around on re-renders,
    // unless seeds count changes significantly (handled by key).
    const seedVisuals = useMemo(() => {
        return Array.from({ length: seeds }).map((_, i) => ({
            id: i,
            x: Math.random() * 40 + 15,
            y: Math.random() * 40 + 15,
            rotation: Math.random() * 360,
        }));
    }, [seeds]);

    return (
        <div
            onClick={isPlayable ? onClick : undefined}
            className={clsx(
                "relative w-12 h-12 md:w-20 md:h-20 rounded-full shadow-inner transform transition-all duration-300",
                owner === 'P1' ? 'mb-2' : 'mt-2',
                isPlayable ? 'cursor-pointer hover:scale-105 ring-2 ring-amber-200' : 'opacity-90',
                isHighlighted || justSown ? 'ring-4 ring-yellow-400' : '',
                "bg-stone-900 border-2 border-stone-700 overflow-hidden"
            )}
        >
            {/* Glow effect on update */}
            <AnimatePresence>
                {justSown && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.5, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-yellow-500 rounded-full blur-xl pointer-events-none"
                    />
                )}
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-full h-full p-3">
                    <AnimatePresence>
                        {seedVisuals.map((seed, i) => (
                            <motion.div
                                key={`${index}-${i}`} // Unique key per seed per hole
                                initial={{ scale: 0, y: -20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay: i * 0.05 // Stagger effect
                                }}
                                className="absolute w-3 h-3 bg-white rounded-full shadow-sm"
                                style={{
                                    left: `${seed.x}%`,
                                    top: `${seed.y}%`,
                                    background: 'radial-gradient(circle at 30% 30%, #ffecd2, #fcb045)',
                                    transform: `rotate(${seed.rotation}deg)`, // Static rotation to basic style
                                    boxShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                                }}
                            />
                        ))}
                    </AnimatePresence>

                    {seeds > 0 && (
                        <motion.div
                            key={`count-${seeds}`}
                            initial={{ scale: 1.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs drop-shadow-md z-10"
                        >
                            {seeds}
                        </motion.div>
                    )}
                </div>
            </div>

            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-amber-200/50 font-mono">
                {index + 1}
            </span>
        </div>
    );
};

export default Pit;
