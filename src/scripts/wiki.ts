const root = document.documentElement;
const themeButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-theme]')];

function updateThemeSelection() {
  const theme = root.dataset.tema ?? 'sistema';
  for (const button of themeButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
  }
}

updateThemeSelection();

for (const button of themeButtons) {
  button.addEventListener('click', () => {
    const theme = button.dataset.theme ?? 'sistema';
    if (theme === 'sistema') delete root.dataset.tema;
    else root.dataset.tema = theme;
    try { localStorage.setItem('gwiki-theme', theme); } catch {}
    updateThemeSelection();
  });
}

const track = document.querySelector<HTMLElement>('[data-nav-track]');
const pill = track?.querySelector<HTMLElement>('[data-nav-pill]');
const launcher = track?.querySelector<HTMLButtonElement>('[data-nav-launch]');
const closeMenu = track?.querySelector<HTMLButtonElement>('[data-nav-close]');

if (track && pill && launcher && closeMenu) {
  const compact = matchMedia('(max-width: 760px), (pointer: coarse), (max-width: 1024px) and (max-height: 540px)');
  const disclosures = [...track.querySelectorAll<HTMLDetailsElement>('[data-nav-disclosure]')];
  let hovered: HTMLElement | null = null;
  const asNavItem = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLElement>('[data-nav-item]') : null;

  const updatePill = () => {
    const focused = asNavItem(document.activeElement);
    const current = track.querySelector<HTMLElement>('details[open] > [data-nav-item]')
      ?? track.querySelector<HTMLElement>('[data-nav-item][aria-current]');
    const item = hovered ?? focused ?? current;
    if (!item?.getClientRects().length) {
      pill.removeAttribute('data-visible');
      return;
    }
    const itemRect = item.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    pill.style.width = itemRect.width + 'px';
    pill.style.height = itemRect.height + 'px';
    const x = itemRect.left - trackRect.left - track.clientLeft;
    const y = itemRect.top - trackRect.top - track.clientTop;
    pill.style.transform = `translate(${x}px, ${y}px)`;
    pill.setAttribute('data-visible', '');
  };

  const setMenu = (open = false, focus = false) => {
    if (compact.matches) track.dataset.mobileMenu = open ? 'open' : 'closed';
    else delete track.dataset.mobileMenu;
    for (const disclosure of disclosures) disclosure.open = false;
    hovered = null;
    launcher.setAttribute('aria-expanded', String(open));
    if (focus) (open ? track.querySelector<HTMLElement>('.nav-brand') : launcher)?.focus({ preventScroll: true });
    updatePill();
  };

  setMenu();
  track.setAttribute('data-nav-ready', '');
  compact.addEventListener('change', () => {
    const focused = track.contains(document.activeElement);
    setMenu(false, compact.matches && focused);
    if (focused && !compact.matches) track.querySelector<HTMLElement>('.nav-brand')?.focus({ preventScroll: true });
  });
  new ResizeObserver(updatePill).observe(track);
  launcher.addEventListener('click', () => setMenu(true, true));
  closeMenu.addEventListener('click', () => setMenu(false, true));

  track.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'touch') return;
    hovered = asNavItem(event.target);
    updatePill();
  });
  track.addEventListener('pointerleave', () => {
    hovered = null;
    updatePill();
  });
  track.addEventListener('focusin', updatePill);
  track.addEventListener('focusout', () => queueMicrotask(updatePill));

  for (const disclosure of disclosures) {
    disclosure.addEventListener('toggle', () => {
      if (disclosure.open) {
        for (const other of disclosures) if (other !== disclosure) other.open = false;
      }
      updatePill();
    });
  }

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node)) return;
    for (const disclosure of disclosures) {
      if (!disclosure.contains(event.target)) disclosure.open = false;
    }
    if (!track.contains(event.target) && track.dataset.mobileMenu === 'open' &&
        event.target instanceof Element && !event.target.closest('dialog, [data-search-open]')) setMenu();
  });

  track.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const open = disclosures.find((disclosure) => disclosure.open);
    if (open) {
      open.open = false;
      open.querySelector('summary')?.focus();
    } else if (track.dataset.mobileMenu === 'open') {
      setMenu(false, true);
    }
  });

  const progress = track.querySelector('.nav-progress-fill');
  const article = document.querySelector('.wiki-document');
  if (progress && article) {
    let pending = false;
    const updateProgress = () => {
      const { top, height } = article.getBoundingClientRect();
      const available = height - innerHeight;
      const percentage = available <= 0 ? 0 : Math.min(1, Math.max(0, -top / available));
      track.style.setProperty('--page-progress', String(percentage));
      pending = false;
    };
    updateProgress();
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(updateProgress);
    }, { passive: true });
    new ResizeObserver(updateProgress).observe(article);
  }
}

const wide = matchMedia('(min-width: 65rem)');
const navigation = document.querySelector<HTMLDetailsElement>('[data-section-nav]');
const toc = document.querySelector<HTMLDetailsElement>('[data-article-toc]');
if (navigation) {
  const updateNavigation = () => { navigation.open = wide.matches; };
  updateNavigation();
  wide.addEventListener('change', updateNavigation);
  navigation.addEventListener('toggle', () => {
    if (!wide.matches && navigation.open && toc) toc.open = false;
  });
  navigation.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !wide.matches && navigation.open) {
      navigation.open = false;
      navigation.querySelector('summary')?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!wide.matches && event.target instanceof Node && !navigation.contains(event.target)) navigation.open = false;
  });
}

if (toc) {
  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a')];
  const summary = toc.querySelector('summary');
  const headings = links.flatMap((link) => {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    return heading ? [{ heading, link }] : [];
  });
  toc.addEventListener('toggle', () => {
    if (!toc.open) return;
    if (navigation && !wide.matches) navigation.open = false;
    const active = headings.findLast(({ heading }) => heading.getBoundingClientRect().top <= 116);
    for (const { link } of headings) {
      if (link === active?.link) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  });
  toc.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a');
    if (!link) return;
    const destination = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    toc.open = false;
    if (destination) {
      destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
    }
  });
  toc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toc.open) {
      toc.open = false;
      summary?.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !toc.contains(event.target)) toc.open = false;
  });
}
