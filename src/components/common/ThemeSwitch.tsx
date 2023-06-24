import './ThemeSwitch.scss';
import { useCallback, useEffect, useState } from 'preact/hooks';

const STORAGE_KEY = 'darkMode';
const PREFER_DARK_QUERY = '(prefers-color-scheme: dark)';

// It's a little weird I know, but this component is also going to handle
// loading in the previous theme state so that the rest of the site can pick
// it up.
function ThemeSwitch() {
  const [theme, setTheme] = useState('system');
  useEffect(() => {
    // Get the current theme from local storage
    if (window?.localStorage) {
      setTheme(window.localStorage.getItem(STORAGE_KEY) ?? 'system');
    }
  }, []);

  const setBodyTheme = useCallback((theme: string) => {
    if (document?.body?.dataset) {
      document.body.dataset.theme = theme;
    }
  }, []);

  useEffect(() => {
    if (window?.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    }

    if (theme === 'system') {
      const mql: MediaQueryList | null = window?.matchMedia ? window.matchMedia(PREFER_DARK_QUERY) : null;
      const handler = (e: any) => {setBodyTheme(e.matches ? 'dark' : 'light')};

      if (mql) {
        mql.addEventListener('change', handler);
      
        const isColorSchemeQuerySupported = mql.media === PREFER_DARK_QUERY;
        if (isColorSchemeQuerySupported) {
          setBodyTheme(mql.matches ? 'dark' : 'light');
        }
      }

      return () => {
        mql?.removeEventListener('change', handler);
      }
    }

    setBodyTheme(theme);
    
    return () => {}
  }, [theme]);

  const onClick = () => {
    const themes = ['system', 'dark', 'light'];
    const currentIdx = themes.findIndex((t) => t === theme);
    setTheme(themes[(currentIdx + 1) % themes.length]);
  };
  return (
    <button onClick={onClick}>
      theme: {theme}
    </button>
  );
}

export default ThemeSwitch;