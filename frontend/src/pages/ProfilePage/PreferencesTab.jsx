import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getPreferences, updatePreferences } from "../../api/preferenceApi";

export default function PreferencesTab() {
    const { user } = useContext(AuthContext);
    const [prefs, setPrefs] = useState([]); // [{categoryId:{_id,name}, optedIn:true}]
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState("");

    useEffect(() => {
        if (!user?._id) return;
        (async () => {
            try {
                const { data } = await getPreferences(user._id);
                setPrefs(data || []);
            } finally {
                setLoading(false);
            }
        })();
    }, [user?._id]);

    // optional: example of fetching by type if your backend expects a type string:
    // const { data: clubCats } = await fetchCategoriesByType("club_event");

    const rows = useMemo(() => {
        return (prefs || []).map((p) => ({
            prefId: p._id,
            categoryId: typeof p.categoryId === "object" ? p.categoryId._id : p.categoryId,
            categoryName:
                typeof p.categoryId === "object" ? p.categoryId.name : p.categoryName || "Category",
            optedIn: p.optedIn,
        }));
    }, [prefs]);

    async function toggle(catId, current) {
        if (!user?._id) return;
        setSaving(catId);
        try {
            const { data } = await updatePreferences(user._id, {
                categoryId: catId,
                optedIn: !current,
            });
            // merge back
            setPrefs((old) => {
                const idx = old.findIndex(
                    (x) => (typeof x.categoryId === "object" ? x.categoryId._id : x.categoryId) === catId
                );
                if (idx >= 0) {
                    const clone = [...old];
                    clone[idx] = data;
                    return clone;
                }
                return [...old, data];
            });
        } finally {
            setSaving("");
        }
    }

    if (loading) return <p className="text-gray-600">Loading preferences…</p>;

    if (!rows.length)
        return <p className="text-gray-600">No preferences yet. They’ll appear once you opt in.</p>;

    return (
        <div>
            <h2 className="text-lg font-semibold mb-3">Notification Preferences</h2>
            <div className="space-y-3">
                {rows.map((r) => {
                    const categoryData = prefs.find(p => (typeof p.categoryId === 'object' ? p.categoryId._id : p.categoryId) === r.categoryId)?.categoryId;
                    const description = typeof categoryData === 'object' ? categoryData?.description : '';
                    return (
                        <div key={r.categoryId} className="flex items-center justify-between border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 mb-1">{r.categoryName.toUpperCase().replace(/_/g, ' ')}</p>
                                {description && <p className="text-sm text-gray-500 italic">{description}</p>}
                            </div>
                            <button
                                onClick={() => toggle(r.categoryId, r.optedIn)}
                                disabled={saving === r.categoryId}
                                className={`ml-4 px-4 py-2 rounded-lg text-white font-medium transition-colors whitespace-nowrap ${
                                    r.optedIn ? "bg-green-600 hover:bg-green-700" : "bg-gray-500 hover:bg-gray-600"
                                } ${saving === r.categoryId ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {saving === r.categoryId ? "Saving…" : r.optedIn ? "Enabled" : "Disabled"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
