"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { TbLockPassword } from "react-icons/tb";
import { useAlert } from "@/app/context/AlertContext";


export default function ChangePassword() {
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const { setSuccess } = useAlert();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            // setError(" ")
            await api.put("/auth/change-password", {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });

            setSuccess("Password updated successfully!");
            setIsEditing(false);
            setError(" ");
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err : any) {
            setError(err.response?.data?.error || "Failed to update password. Please try again.");
        }
    };

    return (
        <div >
            <h2 className="font-bold text-white text-xl mb-4">Password</h2>

            {!isEditing ? (
                <div>
                    <p className="text-gray-200">Current Password</p>
                    <p className="font-semibold mb-2 text-amber-500 mt-2">**********</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex text-amber-500 items-center px-4 py-2 rounded-lg border border-amber-500 hover:bg-amber-200">
                        <TbLockPassword />
                        &nbsp;
                        Change Password
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {error && <p className="text-red-500">{error}</p>}

                    <div>
                        <label className="text-gray-300">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100 mt-2"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100 mt-2"
                        />
                    </div>

                    <div>
                        <label className="text-gray-300">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100 mt-2"
                        />
                    </div>

                    <div className="mt-6 flex space-x-2">
                        <button onClick={handleSave} className="transition-colors duration-300 bg-amber-500 text-white px-10 py-2 rounded-lg hover:bg-amber-600">
                                Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="transition-colors duration-300 text-amber-500 border border-amber-500 px-10 py-2 rounded-lg hover:bg-amber-100">
                           Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}