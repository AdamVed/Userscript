// ==UserScript==
// @name        Download Batch
// @namespace   Violentmonkey Scripts
// @match       https://labs.google/fx/library
// @grant       none
// @version     1.0
// @author      -
// @description 1/19/2025, 6:59:06 PM
// ==/UserScript==


(async function () {
  function openBoxes(count) {
    var boxes = document.getElementsByClassName('sc-f45adf7f-0 bIYNBb sc-59eecc9-1 bXgyjS')
    Array.from(boxes).forEach((box, index) => {
      if(index < count) {
        box.children[0].click()
      }
    })
  }

  function closeBoxes(count) {
    var dateArea = document.querySelector('.sc-3350f2b-2.lmLwyb')
    for(let i = 0; i < count; i++) {
      console.log("Trying to click...")
      dateArea.click()
    }
  }

  function downloadImages() {
      try {
          var openWindows = document.querySelectorAll('div[role="dialog"]')
          console.log("OpenWindows = ", openWindows)
          openWindows.forEach((openWindow) => {
              console.log("Single window = ", openWindow)
              var img = openWindow.querySelector('img')
              var href = img.src

              var link = document.createElement('a')
              link.href = href
              link.download = 'imageFX.jpg'

              openWindow.appendChild(link)

              link.click()
              link.remove()
          })
      }
      catch(e) {
          console.log("error ", e)
      }
  }

  // Observer that waits for all the images to appear before attempting to download them
  async function waitForElms(selector, count) {
      return new Promise(resolve => {
          if (document.querySelectorAll(selector).length == count) {
        console.log("Elements found! ", document.querySelectorAll(selector))
              return resolve(document.querySelectorAll(selector));
          }

          const observer = new MutationObserver(mutations => {
              if (document.querySelectorAll(selector).length == count) {
                  observer.disconnect();
                  resolve(document.querySelector(selector));
              }
          });

          observer.observe(document.body, {
              childList: true,
              subtree: true
          });
      });
  }


  function createAndAppendButtons() {
    // Download the last 4 images as a default setting
    var newBtnFour = document.createElement("button")
    newBtnFour.textContent = "Download Four"
    newBtnFour.style.margin = "10px 20px 0px"
    newBtnFour.style.color = "red"
    newBtnFour.style.fontWeight = "bold"
    newBtnFour.addEventListener("click", () => run(4))

    // Download the X-last images depending on user input
    var newBtnInput = document.createElement("button")
    newBtnInput.textContent = "Download X"
    newBtnInput.style.margin = "10px 20px 0px"
    newBtnInput.style.color = "red"
    newBtnInput.style.fontWeight = "bold"
    newBtnInput.addEventListener("click", () => {
      run(prompt("How many images would you like to download?"))
    })

    // A span to make sure the buttons are on the same row
    var buttonsSpan = document.createElement("span")
    buttonsSpan.appendChild(newBtnFour)
    buttonsSpan.appendChild(newBtnInput)

    // A div to hold the span and the buttons
    var buttonsDiv = document.createElement("div")
    buttonsDiv.appendChild(buttonsSpan)

    // Area we're appending it to, in this case the on the parent element of the current date tag
    if (document.querySelector('.sc-3350f2b-2.lmLwyb').parentElement) {
       var dateArea = document.querySelector('.sc-3350f2b-2.lmLwyb').parentElement
    }
    else if(document.querySelector('.sc-3350f2b-2.lmLwyb')) {
         var dateArea = document.querySelector('.sc-3350f2b-2.lmLwyb')
    }
    else {
      console.log("No dateArea found")
      return
    }
    dateArea.appendChild(buttonsDiv)
  }

  async function run(count) {
    await openBoxes(count)
    var elm = await waitForElms('div.sc-b438e147-0 > img', count);
    downloadImages()
  }

  await waitForElms('.sc-3350f2b-2.lmLwyb', 1)
  createAndAppendButtons()
})();
