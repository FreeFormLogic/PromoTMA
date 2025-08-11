import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
import { Navigation } from "@/components/Navigation";
import Home from "@/pages/Home";
import Modules from "@/pages/Modules";
import Industries from "@/pages/Industries";
import Pricing from "@/pages/Pricing";
import Process from "@/pages/Process";
import Partners from "@/pages/Partners";
import NotFound from "@/pages/not-found";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Home />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route path="/modules" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Modules />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route path="/industries" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Industries />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route path="/pricing" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Pricing />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route path="/process" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Process />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route path="/partners" component={() => (
        <AuthGuard>
          <AuthenticatedLayout>
            <Partners />
          </AuthenticatedLayout>
        </AuthGuard>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
