import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const BACKEND_URL = "https://functions.poehali.dev/d701d28b-52de-448f-9633-c98cc86da28d";
const LOGO_URL = "https://cdn.poehali.dev/projects/4efb636f-5727-469b-ba65-0279b71d39d2/files/38269c5f-2835-432d-820a-5679f4c369d1.jpg";
const TG_LINK = "https://t.me/DetectiveAdapter";

const services = [
  { num: "01", title: "Наблюдение и слежка", desc: "Профессиональное наружное наблюдение с документальной фиксацией." },
  { num: "02", title: "Проверка личности", desc: "Установление личных данных, биографии и репутации." },
  { num: "03", title: "Поиск людей", desc: "Розыск пропавших родственников, должников и свидетелей." },
  { num: "04", title: "Корпоративная разведка", desc: "Проверка партнёров, сотрудников, утечки информации." },
  { num: "05", title: "Семейные расследования", desc: "Деликатные вопросы личной жизни с полной конфиденциальностью." },
  { num: "06", title: "Сбор доказательств", desc: "Легальный сбор доказательной базы для судебных разбирательств." },
];

const faq = [
  { q: "Конфиденциальность — гарантируете?", a: "Абсолютно. Все данные клиентов защищены договором о неразглашении. Мы не передаём информацию третьим лицам ни при каких обстоятельствах." },
  { q: "Как быстро вы начинаете работу?", a: "После первичной консультации и заключения договора — в течение 24 часов. В срочных случаях возможен немедленный выезд." },
  { q: "Каков ваш опыт?", a: "Более года успешной практики. За это время мы закрыли сотни дел с подтверждёнными результатами." },
  { q: "Работаете ли вы в других городах?", a: "Да. Мы работаем по всей территории России, а также в ближнем зарубежье при необходимости." },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-cormorant text-lg font-semibold">{q}</span>
        <Icon name={open ? "Minus" : "Plus"} size={16} className="shrink-0 text-muted-foreground" />
      </button>
      {open && (
        <p className="pb-5 text-sm text-muted-foreground leading-relaxed font-ibm font-light">
          {a}
        </p>
      )}
    </div>
  );
}

