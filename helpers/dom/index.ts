import type { IntesectionPostsParam } from "./types"

export function handlePost(item: IntersectionObserverEntry) {
  const bars = getPostActionsBar()
  appendDownloadButton(bars)

  console.log({ bars })

  //////////////////////////////////////////////////

  function getPostActionsBar() {
    const bar = item.target.getElementsByClassName("feed-item-stats")
    return bar
  }

  function appendDownloadButton(containers: HTMLCollectionOf<Element>) {
    const style = document.createElement("style")
    style.type = "text/css"

    const css = `.programador51_download {
  height: 32px;
  width:32px;
  display: flex;
  align-items: center;
  border-radius:999px;
  background-color: transparent; /* Initial background color */
  border: none; /* Remove default border */
  cursor: pointer; /* Show pointer cursor on hover */
  transition: background-color 0.3s ease; /* Smooth transition effect */
}

.programador51_download:hover {
  background-color: #1f3347; /* Background color on hover */
}

.programador51_download svg {
  fill: #63738d; /* Set the SVG color */
}`

    style.textContent = css

    document.head.appendChild(style)

    const button = document.createElement("button")
    button.setAttribute("type", "button")
    button.setAttribute("class", "programador51_download feed-item-stat")

    button.addEventListener("click", () => {
      alert("downloading")
    })

    const svgHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" fill="#63738d" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
</svg>
`
    // Convert the SVG string into an actual DOM element
    const svgContainer = document.createElement("div")
    svgContainer.innerHTML = svgHTML.trim() // Create a container for the SVG
    const svgElement = svgContainer.firstChild as SVGElement // Extract the actual SVG element

    // Append the SVG to the button
    button.appendChild(svgElement)

    const items = [...containers]

    items.forEach((item) => {
      if (item) {
        item.appendChild(button)
      }
    })
  }
}

/**
 * Function to observe the DOM for any changes and return elements with the class '.image.contain-no-grow' inside active-modals.
 * It also watches for changes to these elements such as attributes, children, and text.
 * 
 * @returns {HTMLElement[]} - An array of DOM elements that have the class '.image.contain-no-grow'.
 */
export function observePost(): HTMLElement[] {
  const imageElements: HTMLElement[] = [];

  // Function to get all .image.contain-no-grow elements inside a given modal
  function getImageElementsInModal(modalElement: HTMLElement): HTMLElement[] {
    return Array.from(modalElement.querySelectorAll('.image.contain-no-grow'));
  }

  // Callback function for observing mutations on the .image.contain-no-grow elements
  const handleImageMutation = (mutationsList: MutationRecord[]): void => {
    mutationsList.forEach((mutation) => {
      // Log all mutations (can be removed in production for debugging purposes)
      // console.log('Mutation detected:', mutation);

      // Handle the mutations affecting the target elements
      if (mutation.target instanceof HTMLElement && mutation.target.classList.contains('image') && mutation.target.classList.contains('contain-no-grow')) {
        // console.log('Mutation on .image.contain-no-grow element:', mutation.target.getAttribute('src'));

        // You can add more specific checks here if needed, e.g., mutation.type
        // if (mutation.type === 'attributes') {
        //   console.log('Attribute change detected:', mutation.attributeName);
        // }
      }
    });
  };

  // Callback function for observing mutations on active-modal elements
  const handleModalMutation = (mutationsList: MutationRecord[]): void => {
    mutationsList.forEach((mutation) => {
      // Check if new nodes were added to the DOM (childList mutation)
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          // If the added node is an element and has class 'active-modal'
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains('active-modal')) {
            console.log('Active modal added:', node);

            // Once the modal is added, get .image.contain-no-grow elements inside it
            const newImageElements = getImageElementsInModal(node as HTMLElement);
            imageElements.push(...newImageElements);  // Add found elements to the array

            // Start observing the new .image.contain-no-grow elements
            newImageElements.forEach((el) => {
              const imageObserver = new MutationObserver(handleImageMutation);
              imageObserver.observe(el, {
                attributes: true,  // Watch for changes to attributes
                childList: true,   // Watch for addition/removal of child nodes
                subtree: true,     // Watch all descendants of the element
                characterData: true, // Watch for changes in text content
              });
            });
          }
        });
      }
    });
  };

  // Set up MutationObserver to observe for the addition/removal of active-modal elements
  const modalObserver = new MutationObserver(handleModalMutation);

  // Configuration to observe child list changes and the entire subtree
  const modalConfig: MutationObserverInit = {
    childList: true,  // Observe added or removed child nodes
    subtree: true,    // Observe the entire document body for any descendant nodes
  };

  // Start observing the body for the addition/removal of active-modals
  modalObserver.observe(document.body, modalConfig);

  // Return the initial set of .image.contain-no-grow elements (in case they exist already)
  const initialModals = document.querySelectorAll('.active-modal');
  initialModals.forEach((modal) => {
    const initialImages = getImageElementsInModal(modal as HTMLElement);
    imageElements.push(...initialImages);  // Add the initial elements to the array

    // Start observing the .image.contain-no-grow elements already in the DOM
    initialImages.forEach((el) => {
      const imageObserver = new MutationObserver(handleImageMutation);
      imageObserver.observe(el, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
  });

  return imageElements;
}


export function observePosts({
  onIntersection,
  onDisintersection
}: IntesectionPostsParam) {
  // Function that handles intersection events
  const handleIntersection = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        onIntersection(entry)
      } else {
        onDisintersection()
      }
    })
  }

  // Create an Intersection Observer
  const observer = new IntersectionObserver(handleIntersection, {
    root: null, // Observe in the context of the viewport
    rootMargin: "0px", // Margin around the root
    threshold: 0.1 // Trigger when 10% of the element is visible
  })

  // Dynamically observe new elements if they are added later
  const observeNewPosts = (mutationsList) => {
    mutationsList.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === "APP-POST") {
          observer.observe(node) // Start observing new elements
        }
      })

      mutation.removedNodes.forEach((node) => {
        if (node.tagName === "APP-POST") {
          observer.unobserve(node) // Stop observing removed elements
        }
      })
    })
  }

  const mutationObserver = new MutationObserver(observeNewPosts)
  mutationObserver.observe(document.body, { childList: true, subtree: true })
}

/**
 * Download an image from the fansly site
 * @param blobUrl - URL of the image, must be a `blob:xxxx` link
 * @param fileName - Filename, optional
 */
function downloadImage(blobUrl: string, fileName: string) {
  // Create an anchor element
  const link = document.createElement("a")

  // Set the href attribute to the blob URL
  link.href = blobUrl

  // Set the download attribute with the desired file name
  link.download = fileName

  // Append the link to the document (required for Firefox)
  document.body.appendChild(link)

  // Trigger the download by simulating a click
  link.click()

  // Remove the link after downloading
  document.body.removeChild(link)
}

export const downloadBlobImage = (blobUrl: string) => {

  const filename = blobUrl.split('/').reverse()[0];

  fetch(blobUrl)
      .then(response => response.blob())
      .then(blob => {
          const blobObjectUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobObjectUrl;
          a.download = `${filename}.jpg`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobObjectUrl);
      })
      .catch(error => console.error("Error downloading blob:", error));
};
