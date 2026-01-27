# 🎯 StayinUBUD - Accessibility Audit & Fixes (Score 100)

## Executive Summary
Panduan lengkap untuk mencapai Lighthouse Accessibility Score 100 dengan memperbaiki issues WCAG 2.1 Level AA.

---

## 📊 Current Issues Found

### **Critical Issues (Must Fix)**

1. **Color Contrast Ratios**
   - ❌ Text dengan opacity < 0.8 pada backgrounds
   - ❌ Light text on light backgrounds
   - ✅ Target: WCAG AA 4.5:1 (normal text), 3:1 (large text)

2. **Missing Alt Attributes**
   - ❌ Decorative images tanpa alt=""
   - ❌ Informative images tanpa descriptive alt
   
3. **Keyboard Navigation**
   - ❌ Missing focus indicators
   - ❌ Tab order tidak logical
   - ❌ Trapped focus dalam modals

4. **ARIA Labels**
   - ❌ Icon-only buttons tanpa aria-label
   - ❌ Form inputs tanpa labels
   - ❌ Navigation landmarks tidak jelas

5. **Semantic HTML**
   - ❌ Div soup (should use semantic elements)
   - ❌ Missing heading hierarchy

---

## 🛠️ Detailed Fixes

### **1. Color Contrast Fixes**

#### **File: `app/globals.css`**
```css
/* BEFORE - Low Contrast */
::-webkit-scrollbar-track {
  background: #537F5D; 
}
::-webkit-scrollbar-thumb {
  background: #D3D49F; 
}

/* AFTER - High Contrast */
::-webkit-scrollbar-track {
  background: #243326; /* Darker forest */
}
::-webkit-scrollbar-thumb {
  background: #F4F1EA; /* Lighter sand */
}
::-webkit-scrollbar-thumb:hover {
  background: #FFFFFF; /* Pure white for hover */
}
```

#### **File: `tailwind.config.js`**
```javascript
// Add high-contrast color variants
module.exports = {
  theme: {
    extend: {
      colors: {
        sand: {
          DEFAULT: '#D3D49F',
          light: '#F4F1EA',      // HIGH CONTRAST - For text on dark
          dark: '#B8BA7F',       // For backgrounds
        },
        forest: {
          DEFAULT: '#537F5D',
          dark: '#243326',       // HIGH CONTRAST - For text on light
          light: '#709977',      // For hover states
        },
        // Ensure all text colors meet WCAG AA
        'text-primary': '#1A1A1A',     // Near black for body text
        'text-secondary': '#4A4A4A',   // Dark gray (still 7:1 contrast)
      }
    }
  }
}
```

---

### **2. Image Alt Text Fixes**

#### **File: `components/home/Hero.tsx`**
```tsx
// BEFORE
<OptimizedImage
  src={slide.src}
  alt={slide.alt}
  priority={index === 0}
/>

// AFTER
<OptimizedImage
  src={slide.src}
  alt={index === 0 
    ? "Luxury infinity pool villa overlooking Ubud jungle with traditional Balinese architecture"
    : `${slide.alt} - StayinUBUD luxury accommodation`
  }
  priority={index === 0}
  fetchPriority={index === 0 ? "high" : "auto"}
  role="img"
  aria-label={`Slide ${index + 1} of ${HERO_SLIDES.length}: ${slide.alt}`}
/>
```

#### **File: `components/home/VillaShowcase.tsx`**
```tsx
// Add descriptive alt for ALL villa images
<img
  src={villa.imageUrl}
  alt={`${villa.name} - ${villa.bedrooms} bedroom luxury villa in Ubud with ${villa.features.slice(0, 2).join(' and ')}`}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

---

### **3. Keyboard Navigation & Focus States**

#### **File: `app/globals.css`**
```css
/* Add global focus styles */
*:focus-visible {
  outline: 3px solid #C4A35A; /* Gold accent */
  outline-offset: 2px;
  border-radius: 2px;
}

/* Remove default outline for mouse users */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Button focus states */
button:focus-visible,
a:focus-visible {
  outline: 3px solid #C4A35A;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(196, 163, 90, 0.2);
}

/* Interactive elements should have visible focus */
[role="button"]:focus-visible,
[role="link"]:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid #C4A35A;
  outline-offset: 2px;
}
```

#### **File: `components/ui/Navbar.tsx`**
```tsx
// Add skip to main content link
export const Navbar: React.FC<NavbarProps> = ({ currentView = 'home' }) => {
  return (
    <>
      {/* Skip to main content - for keyboard users */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-forest focus:text-sand focus:px-6 focus:py-3 focus:rounded-md focus:shadow-xl"
      >
        Skip to main content
      </a>
      
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[50]..."
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Rest of navbar */}
      </nav>
    </>
  )
}
```

---

### **4. ARIA Labels & Semantic HTML**

#### **File: `components/layout/FullScreenMenu.tsx`**
```tsx
// BEFORE
<button onClick={() => setIsMenuOpen(true)}>
  <div className="w-8 flex flex-col">
    <span />
    <span />
    <span />
  </div>
