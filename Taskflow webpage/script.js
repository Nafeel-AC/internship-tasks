// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
  
  // Scroll animation for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)
  
  // Observe all sections with animation class
  document.querySelectorAll(".section-animate").forEach((section) => {
    observer.observe(section)
  })
  
  // Add click handlers for buttons
  document.addEventListener("DOMContentLoaded", () => {
    // CTA Button
    const ctaButton = document.querySelector(".cta-button")
    if (ctaButton) {
      ctaButton.addEventListener("click", () => {
        alert("Welcome to TaskFlow! Sign up feature coming soon.")
      })
    }
  
    // Pricing buttons
    const pricingButtons = document.querySelectorAll(".pricing-button")
    pricingButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const planName = this.closest(".pricing-card").querySelector("h3").textContent
        alert(`You selected the ${planName} plan! Checkout feature coming soon.`)
      })
    })
  
    // Add hover effects to cards
    const cards = document.querySelectorAll(".feature-card, .review-card, .pricing-card")
    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px)"
      })
  
      card.addEventListener("mouseleave", function () {
        if (!this.classList.contains("featured")) {
          this.style.transform = "translateY(0)"
        }
      })
    })
  })
  
  // Add scroll-to-top functionality
  let scrollToTopButton
  
  function createScrollToTopButton() {
    scrollToTopButton = document.createElement("button")
    scrollToTopButton.innerHTML = "↑"
    scrollToTopButton.setAttribute("aria-label", "Scroll to top")
    scrollToTopButton.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #66bb6a;
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(102, 187, 106, 0.3);
      `
  
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  
    document.body.appendChild(scrollToTopButton)
  }
  
  // Show/hide scroll to top button
  function toggleScrollToTopButton() {
    if (window.pageYOffset > 300) {
      scrollToTopButton.style.opacity = "1"
      scrollToTopButton.style.visibility = "visible"
    } else {
      scrollToTopButton.style.opacity = "0"
      scrollToTopButton.style.visibility = "hidden"
    }
  }
  
  // Initialize scroll to top functionality
  document.addEventListener("DOMContentLoaded", () => {
    createScrollToTopButton()
    window.addEventListener("scroll", toggleScrollToTopButton)
  })
  
  // Add loading animation
  window.addEventListener("load", () => {
    document.body.style.opacity = "0"
    document.body.style.transition = "opacity 0.5s ease-in-out"
  
    setTimeout(() => {
      document.body.style.opacity = "1"
    }, 100)
  })
  
  // Performance optimization: Throttle scroll events
  function throttle(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  // Apply throttling to scroll events
  const throttledScrollHandler = throttle(toggleScrollToTopButton, 100)
  window.addEventListener("scroll", throttledScrollHandler)
  