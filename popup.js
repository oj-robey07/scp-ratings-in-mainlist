let g_cacheKeys, g_textEncoder, g_settingsKey;
let g_elemSForm, g_elemSFormInputs, g_elemBtnSaveSettings, g_elemSettingsSavedText;
let g_elemBtnDeleteCache, g_elemCacheText, g_elemCacheTextLoading, g_elemCachedNo, g_elemArticles, g_elemCacheMbNo;

function DisableSettingsForm()
{
	for (let i = 0; i < g_elemSFormInputs.length; i++)
		g_elemSFormInputs[i].disabled = true;
	g_elemBtnSaveSettings.disabled = true;
}
function EnableSettingsForm()
{
	for (let i = 0; i < g_elemSFormInputs.length; i++)
		g_elemSFormInputs[i].disabled = false;
	g_elemBtnSaveSettings.disabled = false;
}
function SaveSettings()
{
	DisableSettingsForm();
	let settings = {};
	settings[g_settingsKey] = {};
	for (let i = 0; i < g_elemSFormInputs.length; i++)
	{
		if (g_elemSFormInputs[i].type == "checkbox") // The only settings are checkboxes
			settings[g_settingsKey][g_elemSFormInputs[i].name] = g_elemSFormInputs[i].checked;
	}
	chrome.storage.local.set(settings, function()
	{
		g_elemSettingsSavedText.classList.remove("show");
		g_elemSettingsSavedText.offsetHeight; // Update the graphics
		g_elemSettingsSavedText.classList.add("show");
		EnableSettingsForm();
	});
}
function UpdateSettingsForm()
{
	DisableSettingsForm();
	chrome.storage.local.get(g_settingsKey, function(data)
	{
		let settings = data[g_settingsKey];
		if (!settings) settings = DEFAULT_SETTINGS;
		for (let i = 0; i < g_elemSFormInputs.length; i++)
			if (g_elemSFormInputs[i].type == "checkbox")
				g_elemSFormInputs[i].checked = settings[g_elemSFormInputs[i].name];
		EnableSettingsForm();
	});
}

function UpdateCacheDisplay()
{
	g_elemCacheText.hidden = true;
	g_elemCacheTextLoading.hidden = false;
	g_elemBtnDeleteCache.disabled = true;
	
	g_cacheKeys = null;
	chrome.storage.local.get(null, function(data)
	{
		let cacheContents = data;
		if (cacheContents[g_settingsKey])
			delete cacheContents[g_settingsKey];
		g_cacheKeys = Object.keys(cacheContents);
		
		g_elemCachedNo.innerHTML = String(g_cacheKeys.length);
		if (g_cacheKeys.length == 1) g_elemArticles.innerHTML = "";
		else g_elemArticles.innerHTML = "s";
		
		// chrome.storage.local.getBytesInUse doesn't work on Firefox
		g_elemCacheMbNo.innerHTML = String(Math.ceil(g_textEncoder.encode(JSON.stringify(cacheContents)).length / 10000) / 100);
		
		g_elemCacheText.hidden = false;
		g_elemCacheTextLoading.hidden = true;
		g_elemBtnDeleteCache.disabled = false;
	});
}
function ConfirmDeleteCache()
{
	if (g_cacheKeys && window.confirm("Are you sure you want to delete all the cached data of this extension?"))
	{
		chrome.storage.local.remove(g_cacheKeys, UpdateCacheDisplay);
	}
}

function main()
{
	g_settingsKey = CACHE_PFXS.other+"settings";
	g_textEncoder = new TextEncoder();
	
	g_elemSForm = document.getElementById("srimSettings");
	g_elemSFormInputs = g_elemSForm.getElementsByTagName("input");
	g_elemBtnSaveSettings = document.getElementById("saveSettings");
	g_elemSettingsSavedText = document.getElementById("settingsSavedText");
	g_elemBtnDeleteCache = document.getElementById("deleteCache");
	g_elemCacheText = document.getElementById("cacheText");
	g_elemCacheTextLoading = document.getElementById("cacheTextLoading");
	g_elemCachedNo = document.getElementById("cachedNo");
	g_elemArticles = document.getElementById("articles");
	g_elemCacheMbNo = document.getElementById("cacheMbNo");
	
	g_elemBtnSaveSettings.addEventListener("click", SaveSettings);
	g_elemBtnDeleteCache.addEventListener("click", ConfirmDeleteCache);
	
	UpdateSettingsForm();
	UpdateCacheDisplay();
}
main();