import React, { useState } from "react";
import { Loader2, X as XIcon, FileText, Upload } from "lucide-react";

export default function ImportRegistrationModal({ onClose, onImport }) {
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleDownloadTemplate = () => {
    const headers = [
      "name",
      "fatherName",
      "email",
      "phone",
      "course",
      "year",
      "semester",
      "section",
      "set",
      "studentId",
    ];

    const csvContent = headers.join(",") + "\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CodeX_Registration_Template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    setIsImporting(true);
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", importFile);

    try {
      const result = await onImport(formData);
      setImportResult({ type: "success", data: result });
    } catch (error) {
      setImportResult({
        type: "error",
        message: error || "Failed to import CSV",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Bulk Import Students
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
            <p className="mb-2">
              <strong>Step 1:</strong> Download the template to see the required
              format.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <FileText className="w-4 h-4" /> Download CSV Template
            </button>
          </div>

          <form onSubmit={handleImportSubmit}>
            <p className="text-sm text-slate-700 font-medium mb-2">
              Step 2: Upload populated CSV file
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files[0])}
              className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-teal-50 file:text-teal-700
                    hover:file:bg-teal-100 border border-slate-200 rounded-lg p-2"
            />

            {importResult && (
              <div
                className={`mt-4 p-4 rounded-xl text-sm ${
                  importResult.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-green-50 text-green-700 border border-green-100"
                }`}
              >
                {importResult.type === "error" ? (
                  <p>{importResult.message}</p>
                ) : (
                  <div>
                    <p className="font-semibold mb-1">Import Successful!</p>
                    <ul className="list-disc pl-5">
                      <li>Imported: {importResult.data.importedCount}</li>
                      <li>
                        Skipped (Duplicates): {importResult.data.skippedCount}
                      </li>
                    </ul>
                    {importResult.data.errors?.length > 0 && (
                      <div className="mt-2 text-amber-700">
                        <p className="font-medium">Warnings:</p>
                        <ul className="list-disc pl-5 max-h-32 overflow-y-auto">
                          {importResult.data.errors.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isImporting || !importFile}
                className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload & Process
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
