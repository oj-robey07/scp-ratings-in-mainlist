let g_domParser, g_documentWikiInfo, g_documentLang, g_settings;


/*########################################################\
|##################*********************##################|
|##################**GENERAL FUNCTIONS**##################|
|##################*********************##################|
\########################################################*/

function SetHttpRequestCallback(httpRequest, callback)
{
	httpRequest.onreadystatechange = function()
	{
		if (httpRequest.readyState === XMLHttpRequest.DONE)
		{
			if (httpRequest.status === 200)
				callback(true, httpRequest.responseText);
			else
				callback(false, httpRequest.responseText);
		}
	};
	httpRequest.ontimeout = function() { callback(false, null); };
}

function ajax(url, callback)
{
	let httpRequest = new XMLHttpRequest();
	if (!httpRequest) return false;
	
	SetHttpRequestCallback(httpRequest, callback)
	
	httpRequest.open("GET", url);
	httpRequest.setRequestHeader("Content-Type", "text/plain");
	httpRequest.overrideMimeType("text/plain");
	httpRequest.send();
	return true;
}

/*
function RandRange(min, max) { return Math.floor(Math.random() * (max + 1 - min)) + min; }

function CensoredText()
{
	switch (Math.floor(Math.random() * 3))
	{
		case 0:
			return "[REDACTED]";
		case 1:
			return "[DATA EXPUNGED]";
		case 2:
			return "█".repeat(RandRange(CENSOR_BAR_MIN_LEN, CENSOR_BAR_MAX_LEN));
	}
}
*/

function GetWikiInfo(host)
{
	let i, j;
	for (i = 0; i < WIKI_INFO.length; i++)
		for (j = 0; j < WIKI_INFO[i].hosts.length; j++)
			if (host == WIKI_INFO[i].hosts[j] || host == "www."+WIKI_INFO[i].hosts[j])
				return WIKI_INFO[i];
	return null;
}

function RemoveOffset(path)
{
	let mPath = path.match(/^(.+)\/offset\/\d+$/);
	if (mPath) return mPath[1];
	else return path;
}

/***********************\
|**TEXT LINE FUNCTIONS**|
\***********************/

function GetLineFirstNode(node)
{
	let cu;
	for (cu = node;
		
		cu.previousSibling && cu.previousSibling.tagName != "BR" &&
		/*	getComputedStyle somehow works, even when used on an element from a DOMParser-generated document
			(I'm assuming it just gets the default styles for the element, which should be good enough) */
		!(cu.previousSibling instanceof Element && window.getComputedStyle(cu.previousSibling, null).display == "block") &&
		!cu.textContent.includes("\n");
		
		cu = cu.previousSibling);
	return cu;
}
/*function GetLineLastNode(node)
{
	let cu;
	for (cu = node;
		
		cu.nextSibling && cu.nextSibling.tagName != "BR" &&
		!(cu.nextSibling instanceof Element && window.getComputedStyle(cu.nextSibling, null).display == "block") &&
		!cu.textContent.includes("\n");
		
		cu = cu.nextSibling);
	return cu;
}*/
function GetLineNodesAmount(firstNode)
{
	let i, cu;
	for (i = 1, cu = firstNode;
		
		cu.nextSibling && cu.nextSibling.tagName != "BR" &&
		!(cu.nextSibling instanceof Element && window.getComputedStyle(cu.nextSibling, null).display == "block") &&
		!(i != 1 && cu.textContent.includes("\n")); // The first node is allowed to have a newline
		
		i++, cu = cu.nextSibling);
	return i;
}

function GetLineLinksAmount(firstNode, nodesAmount)
{
	let i, cu;
	let linksAmount = 0;
	for (i = 0, cu = firstNode; i < nodesAmount; i++, cu = cu.nextSibling)
	{
		if (cu.tagName == "A")
			linksAmount++;
	}
	return linksAmount;
}
function GetLineText(firstNode, nodesAmount)
{
	let i, cu, nodeText, nlIdx;
	let text = "";
	for (i = 0, cu = firstNode; i < nodesAmount; i++, cu = cu.nextSibling)
	{
		//if (cu.hidden) continue;
		
		if (cu.textContent)
			nodeText = cu.textContent;
		else continue;
		
		nlIdx = nodeText.indexOf("\n");
		if (nlIdx >= 0)
		{
			if (i == 0)
			{
				nlIdx = nodeText.lastIndexOf("\n");
				text += nodeText.substring(nlIdx + 1);
			} else if (i == nodesAmount - 1)
				text += nodeText.substring(0, nlIdx);
			else
				console.error("Broken parameters passed to GetLineText: Found newline character within line.");
		} else
			text += nodeText;
	}
	return text;
}
// The same thing as GetLineText, but uses outerHTML instead of textContent
function GetLineHtml(firstNode, nodesAmount)
{
	let i, cu, nodeText, nlIdx;
	let text = "";
	for (i = 0, cu = firstNode; i < nodesAmount; i++, cu = cu.nextSibling)
	{
		//if (cu.hidden) continue;
		
		if (cu.outerHTML)
			nodeText = cu.outerHTML;
		else if (cu.textContent) // Text nodes do not have outerHTML
			nodeText = cu.textContent;
		else continue;
		
		nlIdx = nodeText.indexOf("\n");
		if (nlIdx >= 0)
		{
			if (i == 0)
			{
				nlIdx = nodeText.lastIndexOf("\n");
				text += nodeText.substring(nlIdx + 1);
			} else if (i == nodesAmount - 1)
				text += nodeText.substring(0, nlIdx);
			else
				console.error("Broken parameters passed to GetLineHtml: Found newline character within line.");
		} else
			text += nodeText;
	}
	return text;
}
function DeleteLine(firstNode, nodesAmount)
{
	let i, cu, cuNext;
	for (i = 0, cu = firstNode, cuNext = firstNode.nextSibling;
		i < nodesAmount;
		i++, cu = cuNext, cuNext && (cuNext = cuNext.nextSibling)
	)
		cu.remove();
}

