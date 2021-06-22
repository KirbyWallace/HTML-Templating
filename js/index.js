// ***************************************************************************************

HTMLDivElement.prototype.LoadTemplate = function (templatePath) {

	GetTemplate(templatePath)

		.then((templateHTML) => {

			this.innerHTML = templateHTML;

			var DOMDoc = new DOMParser().parseFromString(templateHTML, 'text/html');

			let __this = this;

			DOMDoc.querySelectorAll('script')

				.forEach(function (oldScript) {
					let newScript = document.createElement('script');
					newScript.innerHTML = oldScript.innerHTML;
					__this.appendChild(newScript);

				});

			if (stop) {
				return;
			}

		})

		.catch((errMsg) => {
			this.innerHTML = errMsg;
		})
}

// ***************************************************************************************

function GetTemplate(templatePath) {

	return new Promise((resolve, reject) => {

		let xhr = new XMLHttpRequest();
		xhr.open("GET", templatePath, true);

		xhr.send();

		xhr.onload = ((x) => {
			resolve(x.target.response);
		})

		xhr.onerror = ((x) => {
			reject(x.target.responseText);
		})

	});
}


// ***************************************************************************************

function k_Get(url, resolve, reject, dataType, data) {

	// resolve and reject are function pointers (ie, references) to the Promise() wrapper in any code that calls this function.
	// in other words, resolve and reject are actually the resolve and reject functions in your calling code promise().

	dataType = dataType || "text";
	data = data || null;

	if (data) {

		// If any data was supplied, add each item from the data block into the url

		url += url.indexOf("?") >= 0 ? "" : "?";

		for (let i = 0; i < Object.keys(data).length; i++) {
			url += "&"
				+ encodeURIComponent(Object.keys(data)[i]) + "="
				+ encodeURIComponent(Object.values(data)[i] == null
					? ""
					: Object.values(data)[i]);
		}
	}

	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);

	xhr.send();

	xhr.onload = ((x) => {

		switch (dataType) {

			case "text":
				resolve(x.target.response);
				break;

			case "json":
				resolve(JSON.parse(x.target.response));
				break;

			default:
				throw "k_Get(resolved) - Invalid Response Type Specified."
		}
	})

	xhr.onerror = ((x) => {

		switch (dataType) {

			case "text":
				reject(x.target.responseText);
				break;

			case "json":
				reject({ "error": x.target.responseText });
				break;

			default:
				throw "k_Get(rejected) - Invalid Response Type Specified."
		}
	})
}

// ***************************************************************************************

function element(id) {
	return document.getElementById(id);
}


// ***************************************************************************************
// WebKit transition works in chrome/brave/opera fine for both fade out and fade in.  But 
// it works only partially in Firefox.  Will fade out, but not in.  Snaps in instantly, 
// then fades out normally.  So, you need BOTH.  Firefox knows how to use the WebKit for 
// the fade out, but not the fade in.  So, you need the MOZ transition only to add the 
// fade in part to FireFox.  Neither Chrome, nor Brave work with the MozTransition. Opera
// also knows how to work with just the WebKit transitions. --KLW

function fadeOut(e, wait, speed) {

	setTimeout(function () {
		e.style.WebkitTransition = 'opacity ' + speed / 1000 + 's';
		e.style.MozTransition = 'opacity ' + speed / 1000 + 's';
		e.style.opacity = 0;
	}, wait);
}

// ***************************************************************************************

function fadeIn(e, wait, speed) {

	setTimeout(function () {
		e.style.WebkitTransition = 'opacity ' + speed / 1000 + 's';
		e.style.MozTransition = 'opacity ' + speed / 1000 + 's';
		e.style.opacity = 1;
	}, wait);
}

// ***************************************************************************************

function fadePulse(e, wait, speed) {

	setInterval(
		() => {
			fadeOut(e, wait, speed);
			fadeIn(e, wait + speed, speed);
		}, (wait + speed) * 2);
}

