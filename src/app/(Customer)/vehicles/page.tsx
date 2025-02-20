"use client";

import React, { useEffect, useState } from "react";
import { getWeatherForecast, WeatherForecast } from "@/dbUtils/CustomerAPIs/vehicleservice";

export default function VehiclePage() {
    const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchForecasts = async () => {
            try {
                const data = await getWeatherForecast();
                setForecasts(data);
            } catch (err) {
                setError("Failed to load weather forecasts.");
            } finally {
                setLoading(false);
            }
        };

        fetchForecasts();
    }, []);

    return (
        <main className="p-6 bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Weather Forecasts
                </h1>

                {loading && <p className="text-center text-gray-500">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-4 border-b">Date</th>
                                    <th className="p-4 border-b">Temperature (C)</th>
                                    <th className="p-4 border-b">Temperature (F)</th>
                                    <th className="p-4 border-b">Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forecasts.map((forecast, index) => (
                                    <tr key={index} className="hover:bg-gray-100">
                                        <td className="p-4 border-b">{forecast.date}</td>
                                        <td className="p-4 border-b">{forecast.temperatureC}</td>
                                        <td className="p-4 border-b">{forecast.temperatureF}</td>
                                        <td className="p-4 border-b">{forecast.summary}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
