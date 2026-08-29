import { useState, useEffect } from "react";
import { LinkIcon, Download, Loader2, QrCode, Trash2, Copy, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQRHistory, generateCustomQR, deleteCustomQR, clearError, clearGeneratedQr } from "../../context/adminQrSlice";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function QRGenerator() {
  const dispatch = useDispatch();
  const { history, loading: historyLoading, generating: loading, error, generatedQrUrl: qrUrl } = useSelector((state) => state.adminQr);

  const [link, setLink] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [downloadingState, setDownloadingState] = useState(null);
  const [copied, setCopied] = useState(false);

  // Modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [qrToDelete, setQrToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchQRHistory());
    // Cleanup on unmount
    return () => {
      dispatch(clearGeneratedQr());
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setQrToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!qrToDelete) return;

    setDeletingId(qrToDelete);
    try {
      await dispatch(deleteCustomQR(qrToDelete)).unwrap();
    } catch (err) {
      console.error("Failed to delete QR code", err);
    } finally {
      setDeletingId(null);
      setQrToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!link.trim()) return;

    dispatch(generateCustomQR(link));
  };

  const handleDownload = async (urlToDownload = qrUrl, format = 'svg', targetLink = link) => {
    if (!urlToDownload) return;
    setDownloadingState({ url: urlToDownload, format });
    try {
      let finalUrl = urlToDownload;

      let isCloudinary = false;
      try {
        isCloudinary = new URL(finalUrl).hostname === 'res.cloudinary.com';
      } catch (e) {
        isCloudinary = false;
      }

      if (format !== 'svg' && isCloudinary) {
        const lastDotIndex = finalUrl.lastIndexOf('.');
        if (lastDotIndex !== -1 && lastDotIndex > finalUrl.lastIndexOf('/')) {
          finalUrl = finalUrl.substring(0, lastDotIndex) + '.' + format;
        }
      }

      if (format === 'svg') {
        const response = await fetch(finalUrl);
        let svgText = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.documentElement;

        let viewBox = svgEl.getAttribute('viewBox');
        let width = parseInt(svgEl.getAttribute('width'));
        let height = parseInt(svgEl.getAttribute('height'));

        if (!viewBox && width && height) {
          viewBox = `0 0 ${width} ${height}`;
        }

        if (viewBox) {
          const parts = viewBox.split(' ').map(Number);
          if (parts.length === 4) {
            const originalWidth = parts[2];
            const originalHeight = parts[3];
            const paddingBottom = Math.max(30, originalHeight * 0.15);
            parts[3] += paddingBottom;
            svgEl.setAttribute('viewBox', parts.join(' '));

            if (height) svgEl.setAttribute('height', height + paddingBottom * (height / originalHeight));

            const textEl = doc.createElementNS("http://www.w3.org/2000/svg", "text");
            textEl.setAttribute('x', parts[0] + originalWidth / 2);
            textEl.setAttribute('y', parts[1] + originalHeight + (paddingBottom / 2));
            textEl.setAttribute('text-anchor', 'middle');
            textEl.setAttribute('dominant-baseline', 'middle');
            textEl.setAttribute('font-family', 'monospace, sans-serif');
            textEl.setAttribute('font-size', (originalHeight * 0.045).toString());
            textEl.setAttribute('fill', '#000000');
            textEl.textContent = targetLink;
            svgEl.appendChild(textEl);
          }
        }

        const serializer = new XMLSerializer();
        const newSvgText = serializer.serializeToString(doc);
        const blob = new Blob([newSvgText], { type: 'image/svg+xml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codex-qr-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = finalUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const paddingBottom = Math.max(50, img.height * 0.15);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height + paddingBottom;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = '#000000';
        const fontSize = Math.max(12, Math.floor(img.height * 0.045));
        ctx.font = `${fontSize}px monospace, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let displayLink = targetLink;
        const maxTextWidth = canvas.width - 40;
        if (ctx.measureText(displayLink).width > maxTextWidth) {
          while (displayLink.length > 0 && ctx.measureText(displayLink + '...').width > maxTextWidth) {
            displayLink = displayLink.slice(0, -1);
          }
          displayLink += '...';
        }

        ctx.fillText(displayLink, canvas.width / 2, img.height + (paddingBottom / 2));

        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format}`));
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `codex-qr-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download the image. Please open it in a new tab.");
    } finally {
      setDownloadingState(null);
    }
  };

  const handleCopy = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full animate-in fade-in duration-500">

      {/* Page Header */}
      <header className="flex items-start justify-between mb-8 gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <QrCode className="w-3.5 h-3.5" />
            <span>DYNAMIC ENCODING</span>
          </div>
          <h1 className="text-3xl font-display font-black text-text uppercase tracking-tight">
            QR <span className="text-accent">GENERATOR</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Create high-definition, branded CodeX QR codes instantly.
          </p>
        </div>
        <div className="hidden sm:block p-3 rounded-2xl bg-accent/10 border border-accent/30 shadow-md">
          <QrCode className="w-7 h-7 text-accent" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl shadow-lg p-6 sm:p-8 h-fit">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
            <div className="p-2 bg-accent/10 rounded-xl border border-accent/20 text-accent">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-display font-bold uppercase text-text">New QR Code</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-2 uppercase tracking-wider">
                Destination Link
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="url"
                  required
                  placeholder="https://qucodex.com/events/..."
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    if (error) dispatch(clearError());
                  }}
                  className="w-full rounded-lg border border-border pl-10 p-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent bg-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !link}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-[#111111] hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed font-bold w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Processing...
                </>
              ) : (
                "Generate Branded QR"
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px]">
          {qrUrl ? (
            <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-300 w-full">
              {/* Keep bg-white so the QR remains scannable! */}
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-border relative group">
                <div className="absolute inset-0 bg-accent/5 blur-xl -z-10 group-hover:bg-accent/20 transition-all duration-500"></div>
                <img
                  src={qrUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 md:w-64 md:h-64 object-contain relative z-10"
                />
              </div>

              <div className="w-full max-w-xs flex flex-col gap-2">
                <span className="text-xs font-mono uppercase text-text-muted tracking-wider text-center">Hosted Image Link</span>
                <div className="flex items-center gap-2 p-2 bg-card-hover rounded-xl border border-border/80">
                  <input
                    type="text"
                    readOnly
                    value={qrUrl}
                    className="flex-1 bg-transparent text-xs text-text outline-none px-1 truncate font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-accent/20 hover:text-accent rounded-lg text-text-muted transition-colors cursor-pointer"
                    title="Copy Hosted Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <span className="text-xs font-mono uppercase text-text-muted tracking-wider">Download Format</span>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => handleDownload(qrUrl, 'svg', history.find(i => i.qrUrl === qrUrl)?.link || link)}
                    disabled={downloadingState?.url === qrUrl && downloadingState?.format === 'svg'}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-accent/50 text-text text-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {downloadingState?.url === qrUrl && downloadingState?.format === 'svg' ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-accent" />
                    ) : (
                      <Download className="w-4 h-4 mr-1.5 text-accent" />
                    )}
                    SVG
                  </button>
                  <button
                    onClick={() => handleDownload(qrUrl, 'png', history.find(i => i.qrUrl === qrUrl)?.link || link)}
                    disabled={downloadingState?.url === qrUrl && downloadingState?.format === 'png'}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-accent/50 text-text text-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {downloadingState?.url === qrUrl && downloadingState?.format === 'png' ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-accent" />
                    ) : (
                      <Download className="w-4 h-4 mr-1.5 text-accent" />
                    )}
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload(qrUrl, 'jpg', history.find(i => i.qrUrl === qrUrl)?.link || link)}
                    disabled={downloadingState?.url === qrUrl && downloadingState?.format === 'jpg'}
                    className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-accent/50 text-text text-sm transition-all duration-200 disabled:opacity-50"
                  >
                    {downloadingState?.url === qrUrl && downloadingState?.format === 'jpg' ? (
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-accent" />
                    ) : (
                      <Download className="w-4 h-4 mr-1.5 text-accent" />
                    )}
                    JPG
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-text-muted flex flex-col items-center">
              <div className="w-24 h-24 mb-6 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-card-hover relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent rounded-full animate-pulse"></div>
                <QrCode className="w-8 h-8 opacity-20 relative z-10" />
              </div>
              <p className="text-sm">Preview will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 mt-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <div className="p-2 bg-card-hover rounded-lg text-text-muted">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text">Recent Generations</h2>
        </div>

        {historyLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12 text-text-muted bg-card-hover rounded-xl border border-border">
            <p>No QR codes generated yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <div key={item._id} className="bg-card-hover border border-border p-4 rounded-2xl hover:border-accent/50 transition-all duration-300 group flex flex-col h-full shadow-sm">

                {/* Keep bg-white so history QR remains scannable! */}
                <div className="bg-white p-3 rounded-xl mb-4 relative overflow-hidden flex-shrink-0 border border-border">
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownload(item.qrUrl, 'svg', item.link)}
                        disabled={downloadingState?.url === item.qrUrl && downloadingState?.format === 'svg'}
                        className="px-2 py-1.5 bg-accent/90 rounded-lg text-white text-xs font-bold hover:scale-110 transition-transform shadow-sm min-w-[44px] flex justify-center disabled:opacity-50 disabled:hover:scale-100"
                        title="Download SVG"
                      >
                        {downloadingState?.url === item.qrUrl && downloadingState?.format === 'svg' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "SVG"
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(item.qrUrl, 'png', item.link)}
                        disabled={downloadingState?.url === item.qrUrl && downloadingState?.format === 'png'}
                        className="px-2 py-1.5 bg-accent/90 rounded-lg text-white text-xs font-bold hover:scale-110 transition-transform shadow-sm min-w-[44px] flex justify-center disabled:opacity-50 disabled:hover:scale-100"
                        title="Download PNG"
                      >
                        {downloadingState?.url === item.qrUrl && downloadingState?.format === 'png' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "PNG"
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(item.qrUrl, 'jpg', item.link)}
                        disabled={downloadingState?.url === item.qrUrl && downloadingState?.format === 'jpg'}
                        className="px-2 py-1.5 bg-accent/90 rounded-lg text-white text-xs font-bold hover:scale-110 transition-transform shadow-sm min-w-[44px] flex justify-center disabled:opacity-50 disabled:hover:scale-100"
                        title="Download JPG"
                      >
                        {downloadingState?.url === item.qrUrl && downloadingState?.format === 'jpg' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "JPG"
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      disabled={deletingId === item._id}
                      className="mt-1 p-2 bg-danger rounded-lg text-white hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-sm"
                      title="Delete"
                    >
                      {deletingId === item._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <img src={item.qrUrl} alt="QR Code" className="w-full aspect-square object-contain" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-3">
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-1">Target Link</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm text-text hover:text-accent transition-colors line-clamp-2 break-all group-hover:underline">
                      {item.link}
                    </a>
                  </div>
                  <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest pt-3 border-t border-border">
                    {new Date(item.createdAt).toLocaleDateString("en-IN", {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete QR Code"
        message="Are you sure you want to permanently delete this custom QR code? This will remove it from the system and free up Cloudinary storage. This action cannot be undone."
        onConfirm={executeDelete}
        isLoading={deletingId !== null}
        onCancel={() => {
          setDeleteModalOpen(false);
          setQrToDelete(null);
        }}
      />
    </div>
  );
}