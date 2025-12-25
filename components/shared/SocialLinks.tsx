"use client";

import { Linkedin, Github, Twitter, Mail } from "lucide-react";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/tunahan-bu%C3%A7ak-473812247/",
    icon: <Linkedin className="w-5 h-5" />,
    ariaLabel: "LinkedIn profilimizi ziyaret edin",
  },
  {
    name: "GitHub",
    href: "https://github.com/tunahanbucak/career-ai",
    icon: <Github className="w-5 h-5" />,
    ariaLabel: "GitHub repomuzı inceleyin",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: <Twitter className="w-5 h-5" />,
    ariaLabel: "Twitter'da bizi takip edin",
  },
  {
    name: "Email",
    href: "mailto:tunahanbucak1@gmail.com",
    icon: <Mail className="w-5 h-5" />,
    ariaLabel: "E-posta ile iletişime geçin",
  },
];

interface SocialLinksProps {
  variant?: "footer" | "inline";
  className?: string;
}

export default function SocialLinks({
  variant = "footer",
  className = "",
}: SocialLinksProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.ariaLabel}
          className={`
            rounded-lg transition-all duration-300
            ${
              variant === "footer"
                ? "w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/25"
                : "text-slate-400 hover:text-indigo-400 hover:scale-110"
            }
          `}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
