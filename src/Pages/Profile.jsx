import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import {
  User,
  Mail,
  Camera,
  Lock,
  LogOut,
  Check,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { userApi } from "../Api/userApi.js";

function PasswordFieldError({ id, message }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-red-600"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" aria-hidden />
      {message}
    </p>
  );
}

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const emptyPasswordErrors = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    form: "",
  };
  const [passwordErrors, setPasswordErrors] = useState(emptyPasswordErrors);

  const getPasswordValidationErrors = () => {
    const errors = { ...emptyPasswordErrors };

    if (!passwordForm.oldPassword.trim()) {
      errors.oldPassword = "Current password is required.";
    } else if (passwordForm.oldPassword.length < 8) {
      errors.oldPassword = "Must be at least 8 characters.";
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = "New password is required.";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Must be at least 8 characters.";
    } else if (
      passwordForm.oldPassword.trim() &&
      passwordForm.oldPassword === passwordForm.newPassword
    ) {
      errors.newPassword = "Must be different from your current password.";
    }

    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (passwordForm.confirmPassword.length < 8) {
      errors.confirmPassword = "Must be at least 8 characters.";
    } else if (
      passwordForm.newPassword.trim() &&
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      errors.confirmPassword = "Does not match new password.";
    }

    return errors;
  };

  const passwordErrorsPresent = (errs) =>
    Object.values(errs).some((v) => typeof v === "string" && v.length > 0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    const { name } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: e.target.value }));
    setPasswordErrors((prev) => {
      const next = { ...prev, form: "" };
      next[name] = "";
      if (name === "newPassword") {
        next.confirmPassword = "";
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordSuccessMessage("");
    setLoading(true);
    try {
      const response = await userApi.updateAccount({
        name: form.name,
      });
      setUser(response.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    const validationErrors = getPasswordValidationErrors();
    if (passwordErrorsPresent(validationErrors)) {
      setPasswordErrors(validationErrors);
      return;
    }

    setPasswordErrors(emptyPasswordErrors);
    setPasswordSuccessMessage("");

    setPasswordUpdating(true);
    try {
      await userApi.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      // Stay on this page — no navigation after a successful password change.
      setPasswordSuccessMessage(
        "Your password was updated successfully. You stay on this profile page and remain signed in."
      );
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors(emptyPasswordErrors);
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordErrors({
        ...emptyPasswordErrors,
        form: err.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  const togglePasswordForm = () => {
    setShowPasswordForm((prev) => {
      if (!prev) {
        setPasswordSuccessMessage("");
      }
      return !prev;
    });
    setPasswordErrors(emptyPasswordErrors);
  };

  const isPasswordFormValid = () => {
    return (
      passwordForm.oldPassword.trim() !== "" &&
      passwordForm.newPassword.trim() !== "" &&
      passwordForm.confirmPassword.trim() !== ""
    );
  };

  const hasPasswordFieldErrors =
    !!passwordErrors.oldPassword ||
    !!passwordErrors.newPassword ||
    !!passwordErrors.confirmPassword;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // In a real app, you'd upload this to the server
        // and update the user state with the new URL
        setUser({ ...user, avatar: { url: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user)
    return (
      <div className="p-10 text-center">
        Please log in to view your profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
          >
            {message.type === "success" && <Check className="w-5 h-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-orange-50 bg-gray-100 flex items-center justify-center overflow-hidden mx-auto">
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-[#F59115] uppercase">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-[#F59115] p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {user.role}
              </p>

              <div className="mt-8 pt-6 border-t border-gray-50">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-100 text-red-600 rounded-xl hover:bg-red-50 transition-all font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Account Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Member Since</span>
                  <span className="text-gray-900 font-medium">April 2026</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Account status</span>
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50">
                <button
                  onClick={() => (window.location.href = "/order-history")}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-all font-bold text-sm group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Order History
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Information Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition-all"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 ml-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || passwordUpdating}
                    className="bg-[#F59115] hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-50 px-8 py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                    {showPasswordForm && (
                      <p className="mt-1 text-xs text-gray-500">
                        Use at least 8 characters for each field.
                      </p>
                    )}
                    {showPasswordForm && hasPasswordFieldErrors && (
                      <p
                        className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-600"
                        role="status"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>Please correct the issues below each field.</span>
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordForm}
                    disabled={passwordUpdating}
                    className={`flex shrink-0 items-center gap-2 text-sm font-medium transition-colors ${
                      passwordUpdating
                        ? "cursor-not-allowed text-gray-300"
                        : isPasswordFormValid()
                          ? "cursor-pointer text-[#F59115] hover:text-orange-600"
                          : "cursor-pointer text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    {showPasswordForm ? "Cancel" : "Update Password"}
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${showPasswordForm ? "rotate-90" : ""}`}
                    />
                  </button>
                </div>
                {passwordSuccessMessage ? (
                  <div
                    className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50/90 px-4 py-3 text-green-800"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2.5">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
                      <p className="text-sm font-medium leading-snug">{passwordSuccessMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPasswordSuccessMessage("")}
                      className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-green-800 underline-offset-2 hover:bg-green-100/80 hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Collapsible Password Form */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  showPasswordForm ? "max-h-[920px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <form
                  onSubmit={handleUpdatePassword}
                  noValidate
                  className="p-8 space-y-6 border-t border-gray-50"
                >
                  {passwordErrors.form ? (
                    <div
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
                      <p className="font-medium leading-snug">{passwordErrors.form}</p>
                    </div>
                  ) : null}
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="profile-password-old"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          id="profile-password-old"
                          type="password"
                          name="oldPassword"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          disabled={passwordUpdating}
                          autoComplete="current-password"
                          aria-invalid={!!passwordErrors.oldPassword}
                          aria-describedby={
                            passwordErrors.oldPassword ? "profile-password-old-error" : undefined
                          }
                          className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border-0 transition-all disabled:opacity-60 disabled:cursor-wait ${
                            passwordErrors.oldPassword
                              ? "bg-red-50/60 ring-2 ring-red-200 focus:ring-2 focus:ring-red-300"
                              : "bg-gray-50 focus:ring-2 focus:ring-orange-400"
                          }`}
                          placeholder="Enter current password"
                        />
                      </div>
                      <PasswordFieldError
                        id="profile-password-old-error"
                        message={passwordErrors.oldPassword}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="profile-password-new"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="profile-password-new"
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            disabled={passwordUpdating}
                            autoComplete="new-password"
                            aria-invalid={!!passwordErrors.newPassword}
                            aria-describedby={
                              passwordErrors.newPassword ? "profile-password-new-error" : undefined
                            }
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border-0 transition-all disabled:opacity-60 disabled:cursor-wait ${
                              passwordErrors.newPassword
                                ? "bg-red-50/60 ring-2 ring-red-200 focus:ring-2 focus:ring-red-300"
                                : "bg-gray-50 focus:ring-2 focus:ring-orange-400"
                            }`}
                            placeholder="Enter new password"
                          />
                        </div>
                        <PasswordFieldError
                          id="profile-password-new-error"
                          message={passwordErrors.newPassword}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="profile-password-confirm"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            id="profile-password-confirm"
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            disabled={passwordUpdating}
                            autoComplete="new-password"
                            aria-invalid={!!passwordErrors.confirmPassword}
                            aria-describedby={
                              passwordErrors.confirmPassword
                                ? "profile-password-confirm-error"
                                : undefined
                            }
                            className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border-0 transition-all disabled:opacity-60 disabled:cursor-wait ${
                              passwordErrors.confirmPassword
                                ? "bg-red-50/60 ring-2 ring-red-200 focus:ring-2 focus:ring-red-300"
                                : "bg-gray-50 focus:ring-2 focus:ring-orange-400"
                            }`}
                            placeholder="Confirm new password"
                          />
                        </div>
                        <PasswordFieldError
                          id="profile-password-confirm-error"
                          message={passwordErrors.confirmPassword}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={togglePasswordForm}
                      disabled={passwordUpdating}
                      className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={passwordUpdating || loading || !isPasswordFormValid()}
                      aria-busy={passwordUpdating}
                      className={`inline-flex min-w-[11.5rem] items-center justify-center gap-2 rounded-xl py-3 px-8 font-bold transition-colors ${
                        passwordUpdating && isPasswordFormValid()
                          ? "cursor-wait bg-[#F59115] text-white ring-2 ring-orange-200/80"
                          : isPasswordFormValid() && !loading
                            ? "cursor-pointer bg-[#F59115] text-white hover:bg-orange-600"
                            : "cursor-not-allowed bg-gray-300 text-gray-500"
                      }`}
                    >
                      {passwordUpdating ? (
                        <>
                          <Loader2
                            className="h-4 w-4 shrink-0 animate-spin"
                            aria-hidden
                          />
                          <span>Updating…</span>
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
