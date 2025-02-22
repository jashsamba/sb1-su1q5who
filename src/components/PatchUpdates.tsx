import React from 'react';
import { Download, ArrowUpCircle, Clock } from 'lucide-react';

const patchUpdates = [
  {
    game: "Cyberpunk 2077",
    version: "2.1",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=800",
    releaseDate: "March 15, 2025",
    highlights: [
      "New dynamic weather system",
      "Enhanced vehicle combat mechanics",
      "Additional side missions in Night City",
      "Performance optimizations"
    ],
    size: "32.4 GB"
  },
  {
    game: "Elden Ring",
    version: "1.09.1",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800",
    releaseDate: "March 12, 2025",
    highlights: [
      "New PvP arena locations",
      "Balance adjustments for magic builds",
      "Additional weapon arts",
      "Bug fixes and stability improvements"
    ],
    size: "18.7 GB"
  }
];

export function PatchUpdates() {
  return (
    <section className="mb-16">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-100">Latest Patch Updates</h2>
        <span className="text-violet-400 text-sm">Stay up to date with your favorite games</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {patchUpdates.map((patch, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-xl overflow-hidden border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300"
          >
            <div className="relative h-48">
              <img
                src={patch.image}
                alt={patch.game}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{patch.game}</h3>
                  <div className="flex items-center gap-2 text-violet-400">
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>Version {patch.version}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{patch.releaseDate}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-100 mb-3">Update Highlights</h4>
                <ul className="space-y-2">
                  {patch.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-gray-400">
                  <Download className="w-4 h-4" />
                  <span>Size: {patch.size}</span>
                </div>
                <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all duration-200">
                  View Full Notes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}