import { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Country Explorer</h1>

                <input
                    type="text"
                    className="border border-gray-300 p-3 mb-6 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search by name or region..."
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 border-b">Flag</th>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Capital</th>
                            <th className="p-3 border-b">Region</th>
                            <th className="p-3 border-b">Population</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((c, index) => (
                            <tr
                                key={index}
                                onClick={() => setSelected(c)}
                                className="hover:bg-blue-50 cursor-pointer transition-colors border-b"
                            >
                                <td className="p-3"><img src={c.flag} alt="flag" className="w-10 shadow-sm rounded" /></td>
                                <td className="p-3 font-medium">{c.name}</td>
                                <td className="p-3 text-gray-600">{c.capital}</td>
                                <td className="p-3 text-gray-600">{c.region}</td>
                                <td className="p-3 text-gray-600">{c.population.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-xl max-w-sm w-full relative shadow-2xl">
                        <button className="absolute top-4 right-4 text-gray-500 text-2xl" onClick={() => setSelected(null)}>&times;</button>
                        <img src={selected.flag} className="w-full h-40 object-cover rounded-lg mb-4 shadow" />
                        <h2 className="text-3xl font-bold mb-4">{selected.name}</h2>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Capital:</strong> {selected.capital}</p>
                            <p><strong>Region:</strong> {selected.region}</p>
                            <p><strong>Population:</strong> {selected.population.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}