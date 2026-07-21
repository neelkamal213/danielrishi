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

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close all other items
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Generic Web3Forms submission handler — works for the main contact
  // form and the footer newsletter form alike. Replace
  // YOUR_WEB3FORMS_ACCESS_KEY in each form's hidden "access_key" field
  // (in every .html file) with the real key once created at web3forms.com.
  function wireForm(formEl, statusEl, successMessage) {
    if (!formEl) return;
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = formEl.querySelector('button[type="submit"]');
      var accessKey = formEl.querySelector('[name="access_key"]').value;

      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        if (statusEl) {
          statusEl.textContent = "This form isn't fully set up yet — the site owner still needs to add a Web3Forms access key.";
          statusEl.className = 'form-status error';
        }
        return;
      }

      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      var formData = new FormData(formEl);
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
            if (statusEl) {
              statusEl.textContent = successMessage;
              statusEl.className = 'form-status success';
            }
            formEl.reset();
          } else {
            if (statusEl) {
              statusEl.textContent = 'Something went wrong. Please try again, or contact us directly by phone or email.';
              statusEl.className = 'form-status error';
            }
          }
        })
        .catch(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          if (statusEl) {
            statusEl.textContent = 'Something went wrong. Please try again, or contact us directly by phone or email.';
            statusEl.className = 'form-status error';
          }
        });
    });
  }

  wireForm(
    document.getElementById('contactForm'),
    document.getElementById('formStatus'),
    "Thanks — your message has been sent. We'll be in touch shortly."
  );

  wireForm(
    document.getElementById('newsletterForm'),
    document.getElementById('newsletterStatus'),
    "You're subscribed — thank you!"
  );
});
