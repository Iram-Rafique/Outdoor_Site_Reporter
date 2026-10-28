
import { useState } from 'react'
import { MapPin } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A6A] focus-visible:ring-offset-2'

function LocationCapture({ value, onChange }) {
  const [error, setError] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  function getLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setIsGettingLocation(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })

        setIsGettingLocation(false)
      },
      (locationError) => {
        if (locationError.code === 1) {
          setError('Location permission was denied. Please allow location access.')
        } else if (locationError.code === 2) {
          setError('Your location is currently unavailable.')
        } else {
          setError('The location request timed out. Please try again.')
        }

        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  return (
    <section>
      <h3 className="mb-2 text-[15px] font-semibold">
        6. Location
      </h3>

      <div className="rounded-xl border border-[#E1E8E5] bg-white p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8EFEC] text-[#11493E]">
            <MapPin size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-semibold">Record your location</p>

            <p className="mt-1 text-sm leading-5 text-[#5A6B66]">
              Capture your current location to identify where the issue
              or observation occurred.
            </p>

            <button
              type="button"
              onClick={getLocation}
              disabled={isGettingLocation}
              className={`mt-3 rounded-lg bg-[#11493E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0C3A31] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {isGettingLocation
                ? 'Getting location...'
                : value
                  ? 'Refresh location'
                  : 'Get my location'}
            </button>

            {value && (
              <div className="mt-3 rounded-lg bg-[#E8F1ED] p-3 text-sm">
                <p className="font-medium text-[#11493E]">
                  Location captured
                </p>
                <p className="mt-1">
                  Latitude: {value.latitude.toFixed(6)}
                </p>
                <p>
                  Longitude: {value.longitude.toFixed(6)}
                </p>
                <p className="mt-1 text-xs text-[#5A6B66]">
                  Accuracy: approximately {Math.round(value.accuracy)} metres
                </p>

                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className={`mt-2 rounded-lg border border-[#D5DFDA] bg-white px-3 py-1.5 font-semibold ${focusRing}`}
                >
                  Remove location
                </button>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LocationCapture
