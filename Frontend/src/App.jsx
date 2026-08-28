import GlobalMessage from "./components/common/GlobalMessage";
import { ConfirmProvider } from "./context/ConfirmContext";
import { ImageZoomProvider } from "./context/ImageZoomContext";

function App({ children }) {
  return (
    <ConfirmProvider>
      <ImageZoomProvider>
        <GlobalMessage />
        {children}
      </ImageZoomProvider>
    </ConfirmProvider>
  );
}

export default App;
