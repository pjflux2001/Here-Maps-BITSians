document.querySelector("body > div.ui.pointing.menu.stackable > div.hamburger").addEventListener("click", function(e) { 
		$menu = $(this).parent();
		if(!$(this).hasClass('active')) {
			$(this).addClass('active');
			$menu.addClass('open');
		} else {
			$(this).removeClass('active');
			$menu.removeClass('open');
		}
		e.preventDefault();
	});
