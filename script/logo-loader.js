/* Terasilicon IQ — Logo Assembly Loader */
(function () {
  const loader = document.getElementById('tsiq-loader');
  if (!loader) return;

  const hideLoader = () => {
    window.setTimeout(() => loader.classList.add('is-hidden'), 1750);
  };

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }
})();
