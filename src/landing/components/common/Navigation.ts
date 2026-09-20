export const useRouter = () => ({
  push: (url: string) => {
    window.dispatchEvent(new CustomEvent('paypulse-navigate', { detail: { path: url } }));
  },
  replace: (url: string) => {
    window.dispatchEvent(new CustomEvent('paypulse-navigate', { detail: { path: url } }));
  },
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh: () => window.location.reload(),
  prefetch: () => {},
});

export const usePathname = () => window.location.pathname;
export const useSearchParams = () => new URLSearchParams(window.location.search);

export default { useRouter, usePathname, useSearchParams };
