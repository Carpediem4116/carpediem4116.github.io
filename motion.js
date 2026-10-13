'use strict';

// GSAP is optional enhancement: the HTML remains visible if it cannot load.
(() => {
  const gsap = window.gsap;
  if (!gsap) return;
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: no-preference)',context => {
    const reveal = (targets,options = {}) => gsap.from(targets,{
      y:16,opacity:0,duration:.65,ease:'power3.out',
      clearProps:'transform,opacity',...options
    });

    // Only play the opening sequence when arriving at the top of the page.
    // Anchor links and browser history must preserve the reader's position.
    if (scrollY < 30) {
      gsap.timeline({defaults:{ease:'power3.out',clearProps:'transform,opacity'}})
        .from('.hero-copy .eyebrow',{opacity:0,y:10,duration:.45},0)
        .from('.hero h1 [data-i18n]',{opacity:0,y:24,stagger:.12,duration:.8},.08)
        .from('.title-dot',{opacity:0,rotation:-18,y:12,duration:.8},.25)
        .from('.hero-description',{opacity:0,y:14,duration:.65},.22)
        .from('.hero-actions,.hero-note',{opacity:0,y:10,stagger:.08,duration:.6},.34)
        .from('.real-model-panel',{opacity:0,y:18,duration:.85},.15);
    }

    // Observe native scrolling without changing its speed or page geometry.
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (!entry.target.contains(document.activeElement)) {
          context.add(() => reveal(entry.target));
        }
      });
    },{threshold:.15});
    document.querySelectorAll('.section-heading,.about-section>div:first-child,.cv-card,.contact-link').forEach(node => observer.observe(node));

    const details = document.getElementById('project-details');
    let notesMotion;
    const notesOpened = () => {
      notesMotion?.progress(1).kill();
      if (!details.open) return;
      context.add(() => {
        notesMotion = gsap.timeline({defaults:{ease:'power2.out',clearProps:'transform,opacity'}})
          .from('.project-copy>.eyebrow,.project-copy>h3,.project-copy>.project-lead',{y:12,opacity:0,duration:.5,stagger:.07})
          .from('.project-facts>div,.project-layer',{y:10,opacity:0,duration:.5,stagger:.05},.12);
      });
    };
    details?.addEventListener('toggle',notesOpened);

    return () => {
      observer.disconnect();
      details?.removeEventListener('toggle',notesOpened);
    };
  });
})();
