"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");
  var year = document.getElementById("year");
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (year) year.textContent = new Date().getFullYear();

  function updateHeader() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 20);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Subtle section reveals; content remains visible if IntersectionObserver is unavailable.
  if (!reducedMotion && "IntersectionObserver" in window) {
    var revealItems = document.querySelectorAll(".section-heading, .section-copy, .section-visual, .product-card, .approach-card, .process-step, .faq-list details, .enquiry-form");
    revealItems.forEach(function (item) { item.classList.add("motion-ready"); });
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
        document.body.classList.remove("menu-open");
      }
    });
  }

  document.querySelectorAll("[data-product]").forEach(function (link) {
    link.addEventListener("click", function () {
      var productSelect = document.querySelector('#enquiry-form select[name="product"]');
      if (!productSelect) return;
      var wanted = link.getAttribute("data-product");
      var option = Array.from(productSelect.options).find(function (item) { return item.value === wanted || item.text === wanted; });
      if (option) productSelect.value = option.value || option.text;
    });
  });

  var enquiryForm = document.getElementById("enquiry-form");
  var formStatus = document.getElementById("form-status");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!enquiryForm.reportValidity()) return;
      var data = new FormData(enquiryForm);
      var subject = "Grey Zen enquiry — " + String(data.get("product") || "Product sourcing");
      var body = [
        "New enquiry for Grey Zen",
        "",
        "Name: " + data.get("name"),
        "Business email: " + data.get("email"),
        "Product category: " + data.get("product"),
        "Destination country: " + data.get("country"),
        "",
        "Project details:",
        data.get("details")
      ].join("\n");
      var mailto = "mailto:rishabhgoko@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      if (formStatus) formStatus.textContent = "Opening your email app. Please review the prepared message and press Send to submit your enquiry.";
      window.location.href = mailto;
    });
  }

  var authForms = document.querySelectorAll(".auth-form");
  var authTabs = document.querySelectorAll(".auth-tab");
  var authStatus = document.getElementById("auth-status");
  function showAuthMode(mode) {
    authTabs.forEach(function (tab) {
      var selected = tab.getAttribute("data-mode") === mode;
      tab.setAttribute("aria-selected", String(selected));
    });
    authForms.forEach(function (form) {
      form.hidden = form.getAttribute("data-mode") !== mode;
    });
    if (authStatus) authStatus.textContent = "";
  }
  authTabs.forEach(function (tab) {
    tab.addEventListener("click", function () { showAuthMode(tab.getAttribute("data-mode")); });
  });
  authForms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (authStatus) authStatus.textContent = "The account interface is ready, but secure sign-in is not connected yet. Connect an authentication provider such as Supabase or Firebase before using real accounts. No password has been saved or sent.";
    });
  });
  var forgotLink = document.getElementById("forgot-password");
  if (forgotLink) {
    forgotLink.addEventListener("click", function (event) {
      event.preventDefault();
      if (authStatus) authStatus.textContent = "Password recovery becomes available after a secure authentication provider is connected. No password reset email has been sent.";
    });
  }
});
