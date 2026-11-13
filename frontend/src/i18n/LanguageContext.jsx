import React, { useEffect, useState } from 'react';
import { LanguageContext } from './LanguageStateContext';

const STORAGE_KEY = 'lost-spectrum-language';

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try { return localStorage.getItem(STORAGE_KEY) === 'th' ? 'th' : 'en'; }
        catch { return 'en'; }
    });
    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, language); } catch { /* private browsing */ }
        document.documentElement.lang = language;
    }, [language]);
    return <LanguageContext.Provider value={{ language, setLanguage, isThai: language === 'th' }}>{children}</LanguageContext.Provider>;
}