export default function Index() {
  const [form, setForm] = useState({ name: "", tg: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [menuOpen, setMenuOpen] = useState(false);

  const heroIn = useInView(0.1);
  const servicesIn = useInView(0.1);
  const aboutIn = useInView(0.1);
  const faqIn = useInView(0.1);
  const contactIn = useInView(0.1);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", tg: "", message: "" });
      } else {
        setStatus("err");
      }
    } catch {
      setStatus("err");
    }
  };

  return (
    <div className="noise min-h-screen bg-background">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Логотип" className="w-7 h-7 object-contain grayscale" />
            <span className="font-cormorant text-base font-semibold tracking-widest uppercase">Детективы</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[["services","Услуги"],["about","О нас"],["faq","FAQ"],["contact","Контакт"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link">{label}</button>
            ))}
            <a href={TG_LINK} target="_blank" rel="noreferrer" className="nav-link flex items-center gap-1.5">
              <Icon name="Send" size={13} />
              Telegram
            </a>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
            {[["services","Услуги"],["about","О нас"],["faq","FAQ"],["contact","Контакт"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} className="nav-link text-left">{label}</button>
            ))}
            <a href={TG_LINK} target="_blank" rel="noreferrer" className="nav-link flex items-center gap-1.5">
              <Icon name="Send" size={13} />Telegram
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="min-h-screen flex flex-col justify-center pt-14">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div ref={heroIn.ref} className="grid md:grid-cols-2 gap-16 items-center py-24">

            <div>
              <p className={`section-label mb-6 ${heroIn.visible ? "animate-fade-up" : "opacity-0"}`}>
                Детективное агентство · С 2024 года
              </p>
              <h1 className={`font-cormorant text-6xl md:text-7xl lg:text-8xl font-light leading-[0.95] mb-8 ${heroIn.visible ? "animate-fade-up delay-100" : "opacity-0"}`}>
                Истина<br />
                <em className="italic">всегда</em><br />
                открыта
              </h1>
              <p className={`text-sm text-muted-foreground leading-relaxed max-w-sm mb-10 font-ibm font-light ${heroIn.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
                Профессиональные расследования любой сложности. Конфиденциально. Законно. С гарантией результата.
              </p>
              <div className={`flex flex-wrap gap-4 ${heroIn.visible ? "animate-fade-up delay-300" : "opacity-0"}`}>
                <button onClick={() => scrollTo("contact")} className="btn-primary">
                  Получить консультацию
                </button>
                <button onClick={() => scrollTo("services")} className="btn-outline">
                  Наши услуги
                </button>
              </div>
            </div>

            <div className={`flex justify-center md:justify-end ${heroIn.visible ? "animate-fade-in delay-400" : "opacity-0"}`}>
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 border border-border flex items-center justify-center bg-white">
                  <img
                    src={LOGO_URL}
                    alt="Шерлок с лупой — Детективы"
                    className="w-56 h-56 object-contain grayscale"
                  />
                </div>
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t border-l border-foreground" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b border-r border-foreground" />
              </div>
            </div>

          </div>

          <div className={`border-t border-border grid grid-cols-3 gap-0 ${heroIn.visible ? "animate-fade-up delay-500" : "opacity-0"}`}>
            {[["1+","Год опыта"],["500+","Дел закрыто"],["100%","Конфиденциально"]].map(([num, label]) => (
              <div key={label} className="py-8 px-4 border-r border-border last:border-r-0 text-center md:text-left md:px-8">
                <div className="font-cormorant text-4xl font-light mb-1">{num}</div>
                <div className="section-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={servicesIn.ref}>
            <div className={`flex items-end justify-between mb-16 ${servicesIn.visible ? "animate-fade-up" : "opacity-0"}`}>
              <div>
                <p className="section-label mb-3">Что мы делаем</p>
                <h2 className="font-cormorant text-5xl md:text-6xl font-light">Услуги</h2>
              </div>
              <button onClick={() => scrollTo("contact")} className="hidden md:inline-flex btn-outline">
                Обсудить задачу
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
              {services.map((s, i) => (
                <div
                  key={s.num}
                  className={`p-8 border-b border-r border-border last:border-r-0 hover:bg-black hover:text-white transition-colors duration-300 group cursor-default ${servicesIn.visible ? `animate-fade-up delay-${(i+1)*100}` : "opacity-0"}`}
                >
                  <div className="section-label mb-4 group-hover:text-white/50">{s.num}</div>
                  <h3 className="font-cormorant text-xl font-semibold mb-3 leading-tight">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed group-hover:text-white/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 border-t border-border bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={aboutIn.ref} className="grid md:grid-cols-2 gap-16 items-center">
            <div className={aboutIn.visible ? "animate-fade-up" : "opacity-0"}>
              <p className="section-label mb-6 text-white/40">О нас</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light leading-tight mb-8">
                Год в тени —<br /><em className="italic">тысячи ответов</em>
              </h2>
              <div className="space-y-4 text-sm text-white/60 leading-relaxed font-ibm font-light">
                <p>
                  Детективное агентство основано профессионалами с опытом в правоохранительных органах и частном сыске. За год работы мы выработали собственную методику, которая даёт результат там, где другие отступают.
                </p>
                <p>
                  Мы работаем строго в рамках закона, применяя современные технологии и классические методы наблюдения. Каждое дело — отдельная история, которую мы раскрываем с максимальной тщательностью.
                </p>
              </div>
            </div>
            <div className={`space-y-0 border border-white/10 ${aboutIn.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
              {[
                ["Опыт","1+ год в сфере частного сыска"],
                ["Метод","Законные методы, современные технологии"],
                ["Гарантия","Договор с фиксацией обязательств"],
                ["Конфиденциальность","NDA с каждым клиентом"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-0 border-b border-white/10 last:border-b-0">
                  <div className="w-36 shrink-0 p-5 border-r border-white/10">
                    <span className="section-label text-white/40">{k}</span>
                  </div>
                  <div className="p-5">
                    <span className="text-sm text-white/70 font-ibm font-light">{v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={faqIn.ref} className="grid md:grid-cols-3 gap-16">
            <div className={faqIn.visible ? "animate-fade-up" : "opacity-0"}>
              <p className="section-label mb-3">Вопросы</p>
              <h2 className="font-cormorant text-5xl font-light leading-tight">Часто<br />спрашивают</h2>
            </div>
            <div className={`md:col-span-2 ${faqIn.visible ? "animate-fade-up delay-200" : "opacity-0"}`}>
              {faq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 border-t border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div ref={contactIn.ref} className="grid md:grid-cols-2 gap-16">

            <div className={contactIn.visible ? "animate-fade-up" : "opacity-0"}>
              <p className="section-label mb-3">Связаться</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light leading-tight mb-8">
                Расскажите<br /><em className="italic">о задаче</em>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-10 max-w-xs font-ibm font-light">
                Первичная консультация бесплатна и ни к чему не обязывает. Свяжитесь удобным способом.
              </p>
              <a
                href={TG_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-sm group w-fit"
              >
                <div className="w-10 h-10 border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <Icon name="Send" size={15} />
                </div>
                <span className="font-ibm font-light text-muted-foreground group-hover:text-foreground transition-colors">
                  @DetectiveAdapter в Telegram
                </span>
              </a>
            </div>

            <div className={contactIn.visible ? "animate-fade-up delay-200" : "opacity-0"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-ibm font-light select-none">@</span>
                  <input
                    type="text"
                    placeholder="юзернейм в Telegram"
                    value={form.tg}
                    onChange={e => setForm({ ...form, tg: e.target.value.replace(/^@/, "") })}
                    required
                    style={{ paddingLeft: "1.75rem" }}
                  />
                </div>
                <textarea
                  placeholder="Кратко опишите ситуацию"
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {status === "loading" ? "Отправляем..." : "Отправить заявку"}
                </button>
                {status === "ok" && (
                  <p className="text-sm text-center font-ibm font-light text-gold">
                    Заявка отправлена — мы свяжемся с вами скоро
                  </p>
                )}
                {status === "err" && (
                  <p className="text-sm text-center text-destructive font-ibm font-light">
                    Ошибка отправки. Напишите нам напрямую в Telegram.
                  </p>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-foreground text-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Логотип" className="w-6 h-6 object-contain" style={{ filter: "invert(1) grayscale(1)" }} />
              <span className="font-cormorant text-sm font-semibold tracking-widest uppercase text-white">Детективы</span>
            </div>
            <p className="font-cormorant text-xl italic text-white/80 tracking-wide text-center">
              «Ваша безопасность — наше дело»
            </p>
            <a href={TG_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors nav-link">
              <Icon name="Send" size={13} />
              <span>@DetectiveAdapter</span>
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-white/30 font-ibm font-light">© 2024–2025 Детективы. Все права защищены.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}