import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ChangePasswordProps {
  passwordForm: any;
  setPasswordForm: React.Dispatch<React.SetStateAction<any>>;
  showCurrentPassword: boolean;
  setShowCurrentPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmPassword: boolean;
  setShowConfirmPassword: React.Dispatch<React.SetStateAction<boolean>>;
  onPasswordChange: (e: React.FormEvent) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  passwordForm, setPasswordForm,
  showCurrentPassword, setShowCurrentPassword,
  showNewPassword, setShowNewPassword,
  showConfirmPassword, setShowConfirmPassword,
  onPasswordChange
}) => {
  return (
    <div className="bg-card dark:bg-card rounded-lg  shadow-lg p-6 text-foreground">
      <h2 className="md:text-2xl text-xl font-bold mb-6">Change Password</h2>
      <form onSubmit={onPasswordChange} className="max-w-xl space-y-6">
        
        {/* Current Password */}
        <div>
          <label className="block md:text-sm text-xs font-medium mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
              className="w-full px-4 py-3 rounded-lg md:text-sm text-xs border border-border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card dark:text-foreground pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 md:text-sm text-xs  -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showCurrentPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block md:text-sm text-xs  font-medium mb-2">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
              className="w-full px-4 py-3 md:text-sm text-xs  rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card dark:text-foreground pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 md:text-sm text-xs  top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block md:text-sm text-xs  font-medium mb-2">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 md:text-sm text-xs  rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary dark:bg-card dark:text-foreground pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 md:text-sm text-xs  top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-primary md:text-sm text-xs  text-background font-medium rounded-lg hover:bg-primary-dark transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
