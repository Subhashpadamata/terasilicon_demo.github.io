const flowStages = document.querySelectorAll('.flow-row > div');
const flowSection = document.querySelector('.flow-section');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (flowStages.length && flowSection) {
  let currentStage = 0;
  let animationTimer;

  const updateFlow = () => {
    flowStages.forEach((stage, index) => {
      stage.classList.toggle('flow-active', index <= currentStage);
    });
    currentStage = (currentStage + 1) % flowStages.length;
  };

  const startFlow = () => {
    window.clearInterval(animationTimer);
    currentStage = 0;
    updateFlow();
    if (!reduceMotion) animationTimer = window.setInterval(updateFlow, 750);
  };

  const stopFlow = () => window.clearInterval(animationTimer);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? startFlow() : stopFlow());
    }, { threshold: 0.45 }).observe(flowSection);
  } else {
    startFlow();
  }
}
