import { Link } from "wouter";

export function Footer() {

  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} جميع الحقوق محفوظة.
          </p>
          <nav className="flex items-center gap-6">
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              الخدمات
            </button>
            <button onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              معرض الأعمال
            </button>
            <button onClick={() => document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              اطلب الآن
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
