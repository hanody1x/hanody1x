import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AdminProvider } from "@/contexts/AdminContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Home from "@/pages/Home";
import CaseStudy from "@/pages/CaseStudy";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        <Switch>
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route>
            <>
              <Navbar />
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/case-study/:id" component={CaseStudy} />
                <Route component={NotFound} />
              </Switch>
              <Footer />
            </>
          </Route>
        </Switch>
        <Toaster />
      </div>
    </AdminProvider>
  );
}

export default App;
