/**
 * PayPulse Interactive Touch & Click Light System
 * Spawns a radiant specular burst of light right at the user's touch or click coordinates
 * and provides intense tactile brightening illumination for buttons and interactive controls.
 */

export function initTouchLightEffect(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handlePointerDown = (e: PointerEvent) => {
    // Only respond to primary mouse click or touch points
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Detect if touching inside a button or interactive element
    const btn = target.closest(
      'button, [role="button"], .btn-touch-glow, .btn-interactive, .btn-touch-light'
    ) as HTMLElement | null;

    if (
      !btn ||
      btn.hasAttribute('disabled') ||
      btn.getAttribute('aria-disabled') === 'true' ||
      btn.classList.contains('btn-input-icon')
    ) {
      return;
    }


    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate light burst diameter to illuminate entire button from touch point
    const maxDimension = Math.max(rect.width, rect.height);
    const burstSize = Math.max(maxDimension * 2.6, 140);

    // Create luminous light burst element
    const lightBurst = document.createElement('span');
    lightBurst.className = 'touch-light-burst';
    lightBurst.style.width = `${burstSize}px`;
    lightBurst.style.height = `${burstSize}px`;
    lightBurst.style.left = `${x}px`;
    lightBurst.style.top = `${y}px`;

    // Ensure button has appropriate positioning
    const computed = window.getComputedStyle(btn);
    if (computed.position === 'static') {
      btn.style.position = 'relative';
    }

    // Add instantaneous touching light class
    btn.classList.add('is-touching-light');
    btn.appendChild(lightBurst);

    const cleanup = () => {
      btn.classList.remove('is-touching-light');
      if (lightBurst.parentNode === btn) {
        lightBurst.remove();
      }
    };

    // Remove once the pulse animation finishes
    setTimeout(cleanup, 560);
  };

  window.addEventListener('pointerdown', handlePointerDown, { passive: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown);
  };
}
