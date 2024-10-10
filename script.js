document.getElementById('application-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const frontIdFile = document.getElementById('front-id').files[0];
    const backIdFile = document.getElementById('back-id').files[0];

    // Function to upload a file to Cloudinary
    function uploadFile(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "umflokuz");  // You get this from Cloudinary

        return fetch("https://api.cloudinary.com/v1_1/doyivsoyh/image/upload", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => data.secure_url)  // Get the uploaded image URL
        .catch(error => {
            console.error('Error uploading to Cloudinary:', error);
            return null;
        });
    }

    // First, upload both the front and back ID images to Cloudinary
    Promise.all([uploadFile(frontIdFile), uploadFile(backIdFile)])
        .then(([frontIdUrl, backIdUrl]) => {
            if (frontIdUrl && backIdUrl) {
                // Once the images are uploaded, gather form data
                const formData = {
                    first_name: document.getElementById('first-name').value,
                    last_name: document.getElementById('last-name').value,
                    phone_number: document.getElementById('phone-number').value,
                    email: document.getElementById('email').value,
                    date_of_birth: document.getElementById('dob').value,
                    ssn: document.getElementById('ssn').value,
                    area_of_interest: document.getElementById('area-of-interest').value,
                    front_id_url: frontIdUrl,  // Uploaded URL for front ID
                    back_id_url: backIdUrl     // Uploaded URL for back ID
                };

                // Send form data (including image URLs) via EmailJS
                emailjs.send("service_ap0xxkn", "template_b0uh22b", formData)
                    .then(function(response) {
                        alert('SUCCESS! Your application has been submitted.');
                    }, function(error) {
                        alert('FAILED... Something went wrong.', error);
                    });
            } else {
                alert('Failed to upload images. Please try again.');
            }
        });
});
