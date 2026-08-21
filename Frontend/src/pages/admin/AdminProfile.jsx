import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Loader2,
  Shield,
  Key,
  Monitor,
  LogOut,
  Eye,
  EyeOff,
  Settings,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { setLogin, setLogout } from "../../context/authSlice";
import ManageSessions from "./ManageSessions";
import AdminSettings from "./AdminSettings";
import EmailBlocklist from "./EmailBlocklist";

export default function AdminProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const currentTab = location.hash || "#profile";

  // Profile State
  const [formData, setFormData] = useState({
    name: "",
    mobileNumber: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Password State
  const [pwdData, setPwdData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
  });
  const [pwdStep, setPwdStep] = useState(1);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    if (user) {
      const adminObj = user.admin || user;
      const newName = adminObj.name || "";
      const newMobile = adminObj.mobileNumber || "";
      const newPhoto = adminObj.profilePhoto || null;

      setFormData((prev) => {
        if (prev.name === newName && prev.mobileNumber === newMobile) return prev;
        return { name: newName, mobileNumber: newMobile };
      });
      setPreviewPhoto((prev) => (prev === newPhoto ? prev : newPhoto));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleLogout = async () => {
    try {
      await adminService.logoutAdmin();
    } catch (error) {
      console.error("Backend logout failed or session already cleared:", error);
    } finally {
      dispatch(setLogout());
      navigate("/admin/login");
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      if (formData.name) submitData.append("name", formData.name);
      if (formData.mobileNumber)
        submitData.append("mobileNumber", formData.mobileNumber);
      if (profilePhoto) submitData.append("profilePhoto", profilePhoto);

      const response = await adminService.updateProfile(submitData);

      if (response.success) {
        dispatch(setLogin(response.data));
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePwdChange = (e) => {
    setPwdData({ ...pwdData, [e.target.name]: e.target.value });
  };

  const handleSubmitPasswordRequest = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMessage({ type: "", text: "" });

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setPwdMessage({ type: "error", text: "New passwords do not match." });
      setPwdLoading(false);
      return;
    }

    try {
      await adminService.requestPasswordChange(pwdData.oldPassword);
      setPwdMessage({
        type: "success",
        text: "OTP sent to your registered email.",
      });
      setPwdStep(2);
    } catch (error) {
      setPwdMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to initiate password change.",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSubmitPasswordVerify = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdMessage({ type: "", text: "" });

    try {
      await adminService.changeAdminPassword(pwdData.otp, pwdData.newPassword);
      setPwdMessage({
        type: "success",
        text: "Password changed successfully!",
      });
      setPwdData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        otp: "",
      });
      setPwdStep(1);
    } catch (error) {
      setPwdMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const tabs = [
    { id: "#profile", name: "Profile", icon: User },
    { id: "#password", name: "Security", icon: Key },
    { id: "#sessions", name: "Sessions", icon: Monitor },
    { id: "#blocklist", name: "Blocklist", icon: ShieldAlert },
    { id: "#settings", name: "Settings", icon: Settings },
  ];

  const adminEmail = (user?.admin || user)?.email || "";

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8 font-sans text-text min-h-full">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <User className="w-3.5 h-3.5" />
            <span>ACCOUNT & SECURITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-text uppercase">
            ACCOUNT <span className="text-accent">SETTINGS</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            Manage your profile credentials, multi-factor security, active sessions, and system preferences.
          </p>
        </div>

        {/* Tab Navigation Chips */}
        <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <nav className="inline-flex p-1.5 gap-1.5 bg-card/85 backdrop-blur-xl rounded-xl border border-border/80 shadow-md min-w-max">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              const Icon = tab.icon;
              return (
                <a
                  key={tab.id}
                  href={tab.id}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-accent text-[#111111] shadow-md shadow-accent/20 font-bold"
                      : "text-text-muted hover:text-text hover:bg-card-hover"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#111111]" : "text-text-muted"}`} />
                  <span>{tab.name}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content Containers */}
      <div className="w-full min-w-0 transition-all">
        {/* 1. PROFILE TAB */}
        {currentTab === "#profile" && (
          <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between bg-card-hover/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-text uppercase">Profile Details</h2>
                  <p className="text-xs text-text-muted">Personal administrator details and avatar</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold uppercase hidden sm:inline-block">
                Admin Profile
              </span>
            </div>

            <div className="p-5 sm:p-8 md:p-10">
              <form onSubmit={handleSubmitProfile} className="space-y-8">
                {/* Avatar Banner Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pb-8 border-b border-border/60">
                  <div className="relative group shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-card border-4 border-accent/40 shadow-xl relative flex items-center justify-center">
                      {previewPhoto ? (
                        <img
                          src={previewPhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/10 text-accent font-mono font-bold text-3xl">
                          {formData.name ? formData.name.charAt(0).toUpperCase() : <User size={40} />}
                        </div>
                      )}
                    </div>
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-accent text-[#111111] p-2.5 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border-2 border-card"
                      title="Upload New Photo"
                    >
                      <Camera size={18} />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className="text-center sm:text-left space-y-2">
                    <h3 className="text-lg font-bold text-text">
                      {formData.name || "Administrator"}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted max-w-sm">
                      Upload a square image (JPG or PNG). Maximum file size 5MB.
                    </p>
                    <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <label
                        htmlFor="photo-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-text bg-card border border-border rounded-xl hover:bg-card-hover cursor-pointer transition-colors shadow-sm"
                      >
                        <Camera size={14} className="text-accent" />
                        Choose Image
                      </label>
                      {previewPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePhoto(null);
                            setPreviewPhoto((user?.admin || user)?.profilePhoto || null);
                          }}
                          className="text-xs text-text-muted hover:text-danger underline transition-colors"
                        >
                          Reset Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-3 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-card text-text rounded-xl border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Disabled) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-3 text-text-muted pointer-events-none" />
                      <input
                        type="email"
                        value={adminEmail}
                        disabled
                        className="w-full bg-card/50 text-text-muted rounded-xl border border-border/60 pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
                      />
                      <Lock size={14} className="absolute right-3 top-3.5 text-text-muted" />
                    </div>
                    <p className="text-[11px] text-text-muted">
                      Email address is linked to system login and cannot be altered.
                    </p>
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-3 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full bg-card text-text rounded-xl border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        placeholder="+974 1234 5678"
                      />
                    </div>
                  </div>

                  {/* Role (Disabled) */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      System Role
                    </label>
                    <div className="relative">
                      <Shield size={18} className="absolute left-3 top-3 text-accent pointer-events-none" />
                      <input
                        type="text"
                        value="Super Administrator"
                        disabled
                        className="w-full bg-card/50 text-accent font-semibold rounded-xl border border-border/60 pl-10 pr-4 py-2.5 text-sm cursor-not-allowed"
                      />
                      <Lock size={14} className="absolute right-3 top-3.5 text-text-muted" />
                    </div>
                  </div>
                </div>

                {/* Message Alert */}
                {message.text && (
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                      message.type === "success"
                        ? "bg-accent/15 text-accent border border-accent/40"
                        : "bg-danger/15 text-danger border border-danger/40"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    )}
                    <span>{message.text}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-danger bg-danger/10 border border-danger/30 rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out Console
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[#111111] bg-accent rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer font-bold"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. SECURITY / PASSWORD TAB */}
        {currentTab === "#password" && (
          <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between bg-card-hover/40">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-text uppercase">Password Security</h2>
                  <p className="text-xs text-text-muted">Two-factor authenticated password update</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-bold uppercase">
                Step {pwdStep} of 2
              </span>
            </div>

            <div className="p-5 sm:p-8 md:p-10">
              {pwdStep === 1 ? (
                <form onSubmit={handleSubmitPasswordRequest} className="space-y-6 max-w-2xl">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.oldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={pwdData.oldPassword}
                        onChange={handlePwdChange}
                        className="w-full bg-card text-text rounded-xl border border-border pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                        required
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                        className="absolute right-3 top-3 text-text-muted hover:text-accent transition-colors"
                      >
                        {showPasswords.oldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={pwdData.newPassword}
                          onChange={handlePwdChange}
                          className="w-full bg-card text-text rounded-xl border border-border pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                          required
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("newPassword")}
                          className="absolute right-3 top-3 text-text-muted hover:text-accent transition-colors"
                        >
                          {showPasswords.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={pwdData.confirmPassword}
                          onChange={handlePwdChange}
                          className="w-full bg-card text-text rounded-xl border border-border pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                          required
                          placeholder="••••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirmPassword")}
                          className="absolute right-3 top-3 text-text-muted hover:text-accent transition-colors"
                        >
                          {showPasswords.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {pwdMessage.text && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                        pwdMessage.type === "success"
                          ? "bg-accent/15 text-accent border border-accent/40"
                          : "bg-danger/15 text-danger border border-danger/40"
                      }`}
                    >
                      {pwdMessage.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      )}
                      <span>{pwdMessage.text}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[#111111] bg-accent rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {pwdLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Security OTP...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Request OTP Verification
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitPasswordVerify} className="space-y-6 max-w-md">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-text uppercase tracking-wider block">
                      Security OTP Code
                    </label>
                    <p className="text-xs text-text-muted">
                      Enter the 6-digit verification code sent to your registered email address.
                    </p>
                    <input
                      type="text"
                      name="otp"
                      value={pwdData.otp}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setPwdData((prev) => ({ ...prev, otp: cleaned }));
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        setPwdData((prev) => ({ ...prev, otp: pasted }));
                      }}
                      className="w-full bg-card text-text rounded-xl border border-border px-4 py-3 text-center tracking-[0.4em] font-mono text-xl font-bold focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                      maxLength={6}
                      required
                      placeholder="000000"
                    />
                  </div>

                  {pwdMessage.text && (
                    <div
                      className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                        pwdMessage.type === "success"
                          ? "bg-accent/15 text-accent border border-accent/40"
                          : "bg-danger/15 text-danger border border-danger/40"
                      }`}
                    >
                      {pwdMessage.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      )}
                      <span>{pwdMessage.text}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[#111111] bg-accent rounded-xl shadow-lg shadow-accent/20 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                      {pwdLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Confirm & Save Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPwdStep(1);
                        setPwdMessage({ type: "", text: "" });
                      }}
                      className="inline-flex items-center justify-center px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-text bg-card border border-border rounded-xl hover:bg-card-hover transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 3. SESSIONS TAB */}
        {currentTab === "#sessions" && (
          <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 p-5 sm:p-8">
            <ManageSessions />
          </div>
        )}

        {/* 4. BLOCKLIST TAB */}
        {currentTab === "#blocklist" && (
          <div className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 p-5 sm:p-8">
            <EmailBlocklist />
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {currentTab === "#settings" && (
          <div id="settings-tab" className="bg-card/85 backdrop-blur-xl rounded-2xl shadow-lg border border-border/80 p-5 sm:p-8">
            <AdminSettings />
          </div>
        )}
      </div>
    </div>
  );
}

