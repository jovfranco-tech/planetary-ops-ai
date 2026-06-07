import { Providers } from "./providers";
import { AppShell } from "./AppShell";

export function App() {
  return (
    <Providers>
      <AppShell />
    </Providers>
  );
}

export default App;
