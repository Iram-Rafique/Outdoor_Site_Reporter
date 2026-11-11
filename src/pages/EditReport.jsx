
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { db } from '../db/database'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CameraCapture from '../components/CameraCapture'
import LocationCapture from '../components/LocationCapture'
import { ArrowLeft, Save } from 'lucide-react'

function EditReport() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [editForm, setEditForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadReport() {
      try {
        const report = await db.reports.get(Number(id))

        if (!report) {
          if (!cancelled) {
            setError('Report not found.')
          }
          return
        }

        if (!cancelled) {
          setEditForm({
            title: report.title || '',
            type: report.type || 'observation',
            category: report.category || '',
            description: report.description || '',
            photo: report.photo || '',
            location: report.location || null,
          })
        }
      } catch (err) {
        console.error('Could not load report:', err)

        if (!cancelled) {
          setError('Could not load this report. Please try again.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadReport()

    return () => {
      cancelled = true
    }
  }, [id])

  function handleEditChange(event) {
    const { name, value } = event.target

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function saveChanges(event) {
    event.preventDefault()

    if (!editForm?.title.trim()) {
      setActionError('Please enter a report title.')
      return
    }

    setActionError('')
    setSuccessMessage('')
    setIsSaving(true)

    try {
      const updated = await db.reports.update(Number(id), {
        title: editForm.title.trim(),
        type: editForm.type,
        category: editForm.category.trim(),
        description: editForm.description.trim(),
        photo: editForm.photo || '',
        location: editForm.location || null,
      })

      if (!updated) {
        setActionError('This report could not be found.')
        return
      }

      setSuccessMessage('Report updated successfully!')

      navigate('/reports', {
        state: { successMessage: 'Report updated successfully!' },
      })
    } catch (err) {
      console.error('Could not update report:', err)
      setActionError('Could not save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F6] text-[#10231D]">
      <Header />

      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        <Link
          to="/reports"
          className="mb-6 inline-flex items-center gap-2 text-base font-semibold text-[#11493E] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to My Reports
        </Link>

        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Edit Report
          </h1>

          <p className="mt-2 text-base leading-6 text-[#5A6B66]">
            Update the details, photograph and location of your report.
          </p>
        </div>

        {successMessage && (
          <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {actionError && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-700">
            {actionError}
          </div>
        )}

        {isLoading ? (
          <p className="py-12 text-center text-base text-[#5A6B66]">
            Loading report...
          </p>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-base text-red-700">
            <p>{error}</p>

            <Link to="/reports" className="mt-3 inline-block font-semibold underline">
              Return to My Reports
            </Link>
          </div>
        ) : editForm ? (
          <form
            onSubmit={saveChanges}
    className="min-w-0 space-y-5 rounded-xl border border-[#E1E8E5] bg-white p-4 shadow-sm sm:p-7"
          >
            <div>
              <label htmlFor="title" className="mb-1.5 block text-base font-medium">
                Report title
              </label>

              <input
                id="title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
                maxLength={120}
                className="w-full rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
              />
            </div>

            <div>
              <label htmlFor="type" className="mb-1.5 block text-base font-medium">
                Report type
              </label>

              <select
                id="type"
                name="type"
                value={editForm.type}
                onChange={handleEditChange}
                className="w-full rounded-lg border border-[#D5DFDA] bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
              >
                <option value="observation">Observation</option>
                <option value="issue">Issue</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="mb-1.5 block text-base font-medium">
                Category
              </label>

              <input
                id="category"
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                maxLength={80}
                className="w-full rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-base font-medium">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows={4}
                maxLength={3000}
                className="w-full resize-y rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-base leading-6 focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
              />
            </div>

            <div className="border-t border-[#E8EFEC] pt-5">
              <CameraCapture
                value={editForm.photo}
                onChange={(photo) =>
                  setEditForm((current) => ({
                    ...current,
                    photo,
                  }))
                }
              />
            </div>

            <div className="border-t border-[#E8EFEC] pt-5">
              <LocationCapture
                value={editForm.location}
                onChange={(location) =>
                  setEditForm((current) => ({
                    ...current,
                    location,
                  }))
                }
              />
            </div>

          <div className="flex flex-col gap-3 border-t border-[#E8EFEC] pt-5 sm:flex-row sm:justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#11493E] px-4 py-2.5 text-base font-semibold text-white transition-colors hover:bg-[#0D3B32] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A]"
              >
                <Save size={17} />
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>

              <Link
                to="/reports"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#D5DFDA] px-4 py-2.5 text-base font-semibold text-[#344B43] hover:bg-[#F0F5F2]"
              >
                Cancel
              </Link>
            </div>
          </form>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

export default EditReport
