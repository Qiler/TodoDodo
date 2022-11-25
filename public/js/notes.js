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
  sticky.find(".task-checkbox").bind("click", function (evt) {
    const nowDate = new Date();
    const taskForm = $(this).parent();
    taskForm.submit();
    taskForm.find(".timeago.task-finished-date").attr("datetime",nowDate.toUTCString().toLowerCase());
    taskForm.find(".timeago.task-finished-date").timeago("update",nowDate);
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

  $(".task-menu-content-delete-button").bind("click", function () {
    setTimeout(() => {
      const taskMenu = $(this).closest(".task-menu-content")
      $(`#task-${taskMenu.attr("data-tid")}`).remove();
      taskMenu.addClass("hidden");
    }, 100);
  });

  $(".shared-with-button").bind("click", function () {
    setTimeout(() => {
      $(this).parents(".shared-with").remove();
    }, 100);
  });
});

function submitForm(evt){
  evt.preventDefault();
  const form = $(this);
  const url = form.attr("action");
  $.ajax({
    type: "POST",
    url: url,
    data: form.serialize(),
  });
}

$(".sticky form").submit(submitForm);
$(".sticky-menu-content form").submit(submitForm);
$(".task-menu-content form").submit(submitForm);

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

$(".sticky-menu-button").bind("click", async function (evt) {
  const menu = $(".sticky-menu-content");
  const target = $(evt.delegateTarget);
  const sticky = target.closest(".sticky");
  const nid = sticky.attr("data-nid");
  const buttonPosition = target.offset();
  const menuList = menu.find(".shared-with").first();
  menu.find(".shared-with").children().remove();
  await $.ajax({
    url: `/api/getnote/${nid}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
      const date = new Date(parseInt(data.creationDate)).toLocaleString();
      menu.find(".sticky-menu-content-delete-form").first().attr("action", `/note/delete/${data.nid}`);
      menu.find(".note-owner").first().text(data.owner);
      menu.find(".note-creation-date").first().text(date);
      menu.find(".color-form").first().attr("action", `/note/editcolor/${data.nid}`);
      menu.find(".sticky-color-button").attr("data-nid",data.nid)
      menu.find(".sticky-color-button").first()[0].jscolor.fromString(data.color);
      for (let user of data.users) {
        menuList.append(`
        <div class="shared-with-container">
          <form action="/note/removeaccess/${nid}" method="POST">
            <input type="hidden" name="userid" value="${user.uid}">
            <button class="shared-with-button" type="submit"><i class="mdi mdi-close"></i></button>
          </form>
          <div class="shared-with-avatar"></div>
          <span class="shared-with-username">${user.username}</span>
        </div>
        `);
      }
    },
  });
  menu.css("top", buttonPosition.top + 10);
  menu.css("left", buttonPosition.left - menu.width());
  menu.removeClass("hidden");
});

$(".task-menu-button").bind("click", async function (evt) {
  const menu = $(".task-menu-content");
  const target = $(evt.delegateTarget);
  const task = target.closest(".task");
  const menuUsers = menu.find(".task-menu-content-users");
  const tid = task.attr("data-tid");
  menu.attr("data-tid",tid)
  const buttonPosition = target.offset();
  menu.attr("data-tid",tid)
  const taskDueDateElement = task.find(".task-form").first().find(".task-due-date");
  menuUsers.children().remove();
  menu.find(".task-menu-content-delete-form").first().attr("action", `/task/delete/${tid}`);
  menu.find(".task-menu-content-duedate-form").first().attr("action", `/task/setdue/${tid}`);
  await $.ajax({
    url: `/api/gettask/${tid}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
      flatPickrInstance.setDate(new Date(data.dueDate),false);
      menuUsers.append(`
      <span class="bold">Added by: </span>
      <span>${data.addedBy}</span>
      </br>`);
      if (data.checked && data.checkedBy){
        menuUsers.append(`
      <span class="bold">Finished by: </span>
      <span>${data.checkedBy}</span>`);
      }
    },
  });
  menu.css("top", buttonPosition.top + 5);
  menu.css("left", buttonPosition.left - menu.width());
  menu.removeClass("hidden");
});

$(document).bind("click", function (evt) {
  const stickyMenu = $(".sticky-menu-content");
  const taskMenu = $(".task-menu-content")
  if (
    !stickyMenu.hasClass("hidden") &&
    !(stickyMenu.is($(evt.target)) || $.contains(stickyMenu[0], evt.target) || (!!$(".jscolor-wrap")[0] && $.contains($(".jscolor-wrap")[0], evt.target))) &&
    !($(evt.target).hasClass("sticky-menu-button") || $(evt.target).hasClass("sticky-menu-button-bars"))
  ) {
    stickyMenu.addClass("hidden");
  }
  if (
    !taskMenu.hasClass("hidden") &&
    !(taskMenu.is($(evt.target)) || $.contains(taskMenu[0], evt.target)) &&
    !($(evt.target).hasClass("task-menu-button") || $(evt.target).parent().hasClass("task-menu-button")) &&
    !($.contains($(".flatpickr-calendar")[0],evt.target))
  ) {
    taskMenu.addClass("hidden");
  }

});

$(".sticky-menu-content-delete-form").submit(function (evt) {
  setTimeout(() => {
    document.location.reload();
  }, 100);
});

jscolor.presets.default = {
  closeButton: true,
  closeText: "Close",
  palette: "#ff7eb9 #ff65a3 #7afcff #feff9c #fff740",
  format: "hex",
  previewSize: 22,
  borderColor: "rgba(0,0,0,1)",
  borderRadius: 0,
  controlBorderColor: "rgba(0,0,0,1)",
  onChange: changeColor,
};

//jscolor.install();

function changeColor() {
  const thisElement = $(this.previewElement);
  thisElement.siblings(".color-form-input").val(this.toHEXString());
  $(`#sticky-${thisElement.attr("data-nid")}`).children(".sticky-container").css("background-color", this.toHEXString());
  thisElement.parents(".color-form").submit();
}

jQuery.timeago.settings.allowFuture = true;
jQuery(document).ready(function () {
  jQuery("time.timeago").timeago();
});

const flatPickrInstance = $(".flatpickr").flatpickr({
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: true,
  onChange: async function(dates){
    const tid = $(".task-menu-content").attr("data-tid");
    const task = $(`#task-${tid}`)
    task.find(".timeago.task-due-date").attr("datetime",dates[0].toUTCString().toLowerCase());
    task.find(".timeago.task-due-date").timeago("update",dates[0]);
    await $.ajax({
      url: `/api/updatetaskdue/${tid}`,
      type: "POST",
      data: {
        tid: tid,
        dueDate: dates[0]
      }
    });
  }
});
