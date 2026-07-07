
const columns = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "Changelog"],
  },
  {
    title: "Solutions",
    links: ["E-commerce", "SaaS", "Marketing", "Enterprise"],
  },
  {
    title: "Resources",
    links: ["Docs", "Blog", "Guides", "API Reference"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Contact", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-brand-surface">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-semibold text-sm text-gray-900 dark:text-white mb-4">
              {col.title}
            </h4>

            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-violet dark:hover:text-white transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-white/10 py-6 text-center text-xs text-gray-400">
        © 2026 ExperimentX. All rights reserved.
      </div>
    </footer>
  );
}