</button>

// AFTER
<button
  onClick={() => setIsMenuOpen(true)}
  aria-label="Open navigation menu"
  aria-expanded={isMenuOpen}
  aria-controls="main-menu"
  aria-haspopup="true"
  className="flex items-center gap-3 group cursor-pointer"
>
  <span className="sr-only">
    {isMenuOpen ? 'Close' : 'Open'} menu
  </span>
  <div className="w-8 flex flex-col items-end gap-[5px]" aria-hidden="true">
    {/* Decorative hamburger lines */}
  </div>
</button>
```

#### **File: `components/home/LocationSection.tsx`**
```tsx
// BEFORE
<section className="flex flex-col lg:flex-row">

// AFTER  
<section 
  className="flex flex-col lg:flex-row"
  aria-labelledby="location-heading"
  role="region"
>
  <h2 id="location-heading" className="sr-only">
    Villa Locations in Ubud
  </h2>
  {/* Rest of content */}
</section>
```

---

### **5. Form Accessibility**

#### **File: `components/booking/GuestFormModal.tsx`**
```tsx
// Add proper form labels and error handling
<form 
  onSubmit={handleSubmit}
  aria-label="Guest booking information form"
  noValidate
>
  <div className="space-y-1">
    <label 
      htmlFor="guest-name"
      className="text-[10px] uppercase tracking-widest text-forest-dark/60 font-bold flex items-center gap-2"
    >
      <User size={12} aria-hidden="true" /> 
      Full Name
      <span className="text-red-500" aria-label="required">*</span>
    </label>
    <input
      id="guest-name"
      type="text"
      value={formData.fullName}
      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
      placeholder="e.g. Elena Rossi"
      required
      aria-required="true"
      aria-invalid={errors.fullName ? "true" : "false"}
      aria-describedby={errors.fullName ? "name-error" : undefined}
      className={`w-full border-b py-2 bg-transparent outline-none transition-all
        ${errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-forest-dark'}
      `}
    />
    {errors.fullName && (
      <span id="name-error" role="alert" className="text-xs text-red-400">
        {errors.fullName}
      </span>
    )}
  </div>
</form>
```

---

### **6. Modal/Dialog Accessibility**

#### **File: `components/booking/BookingSuccessModal.tsx`**
```tsx
// BEFORE
<div className="fixed inset-0 z-[100]">

// AFTER
<div
  className="fixed inset-0 z-[100]"
  role="dialog"
  aria-modal="true"
  aria-labelledby="success-modal-title"
  aria-describedby="success-modal-description"
>
  <h2 id="success-modal-title" className="font-serif text-2xl">
    Thank You!
  </h2>
  <p id="success-modal-description" className="text-center text-gray-500">
    Your booking request has been submitted
  </p>
  
  {/* Trap focus within modal */}
  <button
    onClick={onClose}
    className="absolute top-2 right-2"
    aria-label="Close confirmation modal"
    autoFocus
  >
    <X size={20} />
  </button>
</div>

// Add focus trap hook
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isOpen, onClose]);
```

---

### **7. Heading Hierarchy**

#### **File: `app/page.tsx` (HomePage)**
```tsx
// Ensure logical heading structure
<main id="main-content" role="main">
  {/* Hero - H1 */}
  <Hero /> {/* Contains <h1>STAYINUBUD</h1> */}
  
  {/* About Section - H2 */}
  <section aria-labelledby="about-heading">
    <h2 id="about-heading" className="text-4xl md:text-6xl font-serif">
      Where luxury meets serenity.
    </h2>
  </section>
  
  {/* Villas Section - H2, then H3 for each villa */}
  <section aria-labelledby="villas-heading">
    <h2 id="villas-heading" className="sr-only">Our Luxury Villas</h2>
    <VillaShowcase villas={villas} />
  </section>
  
  {/* Never skip heading levels! H1 -> H2 -> H3, not H1 -> H3 */}