/*#########################################################\
|##################**********************##################|
|##################**SCRAPING FUNCTIONS**##################|
|##################**********************##################|
\#########################################################*/

/*******************\
|**ALTERNATE TITLE**|
\****************** /
The alternate title is the title from the main lists, and is only for SCPs
You can specify the main list pages in WIKI_INFO, at the top of the file */

function GetTags(page)
{
	let tags = page.getElementsByClassName("page-tags");
	if (tags.length == 0) return null;
	tags = tags[0].getElementsByTagName("a");
	if (tags.length == 0) return null;
	return tags;
}
// Takes a HTMLCollection of tags
function HasTag(tags, tag)
{
	for (let i = 0; i < tags.length; i++)
		if (tags[i].innerHTML == tag) return true;
	return false;
}

const ROMAN_NUMERALS = [
	"","c","cc","ccc","cd","d","dc","dcc","dccc","cm",
	"","x","xx","xxx","xl","l","lx","lxx","lxxx","xc",
	"","i","ii","iii","iv","v","vi","vii","viii","ix"];
function IntToRomanNumeral(num)
{
    if (isNaN(num)) return NaN;
    
    let digits = String(+num).split("");
    let roman = "";
    for (let i = 2; i > 0; i--)
        roman = (ROMAN_NUMERALS[+digits.pop() + (i * 10)] || "") + roman;
    return "m".repeat(+digits.join("")) + roman;
}
// Turns a series object and an SCP path into the proper main list path
function ProcessSeries(seriesObj, path)
{
	if (typeof(seriesObj.path) == "string")
	{
		// Get all the values
		let replace, seriesAmount, start, omitOne;
		replace = seriesObj.replace;
		seriesAmount = seriesObj.seriesAmount;
		if (typeof(seriesAmount) != "number") seriesAmount = 1000;
		start = seriesObj.start;
		if (typeof(start) != "number") start = 0;
		omitOne = seriesObj.omitOne;
		if (typeof(omitOne) != "boolean") omitOne = true;
		
		// Find the series number
		let seriesNo;
		{
			let scpNo = path.match(/\d{3,}/); // Finds any combination of 3 or more numerals
			if (!scpNo) { console.warn("Could not find SCP number in "+path); return null; }
			scpNo = +scpNo[0];
			seriesNo = Math.floor((scpNo - start) / seriesAmount) + 1;
		}
		
		// Replace the replacement sequences
		let fReplace;
		if (seriesNo == 1 && omitOne)
			fReplace = "";
		else
		{
			if (typeof(replace) == "string")
				fReplace = replace.replaceAll("%a", String(seriesNo)).replaceAll("%r", IntToRomanNumeral(seriesNo));
			else
				fReplace = "-"+seriesNo; // The default
		}
		if (seriesObj.path.includes("%r"))
			return seriesObj.path.replaceAll("%r", fReplace);
		else
			return seriesObj.path+fReplace; // The default
	} else
		return null;
}
// Turns a series object into a regular expression that matches any main list path that would be part of this series
function ProcessSeriesRegExp(seriesObj)
{
	if (typeof(seriesObj.path) == "string")
	{
		// Get all the values
		const replace = seriesObj.replace;
		
		// Replace the replacement sequences
		let fReplace;
		if (typeof(replace) == "string")
			fReplace = replace.replaceAll("%a", "\\d+").replaceAll("%r", "(i|v|x|l|c|d|m)+");
		else
			fReplace = "-\\d+"; // The default
		
		if (seriesObj.path.includes("%r"))
			return new RegExp(seriesObj.path.replaceAll("%r", "("+fReplace+")?"));
		else
			return new RegExp(seriesObj.path+"("+fReplace+")?"); // The default
	} else
		return null;
		
}
// Searches the "mainLists" property in a WIKI_INFO object for the requested keys
function CrawlMainListsR(levels, keys, findDefault, path, i)
{
	let cKey;
	if (findDefault)
		cKey = "default";
	else
		cKey = keys[i];
	
	switch (typeof(levels[i][cKey]))
	{
		case "string":
			if (i < 1) console.error("String where object should be in mainLists object.");
			return levels[i][cKey];
		case "object":
			{
				let seriesPath = ProcessSeries(levels[i][cKey], path);
				if (seriesPath)
				{
					if (i < 1) console.error("Series object where normal object should be in mainLists object.");
					return seriesPath;
				}
				else
					if (keys.length - i > 1)
					{
						levels[i + 1] = levels[i][cKey];
						return CrawlMainListsR(levels, keys, findDefault, path, i + 1);
					} // Else go to "default:"
			}
		default:
			// It will go through the levels backwards and find the nearest "default" key
			if (i > 0)
			{
				if (findDefault)
					return CrawlMainListsR(levels, keys, true, path, i - 1);
				else
					return CrawlMainListsR(levels, keys, true, path, i);
			} else
			{
				console.error("Could not find keys [ "+keys+" ] or default fallback (\"default\" key) in mainLists object.");
				return null;
			}
	}
}
// The wrapper for CrawlMainListsR
function CrawlMainLists(wikiInfo, keys, path)
{
	return CrawlMainListsR([ wikiInfo.mainLists ], keys, false, path, 0);
}

