"use client";
import { useState } from "react";

interface LabelInputProps {
    label: string;
    placeholder: string;
    type?: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const LabelInput = ({
    label,
    placeholder,
    type,
    id,
    value,
    onChange,
    error,
}: LabelInputProps) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                htmlFor={id}
                className="text-sm font-medium text-neutral-700"
            >
                {label}
            </label>
            <input
                id={id}
                type={type ?? "text"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
                className={`w-full rounded-lg border px-3.5 py-2.5 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors
                    ${error
                        ? "border-red-300 focus:border-red-400"
                        : "border-neutral-200 focus:border-neutral-900"
                    }`}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

const Signup = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
    });

    const update = (key: keyof typeof form) => (value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(form);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
                        Create your account
                    </h1>
                    <p className="mt-1.5 text-sm text-neutral-500">
                        Set up admin access to manage your store.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <LabelInput
                        id="username"
                        label="Username"
                        placeholder="yourname"
                        value={form.username}
                        onChange={update("username")}
                    />
                    <LabelInput
                        id="phoneNumber"
                        label="Phone number"
                        placeholder="9876543210"
                        type="tel"
                        value={form.phoneNumber}
                        onChange={update("phoneNumber")}
                    />
                    <LabelInput
                        id="password"
                        label="Password"
                        placeholder="At least 8 characters"
                        type="password"
                        value={form.password}
                        onChange={update("password")}
                    />
                    <LabelInput
                        id="confirmPassword"
                        label="Confirm password"
                        placeholder="Re-enter your password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={update("confirmPassword")}
                    />

                    <button
                        type="submit"
                        className="mt-2 w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 active:bg-neutral-950"
                    >
                        Create account
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Already have an account?{" "}
                    <a
                        href="/signin"
                        className="font-medium text-neutral-900 hover:underline"
                    >
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Signup;