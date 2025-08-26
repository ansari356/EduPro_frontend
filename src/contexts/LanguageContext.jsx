import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  // Force re-render when language changes
  const [forceUpdate, setForceUpdate] = useState(0);

  // Translation function that uses i18n directly
  const t = (key) => {
    const translation = i18n.t(key);
    return translation;
  };

  // Automatic translation function for API data
  const translateText = (text, fallbackKey = null) => {
    console.log(`[AutoTranslate] Called with: "${text}", fallbackKey: "${fallbackKey}", currentLanguage: "${currentLanguage}"`);
    console.log(`[AutoTranslate] Text type: ${typeof text}, Text length: ${text?.length}`);
    console.log(`[AutoTranslate] Current language state: ${currentLanguage}`);
    
    if (!text || typeof text !== 'string') {
      console.log(`[AutoTranslate] Invalid text, returning as is:`, text);
      return text;
    }
    
    // If current language is English, return as is
    if (currentLanguage === 'en') {
      console.log(`[AutoTranslate] English language, returning as is: "${text}"`);
      return text;
    }
    
    // Try to find a translation key first
    if (fallbackKey) {
      const keyTranslation = i18n.t(fallbackKey);
      if (keyTranslation !== fallbackKey) return keyTranslation;
    }
    
    // For Arabic, try to translate common English terms
    if (currentLanguage === 'ar') {
      console.log(`[AutoTranslate] Attempting to translate: "${text}" (current lang: ${currentLanguage})`);
      const commonTranslations = {
        'Course': 'دورة',
        'Student': 'طالب',
        'Educator': 'معلم',
        'Assessment': 'اختبار',
        'Module': 'وحدة',
        'Lesson': 'درس',
        'Quiz': 'اختبار قصير',
        'Assignment': 'واجب',
        'Exam': 'امتحان',
        'Grade': 'درجة',
        'Score': 'نقاط',
        'Progress': 'تقدم',
        'Completed': 'مكتمل',
        'Pending': 'في الانتظار',
        'Active': 'نشط',
        'Inactive': 'غير نشط',
        'Blocked': 'محظور',
        'Enrolled': 'مسجل',
        'Not Enrolled': 'غير مسجل',
        'Free': 'مجاني',
        'Paid': 'مدفوع',
        'Create': 'إنشاء',
        'Edit': 'تعديل',
        'Delete': 'حذف',
        'View': 'عرض',
        'Save': 'حفظ',
        'Cancel': 'إلغاء',
        'Submit': 'إرسال',
        'Loading': 'جاري التحميل',
        'Error': 'خطأ',
        'Success': 'نجح',
        'Warning': 'تحذير',
        'Info': 'معلومات',
        'Published': 'منشور',
        'Draft': 'مسودة',
        'Under Review': 'قيد المراجعة',
        'Rejected': 'مرفوض',
        'students': 'طلاب',
        'lessons': 'دروس',
        'No rating': 'لا توجد تقييمات',
        'rating': 'تقييم',
        'enrollments': 'تسجيلات',
        'reviews': 'تقييمات',
        'duration': 'المدة',
        'price': 'السعر',
        'category': 'الفئة',
        'title': 'العنوان',
        'description': 'الوصف',
        'thumbnail': 'الصورة المصغرة',
        'video': 'فيديو',
        'document': 'مستند',
        'created': 'تم الإنشاء',
        'updated': 'تم التحديث',
        'status': 'الحالة',
        'type': 'النوع',
        'action': 'الإجراء',
        'search': 'بحث',
        'filter': 'تصفية',
        'sort': 'ترتيب',
        'add': 'إضافة',
        'remove': 'إزالة',
        'upload': 'رفع',
        'download': 'تحميل',
        'share': 'مشاركة',
        'like': 'إعجاب',
        'comment': 'تعليق',
        'reply': 'رد',
        'follow': 'متابعة',
        'unfollow': 'إلغاء المتابعة',
        'block': 'حظر',
        'unblock': 'إلغاء الحظر',
        'report': 'إبلاغ',
        'flag': 'علم',
        'archive': 'أرشفة',
        'restore': 'استعادة',
        'duplicate': 'نسخ',
        'move': 'نقل',
        'copy': 'نسخ',
        'paste': 'لصق',
        'cut': 'قص',
        'undo': 'تراجع',
        'redo': 'إعادة',
        'refresh': 'تحديث',
        'reload': 'إعادة تحميل',
        'back': 'رجوع',
        'forward': 'أمام',
        'home': 'الرئيسية',
        'settings': 'الإعدادات',
        'profile': 'الملف الشخصي',
        'account': 'الحساب',
        'logout': 'تسجيل الخروج',
        'login': 'تسجيل الدخول',
        'register': 'تسجيل',
        'signup': 'إنشاء حساب',
        'forgot': 'نسيت',
        'password': 'كلمة المرور',
        'email': 'البريد الإلكتروني',
        'username': 'اسم المستخدم',
        'name': 'الاسم',
        'first': 'الأول',
        'last': 'الأخير',
        'phone': 'الهاتف',
        'address': 'العنوان',
        'city': 'المدينة',
        'country': 'البلد',
        'zip': 'الرمز البريدي',
        'date': 'التاريخ',
        'time': 'الوقت',
        'start': 'بداية',
        'end': 'نهاية',
        'begin': 'ابدأ',
        'finish': 'إنهاء',
        'complete': 'إكمال',
        'continue': 'متابعة',
        'stop': 'إيقاف',
        'pause': 'إيقاف مؤقت',
        'resume': 'استئناف',
        'restart': 'إعادة تشغيل',
        'repeat': 'تكرار',
        'again': 'مرة أخرى',
        'once': 'مرة واحدة',
        'twice': 'مرتين',
        'close': 'إغلاق',
        'open': 'فتح',
        'show': 'إظهار',
        'hide': 'إخفاء',
        'expand': 'توسيع',
        'collapse': 'طي',
        'minimize': 'تصغير',
        'maximize': 'تكبير',
        'fullscreen': 'ملء الشاشة',
        'exit': 'خروج',
        'enter': 'دخول',
        'select': 'اختيار',
        'choose': 'اختيار',
        'pick': 'اختيار',
        'option': 'خيار',
        'choice': 'اختيار',
        'decision': 'قرار',
        'confirm': 'تأكيد',
        'accept': 'قبول',
        'reject': 'رفض',
        'approve': 'موافقة',
        'disapprove': 'عدم موافقة',
        'allow': 'السماح',
        'deny': 'منع',
        'permit': 'إذن',
        'forbid': 'منع',
        'enable': 'تفعيل',
        'disable': 'تعطيل',
        'activate': 'تفعيل',
        'deactivate': 'تعطيل',
        'on': 'تشغيل',
        'off': 'إيقاف',
        'yes': 'نعم',
        'no': 'لا',
        'ok': 'حسناً',
        'apply': 'تطبيق',
        'reset': 'إعادة تعيين',
        'clear': 'مسح',
        'create': 'إنشاء',
        'new': 'جديد',
        'old': 'قديم',
        'recent': 'حديث',
        'latest': 'أحدث',
        'previous': 'سابق',
        'next': 'التالي',
        'current': 'حالي',
        'future': 'مستقبل',
        'past': 'ماضي',
        'present': 'حاضر',
        'now': 'الآن',
        'today': 'اليوم',
        'yesterday': 'أمس',
        'tomorrow': 'غداً',
        'week': 'أسبوع',
        'month': 'شهر',
        'year': 'سنة',
        'hour': 'ساعة',
        'minute': 'دقيقة',
        'second': 'ثانية',
        'morning': 'صباح',
        'afternoon': 'ظهر',
        'evening': 'مساء',
        'night': 'ليل',
        'day': 'يوم',
        'weekend': 'عطلة نهاية الأسبوع',
        'holiday': 'عطلة',
        'vacation': 'إجازة',
        'break': 'استراحة',
        'rest': 'راحة',
        'sleep': 'نوم',
        'wake': 'استيقاظ',
        'eat': 'أكل',
        'drink': 'شرب',
        'work': 'عمل',
        'study': 'دراسة',
        'learn': 'تعلم',
        'teach': 'تعليم',
        'read': 'قراءة',
        'write': 'كتابة',
        'speak': 'كلام',
        'listen': 'استماع',
        'watch': 'مشاهدة',
        'see': 'رؤية',
        'hear': 'سماع',
        'feel': 'شعور',
        'think': 'تفكير',
        'know': 'معرفة',
        'understand': 'فهم',
        'remember': 'تذكر',
        'forget': 'نسيان',
        'find': 'إيجاد',
        'lose': 'فقدان',
        'get': 'الحصول على',
        'give': 'إعطاء',
        'take': 'أخذ',
        'put': 'وضع',
        'place': 'مكان',
        'go': 'ذهاب',
        'come': 'مجيء',
        'arrive': 'وصول',
        'leave': 'مغادرة',
        'zero': 'صفر',
        'one': 'واحد',
        'two': 'اثنان',
        'three': 'ثلاثة',
        'four': 'أربعة',
        'five': 'خمسة',
        'six': 'ستة',
        'seven': 'سبعة',
        'eight': 'ثمانية',
        'nine': 'تسعة',
        'ten': 'عشرة',
        'hundred': 'مائة',
        'thousand': 'ألف',
        'million': 'مليون',
        'billion': 'مليار'
      };
      
      // Check for exact matches first
      if (commonTranslations[text]) {
        console.log(`[AutoTranslate] Exact match found: "${text}" -> "${commonTranslations[text]}"`);
        return commonTranslations[text];
      }
      
      // Check for partial matches (case insensitive)
      const lowerText = text.toLowerCase();
      for (const [english, arabic] of Object.entries(commonTranslations)) {
        if (lowerText.includes(english.toLowerCase())) {
          const result = text.replace(new RegExp(english, 'gi'), arabic);
          console.log(`[AutoTranslate] Partial match found: "${text}" -> "${result}" (matched: "${english}")`);
          return result;
        }
      }
      
      console.log(`[AutoTranslate] No translation found for: "${text}"`);
    }
    
    // Return original text if no translation found
    return text;
  };

  // LibreTranslate API function for real-time translation (legacy support)
  const translateWithLibreTranslate = async (text, targetLang = "ar") => {
    if (!text || typeof text !== 'string' || currentLanguage === 'en') {
      return text;
    }

    try {
      console.log(`[LibreTranslate] Translating: "${text}" to ${targetLang}`);
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

      const data = await res.json();
      if (data.translatedText) {
        console.log(`[LibreTranslate] Success: "${text}" -> "${text}" -> "${data.translatedText}"`);
        return data.translatedText;
      } else {
        console.log(`[LibreTranslate] No translation returned for: "${text}"`);
        return text;
      }
    } catch (error) {
      console.error(`[LibreTranslate] Error translating "${text}":`, error);
      return text;
    }
  };

  // Fix dropdown positioning for both LTR and RTL modes
  const fixDropdownPositioning = () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        if (currentLanguage === 'ar') {
          // RTL positioning
          menu.style.right = 'auto';
          menu.style.left = '0';
          menu.style.transformOrigin = 'top left';
        } else {
          // LTR positioning
          menu.style.left = 'auto';
          menu.style.right = '0';
          menu.style.transformOrigin = 'top right';
        }
      }
    });

    // Listen for dropdown show events
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const dropdown = mutation.target;
          if (dropdown.classList.contains('show')) {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
              // Force correct positioning when dropdown opens
              setTimeout(() => {
                if (currentLanguage === 'ar') {
                  // RTL positioning
                  menu.style.right = 'auto';
                  menu.style.left = '0';
                  menu.style.transformOrigin = 'top left';
                } else {
                  // LTR positioning
                  menu.style.left = 'auto';
                  menu.style.right = '0';
                  menu.style.transformOrigin = 'top right';
                }
              }, 0);
            }
          }
        }
      });
    });

    dropdowns.forEach(dropdown => {
      observer.observe(dropdown, { attributes: true });
    });

    return () => observer.disconnect();
  };

  const changeLanguage = (newLanguage) => {
    console.log(`[LanguageContext] Changing language from ${currentLanguage} to ${newLanguage}`);
    setCurrentLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Change i18n language
    i18n.changeLanguage(newLanguage);
    
    // Set document attributes
    document.documentElement.setAttribute('dir', newLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLanguage);
    
    // Force re-render of all components
    setForceUpdate(prev => prev + 1);
    
    // Fix dropdown positioning after language change
    setTimeout(fixDropdownPositioning, 100);
  };

  useEffect(() => {
    console.log(`[LanguageContext] useEffect triggered - currentLanguage: ${currentLanguage}`);
    
    // Set initial language
    i18n.changeLanguage(currentLanguage);
    
    // Set initial document attributes
    document.documentElement.setAttribute('dir', currentLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLanguage);
    
    // Fix dropdown positioning on mount
    setTimeout(fixDropdownPositioning, 1000);
  }, [currentLanguage, i18n]);

  const value = {
    currentLanguage,
    changeLanguage,
    t, // Translation function from react-i18next
    translateText, // Automatic translation for API data
    translateWithLibreTranslate, // LibreTranslate API function
    fixDropdownPositioning,
    forceUpdate // Force re-render trigger
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
