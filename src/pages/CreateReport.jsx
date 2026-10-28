
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { db } from '../db/database'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CameraCapture from '../components/CameraCapture'
import LocationCapture from '../components/LocationCapture'
import { TriangleAlert, Leaf } from 'lucide-react'

const categories = {
  issue: [
    'Waste and fly-tipping',
    'Park furniture',
    'Paths and surfaces',
    'Buildings and facilities',
    'Trees and vegetation',
    'Other',
  ],
  observation: [
    'Wildlife',
    'Plants and flowers',
    'Trees and vegetation',
    'Environmental changes',
    'Other',
  ],
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2'

function CreateReport() {
  const navigate = useNavigate()
  const location = useLocation()

  // Initialise the report type from the Home page selection.
  const [reportType, setReportType] = useState(
    location.state?.type === 'observation' ? 'observation' : 'issue',
  )

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [photo, setPhoto] = useState(null)
  const [locationData, setLocationData] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const isIssue = reportType === 'issue'

  function handleTypeChange(type) {
    setReportType(type)
    setCategory('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (isSaving) return

    setIsSaving(true)

    try {
      await db.reports.add({
        type: reportType,
        category,
        title: title.trim(),
        description: description.trim(),
        photo,
        location: locationData,
        createdAt: new Date().toISOString(),
      })

      alert('Report saved successfully!')
      navigate('/reports')
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Could not save your report. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[15px] leading-6 text-[#10231D] antialiased">
      <Header />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7">
          <h2 className="max-w-md text-[1.625rem] font-semibold leading-8 tracking-tight">
            What have you found?
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A6B66]">
            Describe the issue or observation and add a photograph or
            location where useful.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Report type */}
          <section>
            <h3 className="mb-3 text-[15px] font-semibold tracking-tight">
              1. Choose a report type
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleTypeChange('issue')}
                aria-pressed={isIssue}
                className={`flex min-h-[76px] items-center gap-4 rounded-xl border p-4 text-left transition ${
                  isIssue
                    ? 'border-[#11493E] bg-[#E8F1ED] ring-1 ring-[#11493E]'
                    : 'border-[#E1E8E5] bg-white hover:border-[#9BAFA5]'
                } ${focusRing}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FEF1DC] text-[#B45309]">
                  <TriangleAlert size={21} strokeWidth={1.8} />
                </span>

                <span className="min-w-0">
                  <span className="block font-semibold">
                    Report an issue
                  </span>
                  <span className="mt-0.5 block text-sm leading-5 text-[#5A6B66]">
                    Damage, waste or maintenance problems.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('observation')}
                aria-pressed={!isIssue}
                className={`flex min-h-[76px] items-center gap-4 rounded-xl border p-4 text-left transition ${
                  !isIssue
                    ? 'border-[#11493E] bg-[#E8F1ED] ring-1 ring-[#11493E]'
                    : 'border-[#E1E8E5] bg-white hover:border-[#9BAFA5]'
                } ${focusRing}`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E3F4EA] text-[#177245]">
                  <Leaf size={21} strokeWidth={1.8} />
                </span>

                <span className="min-w-0">
                  <span className="block font-semibold">
                    Record an observation
                  </span>
                  <span className="mt-0.5 block text-sm leading-5 text-[#5A6B66]">
                    Wildlife, plants or environmental changes.
                  </span>
                </span>
              </button>
            </div>
          </section>

          {/* Category */}
          <section>
            <label
              htmlFor="report-category"
              className="mb-2 block text-[15px] font-semibold"
            >
              2. Category
            </label>

            <select
              id="report-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              className={`min-h-12 w-full rounded-xl border border-[#D5DFDA] bg-white px-4 py-3 text-sm text-[#10231D] outline-none focus:border-[#1F8A6A] ${focusRing}`}
            >
              <option value="">Select a category</option>

              {categories[reportType].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </section>

          {/* Title */}
          <section>
            <label
              htmlFor="report-title"
              className="mb-2 block text-[15px] font-semibold"
            >
              3. Title
            </label>

            <input
              id="report-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={
                isIssue
                  ? 'e.g. Damaged park bench'
                  : 'e.g. Red squirrel spotted'
              }
              maxLength={100}
              required
              className={`min-h-12 w-full rounded-xl border border-[#D5DFDA] bg-white px-4 py-3 text-sm outline-none placeholder:text-[#8A9992] focus:border-[#1F8A6A] ${focusRing}`}
            />
          </section>

          {/* Description */}
          <section>
            <label
              htmlFor="report-description"
              className="mb-2 block text-[15px] font-semibold"
            >
              4. Description
            </label>

            <textarea
              id="report-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what you found and provide useful details..."
              rows={4}
              maxLength={1000}
              required
              className={`w-full resize-y rounded-xl border border-[#D5DFDA] bg-white px-4 py-3 text-sm leading-6 outline-none placeholder:text-[#8A9992] focus:border-[#1F8A6A] ${focusRing}`}
            />

            <p className="mt-1 text-right text-xs text-[#5A6B66]">
              {description.length}/1000 characters
            </p>
          </section>

          {/* Photograph API */}
          <CameraCapture
            value={photo}
            onChange={setPhoto}
          />

          {/* Geolocation API */}
          <LocationCapture
            value={locationData}
            onChange={setLocationData}
          />

          {/* Form actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#D5DFDA] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`min-h-12 rounded-xl border border-[#D5DFDA] bg-white px-5 py-3 font-semibold transition hover:bg-[#F8FAF9] ${focusRing}`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`min-h-12 rounded-xl bg-[#11493E] px-5 py-3 font-semibold text-white transition hover:bg-[#0C3A31] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {isSaving ? 'Saving report...' : 'Save report'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default CreateReport