function GetMainListPath(wikiInfo, page, path)
{
	if (!wikiInfo.typeTags || !wikiInfo.typeTags["scp"]) return null;
	const tags = GetTags(page);
	if (!tags) { console.warn("Could not get tags for "+path); return null; }
	if (!HasTag(tags, wikiInfo.typeTags["scp"])) return null;
	
	if (typeof(wikiInfo.mainLists) != "object") { console.error("wikiInfo has a defined \"scp\" tag but no \"mainLists\" object."); return null; }
	
	let lang, type;
	{
		// Find the language
		let keys = Object.keys(wikiInfo.langTags);
		for (let i = 0; i < keys.length; i++)
			if (HasTag(tags, wikiInfo.langTags[keys[i]]))
				lang = keys[i];
		if (!lang)
			lang = wikiInfo.defaultLang;
		
		// Find the type
		keys = Object.keys(wikiInfo.typeTags);
		for (let i = 0; i < keys.length; i++)
			// We already know it has 'scp'
			if (keys[i] != "scp" && HasTag(tags, wikiInfo.typeTags[keys[i]]))
				type = keys[i];
		if (!type)
			type = "scp";
	}
	
	// Now lookup the path
	return CrawlMainLists(wikiInfo, [ lang, type ], path);
}

// Takes the main list page and the SCP path
function ScrapeAltTitleFromP(page, path)
{
	// Make sure the link is in the actual page and not in the sidebar or something
	const pageContent = page.getElementById("page-content");
	if (!pageContent) return;
	const as = pageContent.getElementsByTagName("a");
	
	// You don't want to get the links in the licencebox
	let licenseBox = page.getElementsByClassName("licensebox");
	if (licenseBox.length > 0)
		licenseBox = licenseBox[0];
	else licenseBox = null;
	
	for (let i = 0, l = as.length; i < l; i++)
	{
		if (as[i].pathname == path && !as[i].hash)
		{
			if (licenseBox && licenseBox.contains(as[i]))
				continue;
			
			const lineFirstNode = GetLineFirstNode(as[i]);
			return GetLineText(lineFirstNode, GetLineNodesAmount(lineFirstNode));
		}
	}
	return null;
}

function ScrapeAltTitle(wikiInfo, page, scpPath, callback)
{
	const mlPath = GetMainListPath(wikiInfo, page, scpPath);
	if (!mlPath) { callback(false, null); return false; }
	
	// If the user is already on the mainlist page that it needs
	if (wikiInfo == g_documentWikiInfo && mlPath == window.location.pathname)
	{
		const altTitle = ScrapeAltTitleFromP(document, scpPath);
		if (altTitle)
		{
			callback(true, altTitle);
			return true;
		} else { callback(false, null); return false; }
	} else
	{
		ajax(wikiInfo.protocol+"://"+wikiInfo.hosts[0]+mlPath, function(success, page)
		{
			if (success)
			{
				const altTitle = ScrapeAltTitleFromP(g_domParser.parseFromString(page, "text/html"), scpPath);
				if (altTitle)
				{
					callback(true, altTitle);
					return true;
				}
			} // Else
			callback(false, null); return false;
		});
		return true;
	}
}

