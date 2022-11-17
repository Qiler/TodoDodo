[...document.getElementsByClassName("sticky")].forEach((sticky, index, array) => {
  let number = 0;
  for (var i = sticky.id.length - 1; i >= 0; i--) {
    number = number + sticky.id.charCodeAt(i);
  }
  number = (number ^ 0xdeadbeef) % 100;
  number = Math.sin(number++) * 1000;
  number = number - Math.floor(number);
  sticky.style.transform = `rotate( ${(number - 0.5) * 10}deg )`;
  //element.style.transform = `rotate( ${(number - 0.5) * 10}deg )`;
  setTimeout(function(sticky, number) {
    sticky.getElementsByClassName("sticky-menu-content")[0].style = `rotate: ${(number - 0.5) * -10}deg`;
  }, 1, sticky, number);
  [...sticky.getElementsByClassName("task-form")].forEach((task, index, array) => {
    ([...task.getElementsByClassName("task-checkbox")][0]).onclick = function(event){
      ([...event.target.parentNode.getElementsByClassName("task-description-hidden")][0]).value = ([...event.target.parentNode.getElementsByClassName("task-description")][0]).textContent;
      event.target.parentNode.submit();
    };

    ([...task.getElementsByClassName("task-description")][0]).onkeypress = function(event){
      if (event.key === 'Enter'){
        event.preventDefault();
        ([...event.target.parentNode.getElementsByClassName("task-description-hidden")][0]).value = ([...event.target.parentNode.getElementsByClassName("task-description")][0]).textContent;
        event.target.parentNode.submit();
      }
    };
  })
});