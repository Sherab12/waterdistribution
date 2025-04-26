'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from 'src/components/navbar';
import toast from 'react-hot-toast';

export default function EditValvePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [valve, setValve] = useState({
        topic: '',
        fieldId: '',
        type: 'valve',
    });

    const [fields, setFields] = useState([]);

    useEffect(() => {
        if (id) {
            axios.get(`/api/valve?id=${id}`).then((res) => {
                setValve({
                    topic: res.data.topic,
                    fieldId: res.data.fieldId?._id,
                    type: res.data.type || 'valve',
                });
            });
        }
    
        axios.get('/api/fields')
        .then((res) => setFields(res.data))
        .catch(() => toast.error("Failed to load fields"));
    }, [id]);
    

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setValve({ ...valve, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.put('/api/valve', { _id: id, ...valve });
        toast.success("Valve updated");
        router.push('/devices');
    };

    return (
        <div className="flex">
        <Navbar activePage="devices" />
        <main className="flex-1 p-8 ml-[250px]">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Valve</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                name="topic"
                value={valve.topic}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <select
                name="fieldId"
                value={valve.fieldId}
                onChange={handleChange}
                required
                className="w-full border px-4 py-2 rounded-md"
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
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Update Valve
                </button>
                <button type="button" onClick={() => router.push('/devices')} className="bg-gray-300 px-4 py-2 rounded-md">
                Cancel
                </button>
            </div>
            </form>
        </main>
        </div>
    );
}
