// lib/site-config.ts
export const siteConfig = {
  name: "Jon Gerton Web Design",
  shortName: "Jon Gerton",
  description:
    "Professional WordPress websites starting at $500. Custom web applications and team growth consulting.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jpgerton.com",
  author: {
    name: "Jon Gerton",
    email: "jon@jpgerton.com",
    jobTitle: "Full-Stack Developer & Technical Consultant",
    linkedin: "https://www.linkedin.com/in/jon-gerton-8009a9393/",
    github: "https://github.com/jgerton",
  },
  keywords: [
    "web design",
    "WordPress",
    "freelance developer",
    "web development",
    "portfolio",
    "local business websites",
    "$500 websites",
  ],
  locale: "en_US",
  themeColor: "#000000",
  calendly: {
    discoveryCallUrl:
      process.env.NEXT_PUBLIC_CALENDLY_URL ||
      "https://calendly.com/jongerton/discovery-call",
  },
};
