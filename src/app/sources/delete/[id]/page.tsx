'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function DeleteSourcePage() {
    const { id } = useParams();  // Use `useParams()` hook to get `id` from URL
    const router = useRouter();
    const [source, setSource] = useState(null);

    useEffect(() => {
        if (id) {
        axios.get(`/api/sources?id=${id}`).then((res) => {
            setSource(res.data);
        });
        }
    }, [id]);

    const handleDelete = async () => {
        await axios.delete(`/api/sources?id=${id}`);
        router.push('/sources');
    };

    const handleCancel = () => {
        router.push('/sources');
    };

    if (!source) return <div>Loading...</div>;

    return (
        <div className="p-4">
        <h1 className="text-xl mb-4">Delete Source</h1>
        <p>Are you sure you want to delete the source: <strong>{source.name}</strong>?</p>
        <div className="mt-4 flex gap-4">
            <button className="btn-red" onClick={handleDelete}>Yes, Delete</button>
            <button className="btn-default" onClick={handleCancel}>Cancel</button>
        </div>
        </div>
    );
}
