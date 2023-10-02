// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Get references to the necessary elements
    const imageInput = document.getElementById('image-input');
    const colorPickerReplace = document.getElementById('color-picker-replace');
    const colorPickerNew = document.getElementById('color-picker-new');
    const alphaSlider = document.getElementById('alpha-slider');
    const imagePreview = document.getElementById('image-preview');
    const startButton = document.querySelector('button');
    const intensitySlider = document.getElementById('intensity-slider');
    const intensityLabel = document.getElementById('intensity-label');
  
    // Add event listener to the "Start" button
    startButton.addEventListener('click', () => {
      // Get the selected image file from the input
      const imageFile = imageInput.files[0];
  
      // Create a FileReader object to read the image file
      const reader = new FileReader();
  
      // Set up the FileReader onload event handler
      reader.onload = function(event) {
        // Create a new image element
        const image = new Image();
  
        // Set the source of the image element to the loaded data URL
        image.src = event.target.result;
  
        // Set up an onload event handler for the image
        image.onload = function() {
          // Get the image width and height
          const width = image.width;
          const height = image.height;
  
          // Create a canvas element to draw the image
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
  
          // Set the canvas dimensions to match the image
          canvas.width = width;
          canvas.height = height;
  
          // Draw the image on the canvas
          context.drawImage(image, 0, 0, width, height);



          // Get the RGBA color values to replace and the new color
          const replaceColor = hexToRGBA(colorPickerReplace.value);

          const newColor = hexToRGBA(colorPickerNew.value);
  
          // Get the image data from the canvas
          const imageData = context.getImageData(0, 0, width, height);
          const pixels = imageData.data;
  
          // Loop through each pixel of the image
          for (let i = 0; i < pixels.length; i += 4) {
            // Get the RGBA values of the current pixel
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];
            const alpha = pixels[i + 3];
  
            // Check if the current pixel color matches the replace color
            if (compareColors(red, green, blue, replaceColor)) {
              // Calculate the alpha blending factor
              const blendFactor = alpha / 255;
  
              // Blend the new color with the existing color
              const blendedColor = blendColors(newColor, { red, green, blue, alpha }, blendFactor);
  
              // Set the new color values for the pixel
              pixels[i] = blendedColor.red;
              pixels[i + 1] = blendedColor.green;
              pixels[i + 2] = blendedColor.blue;
              pixels[i + 3] = blendedColor.alpha;
            }
          }
  
          // Update the image data on the canvas
          context.putImageData(imageData, 0, 0);
  
          // Set the modified image as the preview source
          imagePreview.src = canvas.toDataURL();
        };
      };
  
      // Read the image file as a data URL
      reader.readAsDataURL(imageFile);
    });

    // Add event listener to the intensity slider
    intensitySlider.addEventListener('input', () => {
        // Update the intensity label to display the current value
        intensityLabel.textContent = `Intensity: ${intensitySlider.value}%`;

        // Trigger the "click" event on the "Start" button to update the image preview
        startButton.click();
    });
  
    // Helper function to compare two colors
    function compareColors(red1, green1, blue1, color2) {
      const tolerance = intensitySlider.value; // Adjust this value to control the color matching sensitivity
      return Math.abs(red1 - color2.red) <= tolerance &&
             Math.abs(green1 - color2.green) <= tolerance &&
             Math.abs(blue1 - color2.blue) <= tolerance;
    }
  
    // Helper function to blend two colors
    function blendColors(color1, color2, blendFactor) {
      const blendedColor = {
        red: Math.round(color1.red * blendFactor + color2.red * (1 - blendFactor)),
        green: Math.round(color1.green * blendFactor + color2.green * (1 - blendFactor)),
        blue: Math.round(color1.blue * blendFactor + color2.blue * (1 - blendFactor)),
        alpha: color2.alpha
      };
      return blendedColor;
    }
  
    // Helper function to convert a hexadecimal color to RGBA values
    function hexToRGBA(color) {
      const rgba = {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 255
      };
  
      if (color.length === 7) {
        rgba.red = parseInt(color.slice(1, 3), 16);
        rgba.green = parseInt(color.slice(3, 5), 16);
        rgba.blue = parseInt(color.slice(5, 7), 16);
      }
  
      return rgba;
    }
  });
  