// Is formattable main list (can have authors and ratings added to the lines)
function IsFormMainList(wikiInfo, path)
{
	if (window.location.pathname.match(/^\/system:page-tags/)) return true;
	if (typeof(wikiInfo.mainLists) != "object") return false;
	let langTags, typeTags, i, j, seriesRegExp;
	
	langTags = Object.keys(wikiInfo.mainLists);
	for (i = 0; i < langTags.length; i++)
	{
		if (langTags[i] == "extras") continue;
		typeTags = Object.keys(wikiInfo.mainLists[langTags[i]]);
		for (let j = 0; j < typeTags.length; j++)
		{
			switch (typeof(wikiInfo.mainLists[langTags[i]][typeTags[j]]))
			{
				case "string":
					if (path == wikiInfo.mainLists[langTags[i]][typeTags[j]]) return true;
					break;
				case "object":
					seriesRegExp = ProcessSeriesRegExp(wikiInfo.mainLists[langTags[i]][typeTags[j]]);
					if (seriesRegExp && path.match(seriesRegExp)) return true;
			}
		}
	}
	
	// Else extras
	if (typeof(wikiInfo.mainLists.extras) == "object")
		for (i = 0; i < wikiInfo.mainLists.extras.length; i++)
			switch (typeof(wikiInfo.mainLists.extras[i]))
			{
				case "string":
					if (path == wikiInfo.mainLists.extras[i]) return true;
					break;
				case "object":
					if (wikiInfo.mainLists.extras[i] instanceof RegExp && path.match(wikiInfo.mainLists.extras[i])) return true;
			}
	// Else
	return false;
}

/********************\
|**RATING AND TITLE**|
\********************/

function ScrapeRating(wikiInfo, page)
{
	let retVal = {};
	switch (wikiInfo.ratingFormat)
	{
		// Stars
		case 1:
			{
				const ratings = page.getElementsByClassName("w-stars-rate-number");
				if (ratings.length >= 2)
				{
					retVal[SCP_INFO_LTRS.rating] = +(ratings[0].innerHTML);
					retVal[SCP_INFO_LTRS.votes] = +(ratings[1].innerHTML);
					return retVal;
				}
				else return null;
			}
		// Normal
		case 0:
		default:
			{
				const rating = page.getElementsByClassName("prw54353"); // Don't even ask me why they use this class name
				if (rating.length > 0)
				{
					retVal[SCP_INFO_LTRS.rating] = +(rating[0].innerHTML);
					return retVal;
				}
				else return null;
			}
	}
}

function ScrapeTitle(page)
{
	let title = page.getElementById("page-title");
	if (title)
	{
		title = title.textContent.match(/^\n {32}(.+)\n {28}$/); // The title is in a sea of whitespaces with some newlines
		if (title) return title[1];
	}
	// Else get the browser tab title
	title = page.title;
	if (title)
	{
		title = title.match(/^(.+) - /);
		if (title) return title[1];
	}// Else
	return null;
}

/****************************\
|**AUTHOR AND CREATION DATE**|
\****************************/

// Takes an unparsed page instead of parsed like all the other functions
function ScrapeAuthor(wikiInfo, page, callback)
{
	let wikidotPageId = page.match(/WIKIREQUEST\.info\.pageId = (.*);/);
	if (!wikidotPageId) { callback(false, null); return false; }
	wikidotPageId = wikidotPageId[1];
	
	let wikidotToken = document.cookie.match(/wikidot_token7=(.*);?/);
	if (!wikidotToken) { callback(false, null); return false; }
	wikidotToken = wikidotToken[1];
	
	let httpRequest = new XMLHttpRequest();
	
	SetHttpRequestCallback(httpRequest, function(success, response)
	{
		if (success)
		{ // Parsing the author and creation date out of the page
			const jsonResponse = JSON.parse(response);
			if (jsonResponse.body)
			{
				let retVal = {};
				let cells = g_domParser.parseFromString(jsonResponse.body, "text/html");
				if (!cells) { callback(false, null); return false; }
				cells = cells.getElementsByClassName("page-history")[0].rows;
				cells = cells[cells.length - 1].cells;
				if (cells.length < 6) { callback(false, null); return false; }
				
				let authLink = cells[4].getElementsByTagName("a")[1];
				if (authLink)
				{
					retVal[SCP_INFO_LTRS.authDisp] = authLink.innerText;
					if (authLink.href)
					{
						let authUserR = authLink.href.match(/^http:\/\/www.wikidot.com\/user:info\/(.+)$/);
						if (authUserR) retVal[SCP_INFO_LTRS.authUser] = authUserR[1];
					}
				} else
					retVal[SCP_INFO_LTRS.authDisp] = cells[4].innerText;
				
				/*	The creation date is given in the usual Javascript time, but with the last 3 digits omitted.
					This gives it a precision down to seconds */
				retVal[SCP_INFO_LTRS.dateCreated] = +cells[5].getElementsByTagName("span")[0].className.match(/time_(\d{10})/)[1];
				callback(true, retVal);
				return true;
			}
		} // Else
		callback(false, null); return false;
	});
	
	httpRequest.open("POST", wikiInfo.protocol+"://"+wikiInfo.hosts[0]+"/ajax-module-connector.php");
	
	httpRequest.withCredentials = true; // Important for the cookie
	httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	/*	Some wikis require the 'Referer' header to be set, but Firefox does not set this header in AJAX requests.
		You cannot get the authors and creation dates for these wikis on Firefox. */
	httpRequest.overrideMimeType("text/plain");
	
	httpRequest.send(
		"page=1&"+
		"perpage=1000000&"+
		"page_id="+wikidotPageId+"&"+
		"moduleName=history%2FPageRevisionListModule&"+
		"wikidot_token7="+wikidotToken);
	
	return true;
}

