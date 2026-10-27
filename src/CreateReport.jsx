
import './CreateReport.css'

function CreateReport() {
  return (
    <main className="create-report-page">
      <header className="create-report-header">
        <a className="create-report-brand" href="/">
          <span className="create-report-brand-icon">O</span>
          <span>Fieldnote</span>
        </a>

        <span className="create-report-header-label">
          OUTDOOR SITE REPORTING
        </span>
      </header>

      <section className="create-report-content">
        <div className="create-report-intro">
          <p className="create-report-eyebrow">NEW REPORT / 01</p>
          <h1>Report an issue</h1>
          <p className="create-report-subtitle">
            Capture what you see and record the details for the
            relevant team.
          </p>
        </div>

        <form className="create-report-form">
          <section className="create-report-section">
            <div className="create-report-section-heading">
              <span className="create-report-step">01</span>
              <div>
                <h2>Evidence</h2>
                <p>Add a photograph and describe the issue.</p>
              </div>
            </div>

            <label className="create-report-photo-area" htmlFor="report-photo">
              <span className="create-report-camera-icon">＋</span>
              <strong>Add a photograph</strong>
              <span>Take a photo or choose an image</span>
              <input
                id="report-photo"
                type="file"
                accept="image/*"
                capture="environment"
              />
            </label>

            <label className="create-report-label" htmlFor="report-description">
              Description
            </label>
            <textarea
              id="report-description"
              className="create-report-textarea"
              placeholder="Describe what you noticed..."
              rows="4"
            />
          </section>

          <section className="create-report-section">
            <div className="create-report-section-heading">
              <span className="create-report-step">02</span>
              <div>
                <h2>Issue details</h2>
                <p>Categorise the report.</p>
              </div>
            </div>

            <label className="create-report-label" htmlFor="report-category">
              Category
            </label>
            <select
              id="report-category"
              className="create-report-select"
              defaultValue=""
            >
              <option value="" disabled>Select a category</option>
              <option value="maintenance">Maintenance</option>
              <option value="plant">Plant or vegetation</option>
              <option value="animal">Animal or wildlife</option>
              <option value="other">Other</option>
            </select>
          </section>

          <section className="create-report-section">
            <div className="create-report-section-heading">
              <span className="create-report-step">03</span>
              <div>
                <h2>Location & conditions</h2>
                <p>Record where and how the report was captured.</p>
              </div>
            </div>

            <div className="create-report-info-grid">
              <div className="create-report-info-card">
                <span className="create-report-info-icon">◎</span>
                <div>
                  <span className="create-report-info-label">GPS LOCATION</span>
                  <strong>Not captured yet</strong>
                </div>
                <button type="button" className="create-report-text-button">
                  Locate
                </button>
              </div>

              <div className="create-report-info-card">
                <span className="create-report-info-icon">◷</span>
                <div>
                  <span className="create-report-info-label">DATE & TIME</span>
                  <strong>Captured when saved</strong>
                </div>
              </div>

              <div className="create-report-info-card">
                <span className="create-report-info-icon">↗</span>
                <div>
                  <span className="create-report-info-label">COMPASS</span>
                  <strong>Not available yet</strong>
                </div>
              </div>

              <div className="create-report-info-card">
                <span className="create-report-info-icon">⌁</span>
                <div>
                  <span className="create-report-info-label">CAMERA TILT</span>
                  <strong>Not available yet</strong>
                </div>
              </div>
            </div>
          </section>

          <section className="create-report-section">
            <div className="create-report-section-heading">
              <span className="create-report-step">04</span>
              <div>
                <h2>Send to</h2>
                <p>Choose the team responsible for this report.</p>
              </div>
            </div>

            <label className="create-report-label" htmlFor="report-recipient">
              Recipient
            </label>
            <select
              id="report-recipient"
              className="create-report-select"
              defaultValue=""
            >
              <option value="" disabled>Select a recipient</option>
              <option value="maintenance">Maintenance team</option>
              <option value="grounds">Grounds team</option>
              <option value="wildlife">Wildlife team</option>
            </select>
          </section>

          <footer className="create-report-form-footer">
            <span>Your report will be saved on this device.</span>
            <button type="submit" className="create-report-submit">
              Save report <span>→</span>
            </button>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default CreateReport
