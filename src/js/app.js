var title = document.querySelector('.title');
var courseFeatureElements = document.querySelectorAll('.course-feature');
var button = document.querySelector('button');

navigator.serviceWorker.register('/sw.js');

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
  .then(reg => console.log("Service Worker Registered", reg))
  .catch(err => console.log("Service Worker Failed", err));
}
