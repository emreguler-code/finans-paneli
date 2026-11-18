/* Runs before modules so a missing/stale asset cannot leave an empty page. */
(function () {
  function failed() {
    var notice = document.getElementById("boot-status");
    if (!notice) return;
    notice.textContent =
      "Uygulama yüklenemedi. Sayfayı yenileyin. Sorun sürerse sürüm dosyalarının eksiksiz yüklendiğini kontrol edin.";
    var button = document.getElementById("boot-retry");
    if (button) button.hidden = false;
  }
  document.addEventListener("click", function (event) {
    if (event.target.id === "boot-retry") location.reload();
  });
  window.addEventListener(
    "error",
    function (event) {
      if (event.target && event.target.tagName === "SCRIPT") failed();
    },
    true,
  );
  window.addEventListener("unhandledrejection", failed);
  setTimeout(failed, 15000);
})();
