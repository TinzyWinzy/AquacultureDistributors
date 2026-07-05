import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Fish, Hammer, Handshake, ArrowRight, MapPin, Droplets, ShieldCheck, Star, ChevronDown } from 'lucide-react';
import { FARM_METADATA } from '../../data';
import { ServiceType } from '../../types';

interface LandingPageProps {
  onStartForm: (service: ServiceType) => void;
}

const services: { type: ServiceType; icon: typeof Fish; title: string; subtitle: string; price: string; benefit: string }[] = [
  { type: 'fingerlings', icon: Fish, title: 'Premium Fingerlings', subtitle: 'GIFT sex-reversed tilapia & catfish fingerlings', price: 'From $50 / 1,000', benefit: '30,000 fry produced daily' },
  { type: 'pond', icon: Hammer, title: 'Pond Construction', subtitle: 'Turnkey commercial & backyard pond setups', price: 'Starting at $702', benefit: '300µ UV-treated Damliner' },
  { type: 'breeding', icon: Handshake, title: 'Breeding Partnership', subtitle: 'Turn $2,500 into a breeding business', price: '20 slots only', benefit: '$1,400/mo guaranteed return' },
];

const stats = [
  { label: 'Daily Production', value: '30K', unit: 'GIFT fry', icon: Droplets },
  { label: 'Partnership Slots', value: '20', unit: 'max', icon: ShieldCheck },
  { label: 'Buy-Back Rate', value: '$2.00', unit: '/kg mature', icon: Star },
  { label: 'Farm Location', value: 'Mt Hampden', unit: 'Harare', icon: MapPin },
];

const trustPillars = [
  { title: 'Proven Genetics', body: 'GIFT strain tilapia — 40-day intensive nursery, sex-reversed for uniform growth and higher yields.', icon: Star },
  { title: 'Full Support', body: 'From soil testing & pond layout to stocking and harvest planning. We walk with you.', icon: ShieldCheck },
  { title: 'Guaranteed Buy-Back', body: '$2.00/kg for mature fish, $35/1,000 fingerlings. No middlemen — we buy directly.', icon: Droplets },
];

const gallery = [
  { src: '/images/pools.jpg', alt: 'Pond construction at Mt Hampden Farm' },
  { src: '/images/freshcatch.jpg', alt: 'Fresh tilapia harvest' },
  { src: '/images/team.jpg', alt: 'Aquaculture Distributors team' },
  { src: '/images/kids-wit-fish.jpg', alt: 'Community engagement' },
  { src: '/images/fish-on-ground.jpg', alt: 'Fish harvesting' },
  { src: '/images/fish-processing.jpg', alt: 'Fish processing' },
];

function FloatingBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white/5" style={{
          left: `${15 + i * 14}%`,
          bottom: '-20px',
          width: `${12 + i * 8}px`,
          height: `${12 + i * 8}px`,
          animation: `bubble-rise ${8 + i * 3}s ease-in-out ${i * 2}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function LandingPage({ onStartForm }: LandingPageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroParallax = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0, 1] as const } },
  };

  return (
    <div className="w-full flex flex-col">
      {/* ===== Hero ===== */}
      <div ref={heroRef} className="relative w-full h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroParallax }}>
          <img src="/images/hero.jpg" alt="" className="w-full h-full object-cover animate-kenburns" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/90 via-brand-navy/80 to-brand-navy/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-base)] via-transparent to-transparent" />
        <FloatingBubbles />
        <motion.div style={{ opacity: heroOpacity }} className="relative h-full flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-aqua animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/80">{FARM_METADATA.location}</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-serif text-fluid-hero font-bold text-white leading-tight mb-4">
              {FARM_METADATA.name}
            </motion.h1>
            <motion.p variants={itemVariants} className="font-serif text-fluid-h3 italic text-white/60 mb-6">
              &ldquo;{FARM_METADATA.motto}&rdquo;
            </motion.p>
            <motion.p variants={itemVariants} className="text-sm text-white/40 max-w-lg mx-auto mb-10 leading-relaxed">
              Zimbabwe&rsquo;s trusted source for GIFT strain tilapia and catfish fingerlings,<br className="hidden md:block" />
              commercial pond construction, and breeding partnerships.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => onStartForm('fingerlings')}
                className="group px-8 py-4 bg-white text-brand-navy font-display font-bold rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all cursor-pointer flex items-center gap-2 text-sm"
              >
                Order Fingerlings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => onStartForm('breeding')}
                className="group px-8 py-4 glass-button-primary cursor-pointer flex items-center gap-2 text-sm"
              >
                Explore Partnership <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => onStartForm('pond')}
                className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-display font-semibold rounded-2xl hover:bg-white/20 transition-all cursor-pointer flex items-center gap-2 text-sm"
              >
                Build a Pond <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
        {/* Scroll indicator */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}>
          <ChevronDown size={18} className="text-white/30" />
        </motion.div>
        {/* Fade to background color */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-surface-base)] to-transparent pointer-events-none" />
      </div>

      <div className="w-full max-w-[90rem] mx-auto px-4 md:px-8 xl:px-12 flex flex-col gap-24 py-12">
        {/* ===== Stats Strip ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, unit, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass-card p-6 md:p-8 text-center relative group"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-brand-gold group-hover:w-16 transition-all duration-300 shadow-[0_0_10px_rgba(199,158,45,0.5)]" />
              <Icon size={24} className="text-brand-navy mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="font-display font-bold text-fluid-h2 text-brand-navy">{value}</div>
              <div className="text-sm font-semibold text-slate-600 mt-1">{label}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">{unit}</div>
            </motion.div>
          ))}
        </div>

        {/* ===== Service Pathways ===== */}
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-navy font-bold">Choose Your Path</span>
            <span className="flex-1 h-px bg-slate-200" />
          </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map(({ type, icon: Icon, title, subtitle, price, benefit }, i) => (
              <motion.button
                key={type}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStartForm(type)}
                className="glass-card p-8 text-left cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-navy/5 rounded-full blur-2xl group-hover:scale-150 group-hover:bg-brand-navy/10 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 text-brand-navy shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_4px_15px_rgba(0,43,94,0.1)] group-hover:border-brand-navy/20 transition-all duration-300">
                    <Icon size={24} className="group-hover:text-brand-gold transition-colors" />
                  </div>
                  <h3 className="font-display font-bold text-brand-navy text-xl mb-2">{title}</h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">{subtitle}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="font-mono text-xs font-bold text-brand-navy bg-brand-navy/5 px-2 py-1 rounded">{price}</span>
                    <span className="text-xs font-semibold text-brand-gold flex items-center gap-2">
                      {benefit}
                      <ArrowRight size={14} className="-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ===== Trust / Why Us ===== */}
        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-brand-gold/10 blur-[100px] pointer-events-none rounded-full" />
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-10 relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-brand-gold font-bold">Why Partner With Us</span>
            <span className="flex-1 h-px bg-slate-200" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {trustPillars.map(({ title, body, icon: Icon }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 backdrop-blur-md"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-navy/5 text-brand-navy flex items-center justify-center mb-5 border border-brand-navy/10 shadow-sm">
                  <Icon size={20} />
                </div>
                <h4 className="font-display font-semibold text-lg text-brand-navy mb-3">{title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ===== Gallery ===== */}
        <div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 font-semibold">Farm Life</span>
            <span className="flex-1 h-px bg-slate-200" />
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <motion.div key={img.src} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-surface-elevated group cursor-pointer border border-slate-200 shadow-sm"
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