/************\
|**WRAPPERS**|
\************/

function ScrapePageDataFromP(wikiInfo, page, plainPage, path, callback)
{
	let retVal = {};
	
	// Title
	const title = ScrapeTitle(page);
	if (title)
		retVal[SCP_INFO_LTRS.title] = title;
	else
		console.warn("Could not scrape title for "+path);
	
	// Rating
	const rating = ScrapeRating(wikiInfo, page);
	if (rating)
		retVal = Object.assign(retVal, rating);
	
	// Author
	ScrapeAuthor(wikiInfo, plainPage, function(success, ad)
	{
		if (success)
			retVal = Object.assign(retVal, ad);
		else
			console.warn("Could not scrape author and creation date for "+path);
		
		// Alt-title
		ScrapeAltTitle(wikiInfo, page, path, function(success, altTitle)
		{
			if (success)
			{
				// Fix the 001 proposals' alt titles
				const altTitle001 = altTitle.match(/^CODE NAME: (.* - )?(.*)/);
				if (altTitle001)
					retVal[SCP_INFO_LTRS.altTitle] = retVal[SCP_INFO_LTRS.title]+" - "+altTitle001[2];
				else
					retVal[SCP_INFO_LTRS.altTitle] = altTitle;
			}
			callback(true, retVal);
		});
	});
}

// Gets the rating, title, and author
function ScrapePageData(wikiInfo, path, callback)
{
	// Again, this does the 'If you are on the same page' thing
	if (wikiInfo == g_documentWikiInfo && path == window.location.pathname)
	{
		ScrapePageDataFromP(wikiInfo, document, document.documentElement.outerHTML, path, callback);
		return true;
	} else
	{
		ajax(wikiInfo.protocol+"://"+wikiInfo.hosts[0]+path, function(success, response)
		{
			if (success)
			{
				ScrapePageDataFromP(wikiInfo, g_domParser.parseFromString(response, "text/html"), response, path, callback);
				return true;
			} else
			{
				//console.warn("Could not download page for "+path);
				callback(false, null); return false;
			}
		});
		return true;
	}
}

function GetScpInfoFromCache(wikiInfo, path, callback)
{
	const mPath = RemoveOffset(path);
	const name = wikiInfo.id+mPath;
	chrome.storage.local.get(name, function(savedInfo)
	{
		const v = savedInfo[name];
		if (v && v[SCP_INFO_LTRS.expires] > Date.now())
			callback(v);
		else
			callback(null);
	});
}
function GetScpInfoFromWeb(wikiInfo, path, callback)
{
	const mPath = RemoveOffset(path);
	const name = wikiInfo.id+mPath;
	ScrapePageData(wikiInfo, mPath, function(success, data)
	{
		if (success)
		{
			let info = {};
			info[name] = data;
			info[name][SCP_INFO_LTRS.expires] = Date.now() + CACHE_EXPIRES;
			chrome.storage.local.set(info); // Save the data
			callback(info[name]); // Use the data
		} else
			callback(null);
	});
}
// This either gets the values from cache or, if they are not cached, downloads the web page, scrapes the values and caches them
function GetScpInfo(wikiInfo, path, callback)
{
	GetScpInfoFromCache(wikiInfo, path, function(s)
	{
		if (s) callback(s, 0);
		else GetScpInfoFromWeb(wikiInfo, path, function(w)
		{
			callback(w, 1);
		});
	});
}

/*##########################################################\
|##################***********************##################|
|##################**FRONT-END FUNCTIONS**##################|
|##################***********************##################|
\##########################################################*/

// Returns the inputted number as a string with zeros added to the beginning to make it up to the right length
function AddZeros(num, len)
{
	let numL;
	if (num == 0) numL = 1;
	else numL = Math.floor(Math.log10(num)) + 1;
	if (numL > len || numL < 1 || !numL) return null;
	return "0".repeat(len - numL)+num;
}
function DaysSince(dateNum)
{
	return Math.floor((Date.now() - dateNum) / (1000 * 60 * 60 * 24));
}
function MakePrettyDate(lang, dateNum)
{
	const date = new Date(dateNum);
	return date.getDate()+" "+date.toLocaleString("en-US", {month:"short"})+" "+date.getFullYear()
		+", "+AddZeros(date.getHours(), 2)+":"+AddZeros(date.getMinutes(), 2)
		+" ("+DaysSince(dateNum)+LANG_TEXT[lang].daysAgo+")";
}

