import React, { useLayoutEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCityCoordinates,
  saveCityCoordinates,
  deleteCityCoordinates,
} from "../apidata/cityApi";
import { CityCoordinates } from "../types/types";

const DEFAULT_COORDINATES: [number, number] = [76.8858, 43.2389]; // Алматы

const CityMapPage: React.FC = () => {
  const { cityCode } = useParams<{ cityCode: string }>();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState<CityCoordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!cityCode) {
      setError("❌ Не указан код города в URL");
      setLoading(false);
      return;
    }

    if (!mapRef.current) {
      console.error("❌ mapRef.current не найден");
      setError("❌ Контейнер карты не найден");
      setLoading(false);
      return;
    }

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.maptiler.com/maps/streets/style.json?key=2vKYcG4WCb2MkWKKnxav",
      center: DEFAULT_COORDINATES,
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapInstance.current = map;

    fetchCityCoordinates(cityCode)
      .then((data) => {
        setCoordinates(data);
        const coords: [number, number] = [data.longitude, data.latitude];
        addMarker(coords);
        map.setCenter(coords);
      })
      .catch((err) => {
        if (err.message === "not_found") {
          console.info("Нет координат — пользователь может их задать");
        } else {
          console.error("Ошибка загрузки координат:", err);
          setError("❌ Не удалось загрузить координаты");
        }
      })
      .finally(() => setLoading(false));

    map.on("click", (e) => {
      const lngLat = e.lngLat;
      const coords: CityCoordinates = {
        cityCode,
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      };

      setCoordinates(coords);
      addMarker([lngLat.lng, lngLat.lat]);
    });

    return () => {
      map.remove();
    };
  }, [cityCode]);

  const addMarker = (lngLat: [number, number]) => {
    if (!mapInstance.current) return;

    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat);
    } else {
      markerRef.current = new maplibregl.Marker({ draggable: true })
        .setLngLat(lngLat)
        .addTo(mapInstance.current);

      markerRef.current.on("dragend", () => {
        const newPos = markerRef.current?.getLngLat();
        if (newPos) {
          setCoordinates((prev) =>
            prev ? { ...prev, latitude: newPos.lat, longitude: newPos.lng } : null
          );
        }
      });
    }
  };

  const handleSave = async () => {
    if (!coordinates || !cityCode) return;

    try {
      const saved = await saveCityCoordinates(cityCode, coordinates);
      alert("✅ Координаты сохранены");
      setCoordinates(saved);
      setError(null);
    } catch (err) {
      console.error("Ошибка сохранения координат:", err);
      setError("❌ Не удалось сохранить координаты");
    }
  };

  const handleDelete = async () => {
    if (!cityCode) return;
    try {
      await deleteCityCoordinates(cityCode);
      setCoordinates(null);
      markerRef.current?.remove();
      markerRef.current = null;
      alert("🗑️ Координаты удалены");
    } catch (err) {
      console.error("Ошибка удаления координат:", err);
      setError("❌ Не удалось удалить координаты");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-3">🗺️ Координаты города</h1>

      {/* Управление — размещено над картой */}
      <div className="flex flex-wrap gap-3 items-center mb-2">
        <button
          onClick={handleSave}
          disabled={!coordinates}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          💾 Сохранить
        </button>
        <button
          onClick={handleDelete}
          disabled={!coordinates}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          🗑️ Удалить
        </button>

      {/* Координаты */}
      {coordinates && (
        <div className="text-sm text-gray-700">
          <p>
            <strong>Широта:</strong> {coordinates.latitude}
          </p>
          <p>
            <strong>Долгота:</strong> {coordinates.longitude}
          </p>
        </div>
      )}


        <button
          onClick={() => navigate("/mod/cities")}
          className="ml-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
      </div>

      {/* Карта */}
      <div className="relative w-full h-[400px] rounded border overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-blue-600 font-semibold">
            Загрузка карты...
          </div>
        )}
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}


      {!coordinates && !loading && (
        <div className="text-sm text-blue-600">
          🔹 Координаты не заданы. Кликните по карте, чтобы выбрать точку.
        </div>
      )}
    </div>
  );
};

export default CityMapPage;
