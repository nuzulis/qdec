import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://api.karantinaindonesia.go.id/ums/login",
        {
          username,
          password,
        }
      );

      const result = res.data;

      if (result.status === "200" && result.error === null) {
        const data = result.data;

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/");
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      setError("Gagal menghubungi server");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="flex right mb-6">
            <img
              className="dark:hidden"
              src="./images/logo/logo.png"
              alt="Logo"
              width={300}
              height={100}
            />
            <img
              className="hidden dark:block"
              src="./images/logo/logo-dark.png"
              alt="Logo"
              width={300}
              height={100}
            />
          </div>

          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
            {error && (
              <p className="mt-3 text-sm text-red-500 bg-red-100 px-4 py-2 rounded">
                {error}
              </p>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
              </div>

              <div>
                <Button className="w-full" size="sm">
                  Sign in
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Hubungi Admin
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