function AddPlus(num)
{
	if (num > 0) return "+"+num;
	else return String(num);
}

function MakeBy(lang, author)
{
	if (typeof(author) == "string") return LANG_TEXT[lang].by.replaceAll("%a", author);
	else return null;
}

function MakeAuthorLink(info)
{
	if (info[SCP_INFO_LTRS.authUser])
		return "<a href=\"http://www.wikidot.com/user:info/"+info[SCP_INFO_LTRS.authUser]+"\" target=\"_blank\">"+info[SCP_INFO_LTRS.authDisp]+"</a>";
	else if (info[SCP_INFO_LTRS.authDisp])
		return info[SCP_INFO_LTRS.authDisp];
	else return null;
}

function MakeTitleFromInfo(wikiInfo, lang, info, path, link)
{
	let title = "";
	if (info[SCP_INFO_LTRS.altTitle])
		title = info[SCP_INFO_LTRS.altTitle]+" ";
	else if (info[SCP_INFO_LTRS.title])
		title = info[SCP_INFO_LTRS.title]+" ";
	else if (path)
		title = path+" ";
	
	let by;
	if (link) by = MakeBy(lang, MakeAuthorLink(info));
	else by = MakeBy(lang, info[SCP_INFO_LTRS.authDisp]);
	if (by) title += "("+by+")"+" ";
		
	switch (wikiInfo.ratingFormat)
	{
		// Stars
		case 1:
			if (info[SCP_INFO_LTRS.rating] || typeof(info[SCP_INFO_LTRS.votes]) == "number")
			{
				title += "(";
				if (typeof(info[SCP_INFO_LTRS.votes]) == "number")
				{
					title += info[SCP_INFO_LTRS.votes];
					if (info[SCP_INFO_LTRS.rating])
						title += " ";
				}
				if (info[SCP_INFO_LTRS.rating])
				{
					title += "★".repeat(Math.round(info[SCP_INFO_LTRS.rating]));
					if (info[SCP_INFO_LTRS.rating] - Math.floor(info[SCP_INFO_LTRS.rating]) == 0.5)
						title += "☆".repeat(Math.floor(5 - info[SCP_INFO_LTRS.rating]));
					else
						title += "☆".repeat(Math.round(5 - info[SCP_INFO_LTRS.rating]));
				}
				title += ")";
			}
			break;
		
		// Normal
		case 0:
		default:
			if (info[SCP_INFO_LTRS.rating])
				title += "("+AddPlus(info[SCP_INFO_LTRS.rating])+")";
	}
	
	return title;
}

function CreateCss()
{
	let style = document.createElement("style");
	style.type = "text/css";
	
	style.innerHTML = "\
.srimRow{display:inline-block;width:100%;height:100%;}\
.srimRow .srimCell{display:inline-block;height:100%;vertical-align:middle;}\
.srimRow .srimCell.srimTitle{width:60%;}\
.srimRow .srimCell.srimAuthor{width:25%;font-style:italic;}\
.srimRow .srimCell.srimRating{width:15%;text-align:right;}\
.srimRow .srimCell.srimRating *{float:right;}\
.srimRow .srimCell.srimCellFull{width:100%}\
\
.srimStarRating *{margin:0 0.5ch;}\
.srimStarRating .srimVotes{font-weight:bold;}\
.srimRatingStarsCont{font-size:1.3em;position:relative;}\
.srimRatingStarsCont .srimRatingStarsFull{margin:0!important;position:absolute;left:0;overflow:hidden;}\
\
.srimLinkLoading{cursor:progress;}\
\
#tagged-pages-list{column-width:revert;}\
.pages-list-item .title{width:100%;}\
.content-panel.scp ul{padding:revert;}\
.content-panel.scp ul li{display:list-item;overflow:visible;}\
.content-panel.scp ul li::before{content:none;}";
	
	// The rating tiers
	for (let i = 0; i < RATING_TIERS.length; i++)
		style.innerHTML += ".srimRatingT"+i+"{"+RATING_TIERS[i].style+"}";
	
	document.getElementsByTagName("head")[0].appendChild(style);
}

function GetRatingTierClass(wikiInfo, rating)
{
	for (let i = 0; i < RATING_TIERS.length; i++)
		if (rating >= RATING_TIERS[i]["min"+wikiInfo.ratingLevel] &&	// The rating is above or equal to the minimum for this tier
			(i + 1 >= RATING_TIERS.length ||							// and this tier is either the highest tier, and therefore has no maximum
			rating < RATING_TIERS[i + 1]["min"+wikiInfo.ratingLevel])	// or the rating is below the maximum (the next tier's minimum)
		)
			return "srimRatingT"+i;
	return null;
}

