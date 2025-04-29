'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from 'src/components/navbar';
import toast from 'react-hot-toast';

export default function NewValvePage() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [fieldId, setFieldId] = useState('');
    const [fields, setFields] = useState([]);

    useEffect(() => {
        axios.get('/api/fields')
        .then((res) => setFields(res.data))
        .catch(() => toast.error('Failed to fetch fields.'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
        await axios.post('/api/valve', {
            fieldId,
            topic,
            type: 'valve',
        });
        toast.success('Valve created!');
        router.push('/devices');
        } catch (err) {
        toast.error('Error creating valve');
        }
    };

    return (
        <div className="flex">
        <Navbar activePage="devices" />
        <main className="flex-1 p-8 ml-[250px]">
            <h1 className="text-xl font-semibold mb-6 text-gray-800">Add New Valve</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <select
                value={fieldId}
                onChange={(e) => setFieldId(e.target.value)}
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

            <div className="flex gap-4 justify-end">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Save Valve
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
