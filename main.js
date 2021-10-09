let keyword = [];

chrome.storage.sync.get("searchWordList", function(items) {
  keyword = items.searchWordList;

  if(keyword == undefined || keyword.length == 0){
    $('#blog').append(`<p>検索文字列が設定されていません。アイコンを右クリックして、オプションから設定画面を開き、検索文字列を設定してください。</p>`);
  }
  else{
    searchKeyword(0);
  }
});

let searchKeyword = (cnt) => {
  var xhr = new XMLHttpRequest();
  xhr.responseType  = "document";
  let search_url = "https://coconala.com/requests?keyword=" + encodeURI(keyword[cnt]) +"&recruiting=true";
  xhr.open("get", search_url);
  xhr.send();
  xhr.onload = function(e){
    var dom = e.target.responseXML;
    var items = dom.querySelectorAll('.c-searchItem');
    let total_item = dom.querySelector('.c-searchHeader_resultNum')

    $('#blog').append('<div class="top"><h3>'+ keyword[cnt] +`</h3><p><a href="${search_url}" target="_blank">coconalaでみる</a></p></div>`);

    //検索結果がない場合
    if (items.length == 0){
      $('#blog').append('<p>検索結果はありません。</p>');
    }

    //検索結果がある場合
    for (var i = 0; i < items.length; i++) {
      var info = items[i].querySelector('.c-itemInfo_title a');
      var title = info.innerText;
      var url = info.getAttribute('href');
      var detail = items[i].querySelectorAll('.c-itemTileLine_budget .c-itemTileLine_emphasis');
      var yosan = "";

      //予算の文字列取得
      for (var j = 0; j < detail.length; j++){
        yosan = yosan + detail[j].innerText;
      }

      //予算に数値がない場合
      if (yosan == ""){
        yosan = "見積もり希望"
      }

      //出力
      $('#blog').append(`<p><a href="${url}" target="_blank">${title} ${yosan}</a></p>`);
    }

    //total件数から他に検索結果があるか調べる
    if(total_item != null){
      let total = total_item.innerText;
      if (total > 40){
        search_url = search_url + "&page=2";
        $('#blog').append(`<p><a href="${search_url}" target="_blank">もっとみる</a></p>`);
      }
    }
    
    if( cnt < keyword.length-1 ) {
      searchKeyword(cnt+1);
    }
  };
}

