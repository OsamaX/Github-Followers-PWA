$(document).ready(function () {
	$("#search").on("submit", function (e) {
		const username = $("#user").val()

		if (username && username.trim().length > 0) {
			fetchFollowers(username)
		}

		return false
	})
})

function fetchFollowers(user) {
	const url = `https://api.github.com/users/${user}/followers`
	fetchFromCache(url)
	fetch(url)
		.then(res => res.json())
		.then(res => populateHTML(res))
		.catch(err => console.log(err))
}

function populateHTML(data) {
	let html = "";
	data.forEach((i, j) => {
		html += `<div class="col-sm-6 offset-xs-2 offset-sm-0 col-md-4 col-lg-3 user-card">
		<div class="card" style="width: 15rem;">
		  <img class="card-img-top" src="${i.avatar_url}" alt="Card image cap">
		  <div class="card-body">
		    <h5 class="card-title">${i.login}</h5>
		    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
		    <a href="${i.html_url}" target="_blank" class="btn btn-primary">Go Visit</a>
		  </div>
		</div>
		</div>`
	})

	$("#here").html(html)

}

function fetchFromCache(url) {
	if ('caches' in window) {
		caches.match(url).then(res => {
			if (res) {
				res.json().then(json => {
					populateHTML(json)
				})
			}
		})
	}
}

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("./sw.js")
		.then(sw => console.log("serviceWorker registered", sw))
		.catch(err => console.log(err))
}
