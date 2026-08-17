const flowStages = document.querySelectorAll('.flow-row > div');
const flowSection = document.querySelector('.flow-section');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (flowStages.length && flowSection) {
  let currentStage = 0;
  let animationTimer;

  const updateFlow = () => {
    flowStages.forEach((stage, index) => {
      // Keep every completed/current implementation stage active.
      // The terminal Signoff stage remains visually distinct.
      const isSignoff = stage.classList.contains('terminal');
      stage.classList.toggle(
        'flow-active',
        !isSignoff && index <= currentStage
      );
    });

    // Stop on Physical Verification, then restart from RTL.
    // This keeps Signoff as the fixed terminal endpoint.
    if (currentStage < flowStages.length - 2) {
      currentStage += 1;
    } else {
      currentStage = 0;
    }
  };

  const startFlow = () => {
    window.clearInterval(animationTimer);
    currentStage = 0;
    updateFlow();

    if (!reduceMotion) {
      animationTimer = window.setInterval(updateFlow, 1000);
    }
  };

  const stopFlow = () => window.clearInterval(animationTimer);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startFlow();
        } else {
          stopFlow();
        }
      });
    }, { threshold: 0.45 }).observe(flowSection);
  } else {
    startFlow();
  }
}
