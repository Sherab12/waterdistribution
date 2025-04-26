'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from 'src/components/navbar';
import toast from 'react-hot-toast';

export default function EditDevicePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [device, setDevice] = useState({
        topic: '',
        fieldId: '',
        type: '',
    });

    const [fields, setFields] = useState([]);

    useEffect(() => {
        if (id) {
        axios.get(`/api/sensors?id=${id}`).then((res) => {
            setDevice({
            topic: res.data.topic,
            fieldId: res.data.fieldId._id,
            type: res.data.type,
            });
        });
        }

        axios.get('/api/fields').then((res) => {
        setFields(res.data);
        }).catch(() => {
        toast.error("Failed to load fields");
        });
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setDevice({ ...device, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.put('/api/sensors', { _id: id, ...device });
        toast.success("Sensor updated");
        router.push('/devices');
    };

    return (
        <div className="flex">
        <Navbar activePage="devices" />
        <main className="flex-1 p-8 ml-[250px]">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">
            Edit Device
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
                </label>
                <input
                name="topic"
                value={device.topic}
                onChange={handleChange}
                placeholder="Device topic"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Sensor Type
                </label>
                <select
                name="type"
                value={device.type}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select Sensor Type</option>
                <option value="flow">Flow</option>
                <option value="pressure">Pressure</option>
                <option value="level">Level</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Field
                </label>
                <select
                name="fieldId"
                value={device.fieldId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="">Select a Field</option>
                {fields.map((field: any) => (
                    <option key={field._id} value={field._id}>
                    {field.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="flex gap-4">
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                Update Device
                </button>
                <button
                type="button"
                onClick={() => router.push('/devices')}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                Cancel
                </button>
            </div>
            </form>
        </main>
        </div>
    );
}
