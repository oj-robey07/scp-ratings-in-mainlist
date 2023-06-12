const HOST = 'scp-wiki.wikidot.com';
const HOST_REGEX = /^(www.)?(scp-wiki.wikidot.com|scpwiki.com|scp-wiki.net|scp-wiki.com)$/;

const RATING1_MIN = 100;
const RATING2_MIN = 400;
const RATINGHIGHEST_MIN = 1000;

const RATING2_COLOR = 'blue';
const RATINGHIGHEST_COLOR = 'yellow';

const CENSOR_BAR_MIN_LEN = 3;
const CENSOR_BAR_MAX_LEN = 6;

// How long, in milliseconds, the cache is valid for (default three months)
const CACHE_EXPIRES = 1000 * 60 * 60 * 24 * 90;

const domParser = new DOMParser();


// GENERAL FUNCTIONS
function SetHttpRequestCallback(httpRequest, callbackSuccess, callbackFail)
{
	httpRequest.onreadystatechange = function()
	{
		if (httpRequest.readyState === XMLHttpRequest.DONE)
		{
			if (httpRequest.status === 200)
				callbackSuccess(httpRequest.responseText);
			else
				callbackFail(httpRequest.responseText);
		}
	};
	httpRequest.ontimeout = function() { callbackFail(); };
}

function ajax(url, callbackSuccess, callbackFail)
{
	let httpRequest = new XMLHttpRequest();
	if (!httpRequest) return false;
	
	SetHttpRequestCallback(httpRequest, callbackSuccess, callbackFail)
	
	httpRequest.open('GET', url);
	httpRequest.setRequestHeader('Content-Type', 'text/plain');
	httpRequest.overrideMimeType('text/plain');
	httpRequest.send();
	return true;
}

function RandRange(min, max) { return Math.floor(Math.random() * (max + 1 - min)) + min; }

function CensoredText()
{
	switch (Math.floor(Math.random() * 3))
	{
		case 0:
			return '[REDACTED]';
		case 1:
			return '[DATA EXPUNGED]';
		case 2:
			return '█'.repeat(RandRange(CENSOR_BAR_MIN_LEN, CENSOR_BAR_MAX_LEN));
	}
}

// Returns the inputted number as a string with zeros added to the beginning to make it up to the right length
function AddZeros(num, len)
{
	let numL;
	if (num == 0) numL = 1;
	else numL = Math.floor(Math.log10(num)) + 1;
	if (numL > len || numL < 1 || !numL) return null;
	return '0'.repeat(len - numL)+num;
}

function DaysSince(dateNum)
{
	return Math.floor((Date.now() - dateNum) / (1000 * 60 * 60 * 24));
}

// Make the date like they do
function MakePrettyDate(dateNum)
{
	let date = new Date(dateNum);
	return date.getDate()+' '+date.toLocaleString('en-US', {month:'short'})+' '+date.getFullYear()
		+', '+AddZeros(date.getHours(), 2)+':'+AddZeros(date.getMinutes(), 2)+' ('+DaysSince(dateNum)+' days ago)';
}

function AddPlus(num)
{
	if (num > 0) return '+'+num;
	else return num;
}

function ScpPathToMainList(path)
{
	let scpNo;
	if (scpNo = path.match(/^\/scp-((?!0{3,})\d{3,})$/)) // You don't want it to be SCP-000, as that is not listed on the mainlist
	{
		scpNo = +scpNo[1];
		
		const series = Math.floor(scpNo / 1000) + 1;
		if (series == 1)
			return '/scp-series';
		else
			return '/scp-series-'+series;
	} else if (path.match(/^\/scp-\d{3,}-ex$/))
		return '/scp-ex';
	
}

function MakeTitleFromInfo(info)
{
	let title = '';
	if (info.altTitle)
		title = info.altTitle+' ';
	else if (info.title)
		title = info.title+' ';
	
	if (info.author)
		title += 'by '+info.author+' ';
	if (info.rating)
		title += '('+AddPlus(info.rating)+')';
	
	return title;
}

// Takes a HTMLCollection of tags
function HasTag(tags, tag)
{
	for (let i = 0; i < tags.length; i++)
		if (tags[i].innerHTML == tag) return true;
	return false;
}

