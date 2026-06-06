/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IMaskInput } from 'react-imask';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

export interface NewsItem {
  id: string | number;
  category: string;
  title: string;
  date: string;
  displayDate: string;
  image: string;
  excerpt: string;
  content: string;
  gallery?: string[];
  videoUrl?: string;
  isDemo?: boolean;
}
import { 
  Heart, 
  Menu, 
  ArrowRight, 
  ArrowUpRight,
  Phone, 
  Share2, 
  Mail, 
  ChevronRight, 
  Leaf, 
  CreditCard, 
  Users, 
  HandHeart,
  FileText,
  Download,
  Info,
  Star,
  Instagram,
  MessageCircle,
  X,
  Search,
  Filter,
  Calendar,
  Banknote,
  MapPin,
  User,
  Copy,
  Check,
  Plus,
  Upload,
  Lock,
  Image,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronLeft,
  Maximize2
} from 'lucide-react';

// Character Components (Line Art Images)
const WinniePooh = ({ className }: { className?: string }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    className={`character-line-art ${className}`}
  >
    <img 
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Bear.png" 
      alt="Winnie" 
      className="w-full h-full object-contain grayscale contrast-125"
      referrerPolicy="no-referrer"
    />
  </motion.div>
);

const Hare = ({ className }: { className?: string }) => (
  <motion.div 
    initial={{ y: -50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    className={`character-line-art ${className}`}
  >
    <img 
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Rabbit%20Face.png" 
      alt="Hare" 
      className="w-full h-full object-contain grayscale contrast-125"
      referrerPolicy="no-referrer"
    />
  </motion.div>
);

const Eeyore = ({ className }: { className?: string }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    className={`character-line-art ${className}`}
  >
    <img 
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Donkey.png" 
      alt="Eeyore" 
      className="w-full h-full object-contain grayscale contrast-125"
      referrerPolicy="no-referrer"
    />
  </motion.div>
);

const Owl = ({ className, animateImmediately = true }: { className?: string; animateImmediately?: boolean }) => (
  <motion.div 
    initial={{ y: 20, opacity: 0 }}
    animate={animateImmediately ? { y: 0, opacity: 1 } : undefined}
    whileInView={!animateImmediately ? { y: 0, opacity: 1 } : undefined}
    className={`character-line-art ${className}`}
  >
    <img 
      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Owl.png" 
      alt="Owl" 
      className="w-full h-full object-contain grayscale contrast-125"
      referrerPolicy="no-referrer"
    />
  </motion.div>
);

const OrganizationLogo = ({ className = "w-full h-full" }: { className?: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className} flex items-center justify-center`}>
      {!hasError ? (
        <img 
          src="/logo.svg" 
          alt="Логотип фонда «Мы как все»"
          onError={(e) => {
            if (e.currentTarget.src.endsWith('/logo.svg')) {
              e.currentTarget.src = '/logo.webp';
            } else {
              setHasError(true);
            }
          }}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full border border-dashed border-purple-300 rounded-xl bg-purple-50 flex items-center justify-center p-1 text-center font-black text-[9px] text-purple-700 leading-tight uppercase select-none animate-pulse">
          ЛОГОТИП ФОНДА
        </div>
      )}
    </div>
  );
};

const MotherChildIcon = ({ className = "relative w-8 h-8 flex items-center justify-center shrink-0", imgClassName = "w-full h-full object-contain opacity-75 hover:opacity-100 transition-all" }: { className?: string; imgClassName?: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={className}>
      {!hasError ? (
        <img 
          src="/mother-child.svg" 
          alt="Логотип «мама и дитя» проекта Мы как все"
          onError={(e) => {
            if (e.currentTarget.src.endsWith('/mother-child.svg')) {
              e.currentTarget.src = '/mother-child.webp';
            } else {
              setHasError(true);
            }
          }}
          className={imgClassName}
        />
      ) : (
        <div className="w-full h-full border border-dashed border-purple-200 rounded-xl bg-purple-50/50 flex flex-col items-center justify-center p-0.5 text-center text-[8px] leading-tight font-black text-purple-500 select-none">
          <span>МАМА</span>
        </div>
      )}
    </div>
  );
};
// Динамическое определение доступных партнеров без ручного изменения кода.
const useDynamicPartners = () => {
  const [activePartners, setActivePartners] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8]);

  useEffect(() => {
    const detectPartners = async () => {
      const valid: number[] = [];
      let consecutiveFailures = 0;
      let currentId = 1;
const checkImageExists = (num: number): Promise<boolean> => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = `/partners/partner-${num}.webp`;
          img.onload = () => resolve(true);
          img.onerror = () => {
            const svgImg = new window.Image();
            svgImg.src = `/partners/partner-${num}.png`;
            svgImg.onload = () => resolve(true);
            svgImg.onerror = () => resolve(false);
          };
        });
      };
            // Проверяем до 100 возможных партнеров. Если видим 5 неудач подряд — прекращаем поиск.
      while (consecutiveFailures < 5 && currentId <=50){
        const exist = await checkImageExists(currentId);
        if (exist) {
          valid.push(currentId);
          consecutiveFailures = 0;
        } else {
          consecutiveFailures++;
        }
        currentId++;
      }

      if (valid.length > 0) {
        setActivePartners(valid);
      }
    };

    detectPartners();
  }, []);
    return activePartners;
};

const getMarqueeItems = (list: number[]) => {
  if (list.length === 0) return [];
  // Дублируем список, чтобы в ряду строки было не менее 18 элементов для плавности анимации.
  const minItems = 18;
  const repeats = Math.max(3, Math.ceil(minItems / list.length));
  const result: number[] = [];
  for (let i = 0; i < repeats; i++) {
    result.push(...list);
  }
  return result;
};

const PartnerSlot = ({ num }: { num: number }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  return (
    <div className="w-40 flex-shrink-0 h-20 flex items-center justify-center relative select-none">
      <img 
        src={`/partners/partner-${num}.webp`} 
        alt={`Логотип партнера ${num}`}
          onError={(e) => {
            if (e.currentTarget.src.endsWith('.png')) {
              e.currentTarget.src = `/partners/partner-${num}.svg`;
            } else {
              setHasError(true);
            }
          }}
          className="h-15 sm:h-16 w-auto max-w-full object-contain pointer-events-none"
        />
    </div>
  );
};

const GalleryImage = ({ src, alt }: { src: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden">
      {!hasError ? (
        <img 
          src={src} 
          alt={alt} 
          onError={(e) => {
            if (e.currentTarget.src.endsWith('.jpg')) {
              e.currentTarget.src = src.replace('.jpg', '.png');
            } else {
              setHasError(true);
            }
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center p-4 text-center select-none group-hover:bg-slate-100/80 transition-colors duration-300">
          <Image size={24} className="text-purple-300 mb-2 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black uppercase text-slate-500 tracking-wider">
            {alt}
          </span>
          <span className="text-[9px] text-slate-300 mt-1 font-mono">{src}</span>
        </div>
      )}
    </div>
  );
};

// Dynamic floating decorative petals/particles drifting from the emblem towards the text
const HeroFlowerParticles = () => {
  const particles = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const type = i % 4;
      const size = 8 + (i % 3) * 6; // размеры лепестков от 8px до 20px
      const colors = [
        'text-pink-400/60',
        'text-purple-400/65',
        'text-fuchsia-400/60',
        'text-violet-400/50',
        'text-rose-300/75',
        'text-rose-400/55'
      ];
      const color = colors[i % colors.length];
      
      // Направление полета: справа налево (с 65%-95% до 5%-45% ширины экрана)
      const startX = 65 + (i * 7) % 30;
      const startY = 10 + (i * 13) % 80;
      
      const endX = 5 + (i * 9) % 40;
      const endY = startY - 20 + (i * 11) % 40; // легкий дрейф по высоте вверх/вниз
      
      const duration = 14 + (i * 3) % 18; // плавный органический полет длительностью от 14 до 32 секунд
      const delay = (i * 1.2) % 15;
      
      return {
        id: i,
        type,
        size,
        color,
        startX: `${startX}%`,
        startY: `${startY}%`,
        endX: `${endX}%`,
        endY: `${endY}%`,
        duration,
        delay,
        rotate: (i * 45) % 360,
        endRotate: ((i * 45) % 360) + (i % 2 === 0 ? 360 : -360) * (2 + (i % 3)),
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden select-none">
      {particles.map((p) => {
        let svgPath = "";
        if (p.type === 0) {
          // Изящный одиночный лепесток
          svgPath = "M12 21.5c-3.5 0-6.5-3-6.5-6.5c0-4.5 5.5-12 6.5-13.2c1 1.2 6.5 8.7 6.5 13.2c0 3.5-3 6.5-6.5 6.5z";
        } else if (p.type === 1) {
          // Маленький цветок с пятью лепестками
          svgPath = "M12 9.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5zm0 8c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5zm6-4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5s.67 1.5 1.5 1.5zm-12 0C6.83 13.5 7.5 12.83 7.5 12S6.83 10.5 6 10.5S4.5 11.17 4.5 12S5.17 13.5 6 13.5z";
        } else if (p.type === 2) {
          // Изогнутый двойной лепесток крыла бабочки
          svgPath = "M12 10c1-2 4-2 3.5 1.5c-.3.8-.5 1.7-1 2.3c-.6.7-1.3.8-1.5.9c-.2-.1-.9-.2-1.5-.9c-.5-.6-.7-1.5-1-2.3C10 8 13 8 12 10z";
        } else {
          // Нежная звездочка-цветок
          svgPath = "M12 2a1.5 1.5 0 0 1 1.5 1.5v3.4c2.5-.2 4.1 1.8 4.1 1.8s-2.1 1-3.6.4v3.4a1.5 1.5 0 0 1-3 0V9.1c-1.5.6-3.6-.4-3.6-.4s1.6-2 4.1-1.8V3.5A1.5 1.5 0 0 1 12 2z";
        }

        return (
          <motion.div
            key={p.id}
            className={`absolute ${p.color} pointer-events-none select-none`}
            style={{
              width: p.size,
              height: p.size,
              left: p.startX,
              top: p.startY,
              transform: `rotate(${p.rotate}deg)`,
            }}
            animate={{
              left: [p.startX, p.endX],
              top: [p.startY, p.endY],
              rotate: [p.rotate, p.endRotate],
              opacity: [0, 0.3, 0.85, 0.85, 0.3, 0],
              scale: [0.5, 1.1, 1.1, 0.9, 0.7, 0.4],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d={svgPath} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

function HelpRequestForm() {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childNameAge: '',
    description: '',
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.parentName.trim()) newErrors.parentName = 'Пожалуйста, введите ваше ФИО';
    if (!formData.phone.trim()) newErrors.phone = 'Пожалуйста, введите номер телефона';
    if (!formData.email.trim()) newErrors.email = 'Пожалуйста, введите E-mail';
    if (!formData.childNameAge.trim()) newErrors.childNameAge = 'Пожалуйста, укажите имя и возраст ребенка';
    if (!formData.description.trim()) newErrors.description = 'Пожалуйста, опишите вашу ситуацию';
    if (!formData.consent) newErrors.consent = 'Необходимо ваше согласие на обработку данных';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/help-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await response.json().catch(() => ({}));
        setSubmitError(errData.error || 'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Сетевая ошибка. Пожалуйста, проверьте интернет-соединение.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 flex flex-col items-center justify-center h-full"
      >
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6 shadow-xl shadow-purple-100">
          <Check size={48} strokeWidth={3} className="animate-bounce" />
        </div>
        <h3 className="text-3xl font-headline font-black text-slate-900 mb-4">Спасибо! Заявка принята</h3>
        <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed mb-6">
          Мы получили ваше обращение. Волонтёры фонда свяжутся с вами в течение 14 рабочих дней.
        </p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              parentName: '',
              phone: '',
              email: '',
              childNameAge: '',
              description: '',
              consent: false,
            });
          }}
          className="px-6 py-2.5 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 transition-all text-sm"
        >
          Отправить еще раз
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold leading-relaxed">
          {submitError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="help-parentName" className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">ФИО родителя / опекуна *</label>
          <input 
            type="text"
            id="help-parentName"
            required
            value={formData.parentName}
            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            placeholder="Иванова Анна Сергеевна"
            className={`w-full px-5 py-3 bg-slate-50 border ${errors.parentName ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/40 transition-all text-slate-900 font-bold`}
          />
          {errors.parentName && <span className="text-xs text-red-500 mt-1 block">{errors.parentName}</span>}
        </div>

        <div>
          <label htmlFor="help-phone" className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Номер телефона *</label>
          <IMaskInput
            mask="+375 (00) 000-00-00"
            id="help-phone"
            value={formData.phone}
            required
            onAccept={(value: string) => setFormData(prev => ({ ...prev, phone: value }))}
            className={`w-full px-5 py-3 bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/40 transition-all text-slate-900 font-bold`}
            placeholder="+375 (__) ___-__-__"
            type="tel"
          />
          {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="help-email" className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">E-mail *</label>
          <input 
            type="email"
            id="help-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@gmail.com"
            className={`w-full px-5 py-3 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/40 transition-all text-slate-900 font-bold`}
          />
          {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
        </div>

        <div>
          <label htmlFor="help-childNameAge" className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Имя и возраст ребенка *</label>
          <input 
            type="text"
            id="help-childNameAge"
            required
            value={formData.childNameAge}
            onChange={(e) => setFormData({ ...formData, childNameAge: e.target.value })}
            placeholder="Максим, 6 лет"
            className={`w-full px-5 py-3 bg-slate-50 border ${errors.childNameAge ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/40 transition-all text-slate-900 font-bold`}
          />
          {errors.childNameAge && <span className="text-xs text-red-500 mt-1 block">{errors.childNameAge}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="help-description" className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Какая помощь вам необходима и описание ситуации *</label>
        <textarea 
          rows={4}
          id="help-description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Опишите, пожалуйста, диагноз ребенка и вид поддержки (финансовая помощь, психологические группы, юридическая поддержка...)"
          className={`w-full px-5 py-3 bg-slate-50 border ${errors.description ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/40 transition-all text-slate-900 font-bold resize-none`}
        />
        {errors.description && <span className="text-xs text-red-500 mt-1 block">{errors.description}</span>}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="help-consent" className="flex items-start gap-3 cursor-pointer select-none">
          <input 
            type="checkbox"
            id="help-consent"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 focus-visible:ring-purple-500/40"
          />
          <span className="text-xs text-slate-500 leading-normal">
            Я даю согласие на обработку моих персональных данных и подтверждаю достоверность предоставленных сведений. *
          </span>
        </label>
        {errors.consent && <span className="text-xs text-red-500 block">{errors.consent}</span>}
      </div>

      <div className="pt-2">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-lg shadow-purple-200 hover:shadow-xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'} <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

function VolunteerForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    age: '',
    hasDisabledChildCard: false,
    phone: '',
    email: '',
    helpDetail: '',
    consent: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Пожалуйста, введите ваше ФИО';
    if (!formData.address.trim()) newErrors.address = 'Пожалуйста, введите место жительства (населенный пункт)';
    if (!formData.age.trim()) newErrors.age = 'Пожалуйста, укажите ваш возраст';
    if (!formData.phone.trim()) newErrors.phone = 'Пожалуйста, введите номер телефона';
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Пожалуйста, введите корректный E-mail';
      }
    }
    if (!formData.consent) newErrors.consent = 'Необходимо согласие на обработку персональных данных';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errData = await response.json().catch(() => ({}));
        setSubmitError(errData.error || 'Произошла ошибка при отправке анкеты. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Volunteer form submission error:', error);
      setSubmitError('Сетевая ошибка. Пожалуйста, проверьте интернет-соединение.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 flex flex-col items-center justify-center h-full"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-100">
          <Check size={40} strokeWidth={3} className="animate-bounce" />
        </div>
        <h3 className="text-2xl font-headline font-black text-emerald-950 mb-4">Спасибо! Анкета принята</h3>
        <p className="text-emerald-800/80 text-base max-w-sm mx-auto leading-relaxed mb-6 font-medium">
          Мы получили ваши ответы и очень ценим ваше желание помочь! Мы свяжемся с вами в ближайшее время.
        </p>
        <button 
          onClick={onClose}
          type="button"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all text-sm shadow-md hover:scale-105"
        >
          Закрыть
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold leading-relaxed w-full">
          {submitError}
        </div>
      )}

      <div>
        <label htmlFor="vol-fullName" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">ФИО *</label>
        <input 
          type="text"
          id="vol-fullName"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Иванов Иван Иванович"
          className={`w-full px-4 py-2.5 bg-white border ${errors.fullName ? 'border-red-400' : 'border-emerald-250 hover:border-emerald-350 focus:border-emerald-500'} rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold`}
        />
        {errors.fullName && <span className="text-xs text-red-500 mt-1 block">{errors.fullName}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-address" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">Место жительства *</label>
          <input 
            type="text"
            id="vol-address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="г. Гомель, ул. Совецкая"
            className={`w-full px-4 py-2.5 bg-white border ${errors.address ? 'border-red-400' : 'border-emerald-250 hover:border-emerald-350 focus:border-emerald-500'} rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold`}
          />
          {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
        </div>

        <div>
          <label htmlFor="vol-age" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">Возраст *</label>
          <input 
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="vol-age"
            required
            value={formData.age}
            onChange={(e) => {
              const cleanVal = e.target.value.replace(/\D/g, '');
              if (cleanVal.length <= 3) {
                setFormData({ ...formData, age: cleanVal });
              }
            }}
            placeholder="Например, 25"
            className={`w-full px-4 py-2.5 bg-white border ${errors.age ? 'border-red-400' : 'border-emerald-250 hover:border-emerald-350 focus:border-emerald-500'} rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold`}
          />
          {errors.age && <span className="text-xs text-red-500 mt-1 block">{errors.age}</span>}
        </div>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-center justify-between gap-3">
        <label htmlFor="vol-hasDisabledChildCard" className="text-xs font-bold text-emerald-900 select-none cursor-pointer leading-tight">
          Имеете ли удостоверение ребенка-инвалида?
        </label>
        <input 
          type="checkbox"
          id="vol-hasDisabledChildCard"
          checked={formData.hasDisabledChildCard}
          onChange={(e) => setFormData({ ...formData, hasDisabledChildCard: e.target.checked })}
          className="h-5 w-5 bg-white border border-emerald-300 rounded text-emerald-600 focus:ring-emerald-500 focus-visible:ring-emerald-500/40 cursor-pointer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-phone" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">Номер телефона *</label>
          <IMaskInput
            mask="+375 (00) 000-00-00"
            id="vol-phone"
            value={formData.phone}
            required
            onAccept={(value: string) => setFormData(prev => ({ ...prev, phone: value }))}
            className={`w-full px-4 py-2.5 bg-white border ${errors.phone ? 'border-red-400' : 'border-emerald-250 hover:border-emerald-350 focus:border-emerald-500'} rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold`}
            placeholder="+375 (__) ___-__-__"
            type="tel"
          />
          {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
        </div>

        <div>
          <label htmlFor="vol-email" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">E-mail</label>
          <input 
            type="email"
            id="vol-email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@gmail.com"
            className={`w-full px-4 py-2.5 bg-white border ${errors.email ? 'border-red-400' : 'border-emerald-250 hover:border-emerald-350 focus:border-emerald-500'} rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold`}
          />
          {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
        </div>
      </div>

      <div>
        <label htmlFor="vol-helpDetail" className="block text-xs font-black text-emerald-800 uppercase tracking-wider mb-1.5">Чем вы можете помочь проекту?</label>
        <textarea 
          id="vol-helpDetail"
          rows={3}
          value={formData.helpDetail}
          onChange={(e) => setFormData({ ...formData, helpDetail: e.target.value })}
          placeholder="Навыки, направление, интересы, опыт волонтёрства и т.д."
          className="w-full px-4 py-2.5 bg-white border border-emerald-250 hover:border-emerald-350 focus:border-emerald-500 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all text-emerald-950 font-bold resize-none"
        />
      </div>

      <div>
        <label htmlFor="vol-consent" className="flex items-start gap-3 cursor-pointer select-none">
          <input 
            type="checkbox"
            id="vol-consent"
            required
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300 focus-visible:ring-emerald-500/40 cursor-pointer animate-none"
          />
          <span className="text-[11px] text-emerald-800 leading-snug">
            Я даю согласие на обработку моих персональных данных и подтверждаю достоверность предоставленных сведений. *
          </span>
        </label>
        {errors.consent && <span className="text-xs text-red-500 block mt-1">{errors.consent}</span>}
      </div>

      <div className="pt-2 flex gap-3">
        <button 
          type="button"
          onClick={onClose}
          className="flex-1 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-black transition-all text-sm cursor-pointer"
        >
          Отмена
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black shadow-lg shadow-emerald-100/50 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'} <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const activePartners = useDynamicPartners();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [dbError, setDbError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  
  // Editing state
  const [editingProjectId, setEditingProjectId] = useState<string | number | null>(null);
  const [addProjectError, setAddProjectError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Новости',
    excerpt: '',
    content: '',
    image: '',
    gallery: [] as string[],
    videoUrl: ''
  });

  // Track Firebase Auth state for administration permissions
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore synchronizer for news/projects
  useEffect(() => {
    const projectsPath = 'projects';
    const unsubscribe = onSnapshot(collection(db, projectsPath), (snapshot) => {
      setDbError(false);
      if (snapshot.empty) {
        // If the database is empty, keep it empty to allow user to manage real projects
        setNews([]);
      } else {
        const loadedProjects = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: Number(doc.id) || doc.id
          };
        }) as NewsItem[];
        setNews(loadedProjects);
      }
    }, (error) => {
      setDbError(true);
      handleFirestoreError(error, OperationType.GET, projectsPath);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsAuthLoading(true);
    try {
      // Sign in to Firebase Auth
      await signInWithEmailAndPassword(auth, loginForm.username, loginForm.password);
      setIsLoginOpen(false);
      setLoginForm({ username: '', password: '' });
    } catch (error: any) {
      console.error("Authentication action failed:", error);
      let errorMsg = error.message || String(error);
      
      // Localized clean messages
      if (errorMsg.includes('auth/invalid-email')) {
        errorMsg = 'Некорректный формат адреса электронной почты.';
      } else if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/wrong-password')) {
        errorMsg = 'Неверный логин или пароль.';
      } else if (errorMsg.includes('auth/missing-password')) {
        errorMsg = 'Введите пароль.';
      } else {
        errorMsg = 'Ошибка авторизации. Убедитесь, что пользователь зарегистрирован в Firebase Auth.';
      }
      setLoginError(errorMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getYoutubeEmbedUrl = (url?: string): string => {
    if (!url) return '';
    let cleanUrl = url.trim();
    if (!cleanUrl) return '';

    // Если это просто готовый 11-значный ID видео
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return `https://www.youtube.com/embed/${cleanUrl}`;
    }

    // Если ссылка уже является ссылкой для встраивания
    if (cleanUrl.includes('youtube.com/embed/')) {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      return cleanUrl;
    }

    try {
      let videoId = '';
      let isShorts = cleanUrl.includes('youtube.com/shorts/');

      if (isShorts) {
        const parts = cleanUrl.split('youtube.com/shorts/');
        if (parts[1]) {
          videoId = parts[1].split('?')[0].split('&')[0];
        }
      } else if (cleanUrl.includes('youtu.be/')) {
        const parts = cleanUrl.split('youtu.be/');
        if (parts[1]) {
          videoId = parts[1].split('?')[0].split('&')[0];
        }
      } else if (cleanUrl.includes('youtube.com/watch')) {
        const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : 'https://' + cleanUrl);
        videoId = urlObj.searchParams.get('v') || '';
      } else if (cleanUrl.includes('youtube.com/v/')) {
        const parts = cleanUrl.split('youtube.com/v/');
        if (parts[1]) {
          videoId = parts[1].split('?')[0].split('&')[0];
        }
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}${isShorts ? '?shorts=1' : ''}`;
      }
    } catch (e) {
      console.error("Error parsing YouTube URL:", e);
    }

    return cleanUrl;
  };

  const compressImage = (file: File, isGallery = false): Promise<string> => {
    return new Promise((resolve) => {
      const fileSizeKb = file.size / 1024;
      
      // Настройки сжатия в зависимости от веса файла и его назначения
      let maxWidth = 1920;
      let maxHeight = 1920;
      let quality = 0.88;

      if (isGallery) {
        if (fileSizeKb < 150) {
          // Легкие фотографии практически не трогаем (сохраняем идеальное качество)
          maxWidth = 2000;
          maxHeight = 2000;
          quality = 0.95;
        } else if (fileSizeKb < 600) {
          // Мягкая оптимизация для веба
          maxWidth = 1400;
          maxHeight = 1400;
          quality = 0.86;
        } else if (fileSizeKb < 2000) {
          // Средняя оптимизация
          maxWidth = 1200;
          maxHeight = 1200;
          quality = 0.82;
        } else {
          // Бережное сжатие для очень тяжелых оригинальных снимков
          maxWidth = 1000;
          maxHeight = 1000;
          quality = 0.78;
        }
      } else {
        // Главное баннерное фото (всегда остается кинематографически четким)
        if (fileSizeKb < 400) {
          maxWidth = 2400;
          maxHeight = 2400;
          quality = 0.95;
        } else if (fileSizeKb < 1500) {
          maxWidth = 1920;
          maxHeight = 1920;
          quality = 0.88;
        } else {
          maxWidth = 1600;
          maxHeight = 1600;
          quality = 0.82;
        }
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Сжатие в jpeg с динамическим качеством
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp') {
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, false);
        setNewProject(prev => ({ ...prev, image: compressedBase64 }));
      } catch (err) {
        console.error("Error compressing image:", err);
        // Fallback to original
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProject(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentCount = newProject.gallery?.length || 0;
      const allowedCount = 20 - currentCount;
      if (allowedCount <= 0) {
        setAddProjectError("Достигнут лимит в 20 фотографий для галереи. Это необходимо для мгновенной загрузки и безотказной работы сайта.");
        return;
      }

      let filesToUpload = Array.from(files);
      if (filesToUpload.length > allowedCount) {
        setAddProjectError(`Можно добавить еще не более ${allowedCount} фото. Остальные файлы были автоматически пропущены.`);
        filesToUpload = filesToUpload.slice(0, allowedCount);
      }

      try {
        const promises = filesToUpload.map(file => compressImage(file, true));
        const results = await Promise.all(promises);
        setNewProject(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...results] }));
      } catch (err) {
        console.error("Error compressing gallery images:", err);
        // Fallback but sliced to fit limits
        const readers = filesToUpload.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readers).then(results => {
          setNewProject(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...results] }));
        });
      }
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddProjectError(null);
    setIsPublishing(true);

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const displayDate = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

    const targetId = editingProjectId ? String(editingProjectId) : String(Date.now());
    
    // Maintain existing dates if we are editing
    const existingDate = editingProjectId 
      ? (news.find(n => n.id === editingProjectId || String(n.id) === String(editingProjectId))?.date || dateStr)
      : dateStr;
    const existingDisplayDate = editingProjectId 
      ? (news.find(n => n.id === editingProjectId || String(n.id) === String(editingProjectId))?.displayDate || displayDate)
      : displayDate;

    const newItem = {
      title: newProject.title,
      category: newProject.category,
      excerpt: newProject.excerpt,
      content: newProject.content,
      image: newProject.image,
      videoUrl: getYoutubeEmbedUrl(newProject.videoUrl),
      id: editingProjectId ? (Number(editingProjectId) || editingProjectId) : Number(targetId),
      date: existingDate,
      displayDate: existingDisplayDate,
      gallery: [] // Keep empty in main document to bypass the 1MB limit entirely
    };

    const projectsPath = 'projects';
    try {
      // 1. Save main document
      await setDoc(doc(db, projectsPath, targetId), newItem);

      // 2. Save each gallery photo in the subcollection "galleryPhotos"
      const galleryColRef = collection(db, projectsPath, targetId, 'galleryPhotos');
      const uploadPromises = newProject.gallery.map((base64, idx) => {
        return setDoc(doc(galleryColRef, String(idx)), {
          image: base64,
          index: idx
        });
      });
      
      // Delete any higher index photos from previous edits if gallery size shrunk
      const deletePromises = [];
      for (let i = newProject.gallery.length; i < 20; i++) {
        deletePromises.push(deleteDoc(doc(galleryColRef, String(i))));
      }

      await Promise.all([...uploadPromises, ...deletePromises]);

      setIsAddProjectOpen(false);
      setEditingProjectId(null);
      setNewProject({
        title: '',
        category: 'Новости',
        excerpt: '',
        content: '',
        image: '',
        gallery: [] as string[],
        videoUrl: ''
      });
    } catch (error: any) {
      console.error("Firestore save error:", error);
      const isPermissionErr = error.message?.toLowerCase().includes('permission') || 
                              error.code === 'permission-denied';
      if (isPermissionErr) {
        setAddProjectError(
          'Ошибка доступа: У вашей учетной записи недостаточно прав для изменения данных в Firestore. Пожалуйста, убедитесь, что в Firebase Console во вкладке Firestore -> Rules закреплены корректные правила доступа.'
        );
      } else {
        setAddProjectError(`Ошибка сохранения: ${error.message || error}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const [activeHelpTab, setActiveHelpTab] = useState('individuals');
  const [activeMainSection, setActiveMainSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  useEffect(() => {
    if (!selectedNews) {
      setCurrentGallery([]);
      return;
    }

    // Совместимость со старыми записями
    if (selectedNews.gallery && selectedNews.gallery.length > 0) {
      setCurrentGallery(selectedNews.gallery);
    } else {
      setCurrentGallery([]);
    }

    setLoadingGallery(true);
    const projectsPath = 'projects';
    const galleryColRef = collection(db, projectsPath, String(selectedNews.id), 'galleryPhotos');
    
    const unsubscribe = onSnapshot(galleryColRef, (snapshot) => {
      if (!snapshot.empty) {
        const photos = snapshot.docs
          .map(doc => doc.data() as { image: string; index: number })
          .sort((a, b) => a.index - b.index)
          .map(data => data.image);
        
        setCurrentGallery(photos);
      }
      setLoadingGallery(false);
    }, (error) => {
      console.error("Error loading gallery subcollection:", error);
      setLoadingGallery(false);
    });

    return () => unsubscribe();
  }, [selectedNews]);

  useEffect(() => {
    if (!selectedNews) return;
    
    const allImages = [selectedNews.image, ...currentGallery].filter((url): url is string => typeof url === 'string' && url !== '');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex(null);
        } else {
          setSelectedNews(null);
        }
      } else if (lightboxImageIndex !== null && allImages.length > 0) {
        if (e.key === 'ArrowLeft') {
          setLightboxImageIndex((prev) => (prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0));
        } else if (e.key === 'ArrowRight') {
          setLightboxImageIndex((prev) => (prev !== null ? (prev + 1) % allImages.length : 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImageIndex, selectedNews, currentGallery]);

  const [isOwlOpen, setIsOwlOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIcon, setCurrentIcon] = useState('owl');

  const [copiedFooterIban, setCopiedFooterIban] = useState(false);
  const [copiedFooterBik, setCopiedFooterBik] = useState(false);
  const [copiedFooterUssd, setCopiedFooterUssd] = useState(false);
  const [copiedFooterSms, setCopiedFooterSms] = useState(false);
  const [copiedHeaderUssd, setCopiedHeaderUssd] = useState(false);
  const [copiedHeaderSms, setCopiedHeaderSms] = useState(false);

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', topic: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'validation_error'>('idle');
  const [validationError, setValidationError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.phone.trim() && !formData.email.trim()) {
      setValidationError('Укажите телефон или почту для связи');
      return false;
    }

    if (formData.phone.trim()) {
      // Mask: +375 (99) 999-99-99
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 12) { // 375 + 9 digits
        setValidationError('Введите корректный номер телефона (+375 XX XXX-XX-XX)');
        return false;
      }
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setValidationError('Введите корректный адрес электронной почты');
        return false;
      }
    }

    setValidationError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus('validation_error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', phone: '', email: '', topic: '' });
        setTimeout(() => {
          setIsOwlOpen(false);
          setSubmitStatus('idle');
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setValidationError(errorData.error || `Ошибка сервера: ${response.status}`);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setValidationError(error instanceof Error ? error.message : String(error));
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev === 'owl' ? 'message' : 'owl'));
    }, 3500); // Cycle every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  const helpTabs = [
    {
      id: 'sponsors',
      title: 'Спонсорам',
      fullTitle: 'Стать спонсором',
      icon: <Star size={24} fill="currentColor" />,
      color: 'amber',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-700',
      iconColor: 'text-amber-600',
      desc: 'Вы можете поддержать наш проект как компания или частное лицо, став официальным партнёром фонда. Помогите проекту финансово, передайте необходимые товары (технику, мебель, развивающие материалы, средства гигиены) или окажите профессиональные услуги — медицинские, юридические, психологические или консультационные.',
      cta: 'Скачать договор безвозмездной помощи и приложения',
      ctaIcon: <Download size={16} />
    },
    {
      id: 'individuals',
      title: 'Частным лицам',
      fullTitle: 'Помощь от физлиц',
      icon: <Heart size={24} fill="currentColor" />,
      color: 'purple',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700',
      iconColor: 'text-purple-600',
      desc: 'Разовые пожертвования или оформление ежемесячной подписки.',
      cta: 'Пожертвовать',
      ctaIcon: <Heart size={16} />
    },
    {
      id: 'volunteers',
      title: 'Волонтерам',
      fullTitle: 'Волонтерство',
      icon: <Users size={24} />,
      color: 'emerald',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-700',
      iconColor: 'text-emerald-600',
      desc: 'Станьте частью нашей команды и помогайте делом или знаниями.',
      cta: 'Заполнить анкету',
      ctaIcon: <ArrowRight size={16} />
    }
  ];

  const activeTab = helpTabs.find(t => t.id === activeHelpTab) || helpTabs[1];

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-purple-100 selection:text-purple-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 h-auto py-2.5 md:h-20 md:py-0 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 mr-2">  
            <div 
              className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform active:scale-95 shrink-0"
              onClick={() => !isAdmin && setIsLoginOpen(true)}
            >
              <OrganizationLogo />
            </div>
            
            {/* Главный контейнер */}
            <div className="flex flex-col items-stretch w-full min-[555px]:flex-row min-[520px]:items-center gap-1">

              <div className="flex flex-row items-center gap-1">

                {/* USSD Кнопка */}
                <a
                  href="tel:*222*75%23"
                  onClick={() => {
                    navigator.clipboard.writeText('*222*75#');
                    setCopiedHeaderUssd(true);
                    setTimeout(() => setCopiedHeaderUssd(false), 2000);
                  }}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 hover:scale-[1.01] active:scale-95 px-2 py-1 rounded-full flex items-center justify-center font-semibold transition-all select-all text-center flex-1 min-[520px]:flex-initial"
                  title="Наберите USSD-запрос или нажмите, чтобы скопировать"
                >
                  <span
                    className={`text-lg md:text-xl font-headline font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      copiedHeaderUssd
                        ? 'text-emerald-600 font-bold'
                        : 'tracking-widest'
                    }`}
                  >
                    {copiedHeaderUssd ? (
                      'Скопировано'
                    ) : (
                      <>
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <img src="/a1.webp" alt="A1" className="w-[110%] h-[110%] object-cover object-center max-w-none shrink-0" referrerPolicy="no-referrer" />
                        </div>
                        <span>*222*75#</span>
                      </>
                    )}
                  </span>
                </a>

                {/* SMS Кнопка */}
                <a
                  href="sms:2275"
                  onClick={() => {
                    navigator.clipboard.writeText('2275');
                    setCopiedHeaderSms(true);
                    setTimeout(() => setCopiedHeaderSms(false), 2000);
                  }}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-800 hover:scale-[1.01] active:scale-95 px-2 py-1 rounded-full flex items-center justify-center font-semibold transition-all select-all text-center flex-1 min-[520px]:flex-initial"
                  title="Отправьте SMS или нажмите, чтобы скопировать"
                >
                  <span
                    className={`text-lg md:text-xl font-headline font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      copiedHeaderSms
                        ? 'text-emerald-600 font-bold'
                        : 'tracking-widest'
                    }`}
                  >
                    {copiedHeaderSms ? (
                      'Скопировано'
                    ) : (
                      <>
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                          <img src="/a1.webp" alt="A1" className="w-[110%] h-[110%] object-cover object-center max-w-none shrink-0" referrerPolicy="no-referrer" />
                        </div>
                        <span>2275</span>
                      </>
                    )}
                  </span>
                </a>
              </div>

              {/* Кнопка "Поддержать фонд" */}
              <a
                href="https://pay.raschet.by/#00020132360010by.raschet0107154342410011120211520458125303933540115802BY5913UNC_4913389876007Belarus630444D0"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E67E22] hover:bg-[#D35400] text-white hover:scale-[1.01] active:scale-95 px-3 py-2 min-[520px]:py-1.5 rounded-full flex items-center justify-center font-bold transition-all shadow-sm shadow-orange-100 w-full min-[555px]:w-auto shrink-0 cursor-pointer text-center"
              >
                <span className="text-sm md:text-base font-headline font-bold uppercase tracking-wider">
                  Поддержать фонд
                </span>
              </a>


            </div>
          </div>
  
            {/* Навигационные ссылки (скрыты на мобильных) */}
            <nav className="hidden min-[1195px]:flex items-center gap-6">
              {[
                { name: 'Наш фонд', id: 'home' },
                { name: 'Проекты', id: 'projects' },
                { name: 'Хочу помочь', id: 'help' },
                { name: 'Получить помощь', id: 'get_help' }
              ].map((item) => (
                <button 
                  key={item.id} 
                  aria-current={activeMainSection === item.id ? 'page' : undefined}
                  aria-label={`Открыть раздел: ${item.name}`}
                  onClick={() => {
                    setActiveMainSection(item.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`text-[15px] font-bold uppercase tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-lg px-2 py-1 ${activeMainSection === item.id ? 'text-purple-600' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              aria-label="Открыть мобильное меню"
              className="min-[1195px]:hidden text-slate-900 p-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm min-[1120px]:flex"
            />
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              role="dialog"
              aria-modal="true"
              aria-label="Мобильное меню навигации"
              className="fixed top-0 left-0 right-0 z-[130] bg-white shadow-2xl rounded-b-[2rem] border-b border-slate-100 min-[1120px]:flex p-6 pt-20"
            >
              <div className="absolute top-4 right-6 flex items-center justify-end">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Закрыть мобильное меню"
                  className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {[
                  { name: 'Наш фонд', id: 'home' },
                  { name: 'Проекты', id: 'projects' },
                  { name: 'Хочу помочь', id: 'help' },
                  { name: 'Получить помощь', id: 'get_help' }
                ].map((item) => (
                  <button 
                    key={item.id} 
                    aria-current={activeMainSection === item.id ? 'page' : undefined}
                    aria-label={`Открыть раздел: ${item.name}`}
                    onClick={() => {
                      setActiveMainSection(item.id);
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`text-left py-3.5 px-4 rounded-2xl font-headline font-black text-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${activeMainSection === item.id ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {activeMainSection === 'home' ? (
          <>
            {/* Hero Section */}
            <section className="relative pt-8 pb-20 overflow-hidden">
              {/* Иллюстрация "Мама" в роли фонового/сопроводительного элемента */}
              <div className="absolute right-0 -translate-y-1/2 top-[90px] xs:top-[25px] sm:top-[70px] md:top-[80px] lg:top-[40%] lg:bottom-auto w-[180px] xs:w-[220px] sm:w-[290px] md:w-[370px] lg:w-[580px] xl:w-[680px] h-[240px] xs:h-[300px] sm:h-[400px] md:h-[500px] lg:h-[82%] xl:h-[88%] pointer-events-none z-0 select-none overflow-visible">
                <img 
                  src="/header.png" 
                  alt="Мы как все иллюстрация" 
                  className="w-full h-full object-contain object-bottom lg:object-right transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Blobs */}
              <div className="blob w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500 top-0 -left-20 opacity-40" />
              <div className="blob w-40 h-40 sm:w-20 sm:h-20 md:w-80 md:h-80 bg-yellow-400 bottom-0 right-0 opacity-30" />
              <div className="blob w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-pink-400 top-1/2 -right-10 opacity-20" />
              

              {/* Летающие лепестки и частицы, связывающие иллюстрацию с текстом */}
              <HeroFlowerParticles />

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Centered Badge */}
                <div className="flex justify-center mb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-6 py-2 bg-white/95 backdrop-blur-sm rounded-full text-2xl md:text-4xl font-black uppercase tracking-widest text-purple-600 shadow-md border border-purple-100/95 relative z-10 whitespace-nowrap"
                  >
                    Мы как все
                  </motion.div>
                </div>

                <div className="grid lg:grid-cols-12 gap-16 items-center">
                  {/* Текстовый блок занимает сбалансированные 8 колонок для создания свободного пространства справа */}
                  <div className="lg:col-span-8 relative z-10 flex flex-col items-start text-left">
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 0.99, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-[34px] xs:text-[42px] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-headline font-extrabold text-slate-900 leading-[1.0] xs:leading-[0.95] tracking-tighter mb-8 w-full"
                    >
                      Свободное <br className="xs:hidden" />пространство <br />
                      <span className="text-purple-600 inline-block font-headline font-extrabold">для добрых дел</span>
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="hidden sm:block text-base sm:text-lg md:text-xl text-slate-500 sm:max-w-[540px] md:max-w-[660px] lg:max-w-[820px] leading-relaxed mb-10"
                    >
                      Помогаем семьям с детьми с особенностями развития обрести уверенность в завтрашнем дне через системную поддержку и заботу.
                    </motion.p>
                    
                    <div className="flex flex-row flex-nowrap justify-start gap-2.5 sm:gap-4 w-full">
                      <button 
                        onClick={() => {
                          setActiveMainSection('help');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-3 sm:px-8 sm:py-4 bg-purple-600 text-white rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold hover:bg-purple-700 transition-all shadow-xl shadow-purple-200 flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap cursor-pointer"
                      >
                        Хочу помочь <ArrowRight size={14} className="sm:w-[18px] sm:h-[18px]" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveMainSection('get_help');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-4 py-3 sm:px-8 sm:py-4 bg-white border border-slate-200 text-slate-900 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold hover:bg-slate-50 transition-all shrink-0 whitespace-nowrap cursor-pointer"
                      >
                        Мне нужна помощь
                      </button>
                    </div>
                  </div>
                  
                  {/* Пустая правая колонка сетки, в которой позиционируется графика */}
                  <div className="lg:col-span-4 hidden lg:block" />
                </div>
              </div>
            </section>

           {/* Sponsors */}
           {(() => {
            const marqueeItems = getMarqueeItems(activePartners);
            return (
              <section className="pt-7 pb-6 border-y border-slate-100 bg-white relative overflow-visible">
              {/* Радиальный белый градиент за кроликом */}
              <div className="absolute top-0 left-0 w-48 sm:w-64 h-24 bg-[radial-gradient(circle_at_top_left,_white_60%,_transparent_100%)] z-10 pointer-events-none" />

                <Hare className="absolute -top-14 left-4 sm:left-12 w-24 sm:w-28 md:w-32 z-20 -rotate-6 pointer-events-none" />
                
                {/* Карусель приподнята на "-mt-4" для перекрытия с кроликом и градиентом */}
                <div className="w-full relative overflow-hidden -mt-4">
                  {/* Левая маска угасания расширена (w-1/4 sm:w-1/3), чтобы логотипы гармонично растворялись под кроликом */}
                      <div className="flex w-full overflow-hidden">
                      <div className="flex gap-8 py-2 animate-marquee whitespace-nowrap shrink-0">
                        {/* Первая копия */}
                        {marqueeItems.map((num, idx) => (
                          <PartnerSlot key={`partner-a-${num}-${idx}`} num={num} />
                        ))}
                        {/* Вторая копия */}
                        {marqueeItems.map((num, idx) => (
                          <PartnerSlot key={`partner-b-${num}-${idx}`} num={num} />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Community Events - Bento Grid with Central Title */}
            {(() => {
              const fallbackBentoItems = [
                { id: 'fallback', title: "Встреча недели", image: "/gallery/event-1.jpg" },
                { id: 'fallback', title: "Мастер-класс по рисованию", image: "/gallery/event-2.jpg" },
                { id: 'fallback', title: "Летний лагерь", image: "/gallery/event-3.jpg" },
                { id: 'fallback', title: "Кинопоказ", image: "/gallery/event-4.jpg" },
                { id: 'fallback', title: "Семейный пикник", image: "/gallery/event-5.jpg" }
              ];

              const getBentoItem = (index: number) => {
                if (news && news.length > index) {
                  return news[index];
                }
                return fallbackBentoItems[index];
              };

              const handleBentoClick = (item: any) => {
                if (item && item.id !== 'fallback') {
                  setSelectedNews(item);
                }
                setActiveMainSection('projects');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              };

              const item0 = getBentoItem(0);
              const item1 = getBentoItem(1);
              const item2 = getBentoItem(2);
              const item3 = getBentoItem(3);
              const item4 = getBentoItem(4);

              return (
                <section className="py-0 relative overflow-hidden bg-slate-50/50">
                  <div className="blob w-[600px] h-[600px] bg-purple-50/50 -top-48 -left-48 opacity-40" />
                  <div className="blob w-[400px] h-[400px] bg-amber-100/40 -bottom-24 -right-24 opacity-50" />
                  
                  <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Asymmetrical Bento Grid based on scheme */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[180px] md:auto-rows-[220px]">
                      
                      {/* Row 1: Small + Wide */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleBentoClick(item0)}
                        className="md:col-span-4 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                      >
                        <div className="h-full flex flex-col">
                          <div className="h-[85%] overflow-hidden">
                            <GalleryImage src={item0.image} alt={item0.title} />
                          </div>
                          <div className="h-[15%] flex items-center px-4 bg-white">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-wider line-clamp-1">{item0.title}</h3>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleBentoClick(item1)}
                        className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                      >
                        <div className="h-full flex flex-col">
                          <div className="h-[85%] overflow-hidden">
                            <GalleryImage src={item1.image} alt={item1.title} />
                          </div>
                          <div className="h-[15%] flex items-center px-4 bg-white">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-wider line-clamp-1">{item1.title}</h3>
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 2: Tall + Title (Center) + Square */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleBentoClick(item2)}
                        className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                      >
                        <div className="h-full flex flex-col">
                          <div className="h-[90%] overflow-hidden">
                            <GalleryImage src={item2.image} alt={item2.title} />
                          </div>
                          <div className="h-[10%] flex items-center px-4 bg-white">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-wider line-clamp-1">{item2.title}</h3>
                          </div>
                        </div>
                      </motion.div>

                      {/* CENTRAL PURPLE BLOCK - Title Block (Centered) */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onClick={() => {
                          setActiveMainSection('projects');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="md:col-span-4 md:row-span-1 bg-purple-600 rounded-3xl flex flex-col items-center justify-center p-6 text-center shadow-xl z-20 relative overflow-hidden cursor-pointer order-first md:order-none"
                      >
                        <div className="relative z-10">
                          <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-white mb-4 tracking-tighter leading-tight">События фонда</h2>
                          <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-white/30" />
                            <Heart size={16} className="text-white fill-current" />
                            <div className="h-px w-8 bg-white/30" />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onClick={() => handleBentoClick(item3)}
                        className="md:col-span-4 md:row-span-1 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                      >
                        <div className="h-full flex flex-col">
                          <div className="h-[85%] overflow-hidden">
                            <GalleryImage src={item3.image} alt={item3.title} />
                          </div>
                          <div className="h-[15%] flex items-center px-4 bg-white">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-wider line-clamp-1">{item3.title}</h3>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleBentoClick(item4)}
                        className="md:col-span-8 md:row-span-1 group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                      >
                        <div className="h-full flex flex-col">
                          <div className="h-[85%] overflow-hidden">
                            <GalleryImage src={item4.image} alt={item4.title} />
                          </div>
                          <div className="h-[15%] flex items-center px-4 bg-white">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-wider line-clamp-1">{item4.title}</h3>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Heart Divider Strip */}
            <div className="flex justify-center gap-6 py-6 overflow-hidden whitespace-nowrap opacity-20 select-none bg-purple-50/30">
              {[...Array(30)].map((_, i) => (
                <Heart key={i} size={18} className="text-purple-600 fill-current shrink-0 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>

            {/* Combined Help Section for seamless background (Questions) */}
            <div className="bg-slate-50/50 relative overflow-hidden">
              {/* Shared Background Blobs */}
              {/* Green gradient near financial support going down */}
              <div className="blob w-[400px] h-[800px] bg-emerald-400 top-[250px] -left-20 opacity-25 blur-[120px]" />
              
              {/* Purple-blue behind the bear */}
              <div className="blob w-96 h-96 bg-purple-500 -top-20 -right-20 opacity-30 blur-[100px]" />
              <div className="blob w-80 h-80 bg-blue-600 top-0 -right-10 opacity-20 blur-[80px]" />

              {/* Help Categories (Какую помощь можно получить?) */}
              <section className="pt-10 sm:pt-16 pb-12 relative">
                <WinniePooh className="absolute -top-2 right-4 sm:top-[34px] lg:top-10 sm:right-10 w-20 sm:w-32 opacity-10 sm:opacity-20 -rotate-12 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
                    <div>
                      <h2 className="text-3xl sm:text-4xl md:text-6xl font-headline font-extrabold text-slate-900 mb-5">Какую помощь можно получить?</h2>
                      <p className="text-slate-500 md:max-w-none">Мы поддерживаем семьи на каждом этапе, от юридических тонкостей до повседневных нужд.</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                      {/* Card 1 */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setActiveMainSection('projects');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative h-[160px] flex flex-col justify-center cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                            <Leaf size={20} />
                          </div>
                          <h3 className="text-lg font-headline font-bold text-slate-900 leading-tight flex items-center justify-between flex-1">
                            Финансовая поддержка
                            <ArrowUpRight size={24} className="text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">Помогаем семьям оплачивать лечение, реабилитацию и важные потребности ребёнка.</p>
                      </motion.div>

                      {/* Card 2 */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setActiveMainSection('projects');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative h-[160px] flex flex-col justify-center cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <CreditCard size={20} />
                          </div>
                          <h3 className="text-lg font-headline font-bold text-slate-900 leading-tight flex items-center justify-between flex-1">
                            Поддержка мам
                            <ArrowUpRight size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">Забота о мамах, воспитывающих детей с ОВЗ: оздоровительные программы, занятия спортом и помощь в восстановлении ресурсов.</p>
                      </motion.div>

                      {/* Card 3 */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setActiveMainSection('projects');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative flex flex-col justify-center h-[160px] cursor-pointer"
                      >
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                              <Users size={20} />
                            </div>
                            <h3 className="text-lg font-headline font-bold text-slate-900 leading-tight">Другая помощь</h3>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">Всё, что помогает сделать жизнь семьи легче и комфортнее.</p>
                        </div>

                        {/* Stickers clustered at the bottom with overlap and overflow */}
                        <div className="absolute -top-5 left-1 md:-left-12 z-40 rotate-[-15deg] scale-90 sm:scale-100 pointer-events-none">
                          <span className="px-5 py-2 bg-purple-500 text-white text-[11px] font-black uppercase tracking-tighter shadow-xl border-b-4 border-purple-600 block whitespace-nowrap">Услуги</span>
                        </div>
                        
                        <div className="absolute -bottom-4 left-1 md:-left-6 z-20 rotate-[-10deg] scale-90 sm:scale-100 pointer-events-none">
                          <span className="px-5 py-2 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-tighter shadow-xl border-b-4 border-emerald-600 block whitespace-nowrap">Продукты</span>
                        </div>
                        <div className="absolute -bottom-9 left-[22%] md:left-1/4 z-30 rotate-[6deg] scale-90 sm:scale-100 pointer-events-none">
                          <span className="px-5 py-2 bg-pink-500 text-white text-[11px] font-black uppercase tracking-tighter shadow-xl border-b-4 border-pink-600 block whitespace-nowrap">Одежда</span>
                        </div>
                        <div className="absolute -bottom-4 right-1 left-auto md:left-[55%] md:right-auto z-20 rotate-[-5deg] scale-90 sm:scale-100 pointer-events-none">
                          <span className="px-5 py-2 bg-blue-500 text-white text-[11px] font-black uppercase tracking-tighter shadow-xl border-b-4 border-blue-600 block whitespace-nowrap">Игрушки</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Help (Как можно получить помощь?) */}
              <section className="pt-0 sm:pt-4 pb-16 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="mb-0 flex items-center justify-end relative min-h-[96px] sm:min-h-[140px] md:min-h-[180px] lg:min-h-0">
                    <div className="absolute -left-4 xs:-left-6 sm:left-[-11px] md:left-[-3px] lg:-left-4 xl:left-0 top-1/2 -translate-y-[calc(50%+15px)] sm:-translate-y-1/2 z-50 pointer-events-none">
                      <Eeyore className="w-20 xs:w-24 sm:w-36 md:w-44 lg:w-48 xl:w-64 -rotate-12 opacity-70 hover:opacity-100 transition-opacity scale-x-[-1]" />
                    </div>
                    <div className="text-right relative z-30 w-full">
                      <h2 className="text-3xl sm:text-4xl md:text-6xl lg:-translate-y-[6px] font-headline font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
                        <span className="block whitespace-nowrap">Как можно</span>
                        <span className="block whitespace-nowrap">поддержать фонд?</span>
                      </h2>
                    </div>
                  </div>

                  <div className="max-w-4xl mx-auto w-full px-0">
                    {/* Documentation Style Tabs - Aligned Right, dynamic width on mobile */}
                    <div role="tablist" aria-label="Категории помощи" className="flex w-full items-end justify-between md:justify-end -mb-[2px] relative z-40 mt-2 sm:mt-4 lg:mt-10 gap-0 overflow-visible">
                      {helpTabs.map((tab) => (
                        <button
                          key={tab.id}
                          id={`help-tab-${tab.id}`}
                          role="tab"
                          aria-selected={activeHelpTab === tab.id}
                          aria-controls={`help-tabpanel-${tab.id}`}
                          onClick={() => setActiveHelpTab(tab.id)}
                          className={`flex-1 md:flex-initial px-2 sm:px-6 md:px-8 py-2.5 sm:py-4 font-headline font-black text-[10px] min-[360px]:text-xs sm:text-base md:text-lg transition-all duration-300 border rounded-t-[10px] min-[360px]:rounded-t-xl sm:rounded-t-2xl text-center flex justify-center items-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 cursor-pointer ${
                            activeHelpTab === tab.id 
                              ? `${tab.bg} ${tab.text} ${tab.border} border-b-transparent z-30 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]` 
                              : 'bg-slate-100/50 text-slate-400 border-transparent hover:bg-slate-100 z-10'
                          }`}
                        >
                          <div className="flex items-center gap-1 sm:gap-2.5 justify-center w-full">
                            {React.cloneElement(tab.icon as React.ReactElement, { size: 16, className: `hidden sm:block shrink-0 ${activeHelpTab === tab.id ? '' : 'opacity-30'}` } as any)}
                            <span className="whitespace-normal min-[360px]:whitespace-nowrap tracking-tight select-none">{tab.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Main Content Container with responsive paddings */}
                    <div className={`relative rounded-b-[2rem] rounded-tr-none rounded-tl-none md:rounded-tl-[2rem] border shadow-xl overflow-hidden transition-all duration-500 ${activeTab.bg} ${activeTab.border}`}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeHelpTab}
                          id={`help-tabpanel-${activeHelpTab}`}
                          role="tabpanel"
                          aria-labelledby={`help-tab-${activeHelpTab}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="pt-6 px-5 pb-5 md:pt-10 md:px-12 md:pb-6 flex flex-col md:flex-row items-center gap-8"
                        >
                          <div className="flex-1 space-y-4">
                            <h3 className="text-2xl md:text-3xl font-headline font-black text-slate-900 leading-tight">
                              {activeTab.fullTitle}
                            </h3>
                            
                            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-none md:max-w-4xl whitespace-pre-line">
                              {activeTab.desc}
                            </p>

                          <div className="pt-2">
                            {/* Кнопка только для Спонсоров */}
                            {activeHelpTab === 'sponsors' && (
                              <a 
                                href="/Договор_безвозд_помощи_и_приложение.pdf" 
                                download="Договор_безвозд_помощи_и_приложение.pdf"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-black text-sm md:text-base shadow-lg transition-all hover:scale-105 active:scale-95 text-center bg-amber-600 shadow-amber-100"
                              >
                                {activeTab.cta}
                                {activeTab.ctaIcon}
                              </a>
                            )}

                            {/* Кнопка только для Частных лиц */}
                            {activeHelpTab === 'individuals' && (
                              <a 
                                href="https://pay.raschet.by/#00020132360010by.raschet0107154342410011120211520458125303933540115802BY5913UNC_4913389876007Belarus630444D0" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-black text-sm md:text-base shadow-lg transition-all hover:scale-105 active:scale-95 text-center bg-purple-600 shadow-purple-100"
                              >
                                {activeTab.cta}
                                {activeTab.ctaIcon}
                              </a>
                            )}

                            {/* Кнопка только для Волонтеров */}
                            {activeHelpTab === 'volunteers' && (
                              <button 
                                onClick={() => setIsVolunteerModalOpen(true)}
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl text-white font-black text-sm md:text-base shadow-lg transition-all hover:scale-105 active:scale-95 bg-emerald-600 shadow-emerald-100 cursor-pointer"
                              >
                                {activeTab.cta}
                                {activeTab.ctaIcon}
                              </button>
                            )}
                          </div>
                          </div>

                          <div className="hidden md:block relative w-32 h-32 opacity-20">
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                              {activeHelpTab === 'sponsors' && <Star size={80} fill="currentColor" />}
                              {activeHelpTab === 'individuals' && <Heart size={80} fill="currentColor" />}
                              {activeHelpTab === 'volunteers' && <Users size={80} />}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Project Stats Section */}
            <section className="pt-6 pb-12 sm:py-12 bg-purple-50/80 relative overflow-hidden text-slate-900 border-t border-purple-100">
              <div className="blob w-96 h-96 bg-purple-200/40 top-0 -right-20 opacity-30" />
              <div className="blob w-64 h-64 bg-yellow-200/30 -bottom-10 -left-10 opacity-30" />
              
              <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-8 mb-0 sm:mb-10">
                  <div className="max-w-2xl lg:max-w-none">
                    <motion.h2 
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       className="font-headline font-extrabold leading-none tracking-tighter"
                    >
                      <span className="text-[28px] sm:text-[36px] md:text-[44px] block text-purple-900">Проект</span>
                      <span className="text-[30px] xs:text-[34px] sm:text-[44px] md:text-[56px] text-purple-600 block whitespace-nowrap">«Мы как все»</span>
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="mt-2 text-base md:text-lg text-slate-600 leading-relaxed lg:whitespace-nowrap"
                    >
                      Мы поддерживаем семьи, в которых растут дети с особенностями развития.
                    </motion.p>
                  </div>
                  <div className="shrink-0 font-bold">
                    <a 
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveMainSection('projects');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      href="#" 
                      className="inline-flex items-center gap-2 font-black text-purple-600 hover:text-purple-800 transition-colors text-base"
                    >
                      Подробнее <ArrowRight size={20} />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 xs:gap-2 sm:gap-4 md:gap-6">
                  {[
                    { val: '70+', label: 'Стольким семьям уже помогли' },
                    { val: '20+', label: 'Проектов реализовано' },
                    { val: '100+', label: 'Мероприятий проведено' }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl sm:rounded-[2rem] py-3.5 px-1.5 sm:p-6 text-center shadow-md sm:shadow-lg border border-purple-100/30 transform hover:-translate-y-1 transition-all group"
                    >
                      <div className="text-xl sm:text-3xl font-headline font-black text-orange-500 mb-1">{stat.val}</div>
                      <div className="text-purple-950 font-bold text-[9px] sm:text-xs md:text-sm leading-tight mb-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
    ) : activeMainSection === 'help' ? (
      <section className="py-12 bg-slate-50 min-h-screen relative overflow-hidden">
        {/* Sky blue ambient glow in the top-left corner */}
        <div className="absolute -top-32 -left-32 w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full bg-sky-400/25 blur-[90px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 grid md:grid-cols-12 gap-8 items-center"
          >
            <div className="md:col-span-7 space-y-4 text-center md:text-left pr-0 md:pr-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-black text-slate-900 tracking-tighter leading-none">
                Хочу помочь
              </h1>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto md:mx-0">
                Ваша поддержка помогает нам продолжать проект «Мы как все» и менять жизни детей и их родителей к лучшему.
              </p>
            </div>

            <div className="md:col-span-5 flex justify-center w-full">
              <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center w-full max-w-sm">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Оплата по QR-коду</span>
                
                {/*  SVG QR representation replaced with a beautiful placeholder */}
                <div className="relative bg-white p-4 rounded-2xl shadow-md border border-slate-200/40 w-52 h-52 flex items-center justify-center">
                  <img 
                    src="/qr-code.png" 
                    alt="QR Код для оплаты" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <a 
                  href="https://pay.raschet.by/#00020132360010by.raschet0107154342410011120211520458125303933540115802BY5913UNC_4913389876007Belarus630444D0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-5 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-xs h-11 flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <CreditCard size={15} />
                  <span>Оплата ЕРИП</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-stretch">
            {/* 1. ERIP Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-1 md:order-1 lg:order-1 col-span-1 md:col-span-2 lg:col-span-8 bg-white rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-100 shadow-xl relative overflow-hidden group flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Banknote size={160} />
              </div>
              
              <h2 className="text-3xl font-headline font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                  <CreditCard size={24} />
                </div>
                Система ЕРИП
              </h2>
              
              <div className="bg-purple-50 rounded-3xl p-5 sm:p-8 border border-purple-100 mb-8 flex-1">
                <h3 className="font-bold text-purple-900 mb-4 text-base sm:text-lg">Инструкция по оплате в системе «Расчёт» (ЕРИП):</h3>
                <div className="space-y-4 text-slate-700">
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-black shrink-0 shadow-sm border border-purple-100 text-sm mt-0.5">1</div>
                    <p className="text-sm sm:text-base text-slate-700 leading-normal pt-1">Выберите пункт «Благотворительность, общественные объединения»</p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-black shrink-0 shadow-sm border border-purple-100 text-sm mt-0.5">2</div>
                    <p className="text-sm sm:text-base text-slate-700 leading-normal pt-1">Выберите «Помощь детям, взрослым»</p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-black shrink-0 shadow-sm border border-purple-100 text-sm mt-0.5">3</div>
                    <p className="text-sm sm:text-base text-slate-700 leading-normal pt-1">Найдите «Свободное пространство»</p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-black shrink-0 shadow-sm border border-purple-100 text-sm mt-0.5">4</div>
                    <p className="text-sm sm:text-base text-slate-700 leading-normal pt-1">Выберите «Благотворительные взносы» → «Мы как все»</p>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4 text-left">
                    <div className="w-8 h-8 rounded-full bg-white text-purple-600 flex items-center justify-center font-black shrink-0 shadow-sm border border-purple-100 text-sm mt-0.5">5</div>
                    <p className="text-sm sm:text-base text-slate-700 leading-normal pt-1">Введите Ф.И.О. и сумму пожертвования</p>
                  </div>
                </div>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed italic">
                * Оплата осуществляется через банковские отделения, инфокиоски, банкоматы или приложения интернет-банкинга.
              </p>
            </motion.div>

            {/* 2. О нас Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="order-3 md:order-3 lg:order-2 col-span-1 md:col-span-1 lg:col-span-4 bg-white rounded-[2.5rem] p-5 sm:p-8 border border-slate-100 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                    <Info size={24} />
                  </div>
                  <h3 className="text-xl font-headline font-black text-slate-950">О нас</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <User className="text-slate-300 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Директор</p>
                      <p className="text-slate-900 font-bold text-sm">Алексеевич Наталья Викторовна</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <MapPin className="text-slate-300 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Адрес</p>
                      <p className="text-slate-900 font-bold text-sm leading-tight">246014, Гомель, ул. Дзержинского 11а</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Phone className="text-slate-300 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Телефоны</p>
                      <p className="text-slate-900 font-bold text-sm leading-tight">+375 44 756-66-05 (A1)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail className="text-slate-300 shrink-0" size={20} />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">E-mail</p>
                      <p className="text-slate-900 font-bold text-sm">mi.kak.vse.gomel@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. Bank Details Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-2 lg:order-3 col-span-1 md:col-span-2 lg:col-span-8 bg-white rounded-[2.5rem] p-5 sm:p-8 md:p-12 border border-slate-100 shadow-xl flex flex-col"
            >
              <h2 className="text-3xl font-headline font-black text-slate-900 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Banknote size={24} />
                </div>
                Банковский перевод
              </h2>

              <div className="grid md:grid-cols-2 gap-x-8 gap-y-8 mb-10">
                {/* Row 1 */}
                <div className="group">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Получатель</span>
                  <p className="text-slate-900 font-bold leading-tight">ЧСБУ «Свободное пространство»</p>
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Банк</span>
                  <p className="text-slate-900 font-bold leading-tight">ОАО «Технобанк», Региональное управление №3, г. Гомель</p>
                </div>

                {/* Row 2 */}
                <div className="group relative">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">УНП</span>
                  <div className="flex items-center gap-2">
                    <code className="text-slate-800 font-mono font-bold bg-slate-50 px-3 py-1 rounded-lg text-sm">
                      491338987
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('491338987');
                        alert('УНП скопирован в буфер обмена');
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Скопировать УНП"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                <div className="group relative">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">БИК (SWIFT)</span>
                  <div className="flex items-center gap-2">
                    <code className="text-slate-800 font-mono font-bold bg-slate-50 px-3 py-1 rounded-lg text-sm">
                      TECNBY22
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('TECNBY22');
                        alert('БИК скопирован в буфер обмена');
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Скопировать БИК"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="group relative max-w-full">
                  <span className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Благотворительный счет</span>
                  <div className="flex items-center gap-2">
                    <code className="text-emerald-600 font-mono font-bold bg-emerald-50 px-3 py-1 rounded-lg text-sm break-all">
                      BY69TECN31356413000000000010
                    </code>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('BY69TECN31356413000000000010');
                        alert('Счет скопирован в буфер обмена');
                      }}
                      className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                      title="Скопировать счет"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="block text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Назначение платежа</span>
                  <p className="text-slate-900 font-bold italic text-sm">«Оплата благотворительного вклада в проект «Мы как все»</p>
                </div>
              </div>

              <div className="p-4 sm:p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
                <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white p-3 rounded-2xl shadow-md border border-slate-100 shrink-0 flex items-center justify-center">
                  <img 
                    src="/qr-code.png" 
                    alt="Бортовой QR" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-headline font-black text-slate-900 mb-1 text-sm sm:text-base">Быстрая оплата по QR</h4>
                  <p className="text-slate-500 text-[11px] xs:text-xs leading-normal sm:leading-relaxed max-w-sm">
                    Откройте приложение вашего банка и отсканируйте код для автоматического заполнения реквизитов.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 4. Документы Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="order-4 md:order-4 lg:order-4 col-span-1 md:col-span-1 lg:col-span-4 bg-emerald-50 text-emerald-950 rounded-[2.5rem] p-5 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between border border-emerald-100/80"
            >
              <div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl" />
                <h3 className="text-xl font-headline font-black mb-6 relative z-10 text-emerald-900">Документы</h3>
                
                <div className="space-y-3 relative z-10">
                  <a 
                    href="/docs/ustav.docx" 
                    download="Устав.docx"
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-emerald-100/50 text-emerald-950 rounded-2xl shadow-sm transition-all border border-emerald-100 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-emerald-600" />
                      <span className="text-sm font-extrabold text-emerald-900">Устав учреждения</span>
                    </div>
                    <Download size={16} className="text-emerald-600 opacity-60 group-hover:opacity-100 transition-all" />
                  </a>
                  <a 
                    href="/docs/certificate.jpg" 
                    download="Сертификат.jpg"
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-emerald-100/50 text-emerald-950 rounded-2xl shadow-sm transition-all border border-emerald-100 group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-emerald-600" />
                      <span className="text-sm font-extrabold text-emerald-900">Свидетельство</span>
                    </div>
                    <Download size={16} className="text-emerald-600 opacity-60 group-hover:opacity-100 transition-all" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    ) : activeMainSection === 'projects' ? (
      <section className="pt-8 pb-16 sm:py-20 bg-white min-h-screen relative overflow-hidden">
        {/* Green-yellow glowing gradient in the top-left corner */}
        <div className="absolute -top-48 -left-48 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-emerald-400/45 via-emerald-300/30 to-yellow-300/45 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex flex-col sm:items-start xl:flex-row xl:items-center justify-between gap-4 xl:gap-8 mb-8 xl:mb-12 pt-3 sm:pt-0">
              <h1 className="text-[36px] xs:text-[42px] sm:text-[52px] md:text-6xl xl:text-7xl font-headline font-black text-slate-900 tracking-tighter whitespace-nowrap leading-none pb-1 text-center sm:text-left w-full xl:w-auto">Наши проекты</h1>
              
              {isAdmin && (
                <div className="flex flex-row items-center justify-center sm:justify-start xl:justify-end gap-2 sm:gap-4 w-full xl:w-auto shrink-0 animate-fadeIn">
                  <button 
                    onClick={() => {
                      setEditingProjectId(null);
                      setNewProject({
                        title: '',
                        category: 'Новости',
                        excerpt: '',
                        content: '',
                        image: '',
                        gallery: [] as string[],
                        videoUrl: ''
                      });
                      setAddProjectError(null);
                      setIsAddProjectOpen(true);
                    }}
                    className="flex-1 xl:flex-initial flex items-center justify-center gap-1 sm:gap-3 px-3 py-2.5 sm:px-8 sm:py-4 bg-emerald-600 text-white rounded-2xl sm:rounded-3xl font-black text-xs sm:text-base shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                  >
                    <Plus size={16} /> Добавить новость
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-none flex items-center justify-center gap-1.5 sm:gap-3 px-4 py-2.5 sm:px-8 sm:py-4 bg-slate-100 text-slate-700 rounded-2xl sm:rounded-3xl font-black text-xs sm:text-base hover:bg-slate-200 transition-all hover:scale-105 cursor-pointer whitespace-nowrap"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
            
            {/* Search and Filters */}
            <div className="space-y-4 mb-12">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm font-bold">
                <div className="relative w-full sm:flex-1 md:max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text"
                    aria-label="Поиск по новостям и проектам"
                    placeholder="Поиск по новостям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/50 transition-all font-bold text-slate-900 text-base sm:text-lg"
                  />
                </div>
                
                {/* Categories Dropdown Filter - Right side of Search for all formats */}
                <div className="w-full sm:w-64 relative shrink-0">
                  <select 
                    value={activeCategory}
                    aria-label="Фильтр по категориям"
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-10 outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 focus-visible:ring-purple-500/50 font-black text-slate-700 text-base sm:text-lg appearance-none cursor-pointer"
                  >
                    {['Все', 'Новости', 'Мероприятия', 'Отчеты', 'Сборы'].map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Date and Sort Filters */}
              {/* Outer container: single row on lg (desktop), stacked on sm/md (tablet/mobile) */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-center lg:justify-between w-full bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100/50 shadow-sm">
                {/* Row 1/Left Side: Date Range Interval */}
                <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 w-full lg:w-auto text-center flex-wrap">
                  <div className="hidden sm:flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm md:text-base font-black uppercase tracking-widest shrink-0">
                    <Filter size={14} /> <span className="whitespace-nowrap">Промежуток:</span>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
                    <input 
                      type="date" 
                      value={startDate}
                      aria-label="С даты"
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs sm:text-base font-bold text-slate-700 outline-none focus:border-purple-500/30 focus-visible:ring-2 focus-visible:ring-purple-500 w-[115px] sm:w-[150px] shrink-0"
                    />
                    <span className="text-slate-300">—</span>
                    <input 
                      type="date" 
                      value={endDate}
                      aria-label="По дату"
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs sm:text-base font-bold text-slate-700 outline-none focus:border-purple-500/30 focus-visible:ring-2 focus-visible:ring-purple-500 w-[115px] sm:w-[150px] shrink-0"
                    />
                    {(startDate || endDate) && (
                      <button 
                        onClick={() => { setStartDate(''); setEndDate(''); }}
                        className="text-xs sm:text-base font-bold text-purple-600 hover:text-purple-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-550 shrink-0 whitespace-nowrap ml-1"
                      >
                        Сбросить
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 2/Right Side: Sort Order buttons group */}
                <div className="flex flex-row gap-2 w-full lg:w-auto justify-center">
                  <button 
                    onClick={() => setSortOrder('newest')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-base font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 whitespace-nowrap ${
                      sortOrder === 'newest' 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar size={14} /> Сначала новые
                  </button>
                  <button 
                    onClick={() => setSortOrder('oldest')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-6 py-2.5 rounded-xl text-xs sm:text-base font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 whitespace-nowrap ${
                      sortOrder === 'oldest' 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <Calendar size={14} /> Сначала старые
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* News Feed */}
          {news.length === 0 ? (
            <div className="text-center py-12 text-slate-500 font-bold text-lg">
              Публикаций нет
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news
                  .filter(item => {
                    const matchesCategory = activeCategory === 'Все' || item.category === activeCategory;
                    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                    
                    const itemDate = new Date(item.date).getTime();
                    const start = startDate ? new Date(startDate).getTime() : -Infinity;
                    const end = endDate ? new Date(endDate).getTime() : Infinity;
                    const matchesDate = itemDate >= start && itemDate <= end;

                    return matchesCategory && matchesSearch && matchesDate;
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                  })
                  .map((item, i) => (
                    <motion.article 
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setSelectedNews(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedNews(item);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Проект: ${item.title}. Категория: ${item.category}. Дата публикации: ${item.displayDate}. Нажмите Enter или Пробел для подробной информации.`}
                      className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 transition-all overflow-hidden flex flex-col h-full cursor-pointer"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-purple-600 shadow-sm border border-white">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                          <Calendar size={14} />
                          <span className="font-bold">{item.displayDate}</span>
                        </div>
                        <h3 className="text-xl font-headline font-black text-slate-900 mb-4 leading-tight group-hover:text-purple-600 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                          {item.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-2 text-purple-600 font-black text-sm uppercase tracking-wider group-hover:gap-4 transition-all">
                          Подробнее <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.article>
                  ))}
              </div>

              {news.filter(item => {
                const matchesCategory = activeCategory === 'Все' || item.category === activeCategory;
                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
                
                const itemDate = new Date(item.date).getTime();
                const start = startDate ? new Date(startDate).getTime() : -Infinity;
                const end = endDate ? new Date(endDate).getTime() : Infinity;
                const matchesDate = itemDate >= start && itemDate <= end;

                return matchesCategory && matchesSearch && matchesDate;
              }).length === 0 && (
                <div className="text-center py-20">
                  <div className="text-slate-300 mb-4 flex justify-center">
                    <Search size={64} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-headline font-bold text-slate-900 mb-2">Ничего не найдено</h3>
                  <p className="text-slate-500">Попробуйте изменить параметры поиска или фильтры</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    ) : activeMainSection === 'get_help' ? (
      <section className="py-12 bg-slate-50 min-h-screen relative overflow-hidden">
        {/* Soft, beautiful sunset-orange gradient with a light red edge - brighter but smaller diameter */}
        <div className="absolute -top-24 -left-24 w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] rounded-full bg-gradient-to-br from-red-500/25 via-orange-400/35 to-transparent blur-[50px] pointer-events-none z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 md:mb-12 text-center"
          >
            <h1 className="text-[32px] xs:text-[38px] sm:text-[48px] md:text-7xl font-headline font-black text-slate-900 mb-4 tracking-tighter">Получить помощь</h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto text-left sm:text-center leading-relaxed">
              Мы оказываем всестороннюю поддержку семьям, воспитывающим детей с особенностями развития. Заполните форму, и мы свяжемся с вами.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {/* Request Form */}
            <div className="lg:col-span-8 space-y-8 flex flex-col">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-lg flex-1"
              >
                <HelpRequestForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    ) : (
      <section className="py-20 text-center px-6">
        <h1 className="text-4xl font-headline font-black text-slate-900 mb-4">Страница в разработке</h1>
        <button 
          onClick={() => setActiveMainSection('home')}
          className="text-purple-600 font-bold hover:underline"
        >
          Вернуться на главную
        </button>
      </section>
    )}
  </main>

      <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-755 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-amber-100/10 rounded-full blur-2xl pointer-events-none" />

        {/* Large background Mother and Child logo serving as an elegant watermark background */}
        <div className="absolute right-0 bottom-0 w-[160px] h-[160px] xs:w-[195px] xs:h-[195px] sm:w-[240px] sm:h-[240px] md:w-[280px] md:h-[280px] lg:w-[315px] lg:h-[315px] text-purple-900 pointer-events-none z-0 translate-x-4 -translate-y-[45px] xs:-translate-y-[55px] sm:-translate-y-[65px] md:-translate-y-[70px] lg:-translate-y-[15px] select-none overflow-visible">
          <MotherChildIcon className="w-full h-full flex items-center justify-center" imgClassName="w-full h-full object-contain" />
        </div>  
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-sm">
            
            {/* Column 1: Institution details & Contacts */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-headline font-black text-slate-900 leading-tight">
                  ЧСБУ «Свободное пространство»
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-none w-full">
                  Частное социально-благотворительное учреждение
                </p>
              </div>
              
              <div className="text-xs text-slate-600 space-y-2 font-medium">
                <div>
                  <span className="text-slate-400 font-bold">Директор:</span>{' '}
                  <span className="text-slate-900 font-bold">Алексеевич Наталья Викторовна</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold">УНП:</span>{' '}
                  <span className="text-slate-900 font-bold select-all">491338987</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold shrink-0">Адрес:</span>{' '}
                  <span className="text-slate-700 font-bold leading-tight">
                    246014, Республика Беларусь, г. Гомель, ул. Дзержинского 11а
                  </span>
                </div>
              </div>

              {/* Contacts section moved directly under Address */}
              <div className="pt-3 border-t border-slate-100/60 max-w-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  Наши контакты
                </span>
                <div className="space-y-2 font-bold text-xs">
                  <a href="tel:+375447566605" className="flex items-center gap-2 text-slate-700 hover:text-purple-600 transition-colors">
                    <Phone size={14} className="text-purple-500 shrink-0" />
                    <span>+375 (44) 756-66-05 <span className="text-[10px] font-black text-purple-600 font-sans">А1</span></span>
                  </a>
                  <a href="mailto:mi.kak.vse.gomel@gmail.com" className="flex items-center gap-2 text-slate-700 hover:text-purple-600 transition-colors select-all">
                    <Mail size={14} className="text-purple-500 shrink-0" />
                    <span className="truncate">mi.kak.vse.gomel@gmail.com</span>
                  </a>
                  <a href="https://instagram.com/mi_kak_vse_gomel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-700 hover:text-purple-600 transition-colors">
                    <Instagram size={14} className="text-purple-500 shrink-0" />
                    <span>@mi_kak_vse_gomel</span>
                  </a>
                </div>
              </div>
            </div>
 
            {/* Column 2: Quick Help */}
            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                  Быстрая помощь А1
                </span>
                <div className="text-xs font-bold space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs font-medium">USSD-запрос:</span>
                    <div className="flex items-center gap-1">
                      <a
                        href="tel:*222*75%23"
                        onClick={() => {
                          navigator.clipboard.writeText('*222*75#');
                          setCopiedFooterUssd(true);
                          setTimeout(() => setCopiedFooterUssd(false), 2000);
                        }}
                        className="text-purple-700 bg-purple-55 hover:bg-purple-100/80 active:scale-95 px-1.5 py-0.5 rounded-lg select-all font-mono font-black text-xs whitespace-nowrap transition-all flex items-center gap-1 border border-purple-100/60"
                        title="Нажмите, чтобы набрать или скопировать"
                      >
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex-shrink-0 bg-white border border-purple-100/30 flex items-center justify-center">
                          <img src="/a1.webp" alt="A1" className="w-[110%] h-[110%] object-cover object-center max-w-none shrink-0" referrerPolicy="no-referrer" />
                        </div>
                        <span>*222*75#</span>
                        <Copy size={9} className="text-purple-400 shrink-0" />
                      </a>
                      {copiedFooterUssd && (
                        <span className="text-[9px] text-emerald-600 font-bold font-sans animate-pulse">
                          Скопировано!
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs font-medium">По SMS на:</span>
                    <div className="flex items-center gap-1">
                      <a
                        href="sms:2275"
                        onClick={() => {
                          navigator.clipboard.writeText('2275');
                          setCopiedFooterSms(true);
                          setTimeout(() => setCopiedFooterSms(false), 2000);
                        }}
                        className="text-purple-700 bg-purple-55 hover:bg-purple-100/80 active:scale-95 px-1.5 py-0.5 rounded-lg select-all font-mono font-black text-xs transition-all flex items-center gap-1 border border-purple-100/60"
                        title="Нажмите, чтобы отправить SMS или скопировать"
                      >
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex-shrink-0 bg-white border border-purple-100/30 flex items-center justify-center">
                          <img src="/a1.webp" alt="A1" className="w-[110%] h-[110%] object-cover object-center max-w-none shrink-0" referrerPolicy="no-referrer" />
                        </div>
                        <span>2275</span>
                        <Copy size={9} className="text-purple-400 shrink-0" />
                      </a>
                      {copiedFooterSms && (
                        <span className="text-[9px] text-emerald-600 font-bold font-sans animate-pulse">
                          Скопировано!
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright and Logos row (NO TOP LINE DIVIDER) */}
          <div className="mt-6 pt-2 flex flex-row items-center justify-between gap-2.5 sm:gap-5">
            
            {/* Copyright block with Logo aligned to its left */}
            <div className="flex-1 flex items-center gap-2.5 sm:gap-3 text-slate-400 text-[8px] xs:text-[10px] sm:text-xs font-bold leading-tight">
              {/* Logo inside a compact frame, to the left of the copyright */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white p-0.5 rounded-lg sm:rounded-xl shadow-sm border border-slate-100 hover:border-purple-200 transition-colors shrink-0">
                <OrganizationLogo />
              </div>
              <span>
                © {new Date().getFullYear()} Проект «Мы как все» / ЧСБУ «Свободное пространство». Все права защищены.
              </span>
            </div>

          </div>
        </div>
      </footer>

      {/* Detailed News View Modal */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="news-modal-title"
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setSelectedNews(null)}
                aria-label="Закрыть подробную информацию"
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:bg-white transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>

              <div className="overflow-y-auto w-full">
                <div 
                  className="relative h-64 md:h-96 cursor-pointer group/hero overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50"
                  role="button"
                  tabIndex={0}
                  aria-label="Просмотреть главное изображение во весь экран"
                  onClick={() => {
                    const allImages = [selectedNews.image, ...currentGallery].filter((url): url is string => typeof url === 'string' && url !== '');
                    if (allImages.length > 0) {
                      setLightboxImageIndex(0);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const allImages = [selectedNews.image, ...currentGallery].filter((url): url is string => typeof url === 'string' && url !== '');
                      if (allImages.length > 0) {
                        setLightboxImageIndex(0);
                      }
                    }
                  }}
                >
                  <img 
                    src={selectedNews.image} 
                    alt={selectedNews.title}
                    className="w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 z-10 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/hero:opacity-100 transition-opacity">
                    <Maximize2 size={16} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8 md:p-12">
                    <div className="mt-auto">
                      <span className="px-4 py-1.5 bg-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg mb-4 inline-block">
                        {selectedNews.category}
                      </span>
                      <h2 id="news-modal-title" className="text-3xl md:text-5xl font-headline font-black text-white leading-tight">
                        {selectedNews.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-8">
                    <Calendar size={18} />
                    <span className="font-bold">{selectedNews.displayDate}</span>
                  </div>

                  <div className="prose prose-slate max-w-none mb-12">
                    {selectedNews.content?.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-slate-600 text-lg leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Отображение асинхронно загруженной галереи */}
                  {loadingGallery ? (
                    <div className="mb-12 flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-3"></div>
                      <span className="text-sm font-bold text-slate-400">Мгновенная загрузка галереи...</span>
                    </div>
                  ) : (
                    currentGallery.length > 0 && (
                      <div className="mb-12">
                        <h4 className="text-xl font-headline font-black text-slate-900 mb-6 underline decoration-purple-500 decoration-4 underline-offset-4">Фотогалерея</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {currentGallery.map((img, idx) => {
                            const openGalleryImage = () => {
                              const allImages = [selectedNews.image, ...currentGallery].filter((url): url is string => typeof url === 'string' && url !== '');
                              const indexInAll = allImages.indexOf(img);
                              if (indexInAll !== -1) {
                                setLightboxImageIndex(indexInAll);
                              } else {
                                setLightboxImageIndex(idx + 1);
                              }
                            };
                            return (
                              <div 
                                key={idx} 
                                onClick={openGalleryImage}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openGalleryImage();
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                aria-label={`Просмотреть фотографию ${idx + 1}`}
                                className="aspect-square rounded-3xl overflow-hidden shadow-sm cursor-pointer group/gal relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-500/50"
                              >
                                <img src={img} alt={`Фото из галереи ${idx + 1}`} className="w-full h-full object-cover group-hover/gal:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 group-focus-visible/gal:bg-black/30 flex items-center justify-center transition-colors duration-300">
                                  <Maximize2 className="text-white opacity-0 group-hover/gal:opacity-100 group-focus-visible/gal:opacity-100 transition-opacity" size={20} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  )}

                  {selectedNews.videoUrl && (() => {
                    const embedUrl = getYoutubeEmbedUrl(selectedNews.videoUrl);
                    const isShort = embedUrl.includes('shorts=1') || selectedNews.videoUrl.includes('shorts/');
                    return (
                      <div className="mb-8">
                        <h4 className="text-xl font-headline font-black text-slate-900 mb-6 underline decoration-purple-500 decoration-4 underline-offset-4">
                          {isShort ? 'YouTube Shorts' : 'Видео'}
                        </h4>
                        <div className={`mx-auto rounded-[2.5rem] overflow-hidden shadow-xl bg-slate-900 ${
                          isShort 
                            ? 'aspect-[9/16] max-w-[340px] w-full' 
                            : 'aspect-video w-full'
                        }`}>
                          <iframe 
                            className="w-full h-full"
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    );
                  })()}

                  {isAdmin && (
                    <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:max-w-xl sm:ml-auto">
                      <button
                        onClick={async () => {
                          setEditingProjectId(selectedNews.id);
                          setNewProject({
                            title: selectedNews.title || '',
                            category: selectedNews.category || 'Новости',
                            excerpt: selectedNews.excerpt || '',
                            content: selectedNews.content || '',
                            image: selectedNews.image || '',
                            gallery: currentGallery, // Передаем подгруженную галерею для редактирования
                            videoUrl: selectedNews.videoUrl || ''
                          });
                          setSelectedNews(null);
                          setIsAddProjectOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl transition-all hover:scale-105 cursor-pointer w-full"
                      >
                        <Edit2 size={18} /> <span className="whitespace-nowrap">Редактировать новость</span>
                      </button>

                      <button
                        onClick={() => {
                          setDeleteError(null);
                          setIsDeleteConfirmOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all hover:scale-105 cursor-pointer w-full"
                      >
                        <Trash2 size={18} /> <span className="whitespace-nowrap">Удалить новость</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {lightboxImageIndex !== null && selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
            onClick={() => setLightboxImageIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxImageIndex(null);
              }}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full flex items-center justify-center transition-all group cursor-pointer"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform" />
            </button>

            {/* Main content container */}
            <div className="relative w-full max-w-5xl aspect-[3/2] flex items-center justify-center max-h-[75vh]" onClick={(e) => e.stopPropagation()}>
              {(() => {
                const allImages = [selectedNews.image, ...currentGallery].filter((url): url is string => typeof url === 'string' && url !== '');
                const currentImg = allImages[lightboxImageIndex] || selectedNews.image;

                const prevIndex = (lightboxImageIndex - 1 + allImages.length) % allImages.length;
                const nextIndex = (lightboxImageIndex + 1) % allImages.length;

                return (
                  <>
                    {/* Left arrow */}
                    {allImages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImageIndex(prevIndex);
                        }}
                        className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm cursor-pointer"
                        aria-label="Previous"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}

                    {/* Image frame */}
                    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                      <motion.img
                        key={lightboxImageIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        src={currentImg}
                        alt={`Photo view ${lightboxImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Right arrow */}
                    {allImages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImageIndex(nextIndex);
                        }}
                        className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm cursor-pointer"
                        aria-label="Next"
                      >
                        <ChevronRight size={24} />
                      </button>
                    )}

                    {/* Pagination Indicator / Description */}
                    <div className="absolute bottom-[-45px] sm:bottom-[-60px] left-1/2 -translate-x-1/2 text-center text-white/80 font-bold backdrop-blur-md bg-white/5 py-1.5 px-4 rounded-full border border-white/10 text-xs sm:text-sm whitespace-nowrap">
                      Фото {lightboxImageIndex + 1} из {allImages.length}
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Blur Overlay for widget */}
      <AnimatePresence>
        {isOwlOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOwlOpen(false)}
            className="fixed inset-0 bg-slate-900/5 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6 relative">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <Lock size={32} />
                </div>
                <h2 className="text-3xl font-headline font-black text-slate-900">Админ-панель</h2>
                <p className="text-slate-500 text-sm mt-1 font-bold">Управление проектами и новостями фонда</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 relative">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Электронная почта</label>
                  <input 
                    type="email"
                    required
                    disabled={isAuthLoading}
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all outline-none font-bold disabled:opacity-50"
                    placeholder="example@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Пароль</label>
                  <input 
                    type="password"
                    required
                    disabled={isAuthLoading}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all outline-none font-bold disabled:opacity-50"
                    placeholder="Пароль"
                  />
                </div>
                {loginError && <p className="text-rose-600 text-sm font-bold text-center leading-snug">{loginError}</p>}
                
                <button 
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all mt-4 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthLoading ? 'Загрузка...' : 'Войти'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Volunteer Registration Modal */}
      <AnimatePresence>
        {isVolunteerModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-emerald-50 border border-emerald-200 p-6 sm:p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <button 
                onClick={() => setIsVolunteerModalOpen(false)}
                className="absolute top-6 right-6 text-emerald-800/60 hover:text-emerald-900 transition-colors cursor-pointer z-10"
              >
                <X size={24} />
              </button>

              <div className="mb-6 relative text-left">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Heart size={28} className="text-emerald-600 animate-pulse fill-emerald-600 shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-headline font-black text-emerald-950">Анкета волонтёра</h2>
                </div>
                <p className="text-emerald-800/80 text-xs sm:text-sm font-bold pl-[38px]">Станьте частью нашей дружной команды</p>
              </div>

              <div className="relative max-h-[75vh] overflow-y-auto pr-1">
                <VolunteerForm onClose={() => setIsVolunteerModalOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteConfirmOpen && selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl w-full max-w-md border border-slate-100/80 text-center relative"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-headline font-black text-slate-900 mb-3">
                Удалить публикацию?
              </h3>
              <p className="text-slate-500 text-sm font-bold leading-relaxed mb-6">
                Вы действительно хотите навсегда удалить публикацию <span className="text-slate-800 font-extrabold font-headline">«{selectedNews.title}»</span>? Это действие необратимо.
              </p>

              {deleteError && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold leading-relaxed text-left">
                  {deleteError}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all cursor-pointer disabled:opacity-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={async () => {
                    setIsDeleting(true);
                    setDeleteError(null);
                    const projectsPath = 'projects';
                    try {
                      // Очищаем подколлекцию галереи (удаляем все 20 индексов)
                      const galleryColRef = collection(db, projectsPath, String(selectedNews.id), 'galleryPhotos');
                      const deletePromises = [];
                      for (let i = 0; i < 20; i++) {
                        deletePromises.push(deleteDoc(doc(galleryColRef, String(i))));
                      }
                      await Promise.all(deletePromises);

                      await deleteDoc(doc(db, projectsPath, String(selectedNews.id)));
                      setIsDeleteConfirmOpen(false);
                      setSelectedNews(null);
                    } catch (error: any) {
                      console.error("Deletion error:", error);
                      const isPermissionErr = error.message?.toLowerCase().includes('permission') || 
                                              error.code === 'permission-denied';
                      if (isPermissionErr) {
                        setDeleteError(
                          'Ошибка доступа: У вашей учетной записи недостаточно прав в Firestore. Пожалуйста, убедитесь, что в Firebase Console во вкладке Rules обновлены правила доступа.'
                        );
                      } else {
                        setDeleteError(`Ошибка удаления: ${error.message || error}`);
                      }
                    } finally {
                      setIsDeleting(false);
                    }
                  }}
                  className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all hover:scale-105 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? 'Удаление...' : 'Да, удалить'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddProjectOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-black text-slate-900">
                      {editingProjectId ? 'Редактировать публикацию' : 'Новая публикация'}
                    </h2>
                    <p className="text-slate-500 text-sm font-bold">
                      {editingProjectId ? 'Измените данные существующей записи' : 'Добавьте событие или новость для проекта «Мы как все»'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddProjectOpen(false)}
                  className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <form onSubmit={handleAddProject} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Тип публикации</label>
                      <div className="flex flex-wrap gap-2">
                        {['Новости', 'Мероприятия', 'Отчеты', 'Сборы'].map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewProject(prev => ({ ...prev, category: cat }))}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                              newProject.category === cat 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Заголовок</label>
                      <input 
                        type="text"
                        required
                        value={newProject.title}
                        onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 outline-none transition-all"
                        placeholder="Название мероприятия..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Краткое описание (для карточки)</label>
                      <textarea 
                        required
                        value={newProject.excerpt}
                        onChange={(e) => setNewProject(prev => ({ ...prev, excerpt: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 outline-none transition-all resize-none"
                        rows={3}
                        placeholder="Кратко о чем новость..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Полный текст статьи</label>
                      <textarea 
                        required
                        value={newProject.content}
                        onChange={(e) => setNewProject(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 outline-none transition-all resize-none"
                        rows={8}
                        placeholder="Расскажите подробности..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Главное фото (Афиша)</label>
                      <div className="relative group">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full aspect-video rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${
                          newProject.image ? 'border-purple-500 bg-purple-50' : 'border-slate-200 bg-slate-50 hover:border-purple-400'
                        }`}>
                          {newProject.image ? (
                            <img src={newProject.image} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Upload className="text-slate-300 mb-2" size={32} />
                              <p className="text-xs font-black text-slate-400">Нажмите для загрузки</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Фотогалерея</label>
                        <span className="text-xs font-black text-purple-600">
                          Загружено {newProject.gallery?.length || 0} из 20
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {newProject.gallery?.map((img, idx) => (
                          <div key={idx} className="aspect-square relative rounded-xl overflow-hidden group border border-slate-100 shadow-sm">
                            <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => {
                                setNewProject(prev => ({
                                  ...prev,
                                  gallery: prev.gallery.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-600 shadow-md cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        {(newProject.gallery?.length || 0) < 20 && (
                          <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-purple-600 transition-colors flex items-center justify-center relative cursor-pointer">
                            <input 
                              type="file" 
                              multiple
                              accept="image/*"
                              onChange={handleGalleryChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Plus className="text-slate-300 group-hover:text-purple-600 transition-colors" size={24} />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold leading-normal">
                        Рекомендуется добавлять до 20 фотографий.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2 ml-1">Ссылка на видео (YouTube embed)</label>
                      <input 
                        type="text"
                        value={newProject.videoUrl}
                        onChange={(e) => setNewProject(prev => ({ ...prev, videoUrl: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 font-bold focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 outline-none transition-all"
                        placeholder="https://www.youtube.com/embed/..."
                      />
                    </div>

                    <div className="pt-6">
                      {addProjectError && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-700 text-xs font-bold leading-relaxed mb-4">
                          {addProjectError}
                        </div>
                      )}
                      <button 
                        type="submit"
                        disabled={isPublishing}
                        className="w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] disabled:opacity-50 cursor-pointer"
                      >
                        {isPublishing ? 'Сохранение...' : editingProjectId ? 'Сохранить изменения' : 'Опубликовать'} <Check size={20} />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Owl Widget */}
      {/* Centered Modal for Mobile */}
      <AnimatePresence>
        {isOwlOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none md:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden relative pointer-events-auto"
            >
              {/* Background Glow inside widget */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full aspect-square bg-[radial-gradient(circle_at_50%_100%,#ea580c_0%,#fb923c_40%,#ffedd5_80%,transparent_100%)] blur-[60px] opacity-20" />
              </div>

              <div className="p-6 relative z-10">
                <button 
                  onClick={() => setIsOwlOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer z-20"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col">
                  {/* Header: Owl on the left, Title and subtitle on the right */}
                  <div className="flex items-center gap-3.5 mb-5 text-left pr-6">
                    <div className="shrink-0">
                      <Owl className="w-11 h-11 drop-shadow-md" />
                    </div>
                    <div>
                      <h2 className="text-base font-headline font-black text-slate-900 leading-tight">
                        Поможем решить вопросы
                      </h2>
                      <p className="text-slate-500 text-[11px] font-bold mt-0.5 leading-tight">
                        Наши волонтёры свяжутся с вами в ближайшее время.
                      </p>
                    </div>
                  </div>

                  <form noValidate onSubmit={handleSubmit} className="w-full space-y-3.5 text-left">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Имя" 
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
                    />
                    <IMaskInput
                      mask="+375 (00) 000-00-00"
                      value={formData.phone}
                      onAccept={(value: string) => setFormData(prev => ({ ...prev, phone: value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
                      placeholder="Телефон"
                      type="tel"
                      name="phone"
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email (необязательно)" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
                    />
                    <input 
                      type="text" 
                      name="topic"
                      placeholder="Тема обращения (необязательно)" 
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 transition-all outline-none"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.01, backgroundColor: "#d97706" }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full bg-amber-600 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-amber-600/30 mt-2 text-sm uppercase tracking-[0.15em] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </motion.button>
                    {submitStatus === 'success' && (
                      <p className="text-emerald-600 text-center text-xs font-bold mt-2">Сообщение отправлено!</p>
                    )}
                    {submitStatus === 'validation_error' && (
                      <p className="text-rose-600 text-center text-xs font-bold mt-2">{validationError}</p>
                    )}
                    {submitStatus === 'error' && (
                      <div className="text-rose-600 text-center text-xs font-bold mt-2">
                        <p>Ошибка при отправке. Попробуйте позже.</p>
                        {validationError && (
                          <p className="text-[10px] font-normal mt-1 opacity-80">{validationError}</p>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button and Desktop Popover */}
      <div className="fixed bottom-8 right-8 z-[180] flex items-end gap-6">
        <AnimatePresence>
          {isOwlOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="hidden md:block w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-orange-500/20 border border-orange-100 overflow-hidden relative"
            >
              {/* Background Glow inside widget */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full aspect-square bg-[radial-gradient(circle_at_50%_100%,#ea580c_0%,#fb923c_40%,#ffedd5_80%,transparent_100%)] blur-[60px] opacity-20" />
              </div>

              <div className="p-6 md:p-8 relative z-10">
                <button 
                  onClick={() => setIsOwlOpen(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors z-20"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col">
                  {/* Header: Owl on the left, Title and subtitle on the right */}
                  <div className="flex items-center gap-4 mb-6 text-left pr-6">
                    <div className="shrink-0">
                      <Owl className="w-14 h-14 drop-shadow-md" />
                    </div>
                    <div>
                      <h2 className="text-xl font-headline font-black text-slate-900 leading-tight">
                        Поможем решить вопросы
                      </h2>
                      <p className="text-slate-500 text-xs md:text-sm font-bold mt-1 leading-tight">
                        Наши волонтёры свяжутся с вами в ближайшее время.
                      </p>
                    </div>
                  </div>

                  <form noValidate onSubmit={handleSubmit} className="w-full space-y-4 text-left">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Имя" 
                      aria-label="Ваше имя"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 focus-visible:ring-amber-500/50 transition-all outline-none"
                    />
                    <IMaskInput
                      mask="+375 (00) 000-00-00"
                      value={formData.phone}
                      onAccept={(value: string) => setFormData(prev => ({ ...prev, phone: value }))}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 focus-visible:ring-amber-500/50 transition-all outline-none"
                      placeholder="Телефон"
                      aria-label="Ваш номер телефона"
                      type="tel"
                      name="phone"
                    />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Email (необязательно)" 
                      aria-label="Ваш электронный адрес"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 focus-visible:ring-amber-500/50 transition-all outline-none"
                    />
                    <input 
                      type="text" 
                      name="topic"
                      placeholder="Тема обращения (необязательно)" 
                      aria-label="Тема обращения"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500/40 focus-visible:ring-amber-500/50 transition-all outline-none"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.01, backgroundColor: "#d97706" }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isSubmitting}
                      aria-label={isSubmitting ? 'Отправка запроса...' : 'Отправить запрос волонтёру'}
                      className={`w-full bg-amber-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-600/30 mt-2 text-base uppercase tracking-[0.15em] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить'}
                    </motion.button>
                    {submitStatus === 'success' && (
                      <p className="text-emerald-600 text-center text-sm font-bold mt-2">Сообщение отправлено!</p>
                    )}
                    {submitStatus === 'validation_error' && (
                      <p className="text-rose-600 text-center text-sm font-bold mt-2">{validationError}</p>
                    )}
                    {submitStatus === 'error' && (
                      <div className="text-rose-600 text-center text-sm font-bold mt-2">
                        <p>Ошибка при отправке. Попробуйте позже.</p>
                        {validationError && (
                          <p className="text-xs font-normal mt-1 opacity-80">{validationError}</p>
                        )}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`relative group ${isOwlOpen ? 'hidden md:block' : 'block'}`}>
          <motion.button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOwlOpen(!isOwlOpen)}
            aria-expanded={isOwlOpen}
            aria-label={isOwlOpen ? "Закрыть окно помощника" : "Филин-помощник: задать вопрос волонтёру"}
            layout
            className={`h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/50 ${
              isOwlOpen ? 'w-16 bg-slate-900 text-white' : 'bg-amber-600 text-white hover:bg-amber-700 min-w-[64px]'
            }`}
          >
            <div className="flex items-center px-4 gap-3">
              {isOwlOpen ? (
                <X size={32} />
              ) : (
                <>
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <AnimatePresence mode="wait">
                      {currentIcon === 'owl' ? (
                        <motion.div
                          key="owl"
                          initial={{ scale: 0, opacity: 0, rotate: -45 }}
                          animate={{ scale: 1, opacity: 1, rotate: 0 }}
                          exit={{ scale: 0, opacity: 0, rotate: 45 }}
                        >
                          <Owl className="w-8 h-8" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="msg"
                          initial={{ scale: 0, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0, y: -10 }}
                        >
                          <MessageCircle size={28} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <AnimatePresence>
                    {(isHovered && !isOwlOpen) && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap font-black uppercase tracking-wider text-sm select-none overflow-hidden"
                      >
                        Задать вопрос
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
