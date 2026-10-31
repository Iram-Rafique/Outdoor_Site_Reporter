
// import { useCallback, useRef, useState } from 'react'
// import Webcam from 'react-webcam'

// const focusRing =
//   'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2'

// function CameraCapture({ value, onChange }) {
//   const webcamRef = useRef(null)
//   const [showCamera, setShowCamera] = useState(false)
//   const [cameraError, setCameraError] = useState('')

//   const capturePhoto = useCallback(() => {
//     const imageSrc = webcamRef.current?.getScreenshot()

//     if (!imageSrc) {
//       setCameraError('Unable to capture a photo. Please try again.')
//       return
//     }

//     onChange(imageSrc)
//     setCameraError('')
//     setShowCamera(false)
//   }, [onChange])

//   function openCamera() {
//     setCameraError('')
//     setShowCamera(true)
//   }

//   function retakePhoto() {
//     onChange(null)
//     setCameraError('')
//     setShowCamera(true)
//   }

//   function removePhoto() {
//     onChange(null)
//     setCameraError('')
//     setShowCamera(false)
//   }

//   return (
//     <section>
//       <h3 className="mb-2 text-[15px] font-semibold">
//         5. Photograph
//       </h3>

//       <div className="rounded-xl border border-[#E1E8E5] bg-white p-4">
//         {value ? (
//           <div>
//             <img
//               src={value}
//               alt="Photograph attached to report"
//               className="w-full rounded-lg object-cover"
//             />

//             <div className="mt-3 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={retakePhoto}
//                 className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
//               >
//                 Retake photo
//               </button>

//               <button
//                 type="button"
//                 onClick={removePhoto}
//                 className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
//               >
//                 Remove photo
//               </button>
//             </div>
//           </div>
//         ) : showCamera ? (
//           <div>
//             <Webcam
//               ref={webcamRef}
//               audio={false}
//               screenshotFormat="image/jpeg"
//               videoConstraints={{
//                 facingMode: 'environment',
//               }}
//              onUserMediaError={(error) => {
//   console.error('Camera error:', error)

//   setCameraError(
//     error?.name === 'NotAllowedError'
//       ? 'Camera permission was denied. Allow camera access in your browser settings.'
//       : error?.name === 'NotFoundError'
//         ? 'No camera was found on this device.'
//         : error?.name === 'NotReadableError'
//           ? 'The camera may be in use by another application. Close other camera apps and try again.'
//           : `Camera could not start: ${error?.name || 'Unknown error'}. Check the browser console for details.`,
//   )

//   setShowCamera(false)
// }}
//             />

//             <div className="mt-3 flex flex-wrap gap-3">
//               <button
//                 type="button"
//                 onClick={capturePhoto}
//                 className={`rounded-lg bg-[#11493E] px-4 py-2 font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
//               >
//                 Capture photo
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setShowCamera(false)}
//                 className={`rounded-lg border border-[#D5DFDA] px-4 py-2 font-semibold ${focusRing}`}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <p className="mb-3 text-sm text-[#5A6B66]">
//               Take a new photograph of the issue or observation.
//             </p>

//             <button
//               type="button"
//               onClick={openCamera}
//               className={`rounded-lg bg-[#11493E] px-4 py-2 font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
//             >
//               <span className="inline-flex items-center gap-2">
//                 Open camera
//               </span>
//             </button>
//           </div>
//         )}

//         {cameraError && (
//           <p role="alert" className="mt-3 text-sm text-red-700">
//             {cameraError}
//           </p>
//         )}
//       </div>
//     </section>
//   )
// }

// export default CameraCapture

import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, Upload, Trash2 } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2'

function CameraCapture({ value, onChange }) {
  const webcamRef = useRef(null)
  const fileInputRef = useRef(null)

  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [uploadError, setUploadError] = useState('')

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) {
      setCameraError('Unable to capture a photo. Please try again.')
      return
    }

    onChange(imageSrc)
    setCameraError('')
    setUploadError('')
    setShowCamera(false)
  }, [onChange])

  function openCamera() {
    setCameraError('')
    setUploadError('')
    setShowCamera(true)
  }

  function retakePhoto() {
    onChange(null)
    setCameraError('')
    setUploadError('')
    setShowCamera(true)
  }

  function removePhoto() {
    onChange(null)
    setCameraError('')
    setUploadError('')
    setShowCamera(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0]

    if (!file) return

    setUploadError('')
    setCameraError('')

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Please select an image smaller than 5 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result)
        setShowCamera(false)
        setUploadError('')
      } else {
        setUploadError('Could not load the selected image.')
      }
    }

    reader.onerror = () => {
      setUploadError('Could not read the selected image. Please try again.')
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <section>
      <h3 className="mb-2 text-[15px] font-semibold">
        5. Photograph
      </h3>

      <div className="rounded-xl border border-[#E1E8E5] bg-white p-3 sm:p-4">
        {value && !showCamera && (
          <div>
            <img
              src={value}
              alt="Photograph attached to report"
              className="max-h-64 w-full rounded-lg bg-[#F4F7F6] object-contain"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={retakePhoto}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold text-[#11493E] hover:bg-[#F0F5F2] ${focusRing}`}
              >
                <Camera size={16} />
                Take new photo
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold text-[#344B43] hover:bg-[#F0F5F2] ${focusRing}`}
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        )}

        {showCamera && (
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
                        ? 'The camera may be in use by another application.'
                        : 'The camera could not start. Please check your permissions.'
                )

                setShowCamera(false)
              }}
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={capturePhoto}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#11493E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
              >
                <Camera size={16} />
                Capture photo
              </button>

              <button
                type="button"
                onClick={() => setShowCamera(false)}
                className={`min-h-10 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold ${focusRing}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showCamera && (
          <div className={value ? 'mt-3 border-t border-[#E8EFEC] pt-3' : ''}>
            <p className="mb-3 text-sm leading-5 text-[#5A6B66]">
              {value
                ? 'Replace the existing photograph using your camera or device.'
                : 'Add a photograph using your camera or choose an existing image.'}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openCamera}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#11493E] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0C3A31] ${focusRing}`}
              >
                <Camera size={16} />
                Open camera
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#D5DFDA] px-3 py-2 text-sm font-semibold text-[#11493E] hover:bg-[#F0F5F2] ${focusRing}`}
              >
                <Upload size={16} />
                Upload from device
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="sr-only"
                aria-label="Choose an image from your device"
              />
            </div>
          </div>
        )}

        {(cameraError || uploadError) && (
          <p role="alert" className="mt-3 text-sm leading-5 text-red-700">
            {cameraError || uploadError}
          </p>
        )}
      </div>
    </section>
  )
}

export default CameraCapture
