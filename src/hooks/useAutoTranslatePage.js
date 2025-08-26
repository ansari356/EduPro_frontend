import { useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Custom hook for automatic page translation using LibreTranslate API
 * Translates all text nodes on the page when language changes
 */
export const useAutoTranslatePage = () => {
  const { currentLanguage } = useLanguage();

  // Local translation function for common terms
  const translateCommonTerms = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    const commonTranslations = {
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
      'billion': 'مليار',
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
      'Personal Info': 'المعلومات الشخصية',
      'Manage your profile and quick actions': 'إدارة ملفك الشخصي والإجراءات السريعة',
      'Edit Profile': 'تعديل الملف الشخصي',
      'About': 'حول',
      'Username': 'اسم المستخدم',
      'Phone': 'الهاتف',
      'Phone 1': 'الهاتف 1',
      'Phone 2': 'الهاتف 2',
      'Experience': 'الخبرة',
      'Years': 'سنوات',
      'Professor': 'أستاذ',
      'Code': 'الرمز',
      'Student QR': 'رمز QR للطالب',
      'Progress': 'تقدم',
      'Progress Across All Courses': 'التقدم في جميع الدورات',
      'Total Lessons Completed': 'إجمالي الدروس المكتملة',
      'Total Lessons Remaining': 'إجمالي الدروس المتبقية',
      'Courses Enrolled': 'الدورات المسجلة',
      'Next Lessons': 'الدروس التالية',
      'Not enrolled in any courses yet!': 'لم تسجل في أي دورات بعد!',
      'No lessons available yet. Visit your courses to start learning!': 'لا توجد دروس متاحة بعد. زر دوراتك لبدء التعلم!',
      'All lessons completed! Great job!': 'تم إكمال جميع الدروس! عمل رائع!',
      'Continue Learning': 'استمر في التعلم',
      'Your Learning Analytics': 'تحليلات تعلمك',
      'Calculating your learning progress...': 'جاري حساب تقدم تعلمك...',
      'No assessment attempts yet': 'لا توجد محاولات تقييم بعد',
      'Loading assessments...': 'جاري تحميل التقييمات...',
      'Failed to load assessment attempts': 'فشل في تحميل محاولات التقييم',
      'Enrolled Courses': 'الدورات المسجلة',
      'View Course': 'عرض الدورة',
      'Assessment History': 'تاريخ التقييم',
      'No description available': 'لا يوجد وصف متاح',
      'Student Profile': 'الملف الشخصي للطالب',
      'Joined': 'انضم في',
      'Student': 'طالب'
    };
    
    // Check for exact matches first
    if (commonTranslations[text]) {
      return commonTranslations[text];
    }
    
    // Check for partial matches (case insensitive)
    const lowerText = text.toLowerCase();
    for (const [english, arabic] of Object.entries(commonTranslations)) {
      if (lowerText.includes(english.toLowerCase())) {
        return text.replace(new RegExp(english, 'gi'), arabic);
      }
    }
    
    return text;
  };

  const autoTranslatePage = useCallback(async (targetLang = "ar") => {
    // Only translate if target language is Arabic
    if (targetLang !== "ar") return;

    console.log('[AutoTranslatePage] Starting page translation to:', targetLang);

    // Collect text nodes
    const textNodes = [];
    const texts = [];
    const walker = document.createTreeWalker(
      document.body, 
      NodeFilter.SHOW_TEXT, 
      {
        acceptNode: (node) => {
          // Skip script tags, style tags, and their contents
          if (node.parentElement?.tagName === 'SCRIPT' || 
              node.parentElement?.tagName === 'STYLE' ||
              node.parentElement?.classList?.contains('no-translate')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          const text = node.nodeValue?.trim();
          // Only accept text nodes with meaningful content
          if (text && text.length > 1 && /[a-zA-Z]/.test(text)) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }, 
      false
    );

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue.trim();
      if (text.length > 1) {
        textNodes.push(node);
        texts.push(text);
      }
    }

    console.log('[AutoTranslatePage] Found', texts.length, 'text nodes to translate');

    if (texts.length === 0) return;

    try {
      // Send ALL texts in one request
      const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        body: JSON.stringify({
          q: texts,             // send array of strings
          source: "en",
          target: targetLang,
          format: "text"
        }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();
      console.log('[AutoTranslatePage] Translation response:', data);

      // Check if we got an error response
      if (data.error) {
        console.error('[AutoTranslatePage] LibreTranslate API error:', data.error);
        console.log('[AutoTranslatePage] LibreTranslate now requires an API key. Visit https://portal.libretranslate.com to get one.');
        console.log('[AutoTranslatePage] Falling back to local translation for common terms...');
        
        // Fallback to local translation for common terms
        textNodes.forEach((node, i) => {
          const text = texts[i];
          const translatedText = translateCommonTerms(text);
          if (translatedText !== text) {
            node.nodeValue = translatedText;
          }
        });
        
        console.log('[AutoTranslatePage] Local translation completed. For full translation, get a LibreTranslate API key.');
        return;
      }

      // Check if data is an array (successful translation)
      if (Array.isArray(data)) {
        // Replace text nodes with translations
        data.forEach((translation, i) => {
          if (translation.translatedText && textNodes[i]) {
            textNodes[i].nodeValue = translation.translatedText;
          }
        });
      } else {
        console.error('[AutoTranslatePage] Unexpected response format:', data);
      }

      console.log('[AutoTranslatePage] Page translation completed');
    } catch (err) {
      console.error("[AutoTranslatePage] Translation error:", err);
    }
  }, []);

  // Run translation when language changes
  useEffect(() => {
    if (currentLanguage === 'ar') {
      console.log('[AutoTranslatePage] Language changed to Arabic, starting translation');
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        autoTranslatePage('ar');
      }, 500);
      
      return () => clearTimeout(timer);
    } else if (currentLanguage === 'en') {
      console.log('[AutoTranslatePage] Language changed to English, page should show original text');
      // Optionally reload the page to show original English text
      // window.location.reload();
    }
  }, [currentLanguage, autoTranslatePage]);

  // Function to manually trigger translation
  const translateNow = useCallback(() => {
    autoTranslatePage(currentLanguage === 'ar' ? 'ar' : 'en');
  }, [currentLanguage, autoTranslatePage]);

  return { translateNow };
};
