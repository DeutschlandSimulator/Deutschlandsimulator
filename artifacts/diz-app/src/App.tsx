import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import SimulatorPage from "@/pages/Simulator";

import ImpressumPage from "@/pages/Impressum";
import AnnahmenPage from "@/pages/Annahmen";
import HaftungsausschlussPage from "@/pages/Haftungsausschluss";
import MitmachenPage from "@/pages/Mitmachen";
import AdminPage from "@/pages/Admin";
import { ThemeProvider } from "@/context/ThemeContext";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/simulator" component={SimulatorPage} />

      <Route path="/impressum" component={ImpressumPage} />
      <Route path="/annahmen" component={AnnahmenPage} />
      <Route path="/haftungsausschluss" component={HaftungsausschlussPage} />
      <Route path="/mitmachen" component={MitmachenPage} />
      <Route path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
