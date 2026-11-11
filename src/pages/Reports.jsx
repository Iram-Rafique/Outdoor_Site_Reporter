
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { db } from '../db/database'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  FileText,
  MapPin,
  AlertTriangle,
  Leaf,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

function Reports() {
  const location = useLocation()

  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || ''
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [reportToDelete, setReportToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function loadReports() {
    setIsLoading(true)

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

  async function deleteReport() {
    if (!reportToDelete || isDeleting) return

    setSuccessMessage('')
    setErrorMessage('')
    setIsDeleting(true)

    try {
      await db.reports.delete(reportToDelete.id)

      setReports((current) =>
        current.filter((item) => item.id !== reportToDelete.id)
      )

      setSuccessMessage('Report deleted successfully!')
      setReportToDelete(null)
    } catch (err) {
      console.error('Could not delete report:', err)
      setErrorMessage('Could not delete the report. Please try again.')
      setReportToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F6] text-[#10231D]">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Page heading */}
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

        {/* Success message */}
        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
          >
            <p className="font-semibold">
              ✓ {successMessage}
            </p>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <p className="font-semibold">
              ✕ {errorMessage}
            </p>
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <p className="py-12 text-center text-sm text-[#5A6B66]">
            Loading reports...
          </p>
        ) : error ? (
          /* Loading error */
          <div
            role="alert"
            className="rounded-xl border border-[#E1E8E5] bg-white p-5 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={loadReports}
              className="ml-2 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : reports.length === 0 ? (
          /* Empty state */
          <div className="rounded-xl border border-[#E1E8E5] bg-white px-5 py-12 text-center">
            <FileText
              size={36}
              className="mx-auto mb-4 text-[#5A6B66]"
            />

            <h2 className="text-lg font-semibold">
              No reports yet
            </h2>

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
          /* Reports list */
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
                  {/* Report photograph */}
                  {report.photo ? (
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
                  )}

                  <div className="p-4 sm:p-5">

                    {/* Report type */}
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

                    {/* Report title */}
                    <h2 className="break-words text-base font-semibold leading-6">
                      {report.title || 'Untitled report'}
                    </h2>

                    {/* Category */}
                    <p className="mt-1 text-sm text-[#5A6B66]">
                      {report.category || 'Uncategorised'}
                    </p>

                    {/* Description */}
                    {report.description && (
                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#344B43]">
                        {report.description}
                      </p>
                    )}

                    {/* Location */}
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

                    {/* Date created */}
                    <p className="mt-3 text-xs text-[#5A6B66]">
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleString()
                        : 'Date unavailable'}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2 border-t border-[#E8EFEC] pt-3">
                      <Link
                        to={`/reports/${report.id}/edit`}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold text-[#11493E] transition-colors hover:bg-[#F0F5F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A]"
                      >
                        <Pencil size={15} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setSuccessMessage('')
                          setErrorMessage('')
                          setReportToDelete(report)
                        }}
                        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Custom delete confirmation modal */}
      {reportToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <Trash2 className="text-red-600" size={22} />

              <h2
                id="delete-dialog-title"
                className="text-lg font-semibold"
              >
                Delete report?
              </h2>
            </div>

            <p className="mb-6 text-sm leading-6 text-[#5A6B66]">
              Are you sure you want to delete "{reportToDelete.title || 'this report'}"?
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setReportToDelete(null)}
                className="rounded-lg border border-[#D5DFDA] px-4 py-2.5 text-sm font-semibold text-[#344B43] hover:bg-[#F0F5F2] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={deleteReport}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Reports