// SCRAPING FUNCTIONS
// The alternate title is the title from the mainlist, and is only for SCPs
function ScrapeAltTitleFromP(page, path)
{
	// Make sure the link is in the actual page and not in the sidebar or something
	const pageContent = page.getElementById('page-content');
	if (!pageContent) return;
	const as = pageContent.getElementsByTagName('a');
	
	let licenseBox = page.getElementsByClassName('licensebox');
	if (licenseBox.length > 0)
		licenseBox = licenseBox[0];
	else licenseBox = null;
	
	for (let i = 0, l = as.length; i < l; i++)
	{
		if (as[i].pathname == path && !as[i].hash)
		{
			if (licenseBox && licenseBox.contains(as[i]))
				continue;
			const text = as[i].parentElement.textContent;
			m = text.match(/^(.*)(?<! by Loading\.\.\.)( by Loading\.\.\.)?Loading\.\.\.$/); /*	This will be added by the extension, and this is
																								the simplist way to remove it */
			if (m)
				return m[1];
			else
				return text;
		}
	}
	return;
}

function ScrapeAltTitleX(mainList, path, callbackSuccess, callbackFail)
{
	if (window.location.pathname == mainList) // If the user is already on the mainlist page that it needs
	{
		let altTitle = ScrapeAltTitleFromP(document, path)
		if (altTitle)
		{
			callbackSuccess(altTitle);
			return true;
		} else { callbackFail(); return false; }
	} else
		ajax('https://'+HOST+mainList, function(page)
		{ // Success
			let altTitle = ScrapeAltTitleFromP(domParser.parseFromString(page, 'text/html'), path);
			if (altTitle)
				callbackSuccess(altTitle);
			else
				callbackFail();
		}, callbackFail);
	return true;
}

function ScrapeAltTitle(page, path, callbackSuccess, callbackFail)
{
	let tags = page.getElementsByClassName('page-tags');
	if (tags.length == 0) { callbackFail(); return false; }
	tags = tags[0].getElementsByTagName('span')[0].getElementsByTagName('a');
	if (tags.length == 0) { callbackFail(); return false; }
	
	if (HasTag(tags, 'scp'))
	{
		if (HasTag(tags, 'joke'))
			ScrapeAltTitleX('/joke-scps', path, callbackSuccess, callbackFail);
		else if (HasTag(tags, 'explained'))
			ScrapeAltTitleX('/scp-ex', path, callbackSuccess, callbackFail);
		else if (HasTag(tags, '001-proposal'))
			ScrapeAltTitleX('/scp-001', path, callbackSuccess, callbackFail);
		else
		{
			let mainList;
			let scpNo = path.match(/^\/scp-(\d{3,})$/);
			if (!scpNo) { callbackFail(); return false; }
			scpNo = +scpNo[1];
			
			const series = Math.floor(scpNo / 1000) + 1;
			if (series == 1)
				mainList = '/scp-series';
			else
				mainList = '/scp-series-'+series;
			ScrapeAltTitleX(mainList, path, callbackSuccess, callbackFail);
		}
		return true;
	} else
	{
		callbackFail(); return false;
	}
}

function ScrapeRating(page)
{
	const rating = page.getElementsByClassName('prw54353'); // Don't even ask me why they use this class name
	if (rating.length > 0)
		return +(rating[0].innerHTML);
}

function ScrapeTitle(page)
{
	let title = page.getElementById('page-title');
	if (!title)
		return;
	title = title.innerHTML.match(/\n *(.*)\n */)[1]; // The title is in a sea of whitespaces with some newlines
	if (title)
		return title;
}

// Takes an unparsed page instead of parsed like all the other functions
function ScrapeAuthor(page, callbackSuccess, callbackFail)
{
	const wikidotPageId = page.match(/WIKIREQUEST\.info\.pageId = (.*);/)[1];
	if (!wikidotPageId) { callbackFail(); return false; }
	const wikidotToken = document.cookie.match(/wikidot_token7=(.*);?/)[1];
	if (!wikidotToken) { callbackFail(); return false; }
	
	let httpRequest = new XMLHttpRequest();
	
	SetHttpRequestCallback(httpRequest, function(response)
	{
		// Parsing the author and creation date out of the page
		const jsonResponse = JSON.parse(response);
		if (jsonResponse.body)
		{
			let retVal = {};
			let cells = domParser.parseFromString(jsonResponse.body, 'text/html');
			if (!cells) { callbackFail(); return false; }
			cells = cells.getElementsByClassName('page-history')[0].rows;
			cells = cells[cells.length - 1].cells;
			if (cells.length < 6) { callbackFail(); return false; }
			
			retVal.author = cells[4].textContent;
			/*	The creation date is given in the usual Javascript time, but with the last 3 digits omitted.
				This gives it a precision down to seconds */
			retVal.dateCreated = +cells[5].getElementsByTagName('span')[0].className.match(/time_(\d{10})/)[1];
			callbackSuccess(retVal);
		} else { callbackFail(); return false; }
	
	}, callbackFail);
	
	httpRequest.open('POST', 'https://'+HOST+'/ajax-module-connector.php');
	
	httpRequest.withCredentials = true; // Important for the cookie
	httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	httpRequest.overrideMimeType('text/plain');
	
	httpRequest.send(
		'page=1&'+
		'perpage=1000000&'+
		'page_id='+wikidotPageId+'&'+
		'moduleName=history%2FPageRevisionListModule&'+
		'wikidot_token7='+wikidotToken);
	
	return true;
}

