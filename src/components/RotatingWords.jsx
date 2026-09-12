import { useEffect, useState } from 'react';

/**
 * Cycles through phrases in place. All phrases are stacked in one grid cell so
 * the line never jumps in height or width while the text changes.
 */
function RotatingWords({ words, interval = 2600, className = '', paused = false }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || words.length < 2) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words, interval, paused]);

  return (
    <span
      className={`grid justify-items-center lg:inline-grid lg:justify-items-start lg:align-baseline ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={`[grid-area:1/1] whitespace-nowrap transition-all duration-500 ease-out ${
            i === index ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-2 blur-[2px]'
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

export default RotatingWords;