// Checks if a link is valid for retrieving info from
function LinkValid(link, linkWikiInfo)
{
	if (linkWikiInfo && link.pathname &&
		linkWikiInfo == g_documentWikiInfo &&			// Not a link to another site (as this can be glitchy on some browsers)
		!link.pathname.match(/^\/system:page-tags/) &&	// Not a tag link
		RemoveOffset(link.pathname) != RemoveOffset(window.location.pathname) // Not the exact same page you are already on
	) return true;
	/*Else*/ return false;
}

function CreateRatingDisplay(wikiInfo, lang, link)
{
	const linkWikiInfo = GetWikiInfo(link.host);
	if (!LinkValid(link, linkWikiInfo)) return;
	
	let lineFirstNode = GetLineFirstNode(link);
	let lineNodesAmount = GetLineNodesAmount(lineFirstNode);
	if (GetLineLinksAmount(lineFirstNode, lineNodesAmount) > 1) return; // Make sure there is only 1 link in the line
	const lineHtml = GetLineHtml(lineFirstNode, lineNodesAmount);
	
	// Container row
	let cont = document.createElement("div");
	cont.classList.add("srimRow");
	// Title cell
	let titleElem = document.createElement("div");
	titleElem.classList.add("srimCell", "srimTitle");
	titleElem.innerHTML = lineHtml;
	cont.appendChild(titleElem);
	
	// Add it, delete the original nodes and check that there is enough space
	lineFirstNode.parentElement.insertBefore(cont, lineFirstNode);
	DeleteLine(lineFirstNode, lineNodesAmount);
	/*{
		const s = window.getComputedStyle(cont, null);
		const ratio = +s.width.substring(0, s.width.length - 2) / +s.height.substring(0, s.height.length - 2);
		// If the width of the ratio width:height is less than 8:1
		if (ratio < 8 || ratio == Infinity)
		{
			cont.outerHTML = lineHtml; // Put the stuff back
			return;
		}
	}*/
	
	// Else
	let loadingText = LANG_TEXT[lang].loading+"...";
	// Author cell
	let authorElem = document.createElement("div");
	authorElem.classList.add("srimCell", "srimAuthor");
	authorElem.innerHTML = MakeBy(lang, loadingText);
	cont.appendChild(authorElem);
	
	// Rating cell
	let ratingElem = document.createElement("div");
	const rLoadingClass = "srimRatingT1";
	ratingElem.classList.add("srimCell", "srimRating", rLoadingClass);
	ratingElem.innerHTML = loadingText;
	cont.appendChild(ratingElem);
	
	GetScpInfo(linkWikiInfo, link.pathname, function(info, dOrigin)
	{ // Success
		ratingElem.classList.remove(rLoadingClass);
		ratingElem.innerHTML = "";
		authorElem.innerHTML = "";
		if (info === null) return;
		
		// Rating
		switch (linkWikiInfo.ratingFormat)
		{
			// Stars
			case 1:
				if (typeof(info[SCP_INFO_LTRS.rating]) == "number" || typeof(info[SCP_INFO_LTRS.votes]) == "number")
				{
					ratingElem.classList.add("srimStarRating");
					
					{
						let starsEmpty = document.createElement("span");
						starsEmpty.classList.add("srimRatingStars", "srimRatingStarsCont");
						starsEmpty.innerHTML = "☆☆☆☆☆";
						
						let starsFull = document.createElement("span");
						starsFull.classList.add("srimRatingStars", "srimRatingStarsFull");
						starsFull.innerHTML = "★★★★★";
						if (info[SCP_INFO_LTRS.rating])
							starsFull.style.width = Math.round(info[SCP_INFO_LTRS.rating] * 20)+"%";
						else
							starsEmpty.style.visibility = "hidden";
						
						starsEmpty.appendChild(starsFull);
						ratingElem.appendChild(starsEmpty);
					}
					if (typeof(info[SCP_INFO_LTRS.votes]) == "number")
					{
						let votesElem = document.createElement("span");
						votesElem.classList.add("srimVotes");
						votesElem.innerHTML = info[SCP_INFO_LTRS.votes];
						ratingElem.appendChild(votesElem);
					}
				}
				break;
			
			// Normal
			case 0:
			default:
				if (typeof(info[SCP_INFO_LTRS.rating]) == "number")
				{
					ratingElem.classList.add(GetRatingTierClass(wikiInfo, info[SCP_INFO_LTRS.rating]));
					ratingElem.innerHTML = AddPlus(info[SCP_INFO_LTRS.rating]);
				}
		}
	
		// Author
		const by = MakeBy(lang, MakeAuthorLink(info));
		if (by)
			authorElem.innerHTML = by;
	});
}