function ScrapePageDataFromP(page, plainPage, path, callback)
{
	let retVal = {};
	
	const title = ScrapeTitle(page);
	if (title)
		retVal.title = title;
	else
		console.warn('Could not scrape title.');
	
	const rating = ScrapeRating(page);
	if (rating)
		retVal.rating = rating;
	
	ScrapeAuthor(plainPage, function(ad)
	{
		retVal = Object.assign(retVal, ad);
		ScrapeAltTitle(page, path, function(altTitle)
		{
			retVal.altTitle = altTitle;
			callback(retVal);
		}, function()
		{
			callback(retVal);
		});
	}, function()
	{
		console.warn('Could not scrape author and creation date for '+path);
		ScrapeAltTitle(page, path, function(altTitle)
		{
			retVal.altTitle = altTitle;
			callback(retVal);
		}, function()
		{
			callback(retVal);
		});
	});
}

// Gets the rating, title, and author
function ScrapePageData(path, callbackSuccess, callbackFail)
{
	if (window.location.pathname == path)
		ScrapePageDataFromP(document, document.documentElement.outerHTML, path, callbackSuccess);
	else
		ajax('https://'+HOST+path, function(response)
		{ // Success
			ScrapePageDataFromP(domParser.parseFromString(response, 'text/html'), response, path, callbackSuccess);
		}, function(){ console.warn('Could not download page for '+path); callbackFail(); });
	return true;
}

// GET WRAPPER
/*	This function either gets the values from cache or, if they are not cached, downloads
	the web page, scrapes the values and caches them */
function GetScpInfo(path, callback)
{
	chrome.storage.local.get(path, function(savedInfo)
	{
		if (savedInfo[path] && savedInfo[path].expires > Date.now())
			callback(savedInfo[path]);
		else
			// Scrape everything
			ScrapePageData(path, function(data)
			{
				let info = {};
				info[path] = data;
				info[path].expires = Date.now() + CACHE_EXPIRES;
				
				chrome.storage.local.set(info);
				callback(info[path]);
			}, function(){});
	});
}

// SETTING OUT STUFF ON THE PAGE FUNCTIONS
function CreateRatingCss()
{
	let style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = 
		'.rating { position: absolute; top: 0%; right: 0%; }'+
		'.rating1 { font-weight: bold; }'+
		'.rating2 { font-weight: bold; color: '+RATING2_COLOR+'; }'+
		'.ratingHighest { font-weight: bold; color: '+RATINGHIGHEST_COLOR+'; }';
	
	document.getElementsByTagName('head')[0].appendChild(style);
}

function CreateRatingDisplay(parent, path)
{
	const is001 = window.location.pathname == '/scp-001';
	parent.style.position = 'relative'; // Needed for absolute positioning
	
	let authorElementCont, authorElement;
	
	if (!is001) // The 001 page already has the authors
	{
		authorElementCont = document.createElement('i');
		authorElementCont.innerHTML = ' by ';
		authorElement = document.createElement('span');
		authorElement.innerHTML = 'Loading...';
		authorElementCont.appendChild(authorElement);
		
		// We need to insert this before any <ul>s, so it doesn't appear at the bottom
		const ul = parent.getElementsByTagName('ul')[0];
		if (ul)
			parent.insertBefore(authorElementCont, ul);
		else
			parent.appendChild(authorElementCont);
	}
	
	const ratingElement = document.createElement('span');
	ratingElement.classList.add('rating');
	ratingElement.innerHTML = 'Loading...';
	parent.appendChild(ratingElement);
	
	GetScpInfo(path, function(info)
	{ // Success
		if (info.rating)
		{
			if (info.rating >= RATING1_MIN && info.rating < RATING2_MIN)
				ratingElement.classList.add('rating1');
			else if (info.rating >= RATING2_MIN && info.rating < RATINGHIGHEST_MIN)
				ratingElement.classList.add('rating2');
			else if (info.rating >= RATINGHIGHEST_MIN)
				ratingElement.classList.add('ratingHighest');
			
			ratingElement.innerHTML = AddPlus(info.rating);
		} else
			ratingElement.remove();
		
		if (!is001)
		{
			if (info.author)
				authorElement.innerHTML = info.author;
			else
				authorElementCont.remove();
		}
	});
}

