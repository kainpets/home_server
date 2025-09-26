class PhotoGallery {
  constructor() {
    // Use the current host instead of hardcoded localhost
    this.apiBase = `${window.location.protocol}//${window.location.host}`
    this.photos = []
    this.selectedFiles = []

    this.initializeElements()
    this.bindEvents()
    this.loadPhotos()
  }

  initializeElements() {
    this.photoInput = document.getElementById("photoInput")
    this.uploadForm = document.getElementById("uploadForm")
    this.uploadBtn = document.getElementById("uploadBtn")
    this.uploadProgress = document.getElementById("uploadProgress")
    this.progressFill = document.getElementById("progressFill")
    this.progressText = document.getElementById("progressText")
    this.photosGrid = document.getElementById("photosGrid")
    this.photoCount = document.getElementById("photoCount")
    this.refreshBtn = document.getElementById("refreshBtn")
    this.photoModal = document.getElementById("photoModal")
    this.closeModal = document.getElementById("closeModal")
    this.modalImage = document.getElementById("modalImage")
    this.modalTitle = document.getElementById("modalTitle")
    this.modalSize = document.getElementById("modalSize")
    this.modalType = document.getElementById("modalType")
    this.modalDate = document.getElementById("modalDate")
    this.toastContainer = document.getElementById("toastContainer")
  }

  bindEvents() {
    // File input change
    this.photoInput.addEventListener("change", (e) =>
      this.handleFileSelection(e)
    )

    // Form submission
    this.uploadForm.addEventListener("submit", (e) => this.handleUpload(e))

    // Refresh button
    this.refreshBtn.addEventListener("click", () => this.loadPhotos())

    // Modal close
    this.closeModal.addEventListener("click", () => this.closePhotoModal())
    this.photoModal.addEventListener("click", (e) => {
      if (e.target === this.photoModal) this.closePhotoModal()
    })

    // Drag and drop
    const fileInputLabel = document.querySelector(".file-input-label")
    fileInputLabel.addEventListener("dragover", (e) => this.handleDragOver(e))
    fileInputLabel.addEventListener("drop", (e) => this.handleDrop(e))
    fileInputLabel.addEventListener("dragleave", (e) => this.handleDragLeave(e))
  }

  handleFileSelection(event) {
    const files = Array.from(event.target.files)
    this.selectedFiles = files
    this.updateUploadButton()
  }

  handleDragOver(event) {
    event.preventDefault()
    event.currentTarget.style.borderColor = "#5a67d8"
    event.currentTarget.style.background = "#f0f4ff"
  }

  handleDragLeave(event) {
    event.currentTarget.style.borderColor = "#667eea"
    event.currentTarget.style.background = "#f8f9ff"
  }

  handleDrop(event) {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    this.selectedFiles = files.filter((file) => file.type.startsWith("image/"))
    this.photoInput.files = this.createFileList(this.selectedFiles)
    this.updateUploadButton()

    event.currentTarget.style.borderColor = "#667eea"
    event.currentTarget.style.background = "#f8f9ff"
  }

  createFileList(files) {
    const dt = new DataTransfer()
    files.forEach((file) => dt.items.add(file))
    return dt.files
  }

  updateUploadButton() {
    const hasFiles = this.selectedFiles.length > 0
    this.uploadBtn.disabled = !hasFiles
    this.uploadBtn.querySelector(".btn-text").textContent = hasFiles
      ? `Upload ${this.selectedFiles.length} Photo${
          this.selectedFiles.length > 1 ? "s" : ""
        }`
      : "Upload Photos"
  }

  async handleUpload(event) {
    event.preventDefault()

    if (this.selectedFiles.length === 0) return

    this.showProgress(true)
    this.uploadBtn.disabled = true

    try {
      const uploadPromises = this.selectedFiles.map((file, index) =>
        this.uploadSingleFile(file, index)
      )

      await Promise.all(uploadPromises)

      this.showToast("All photos uploaded successfully!", "success")
      this.loadPhotos()
      this.resetForm()
    } catch (error) {
      console.error("Upload error:", error)
      this.showToast("Upload failed. Please try again.", "error")
    } finally {
      this.showProgress(false)
      this.uploadBtn.disabled = false
    }
  }

  async uploadSingleFile(file, index) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.apiBase}/photos`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Upload failed")
    }

    const result = await response.json()
    this.updateProgress(((index + 1) / this.selectedFiles.length) * 100)
    return result
  }

  showProgress(show) {
    this.uploadProgress.style.display = show ? "block" : "none"
    if (show) {
      this.progressFill.style.width = "0%"
      this.progressText.textContent = "Preparing upload..."
    }
  }

  updateProgress(percentage) {
    this.progressFill.style.width = `${percentage}%`
    this.progressText.textContent = `Uploading... ${Math.round(percentage)}%`
  }

  resetForm() {
    this.selectedFiles = []
    this.photoInput.value = ""
    this.updateUploadButton()
  }

  async loadPhotos() {
    try {
      this.showLoading(true)
      const response = await fetch(`${this.apiBase}/photos`)

      if (!response.ok) {
        throw new Error("Failed to load photos")
      }

      const data = await response.json()
      this.photos = data.photos || []
      this.renderPhotos()
      this.updatePhotoCount()
    } catch (error) {
      console.error("Error loading photos:", error)
      this.showToast("Failed to load photos", "error")
      this.renderError()
    } finally {
      this.showLoading(false)
    }
  }

  showLoading(show) {
    const loadingPlaceholder = this.photosGrid.querySelector(
      ".loading-placeholder"
    )
    if (loadingPlaceholder) {
      loadingPlaceholder.style.display = show ? "block" : "none"
    }
  }

  renderPhotos() {
    if (this.photos.length === 0) {
      this.renderEmptyState()
      return
    }

    this.photosGrid.innerHTML = this.photos
      .map((photo) => this.createPhotoCard(photo))
      .join("")

    // Add click events to photo cards
    this.photosGrid.querySelectorAll(".photo-card").forEach((card) => {
      card.addEventListener("click", () =>
        this.openPhotoModal(card.dataset.photoId)
      )
    })
  }

  createPhotoCard(photo) {
    const photoUrl = `${this.apiBase}/uploads/photos/${photo.filename}`
    const fileSize = this.formatFileSize(photo.fileSize)
    const uploadDate = new Date(photo.uploadedAt).toLocaleDateString()

    return `
            <div class="photo-card" data-photo-id="${photo.id}">
                <img src="${photoUrl}" alt="${photo.title}" class="photo-thumbnail" loading="lazy">
                <div class="photo-info">
                    <div class="photo-title">${photo.title}</div>
                    <div class="photo-details">
                        <div>Size: ${fileSize}</div>
                        <div>Type: ${photo.mimeType}</div>
                        <div>Uploaded: ${uploadDate}</div>
                    </div>
                </div>
            </div>
        `
  }

  renderEmptyState() {
    this.photosGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📷</div>
                <h3>No photos yet</h3>
                <p>Upload your first photo to get started!</p>
            </div>
        `
  }

  renderError() {
    this.photosGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Failed to load photos</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `
  }

  updatePhotoCount() {
    this.photoCount.textContent = `${this.photos.length} photo${
      this.photos.length !== 1 ? "s" : ""
    }`
  }

  openPhotoModal(photoId) {
    const photo = this.photos.find((p) => p.id == photoId)
    if (!photo) return

    const photoUrl = `${this.apiBase}/uploads/photos/${photo.filename}`
    this.modalImage.src = photoUrl
    this.modalTitle.textContent = photo.title
    this.modalSize.textContent = this.formatFileSize(photo.fileSize)
    this.modalType.textContent = photo.mimeType
    this.modalDate.textContent = new Date(photo.uploadedAt).toLocaleString()

    this.photoModal.style.display = "block"
    document.body.style.overflow = "hidden"
  }

  closePhotoModal() {
    this.photoModal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  showToast(message, type = "info") {
    const toast = document.createElement("div")
    toast.className = `toast ${type}`

    const icon = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"

    toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${message}</span>
            </div>
        `

    this.toastContainer.appendChild(toast)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 5000)
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PhotoGallery()
})

// Handle keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modal = document.getElementById("photoModal")
    if (modal.style.display === "block") {
      modal.style.display = "none"
      document.body.style.overflow = "auto"
    }
  }
})
