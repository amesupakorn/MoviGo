"use client";
import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import ChangePassword from "@/app/client/profile/change-password";
import api from "@/lib/axios";
import { User } from "@/lib/types/user";
import { useAlert } from "@/app/context/AlertContext";
import { useAuth } from "@/app/context/setLogged";
import { MdOutlineMailOutline } from "react-icons/md";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const { updateNavName, updateNavProfileImage } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [, setSelectedFile] = useState<File | null>(null);
    const {setError, setSuccess} = useAlert();
    const [editedUser, setEditedUser] = useState<{ name: string;}>({
        name: ""
    });

    useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const response = await api.get(`/profile`)
                    if (response.data.user) {
                        setUser(response.data.user);
                        setEditedUser({ name: response.data.user.name });
                    }
                }
                catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
            fetchUserData();
    }, []);


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
                const response = await api.put(`/profile`, editedUser);
                updateNavName(response.data.user.name);

                setSuccess("Edit your profile success");
                setIsEditing(false);
            }
         catch (error) {
            setError("Failed to update profile");
            console.error("Failed to update profile:", error);
        }
    };

    return (
        <div className="mt-12 md:mt-32 flex flex-col justify-center items-center">
            <div className="w-full  md:w-[850px] md:p-12 p-10  items-center text-white rounded-xs md:rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 ">
                <div className="flex flex-row">
                    <img
                            src={user?.profileImage}
                            alt="Profile"
                            className="h-24 w-24 md:w-24 md:h-24 rounded-full object-cover mr-4 md:mt-4"
                        />
                    <div className="flex flex-col mt-4">
                        <h2 className="text-lg md:text-3xl md:mb-4">{editedUser.name}</h2>
                        <div className="flex flex-row space-x-2">
                            <p className="text-xl my-1 md:text-2xl"><MdOutlineMailOutline /></p>
                            <h3 className="ext-base flex md:text-xl"> {user?.email}</h3>
                        </div>
                    </div>
                   
                </div>
               

            </div>
            <main className="max-w-full flex flex-col md:flex-row mt-6">

                {/* Profile Picture Section */}
                <div className="">
                    <div className="p-6 md:p-6 rounded-lg mb-6">
                        <h2 className="font-bold text-white text-xl mb-4">Profile Picture</h2>
                        <div className="flex items-center">
                            <img
                                src={user?.profileImage}
                                alt="Profile"
                                className="h-24 w-24 rounded-full object-cover mr-4"
                            />
                            <label className="transition-colors duration-300 flex items-center px-5 py-2 border border-amber-500 text-amber-500 rounded-full cursor-pointer hover:bg-amber-100">
                                <FaCamera />
                                <input type="file" className="hidden " onChange={handleFileChange} />
                                &nbsp; Upload New
                            </label>
                        </div>
                    </div>


                    <div className="p-6 rounded-lg mb-6 md:w-[500px] w-full">
                        <ChangePassword />
                    </div>
                </div>
               


                {/* Personal Information Section */}
                <div>
                    <div className=" p-6 mb-6 border-b-2">
                        <h2 className="font-bold text-white text-xl mb-4">Personal Information</h2>
                        <div className=" gap-6">
                            <div>
                                <label className="text-gray-200 ">Username</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        className="border p-2 mt-2 rounded rounded-xl w-full bg-gray-100"
                                        value={editedUser.name}
                                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                                    />
                                ) : (
                                    <p className="font-semibold text-amber-500 mt-2">{editedUser.name}</p>
                                )}
                            </div>
                        </div>

    


                    {/* Edit/Save/Cancel Buttons */}
                        <div className="mt-4 flex space-x-2">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="transition-colors duration-300 bg-amber-500 text-white px-10 py-2 rounded-lg hover:bg-amber-600">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="transition-colors duration-300 text-amber-500 border border-amber-500 px-10 py-2 rounded-lg hover:bg-amber-100">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleEdit} className="transition-colors duration-300 flex text-amber-500 items-center px-11 py-2 rounded-lg border border-amber-500 hover:bg-amber-100">
                                    <MdEdit /> &nbsp;  Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Email Section */}
                    <div className="p-6 rounded-lg mb-6">
                        <h2 className="font-bold text-xl mb-4 text-white">Email Address</h2>
                        <p className="text-gray-200">Email</p>
                        <p className="font-semibold text-amber-500 mt-2">{user?.email}</p>
                    </div>
                </div>
                

            </main>
        </div>
    );
}