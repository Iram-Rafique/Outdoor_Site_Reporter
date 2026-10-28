
import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2'

function CameraCapture({ value, onChange }) {
  const webcamRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState('')

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) {
      setCameraError('Unable to capture a photo. Please try again.')
      return
    }

    onChange(imageSrc)
    setCameraError('')
    setShowCamera(false)
  }, [onChange])

  function openCamera() {
    setCameraError('')
    setShowCamera(true)
  }

  function retakePhoto() {
    onChange(null)
    setCameraError('')
    setShowCamera(true)
  }

  function removePhoto() {
    onChange(null)
    setCameraError('')
    setShowCamera(false)
  }

  return (
    <section>
      <h3 className="mb-2 text-[15px] font-semibold">
        5. Photograph
      </h3>

      <div className="rounded-xl border border-[#E1E8E5] bg-white p-4">
        {value ? (
          <div>
            <img
              src={value}
              alt="Photograph attached to report"
              className="w-full rounded-lg object-cover"
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={retakePhoto}
                className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
              >
                Retake photo
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
              >
                Remove photo
              </button>
            </div>
          </div>
        ) : showCamera ? (
          <div>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'environment',
              }}
             onUserMediaError={(error) => {
  console.error('Camera error:', error)

  setCameraError(
    error?.name === 'NotAllowedError'
      ? 'Camera permission was denied. Allow camera access in your browser settings.'
      : error?.name === 'NotFoundError'
        ? 'No camera was found on this device.'
        : error?.name === 'NotReadableError'
          ? 'The camera may be in use by another application. Close other camera apps and try again.'
          : `Camera could not start: ${error?.name || 'Unknown error'}. Check the browser console for details.`,
  )

  setShowCamera(false)
}}
            />

            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className={`rounded-lg bg-[#11493E] px-4 py-2 font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
              >
                Capture photo
              </button>

              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-[#5A6B66]">
              Take a new photograph of the issue or observation.
            </p>

            <button
              type="button"
              onClick={openCamera}
              className={`rounded-lg bg-[#11493E] px-4 py-2 font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
            >
              <span className="inline-flex items-center gap-2">
                Open camera
              </span>
            </button>
          </div>
        )}

        {cameraError && (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {cameraError}
          </p>
        )}
      </div>
    </section>
  )
}

export default CameraCapture
