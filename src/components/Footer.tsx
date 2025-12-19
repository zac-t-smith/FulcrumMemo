const Footer = () => {
  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream-muted font-body text-sm">
            © {new Date().getFullYear()} Zac Smith. All rights reserved.
          </p>
          <p className="text-cream-muted font-body text-sm">
            Restructuring & Special Situations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
