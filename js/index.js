const colors = ["red", "brown", "orange", "yellow", "blue"];
const randomColor = () => {
  const ranIndex = Math.floor(Math.random() * colors.length);
  console.log(colors[ranIndex]);
  return colors[ranIndex];
};

$(function () {
  // body padding depends on nav height
  const navbarHeight = $(".navbar").height();
  $("body").css("paddingTop", navbarHeight);

  // all sections min height according to screen and navbar sizes
  $(".block").css("min-height", $(this).height() - navbarHeight);

  // ^ popup
  // show popup when clicking the buttons
  $(".show-popup").on("click", function () {
    const TargetedPopClassName = `.${$(this).data("popup")}`;
    console.log(TargetedPopClassName);
    $(TargetedPopClassName).slideDown({
      start: function () {
        $(this).css("display", "flex");
        $(this).children().css("display", "none");
      },
      duration: 400,
      complete: function () {
        $(this).children().fadeIn(500);
      },
    });
  });

  // hide popup
  // when click on close button
  $(".close-popup").on("click", function () {
    $(".popup-inner").fadeOut({
      duration: 400,
      complete: function () {
        $(this).parent().slideUp(500);
      },
    });
  });

  // when clicking anywhere
  $(".popup").on("click", function () {
    $(".popup-inner").fadeOut({
      duration: 400,
      complete: function () {
        $(this).parent().slideUp(500);
      },
    });
  });

  // when pressing escape button
  $(document).on("keydown", function (e) {
    if (e.key === "Escape")
      $(".popup-inner").fadeOut({
        duration: 400,
        complete: function () {
          $(this).parent().slideUp(500);
        },
      });
  });

  // stop propagation when clicking on the inner
  $(".popup-inner").on("click", function (e) {
    e.stopPropagation();
  });
  //^ end popup

  //^ important event listeners
  // scroll to top button
  $(".scroll-to-top").on("click", function (e) {
    e.preventDefault();
    $("html").animate(
      { scrollTop: parseInt($("#home").css("marginTop")) },
      500
    );
  });

  // reset important values when resize the screen
  $(window).on("resize", function () {
    $(".block").css("min-height", $(this).height() - navbarHeight);
  });

  //^ go to the right section when click on navbar elements
  $(".navbar").on("click", "li", function () {
    const id = `#${$(this).data("scroll")}`;
    const scrollTopValue = $(id).offset().top;
    $("html").animate({ scrollTop: scrollTopValue - navbarHeight }, 600);
    $(this).addClass("active").siblings().removeClass("active");
  });

  // scroll event
  $(window).on("scroll", activateRightNavbarBtn);

  // button effects
  $(".effect-btn").on("mouseenter", function () {
    $(this).find(".prog-bar").animate({ width: "100%" }, 200);
  });
  $(".effect-btn").on("mouseleave", function () {
    $(this).find(".prog-bar").animate({ width: "0%" }, 200);
  });

  //^ side menu

  $(".side-menu .icon").on("click", function () {
    const sideMenu = $(this).parent(".side-menu");
    const menuWidth = sideMenu.css("width");

    if (sideMenu.hasClass("is-vis")) {
      sideMenu
        .animate({
          left: `-${menuWidth}`,
        })
        .removeClass("is-vis");
      $("body").animate({ paddingLeft: 0 });
    } else {
      sideMenu
        .animate({
          left: 0,
        })
        .addClass("is-vis");
      $("body").animate({ paddingLeft: menuWidth });
    }
  });

  //^ image slider
  $(".thumb-img").on("click", "div", function () {
    const imgSrc = $(this).children("img").attr("src");
    const mainImage = $(".slider-container .main-img img");
    mainImage.hide().attr("src", imgSrc).fadeIn(300);

    $(this).addClass("selected").siblings().removeClass("selected");
  });
});

const activateRightNavbarBtn = $.debounce(function () {
  const info = {
    activeBtn: $(".navbar").children("[class='active']"),
    shouldActiveBtn: "",
  };
  //! I added the half of screen size to activate the section when it comes in the middle of screen
  const windowTopOffset = $(window).scrollTop() + $(window).height() / 2;

  // sync the navbar with the active section
  $(".block").each(function () {
    const sectionTopOffset = $(this).offset().top;
    const nextSiblingOffset = $(this).next().offset().top;
    const id = $(this).attr("id");
    const navBtn = $(".navbar").find(`[data-scroll="${id}"]`);

    if (id === "contacts") {
      info.shouldActiveBtn = navBtn;
      return false;
    }

    if (
      windowTopOffset > sectionTopOffset &&
      windowTopOffset < nextSiblingOffset
    ) {
      info.shouldActiveBtn = navBtn;
      return false;
    }
  });
  // show and hide go up button
  if (windowTopOffset > 1000) $(".scroll-to-top").fadeIn(600);
  else $(".scroll-to-top").fadeOut(600);

  // active the right button
  if (
    info.activeBtn.attr("data-scroll") !==
    info.shouldActiveBtn.attr("data-scroll")
  ) {
    info.shouldActiveBtn.addClass("active").siblings().removeClass("active");
  }
}, 200);