</main>
```

---

### **8. Screen Reader Only Content**

#### **File: `app/globals.css`**
```css
/* Add to globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus,
.sr-only-focusable:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

### **9. Interactive Element Labels**

#### **File: `components/ui/SocialFab.tsx`**
```tsx
// BEFORE
<a href={social.href} target="_blank" rel="noopener noreferrer">
  <social.icon size={28} className={social.colorClass} />
</a>

// AFTER
<a 
  href={social.href}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`Visit StayinUBUD on ${social.label}`}
  className="group relative flex items-center justify-center w-14 h-14"
>
  <social.icon 
    size={28} 
    className={social.colorClass}
    aria-hidden="true"
    role="img"
  />
  <span className="sr-only">{social.label}</span>
</a>
```

---

### **10. Calendar Accessibility**

#### **File: `components/booking/Calendar.tsx`**
```tsx
<DayPicker
  mode="range"
  selected={selected}
  onSelect={handleSelect}
  disabled={disabledDates}
  numberOfMonths={numberOfMonths}
  showOutsideDays={false}
  // Add ARIA labels
  labels={{
    labelMonthDropdown: () => 'Select month',
    labelYearDropdown: () => 'Select year',
    labelNext: () => 'Go to next month',
    labelPrevious: () => 'Go to previous month',
  }}
  // Add role for screen readers
  modifiers={{
    disabled: disabledDates,
    selected: selected,
  }}
  modifiersClassNames={{
    disabled: 'rdp-day_disabled',
    selected: 'rdp-day_selected',
  }}
  // Announce to screen readers
  aria-label="Choose your check-in and check-out dates"
/>
```

---

## 📋 Implementation Checklist

### Phase 1: Critical Fixes (1-2 hours)
- [ ] Add focus-visible styles to globals.css
- [ ] Fix all color contrast ratios
- [ ] Add skip to main content link
- [ ] Add aria-labels to all icon buttons
- [ ] Fix image alt attributes

### Phase 2: Form & Modal (1-2 hours)
- [ ] Add proper form labels
- [ ] Implement focus trap in modals
- [ ] Add aria-invalid for form errors
- [ ] Add aria-live regions for dynamic content

### Phase 3: Semantic HTML (1 hour)
- [ ] Fix heading hierarchy
- [ ] Add ARIA landmarks
- [ ] Convert divs to semantic elements
- [ ] Add sr-only content where needed

### Phase 4: Testing (1 hour)
- [ ] Run Lighthouse audit
- [ ] Test with keyboard only
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Test with browser zoom (200%)

---

## 🧪 Testing Commands

```bash
# Run Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Select "Accessibility" only
# 4. Click "Analyze page load"

# Screen Reader Testing:
# Windows: NVDA (free) - https://www.nvaccess.org/
# Mac: VoiceOver (built-in) - Cmd + F5
# Chrome Extension: ChromeVox
```

---

## 🎨 Design System Updates

Create `components/ui/AccessibleButton.tsx`:
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center gap-2 font-sans uppercase tracking-widest transition-all duration-300',
        'focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Variants
        variant === 'primary' && 'bg-forest text-sand hover:bg-forest/90',
        variant === 'secondary' && 'border-2 border-forest text-forest hover:bg-forest hover:text-sand',
        variant === 'ghost' && 'text-forest hover:bg-forest/10',
        
        // Sizes
        size === 'sm' && 'px-4 py-2 text-xs',
        size === 'md' && 'px-6 py-3 text-sm',
        size === 'lg' && 'px-8 py-4 text-base',
        
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading...</span>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
        </>
      ) : (
        <>
          {icon && <span aria-hidden="true">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
```

---

## 🚀 Quick Wins (30 minutes)

1. **Add to `tailwind.config.js`:**
```javascript
plugins: [
  function({ addUtilities }) {
    addUtilities({
      '.focus-ring': {
        '@apply focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50 focus-visible:ring-offset-2': {},
      },
      '.focus-ring-inset': {
        '@apply focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold/50': {},
      },
    })
  }
]
```

2. **Replace all buttons:**
```tsx
// BEFORE
<button className="...">Click me</button>

// AFTER
<button className="... focus-ring" aria-label="Descriptive label">
  <span className="sr-only">Full descriptive text</span>
  <IconComponent aria-hidden="true" />
</button>
```

3. **Add to all images:**
```tsx
<img 
  src="..." 
  alt={isDecorative ? "" : "Descriptive alt text"}
  loading="lazy"
  role={isDecorative ? "presentation" : undefined}
/>
```

---

## 📊 Expected Results

After implementing these fixes:
- ✅ Lighthouse Accessibility Score: **100/100**
- ✅ WCAG 2.1 Level AA: **Compliant**
- ✅ Keyboard Navigation: **Fully functional**
- ✅ Screen Reader Compatible: **Yes**
- ✅ Color Contrast: **All AAA (7:1)**

---

## 🔗 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 💡 Pro Tips

1. **Use semantic HTML first**, ARIA second
2. **Test with keyboard** before mouse
3. **Don't rely on color alone** for information
4. **Provide multiple ways** to navigate (menu, search, breadcrumbs)
5. **Test with real users** who use assistive technology

---

**Last Updated:** January 2026
**Maintainer:** StayinUBUD Development Team
