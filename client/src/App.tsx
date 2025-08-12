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
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <AuthGuard>
          <Navigation />
          <Home />
        </AuthGuard>
      )} />
      <Route path="/modules" component={() => (
        <AuthGuard>
          <Navigation />
          <Modules />
        </AuthGuard>
      )} />
      <Route path="/industries" component={() => (
        <AuthGuard>
          <Navigation />
          <Industries />
        </AuthGuard>
      )} />
      <Route path="/pricing" component={() => (
        <AuthGuard>
          <Navigation />
          <Pricing />
        </AuthGuard>
      )} />
      <Route path="/process" component={() => (
        <AuthGuard>
          <Navigation />
          <Process />
        </AuthGuard>
      )} />
      <Route path="/partners" component={() => (
        <AuthGuard>
          <Navigation />
          <Partners />
        </AuthGuard>
      )} />
      <Route path="/admin" component={() => (
        <AuthGuard>
          <Navigation />
          <AdminPanel />
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
