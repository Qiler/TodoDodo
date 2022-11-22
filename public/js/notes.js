function ranomSeeded(seed) {
  seed = (seed ^ 0xdeadbeef) % 100;
  seed = Math.sin(seed++) * 1000;
  seed = seed - Math.floor(seed);
  return seed;
}

$(".sticky").each(function () {
  const sticky = $(this);
  /*     for (var i = sticky.attr("id").length - 1; i >= 0; i--) {
      number = number + sticky.attr("id").charCodeAt(i);
    } */
  const number = ranomSeeded(parseInt(sticky.data("nid")) * 1000000);
  const rotation = (number - 0.5) * 10;
  sticky.css("transform", `rotate( ${rotation}deg )`);
  $(sticky).find(".sticky-menu-content")[0].style = `rotate: ${-rotation}deg`;
  $(".task-checkbox").bind("click", function () {
    $(this).parent().submit();
  });

  $(".task-description").keypress(function (event) {
    const parent = $(this).parent();
    const textValue = parent.find(".task-description").first().text();
    parent.find(".task-description-hidden").first().val(textValue);
    if (event.key === "Enter") {
      event.preventDefault();
      parent.submit();
    }
  });

  $(".task-form-delete-button").bind("click", function () {
    setTimeout(() => {
      $(this).parents(".task").remove();
    }, 100);
  });

  $(".shared-with-button").bind("click", function () {
    setTimeout(() => {

      $(this).parents(".shared-with").remove();
    }, 100);
  });
});

$(".sticky form").submit(function (evt) {
  evt.preventDefault();
  const form = $(this);
  const url = form.attr("action");
  $.ajax({
    type: "POST",
    url: url,
    data: form.serialize(),
  });
});

$(".sticky-add-form").submit(function (evt) {
  setTimeout(() => {
    document.location.reload();
  }, 100);
});

$(".share-with-form").submit(function (evt) {
  setTimeout(() => {
    document.location.reload();
  }, 100);
});

$(".sticky-menu-button").bind("click", function () {
  $(this).siblings(".sticky-menu-content").toggleClass("hidden");
});

$(".sticky-menu-content-delete-form").submit(function (evt) {
  setTimeout(() => {
    document.location.reload();
  }, 100);
});

jscolor.presets.default = {
  closeButton: true,
  closeText: "Apply",
  palette: "#ff7eb9 #ff65a3 #7afcff #feff9c #fff740",
  format: "hex",
  previewSize: 22,
  borderColor: "rgba(0,0,0,1)",
  borderRadius: 0,
  controlBorderColor: "rgba(0,0,0,1)",
  onChange: changeColor,
};

function changeColor() {
  const thisElement = $(this.previewElement)
  thisElement.siblings(".color-form-input").val(this.toHEXString());
  thisElement.parents(".sticky").children(".sticky-container").css("background-color",this.toHEXString());
  thisElement.parents(".color-form").submit();
}

jQuery.timeago.settings.allowFuture = true;
jQuery(document).ready(function() {
  jQuery("time.timeago").timeago();
});

$(".flatpickr").flatpickr(
  {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true
  }
);
