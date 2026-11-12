// Single source of truth for per-pillar info that has to stay consistent
// across every page (swipe, detail, scale breakdown): the icon, and which
// scale state a pillar is currently in. `state: null` means "no data yet".
// Change a value here and every page that reads it (via the data attributes
// below) updates together — no more hand-editing dot classes, fill
// percentages, or active rows per page.
const SCALE_STATES = ['Needs Care', 'Emerging', 'Growing', 'Thriving', 'Flourishing']; // ascending, index 0 = lowest

// Which chip(s) a pillar's snapshot shows under "Snapshot drawn from" — kept
// to whichever sources that snapshot's own written copy actually cites (a
// journal quote, a "mood ratings" reference, etc.), not a fixed set for
// every pillar. Update this list if the snapshot copy for a pillar changes
// what it draws from.
const SOURCE_CHIPS = {
  journal: { icon: 'book_5', label: 'Journaling' },
  mood: { icon: 'heart_smile', label: 'Mood tracking' },
  sessions: { icon: 'chair', label: 'Sessions' },
  goals: { icon: 'trophy', label: 'Goals' },
};

const PILLARS = {
  emotional: { name: 'Emotional', icon: 'favorite', state: 'Flourishing', sources: ['journal', 'mood'] },
  physical: { name: 'Physical', icon: 'ent', state: 'Growing', sources: ['journal', 'mood'] },
  social: { name: 'Social', icon: 'communities', state: 'Emerging', sources: ['journal', 'mood'] },
  cognitive: { name: 'Cognitive', icon: 'neurology', state: 'Needs Care', sources: ['journal'] },
  environmental: { name: 'Environmental', icon: 'potted_plant', state: null, sources: ['journal', 'mood', 'sessions'] },
  spiritual: { name: 'Spiritual', icon: 'star_shine', state: null, sources: ['journal', 'mood', 'sessions'] },
};

// Fills in every icon element on the page from the map above, instead of
// each page hardcoding its own icon name/asset. An element declares which
// pillar it belongs to via data-pillar-icon="<slug>":
//   <span class="material-symbols-outlined" data-pillar-icon="physical"></span>
//   <img data-pillar-icon="physical" alt="">
// <img> gets its src pointed at that pillar's exported SVG (figma-assets/
// pillar-icon-<slug>.svg); anything else (the material-symbols-outlined
// spans) gets its ligature name set as text content. Call this once, after
// the DOM the icons live in already exists.
function applyPillarIcons() {
  document.querySelectorAll('[data-pillar-icon]').forEach(el => {
    const slug = el.dataset.pillarIcon;
    const pillar = PILLARS[slug];
    if (!pillar) return;
    if (el.tagName === 'IMG') {
      el.src = `figma-assets/pillar-icon-${slug}.svg`;
    } else {
      el.textContent = pillar.icon;
    }
  });
}

// Applies a pillar's current state to every scale visualization on the
// page. A container declares which pillar + which visual it is via data
// attributes:
//   <div class="domain-scale-mini" data-pillar-scale="physical" data-scale-type="mini">
//   <div class="domain-scale-large" data-pillar-scale="physical" data-scale-type="large">
//   <div class="timeline" data-pillar-scale="physical" data-scale-type="breakdown">
// Call this once, after the DOM the scales live in already exists.
function applyPillarScales() {
  document.querySelectorAll('[data-pillar-scale]').forEach(el => {
    const slug = el.dataset.pillarScale;
    const pillar = PILLARS[slug];
    if (!pillar) return;
    const stateIdx = pillar.state === null ? null : SCALE_STATES.indexOf(pillar.state);
    const type = el.dataset.scaleType;
    if (type === 'mini' || type === 'large') {
      applyDotScale(el, stateIdx, type);
    } else if (type === 'breakdown') {
      applyBreakdownScale(el, stateIdx);
    }
  });
}

// Mini/large scale: a row of 5 dots (ascending, index 0 = Needs Care) plus a
// track-fill bar. Mini fills to (index+1)/6 of the track (matches its
// space-evenly dot layout); large fills to (index+0.5)/5 (matches its
// grid-centered dot layout) — see the CSS for why these differ.
function applyDotScale(container, stateIdx, type) {
  const dots = container.querySelectorAll('.dots .dot');
  dots.forEach((dot, i) => {
    dot.classList.remove('passed', 'current');
    if (stateIdx === null) return; // no data: every dot stays neutral
    if (i < stateIdx) dot.classList.add('passed');
    else if (i === stateIdx) dot.classList.add('current');
  });
  const fill = container.querySelector('.track-fill');
  if (fill) {
    fill.style.width = stateIdx === null
      ? '0%'
      : `${(type === 'mini' ? (stateIdx + 1) / 6 : (stateIdx + 0.5) / 5) * 100}%`;
  }
  container.querySelectorAll('.labels span').forEach((label, i) => {
    label.classList.toggle('active', i === stateIdx);
  });
}

// Scale breakdown timeline: rows are matched to a state by their own
// .state-name text (not by position), so row order in the markup doesn't
// matter. The active row gets the big dot; rows above it (not yet reached,
// since the scale reads bottom-to-top ascending) get the neutral dot/lines;
// rows at-or-below stay teal ("already passed"). A row's own .line (which
// connects DOWN to the next row) is neutral only if that row itself hasn't
// been reached yet; its .line-top (the tail of the row ABOVE's bar, read as
// part of that bar) is neutral through and including the active row itself,
// so the color only visibly changes starting at the active dot, not before it.
function applyBreakdownScale(container, stateIdx) {
  container.querySelectorAll('.timeline-row').forEach(row => {
    const stateName = row.querySelector('.state-name').textContent.trim();
    const rowIdx = SCALE_STATES.indexOf(stateName);
    const isActive = stateIdx !== null && rowIdx === stateIdx;
    const dotIsUpcoming = stateIdx === null || rowIdx > stateIdx;
    const lineTopIsUpcoming = stateIdx === null || rowIdx >= stateIdx;

    const dotImg = row.querySelector('.dot-active, .dot-filled');
    if (dotImg) {
      if (isActive) {
        dotImg.src = 'figma-assets/scale-timeline-dot-active.svg';
        dotImg.className = 'dot-active';
      } else {
        dotImg.src = dotIsUpcoming
          ? 'figma-assets/scale-timeline-dot-filled-neutral.svg'
          : 'figma-assets/scale-timeline-dot-filled.svg';
        dotImg.className = 'dot-filled';
      }
    }
    const lineTop = row.querySelector('.line-top');
    if (lineTop) lineTop.classList.toggle('is-upcoming', lineTopIsUpcoming);
    const line = row.querySelector('.line');
    if (line) line.classList.toggle('is-upcoming', dotIsUpcoming);
  });
}

// Renders the "Snapshot drawn from" chip row for whichever sources a
// pillar's snapshot actually cites (see SOURCE_CHIPS/PILLARS above), instead
// of every detail page hardcoding the same chip markup. Container declares
// its pillar via data-snapshot-chips="<slug>":
//   <div class="snapshot-chips" data-snapshot-chips="physical"></div>
function applySnapshotChips() {
  document.querySelectorAll('[data-snapshot-chips]').forEach(el => {
    const pillar = PILLARS[el.dataset.snapshotChips];
    if (!pillar) return;
    el.innerHTML = pillar.sources.map(key => {
      const chip = SOURCE_CHIPS[key];
      return `<div class="chip"><img src="figma-assets/chip-icon-${key}.svg" alt=""><span>${chip.label}</span></div>`;
    }).join('');
  });
}
