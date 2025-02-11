"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { TbLockPassword } from "react-icons/tb";


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
        <div >
            <h2 className="font-bold text-xl mb-4">Password</h2>

            {!isEditing ? (
                <div>
                    <p className="text-gray-500">Current Password</p>
                    <p className="font-semibold mb-2">**********</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex text-blue-500 items-center px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-50">
                        <TbLockPassword />
                        &nbsp;
                        Change Password
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-500">{success}</p>}

                    <div>
                        <label className="text-gray-500">Current Password</label>
                        <input
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="text-gray-500">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            className="border p-2 rounded rounded-xl w-full bg-gray-100"
                        />
                    </div>

                    <div className="mt-6 flex space-x-2">
                        <button onClick={handleSave} className="bg-blue-500 text-white px-10 py-2 rounded-lg">
                                Save
                        </button>
                        <button onClick={() => setIsEditing(false)} className="text-blue-500 border border-blue-500 px-10 py-2 rounded-lg">
                           Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}