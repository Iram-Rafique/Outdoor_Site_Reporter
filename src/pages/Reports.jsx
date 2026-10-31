
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { db } from '../db/database'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CameraCapture from '../components/CameraCapture'
import LocationCapture from '../components/LocationCapture'
import {
  FileText,
  MapPin,
  AlertTriangle,
  Leaf,
  Pencil,
  Trash2,
  X,
  Save,
} from 'lucide-react'

function Reports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  async function loadReports() {
    try {
      const savedReports = await db.reports
        .orderBy('createdAt')
        .reverse()
        .toArray()

      setReports(savedReports)
      setError('')
    } catch (err) {
      console.error('Could not load reports:', err)
      setError('Could not load your reports. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  function startEditing(report) {
    setEditingId(report.id)
    setActionError('')

    setEditForm({
      title: report.title || '',
      type: report.type || 'observation',
      category: report.category || '',
      description: report.description || '',
      photo: report.photo || '',
      location: report.location || null,
    })
  }

  function cancelEditing() {
    setEditingId(null)
    setEditForm(null)
    setActionError('')
  }

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

    setIsSaving(true)
    setActionError('')

    try {
      await db.reports.update(editingId, {
        title: editForm.title.trim(),
        type: editForm.type,
        category: editForm.category.trim(),
        description: editForm.description.trim(),
        photo: editForm.photo || '',
        location: editForm.location || null,
      })

      const updatedReport = await db.reports.get(editingId)

      setReports((current) =>
        current
          .map((report) =>
            report.id === editingId ? updatedReport : report
          )
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      )

      cancelEditing()
    } catch (err) {
      console.error('Could not update report:', err)
      setActionError('Could not save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteReport(report) {
    const confirmed = window.confirm(
      `Delete "${report.title || 'this report'}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setActionError('')

    try {
      await db.reports.delete(report.id)

      setReports((current) =>
        current.filter((item) => item.id !== report.id)
      )

      if (editingId === report.id) {
        cancelEditing()
      }
    } catch (err) {
      console.error('Could not delete report:', err)
      setActionError('Could not delete the report. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#10231D]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My Reports
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A6B66]">
              View and manage your recorded outdoor issues and observations.
            </p>
          </div>

          <Link
            to="/create"
            className="shrink-0 rounded-lg bg-[#11493E] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3B32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2 sm:px-4"
          >
            <span className="sm:hidden">+ New</span>
            <span className="hidden sm:inline">+ New report</span>
          </Link>
        </div>

        {actionError && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-white p-3 text-sm text-red-700"
          >
            {actionError}
          </p>
        )}

        {isLoading ? (
          <p className="py-12 text-center text-sm text-[#5A6B66]">
            Loading reports...
          </p>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-[#E1E8E5] bg-white p-5 text-sm text-red-700"
          >
            {error}
            <button
              type="button"
              onClick={() => {
                setIsLoading(true)
                loadReports()
              }}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-xl border border-[#E1E8E5] bg-white px-5 py-12 text-center">
            <FileText
              size={36}
              className="mx-auto mb-4 text-[#5A6B66]"
            />
            <h2 className="text-lg font-semibold">No reports yet</h2>
            <p className="mt-2 text-sm text-[#5A6B66]">
              Create your first report to see it here.
            </p>
            <Link
              to="/create"
              className="mt-5 inline-flex rounded-lg bg-[#11493E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0D3B32]"
            >
              Create your first report
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#5A6B66]">
              <span className="font-semibold text-[#10231D]">
                {reports.length}
              </span>{' '}
              {reports.length === 1 ? 'report' : 'reports'} saved
            </p>

            <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#E1E8E5] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {editingId !== report.id && (
                    report.photo ? (
                      <img
                        src={report.photo}
                        alt={report.title || 'Report photograph'}
                        className="h-40 w-full bg-[#E8EFEC] object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-[#E8EFEC]">
                        <FileText
                          size={32}
                          className="text-[#5A6B66]"
                        />
                      </div>
                    )
                  )}

                  <div className="p-4 sm:p-5">
                    {editingId === report.id && editForm ? (
                      <form onSubmit={saveChanges} className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <h2 className="text-lg font-semibold">
                            Edit report
                          </h2>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={isSaving}
                            aria-label="Cancel editing"
                            className="rounded-lg p-2 text-[#5A6B66] hover:bg-[#F0F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A]"
                          >
                            <X size={19} />
                          </button>
                        </div>

                        <div>
                          <label
                            htmlFor={`title-${report.id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Title
                          </label>
                          <input
                            id={`title-${report.id}`}
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            required
                            maxLength={120}
                            className="w-full rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`type-${report.id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Report type
                          </label>
                          <select
                            id={`type-${report.id}`}
                            name="type"
                            value={editForm.type}
                            onChange={handleEditChange}
                            className="w-full rounded-lg border border-[#D5DFDA] bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
                          >
                            <option value="observation">Observation</option>
                            <option value="issue">Issue</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor={`category-${report.id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Category
                          </label>
                          <input
                            id={`category-${report.id}`}
                            name="category"
                            value={editForm.category}
                            onChange={handleEditChange}
                            maxLength={80}
                            className="w-full rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`description-${report.id}`}
                            className="mb-1.5 block text-sm font-medium"
                          >
                            Description
                          </label>
                          <textarea
                            id={`description-${report.id}`}
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows={3}
                            maxLength={3000}
                            className="w-full resize-y rounded-lg border border-[#D5DFDA] px-3 py-2.5 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-[#1F8A6A]"
                          />
                        </div>

                        <div className="border-t border-[#E8EFEC] pt-4">
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

                        <div className="border-t border-[#E8EFEC] pt-4">
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

                        <div className="flex flex-col gap-2 pt-1">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#11493E] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0D3B32] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2"
                          >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : 'Save changes'}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="min-h-10 rounded-lg border border-[#D5DFDA] px-4 py-2.5 text-sm font-semibold text-[#344B43] hover:bg-[#F0F5F2] disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className="mb-2 flex items-center gap-2">
                          {report.type === 'observation' ? (
                            <Leaf
                              size={17}
                              className="shrink-0 text-[#11493E]"
                            />
                          ) : (
                            <AlertTriangle
                              size={17}
                              className="shrink-0 text-[#A15C12]"
                            />
                          )}
                          <span className="text-xs font-semibold capitalize text-[#477568]">
                            {report.type || 'Report'}
                          </span>
                        </div>

                        <h2 className="break-words text-base font-semibold leading-6">
                          {report.title || 'Untitled report'}
                        </h2>

                        <p className="mt-1 text-sm text-[#5A6B66]">
                          {report.category || 'Uncategorised'}
                        </p>

                        {report.description && (
                          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#344B43]">
                            {report.description}
                          </p>
                        )}

                        {report.location && (
                          <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#5A6B66]">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0"
                            />
                            <span className="break-all">
                              {Number(report.location.latitude).toFixed(6)},{' '}
                              {Number(report.location.longitude).toFixed(6)}
                            </span>
                          </div>
                        )}

                        <p className="mt-3 text-xs text-[#5A6B66]">
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleString()
                            : 'Date unavailable'}
                        </p>

                        <div className="mt-4 flex gap-2 border-t border-[#E8EFEC] pt-3">
                          <button
                            type="button"
                            onClick={() => startEditing(report)}
                            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold text-[#11493E] transition-colors hover:bg-[#F0F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A]"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteReport(report)}
                            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Reports
