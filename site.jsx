/* global React, ReactDOM */
const { useState, useEffect, useMemo, useRef } = React;

// ───────────── data ─────────────

const NAV = [
  ["home", "Home"],
  ["about", "About"],
  ["writing", "Writing"],
  ["teachings", "Teachings"],
  ["schedule", "Schedule"],
  ["books", "Books"],
  ["pilgrimages", "Pilgrimages"],
  ["contact", "Contact"],
];

const ESSAYS = [
  {
    slug: "coming-soon",
    date: "05.13.2026",
    title: "Coming Soon",
    dek: "New writing is on its way.",
    minutes: null,
  },
];

const TALKS = [
  { slug:"opening-into-awareness", title: "Opening Into Awareness", series: "Monday Night Meditation", date: "03.10.2026", duration: "47:12" },
  { slug:"the-three-doors", title: "The Three Doors of Liberation", series: "Wonderwell Dharma Talk", date: "02.18.2026", duration: "1:02:30" },
  { slug:"compassion-roots", title: "Compassion Has Roots", series: "Online Sangha", date: "01.27.2026", duration: "38:55" },
  { slug:"resting-in-not-knowing", title: "Resting in Not Knowing", series: "Monday Night Meditation", date: "12.16.2025", duration: "44:08" },
  { slug:"madman-wisdom", title: "The Wisdom of the Mad Yogi", series: "Tricycle Dharma Talk", date: "11.04.2025", duration: "52:19" },
  { slug:"plant-medicine-buddhist-view", title: "A Buddhist View of Plant Medicines", series: "Lecture", date: "10.08.2025", duration: "1:14:42" },
  { slug:"forest-mind", title: "Forest Mind: Practicing Outdoors", series: "Wilderness Dharma Series", date: "09.18.2025", duration: "41:22" },
  { slug:"entheogens-integration", title: "Integration: After the Threshold", series: "Plant & Practice", date: "08.29.2025", duration: "58:04" },
  { slug:"land-as-lineage", title: "Land as Lineage", series: "Wilderness Dharma Series", date: "07.22.2025", duration: "49:36" },
];

const RETREATS = [
  {
    when: "Mar 20, 2026 – Feb 18, 2027",
    title: "Rewilding the Soul 2026–2027",
    where: "Online · Council Practice",
    kind: "Online series · year-long",
    status: "ongoing",
    url: "https://naturaldharma.org/schedule/rewilding-the-soul-2026-2027-coming-present-to-our-earth-based-lineage-online-series-with-council-practice/",
  },
  {
    when: "Jun 18 – 21, 2026",
    title: "Open Practice: A Nature-based Long Weekend",
    where: "Wonderwell Mountain Refuge · Springfield, NH",
    kind: "Residential retreat · 4 days",
    status: "open",
    url: "https://naturaldharma.org/schedule/open-practice-in-nature-long-weekend-residential-only/",
  },
  {
    when: "Jun 21, 2026",
    title: "Summer Solstice Celebration",
    where: "Online",
    kind: "Online event",
    status: "open",
    url: "https://naturaldharma.org/schedule/summer-solstice-celebration-online/",
  },
  {
    when: "Jul 24 – Aug 3, 2026",
    title: "Loving Awareness in the Living World",
    where: "Wonderwell Mountain Refuge · Springfield, NH",
    kind: "Hybrid retreat",
    status: "open",
    url: "https://naturaldharma.org/schedule/loving-awareness-in-the-living-world-hybrid/",
  },
  {
    when: "Sep 29 – Oct 5, 2026",
    title: "Wild Awakening: Embodying the Wisdom of the Elements",
    where: "Wonderwell Mountain Refuge · Springfield, NH",
    kind: "Residential retreat · 7 days",
    status: "open",
    url: "https://naturaldharma.org/schedule/wild-awakening-embodying-the-wisdom-of-the-elements-residential-only/",
  },
  {
    when: "Oct 29 – Nov 1, 2026",
    title: "Interwoven: A Journey Into the Mycelial Heart",
    where: "Wonderwell Mountain Refuge · Springfield, NH",
    kind: "Hybrid retreat · 4 days",
    status: "save-the-date",
    url: "https://naturaldharma.org/schedule/interwoven-a-journey-into-the-mycelial-heart-hybrid/",
  },
];

