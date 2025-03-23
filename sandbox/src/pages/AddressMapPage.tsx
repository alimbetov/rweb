import React, { useLayoutEffect, useRef, useState } from "react";
import maplibregl, { Map, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchAddressCoordinates,
  updateAddressCoordinates,
  clearAddressCoordinates,
} from "../apidata/profileApi";
import { AddressCoordinatesDTO } from "../types/types";

const AddressMapPage: React.FC = () => {
  const { addressId } = useParams<{ addressId: string }>();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const popupRef = useRef<Popup | null>(null);

  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState<AddressCoordinatesDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addMarker = (lngLat: [number, number], editable: boolean, color: string = "#aaaaaa") => {
    if (!mapInstance.current) return;

    // 💥 Удаляем предыдущий маркер
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    const marker = new maplibregl.Marker({
      draggable: editable,
      color: color,
    })
      .setLngLat(lngLat)
      .addTo(mapInstance.current);

    const popup = new maplibregl.Popup({ offset: 25 }).setText(
      editable
        ? "🔄 Перетащите маркер для изменения координат"
        : "ℹ️ Координаты адреса (только просмотр)"
    );
    marker.setPopup(popup).togglePopup();

    if (editable) {
      marker.on("dragend", () => {
        const pos = marker.getLngLat();
        setCoordinates((prev) =>
          prev ? { ...prev, latitude: pos.lat, longitude: pos.lng } : null
        );
        console.log("📍 Новая позиция:", pos);
      });
    }

    markerRef.current = marker;
    popupRef.current = popup;
  };

  const fetchAndRenderAddressCoordinates = async () => {
    try {
      const data = await fetchAddressCoordinates(parseInt(addressId!));
      setCoordinates(data);

      const cityCoords: [number, number] = [data.citLongitude, data.citLatitude];
      mapInstance.current?.setCenter(cityCoords);

      if (data.latitude != null && data.longitude != null) {
        addMarker([data.longitude, data.latitude], data.edition ?? false, "#007bff");
      } else if (data.edition) {
        console.log("🆕 Координаты не заданы — отрисовываем маркер в центре города");
        addMarker(cityCoords, true, "#aaaaaa");
      }
    } catch (err) {
      console.error("🚨 Ошибка при загрузке координат:", err);
      setError("❌ Не удалось загрузить координаты");
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (!addressId || !mapRef.current) {
      setError("❌ Некорректный адрес страницы или отсутствует контейнер карты");
      setLoading(false);
      return;
    }

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://api.maptiler.com/maps/streets/style.json?key=2vKYcG4WCb2MkWKKnxav",
      center: [76.8858, 43.2389],
      zoom: 11,
      minZoom: 5,
      maxZoom: 18,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    mapInstance.current = map;

    fetchAndRenderAddressCoordinates();

    map.on("click", (e) => {
      if (!coordinates?.edition) return;

      const { lng, lat } = e.lngLat;
      console.log("🖱 Клик по карте:", lng, lat);

      addMarker([lng, lat], true, "#007bff");

      setCoordinates((prev) =>
        prev ? { ...prev, latitude: lat, longitude: lng } : null
      );
    });

    return () => {
      map.remove();
    };
  }, [addressId]);

  const handleSave = async () => {
    if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) return;
  
    try {
      await updateAddressCoordinates(
        parseInt(addressId!),
        coordinates.latitude,
        coordinates.longitude
      );
      alert("✅ Координаты обновлены");
  
      // 🎨 Меняем цвет маркера на синий без перезагрузки
      if (markerRef.current) {
        markerRef.current.setColor("#007bff");
      }
    } catch (err) {
      console.error("🚨 Ошибка при сохранении координат:", err);
      setError("❌ Не удалось обновить координаты");
    }
  };
  

  const handleDelete = async () => {
    if (!addressId) return;

    try {
      await clearAddressCoordinates(parseInt(addressId));
      markerRef.current?.remove();
      markerRef.current = null;
      await fetchAndRenderAddressCoordinates();
      alert("🗑️ Координаты удалены");
    } catch (err) {
      console.error("🚨 Ошибка при удалении координат:", err);
      setError("❌ Не удалось удалить координаты");
    }
  };

  const handleResetToCity = () => {
    if (!mapInstance.current || !coordinates) return;

    const cityCenter: [number, number] = [coordinates.citLongitude, coordinates.citLatitude];
    mapInstance.current.setCenter(cityCenter);
    mapInstance.current.setZoom(13);
    console.log("🎯 Центр сброшен на координаты города:", cityCenter);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-3">📍 Координаты адреса</h1>

      {coordinates?.title && (
        <p className="text-gray-700 text-sm">
          <strong>Адрес:</strong> {coordinates.title}
        </p>
      )}

      <div className="flex flex-wrap gap-3 items-center mb-2">
        {coordinates?.edition && (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              💾 Сохранить
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              🗑️ Удалить
            </button>
          </>
        )}

      {coordinates && (
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Город (центр):</strong> lat: {coordinates.citLatitude}, lon:{" "}
                {coordinates.citLongitude}
              </p>
              <p>
                <strong>Точка адреса:</strong>{" "}
                {coordinates.latitude != null && coordinates.longitude != null
                  ? `lat: ${coordinates.latitude}, lon: ${coordinates.longitude}`
                  : "не задана"}
              </p>
            </div>
          )}

        <button
          onClick={handleResetToCity}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          🎯 Центр на город
        </button>

        <button
          onClick={() => navigate("/guser/addresses")}
          className="ml-auto bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Назад
        </button>
      </div>

      <div className="relative w-full h-[400px] rounded border overflow-hidden">
        <div ref={mapRef} className="w-full h-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 text-blue-600 font-semibold">
            Загрузка карты...
          </div>
        )}
      </div>



      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      {!coordinates?.latitude && !loading && (
        <div className="text-sm text-blue-600">
          🔹 Координаты адреса не заданы.{" "}
          {coordinates?.edition
            ? "Кликните по карте или перетащите маркер, чтобы выбрать точку."
            : "Редактирование недоступно."}
        </div>
      )}
    </div>
  );
};

export default AddressMapPage;
