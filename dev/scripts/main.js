$(document).ready(function () {
    var $asidelink = $('.aside-link'), $wrapsidebar = $('.wrap-aside'), $btnmenu = $('.btn-menu');
    $asidelink.click(function () {
        $asidelink.toggleClass('active');
        $wrapsidebar.toggleClass('active');
        return false;
    });
    $btnmenu.click(function () {
        $btnmenu.toggleClass('active');
        $btnmenu.next().toggleClass('active');
        return false;
    });

});
    