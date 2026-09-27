import { useEffect, useState } from "react";
import { SurveyPage } from "./app/SurveyPage";
import { TermsPoliciesPage } from "./app/TermsPoliciesPage";
import "./App.css";

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (pathname === "/termos-e-politicas") {
    return <TermsPoliciesPage />;
  }

  return <SurveyPage />;
}

export default App;
