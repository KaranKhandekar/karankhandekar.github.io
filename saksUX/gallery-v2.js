document.addEventListener('DOMContentLoaded', () => {
  // Array of your product images in initial order
  let imageList = [
      "assets/pdpPage/net/Frame 1.png",
      "assets/pdpPage/net/Frame 2.png",
      "assets/pdpPage/net/Frame 3.png",
      "assets/pdpPage/net/Frame 4.png"
  ];

  const hero = document.getElementById('heroImage');
  const thumbnails = document.querySelectorAll('.thumb-img');

  function updateGallery() {
      // The first item in the array is always the hero
      hero.src = imageList[0];

      // The remaining items populate the thumbnails
      thumbnails.forEach((img, index) => {
          if (imageList[index + 1]) {
              img.src = imageList[index + 1];
              img.parentElement.style.display = 'block';
          } else {
              img.parentElement.style.display = 'none';
          }
      });
  }

  function rotateForward() {
      // Remove first image and add to the end
      const first = imageList.shift();
      imageList.push(first);
      updateGallery();
  }

  function rotateBackward() {
      // Remove last image and add to the front
      const last = imageList.pop();
      imageList.unshift(last);
      updateGallery();
  }

  // Attach listeners to all 4 arrows
  document.getElementById('mainNext').onclick = rotateForward;
  document.getElementById('thumbNext').onclick = rotateForward;
  document.getElementById('mainPrev').onclick = rotateBackward;
  document.getElementById('thumbPrev').onclick = rotateBackward;

  updateGallery(); // Run on load
});