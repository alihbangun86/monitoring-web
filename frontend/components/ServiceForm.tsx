"use client";

import { useState } from "react";
import { createService } from "@/services/serviceApi";

interface Props {
    onSuccess: () => void;
}

export default function ServiceForm({
    onSuccess,
}: Props) {

    const [form, setForm] = useState({
        name: "",
        url: "",
        category: "Website",
        interval_seconds: 60,
    });

    const submit = async (e: React.FormEvent) => {

        e.preventDefault();

        await createService(form);

        setForm({
            name: "",
            url: "",
            category: "Website",
            interval_seconds: 60,
        });

        onSuccess();

    };

    return (

        <form
            onSubmit={submit}
            className="text-2xl font-bold text-gray-900 mb-5"
        >

            <h2 className="text-xl font-semibold mb-4">
                Tambah Service
            </h2>

            <div className="grid grid-cols-4 gap-4">

                <input
                    className="border rounded p-2"
                    placeholder="Nama"
                    value={form.name}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            name: e.target.value,
                        })
                    }
                />

                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                    value={form.url}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            url: e.target.value,
                        })
                    }
                />

                <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.category}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            category: e.target.value,
                        })
                    }
                >

                    <option>Website</option>

                    <option>API</option>

                    <option>Server</option>

                </select>

                <button
                    className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-lg"
                >
                    Tambah
                </button>

            </div>

        </form>

    );
}