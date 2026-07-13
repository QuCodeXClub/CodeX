import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Phone, Camera, Save, Loader2, Shield, Key, Monitor, LogOut, Trash2, Eye, EyeOff } from "lucide-react";
import { adminService } from "../../services/adminService";
import { setLogin, setLogout } from "../../context/authSlice";
import axios from "axios";
import ManageSessions from "./ManageSessions";

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
    otp: ""
  });
  const [pwdStep, setPwdStep] = useState(1);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };



  useEffect(() => {
    if (user) {
      const adminObj = user.admin || user;
      setFormData({
        name: adminObj.name || "",
        mobileNumber: adminObj.mobileNumber || "",
      });
      setPreviewPhoto(adminObj.profilePhoto || null);
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

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      if (formData.name) submitData.append("name", formData.name);
      if (formData.mobileNumber) submitData.append("mobileNumber", formData.mobileNumber);
      if (profilePhoto) submitData.append("profilePhoto", profilePhoto);

      const response = await adminService.updateProfile(submitData);
      
      if (response.success) {
        dispatch(setLogin(response.data));
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to update profile." 
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
      setPwdMessage({ type: "success", text: "OTP sent to your registered email." });
      setPwdStep(2);
    } catch (error) {
      setPwdMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to initiate password change." 
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
      setPwdMessage({ type: "success", text: "Password changed successfully!" });
      setPwdData({ oldPassword: "", newPassword: "", confirmPassword: "", otp: "" });
      setPwdStep(1);
    } catch (error) {
      setPwdMessage({ 
        type: "error", 
        text: error.response?.data?.message || "Failed to change password." 
      });
    } finally {
      setPwdLoading(false);
    }
  };





  const tabs = [
    { id: "#profile", name: "Profile Details", icon: User },
    { id: "#password", name: "Security", icon: Key },
    { id: "#sessions", name: "Active Sessions", icon: Monitor },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
      {/* Page Header with Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal profile, security, and active sessions.
          </p>
        </div>
        
        {/* Horizontal Tabs (Top Right) */}
        <div className="flex space-x-1 bg-slate-100/80 p-1.5 rounded-xl w-full lg:w-max overflow-x-auto border border-slate-200/60 shrink-0">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.id}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                currentTab === tab.id
                  ? "bg-white text-teal-700 shadow-sm ring-1 ring-slate-900/5 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${currentTab === tab.id ? "text-teal-600" : "text-slate-400"}`} />
              {tab.name}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6 min-w-0">

      {/* 1. Profile Edit */}
      {currentTab === "#profile" && (
      <div id="profile" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <User className="text-teal-600 w-5 h-5" />
          <h2 className="font-semibold text-slate-800">Profile Details</h2>
        </div>
        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmitProfile} className="space-y-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-100">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg relative">
                  {previewPhoto ? (
                    <img 
                      src={previewPhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-500">
                      <User size={48} />
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 bg-teal-500 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-teal-600 transition-colors"
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
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-slate-900">Profile Photo</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Upload a new Profile Picture.
                </p>
                <label 
                  htmlFor="photo-upload"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Change Photo
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={(user?.admin || user)?.email || ""}
                    disabled
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Email address cannot be changed.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield size={18} />
                  </div>
                  <input
                    type="text"
                    value="Administrator"
                    disabled
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
            {message.text && (
              <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {message.text}
              </div>
            )}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* 2. Change Password */}
      {currentTab === "#password" && (
      <div id="password" className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
          <Key className="text-teal-600 w-5 h-5" />
          <h2 className="font-semibold text-slate-800">Change Password</h2>
        </div>
        <div className="p-8 sm:p-10">
          {pwdStep === 1 ? (
            <form onSubmit={handleSubmitPasswordRequest} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2 max-w-md">
                  <label className="text-sm font-medium text-slate-700 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={pwdData.oldPassword}
                      onChange={handlePwdChange}
                      className="block w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPasswords.oldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-slate-700 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={pwdData.newPassword}
                      onChange={handlePwdChange}
                      className="block w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <label className="text-sm font-medium text-slate-700 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={pwdData.confirmPassword}
                      onChange={handlePwdChange}
                      className="block w-full px-3 py-2.5 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {pwdMessage.text && (
                <div className={`p-4 rounded-lg text-sm max-w-2xl ${pwdMessage.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pwdMessage.text}
                </div>
              )}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-slate-800 border border-transparent rounded-lg shadow-sm hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Requesting
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4 mr-2" />
                      Request Password Change
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitPasswordVerify} className="space-y-6">
              <div className="space-y-2 max-w-md">
                <label className="text-sm font-medium text-slate-700 block">
                  Enter OTP
                </label>
                <p className="text-xs text-slate-500 mb-2">Please enter the 6-digit OTP sent to your email.</p>
                <input
                  type="text"
                  name="otp"
                  value={pwdData.otp}
                  onChange={handlePwdChange}
                  className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-colors text-center tracking-widest font-mono text-lg"
                  maxLength={6}
                  required
                />
              </div>
              
              {pwdMessage.text && (
                <div className={`p-4 rounded-lg text-sm max-w-2xl ${pwdMessage.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {pwdMessage.text}
                </div>
              )}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify & Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPwdStep(1);
                    setPwdMessage({ type: "", text: "" });
                  }}
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      )}

      {/* 3. Sessions */}
      {currentTab === "#sessions" && (
        <div id="sessions">
          <ManageSessions />
        </div>
      )}

      </div>
    </div>
  );
}
