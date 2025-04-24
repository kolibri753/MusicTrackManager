import GithubIcon from "@/assets/icons/github.svg?react";
import LinkedinIcon from "@/assets/icons/linkedin.svg?react";

export function Footer() {
  return (
    <footer className="footer footer-center bg-neutral text-neutral-content p-6">
      <div>
        <p className="font-semibold">
          © 2025 HummingTrack – Let the music take flight
        </p>
        <p className="text-sm opacity-70">
          Built for Genesis Front-End School 3.0
        </p>
      </div>
      <div className="flex gap-4">
        <a
          href="https://github.com/kolibri753"
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
        >
          <GithubIcon width={24} height={24} className="fill-current" />
        </a>
        <a
          href="https://linkedin.com/in/vira-vakhovska"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
        >
          <LinkedinIcon width={24} height={24} className="fill-current" />
        </a>
      </div>
    </footer>
  );
}
