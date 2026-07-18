import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminContacts,
  markMessageAsRead,
  deleteContactMessage,
} from "../../context/adminContactSlice";
import { useConfirm } from "../../context/ConfirmContext";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  CheckCircle,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ManageContacts() {
  const dispatch = useDispatch();
  const { messages, loading, isLoaded } = useSelector(
    (state) => state.adminContact
  );
  const confirm = useConfirm();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchAdminContacts());
    }
  }, [dispatch, isLoaded]);

  const handleDelete = async (id) => {
    const isConfirmed = await confirm({
      title: "Delete Message",
      message:
        "Are you sure you want to delete this message? This cannot be undone.",
    });

    if (isConfirmed) {
      await dispatch(deleteContactMessage(id));
    }
  };

  const handleToggleExpand = async (message) => {
    if (expandedId === message._id) {
      setExpandedId(null);
    } else {
      setExpandedId(message._id);
      if (!message.isRead) {
        await dispatch(markMessageAsRead(message._id));
      }
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-10 font-sans text-text min-h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-accent" /> Inbox
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage incoming contact form submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(fetchAdminContacts())}
            disabled={loading}
            className="p-2 bg-card border border-border rounded-lg text-text-muted hover:text-accent hover:border-accent transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Messages"
          >
            <RefreshCw
              className={`w-5 h-5 ${loading ? "animate-spin text-accent" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border text-text rounded-lg p-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {loading && !isLoaded ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-16 text-center">
            <Mail className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text mb-1">
              No Messages
            </h3>
            <p className="text-text-muted text-sm">
              You're all caught up! No messages found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border-soft">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className={`transition-colors ${!msg.isRead ? "bg-accent/10" : "hover:bg-card-hover/50"}`}
              >
                <div
                  className="p-4 cursor-pointer flex items-center gap-4"
                  onClick={() => handleToggleExpand(msg)}
                >
                  <div className="shrink-0 flex items-center justify-center">
                    {!msg.isRead ? (
                      <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>
                    ) : (
                      <CheckCircle className="w-4 h-4 text-text-muted" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4
                        className={`text-sm truncate ${!msg.isRead ? "font-bold text-text" : "font-medium text-text"}`}
                      >
                        {msg.name}{" "}
                        <span className="font-normal text-text-muted ml-1">
                          ({msg.email})
                        </span>
                      </h4>
                      <div className="shrink-0 text-xs text-text-muted flex items-center gap-1.5 ml-4">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p
                      className={`text-sm truncate ${!msg.isRead ? "font-semibold text-text" : "text-text-muted"}`}
                    >
                      {msg.subject}
                    </p>
                  </div>

                  <div className="shrink-0 text-text-muted">
                    {expandedId === msg._id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === msg._id && (
                  <div className="px-10 pb-5 pt-2 border-t border-border-soft bg-card-hover/50">
                    <div className="mb-4 whitespace-pre-wrap text-sm text-text leading-relaxed bg-card p-4 rounded-xl border border-border">
                      {msg.message}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger bg-danger/10 hover:bg-danger/20 rounded-lg transition-colors border border-danger/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Message
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}