const BOOKS = [
  {
    title: "More Than a Madman",
    sub: "The Divine Words of Drukpa Kunley",
    year: "2014",
    cover: "images/book-more-than-a-madman.jpg",
    spineColor: "#7a3a2a",
    buy: [
      { label: "Open Library", url: "https://openlibrary.org/works/OL20125938W/More_Than_a_Madman" },
    ],
  },
  {
    title: "Tales of a Mad Yogi",
    sub: "The Life and Wild Wisdom of Drukpa Kunley",
    year: "2021",
    cover: "images/book-tales-of-a-mad-yogi.jpg",
    spineColor: "#3d4a2a",
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/Tales-Mad-Yogi-Wisdom-Drukpa/dp/1611807050" },
      { label: "Kindle", url: "https://www.amazon.com/Tales-Mad-Yogi-Wisdom-Drukpa-ebook/dp/B091M97WX3" },
      { label: "Penguin Random House", url: "https://www.penguinrandomhouse.com/books/670712/tales-of-a-mad-yogi-by-elizabeth-l-monson/" },
    ],
  },
  {
    title: "Buddhist Tantra",
    sub: "A Practitioner's Way",
    publisher: "Shambhala · forthcoming",
    year: "2026",
    spineColor: "#2a3548",
    forthcoming: true,
  },
];

// ───────────── helpers ─────────────

const cx = (...xs) => xs.filter(Boolean).join(" ");