function LinkHoverHandler(event)
{
	const path = this.pathname;
	if (path && this.host.match(HOST_REGEX) && !this.title) // Make sure that we're not overwriting an actual title
	{
		GetScpInfo(path, (info) =>
		{
			let title = MakeTitleFromInfo(info);
			if (title)
				this.title = title;
		});
	}
	this.removeEventListener('mouseover', LinkHoverHandler);
}

function AddLinkHoverInfo()
{
	let as = document.getElementsByTagName('a');
	for (let i = 0, l = as.length; i < l; i++)
		as[i].addEventListener('mouseover', LinkHoverHandler);
}

function ProcessList(ul, itemType)
{
	let items = ul.getElementsByTagName(itemType); // This gets the grandchildren as well, so it makes doing the Tales Edition lists far easier
	for (let i = 0, l = items.length; i < l; i++)
	{
		const scpLink = items[i].getElementsByTagName('a')[0];
		
		if (scpLink && scpLink.pathname && scpLink.host.match(HOST_REGEX))
			CreateRatingDisplay(items[i], scpLink.pathname);
		else
			console.warn('Non-valid or missing link.');
	}
}


// MAIN EXECUTION STARTS HERE
if (window.location.pathname.match(/^\/((scp-series(-[0-9]+)?(-tales-edition)?)|joke-scps(-tales-edition)?|scp-ex|explained-scps-tales-edition|scp-001)$/))
{
	CreateRatingCss();
	if (window.location.pathname.match(/^\/(scp-series(-[0-9]+)?(-tales-edition)?)|joke-scps-tales-edition|scp-ex|explained-scps-tales-edition$/))
	{
		// This gets the <ul> immediatly following each header
		
		let i;
		if (window.location.pathname == '/scp-ex') i = 0;
		else i = 1;
		
		for (; i < Infinity; i++)
		{
			const heading = document.getElementById('toc'+i);
			if (!heading) break;
			
			let ul = heading.nextElementSibling;
			while (ul && ul.tagName != 'UL' && ul.id != 'toc'+(i + 1))
				ul = ul.nextElementSibling;
				
			if (!ul) break;
			if (ul.id == 'toc'+(i + 1)) continue;
			
			ProcessList(ul, 'li');
		}
	
	} else if (window.location.pathname == '/joke-scps')
	{
		// This gets each <ul> inside each element with the 'series' class
		
		const divs = document.getElementsByClassName('series');
		for (let i = 0, l = divs.length; i < l; i++)
		{
			let uls = divs[i].getElementsByTagName('ul');
			
			for (let j = 0, ll = uls.length; j < ll; j++)
				ProcessList(uls[j], 'li');
		}
	
	} else if (window.location.pathname == '/scp-001')
	{
		/*	For now, I can only do the old 'release order' listing, that shows when you click the link in
			the top corner, as the 'random' listing is in an <iframe> from a different domain, which makes
			it untouchable for security reasons.
			It may be possible with a bit of trickery, though */
		
		let list = document.getElementById('wiki-tab-0-1');
		ProcessList(list, 'p');
	}
}

GetScpInfo(window.location.pathname, function(info)
{
	// Put more info in the titles of pages
	let title = MakeTitleFromInfo(info);
	if (!title)
		return;
	title += ' - SCP Foundation';
	document.title = title;
	
	// Put author and creation date at the bottom
	const pageInfo = document.getElementById('page-info');
	pageInfo.innerHTML = 'By '+info.author+', first uploaded: '+MakePrettyDate(info.dateCreated * 1000)+'<br>'+pageInfo.innerHTML;
});

AddLinkHoverInfo();
