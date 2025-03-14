import type { PlasmoCSConfig } from "plasmo"

import { downloadBlobImage } from "~helpers/dom"

export {}

// observePosts({
//   onDisintersection: () => console.log("desaparecio"),
//   onIntersection: (item) => handlePost(item)
// })

// Global variable to hold the image sources
let globalImageSources: string[] = []

// Function to observe elements with the class .image.contain-no-grow
const observePost = (): HTMLElement[] => {
  return Array.from(document.querySelectorAll(".image.contain-no-grow"))
}

// Function to log and update the global image sources
const updateGlobalImageSources = (imagesDom: HTMLElement[]) => {
  // Extract the src attributes of the images
  const newImageSources = imagesDom
    .map((imgTag: HTMLElement) => imgTag.getAttribute("src"))
    .filter((src) => src !== null) as string[]

  // Update the global variable
  globalImageSources = newImageSources

  // Optionally log the updated sources
  console.log("Updated Global Image Sources:", globalImageSources)
}

// Function to create a Proxy for observing changes in the image list
const createImageSourceProxy = (imagesDom: HTMLElement[]) => {
  return new Proxy(imagesDom, {
    get(target: HTMLElement[], prop: string | symbol): any {
      if (prop === "imageSources") {
        // Return the src attributes when 'imageSources' is accessed
        return target
          .map((imgTag: HTMLElement) => imgTag.getAttribute("src"))
          .filter((src) => src !== null)
      }
      return Reflect.get(target, prop)
    },
    set(target: HTMLElement[], prop: string | symbol, value: any): boolean {
      const result = Reflect.set(target, prop, value)
      if (prop === "length" || typeof prop === "string") {
        // Whenever the list changes, update the global variable
        updateGlobalImageSources(target)
      }
      return result
    }
  })
}

// Create a MutationObserver to detect changes in the DOM
const observer = new MutationObserver(() => {
  const imagesDom = observePost()
  const proxyImagesDom = createImageSourceProxy(imagesDom)
  updateGlobalImageSources(proxyImagesDom)
})

// Start observing for changes in the body element
observer.observe(document.body, { childList: true, subtree: true })

// Initialize and update global image sources right away
const imagesDom = observePost()
const proxyImagesDom = createImageSourceProxy(imagesDom)
updateGlobalImageSources(proxyImagesDom)

////////////////////////////////////////////////////////////////////////////////
function appendButtonAfterImg() {
  // Select all elements with the class 'overflow-wrapper'
  const overflowElements = document.querySelectorAll(".overflow-wrapper")

  // Loop through each element
  overflowElements.forEach((element) => {
    // Find the img element inside the .overflow-wrapper
    const imgElement = element.querySelector("img")

    if (imgElement) {
      // Check if a button already exists after the img element
      if (
        !imgElement.nextElementSibling ||
        !imgElement.nextElementSibling.classList.contains("added-button")
      ) {
        // Create a new button element
        const button = document.createElement("button")
        button.textContent = "Download" // Set the button's text
        button.classList.add("added-button") // Add a class to the button to keep track of it

        // Append the button as the next sibling of the img element
        // imgElement.parentNode?.insertBefore(button, imgElement.nextSibling)
        imgElement.parentNode?.insertBefore(button, imgElement.nextSibling)

        // Apply styles dynamically
        Object.assign(button.style, {
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "#fff",
          fontWeight: "bold",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: "10",
          transition: "all 0.3s ease"
        })

        button.addEventListener("mouseenter", () => {
          button.style.background = "rgba(255, 255, 255, 0.4)"
          button.style.backdropFilter = "blur(15px)"
        })

        button.addEventListener("mouseleave", () => {
          button.style.background = "rgba(255, 255, 255, 0.2)"
          button.style.backdropFilter = "blur(10px)"
        })

        button.addEventListener("click", () => {
          const prevSibling =
            button.previousElementSibling as HTMLImageElement | null

          if (prevSibling?.tagName.toLowerCase() === "img") {
            downloadBlobImage(prevSibling.src)
            console.log("Image src:", prevSibling.src)
          } else {
            console.log("No image found before the button.")
          }
        })
      }
    }
  })
}

function observeDOMChanges() {
  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        appendButtonAfterImg() // Call the function on changes
      }
    })
  })

  // Start observing the document body for changes in its child nodes
  observer.observe(document.body, { childList: true, subtree: true })
}

// Initialize the mutation observer
observeDOMChanges()

// import type { PlasmoCSConfig } from "plasmo"////////////////////////////////////////////////////

export const config: PlasmoCSConfig = {
  matches: ["https://fansly.com/*"],
  all_frames: true
}