/*#####################################################\
|##################******************##################|
|##################**MAIN EXECUTION**##################|
|##################******************##################|
\#####################################################*/

function sMain()
{
	g_domParser = new DOMParser();
	g_documentLang = document.documentElement.lang;
	if (!g_documentLang)
		g_documentLang = "en";
	
	{ // Checking the language text
		const langTexts = [ "by", "loading", "dateCreated", "daysAgo", "scpFoundation" ];
		for (let i = 0; i < langTexts.length; i++)
			if (!LANG_TEXT[g_documentLang][langTexts[i]]) console.error("'"+langTexts[i]+"' text for language '"+g_documentLang+" is missing.");
		
		if (!MakeBy(g_documentLang, "")) console.error("'by' text for language '"+g_documentLang+"' is missing replacement sequence.");
	}
	
	CreateCss();
	
	// The ratings and authors in the main lists
	if (g_settings.ratingsInMainList && IsFormMainList(g_documentWikiInfo, window.location.pathname))
	{
		const pageContent = document.getElementById("page-content");
		if (pageContent)
		{
			const links = pageContent.getElementsByTagName("a");
			for (let i = 0; i < links.length; i++)
				CreateRatingDisplay(g_documentWikiInfo, g_documentLang, links[i]);
		}
	}
	
	if (g_settings.tabTitle || g_settings.bottomAuth)
		GetScpInfo(g_documentWikiInfo, window.location.pathname, function(info, dOrigin)
		{
			if (info === null) return;
			
			// Put info in the browser title
			if (g_settings.tabTitle)
			{
				let title = MakeTitleFromInfo(g_documentWikiInfo, g_documentLang, info, window.location.pathname, 0);
				if (title)
				{
					title += " - "+LANG_TEXT[g_documentLang].scpFoundation;
					document.title = title;
				}
			}
			
			// Put author and creation date at the bottom
			const by = MakeBy(g_documentLang, MakeAuthorLink(info))
			if (g_settings.bottomAuth && (by || info[SCP_INFO_LTRS.dateCreated]))
			{
				const pageInfo = document.getElementById("page-info");
				if (pageInfo)
				{
					let text = "";
					if (by)
						text = by+", ";
					if (info[SCP_INFO_LTRS.dateCreated])
						text += LANG_TEXT[g_documentLang].dateCreated+": "+MakePrettyDate(g_documentLang, info[SCP_INFO_LTRS.dateCreated] * 1000);
					
					pageInfo.innerHTML = text+"<br>"+pageInfo.innerHTML;
				} else
					console.warn("Could not find page-info element");
			}
		});
	
	// Add the link hover info
	if (g_settings.tooltip)
	{
		let as = document.getElementsByTagName("a");
		for (let i = 0; i < as.length; i++)
		{
			const asi = as[i];
			let timer;
			const linkWikiInfo = GetWikiInfo(asi.host);
			if (!LinkValid(asi, linkWikiInfo) || asi.title) continue;
			
			// For only when the info is not cached, and we have to get it from the Web
			function linkMouseOut(event)
			{
				clearTimeout(timer);
			}
			function linkMouseOver(event)
			{
				timer = setTimeout(function()
				{
					asi.removeEventListener("mouseover", linkMouseOver);
					asi.removeEventListener("mouseout", linkMouseOut);
					
					asi.classList.add("srimLinkLoading");
					GetScpInfo(linkWikiInfo, asi.pathname, (info, dOrigin) =>
					{
						asi.classList.remove("srimLinkLoading");
						if (info === null) return;
						let title = MakeTitleFromInfo(linkWikiInfo, g_documentLang, info, asi.pathname, 0);
						if (title) asi.title = title;
					});
				}, 1000);
			}
			
			/*	We want to see if the link's into is cached, and if so, create the title immediately, but if not,
				add a timer on mouse hover and, when the timer is up, get the info from the Web and create the title */
			GetScpInfoFromCache(linkWikiInfo, asi.pathname, function(info)
			{
				if (info === null)
				{
					asi.addEventListener("mouseover", linkMouseOver);
					asi.addEventListener("mouseout", linkMouseOut);
				} else
				{
					let title = MakeTitleFromInfo(linkWikiInfo, g_documentLang, info, asi.pathname, 0);
					if (title) asi.title = title;
				}
			});
		}
	}
}

function main()
{
	g_documentWikiInfo = GetWikiInfo(window.location.host);
	if (!g_documentWikiInfo) return;
	const settingsKey = CACHE_PFXS.other+"settings";
	chrome.storage.local.get(settingsKey, function(data)
	{
		if (data[settingsKey]) g_settings = data[settingsKey];
		else
		{
			const settingsObj = {};
			settingsObj[settingsKey] = DEFAULT_SETTINGS;
			chrome.storage.local.set(settingsObj);
			g_settings = DEFAULT_SETTINGS;
		}
		sMain();
	});
}

main();
