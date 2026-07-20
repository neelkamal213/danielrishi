// Shared site script

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Contact / quote request form — submits to Web3Forms (no backend needed).
  // Replace YOUR_WEB3FORMS_ACCESS_KEY in the form's hidden "access_key" field
  // (in every .html file) with the real key once it's created at web3forms.com.
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var statusEl = document.getElementById('formStatus');
      var submitBtn = form.querySelector('.form-submit');
      var accessKey = form.querySelector('[name="access_key"]').value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        statusEl.textContent = "This form isn't fully set up yet — the site owner still needs to add a Web3Forms access key.";
        statusEl.className = 'form-status error';
        return;
      }

      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      var formData = new FormData(form);
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (data.success) {
            statusEl.textContent = "Thanks — your message has been sent. We'll be in touch shortly.";
            statusEl.className = 'form-status success';
            form.reset();
          } else {
            statusEl.textContent = 'Something went wrong sending your message. Please try again, or contact us directly by phone or email.';
            statusEl.className = 'form-status error';
          }
        })
        .catch(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          statusEl.textContent = 'Something went wrong sending your message. Please try again, or contact us directly by phone or email.';
          statusEl.className = 'form-status error';
        });
    });
  }
});
