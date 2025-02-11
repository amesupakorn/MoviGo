"use client";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ChangePassword from "@/app/client/profile/change-password";
import api from "@/lib/axios";
import { User } from "@/lib/types/user";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/setLogged";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const { updateNavName, updateNavProfileImage } = useAuth();

    const [token, setToken] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [, setSelectedFile] = useState<File | null>(null);
    const {setError, setSuccess} = useAlert();
    const [editedUser, setEditedUser] = useState<{ name: string;}>({
        name: ""
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
                    const response = await api.get(`/profile`)
                    if (response.data.user) {
                        setUser(response.data.user);
                        setEditedUser({ name: response.data.user.name });
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
            setEditedUser({ name: user.name });
        }
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            handleUpload(e.target.files[0]);        }
    };

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/profile/uploadImage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            URL.createObjectURL(file)
            // window.location.reload();

            setSuccess("Upload Success");
            updateNavProfileImage(response.data.user.profileImage);
            setUser((prev) =>
                prev ? { ...prev, profileImage: `${response.data.user.profileImage}?t=${Date.now()}` } : response.data.user
            );
                } catch (err) {
            setError("Failed to upload image");
            console.error("Failed to upload image:", err);
        }
    };

    const handleSave = async () => {
        try {
            if (token) {
                const response = await api.put(`/profile`, editedUser);
                updateNavName(response.data.user.name);

                setSuccess("Edit your profile success");
                setIsEditing(false);
            }
        } catch (error) {
            setError("Failed to update profile");
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <div className="mt-10  flex justify-center items-center">
            <main className="shadow-lg bg-white  w-[1200px]">
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
                            <input type="file" className="hidden" onChange={handleFileChange} />
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
                                <button onClick={handleEdit} className="flex text-blue-500 items-center px-11 py-2 rounded-lg border border-blue-500 hover:bg-blue-50">
                                    <MdEdit /> &nbsp;  Edit Profile
                                </button>
                            )}
                        </div>
                </div>

                {/* Email Section */}
                <div className="p-6 rounded-lg mb-6">
                    <h2 className="font-bold text-xl mb-4">Email Address</h2>
                    <p className="text-gray-500">Email</p>
                    <p className="font-semibold">{user?.email}</p>
                </div>

                <div className="p-6 rounded-lg mb-6 md:w-[500px] w-full">
                    <ChangePassword />
                </div>
            </main>
        </div>
    );
}