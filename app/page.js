import { readContent } from "@/lib/store";
import { LanguageProvider } from "./context/LanguageContext";
import SiteContent from "./components/SiteContent";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = readContent();

  return (
    <LanguageProvider>
      <SiteContent data={data} />
    </LanguageProvider>
  );
}
