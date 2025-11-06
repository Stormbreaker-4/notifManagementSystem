export function categoryDisplay(name) {
    if (!name) return "";
    return String(name).toUpperCase().replace(/_/g, " ");
}

export function categoryColors(name) {
    const key = String(name || '').toLowerCase();
    switch (key) {
        case 'club_event': return { bg: 'bg-pink-100', text: 'text-pink-700', ring: 'ring-pink-200' };
        case 'workshop': return { bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-200' };
        case 'recruitment': return { bg: 'bg-cyan-100', text: 'text-cyan-800', ring: 'ring-cyan-200' };
        case 'fest': return { bg: 'bg-purple-100', text: 'text-purple-800', ring: 'ring-purple-200' };
        default: return { bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-200' };
    }
}

export default function CategoryBadge({ name, className = "" }) {
    const c = categoryColors(name);
    return (
        <div className={`inline-block ${c.bg} ${c.text} ${c.ring} ring-1 px-3 py-1 rounded-full font-semibold ${className}`}>
            {categoryDisplay(name)}
        </div>
    );
}


