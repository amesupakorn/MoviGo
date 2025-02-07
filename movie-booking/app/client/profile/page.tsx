"use client";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

import api from "@/lib/axios";
import { User } from "@/lib/types/user";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<{ name: string; email: string }>({
        name: "",
        email: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (token) {
                    const response = await api.get(`/profile`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.data.user) {
                        setUser(response.data.user);
                        setEditedUser({ name: response.data.user.name, email: response.data.user.email });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        if (user) {
            setEditedUser({ name: user.name, email: user.email });
        }
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            if (token) {
                const response = await api.put(`/profile/update`, editedUser, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.user);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <main className="bg-white  w-[1000px]">
            <div className="p-4 bg-blue-500 text-white justify-center rounded-t-xl">
                    <h1 className="text-xl font-semibold">PROFILE</h1>
                </div>


                {/* Profile Picture Section */}
                <div className="p-6 rounded-lg mb-6">
                    <h2 className="font-bold text-xl mb-4">Profile Picture</h2>
                    <div className="flex items-center">
                        <img
                            src={user?.profileImage}
                            alt="Profile"
                            className="h-24 w-24 rounded-full object-cover mr-4"
                        />
                        <label className="flex items-center px-5 py-2 border border-blue-500 text-blue-500 rounded-full cursor-pointer hover:bg-blue-50">
                            <FaCamera />
                            {/* <input type="file" className="hidden" onChange={handleUpload} /> */}
                            &nbsp; Upload New
                        </label>
                    </div>
                </div>

                {/* Personal Information Section */}
                <div className=" p-6 mb-6 shadow-sm">
                    <h2 className="font-bold text-xl mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-500 ">Username</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="border p-2 rounded rounded-xl w-full bg-gray-100"
                                    value={editedUser.name}
                                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                />
                            ) : (
                                <p className="font-semibold">{editedUser.name}</p>
                            )}
                        </div>
                    </div>


                    {/* Edit/Save/Cancel Buttons */}
                        <div className="mt-6 flex space-x-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="bg-blue-500 text-white px-10 py-2 rounded-lg">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="text-blue-500 border border-blue-500 px-10 py-2 rounded-lg">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="flex text-blue-500 items-center px-10 py-2 rounded-lg border border-blue-500 hover:bg-blue-50">
                                    <MdEdit /> &nbsp;  Edit Profile
                                </button>
                            )}
                        </div>
                </div>

                {/* Email Section */}
                <div className="p-6 rounded-lg mb-6">
                    <h2 className="font-bold text-xl mb-4">Email Address</h2>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold">{editedUser.email}</p>
                </div>
            </main>
        </div>
    );
}