import { useContext } from 'react';
import { LanguageContext } from './LanguageStateContext';

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('LanguageProvider is missing');
    return context;
}
