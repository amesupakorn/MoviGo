"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function ChangePassword() {
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        try {
            const response = await api.put("/profile/change-password", {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });

            if (response.status === 200) {
                setSuccess("Password updated successfully!");
                setIsEditing(false);
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setError("Failed to update password. Please try again.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
            <h2 className="font-bold text-xl mb-4">Password</h2>

            {!isEditing ? (
                <div>
                    <p className="text-gray-500">Current Password</p>
                    <p className="font-semibold mb-2">**********</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-white px-6 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Change Password
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div>
                        <label className="text-gray-500">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            className="block w-full p-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="block w-full p-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="block w-full p-3 border rounded-lg shadow-sm focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    <div className="mt-6 flex space-x-2">
                        <button
                            onClick={handleSave}
                            className="bg-orange-500 text-white px-10 py-1 rounded-full hover:bg-orange-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="bg-white text-black px-5 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}