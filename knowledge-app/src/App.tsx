import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppShell } from './components/layout/AppShell';
import './styles/globals.css';

function App({ dataPath }: { dataPath?: string }) {
  return (
    <>
      <AppShell dataPath={dataPath || "/data/gdtc-1/kb.json"} />
      <SpeedInsights />
    </>
  );
}

export default App;
