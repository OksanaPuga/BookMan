$(document).ready(function () {
    var $asidelink = $('.aside-link'), $wrapsidebar = $('.content'), $btnmenu = $('.btn-menu');
    $asidelink.click(function () {
        $asidelink.toggleClass('active');
        $wrapsidebar.toggleClass('active');
        return false;
    });
    

});
    