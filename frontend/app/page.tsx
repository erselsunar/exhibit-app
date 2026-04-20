import Link from "next/link";

const sections = [
  {
    href: "/clients",
    title: "Müşteriler",
    description: "Müşteri ve firma kayıtlarını yönet",
    icon: "👥",
    color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
    textColor: "text-teal-700",
  },
  {
    href: "/venues",
    title: "Mekanlar",
    description: "Fuar mekanlarını ekle, düzenle ve yönet",
    icon: "🏛️",
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    textColor: "text-blue-700",
  },
  {
    href: "/expo-management",
    title: "Organizatörler",
    description: "Fuar organizasyon firmalarını yönet",
    icon: "🏢",
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    textColor: "text-purple-700",
  },
  {
    href: "/expos",
    title: "Fuarlar",
    description: "Fuar etkinliklerini oluştur ve takip et",
    icon: "🎪",
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    textColor: "text-green-700",
  },
  {
    href: "/booths",
    title: "Standlar",
    description: "Fuar standlarını düzenle ve ata",
    icon: "🗂️",
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    textColor: "text-orange-700",
  },
  {
    href: "/bulk-upload",
    title: "Excel ile Yükle",
    description: "Toplu veri yüklemesi için Excel dosyası yükle",
    icon: "📥",
    color: "bg-rose-50 border-rose-200 hover:bg-rose-100",
    textColor: "text-rose-700",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">ExhibitApp</h1>
        <p className="text-gray-500 text-lg">Fuar Yönetim Sistemi</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-colors ${s.color}`}
          >
            <span className="text-4xl">{s.icon}</span>
            <div>
              <h2 className={`text-xl font-semibold ${s.textColor}`}>
                {s.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
