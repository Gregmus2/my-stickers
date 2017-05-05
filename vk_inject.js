window.onload = (function (){
    chrome.storage.local.get({'vkaccess_token': {}}, function(items) {
        var token = items.vkaccess_token;
        var owner_id = '-129399041';

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function(mutation) {
                var albums = request('photos.getAlbums', 'owner_id='+owner_id+'&need_covers=1').items;
                var body = '';
                albums.forEach(function(album){
                    body += '<a class="emoji_tab_img_cont emoji_tab_mysctickers" data-album-id="'+album.id+'"><img width="22" height="22" src="'+album.thumb_src+'" class="emoji_tab_img"></a>';
                });
                $('.emoji_tabs .emoji_tab_0').after(body);
            });
			observer.disconnect();
        });

        var config = { childList: true, characterData: true };

        var target = document.querySelector(".emoji_smile_wrap");
        // console.log(target);
        observer.observe(target, config);

        $('body').delegate('.emoji_tab_mysctickers', 'click', function(){
            $('.emoji_tab_sel').removeClass('emoji_tab_sel');
            $(this).addClass('emoji_tab_sel');
            var album_id = $(this).data('album-id');


                var stickers = request('photos.get', 'owner_id=' + owner_id + '&album_id=' + album_id).items;

                $('.emoji_scroll').html('');
                stickers.forEach(function (photo) {
                    $('.emoji_scroll').append('<a class="emoji_sticker_item my-smile" data-media-id="'+owner_id+'_'+photo.id+'"><img class="emoji_sticker_image" src="' + photo.photo_75 + '"></a>');
                });

            /*var observer = new MutationObserver(function (mutations) {
                mutations[0].addedNodes.forEach(function(node) {
                    node.remove();
                });
                observer.disconnect();
            });
            var config = { childList: true, characterData: true };
            var target = document.querySelector(".emoji_scroll");
            observer.observe(target, config);*/

        });

        $('.im-chat-input--textarea').delegate('.my-smile', 'click', function () {

            var place = $('.ui_rmenu_item_sel');
            var id = place.data('list-id');

            var $data = '';
            if (Number(id) > 2000000000){
                $data += 'peer_id='+id;
            }else{
                $data += 'user_id='+id;
            }
            $data += '&attachment=photo'+$(this).data('media-id');
            console.log($data);
            console.log(token);
            request('messages.send', $data);

        });

        function request(path, data){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.vk.com/method/'+path+'?' + data + '&access_token='+token+'&v=5.53', false);
            xhr.send();
            if (xhr.status != 200) {
                console.log( xhr.status + ': ' + xhr.statusText );
            } else {
                console.log( xhr.responseText );
                return JSON.parse(xhr.responseText).response;
            }
        }
    });
})();