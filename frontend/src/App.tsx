import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Globe, Users, MapPin, X } from 'lucide-react';

interface Country {
    name: string;
    capital: string;
    region: string;
    population: number;
    flag: string;
}

export default function App() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<Country | null>(null);

    useEffect(() => {
        axios.get<Country[]>('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Backend connection error:", err));
    }, []);

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.region.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-10 font-sans text-slate-800">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        Global Explorer
                    </h1>
                    <p className="text-slate-500 italic">Discover insights about countries around the world</p>
                </div>

                {/* Glassmorphism Search Bar */}
                <div className="relative mb-8 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md border border-white shadow-xl rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                        placeholder="Search by name or region..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Table with Hover Effects */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                            <tr className="bg-slate-100/50 text-slate-500 uppercase text-xs tracking-widest">
                                <th className="p-5">Flag</th>
                                <th className="p-5">Country</th>
                                <th className="p-5">Capital</th>
                                <th className="p-5">Region</th>
                                <th className="p-5 text-right">Population</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {filtered.map((c, index) => (
                                <tr
                                    key={index}
                                    onClick={() => setSelected(c)}
                                    className="group hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200"
                                >
                                    <td className="p-5">
                                        <img src={c.flag} alt="flag" className="w-12 h-8 object-cover rounded shadow-sm group-hover:scale-110 transition-transform" />
                                    </td>
                                    <td className="p-5 font-bold">{c.name}</td>
                                    <td className="p-5 opacity-80">{c.capital}</td>
                                    <td className="p-5">
                                            <span className="px-3 py-1 bg-slate-200/50 group-hover:bg-blue-500 rounded-full text-xs">
                                                {c.region}
                                            </span>
                                    </td>
                                    <td className="p-5 text-right font-mono">{c.population.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            {selected && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl overflow-hidden max-w-sm w-full relative shadow-2xl transform transition-all">
                        <button
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur shadow rounded-full p-1 text-slate-600 hover:text-black z-10"
                            onClick={() => setSelected(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <img src={selected.flag} className="w-full h-48 object-cover" />

                        <div className="p-8">
                            <h2 className="text-3xl font-black text-slate-800 mb-6">{selected.name}</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MapPin size={20}/></div>
                                    <div><p className="text-xs text-slate-400">Capital</p><p className="font-semibold">{selected.capital}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Globe size={20}/></div>
                                    <div><p className="text-xs text-slate-400">Region</p><p className="font-semibold">{selected.region}</p></div>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20}/></div>
                                    <div><p className="text-xs text-slate-400">Population</p><p className="font-semibold">{selected.population.toLocaleString()}</p></div>
                                </div>
                            </div>
                            <button
                                className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                                onClick={() => setSelected(null)}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}