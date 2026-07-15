import GlobalMessage from "./components/common/GlobalMessage";
import { ConfirmProvider } from "./context/ConfirmContext";

function App({ children }) {
  return (
    <ConfirmProvider>
      <GlobalMessage />
      {children}
    </ConfirmProvider>
  );
}

export default App;
