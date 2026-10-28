import { useNavigate } from 'react-router'
import {
  ClipboardList,
  TriangleAlert,
  Leaf,
  ChevronRight,
  FileText,
  Camera,
  MapPin,
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const reportTypes = [
  {
    type: 'issue',
    title: 'Report an issue',
    text: 'Fly-tipping, damaged facilities or maintenance problems.',
    icon: TriangleAlert,
    iconStyle: 'bg-[#FEF1DC] text-[#B45309]',
  },
  {
    type: 'observation',
    title: 'Record an observation',
    text: 'Wildlife sightings, plant growth or environmental changes.',
    icon: Leaf,
    iconStyle: 'bg-[#E3F4EA] text-[#177245]',
  },
]

const reportSteps = [
  { title: 'Describe', text: 'Explain the issue or observation.', icon: FileText },
  { title: 'Add a photograph', text: 'Include an image where useful.', icon: Camera },
  { title: 'Record the location', text: 'Identify where it occurred.', icon: MapPin },
]

// Decorative contour lines, a nod to field maps
function Contours() {
  const rings = [60, 110, 160, 210, 260, 310, 360]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1.5">
        {rings.map((r) => (
          <ellipse
            key={`a${r}`}
            cx="980"
            cy="120"
            rx={r * 1.5}
            ry={r * 0.8}
            transform="rotate(-18 980 120)"
          />
        ))}
        {rings.slice(0, 4).map((r) => (
          <ellipse
            key={`b${r}`}
            cx="120"
            cy="360"
            rx={r * 1.3}
            ry={r * 0.7}
            transform="rotate(12 120 360)"
          />
        ))}
      </g>
    </svg>
  )
}

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F6]'

const card =
  'rounded-xl border border-[#E1E8E5] bg-white transition active:scale-[0.99] active:bg-[#F8FAF9] sm:hover:border-[#11493E] [-webkit-tap-highlight-color:transparent]'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F6] text-[15px] leading-6 text-[#10231D] antialiased">
      {/* Hero band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0C3A31] to-[#12544A]">
        <Contours />

        <Header />

        <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-12">
          <h1 className="max-w-md text-[1.625rem] font-semibold leading-8 tracking-tight text-white sm:text-3xl sm:leading-9">
            What would you like to report?
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#BFD8CF] sm:text-base sm:leading-7">
            Choose a report type to get started. You can add photographs and
            your location to any report.
          </p>
        </div>
      </div>

      <main className="relative mx-auto -mt-10 w-full max-w-4xl flex-1 px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:-mt-12 sm:px-6">
        {/* Report types */}
        <section
          aria-label="Choose a report type"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {reportTypes.map(({ type, title, text, icon: Icon, iconStyle }) => (
            <button
              key={type}
              type="button"
              onClick={() => navigate('/create', { state: { type } })}
              className={`group flex min-h-[72px] min-w-0 items-center gap-4 p-4 text-left shadow-[0_1px_2px_rgba(16,35,29,0.04),0_6px_20px_rgba(16,35,29,0.07)] sm:flex-col sm:items-start sm:gap-0 sm:p-5 ${card} ${focusRing}`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconStyle}`}
              >
                <Icon size={21} strokeWidth={1.8} />
              </span>

              <span className="min-w-0 flex-1 sm:mt-4 sm:flex-none">
                <span className="block text-base font-semibold tracking-tight">
                  {title}
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-[#5A6B66]">
                  {text}
                </span>
              </span>

              <ChevronRight size={18} className="shrink-0 text-[#8FA09A] sm:hidden" />

              <span className="mt-4 hidden items-center gap-1 text-sm font-semibold text-[#11493E] sm:inline-flex">
                Start a report
                <ChevronRight
                  size={16}
                  className="transition group-hover:translate-x-0.5"
                />
              </span>
            </button>
          ))}
        </section>

        {/* Saved reports */}
        <button
          type="button"
          onClick={() => navigate('/reports')}
          className={`group mt-3 flex min-h-[64px] w-full min-w-0 items-center gap-4 p-4 text-left sm:mt-4 ${card} ${focusRing}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8EFEC] text-[#11493E]">
            <ClipboardList size={20} strokeWidth={1.8} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold">My reports</span>
            <span className="block text-sm leading-5 text-[#5A6B66]">
              View, edit or delete reports saved on this device.
            </span>
          </span>
          <ChevronRight
            size={18}
            className="shrink-0 text-[#8FA09A] transition group-hover:translate-x-0.5"
          />
        </button>

        {/* Process */}
        <section className="mt-10">
          <h2 className="text-[15px] font-semibold tracking-tight">
            What a report includes
          </h2>

          <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {reportSteps.map(({ title, text, icon: Icon }, i) => (
              <li
                key={title}
                className="flex items-start gap-3 border-t border-[#D5DFDA] pt-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#11493E] text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {title}
                    <Icon size={14} className="text-[#8FA09A]" />
                  </p>
                  <p className="mt-0.5 text-sm leading-5 text-[#5A6B66]">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
