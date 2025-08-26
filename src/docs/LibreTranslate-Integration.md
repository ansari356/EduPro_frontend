# LibreTranslate Integration

This document explains how to use the LibreTranslate automatic translation feature that has been integrated into the EduPro frontend application.

## Overview

The LibreTranslate integration provides real-time translation of dynamic content (like API data) that isn't covered by our static i18n translation files. It works alongside the existing `react-i18next` system to provide comprehensive translation coverage.

## How It Works

### 1. **Static Translations (i18n)**
- UI text, labels, buttons, and common phrases
- Uses `t('key')` function
- Fast, no API calls needed
- Stored in `src/locales/` files

### 2. **Automatic Translations (LibreTranslate)**
- Dynamic content from APIs
- Course titles, descriptions, user-generated content
- Real-time translation via LibreTranslate API
- Falls back to original text if translation fails

## Usage Examples

### Basic Usage in Components

```jsx
import { useAutoTranslate } from '../../hooks/useAutoTranslate';
import { useLanguage } from '../../contexts/LanguageContext';

function MyComponent() {
  const { translate, translateWithLibreTranslate } = useAutoTranslate();
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Static UI text */}
      <h1>{t('courses.title')}</h1>
      
      {/* API data with automatic translation */}
      <p>{translate("Published")}</p>
      
      {/* Real-time translation */}
      <p>{translatedContent}</p>
    </div>
  );
}
```

### Real-time Translation with State

```jsx
import { useState, useEffect } from 'react';
import { useAutoTranslate } from '../../hooks/useAutoTranslate';

function CourseCard({ course }) {
  const { translateWithLibreTranslate } = useAutoTranslate();
  const [translatedTitle, setTranslatedTitle] = useState(course.title);
  
  useEffect(() => {
    const translateContent = async () => {
      if (course.title) {
        try {
          const translation = await translateWithLibreTranslate(course.title);
          setTranslatedTitle(translation);
        } catch (error) {
          console.error('Translation failed:', error);
        }
      }
    };
    
    translateContent();
  }, [course.title, translateWithLibreTranslate]);
  
  return <h3>{translatedTitle}</h3>;
}
```

### Batch Translation

```jsx
useEffect(() => {
  const translateMultiple = async () => {
    try {
      const [title, desc, category] = await Promise.all([
        translateWithLibreTranslate(course.title),
        translateWithLibreTranslate(course.description),
        translateWithLibreTranslate(course.category)
      ]);
      
      setTranslatedTitle(title);
      setTranslatedDescription(desc);
      setTranslatedCategory(category);
    } catch (error) {
      console.error('Batch translation failed:', error);
    }
  };
  
  translateMultiple();
}, [course, translateWithLibreTranslate]);
```

## API Functions Available

### From `useAutoTranslate()` Hook

```jsx
const { 
  translate,                    // Static translation (common terms)
  translateWithLibreTranslate, // Real-time API translation
  translateStatus,             // Status translations
  translateType,               // Type translations  
  translateAction              // Action translations
} = useAutoTranslate();
```

### From `useLanguage()` Hook

```jsx
const { 
  t,                          // i18n translation function
  currentLanguage,            // Current language code
  changeLanguage,             // Change language function
  translateText,              // Automatic translation for API data
  translateWithLibreTranslate // LibreTranslate API function
} = useLanguage();
```

## Translation Priority

1. **i18n Keys** - Highest priority, exact matches
2. **Common Translations** - Predefined English→Arabic mappings
3. **LibreTranslate API** - Real-time translation for unknown text
4. **Original Text** - Fallback if all else fails

## Error Handling

The LibreTranslate integration includes comprehensive error handling:

```jsx
try {
  const translation = await translateWithLibreTranslate(text);
  return translation;
} catch (error) {
  console.error('Translation failed:', error);
  return originalText; // Fallback to original
}
```

## Performance Considerations

- **Caching**: Consider implementing translation caching for repeated text
- **Batch Requests**: Use `Promise.all()` for multiple translations
- **Loading States**: Show loading indicators during translation
- **Fallbacks**: Always provide fallback text for failed translations

## Configuration

The LibreTranslate API endpoint is configured in `LanguageContext.jsx`:

```jsx
const res = await fetch("https://libretranslate.com/translate", {
  method: "POST",
  body: JSON.stringify({
    q: text,
    source: "en",
    target: targetLang,
    format: "text"
  }),
  headers: { "Content-Type": "application/json" }
});
```

## Testing

Use the `LibreTranslateDemo` component to test the integration:

```jsx
import LibreTranslateDemo from '../components/common/LibreTranslateDemo';

// In your page/component
<LibreTranslateDemo />
```

## Troubleshooting

### Common Issues

1. **Translation not working**: Check console for API errors
2. **Slow performance**: Implement caching or reduce API calls
3. **API rate limits**: Consider using a different LibreTranslate instance

### Debug Logs

The integration includes extensive console logging:

```javascript
[LibreTranslate] Translating: "Hello World" to ar
[LibreTranslate] Success: "Hello World" -> "مرحبا بالعالم"
[AutoTranslate] Called with: "Published", fallbackKey: null, currentLanguage: "ar"
```

## Best Practices

1. **Use i18n for static UI text** - Faster, more reliable
2. **Use LibreTranslate for dynamic content** - Real-time, flexible
3. **Implement proper loading states** - Better user experience
4. **Handle errors gracefully** - Always provide fallbacks
5. **Cache translations** - Reduce API calls and improve performance

## Future Enhancements

- Translation caching system
- Offline translation support
- Multiple translation service providers
- Translation quality scoring
- User feedback on translations
