import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SimulatorPage from "@/pages/Simulator";
import DashboardPage from "@/pages/Dashboard";
import VergleichPage from "@/pages/Vergleich";
import ImpressumPage from "@/pages/Impressum";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/simulator" component={SimulatorPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/vergleich" component={VergleichPage} />
      <Route path="/impressum" component={ImpressumPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
