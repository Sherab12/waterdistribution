'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

import Navbar from 'src/components/navbar';

export default function EditSourcePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [source, setSource] = useState({
        name: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        if (id) {
        axios.get(`/api/sources?id=${id}`).then((res) => {
            setSource(res.data);
        });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.put('/api/sources', { _id: id, ...source });
        router.push('/sources');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSource({ ...source, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex">
        <Navbar activePage="sources" />
        <main className="flex-1 p-8 ml-[250px]">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Source</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Name</label>
                <input
                name="name"
                value={source.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                name="location"
                value={source.location}
                onChange={handleChange}
                placeholder="Location"
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                name="description"
                value={source.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex gap-4 justify-end">
                <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                Update Source
                </button>
                <button
                type="button"
                onClick={() => router.push('/sources')}
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
