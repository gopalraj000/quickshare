import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Success from "@/pages/success";
import Download from "@/pages/download";
import DirectDownload from "@/pages/direct-download";
import Scan from "@/pages/scan";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/success/:code" component={Success} />
      <Route path="/download" component={Download} />
      <Route path="/d/:code" component={DirectDownload} />
      <Route path="/scan" component={Scan} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;