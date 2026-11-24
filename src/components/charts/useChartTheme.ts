import { useEffect, useState } from 'react';

export function useChartTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return {
    grid: dark ? '#2a2e3a' : '#e6e8f0',
    text: dark ? '#a7adbb' : '#5c6373',
    primary: dark ? '#818cf8' : '#4f46e5',
    secondary: dark ? '#c4b5fd' : '#6d28d9',
    surface: dark ? '#13151c' : '#ffffff',
    line: dark ? '#2a2e3a' : '#e6e8f0',
  };
}
