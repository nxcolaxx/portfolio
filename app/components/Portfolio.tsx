// @ts-nocheck
"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ============================================================
   NICOLAS BONATI — PORTFOLIO  ·  v0.4  (multi-page)
   Creative Strategist & Cultural Researcher
   Pages: Home · Work · About · Contact
   Editorial-architectural · light · index-plus-drawer
   ============================================================

   >> WHEN YOU MOVE THIS TO CLAUDE CODE / NEXT.JS:
   1. PORTRAIT_URL — put your photo file in the project's
      /public folder and set the path here, e.g. "/nicolas.jpg".
      While empty (""), the "NB" placeholder shows instead.
   2. Videos — each project below can take a `youtube` id
      (just the id, e.g. "zJxoSBI1XFU"). While empty, the
      placeholder card shows. YouTube works fine for embeds.
   ============================================================ */

const PORTRAIT_URL = "/nicolas.jpg"; // e.g. "/nicolas.jpg" once hosted

/* ============================================================
   These live at module scope on purpose. Defined inside Portfolio,
   every render created a new component type, so React unmounted and
   remounted the whole grid — images and YouTube iframes included —
   each time a case was opened. That was the stutter.
   ============================================================ */

/* card thumbnail: explicit thumb, an image, or the YouTube still */
const thumbOf = (proj) =>
  proj.thumb || proj.image ||
  (proj.youtube ? `https://img.youtube.com/vi/${proj.youtube}/maxresdefault.jpg` : null);

/* a metric only reads as a headline number if it actually has a digit */
const hasNumbers = (proj) => Boolean(proj.metrics?.[0] && /\d/.test(proj.metrics[0].v));

/* the visual card: image, one-line pitch, two headline numbers */
const ProjectCard = ({ proj, ac, open, onToggle, openLabel, closeLabel }) => {
  const thumb = thumbOf(proj);
  return (
    <button className={"nb-card" + (open ? " is-open" : "")} onClick={onToggle} aria-expanded={open}>
      <div className={"nb-card-media" + (thumb ? "" : " blank")}
        style={thumb ? {} : { background: ac + "1f", color: ac }}>
        {thumb ? (
          <img src={thumb} alt={proj.title} loading="lazy" decoding="async" />
        ) : (
          <span className="initial">{proj.title.charAt(0)}</span>
        )}
        {proj.badge && <span className="nb-card-badge">{proj.badge}</span>}
        {proj.youtube && (
          <span className="nb-card-play">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5v11l9-5.5-9-5.5z" fill="#1a1a17" />
            </svg>
          </span>
        )}
      </div>
      <div className="nb-card-body">
        <div className="nb-card-meta">{proj.meta}</div>
        <div className="nb-card-name">{proj.title}</div>
        <p className="nb-card-pitch">{proj.pitch}</p>
        <div className="nb-card-nums">
          {hasNumbers(proj) ? (
            proj.metrics.slice(0, 2).map((m, k) => (
              <div key={k}>
                <div className="nb-card-num-v" style={{ color: ac }}>{m.v}</div>
                <div className="nb-card-num-l">{m.l}</div>
              </div>
            ))
          ) : (
            <div className="nb-tags" style={{ marginBottom: 0 }}>
              {proj.tags.map((tg, k) => <span className="nb-tag" key={k}>{tg}</span>)}
            </div>
          )}
        </div>
        <div className="nb-card-foot">
          <span className="sign" style={{ color: ac }}>{open ? "—" : "+"}</span>
          {open ? closeLabel : openLabel}
        </div>
      </div>
    </button>
  );
};

