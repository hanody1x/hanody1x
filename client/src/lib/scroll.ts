export function smoothScrollTo(targetId: string, duration: number = 800) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const navbarOffset = 80; // Adjust for fixed navbar
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarOffset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // easeInOutQuart
    const ease = progress < 0.5 
      ? 8 * progress * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 4) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}
