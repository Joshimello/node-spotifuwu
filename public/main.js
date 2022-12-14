const socket = io()
var socketid = ""
socket.on('connection:sid', id => {
	socketid = id
})

$('#form').submit((e) => {
	var playlistid = $('#playlistid').val()
	e.preventDefault()
	fetch(`/api?playlistid=${playlistid}&socketid=${socketid}`, {
        method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
    	if (data.error != undefined) {
    		$('#main').empty()
    		$('#main').append(`
    			<div class="d-flex flex-column border border-warning rounded p-1 mt-1 align-items-center justify-content-center">
    				<span>We came across an error nyaa~</span>
	    			<em>${data.error}</em>
	    			<a href=".">Refresh Page?</a>
    			</div
    		`)

    		return
    	}

    	$('#main').empty()
		$('#main').append(`
			<div class="d-flex flex-row border border-warning rounded p-1 mt-1 align-items-center bg-warning">
				<span class="me-auto ms-2">Zipped Playlist</span>
				<a class="btn btn-warning border-0" href="${data.zipped}"><i class="fas fa-download"></i></a>
			</div>
		`)

    	data.songs.forEach((entry) => {
    		$('#main').append(`
    			<div class="d-flex flex-row border border-warning rounded p-1 mt-1 align-items-center">
					<span class="me-auto ms-2">${entry[1]}</span>
					<a class="btn btn-outline-warning border-0" href="${entry[0]}"><i class="fas fa-download"></i></a>
				</div>
    		`)
    	})
    })
    .catch((err) => {
    	console.log(`Error: ${err}`)
    })

	$('#main').empty()
    $('#main').append(`
    	<div class="d-flex flex-row border border-warning rounded p-1 mt-1 align-items-center justify-content-center">
			<span class="me-auto" id="task">Loading...</span>
			<span id="progress">0/0</span>
		</div>
    `)

    socket.on('progress', data => {
    	$('#task').text(data)
    })

    socket.on('total', data => {
   		$('#progress').text(data)
    })
})