/* the full case, opened in place under the card */
const CaseDetail = ({ proj, ac, labels, onClose }) => {
  const hasBoard = Boolean(proj.boardImage);
  const copyBlock = (
    <div className="nb-drawer-copy">
      <div className="nb-tags">
        {proj.tags.map((tg, k) => <span className="nb-tag" key={k}>{tg}</span>)}
      </div>
      <p>{proj.p1}</p>
      <p>{proj.p2}</p>
      {proj.metrics && (
        <div className="nb-metrics">
          {proj.metrics.map((m, k) => (
            <div className="nb-metric" key={k}>
              <div className="nb-metric-v" style={{ color: ac }}>{m.v}</div>
              <div className="nb-metric-l">{m.l}</div>
            </div>
          ))}
        </div>
      )}
      <div className="nb-credit">
        <div className="nb-credit-row">
          <span className="nb-credit-k">{labels.roleLabel}</span>
          <span className="nb-credit-v">{proj.role}</span>
        </div>
        {proj.recognition && (
          <div className="nb-credit-row">
            <span className="nb-credit-k">{labels.recogLabel}</span>
            <span className="nb-credit-v">{proj.recognition}</span>
          </div>
        )}
        {proj.partners && (
          <div className="nb-credit-row">
            <span className="nb-credit-k">{labels.partnersLabel}</span>
            <span className="nb-credit-v">{proj.partners}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="nb-case">
      <div className="nb-case-top">
        <div className="nb-case-title">{proj.title}</div>
        <button className="nb-case-close" onClick={onClose}>
          {labels.closeLabel} <span style={{ fontSize: 13, lineHeight: 1 }}>✕</span>
        </button>
      </div>
      <div className={"nb-case-grid" + (hasBoard ? " stacked" : "")}>
        {proj.youtube ? (
          <div className="nb-media has-embed">
            <iframe
              src={`https://www.youtube.com/embed/${proj.youtube}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, borderRadius: 4 }}
            />
          </div>
        ) : !hasBoard ? (
          <div className="nb-media" style={{ background: ac + "1f" }}>
            <span className="play" style={{ background: ac }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M5 3.5v11l9-5.5-9-5.5z" fill="#fff" />
              </svg>
            </span>
            <span className="play-label" style={{ color: ac }}>{labels.videoLabel}</span>
          </div>
        ) : null}
        {copyBlock}
      </div>
      {proj.boardImage && (
        <div className="nb-block" style={{ marginTop: 28, marginBottom: 0 }}>
          <div className="nb-block-label" style={{ color: ac }}>{proj.boardLabel}</div>
          {/* width/height reserve the row so the panel does not jump when it decodes */}
          <div className="nb-board">
            <img
              src={proj.boardImage}
              alt={`${proj.title} — board`}
              width={proj.boardW}
              height={proj.boardH}
              decoding="async"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* card grid; the open case takes a full-width row under its card */
const ProjectGrid = ({ items, accents, openIndex, onToggle, labels }) => (
  <div className="nb-cards">
    {items.map((proj, i) => {
      const ac = accents[i % accents.length];
      const open = openIndex === i;
      return (
        <React.Fragment key={proj.title}>
          <ProjectCard
            proj={proj}
            ac={ac}
            open={open}
            onToggle={() => onToggle(open ? null : i)}
            openLabel={labels.openLabel}
            closeLabel={labels.closeLabel}
          />
          {open && (
            <CaseDetail proj={proj} ac={ac} labels={labels} onClose={() => onToggle(null)} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const ResultsBand = ({ results, accents }) => (
  <div className="nb-results rv d1">
    {results.map((r, i) => (
      <div className="nb-result" key={i}>
        <div className="nb-result-v" style={{ color: accents[i % accents.length] }}>{r.v}</div>
        <div className="nb-result-l">{r.l}</div>
      </div>
    ))}
  </div>
);

export default function Portfolio() {
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openProject, setOpenProject] = useState(null);
  const [openMore, setOpenMore] = useState(null);

  const accents = ["#B7780F", "#DD4A27", "#CE2A86", "#2F6B41", "#1f2eff"];

  /* ---------------------------- COPY ---------------------------- */
  const copy = {
    en: {
      nav: { home: "Home", work: "Work", about: "About", contact: "Contact" },
      hero: {
        eyebrow: "Creative Strategist & Cultural Researcher",
        name1: "Nicolas",
        name2: "Bonati",
        tagline: "Strategy with cultural depth. Content with intent.",
        metaA: "Talent — Neutrogena",
        metaB: "São Paulo, Brazil",
        metaC: "Open to select projects",
        cue: "Selected work",
      },
      approach: {
        kicker: "Approach",
        title: "",
        items: [
          { n: "i", title: "Creative Strategy", body: "From cultural insight to concept, with the rigor of someone who used to validate hypotheses for a living." },
          { n: "ii", title: "Content Direction", body: "Concept, creation, campaign, production — leading teams end-to-end. From the idea to the post going live: real-time activations, launches and brand worlds with a creative point of view." },
          { n: "iii", title: "Cultural Research", body: "Audience behavior, subcultures, micro-trends. The work that happens before the brief." },
        ],
      },
      work: {
        kicker: "Selected Work",
        title: "Three projects, one obsession — making brands feel like culture.",
        hint: "Tap a project to open the case",
        roleLabel: "Role",
        recogLabel: "Recognition",
        partnersLabel: "Partners",
        videoLabel: "video — coming soon",
        openLabel: "Open case",
        closeLabel: "Close case",
        resultsLabel: "Results, in short",
        results: [
          { v: "67M", l: "views on campaign films" },
          { v: "39M", l: "impacts across a single World Cup run" },
          { v: "24×", l: "the healthcare category benchmark" },
          { v: "3", l: "international creative awards" },
        ],
        items: [
          {
            title: "Hidden Words",
            meta: "Sanofi · Greenpark · 2024",
            home: true,
            tags: ["Real-time", "AI", "Healthcare"],
            pitch: "Caught a micro-trend and turned it into six brand campaigns in days — 24× the category benchmark.",
            badge: "2 awards",
            p1: `Sanofi Brazil's social strategy runs on social listening. When "hidden words AI" started trending on Google Trends, we moved fast — building a visual campaign tuned to the message and identity of six different brands.`,
            p2: "More than 1,000 AI-generated images across six social posts. The campaign landed far above the healthcare category benchmark, turning a micro-trend into an award-winning real-time activation.",
            metrics: [
              { v: "5.8%", l: "avg. ERR per post — vs 0.24% category benchmark" },
              { v: "1,000+", l: "AI images generated" },
              { v: "8K", l: "organic engagement" },
              { v: "6", l: "brands activated at once" },
            ],
            role: "Creative & content strategy",
            recognition: "Muse Awards — Gold · Prémios Lusófonos — OURO",
            thumb: "/hw-card.jpg",
            boardImage: "/hw-board.jpg",
            boardW: 2000,
            boardH: 1419,
            boardLabel: "The board — full layout",
          },
          {
            title: "Hacking the World Cup",
            home: true,
            meta: "Claro Brasil · Talent · 2026",
            tags: ["Influencers", "Sports", "Product launch"],
            pitch: "220 creators hijacked the World Cup for Claro — 500+ pieces, 39M impacts.",
            p1: "The World Cup belongs to whoever shows up loudest. Claro arrived with 220 influencer names at once and used the tournament to land a product message: the new 5G and Claro Multi benefits.",
            p2: "More than 500 pieces of content built around the calendar of the games, turning a product announcement into something the audience followed like part of the tournament itself.",
            metrics: [
              { v: "39M", l: "impacts" },
              { v: "37M", l: "impressions" },
              { v: "1.3M", l: "organic views" },
              { v: "500+", l: "content pieces" },
              { v: "220", l: "influencer names" },
              { v: "160K", l: "organic interactions" },
            ],
            role: "Influencer strategy & content direction",
          },
          {
            title: "Rio Open",
            meta: "Claro Brasil · Talent · 2025",
            home: true,
            tags: ["Real-time", "Sports", "Brand"],
            pitch: "Ten days of tennis turned into a non-stop content engine for Claro, reaching millions.",
            p1: "Claro's presence at Latin America's biggest tennis event, covered in real time — strategy and creative direction across opportunity, real-time and big-activation fronts.",
            p2: "Partnerships with @newballsplease and content featuring João Fonseca turned ten days of tennis into a continuous content engine reaching millions.",
            metrics: [
              { v: "120+", l: "content pieces live" },
              { v: "Millions", l: "in total reach" },
              { v: "10 days", l: "of real-time coverage" },
            ],
            role: "Content supervision & creative strategy",
            partners: "@newballsplease · João Fonseca",
            youtube: "_r3fTpWwUzA",
          },
          {
            title: "@emmmasays",
            home: true,
            meta: "Independent · Music Industry · 2024 – 25",
            tags: ["Music", "Social", "Growth"],
            pitch: "Built an international artist's channel from zero to 8K fans in six months, shooting across three continents.",
            p1: "An international music artist's channel, built from zero. I designed the creative direction and channel strategy, then a paid-media layer that funneled fans straight to her page.",
            p2: "Production and direction of shootings across three continents — Asia, North America, Europe — anchored by a content system the audience actually wanted to follow.",
            metrics: [
              { v: "+8K", l: "organic followers in 6 months" },
              { v: "12%", l: "avg. engagement rate" },
              { v: "3K", l: "newsletter subscribers" },
              { v: "3", l: "continents shot" },
            ],
            role: "Creative strategy, social & direction",
            youtube: "p7MjzdcvWV0",
          },
          {
            title: "Loft",
            meta: "BFerraz · 2025",
            home: true,
            tags: ["Social strategy", "Creative", "Brand campaign"],
            pitch: "A B2C2B repositioning with Angélica and Luciano Huck that pulled 67M views.",
            badge: "AMPRO Silver",
            p1: "In Brazil, thousands of people still try to rent or sell property on their own — and a lingering distrust of real-estate agencies turns that into bureaucracy, insecurity and headaches. Loft's answer: you can't leave it to luck, you go with who understands.",
            p2: "We opened a B2C2B campaign with a Media for Equity move featuring Loft partners Angélica and Luciano Huck — generating the buzz the brand needed. An integrated campaign of films, merchandising and content built a more trusted, more recognized brand in the real-estate market. I led the social strategy and brought creative insights to the concept.",
            metrics: [
              { v: "67M", l: "film views" },
              { v: "17.2M", l: "merchandising impressions" },
              { v: "10.9M", l: "film reach" },
              { v: "B2C2B", l: "strategic positioning shift" },
            ],
            role: "Social strategy & creative insights",
            recognition: "AMPRO Globes Awards 2025 — Silver, B2B Campaign",
            partners: "BFerraz · B&Partners",
            youtube: "zJxoSBI1XFU",
          },
        ],
      },
      workpage: {
        kicker: "Work",
        title: "Work",
        sub: "Selected projects across brand, sports, music and live events.",
        homeHint: "Three highlights below — see every project on the Work page.",
        homeCta: "See all work",
        featuredLabel: "Featured",
        moreLabel: "More projects",
        moreHint: "Case write-ups in progress",
        wip: "Full case — in progress",
        emptyTitle: "New cases coming soon.",
        emptySub: "This is where ongoing and upcoming projects will land — cases I'm building right now, with real metrics, real craft and real stories. Pop back in.",
        emptyMeta: "Next drop in production",
        backHome: "Back to home",
        more: [
          {
            title: "Longines Horse Show",
            meta: "Prime You · Live Event",
            tags: ["Live event", "Real-time", "Lead gen"],
            line: "Real-time content operation for a high-visibility live event — exclusive coverage that turned brand presence into qualified leads with potential clients.",
          },
          {
            title: "Nilpel",
            meta: "Consumer brand · Freelance · 2024 – now",
            tags: ["Content lead", "Social", "Growth"],
            line: "Content lead, freelance. Built the brand's social presence from zero with a lean team, owning strategy end-to-end.",
          },
          {
            title: "Baixio Turismo",
            meta: "Grupo Prima · BFerraz · 2025",
            tags: ["Brand building", "Influencers", "Tourism"],
            line: "Built the digital positioning of a new national travel destination — managing 5+ profiles and influencer activations.",
          },
          {
            title: "Greenpark — 360° Campaigns",
            meta: "Greenpark · 2023 – 2024",
            tags: ["Digital strategy", "Influencers", "Reporting"],
            line: "Strategic planning of 360° digital campaigns for Kimberly-Clark (Huggies), Unilever Food Solutions and others — influencer activations, multi-channel management and actionable reporting.",
          },
          {
            title: "Colletivo — Creative Content",
            meta: "Colletivo · 2023",
            tags: ["Copywriting", "Content", "Engagement"],
            line: "Content creation and management focused on creative campaigns and engagement strategy for Authentic Feet, Artwalk, Magic Feet and Licor 43.",
          },
        ],
      },
      recognition: {
        kicker: "Recognition",
        awards: [
          { medal: "GOLD", name: "Muse Creative Awards", year: "2024", cat: "Gold — Social Media, Healthcare & Pharma", project: "Sanofi · Hidden Words" },
          { medal: "OURO", name: "Prémios Lusófonos da Criatividade", year: "2024", cat: "OURO — Best Use of Social Media in Real Time", project: "Sanofi · Hidden Words" },
          { medal: "SILVER", name: "AMPRO Globes Awards", year: "2025", cat: "Silver — B2B Campaign", project: "Loft · Vai com quem entende" },
        ],
        clientsLabel: "Brands I've worked with",
        talentLabel: "Talent & creators I've worked alongside",
      },
      profile: {
        kicker: "Profile",
        title: "A behavior-first creative who reads culture for a living.",
        body: "I move between agencies, global brands and the music industry — combining creative vision, broad cultural repertoire and strategic rigor to build narratives that connect brands and people. My background in user behavior and product gives me a rare angle on audiences: I treat strategy as research, and content as its proof.",
        cta: "More about me",
      },
      about: {
        kicker: "About",
        title: "",
        p1: "I read cultural signals — what people watch, share, pretend not to like, secretly do — and turn them into creative strategy that feels less like advertising and more like something audiences were already waiting for.",
        p2: "My path is unusual. I spent the first years of my career studying user behavior inside fintech and product teams. Same craft, different scale: observing how people move, validating hypotheses, leading teams toward something that actually works. I carried that rigor into creative strategy, and it's still the part of my work I'm most proud of.",
        p3: "Today at Talent I lead influencer strategy for Neutrogena, after running content for Claro Brasil — with stops along the way at Loft, Sanofi, Unilever, Huggies, Samsung, Suvinil and international music artists across three continents.",
        capsLabel: "What I bring",
        caps: [
          "Analytical, focused, data-driven — a 360° eye that goes beyond social.",
          "Always tuned to trends and opportunity, with a sharp sense for aesthetics and viral potential.",
          "Influencer work, digital and offline campaigns, live events and social media management.",
          "Self-management in my veins — personal and team organization built for excellence.",
        ],
        pathLabel: "The path",
        pathIntro: "Not a straight line. A method.",
        path: [
          { range: "2025 — now", label: "Talent", body: "Influencer strategy for Neutrogena. Before that, Content Supervisor for Claro Brasil — sports, entertainment and brand: Rio Open, CCXP and streaming launches." },
          { range: "2025", label: "BFerraz", body: "Content Manager, leading the creative and community team for Loft and Baixio. Promoted from Supervisor to Manager." },
          { range: "2024 — 2025", label: "Independent — Music Industry", body: "Creative strategy and direction for international music artists across Asia, North America and Europe. End-to-end creative direction." },
          { range: "2023 — 2024", label: "Greenpark", body: "Digital Brand Strategist. 360° campaigns for Sanofi, Huggies and Unilever. First international recognition." },
          { range: "2023", label: "Colletivo", body: "Content Strategist & Copywriter. Creative campaigns and engagement strategy for Authentic Feet, Artwalk, Magic Feet and Licor 43." },
          { range: "2021 — 2023", label: "K21", body: "Customer Experience & Insights Team Leader. Agile team leadership, hypothesis validation, behavior-led strategy for digital products." },
          { range: "2019 — 2021", label: "Nubank", body: "Customer Experience. Learning to read how people actually move — the foundation everything else is built on." },
        ],
        nowLabel: "Now",
        now: [
          "Leading influencer strategy for Neutrogena at Talent.",
          "Heading content strategy at Nilpel as a freelance project.",
          "Always digging into culture, subcultures and what's about to move.",
        ],
        nowUpdated: "Updated August 2026",
        portraitLabel: "Nicolas Bonati",
        ctaLabel: "Work with me",
      },
      contact: {
        kicker: "Contact",
        title: "Let's talk.",
        sub: "For projects, collaborations, or a coffee about culture.",
        directLabel: "Direct",
        elsewhereLabel: "Elsewhere",
        availLabel: "Availability",
        avail: "Open to select freelance projects and creative partnerships — strategy, content direction and cultural research. Based in São Paulo, working with brands and artists worldwide.",
        whatsapp: "WhatsApp",
        email: "Email",
        responseLabel: "Usually replies within 30 minutes",
      },
      footer: { built: "São Paulo, Brazil", rights: "© 2026 Nicolas Bonati", top: "Back to top", ai: "Designed & built from scratch with AI — concept, copy and code." },
    },

    pt: {
      nav: { home: "Início", work: "Trabalhos", about: "Sobre", contact: "Contato" },
      hero: {
        eyebrow: "Creative Strategist & Cultural Researcher",
        name1: "Nicolas",
        name2: "Bonati",
        tagline: "Estratégia com leitura de cultura. Conteúdo com intenção.",
        metaA: "Talent — Neutrogena",
        metaB: "São Paulo, Brasil",
        metaC: "Aberto a novos projetos",
        cue: "Trabalhos selecionados",
      },
      approach: {
        kicker: "Como eu trabalho",
        title: "",
        items: [
          { n: "i", title: "Estratégia Criativa", body: "Do insight ao conceito — com o rigor de quem já viveu de validar hipótese." },
          { n: "ii", title: "Direção de Conteúdo", body: "Conceito, criação, campanha, produção — lidero times de ponta a ponta. Da ideia ao post no ar: real time, lançamentos e universos de marca com ponto de vista criativo." },
          { n: "iii", title: "Pesquisa Cultural", body: "Comportamento de audiência, subculturas, microtendências. O trabalho que vem antes do briefing." },
        ],
      },
      work: {
        kicker: "Trabalhos Selecionados",
        title: "Três projetos, uma obsessão: fazer marca virar cultura.",
        hint: "Toque num projeto pra abrir o case",
        roleLabel: "Função",
        recogLabel: "Reconhecimento",
        partnersLabel: "Parcerias",
        videoLabel: "vídeo — em breve",
        openLabel: "Abrir case",
        closeLabel: "Fechar case",
        resultsLabel: "Resultados, em resumo",
        results: [
          { v: "67MM", l: "de views em filmes de campanha" },
          { v: "39MM", l: "de impactos numa só Copa do Mundo" },
          { v: "24×", l: "o benchmark da categoria de saúde" },
          { v: "3", l: "prêmios internacionais de criação" },
        ],
        items: [
          {
            title: "Hidden Words",
            meta: "Sanofi · Greenpark · 2024",
            home: true,
            tags: ["Tempo real", "IA", "Saúde"],
            pitch: "Peguei uma microtendência e virei seis campanhas de marca em dias — 24× o benchmark da categoria.",
            badge: "2 prêmios",
            p1: `A social da Sanofi Brasil roda em cima de social listening. Quando "hidden words AI" começou a bombar no Google Trends, a gente agiu rápido: montou uma campanha visual afinada com a mensagem e a identidade de seis marcas ao mesmo tempo.`,
            p2: "Foram mais de 1.000 imagens geradas por IA em seis posts. A campanha estourou o benchmark da categoria de saúde e virou uma ativação premiada — feita em tempo real.",
            metrics: [
              { v: "5,8%", l: "ERR médio por post — contra 0,24% do benchmark" },
              { v: "1.000+", l: "imagens criadas com IA" },
              { v: "8K", l: "de engajamento orgânico" },
              { v: "6", l: "marcas ativadas de uma vez" },
            ],
            role: "Estratégia criativa e de conteúdo",
            recognition: "Muse Awards — Gold · Prémios Lusófonos — OURO",
            thumb: "/hw-card.jpg",
            boardImage: "/hw-board.jpg",
            boardW: 2000,
            boardH: 1419,
            boardLabel: "O board — layout completo",
          },
          {
            title: "Hackeando a Copa",
            home: true,
            meta: "Claro Brasil · Talent · 2026",
            tags: ["Influenciadores", "Esportes", "Lançamento de produto"],
            pitch: "220 criadores hackearam a Copa do Mundo pela Claro — 500+ conteúdos, 39MM de impactos.",
            p1: "Copa é de quem aparece mais alto. A Claro chegou com 220 nomes de influenciador de uma vez e usou o torneio pra entregar uma mensagem de produto: os novos benefícios do 5G e do Claro Multi.",
            p2: "Mais de 500 conteúdos montados em cima do calendário dos jogos — transformando anúncio de produto em algo que a audiência acompanhou como parte do próprio torneio.",
            metrics: [
              { v: "39MM", l: "de impactos" },
              { v: "37MM", l: "de impressões" },
              { v: "1,3MM", l: "de views orgânicas" },
              { v: "500+", l: "conteúdos criados" },
              { v: "220", l: "nomes de influenciador" },
              { v: "160K", l: "interações orgânicas" },
            ],
            role: "Estratégia de influenciadores e direção de conteúdo",
          },
          {
            title: "Rio Open",
            meta: "Claro Brasil · Talent · 2025",
            home: true,
            tags: ["Tempo real", "Esportes", "Branding"],
            pitch: "Dez dias de tênis virando máquina de conteúdo para a Claro, com alcance de milhões.",
            p1: "A presença da Claro no maior torneio de tênis da América Latina, coberta em tempo real — com estratégia e direção criativa em três frentes: oportunidade, real time e grandes ativações.",
            p2: "Parcerias com o @newballsplease e conteúdos com o João Fonseca transformaram dez dias de torneio numa máquina de conteúdo que rodou sem parar e alcançou milhões.",
            metrics: [
              { v: "120+", l: "conteúdos no ar" },
              { v: "Milhões", l: "de alcance" },
              { v: "10 dias", l: "de cobertura ao vivo" },
            ],
            role: "Supervisão de conteúdo e estratégia criativa",
            partners: "@newballsplease · João Fonseca",
            youtube: "_r3fTpWwUzA",
          },
          {
            title: "@emmmasays",
            home: true,
            meta: "Independente · Indústria Musical · 2024 – 25",
            tags: ["Música", "Social", "Crescimento"],
            pitch: "Construí o canal de uma artista internacional do zero a 8K fãs em seis meses, com shooting em três continentes.",
            p1: "O canal de uma artista internacional, construído do zero. Desenhei a direção criativa e a estratégia de canais — e, na sequência, uma camada de mídia paga que levava os fãs direto pra página dela.",
            p2: "Produção e direção de shootings em três continentes — Ásia, América do Norte e Europa — em cima de um sistema de conteúdo que a audiência realmente queria acompanhar.",
            metrics: [
              { v: "+8K", l: "seguidores orgânicos em 6 meses" },
              { v: "12%", l: "de engajamento médio" },
              { v: "3K", l: "inscritos na newsletter" },
              { v: "3", l: "continentes de shooting" },
            ],
            role: "Estratégia criativa, social e direção",
            youtube: "p7MjzdcvWV0",
          },
          {
            title: "Loft",
            meta: "BFerraz · 2025",
            home: true,
            tags: ["Estratégia de social", "Criação", "Campanha de marca"],
            pitch: "Um reposicionamento B2C2B com Angélica e Luciano Huck que rendeu 67MM de views.",
            badge: "AMPRO Prata",
            p1: "No Brasil, milhares de pessoas ainda tentam alugar ou vender imóvel por conta própria — e a desconfiança com imobiliárias transforma isso em burocracia, insegurança e dor de cabeça. A resposta da Loft: não dá pra contar com a sorte, vai com quem entende.",
            p2: "Abrimos uma campanha B2C2B com uma ação de Media for Equity estrelada pelos sócios da marca, Angélica e Luciano Huck — gerando o buzz que a Loft precisava. Uma campanha integrada de filmes, merchans e conteúdo construiu uma marca mais confiável e reconhecida no mercado imobiliário. Cuidei da estratégia de social e trouxe insights criativos pro conceito.",
            metrics: [
              { v: "67MM", l: "de views nos filmes" },
              { v: "17,2MM", l: "de impactos em merchans" },
              { v: "10,9MM", l: "de alcance nos filmes" },
              { v: "B2C2B", l: "virada de posicionamento" },
            ],
            role: "Estratégia de social e insights criativos",
            recognition: "AMPRO Globes Awards 2025 — Prata, Campanha B2B",
            partners: "BFerraz · B&Partners",
            youtube: "zJxoSBI1XFU",
          },
        ],
      },
      workpage: {
        kicker: "Trabalhos",
        title: "Trabalhos",
        sub: "Uma seleção de projetos entre branding, esportes, música e eventos ao vivo.",
        homeHint: "Três destaques aqui embaixo — o resto tá todo na aba Trabalhos.",
        homeCta: "Ver todos os trabalhos",
        featuredLabel: "Destaques",
        moreLabel: "Outros projetos",
        moreHint: "Cases ainda em construção",
        wip: "Case completo — em breve",
        emptyTitle: "Novos cases chegando em breve.",
        emptySub: "É aqui que os projetos em andamento e os próximos vão pousar — cases que estou construindo agora, com métricas reais, craft e história. Volta pra acompanhar.",
        emptyMeta: "Próximo drop em produção",
        backHome: "Voltar para o início",
        more: [
          {
            title: "Longines Horse Show",
            meta: "Prime You · Evento ao Vivo",
            tags: ["Evento ao vivo", "Tempo real", "Geração de leads"],
            line: "Operação de conteúdo em tempo real num evento ao vivo de alta visibilidade — cobertura exclusiva que transformou presença de marca em lead qualificado com potencial cliente.",
          },
          {
            title: "Nilpel",
            meta: "Marca de consumo · Freelance · 2024 – atual",
            tags: ["Content lead", "Social", "Crescimento"],
            line: "Content lead, como freelancer. Construí a presença social da marca do zero, com time enxuto e cuidando da estratégia de ponta a ponta.",
          },
          {
            title: "Baixio Turismo",
            meta: "Grupo Prima · BFerraz · 2025",
            tags: ["Construção de marca", "Influenciadores", "Turismo"],
            line: "Construí o posicionamento digital de um novo destino nacional — com gestão de mais de 5 perfis e ativações com influenciadores.",
          },
          {
            title: "Greenpark — Campanhas 360°",
            meta: "Greenpark · 2023 – 2024",
            tags: ["Estratégia digital", "Influenciadores", "Relatórios"],
            line: "Planejamento de campanhas digitais 360° para Kimberly-Clark (Huggies), Unilever Food Solutions e outras — ativações com influenciadores, gestão multicanal e relatórios que viravam ação.",
          },
          {
            title: "Colletivo — Conteúdo Criativo",
            meta: "Colletivo · 2023",
            tags: ["Copywriting", "Conteúdo", "Engajamento"],
            line: "Criação e gestão de conteúdo com foco em campanhas criativas e engajamento para Authentic Feet, Artwalk, Magic Feet e Licor 43.",
          },
        ],
      },
      recognition: {
        kicker: "Prêmios",
        awards: [
          { medal: "GOLD", name: "Muse Creative Awards", year: "2024", cat: "Gold — Social Media, Healthcare & Pharma", project: "Sanofi · Hidden Words" },
          { medal: "OURO", name: "Prémios Lusófonos da Criatividade", year: "2024", cat: "OURO — Melhor Uso de Redes Sociais em Tempo Real", project: "Sanofi · Hidden Words" },
          { medal: "PRATA", name: "AMPRO Globes Awards", year: "2025", cat: "Prata — Campanha B2B", project: "Loft · Vai com quem entende" },
        ],
        clientsLabel: "Marcas por onde já passei",
        talentLabel: "Talentos e criadores com quem já trabalhei",
      },
      profile: {
        kicker: "Perfil",
        title: "Um criativo movido a comportamento — que lê cultura pra viver.",
        body: "Eu transito entre agências, marcas globais e a indústria musical, juntando visão criativa, repertório cultural e rigor de estratégia pra construir narrativas que aproximam marcas e pessoas. Minha base em comportamento de usuário e produto me dá um ângulo raro sobre audiência: pra mim, estratégia é pesquisa — e conteúdo é a prova de que ela funcionou.",
        cta: "Mais sobre mim",
      },
      about: {
        kicker: "Sobre",
        title: "",
        p1: "Eu leio sinais culturais — o que as pessoas assistem, compartilham, fingem não curtir, fazem escondido — e transformo isso em estratégia criativa. O resultado parece menos com propaganda e mais com algo que a audiência já estava esperando.",
        p2: "Minha trajetória foge do óbvio. Passei os primeiros anos da carreira estudando comportamento de usuário em times de produto e fintech. É o mesmo ofício, só que em outra escala: olhar como as pessoas se movem, validar hipótese, conduzir time até algo que funciona de verdade. Levei esse rigor pra criação — e até hoje é a parte do meu trabalho de que mais me orgulho.",
        p3: "Hoje, na Talent, cuido da estratégia de influenciadores da Neutrogena — depois de tocar o conteúdo da Claro Brasil e de passar por Loft, Sanofi, Unilever, Huggies, Samsung, Suvinil e artistas internacionais em três continentes.",
        capsLabel: "O que eu trago",
        caps: [
          "Analítico, focado e movido a dados — com um olhar 360° que não para no social.",
          "Sempre de olho em trend e oportunidade, com faro pra estética e pra potencial de viralizar.",
          "Rodo influenciador, campanha digital e offline, evento e gestão de social.",
          "Autogestão na veia — organização minha e do time montada pra entregar com excelência.",
        ],
        pathLabel: "A trajetória",
        pathIntro: "Não é uma linha reta. É um método.",
        path: [
          { range: "2025 — agora", label: "Talent", body: "Estratégia de influenciadores da Neutrogena. Antes, Supervisor de Conteúdo da Claro Brasil — esportes, entretenimento e branding: Rio Open, CCXP e lançamentos em streaming." },
          { range: "2025", label: "BFerraz", body: "Gerente de Conteúdo, à frente do time de criação e community management de Loft e Baixio. Promovido de Supervisor a Gerente." },
          { range: "2024 — 2025", label: "Independente — Indústria Musical", body: "Estratégia e direção criativa para artistas internacionais na Ásia, América do Norte e Europa. Direção criativa de ponta a ponta." },
          { range: "2023 — 2024", label: "Greenpark", body: "Digital Brand Strategist. Campanhas 360° para Sanofi, Huggies e Unilever. Primeiro reconhecimento internacional." },
          { range: "2023", label: "Colletivo", body: "Content Strategist & Copywriter. Campanhas criativas e estratégia de engajamento para Authentic Feet, Artwalk, Magic Feet e Licor 43." },
          { range: "2021 — 2023", label: "K21", body: "Líder do time de Customer Experience & Insights. Liderança de times ágeis, validação de hipótese e estratégia movida a comportamento para produtos digitais." },
          { range: "2019 — 2021", label: "Nubank", body: "Customer Experience. Onde aprendi a ler como as pessoas realmente se movem — a base de tudo que veio depois." },
        ],
        nowLabel: "Agora",
        now: [
          "Cuidando da estratégia de influenciadores da Neutrogena, na Talent.",
          "Tocando a estratégia de conteúdo da Nilpel como projeto freelance.",
          "Sempre cavando cultura, subcultura e o que está prestes a virar tendência.",
        ],
        nowUpdated: "Atualizado em agosto de 2026",
        portraitLabel: "Nicolas Bonati",
        ctaLabel: "Bora trabalhar juntos",
      },
      contact: {
        kicker: "Contato",
        title: "Vamos conversar.",
        sub: "Pra projeto, parceria ou um café sobre cultura.",
        directLabel: "Direto",
        elsewhereLabel: "Em outros cantos",
        availLabel: "Disponibilidade",
        avail: "Aberto a projetos freelance e parcerias criativas — estratégia, direção de conteúdo e pesquisa cultural. Fico em São Paulo, mas trabalho com marca e artista do mundo todo.",
        whatsapp: "WhatsApp",
        email: "Email",
        responseLabel: "Costumo responder em até 30 minutos",
      },
      footer: { built: "São Paulo, Brasil", rights: "© 2026 Nicolas Bonati", top: "Voltar ao topo", ai: "Concebido e construído do zero com IA — conceito, texto e código." },
    },
  };

  const t = copy[lang];
  // home leads with the three flagged in the copy — by flag, not by index,
  // so adding or reordering a case can't silently change the highlights
  const homeHighlights = t.work.items.filter((p) => p.home);
  const clients = ["Claro", "Neutrogena", "Sanofi", "Unilever", "Huggies", "Samsung", "Suvinil", "Loft", "Licor 43", "Nubank", "Baixio", "Grupo Afeet"];
  const talent = ["Anitta", "Luciano Huck", "Angélica", "Giovanna Ewbank", "Bruno Gagliasso", "Tiago Leifert", "Cazé TV", "João Fonseca", "Paulo Vieira", "Irmãos Fittipaldi", "Victoria Barros", "Jorginho Menzinho", "Bravaff", "Leo Puricelli", "Gabi Marx", "Cristian Pop", "emmma says", "Kady Zadora", "Vic Hollo", "Giulia Porro", "Alice Fleury", "Ray Neon", "Tata Estanieck", "Bri Meio Brasileira", "Fabão", "Rafa Tuma", "Jojoca", "Pedro Faria", "Fla Bandoni", "Marina Guaragna"];

  /* ---------------------------- SCROLL ---------------------------- */
  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(h > 0 ? Math.min(100, (y / h) * 100) : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  /* ---- scroll to top whenever the page changes; close any open case ---- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setOpenProject(null);
  }, [page]);

  /* ---------------------------- REVEAL ---------------------------- */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    const els = document.querySelectorAll(".rv");
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, page]);

  const nav = (p) => {
    setMenuOpen(false);
    setPage(p);
  };

  return (
    <div className="nb">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Hanken+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .nb {
          --bg: #f1f0ec;
          --bg-2: #fbfbf9;
          --ink: #1a1a17;
          --ink-soft: #6c6b63;
          --ink-faint: #a3a299;
          --line: #dddbd2;
          --line-soft: #e6e4dc;
          --accent: #1f2eff;
          --display: 'Bricolage Grotesque', sans-serif;
          --sans: 'Hanken Grotesk', system-ui, sans-serif;
          --mono: 'JetBrains Mono', ui-monospace, monospace;
          background: linear-gradient(180deg, #f3f2ee 0%, #edece7 100%);
          background-attachment: fixed;
          color: var(--ink);
          font-family: var(--sans);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .nb * { box-sizing: border-box; margin: 0; padding: 0; }
        .nb button { font-family: inherit; cursor: pointer; }
        .nb a { text-decoration: none; color: inherit; }
        .nb ::selection { background: var(--accent); color: #fff; }

        .nb-progress { position: fixed; top: 0; left: 0; height: 2px;
          background: var(--accent); z-index: 200; transition: width .1s linear; }

        /* ---------- header ---------- */
        .nb-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 150;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 32px; transition: background .35s, border-color .35s, padding .35s;
          border-bottom: 1px solid transparent;
        }
        .nb-header.is-scrolled {
          background: rgba(243,242,238,.82);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border-bottom: 1px solid var(--line);
          padding-top: 12px; padding-bottom: 12px;
        }
        .nb-word {
          font-family: var(--display); font-weight: 600; font-size: 17px;
          letter-spacing: -.02em; display: flex; align-items: center; gap: 7px;
          background: transparent; border: 0;
        }
        .nb-word .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }
        .nb-navset { display: flex; align-items: center; gap: 4px; }
        .nb-navlink {
          font-family: var(--mono); font-size: 12px; letter-spacing: .02em;
          color: var(--ink-soft); padding: 8px 15px; border-radius: 999px;
          transition: color .2s, background .2s; background: transparent; border: 0;
          position: relative;
        }
        .nb-navlink:hover { color: var(--ink); background: rgba(0,0,0,.04); }
        .nb-navlink.on { color: var(--ink); }
        .nb-navlink.on::after {
          content: ""; position: absolute; left: 15px; right: 15px; bottom: 2px;
          height: 2px; background: var(--accent); border-radius: 2px;
        }
        .nb-lang { display: inline-flex; margin-left: 8px; border: 1px solid var(--line);
          border-radius: 999px; padding: 3px; background: var(--bg-2); }
        .nb-lang button { border: 0; background: transparent; border-radius: 999px;
          font-family: var(--mono); font-size: 11px; padding: 5px 11px;
          color: var(--ink-faint); transition: all .2s; }
        .nb-lang button.on { background: var(--ink); color: var(--bg); }
        .nb-burger { display: none; border: 1px solid var(--line); background: var(--bg-2);
          border-radius: 999px; padding: 9px 16px; font-family: var(--mono);
          font-size: 11px; color: var(--ink); }
        .nb-mobile { position: fixed; inset: 0; z-index: 140; background: var(--bg);
          padding: 96px 32px 32px; display: flex; flex-direction: column; gap: 4px; }
        .nb-mobile a { font-family: var(--display); font-size: 13vw; font-weight: 500;
          letter-spacing: -.03em; padding: 12px 0; border-bottom: 1px solid var(--line-soft);
          display: flex; justify-content: space-between; align-items: center; }
        .nb-mobile a .ix { font-family: var(--mono); font-size: 13px; color: var(--ink-faint); }
        .nb-mobile .m-foot { margin-top: auto; display: flex; justify-content: space-between;
          align-items: center; font-family: var(--mono); font-size: 12px; color: var(--ink-soft); }

        /* ---------- layout ---------- */
        .nb-wrap { max-width: 1380px; margin: 0 auto; padding: 0 32px; }
        .nb-section { padding: clamp(52px, 7vh, 96px) 0; }
        .nb-section.tight { padding-top: clamp(28px, 4vh, 52px); }

        .nb-kicker { font-family: var(--mono); font-size: 12px; letter-spacing: .04em;
          color: var(--accent); display: flex; align-items: center; gap: 12px;
          margin-bottom: 34px; }
        .nb-kicker::after { content: ""; flex: 1; height: 1px; background: var(--line); }

        /* ---------- page transition ---------- */
        .nb-page { animation: pageIn .5s cubic-bezier(.16,1,.3,1); }
        @keyframes pageIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        /* ---------- reveal ---------- */
        .rv { opacity: 0; transform: translateY(26px);
          transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
        .rv.is-in { opacity: 1; transform: none; }
        .d1 { transition-delay: .07s; } .d2 { transition-delay: .14s; }
        .d3 { transition-delay: .21s; } .d4 { transition-delay: .28s; }

        /* ---------- hero ---------- */
        .nb-hero { min-height: 100svh; display: flex; flex-direction: column;
          justify-content: center; padding-top: 120px; padding-bottom: 56px; }
        .nb-hero-eyebrow { font-family: var(--mono); font-size: 13px; letter-spacing: .03em;
          color: var(--ink-soft); margin-bottom: 26px; display: flex; align-items: center; gap: 10px; }
        .nb-hero-eyebrow .live { width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent); animation: pulse 2.6s infinite; }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(31,46,255,.45); }
          70% { box-shadow: 0 0 0 12px rgba(31,46,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(31,46,255,0); }
        }
        .nb-hero-name { font-family: var(--display); font-weight: 600;
          font-size: clamp(68px, 14.5vw, 232px); line-height: .9; letter-spacing: -.04em; }
        .nb-hero-name .l2 { display: block; }
        .nb-hero-name .period { color: var(--accent); }
        .nb-hero-head { display: flex; align-items: flex-end;
          gap: clamp(20px, 3vw, 46px); }
        .nb-hero-portrait { width: clamp(104px, 12vw, 186px); aspect-ratio: 1;
          border-radius: 50%; overflow: hidden; flex-shrink: 0;
          background: var(--bg-2); border: 1px solid var(--line);
          margin-bottom: clamp(8px, 1.4vw, 22px);
          transition: transform .5s cubic-bezier(.16,1,.3,1); }
        .nb-hero-portrait:hover { transform: translateY(-4px); }
        /* the source photo is a mirror selfie: zoom past the phone and frame
           the face, which sits up and to the left of centre */
        .nb-hero-portrait img { width: 100%; height: 100%;
          object-fit: cover; display: block;
          transform: scale(1.75); transform-origin: 31% 27%; }
        .nb-hero-bottom { display: flex; justify-content: space-between; align-items: flex-end;
          gap: 40px; margin-top: 46px; flex-wrap: wrap; }
        .nb-hero-tag { font-family: var(--display); font-weight: 400;
          font-size: clamp(21px, 2.5vw, 35px); line-height: 1.18;
          letter-spacing: -.02em; max-width: 17ch; }
        .nb-hero-meta { display: flex; flex-direction: column; gap: 7px; }
        .nb-hero-meta span { font-family: var(--mono); font-size: 12.5px; color: var(--ink-soft);
          display: flex; align-items: center; gap: 9px; }
        .nb-hero-meta span::before { content: ""; width: 5px; height: 5px;
          background: var(--ink-faint); border-radius: 50%; flex-shrink: 0; }
        .nb-hero-meta span:last-child::before { background: var(--accent); }
        .nb-cue { margin-top: 54px; font-family: var(--mono); font-size: 12px;
          color: var(--ink-faint); display: flex; align-items: center; gap: 10px; }
        .nb-cue .arr { animation: bob 2.2s ease-in-out infinite; }
        @keyframes bob { 0%,100%{transform:translateY(0);} 50%{transform:translateY(4px);} }

        /* ---------- page intro (about / contact) ---------- */
        .nb-pagehero { padding-top: 150px; padding-bottom: 20px; }
        .nb-pagehero-name { font-family: var(--display); font-weight: 600;
          font-size: clamp(56px, 10vw, 150px); line-height: .92; letter-spacing: -.04em; }
        .nb-pagehero-name .period { color: var(--accent); }
        .nb-pagehero-sub { font-family: var(--mono); font-size: 13px; color: var(--ink-soft);
          margin-top: 20px; }

        /* ---------- approach (lives on the About page) ---------- */
        .nb-pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: var(--line); border: 1px solid var(--line); }
        .nb-pillar { background: var(--bg); padding: 40px 32px; position: relative; }
        .nb-pillar::before { content: ""; position: absolute; top: 0; left: 0;
          width: 36px; height: 3px; background: var(--accent); }
        .nb-pillar-title { font-family: var(--display); font-weight: 500;
          font-size: clamp(23px, 2.3vw, 31px); letter-spacing: -.02em; margin-bottom: 14px; }
        .nb-pillar-body { font-size: 15px; color: var(--ink-soft); max-width: 34ch; }

        /* ---------- work ---------- */
        .nb-work-head { display: flex; justify-content: space-between; align-items: flex-end;
          gap: 40px; margin-bottom: 18px; flex-wrap: wrap; }
        .nb-work-hint { font-family: var(--mono); font-size: 12px; color: var(--ink-faint);
          display: flex; align-items: center; gap: 8px; white-space: nowrap; }
        .nb-media { aspect-ratio: 16/10; border-radius: 4px; display: flex;
          align-items: center; justify-content: center; flex-direction: column;
          gap: 14px; position: relative; overflow: hidden; }
        .nb-media::after { content: ""; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(135deg, transparent 0 26px, rgba(255,255,255,.5) 26px 27px);
          opacity: .35; pointer-events: none; }
        .nb-media.has-embed::after { display: none; }
        .nb-media .play { width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; z-index: 1; }
        .nb-media .play-label { font-family: var(--mono); font-size: 11px; z-index: 1; }
        .nb-drawer-copy p { font-size: 16.5px; color: var(--ink-soft);
          margin-bottom: 16px; max-width: 48ch; }
        .nb-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
        .nb-tag { font-family: var(--mono); font-size: 11px; padding: 5px 11px;
          border: 1px solid var(--line); border-radius: 999px; color: var(--ink-soft); }
        .nb-metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px;
          background: var(--line); border: 1px solid var(--line); margin: 4px 0 22px; }
        .nb-metric { background: var(--bg); padding: 18px; }
        .nb-metric-v { font-family: var(--display); font-weight: 600;
          font-size: clamp(24px, 2.6vw, 34px); letter-spacing: -.03em; line-height: 1; }
        .nb-metric-l { font-family: var(--mono); font-size: 11px; color: var(--ink-soft);
          margin-top: 8px; line-height: 1.4; }
        .nb-credit { display: flex; flex-direction: column; gap: 12px; }
        .nb-credit-row { display: flex; gap: 16px; padding-top: 12px;
          border-top: 1px solid var(--line-soft); }
        .nb-credit-k { font-family: var(--mono); font-size: 11px; color: var(--ink-faint);
          width: 110px; flex-shrink: 0; padding-top: 2px; }
        .nb-credit-v { font-size: 14px; font-weight: 500; }

        /* ---------- board block inside an open case ---------- */
        .nb-block { margin-bottom: 40px; }
        .nb-block:last-of-type { margin-bottom: 32px; }
        .nb-block-label { font-family: var(--mono); font-size: 12px;
          letter-spacing: .04em; margin-bottom: 16px; }
        .nb-board { border-radius: 4px; overflow: hidden;
          border: 1px solid var(--line); background: var(--bg-2); }
        /* width/height attrs on the img give the browser the intrinsic ratio,
           so the row keeps its height before the image decodes */
        .nb-board img { width: 100%; height: auto; display: block; }

        /* ---------- back link ---------- */
        .nb-backlink { display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--mono); font-size: 12px; color: var(--ink-soft);
          background: transparent; border: 1px solid var(--line);
          border-radius: 999px; padding: 7px 14px; margin-bottom: 28px;
          transition: color .2s, border-color .2s, background .2s, transform .2s;
        }
        .nb-backlink:hover { color: var(--accent); border-color: var(--accent);
          background: var(--bg-2); transform: translateX(-2px); }
        .nb-backlink .arr { font-size: 14px; line-height: 1; }

        /* ---------- more (empty state) ---------- */
        .nb-empty { border: 1px dashed var(--line);
          border-radius: 6px; padding: clamp(44px, 6vh, 72px) 32px;
          display: flex; flex-direction: column; align-items: flex-start;
          gap: 14px; background: var(--bg-2); margin-top: 18px; }
        .nb-empty-title { font-family: var(--display); font-weight: 500;
          font-size: clamp(24px, 3vw, 38px); letter-spacing: -.025em;
          line-height: 1.05; max-width: 22ch; }
        .nb-empty-sub { font-size: 15px; color: var(--ink-soft); max-width: 56ch; }
        .nb-empty-meta { font-family: var(--mono); font-size: 12px;
          color: var(--ink-faint); margin-top: 6px; display: flex;
          align-items: center; gap: 9px; }
        .nb-empty-meta::before { content: ""; width: 7px; height: 7px;
          border-radius: 50%; background: var(--accent); }

        /* ---------- recognition ---------- */
        .nb-awards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          background: var(--line); border: 1px solid var(--line); }
        .nb-award { background: var(--bg); padding: 32px 28px;
          display: flex; flex-direction: column; gap: 18px; }
        .nb-award-top { display: flex; justify-content: space-between; align-items: baseline; }
        .nb-award-medal { font-family: var(--mono); font-size: 11px; letter-spacing: .08em;
          color: var(--accent); border: 1px solid var(--accent);
          padding: 4px 10px; border-radius: 999px; }
        .nb-award-year { font-family: var(--mono); font-size: 12px; color: var(--ink-faint); }
        .nb-award-name { font-family: var(--display); font-weight: 500;
          font-size: clamp(24px, 2.6vw, 36px); letter-spacing: -.025em; line-height: 1.05; }
        .nb-award-cat { font-size: 14.5px; color: var(--ink-soft); }
        .nb-award-proj { font-family: var(--mono); font-size: 12px; color: var(--ink);
          margin-top: auto; padding-top: 14px; border-top: 1px solid var(--line-soft); }
        .nb-strip-label { font-family: var(--mono); font-size: 12px; color: var(--ink-faint);
          letter-spacing: .03em; margin: 64px 0 22px; }
        .nb-marquee { overflow: hidden; border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line); padding: 22px 0;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
        .nb-marquee-track { display: flex; width: max-content; animation: slide 38s linear infinite; }
        .nb-marquee:hover .nb-marquee-track { animation-play-state: paused; }
        @keyframes slide { to { transform: translateX(-50%); } }
        .nb-marquee-item { font-family: var(--display); font-weight: 500;
          font-size: clamp(34px, 5vw, 76px); letter-spacing: -.035em;
          padding: 0 .35em; white-space: nowrap; display: flex; align-items: center; gap: .5em; }
        .nb-marquee-item::after { content: ""; width: 9px; height: 9px; border-radius: 50%;
          background: var(--accent); opacity: .55; }
        .nb-talent { display: flex; flex-wrap: wrap; gap: 10px; }
        .nb-talent span { font-family: var(--sans); font-weight: 500; font-size: 15px;
          padding: 9px 16px; border: 1px solid var(--line); border-radius: 999px;
          background: var(--bg-2); transition: all .2s; }
        .nb-talent span:hover { border-color: var(--ink); transform: translateY(-2px); }

        /* ---------- work link (home) ---------- */
        .nb-worklink { margin-top: 40px; display: flex; align-items: center;
          gap: 22px; flex-wrap: wrap; }
        .nb-worklink-note { font-family: var(--mono); font-size: 12px;
          color: var(--ink-faint); max-width: 34ch; }

        /* ---------- more projects (compact, expandable) ---------- */
        .nb-more-hint { font-family: var(--mono); font-size: 12px;
          color: var(--ink-faint); margin: -14px 0 26px; }
        .nb-more-item { border-top: 1px solid var(--line); }
        .nb-more-item:last-child { border-bottom: 1px solid var(--line); }
        .nb-more-head { width: 100%; background: transparent; border: 0;
          text-align: left; display: grid; grid-template-columns: 48px 1fr auto;
          gap: 28px; padding: 28px 8px; align-items: center;
          transition: background .25s, padding .25s; }
        .nb-more-head:hover { background: var(--bg-2);
          padding-left: 16px; padding-right: 16px; }
        .nb-more-item.open .nb-more-head { background: var(--bg-2); }
        .nb-more-num { font-family: var(--mono); font-size: 13px; color: var(--ink-faint); }
        .nb-more-main { display: flex; flex-direction: column; gap: 12px; }
        .nb-more-top { display: flex; align-items: baseline; gap: 16px; flex-wrap: wrap; }
        .nb-more-name { font-family: var(--display); font-weight: 500;
          font-size: clamp(22px, 2.6vw, 34px); letter-spacing: -.03em; line-height: 1; }
        .nb-more-meta { font-family: var(--mono); font-size: 12px; color: var(--ink-soft); }
        .nb-more-toggle { width: 38px; height: 38px; border-radius: 50%;
          border: 1px solid var(--line); background: var(--bg); display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
          color: var(--ink-soft); transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .25s; }
        .nb-more-item.open .nb-more-toggle { transform: rotate(135deg);
          border-color: var(--accent); color: var(--accent); }
        .nb-more-drawer { display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .5s cubic-bezier(.16,1,.3,1); }
        .nb-more-item.open .nb-more-drawer { grid-template-rows: 1fr; }
        .nb-more-drawer-inner { overflow: hidden; }
        .nb-more-drawer-pad { padding: 4px 8px 32px 84px; display: flex;
          flex-direction: column; gap: 18px; align-items: flex-start; }
        .nb-more-line { font-size: 16px; color: var(--ink-soft); max-width: 64ch; }
        .nb-more-wip { font-family: var(--mono); font-size: 11px; color: var(--ink-faint);
          border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px;
          white-space: nowrap; }

        /* ---------- profile teaser (home) ---------- */
        .nb-profile { display: grid; grid-template-columns: 1fr 1.4fr; gap: 56px;
          align-items: center; }
        .nb-profile-title { font-family: var(--display); font-weight: 400;
          font-size: clamp(28px, 3.6vw, 50px); line-height: 1.08; letter-spacing: -.03em; }
        .nb-profile-body { font-family: var(--display); font-weight: 400;
          font-size: clamp(18px, 1.7vw, 23px); line-height: 1.46; letter-spacing: -.012em;
          color: var(--ink-soft); margin-bottom: 28px; max-width: 54ch; }

        /* ---------- big CTA button ---------- */
        .nb-bigcta { display: inline-flex; align-items: center; gap: 14px;
          background: var(--ink); color: var(--bg); border: 0;
          padding: 18px 26px; border-radius: 4px; font-family: var(--mono);
          font-size: 13px; letter-spacing: .02em; transition: background .25s, transform .25s; }
        .nb-bigcta:hover { background: var(--accent); transform: translateY(-2px); }
        .nb-bigcta svg { transition: transform .25s; }
        .nb-bigcta:hover svg { transform: translate(3px,-3px); }

        /* ---------- about ---------- */
        .nb-about-grid { display: grid; grid-template-columns: 1fr 1.55fr; gap: 56px;
          align-items: start; }
        .nb-portrait { aspect-ratio: 4/5; border: 1px solid var(--line);
          border-radius: 4px; background: var(--bg-2); position: relative; overflow: hidden; }
        .nb-portrait-img { position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; }
        .nb-portrait-grid { position: absolute; inset: 0;
          background-image: linear-gradient(var(--line-soft) 1px, transparent 1px),
            linear-gradient(90deg, var(--line-soft) 1px, transparent 1px);
          background-size: 46px 46px; }
        .nb-portrait-label { position: absolute; left: 14px; bottom: 12px;
          font-family: var(--mono); font-size: 11px; color: #fff;
          background: rgba(0,0,0,.55); padding: 5px 10px; border-radius: 999px;
          backdrop-filter: blur(4px); }
        .nb-portrait .mark { position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%); font-family: var(--display); font-weight: 600;
          font-size: 64px; color: var(--line); letter-spacing: -.04em; }
        .nb-about-body p { font-family: var(--display); font-weight: 400;
          font-size: clamp(18px, 1.65vw, 23px); line-height: 1.46; letter-spacing: -.012em;
          margin-bottom: 22px; max-width: 56ch; }
        .nb-about-body > p:last-of-type { color: var(--ink-soft); }
        .nb-now-block { margin-top: 34px; padding-top: 26px;
          border-top: 1px solid var(--line); }
        /* sub-labels carry no rule line — only the top-level kicker does,
           otherwise every section stacks its own stray horizontal line */
        .nb-sub { font-family: var(--mono); font-size: 12px; color: var(--accent);
          letter-spacing: .03em; margin-bottom: 22px; }
        .nb-path-intro { font-family: var(--display); font-weight: 400;
          font-size: clamp(22px, 2.6vw, 34px); letter-spacing: -.02em;
          color: var(--ink-soft); margin-bottom: 36px; max-width: 20ch; }
        .nb-path-item { display: grid; grid-template-columns: 150px 200px 1fr; gap: 32px;
          padding: 26px 0; border-top: 1px solid var(--line); align-items: baseline; }
        .nb-path-item:last-child { border-bottom: 1px solid var(--line); }
        .nb-path-range { font-family: var(--mono); font-size: 12px; color: var(--ink-faint); }
        .nb-path-label { font-family: var(--display); font-weight: 500;
          font-size: clamp(19px, 2vw, 26px); letter-spacing: -.02em; }
        .nb-path-body { font-size: 14.5px; color: var(--ink-soft); max-width: 52ch; }
        .nb-caps { display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
          background: var(--line); border: 1px solid var(--line); }
        .nb-cap { background: var(--bg); padding: 28px; display: flex; gap: 16px; }
        .nb-cap .cn { font-family: var(--mono); font-size: 12px; color: var(--accent);
          flex-shrink: 0; }
        .nb-cap p { font-size: 15.5px; }
        .nb-now { display: grid; gap: 0; }
        .nb-now-item { display: flex; gap: 18px; padding: 18px 0;
          border-top: 1px solid var(--line-soft); align-items: flex-start; }
        .nb-now-item:first-child { border-top: 0; }
        .nb-now-item .arrow { color: var(--accent); font-family: var(--mono);
          flex-shrink: 0; font-size: 15px; padding-top: 4px; }
        .nb-now-item p { font-family: var(--display); font-weight: 400;
          font-size: clamp(18px, 1.8vw, 24px); letter-spacing: -.015em; line-height: 1.32; }
        .nb-now-updated { font-family: var(--mono); font-size: 11px;
          color: var(--ink-faint); margin-top: 22px; }

        /* ---------- about/contact bottom cta band ---------- */
        .nb-band { margin-top: clamp(44px,6vh,80px); padding: clamp(48px,7vh,90px) 36px;
          background: var(--ink); border-radius: 6px; display: flex;
          justify-content: space-between; align-items: center; gap: 32px; flex-wrap: wrap; }
        .nb-band-title { font-family: var(--display); font-weight: 500; color: var(--bg);
          font-size: clamp(28px, 3.6vw, 52px); letter-spacing: -.03em; line-height: 1.02; }
        .nb-band-title .period { color: var(--accent); }
        .nb-band-cta { display: inline-flex; align-items: center; gap: 12px;
          background: var(--bg); color: var(--ink); border: 0; padding: 18px 26px;
          border-radius: 4px; font-family: var(--mono); font-size: 13px;
          transition: background .25s, color .25s, transform .25s; }
        .nb-band-cta:hover { background: var(--accent); color: #fff; transform: translateY(-2px); }

        /* ---------- contact ---------- */
        .nb-contact-title { font-family: var(--display); font-weight: 500;
          font-size: clamp(64px, 13vw, 200px); line-height: .92; letter-spacing: -.045em; }
        .nb-contact-title .period { color: var(--accent); }
        .nb-contact-sub { font-family: var(--display); font-weight: 400;
          font-size: clamp(20px, 2.4vw, 32px); letter-spacing: -.02em;
          color: var(--ink-soft); margin: 24px 0 56px; max-width: 26ch; }
        .nb-contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
          max-width: 880px; }
        .nb-contact-k { font-family: var(--mono); font-size: 12px; color: var(--ink-faint);
          margin-bottom: 20px; letter-spacing: .03em; }
        .nb-cta { display: inline-flex; align-items: center; justify-content: space-between;
          gap: 24px; width: 100%; max-width: 360px; background: var(--ink); color: #fff;
          padding: 20px 24px; border-radius: 4px; margin-bottom: 12px;
          font-family: var(--mono); font-size: 13px; letter-spacing: .02em;
          transition: background .25s, transform .25s; }
        .nb-cta:hover { background: var(--accent); transform: translateY(-2px); }
        .nb-cta.wa { background: var(--accent); color: #fff; }
        .nb-cta.wa:hover { background: #0f1ad6; }
        .nb-cta.ghost { background: transparent; color: var(--ink); border: 1px solid var(--ink); }
        .nb-cta.ghost:hover { background: var(--ink); color: #fff; }
        .nb-socials { display: flex; flex-direction: column; }
        .nb-social { display: flex; justify-content: space-between; align-items: center;
          padding: 18px 4px; border-top: 1px solid var(--line);
          font-family: var(--display); font-weight: 500;
          font-size: clamp(22px, 2.4vw, 32px); letter-spacing: -.025em;
          transition: padding .25s, color .25s; }
        .nb-social:last-child { border-bottom: 1px solid var(--line); }
        .nb-social:hover { padding-left: 16px; color: var(--accent); }
        .nb-social span { font-family: var(--mono); font-size: 13px; font-weight: 400; }
        .nb-avail { max-width: 880px; margin-top: 56px; padding: 30px 32px;
          border: 1px solid var(--line); border-radius: 4px; background: var(--bg-2); }
        .nb-avail p { font-family: var(--display); font-weight: 400;
          font-size: clamp(18px, 1.9vw, 24px); letter-spacing: -.015em; line-height: 1.4; }
        .nb-avail .resp { font-family: var(--mono); font-size: 12px; color: var(--ink-soft);
          margin-top: 16px; display: flex; align-items: center; gap: 9px; }
        .nb-avail .resp::before { content: ""; width: 7px; height: 7px; border-radius: 50%;
          background: #2F6B41; }

        /* ---------- footer ---------- */
        .nb-footer { border-top: 1px solid var(--line); padding: 26px 32px;
          font-family: var(--mono); font-size: 12px; color: var(--ink-soft); }
        .nb-footer-row { display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 14px; }
        .nb-footer-nav { display: flex; gap: 6px; align-items: center; }
        .nb-footer button { background: 0; border: 0; color: var(--ink-soft);
          font-family: var(--mono); font-size: 12px; transition: color .2s; cursor: pointer; }
        .nb-footer button:hover { color: var(--accent); }
        .nb-footer-ai { margin-top: 16px; padding-top: 16px;
          border-top: 1px solid var(--line-soft); display: flex;
          align-items: center; gap: 9px; color: var(--ink-faint); font-size: 11px; }
        .nb-footer-ai::before { content: ""; width: 6px; height: 6px;
          border-radius: 50%; background: var(--accent); flex-shrink: 0; }

        /* ---------- results band ---------- */
        .nb-results { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
          background: var(--line); border: 1px solid var(--line); }
        .nb-result { background: var(--bg); padding: clamp(22px, 2.6vw, 34px) clamp(18px, 2vw, 26px); }
        .nb-result-v { font-family: var(--display); font-weight: 600;
          font-size: clamp(38px, 4.6vw, 66px); letter-spacing: -.045em; line-height: .95; }
        .nb-result-l { font-family: var(--mono); font-size: 11.5px; color: var(--ink-soft);
          margin-top: 12px; line-height: 1.45; max-width: 22ch; }

        /* ---------- project cards ---------- */
        .nb-cards { display: grid; grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 1.8vw, 24px); }
        .nb-card { text-align: left; background: var(--bg-2); border: 1px solid var(--line);
          border-radius: 6px; overflow: hidden; padding: 0; display: flex;
          flex-direction: column; align-self: start;
          transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .25s, box-shadow .4s; }
        .nb-card:hover { transform: translateY(-4px); border-color: var(--ink);
          box-shadow: 0 20px 44px rgba(0,0,0,.08); }
        .nb-card.is-open { border-color: var(--ink); }
        .nb-card-media { aspect-ratio: 16/10; position: relative; overflow: hidden;
          background: var(--line-soft); flex-shrink: 0; }
        .nb-card-media img { width: 100%; height: 100%; object-fit: cover; display: block;
          transition: transform .7s cubic-bezier(.16,1,.3,1); }
        .nb-card:hover .nb-card-media img { transform: scale(1.045); }
        /* typographic fallback when a project has no image yet */
        .nb-card-media.blank { display: flex; align-items: flex-end; padding: 18px; }
        .nb-card-media.blank .initial { font-family: var(--display); font-weight: 600;
          font-size: clamp(56px, 7vw, 92px); letter-spacing: -.05em; line-height: .8;
          opacity: .9; }
        .nb-card-badge { position: absolute; top: 12px; left: 12px; font-family: var(--mono);
          font-size: 10px; letter-spacing: .07em; text-transform: uppercase;
          padding: 6px 11px; border-radius: 999px; background: rgba(18,18,15,.78);
          color: #fff; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .nb-card-play { position: absolute; bottom: 12px; right: 12px; width: 40px; height: 40px;
          border-radius: 50%; background: rgba(255,255,255,.94); display: flex;
          align-items: center; justify-content: center;
          transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .nb-card:hover .nb-card-play { transform: scale(1.1); }
        .nb-card-body { padding: 20px 20px 22px; display: flex; flex-direction: column;
          gap: 11px; flex: 1; }
        .nb-card-meta { font-family: var(--mono); font-size: 11px; color: var(--ink-soft);
          letter-spacing: .02em; }
        .nb-card-name { font-family: var(--display); font-weight: 500;
          font-size: clamp(25px, 2.5vw, 34px); letter-spacing: -.035em; line-height: 1.02; }
        .nb-card-pitch { font-size: 14.5px; color: var(--ink-soft); line-height: 1.5; }
        .nb-card-nums { display: flex; gap: 20px; margin-top: auto; padding-top: 15px;
          border-top: 1px solid var(--line-soft); }
        .nb-card-num-v { font-family: var(--display); font-weight: 600; font-size: 26px;
          letter-spacing: -.035em; line-height: 1; }
        .nb-card-num-l { font-family: var(--mono); font-size: 9.5px; color: var(--ink-faint);
          margin-top: 6px; line-height: 1.35; }
        /* no rule above the foot — the numbers block already draws one just above it */
        .nb-card-foot { display: flex; align-items: center; gap: 8px;
          padding-top: 13px;
          font-family: var(--mono); font-size: 11px; color: var(--ink-faint); }
        .nb-card-foot .sign { transition: transform .3s; }
        .nb-card:hover .nb-card-foot .sign { transform: translateX(3px); }

        /* ---------- expanded case panel ---------- */
        .nb-case { grid-column: 1 / -1; border: 1px solid var(--ink);
          border-radius: 6px; background: var(--bg-2);
          padding: clamp(20px, 2.6vw, 36px);
          animation: caseIn .5s cubic-bezier(.16,1,.3,1); }
        @keyframes caseIn { from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: none; } }
        .nb-case-grid { display: grid; grid-template-columns: 1.05fr 1fr;
          gap: clamp(24px, 3vw, 44px); }
        .nb-case-grid.stacked { grid-template-columns: 1fr; }
        .nb-case-top { display: flex; justify-content: space-between; align-items: baseline;
          gap: 20px; margin-bottom: 22px; flex-wrap: wrap; }
        .nb-case-title { font-family: var(--display); font-weight: 500;
          font-size: clamp(28px, 3.2vw, 44px); letter-spacing: -.035em; line-height: 1; }
        .nb-case-close { font-family: var(--mono); font-size: 11px; color: var(--ink-soft);
          background: transparent; border: 1px solid var(--line); border-radius: 999px;
          padding: 7px 14px; display: inline-flex; align-items: center; gap: 8px;
          transition: color .2s, border-color .2s; white-space: nowrap; }
        .nb-case-close:hover { color: var(--accent); border-color: var(--accent); }
        .nb-case .nb-drawer-copy p { font-size: 16px; }
        .nb-case .nb-board { margin-top: 24px; }

        /* ---------- responsive ---------- */
        @media (max-width: 1080px) {
          .nb-cards { grid-template-columns: repeat(2, 1fr); }
          .nb-results { grid-template-columns: repeat(2, 1fr); }
          .nb-case-grid { grid-template-columns: 1fr; }
          .nb-about-grid { grid-template-columns: 1fr; gap: 40px; }
          .nb-profile { grid-template-columns: 1fr; gap: 32px; }
          .nb-path-item { grid-template-columns: 130px 1fr; gap: 8px 24px; }
          .nb-path-body { grid-column: 1 / -1; }
          .nb-awards { grid-template-columns: 1fr; }
        }
        @media (max-width: 820px) {
          .nb-wrap { padding: 0 20px; }
          .nb-header { padding: 14px 20px; }
          .nb-navset { display: none; }
          .nb-burger { display: block; }
          .nb-hero { min-height: 92svh; padding-top: 110px; }
          .nb-hero-bottom { flex-direction: column; align-items: flex-start; gap: 30px; }
          /* the giant name plus a circle will not fit side by side on a phone */
          .nb-hero-head { flex-direction: column-reverse; align-items: flex-start;
            gap: 22px; }
          .nb-hero-portrait { width: 92px; margin-bottom: 0; }
          .nb-pillars { grid-template-columns: 1fr; }
          .nb-awards { grid-template-columns: 1fr; }
          .nb-caps { grid-template-columns: 1fr; }
          .nb-contact-grid { grid-template-columns: 1fr; gap: 36px; }
          .nb-metrics { grid-template-columns: 1fr 1fr; }
          .nb-cards { grid-template-columns: 1fr; }
          .nb-marquee-track { animation-duration: 24s; }
          .nb-band { padding: 40px 26px; }
          .nb-more-head { grid-template-columns: 32px 1fr auto; gap: 14px; padding: 22px 4px; }
          .nb-more-head:hover { padding-left: 4px; padding-right: 4px; }
          .nb-more-drawer-pad { padding-left: 4px; }
          .nb-worklink { gap: 14px; }
        }
        @media (max-width: 480px) {
          .nb-path-item { grid-template-columns: 1fr; }
          .nb-credit-row { flex-direction: column; gap: 4px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nb * { animation: none !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="nb-progress" style={{ width: progress + "%" }} />

      {/* ===================== HEADER ===================== */}
      <header className={"nb-header" + (scrolled ? " is-scrolled" : "")}>
        <button className="nb-word" onClick={() => nav("home")}>
          <span className="dot" /> Nicolas Bonati
        </button>
        <div className="nb-navset">
          <button className={"nb-navlink" + (page === "home" ? " on" : "")} onClick={() => nav("home")}>{t.nav.home}</button>
          <button className={"nb-navlink" + (page === "work" ? " on" : "")} onClick={() => nav("work")}>{t.nav.work}</button>
          <button className={"nb-navlink" + (page === "about" ? " on" : "")} onClick={() => nav("about")}>{t.nav.about}</button>
          <button className={"nb-navlink" + (page === "contact" ? " on" : "")} onClick={() => nav("contact")}>{t.nav.contact}</button>
          <div className="nb-lang">
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")}>PT</button>
          </div>
        </div>
        <button className="nb-burger" onClick={() => setMenuOpen(true)}>MENU</button>
      </header>

      {menuOpen && (
        <div className="nb-mobile">
          <button className="nb-burger" style={{ position: "absolute", top: 14, right: 20 }}
            onClick={() => setMenuOpen(false)}>CLOSE</button>
          <a onClick={() => nav("home")}>{t.nav.home}<span className="ix">01</span></a>
          <a onClick={() => nav("work")}>{t.nav.work}<span className="ix">02</span></a>
          <a onClick={() => nav("about")}>{t.nav.about}<span className="ix">03</span></a>
          <a onClick={() => nav("contact")}>{t.nav.contact}<span className="ix">04</span></a>
          <div className="m-foot">
            <span>São Paulo, BR</span>
            <div className="nb-lang">
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
              <button className={lang === "pt" ? "on" : ""} onClick={() => setLang("pt")}>PT</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== HOME ===================== */}
      {page === "home" && (
        <main className="nb-page">
          {/* hero */}
          <section className="nb-hero nb-wrap">
            <div>
              <div className="nb-hero-eyebrow rv"><span className="live" />{t.hero.eyebrow}</div>
              {/* portrait sits after the name in the DOM so it lands to the
                  right on desktop and flips above the name on narrow screens */}
              <div className="nb-hero-head">
                <h1 className="nb-hero-name rv d1">
                  {t.hero.name1}
                  <span className="l2">{t.hero.name2}<span className="period">.</span></span>
                </h1>
                {PORTRAIT_URL && (
                  <div className="nb-hero-portrait rv d2">
                    <img src={PORTRAIT_URL} alt={t.about.portraitLabel} width={1254} height={1254} />
                  </div>
                )}
              </div>
              <div className="nb-hero-bottom">
                <p className="nb-hero-tag rv d2">{t.hero.tagline}</p>
                <div className="nb-hero-meta rv d3">
                  <span>{t.hero.metaA}</span>
                  <span>{t.hero.metaB}</span>
                  <span>{t.hero.metaC}</span>
                </div>
              </div>
              <div className="nb-cue rv d4"><span className="arr">↓</span> {t.hero.cue}</div>
            </div>
          </section>

          {/* brands — first thing after the hero now that approach moved to About */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-strip-label rv" style={{ marginTop: 0 }}>{t.recognition.clientsLabel}</div>
            <div className="nb-marquee rv">
              <div className="nb-marquee-track">
                {[...clients, ...clients].map((c, i) => <span className="nb-marquee-item" key={i}>{c}</span>)}
              </div>
            </div>
          </section>

          {/* work — 3 highlights, link to full Work page */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-work-head">
              <div className="nb-kicker rv" style={{ marginBottom: 0, flex: 1 }}>{t.work.kicker}</div>
              <div className="nb-work-hint rv d1">
                <span style={{ color: "var(--accent)" }}>+</span> {t.work.hint}
              </div>
            </div>
            <div className="rv d1" style={{ marginTop: 34 }}>
              <ProjectGrid
                items={homeHighlights}
                accents={accents}
                openIndex={openProject}
                onToggle={setOpenProject}
                labels={t.work}
              />
            </div>
            <div className="nb-worklink rv d1">
              <button className="nb-bigcta" onClick={() => nav("work")}>
                {t.workpage.homeCta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
          </section>

          {/* recognition */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-kicker rv">{t.recognition.kicker}</div>
            <div className="nb-awards rv d1">
              {t.recognition.awards.map((a, i) => (
                <div className="nb-award" key={i}>
                  <div className="nb-award-top">
                    <span className="nb-award-medal">{a.medal}</span>
                    <span className="nb-award-year">{a.year}</span>
                  </div>
                  <div className="nb-award-name">{a.name}</div>
                  <div className="nb-award-cat">{a.cat}</div>
                  <div className="nb-award-proj">{a.project}</div>
                </div>
              ))}
            </div>
            <div className="nb-strip-label rv">{t.recognition.talentLabel}</div>
            <div className="nb-talent rv d1">
              {talent.map((p, i) => <span key={i}>{p}</span>)}
            </div>
          </section>

          {/* profile teaser -> about */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-kicker rv">{t.profile.kicker}</div>
            <div className="nb-profile">
              <h2 className="nb-profile-title rv">{t.profile.title}</h2>
              <div className="rv d1">
                <p className="nb-profile-body">{t.profile.body}</p>
                <button className="nb-bigcta" onClick={() => nav("about")}>
                  {t.profile.cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          <footer className="nb-footer">
            <div className="nb-footer-row">
              <span>{t.footer.rights}</span>
              <div className="nb-footer-nav">
                <button onClick={() => nav("home")}>{t.nav.home}</button>·
                <button onClick={() => nav("work")}>{t.nav.work}</button>·
                <button onClick={() => nav("about")}>{t.nav.about}</button>·
                <button onClick={() => nav("contact")}>{t.nav.contact}</button>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{t.footer.top} ↑</button>
            </div>
            <div className="nb-footer-ai">{t.footer.ai}</div>
          </footer>
        </main>
      )}

      {/* ===================== WORK ===================== */}
      {page === "work" && (
        <main className="nb-page">
          <section className="nb-pagehero nb-wrap">
            <button className="nb-backlink rv" onClick={() => nav("home")}>
              <span className="arr">←</span> {t.workpage.backHome}
            </button>
            <h1 className="nb-pagehero-name rv d1">
              {t.workpage.title}<span className="period">.</span>
            </h1>
            <div className="nb-pagehero-sub rv d2">{t.workpage.sub}</div>
          </section>

          {/* results up front — the numbers sell before any copy does */}
          <section className="nb-section nb-wrap tight" style={{ paddingTop: "clamp(20px,3vh,36px)" }}>
            <div className="nb-sub rv">{t.work.resultsLabel}</div>
            <ResultsBand results={t.work.results} accents={accents} />
          </section>

          {/* featured projects — visual cards, case opens in place */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-sub rv">{t.workpage.featuredLabel}</div>
            <div className="rv d1">
              <ProjectGrid
                items={t.work.items}
                accents={accents}
                openIndex={openProject}
                onToggle={setOpenProject}
                labels={t.work}
              />
            </div>
          </section>

          {/* more projects — empty state, will be populated as new cases ship */}
          <section className="nb-section nb-wrap tight">
            <div className="nb-sub rv">{t.workpage.moreLabel}</div>
            {t.workpage.more.length === 0 ? (
              <div className="nb-empty rv d1">
                <h3 className="nb-empty-title">{t.workpage.emptyTitle}</h3>
                <p className="nb-empty-sub">{t.workpage.emptySub}</p>
                <span className="nb-empty-meta">{t.workpage.emptyMeta}</span>
              </div>
            ) : (
              <>
                <div className="nb-more-hint rv">{t.workpage.moreHint}</div>
                <div className="nb-more rv d1">
                  {t.workpage.more.map((m, i) => {
                    const open = openMore === i;
                    return (
                      <div className={"nb-more-item" + (open ? " open" : "")} key={i}>
                        <button className="nb-more-head" onClick={() => setOpenMore(open ? null : i)} aria-expanded={open}>
                          <span className="nb-more-num">{String(i + 1).padStart(2, "0")}</span>
                          <span className="nb-more-main">
                            <span className="nb-more-top">
                              <span className="nb-more-name">{m.title}</span>
                              <span className="nb-more-meta">{m.meta}</span>
                            </span>
                            <span className="nb-tags">
                              {m.tags.map((tg, k) => <span className="nb-tag" key={k}>{tg}</span>)}
                            </span>
                          </span>
                          <span className="nb-more-toggle">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.6" />
                            </svg>
                          </span>
                        </button>
                        <div className="nb-more-drawer">
                          <div className="nb-more-drawer-inner">
                            <div className="nb-more-drawer-pad">
                              <p className="nb-more-line">{m.line}</p>
                              <span className="nb-more-wip">{t.workpage.wip}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div style={{ marginTop: "clamp(32px, 4vh, 56px)" }}>
              <button className="nb-backlink rv" onClick={() => nav("home")}>
                <span className="arr">←</span> {t.workpage.backHome}
              </button>
            </div>

            {/* cta band -> contact */}
            <div className="nb-band rv">
              <div className="nb-band-title">
                {lang === "en" ? <>Let's build something<span className="period">.</span></> : <>Vamos criar algo<span className="period">.</span></>}
              </div>
              <button className="nb-band-cta" onClick={() => nav("contact")}>
                {t.about.ctaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
          </section>

          <footer className="nb-footer">
            <div className="nb-footer-row">
              <span>{t.footer.rights}</span>
              <div className="nb-footer-nav">
                <button onClick={() => nav("home")}>{t.nav.home}</button>·
                <button onClick={() => nav("work")}>{t.nav.work}</button>·
                <button onClick={() => nav("about")}>{t.nav.about}</button>·
                <button onClick={() => nav("contact")}>{t.nav.contact}</button>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{t.footer.top} ↑</button>
            </div>
            <div className="nb-footer-ai">{t.footer.ai}</div>
          </footer>
        </main>
      )}

      {/* ===================== ABOUT ===================== */}
      {page === "about" && (
        <main className="nb-page">
          <section className="nb-pagehero nb-wrap">
            <button className="nb-backlink rv" onClick={() => nav("home")}>
              <span className="arr">←</span> {t.workpage.backHome}
            </button>
            <h1 className="nb-pagehero-name rv d1">
              {lang === "en" ? "About" : "Sobre"}<span className="period">.</span>
            </h1>
            <div className="nb-pagehero-sub rv d2">{t.hero.eyebrow}</div>
          </section>

          <section className="nb-section nb-wrap tight">
            <div className="nb-about-grid">
              <div className="rv">
                <div className="nb-portrait">
                  {PORTRAIT_URL ? (
                    <img src={PORTRAIT_URL} alt="Nicolas Bonati" className="nb-portrait-img" />
                  ) : (
                    <>
                      <div className="nb-portrait-grid" />
                      <div className="mark">NB</div>
                    </>
                  )}
                  <div className="nb-portrait-label">{t.about.portraitLabel}</div>
                </div>
              </div>
              <div className="nb-about-body rv d1">
                <p>{t.about.p1}</p>
                <p>{t.about.p2}</p>
                <p>{t.about.p3}</p>

                {/* "now" sits with the bio so what he does today reads first */}
                <div className="nb-now-block">
                  <div className="nb-sub" style={{ marginBottom: 14 }}>{t.about.nowLabel}</div>
                  <div className="nb-now">
                    {t.about.now.map((n, i) => (
                      <div className="nb-now-item" key={i}>
                        <span className="arrow">→</span>
                        <p>{n}</p>
                      </div>
                    ))}
                  </div>
                  <div className="nb-now-updated">{t.about.nowUpdated}</div>
                </div>
              </div>
            </div>

            {/* approach — moved here from the home page */}
            <div style={{ marginTop: "clamp(40px,5vh,72px)" }}>
              <div className="nb-sub rv">{t.approach.kicker}</div>
              <div className="nb-pillars rv d1" style={{ marginTop: 18 }}>
                {t.approach.items.map((p, i) => (
                  <div className="nb-pillar" key={i}>
                    <h3 className="nb-pillar-title">{p.title}</h3>
                    <p className="nb-pillar-body">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* capabilities — right after the approach */}
            <div style={{ marginTop: "clamp(40px,5vh,72px)" }}>
              <div className="nb-sub rv">{t.about.capsLabel}</div>
              <div className="nb-caps rv d1">
                {t.about.caps.map((c, i) => (
                  <div className="nb-cap" key={i}>
                    <span className="cn">{String(i + 1).padStart(2, "0")}</span>
                    <p>{c}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* path */}
            <div style={{ marginTop: "clamp(40px,5vh,72px)" }}>
              <div className="nb-sub rv">{t.about.pathLabel}</div>
              <p className="nb-path-intro rv d1">{t.about.pathIntro}</p>
              <div className="rv d1">
                {t.about.path.map((p, i) => (
                  <div className="nb-path-item" key={i}>
                    <span className="nb-path-range">{p.range}</span>
                    <span className="nb-path-label">{p.label}</span>
                    <span className="nb-path-body">{p.body}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "clamp(32px, 4vh, 56px)" }}>
              <button className="nb-backlink rv" onClick={() => nav("home")}>
                <span className="arr">←</span> {t.workpage.backHome}
              </button>
            </div>

            {/* cta band -> contact */}
            <div className="nb-band rv">
              <div className="nb-band-title">
                {lang === "en" ? <>Let's build something<span className="period">.</span></> : <>Vamos criar algo<span className="period">.</span></>}
              </div>
              <button className="nb-band-cta" onClick={() => nav("contact")}>
                {t.about.ctaLabel}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </button>
            </div>
          </section>

          <footer className="nb-footer">
            <div className="nb-footer-row">
              <span>{t.footer.rights}</span>
              <div className="nb-footer-nav">
                <button onClick={() => nav("home")}>{t.nav.home}</button>·
                <button onClick={() => nav("work")}>{t.nav.work}</button>·
                <button onClick={() => nav("about")}>{t.nav.about}</button>·
                <button onClick={() => nav("contact")}>{t.nav.contact}</button>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{t.footer.top} ↑</button>
            </div>
            <div className="nb-footer-ai">{t.footer.ai}</div>
          </footer>
        </main>
      )}

      {/* ===================== CONTACT ===================== */}
      {page === "contact" && (
        <main className="nb-page">
          <section className="nb-pagehero nb-wrap">
            <button className="nb-backlink rv" onClick={() => nav("home")}>
              <span className="arr">←</span> {t.workpage.backHome}
            </button>
            <div className="nb-kicker rv">{t.contact.kicker}</div>
            <h1 className="nb-contact-title rv d1">
              {t.contact.title.replace(".", "")}<span className="period">.</span>
            </h1>
            <p className="nb-contact-sub rv d2">{t.contact.sub}</p>
          </section>

          <section className="nb-section nb-wrap tight" style={{ paddingTop: 0 }}>
            <div className="nb-contact-grid">
              <div className="rv d2">
                <div className="nb-contact-k">{t.contact.directLabel}</div>
                <a className="nb-cta wa" href="https://wa.me/5511948856048?text=Oi%20Nicolas%2C%20vim%20pelo%20seu%20portf%C3%B3lio" target="_blank" rel="noopener noreferrer">
                  {t.contact.whatsapp}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </a>
                <a className="nb-cta ghost" href="mailto:nicolasbonati@outlook.com">
                  {t.contact.email}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13L13 3M13 3H5M13 3v8" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </a>
              </div>
              <div className="rv d3">
                <div className="nb-contact-k">{t.contact.elsewhereLabel}</div>
                <div className="nb-socials">
                  <a className="nb-social" href="https://www.linkedin.com/in/nicbonati" target="_blank" rel="noopener noreferrer">
                    LinkedIn <span>↗</span>
                  </a>
                  <a className="nb-social" href="https://www.instagram.com/nxcolax" target="_blank" rel="noopener noreferrer">
                    Instagram <span>↗</span>
                  </a>
                  <a className="nb-social" href="https://www.tiktok.com/@nicolasbonatia" target="_blank" rel="noopener noreferrer">
                    TikTok <span>↗</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="nb-avail rv d2">
              <div className="nb-sub" style={{ marginBottom: 16 }}>{t.contact.availLabel}</div>
              <p>{t.contact.avail}</p>
              <div className="resp">{t.contact.responseLabel}</div>
            </div>

            <div style={{ marginTop: "clamp(32px, 4vh, 56px)" }}>
              <button className="nb-backlink rv" onClick={() => nav("home")}>
                <span className="arr">←</span> {t.workpage.backHome}
              </button>
            </div>
          </section>

          <footer className="nb-footer">
            <div className="nb-footer-row">
              <span>{t.footer.rights}</span>
              <div className="nb-footer-nav">
                <button onClick={() => nav("home")}>{t.nav.home}</button>·
                <button onClick={() => nav("work")}>{t.nav.work}</button>·
                <button onClick={() => nav("about")}>{t.nav.about}</button>·
                <button onClick={() => nav("contact")}>{t.nav.contact}</button>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>{t.footer.top} ↑</button>
            </div>
            <div className="nb-footer-ai">{t.footer.ai}</div>
          </footer>
        </main>
      )}
    </div>
  );
}
