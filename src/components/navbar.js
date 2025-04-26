import { FaTachometerAlt, FaCalendarAlt, FaCogs, FaChartLine, FaBell, FaSignOutAlt, FaNetworkWired, FaSlidersH, FaShieldAlt } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";



const Navbar = ({ activePage }) => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/");
        } catch (error) {
            toast.error("Error during logout");
        }
    };

    const isActive = (page) =>
        activePage === page
            ? "bg-blue-800 text-white"
            : "hover:bg-blue-800 hover:text-white text-gray-700";

    return (
        <nav className="bg-white w-64 fixed h-screen p-4 rounded-sm shadow-sm border-r">
            <h1 className="text-xl font-bold mb-6 text-blue-800">AgriFlow</h1>

            {/* MAIN SECTION */}
            <div className="mb-6">
                <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Main</h2>
                <ul>
                    <li className="mb-2">
                        <button onClick={() => router.push("/profile")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('dashboard')}`}>
                            <FaTachometerAlt className="mr-2" /> Dashboard
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/sources")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('sources')}`}>
                            <FaNetworkWired className="mr-2" /> Sources & Fields
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/devices")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('devices')}`}>
                            <FaCogs className="mr-2" /> Devices
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/schedules")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('schedules')}`}>
                            <FaCalendarAlt className="mr-2" /> Schedules
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/analytics")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('analytics')}`}>
                            <FaChartLine className="mr-2" /> Analytics
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/command-center")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('command-center')}`}>
                            <FaShieldAlt className="mr-2" /> Command Center
                        </button>
                    </li>
                </ul>
            </div>

            {/* SETTINGS SECTION */}
            <div>
                <h2 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Settings</h2>
                <ul>
                    <li className="mb-2">
                        <button onClick={() => router.push("/settings")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('settings')}`}>
                            <FaSlidersH className="mr-2" /> Settings
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => router.push("/alerts")} className={`flex items-center px-4 py-2 text-sm rounded-sm w-full ${isActive('alerts')}`}>
                            <FaBell className="mr-2" /> Alerts
                        </button>
                    </li>
                    <li className="mb-2">
                        <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 text-sm rounded-sm hover:bg-blue-800 hover:text-white text-gray-700 w-full">
                            <FaSignOutAlt className="mr-2" /> Log Out
                        </button>
                    </li>
                </ul>
            </div>

            {/* Logout Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-md shadow-lg p-6 w-96 z-50">
                        <h2 className="text-xl text-center font-bold mb-4">Are you sure?</h2>
                        <p className="mb-4 text-center">Do you want to log out?</p>
                        <div className="flex justify-center space-x-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                            >
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