function useHashRoute() {
  const parse = () => {
    const h = (window.location.hash || "#/home").replace(/^#\/?/, "");
    const [page, ...rest] = h.split("/");
    return { page: page || "home", arg: rest.join("/") };
  };
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => {
      setRoute(parse());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

function go(page, arg) {
  window.location.hash = "#/" + page + (arg ? "/" + arg : "");
}

// ───────────── chrome ─────────────

function Header({ route }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#/home" onClick={() => setOpen(false)}>
        <span className="wm-line">Lama</span>
        <span className="wm-name">Elizabeth Monson</span>
      </a>
      <nav className={cx("nav", open && "nav-open")}>
        {NAV.map(([slug, label]) => (
          <a
            key={slug}
            href={"#/" + slug}
            className={cx("nav-link", route.page === slug && "is-current")}
            onClick={() => setOpen(false)}
          >
            <span className="nav-num">{(NAV.findIndex(n=>n[0]===slug)+1).toString().padStart(2,"0")}</span>
            {label}
          </a>
        ))}
      </nav>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="ft-col">
        <div className="ft-h">Correspondence</div>
        <div>liz@lamaliz.org</div>
        <div>Booking · press · sangha</div>
      </div>
      <div className="ft-col">
        <div className="ft-h">Where</div>
        <div>Wonderwell Mountain Refuge</div>
        <div>Springfield, New Hampshire</div>
      </div>
      <div className="ft-col">
        <div className="ft-h">Elsewhere</div>
        <div><a href="https://naturaldharma.org/members/lama-elizabeth-monson/" target="_blank" rel="noreferrer">Natural Dharma Fellowship</a></div>
        <div><a href="https://www.mindbodpod.com/p/lama-liz-monson-crazy-wisdom" target="_blank" rel="noreferrer">Crazy Wisdom Podcast</a></div>
      </div>
      <div className="ft-col ft-meta">
        <div>© Elizabeth Monson, MMXXVI</div>
        <div>Site as practice. Built slowly.</div>
      </div>
    </footer>
  );
}

// ───────────── home ─────────────

function HomeEditorial() {
  return (
    <section className="home-editorial">
      <div className="he-photo">
        <img src="images/portrait-thangka.jpeg" alt="Lama Liz Monson" />
        <div className="he-photo-cap">Wonderwell · 2025</div>
      </div>
      <div className="he-leaf"><Leaf/></div>
      <div className="he-manifesto">
        <p>
          Liz is a dharma teacher exploring the intersection of Buddhist practice
          and entheogens — and the natural state that has been quietly waiting
          underneath both.
        </p>
      </div>
      <FeaturedRow />
    </section>
  );
}

function HomeManuscript() {
  return (
    <section className="home-manuscript">
      <div className="hm-frame">
        <div className="hm-glyph">ༀ</div>
        <h1 className="hm-title">
          <span>An invitation</span>
          <span className="hm-amp">to</span>
          <span>rest where you already are.</span>
        </h1>
        <div className="hm-rule" />
        <p className="hm-sub">
          Dharma teacher in the Kagyu and Nyingma lineages, Managing Teacher at
          Wonderwell Mountain Refuge — exploring the intersection of Buddhist
          practice and entheogens.
        </p>
        <div className="hm-meta">
          <span>Springfield · New Hampshire</span>
          <span className="hm-dot">·</span>
          <span>est. practice, three decades</span>
        </div>
      </div>
      <FeaturedRow />
    </section>
  );
}

function HomeWindow() {
  return (
    <section className="home-window">
      <div className="hw-bg">
        <img src="images/wonderwell-window.jpeg" alt="" />
        <div className="hw-shade" />
      </div>
      <div className="hw-text">
        <div className="hw-eyebrow">Lama Elizabeth Monson</div>
        <h1>
          A bird through<br/>the window —<br/>and nothing<br/>added to it.
        </h1>
        <div className="hw-cta">
          <a href="#/writing" className="btn">Read the journal →</a>
          <a href="#/schedule" className="btn ghost">Upcoming retreats</a>
        </div>
      </div>
      <FeaturedRow />
    </section>
  );
}

function FeaturedRow() {
  const featured = ESSAYS[0];
  const next = RETREATS.find(r => r.status !== "ongoing");
  return (
    <div className="featured-row">
      <a className="fr-card fr-essay" href={`#/essay/${featured.slug}`}>
        <div className="fr-eyebrow"><span>Newest writing</span><span>{featured.date}</span></div>
        <h3>{featured.title}</h3>
        <p>{featured.dek}</p>
        <div className="fr-foot">{featured.minutes ? `Read · ${featured.minutes} min ↗` : "Coming soon"}</div>
      </a>
      <a className="fr-card fr-retreat" href="#/schedule">
        <div className="fr-eyebrow"><span>Next retreat</span><span>{next.when.split(",")[0]}</span></div>
        <h3>{next.title}</h3>
        <p>{next.where}</p>
        <div className="fr-foot">{next.kind} ↗</div>
      </a>
      <a className="fr-card fr-talk" href="#/teachings">
        <div className="fr-eyebrow"><span>Latest talk</span><span>{TALKS[0].date}</span></div>
        <h3>{TALKS[0].title}</h3>
        <p>{TALKS[0].series}</p>
        <div className="fr-foot">Listen · {TALKS[0].duration} ↗</div>
      </a>
    </div>
  );
}

// ───────────── about ─────────────

function About() {
  return (
    <section className="page about">
      <PageTitle eyebrow="01 / About" title="A short biography" />
      <div className="about-grid">
        <div className="about-text">
          <p className="lead">
            Elizabeth Monson, PhD, is the Spiritual Co-Director of Natural Dharma
            Fellowship and the Managing Teacher at Wonderwell Mountain Refuge in
            Springfield, NH.
          </p>
          <p>
            Liz was authorized as a dharma teacher and lineage holder in the Kagyu
            Lineage of Tibetan Buddhism after over thirty years of studying,
            practicing, and teaching Tibetan Buddhism in the Kagyu and Nyingma
            lineages. In 2015 she completed a doctorate at Harvard University, and
            was a Visiting Lecturer in the Study of Religion in 2015–16.
          </p>
          <p>
            At present, Liz writes, guides meditation retreats, and develops
            curricula for people interested in reconnecting with the natural world
            and in responding to contemporary social and spiritual issues as a path
            for liberation. She is engaged in an ongoing exploration of the
            potential of combining Buddhist meditation and indigenous plant
            medicines and psychedelics as portals for accessing and resting in the
            natural state.
          </p>
          <p>
            She teaches around New England and online, helping people to access
            their innate awakened energies and open awareness — and to discover
            tools for how to become free in everyday life. Her teaching focuses on
            developing diverse methods for incorporating the Buddhist teachings
            into this human life through the practices of kindness and compassion,
            and on recognizing the natural state in every moment of our lives.
          </p>
          <p>
            She derives inspiration from the teachings of Anam Thubten, Mingyur
            Rinpoche, and Tsoknyi Rinpoche, and finds deep solace and healing in
            the teachings long held by native peoples around the planet —
            teachings that are continuously streaming towards us from the natural
            world.
          </p>
        </div>
        <aside className="about-aside">
          <figure className="about-portrait">
            <img src="images/portrait-soft.jpeg" alt="" />
            <figcaption>Late afternoon, the writing desk</figcaption>
          </figure>
          <div className="lineage">
            <div className="ln-h">Lineage</div>
            <ul>
              <li>Kagyu — authorized lama &amp; lineage holder</li>
              <li>Nyingma — long study and practice</li>
              <li>Teachers: Anam Thubten · Mingyur Rinpoche · Tsoknyi Rinpoche</li>
            </ul>
          </div>
          <div className="lineage">
            <div className="ln-h">Education</div>
            <ul>
              <li>PhD, Harvard University, 2015</li>
              <li>Visiting Lecturer, Study of Religion, 2015–16</li>
            </ul>
          </div>
          <div className="lineage">
            <div className="ln-h">Published in</div>
            <ul>
              <li>Tricycle</li>
              <li>Lion's Roar</li>
              <li>Buddhadharma</li>
              <li>Journal of the IABS</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

// ───────────── writing ─────────────

function Writing() {
  const [filter, setFilter] = useState("all");
  return (
    <section className="page writing">
      <PageTitle eyebrow="02 / Writing" title="A journal kept at the edge of practice" />
      <div className="writing-filter">
        {["all", "dharma", "natural-world", "tantra"].map(f => (
          <button key={f} className={cx("wf", filter===f && "is-on")} onClick={()=>setFilter(f)}>
            {f.replace("-", " ")}
          </button>
        ))}
      </div>
      <ol className="essays">
        {ESSAYS.map(e => (
          <li key={e.slug}>
            <a href={`#/essay/${e.slug}`} className="essay-row">
              <span className="er-date">{e.date}</span>
              <span className="er-body">
                <span className="er-title">{e.title}</span>
                <span className="er-dek">{e.dek}</span>
              </span>
              {e.minutes && <span className="er-min">{e.minutes} min</span>}
              <span className="er-arrow">↗</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Essay({ slug }) {
  const e = ESSAYS.find(x => x.slug === slug) || ESSAYS[0];
  return (
    <article className="page essay-page">
      <a className="back" href="#/writing">← Back to journal</a>
      <header className="ep-head">
        <div className="ep-meta">
          <span>{e.date}</span>
          {e.minutes && <><span>·</span><span>{e.minutes} min</span></>}
        </div>
        <h1>{e.title}</h1>
        <p className="ep-dek">{e.dek}</p>
      </header>
      <div className="ep-rule"><Leaf/></div>
      <div className="ep-body">
        {(e.body || [
          "This essay is part of a longer journal. The full text will appear here when it is ready to be read.",
          "In the meantime — please be patient with the writer. She is, like all of us, learning to listen.",
        ]).map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <footer className="ep-foot">
        <div>— Liz</div>
        <div className="ep-foot-loc">Wonderwell Mountain Refuge</div>
      </footer>
    </article>
  );
}

// ───────────── teachings (audio) ─────────────

function Teachings() {
  const [playing, setPlaying] = useState(null); // slug
  const [progress, setProgress] = useState(0); // 0..1
  const rafRef = useRef(null);
  const startRef = useRef(0);

  const current = TALKS.find(t => t.slug === playing);
  const durationSec = current ? parseDuration(current.duration) : 0;

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - progress * durationSec * 1000;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      const p = Math.min(1, elapsed / durationSec);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else setPlaying(null);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const toggle = (slug) => {
    if (playing === slug) {
      setPlaying(null);
    } else {
      setProgress(0);
      setPlaying(slug);
    }
  };

  return (
    <section className="page teachings">
      <PageTitle eyebrow="03 / Teachings" title="Dharma talks &amp; recorded sessions" />
      <p className="page-lede">
        A growing archive of Monday-night sits, retreat sessions, and longer talks.
        Headphones welcome. Sit if you can.
      </p>
      <ul className="talks">
        {TALKS.map(t => {
          const isOn = playing === t.slug;
          const p = isOn ? progress : 0;
          return (
            <li key={t.slug} className={cx("talk", isOn && "is-on")}>
              <button className="play" onClick={()=>toggle(t.slug)} aria-label={isOn ? "Pause" : "Play"}>
                {isOn ? <span className="pause"><i/><i/></span> : <span className="tri"/>}
              </button>
              <div className="talk-body">
                <div className="talk-meta">
                  <span>{t.series}</span>
                  <span className="talk-dot">·</span>
                  <span>{t.date}</span>
                </div>
                <div className="talk-title">{t.title}</div>
                <div className="talk-bar">
                  <div className="talk-bar-fill" style={{ width: `${p*100}%` }} />
                  <div className="talk-bar-tick" style={{ left: `${p*100}%` }} />
                </div>
              </div>
              <div className="talk-time">
                {isOn ? formatTime(p * durationSec) + " / " : ""}{t.duration}
              </div>
            </li>
          );
        })}
      </ul>
      {current && (
        <div className="now-playing">
          <div className="np-l">
            <div className="np-pulse"><span/><span/><span/></div>
            <div>
              <div className="np-t">{current.title}</div>
              <div className="np-s">{current.series} · {formatTime(progress * durationSec)} / {current.duration}</div>
            </div>
          </div>
          <button className="np-stop" onClick={()=>setPlaying(null)}>Stop</button>
        </div>
      )}
    </section>
  );
}

function parseDuration(s) {
  const parts = s.split(":").map(Number);
  if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
  return parts[0]*60 + parts[1];
}
function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60), s = sec%60;
  const pad = n => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

// ───────────── schedule ─────────────

function Schedule() {
  return (
    <section className="page schedule">
      <PageTitle eyebrow="04 / Schedule" title="Where Liz is teaching" />
      <p className="page-lede">
        Most retreats are at Wonderwell Mountain Refuge in Springfield, NH.
        Online offerings every Monday night.
      </p>
      <ol className="retreats">
        {RETREATS.map((r, i) => (
          <li key={i} className={cx("retreat", "status-"+r.status)}>
            <div className="re-when">{r.when}</div>
            <div className="re-body">
              <div className="re-title">{r.title}</div>
              <div className="re-where">{r.where}</div>
              <div className="re-kind">{r.kind}</div>
              {r.track && <div className={"re-track track-"+r.track}>{r.track === "wilderness" ? "Wilderness track" : "Plant & practice track"}</div>}
            </div>
            <div className="re-status">
              <span className="re-status-dot"/>
              {labelStatus(r.status)}
            </div>
            <a className="re-cta" href={r.url || "#/contact"} target={r.url ? "_blank" : undefined} rel={r.url ? "noopener noreferrer" : undefined}>Register →</a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function labelStatus(s) {
  return ({ open: "Registration open", waitlist: "Waitlist", "few-spots": "Few spots", ongoing: "Ongoing", application: "Application", "save-the-date": "Save the Date" })[s] || s;
}

// ───────────── books ─────────────

function Books() {
  return (
    <section className="page books">
      <PageTitle eyebrow="05 / Books" title="Three volumes, two finished" />
      <div className="books-grid">
        {BOOKS.map(b => (
          <article key={b.title} className="book">
            <div className="book-cover" style={{ background: b.spineColor }}>
              {b.cover
                ? <img src={b.cover} alt={b.title} className="book-cover-img" />
                : <div className="book-cover-inner">
                    <div className="book-rule" />
                    <div className="book-title">{b.title}</div>
                    <div className="book-sub">{b.sub}</div>
                    <div className="book-author">Elizabeth Monson</div>
                  </div>
              }
              {b.forthcoming && <div className="book-forth">Forthcoming · {b.year}</div>}
            </div>
            <div className="book-meta">
              <div className="book-year">{b.year}</div>
              <div className="book-name">{b.title}</div>
              <div className="book-sub2">{b.publisher || b.sub}</div>
              {b.buy && b.buy.length > 0 && (
                <div className="book-buy">
                  {b.buy.map(link => (
                    <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="book-buy-link">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="books-note">
        Plus essays in <em>Tricycle</em>, <em>Lion's Roar</em>, <em>Buddhadharma</em>,
        and the <em>Journal of the IABS</em>.
      </div>
    </section>
  );
}

// ───────────── pilgrimages ─────────────

function Pilgrimages() {
  return (
    <section className="page pilgrimages">
      <PageTitle eyebrow="06 / Pilgrimages" title="Walking with the Himalayan heart" />
      <p className="page-lede">
        Once a year, a small group travels with Liz to the sacred sites of Bhutan —
        a slow, attentive pilgrimage in the company of monks, prayer flags, and
        long mountain weather.
      </p>
      <div className="pilg-grid">
        <figure className="pilg-img pilg-tall">
          <img src="images/prayer-flags.jpeg" alt="Prayer flags on a Bhutanese ridge"/>
          <figcaption>Prayer flags · Dochula pass</figcaption>
        </figure>
        <figure className="pilg-img pilg-wide">
          <img src="images/bhutan-monk.jpeg" alt="A young monk crosses a courtyard"/>
          <figcaption>A young monk · Bumthang</figcaption>
        </figure>
        <div className="pilg-text">
          <h3>What the days look like</h3>
          <p>
            Mornings begin in the shrine room, before light. We walk to monasteries
            with stone underfoot and butter lamps overhead. Afternoons are
            unhurried — tea, conversation, time with the land. Each evening,
            practice and a short teaching.
          </p>
          <p>
            We stay in family-run guesthouses where possible. The pace is gentle.
            The country is steep. The point is not to see Bhutan — it is to let
            Bhutan see you.
          </p>
        </div>
        <figure className="pilg-img pilg-tall">
          <img src="images/sky.jpeg" alt="High sky over the Himalayas"/>
          <figcaption>Above Trongsa</figcaption>
        </figure>
        <div className="pilg-cta">
          <div className="pilg-cta-h">Next pilgrimage</div>
          <div className="pilg-cta-d">September 3 – 14, 2026</div>
          <div className="pilg-cta-w">Paro · Thimphu · Bumthang</div>
          <a href="#/contact" className="btn">Request the itinerary →</a>
        </div>
      </div>
    </section>
  );
}

// ───────────── contact ─────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", reason: "retreat", note: "" });
  const [sent, setSent] = useState(false);
  const onSubmit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <section className="page contact">
      <PageTitle eyebrow="07 / Contact" title="Write a letter" />
      <div className="contact-grid">
        <div className="contact-text">
          <p>
            Liz reads what arrives. Replies are slow but real. For booking,
            press, and sangha questions — the form to the right will reach her
            assistant first, then her.
          </p>
          <div className="contact-direct">
            <div className="cd-row"><span>Email</span><a href="mailto:liz@lamaliz.org">liz@lamaliz.org</a></div>
            <div className="cd-row"><span>Wonderwell</span><a href="https://wonderwellrefuge.org" target="_blank" rel="noreferrer">wonderwellrefuge.org</a></div>
            <div className="cd-row"><span>NDF</span><a href="https://naturaldharma.org" target="_blank" rel="noreferrer">naturaldharma.org</a></div>
          </div>
        </div>
        {sent ? (
          <div className="contact-form sent">
            <div className="ok-mark">✓</div>
            <h3>Letter received</h3>
            <p>Thank you. Someone will write back within a week. May you be well in the meantime.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              <span>Your name</span>
              <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            </label>
            <label>
              <span>What's this about?</span>
              <select value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})}>
                <option value="retreat">A retreat or teaching</option>
                <option value="pilgrimage">The Bhutan pilgrimage</option>
                <option value="press">Press or interview</option>
                <option value="dharma">A dharma question</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label>
              <span>Your note</span>
              <textarea rows="5" value={form.note} onChange={e=>setForm({...form, note:e.target.value})} />
            </label>
            <button type="submit" className="btn">Send the letter →</button>
          </form>
        )}
      </div>
    </section>
  );
}

// ───────────── shared ─────────────

function PageTitle({ eyebrow, title }) {
  return (
    <header className="page-title">
      <div className="pt-eyebrow">{eyebrow}</div>
      <h1 dangerouslySetInnerHTML={{ __html: title }} />
    </header>
  );
}

function Leaf() {
  return (
    <svg viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="0.8">
      <path d="M30 4 C 50 24, 50 56, 30 76 C 10 56, 10 24, 30 4 Z" />
      <path d="M30 4 L 30 76" />
      <path d="M30 18 Q 38 22 44 32" />
      <path d="M30 18 Q 22 22 16 32" />
      <path d="M30 32 Q 40 36 46 48" />
      <path d="M30 32 Q 20 36 14 48" />
      <path d="M30 48 Q 38 52 42 62" />
      <path d="M30 48 Q 22 52 18 62" />
    </svg>
  );
}

// ───────────── app ─────────────

function App() {
  const route = useHashRoute();
  const defaults = window.TWEAK_DEFAULTS || { home: "editorial", density: "editorial" };
  const tweakResult = window.useTweaks ? window.useTweaks(defaults) : [defaults, () => {}];
  const tw = tweakResult[0] || defaults;
  const setTweak = tweakResult[1] || (() => {});

  useEffect(() => {
    document.documentElement.dataset.density = tw.density;
    document.documentElement.dataset.home = tw.home;
  }, [tw.density, tw.home]);

  let body;
  switch (route.page) {
    case "about": body = <About/>; break;
    case "writing": body = <Writing/>; break;
    case "essay": body = <Essay slug={route.arg} />; break;
    case "teachings": body = <Teachings/>; break;
    case "schedule": body = <Schedule/>; break;
    case "books": body = <Books/>; break;
    case "pilgrimages": body = <Pilgrimages/>; break;
    case "contact": body = <Contact/>; break;
    default:
      body = tw.home === "manuscript" ? <HomeManuscript/>
           : tw.home === "window" ? <HomeWindow/>
           : <HomeEditorial/>;
  }

  return (
    <div className="site">
      <Header route={route} />
      <main key={route.page + (route.arg || "") + tw.home} className="site-main fade-in">
        {body}
      </main>
      <Footer />
      <Tweaks tweaks={tw} setTweak={setTweak} />
    </div>
  );
}

function Tweaks({ tweaks, setTweak }) {
  const TP = window.TweaksPanel, TS = window.TweakSection, TR = window.TweakRadio, TSel = window.TweakSelect;
  if (!TP) return null;
  return (
    <TP title="Tweaks">
      <TS title="Home layout">
        <TSel
          label="Variation"
          value={tweaks.home}
          onChange={(v)=>setTweak("home", v)}
          options={["editorial", "manuscript", "window"]}
        />
        <div className="tw-hint">
          Three takes on the landing page. Editorial is closest to the reference.
          Manuscript is centered, typographic. Window leads with a full-bleed image.
        </div>
      </TS>
      <TS title="Density">
        <TR
          label="Spacing"
          value={tweaks.density}
          onChange={(v)=>setTweak("density", v)}
          options={["airy","editorial","tight"]}
        />
      </TS>
    </TP>
  );
}

window.LizApp = App;
