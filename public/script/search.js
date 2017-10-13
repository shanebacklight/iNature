$('#photo-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/photo?' + search, function(data) {
    $('#photo-grid').html('');
    data.forEach(function(photo) {
      $('#photo-grid').append(`
                <div class="col-md-3 col-sm-6">
                    <div class="thumbnail mythumbnail">
                          <img src="${ photo.source}">

                        <div style="margin-top: 2px">
                            <p class="pull-left" style="display: inline"><strong>${ photo.title} </strong></p>
                            <a href="/photo/${ photo._id }" class="pull-right">More Info</a>
                        </div>
                    </div>
                </div>
      `);
    });
  });
});

$('#photo-search').submit(function(event) {
  event.preventDefault();
});