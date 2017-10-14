$('#photo-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/photo?' + search, function(data) {
      $('#photo-grid').html('');
      data.forEach(function(photo) {
          $("#photo-grid").append(`
                <li class="col-xs-12 col-sm-6 col-md-4 ">
                    <div class="thumbnail" id="mythumbnail">
                          <img src="${ photo.source}">
    
                        <div style="margin: 2px 10px">
                            <h3 class="pull-right"><a href="/photo/${ photo._id}">More Info</a></h3>
                            <h3 class="pull-left"><strong>${ photo.title}</strong></h3>
                        </div>
                    </div>
                </li>
          `);
      });
      new AnimOnScroll( document.getElementById( 'photo-grid' ), {
    			minDuration : 0.4,
    			maxDuration : 0.7,
    			viewportFactor : 0.2
    	} );
  });
});

$('#photo-search').submit(function(event) {
  event.preventDefault();
});