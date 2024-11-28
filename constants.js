const WIKI_INFO = [

/****************************\
|**SCP FOUNDATION DATABASES**|
\****************************/

{ // English
	// The hosts that this wiki is on (The first will be used for requests)
	"hosts": [ "scp-wiki.wikidot.com", "scpwiki.com", "scp-wiki.net", "scp-wiki.com" ],
	
	// The protocol that this wiki uses
	"protocol": "https",
	
	// The ID will be used for caching (WARNING: changing these will invalidate cache!)
	"id": "en",
	
	// 0 for normal (plus and minus), 1 for stars
	"ratingFormat": 0,
	
	"ratingLevel": 1,
	
	/*	The equivalent tags for joke SCPs, explained SCPs, etc (hereafter called 'types')
		
		(Be aware that you can define any tag you want. It is a loose system. This is
		 just a rough guide.)
		scp:	SCP umbrella tag
			arc:	Archived SCPs (-ARC)
			v:		Deleted SCPs (often overlaps with 'arc') (-V/-DEL/-T/-VO)
			d:		Decommissioned SCPs (-D)
			j:		Joke SCPs (-J)
			ex:		Explained SCPs (-EX)
			p001:	SCP-001 proposals
			[none]:	Mainlist SCPs (normal SCPs) */
	"typeTags": { "scp":"scp", "arc":"archived", "j":"joke", "ex":"explained", "p001":"001-proposal" },
	
	// The tags that specify the original language of the SCP
	"langTags": {
		"int":"_int", "en":"_en", "ru":"_ru", "ko":"_ko", "cn":"_cn", "fr":"_fr", "pl":"_pl", "es":"_es", "th":"_th",
		"jp":"_jp", "de":"_de", "it":"_it", "ua":"_ua", "pt":"_pt", "cs":"_cs", "zh":"_zh", "vn":"_vn"
	},
	
	// It will use this if it can't find a language tag for an article
	"defaultLang": "en",
	
	/*	The paths of the pages that list the SCPs, and most importantly their alternate titles. If a path
		is not found in here, the 'default' will be used instead.
		The pages listed here are also used as the pages that will have ratings and author names put on them.
		
		If the listing goes over multiple pages, you must list the path as a "series" object, with these properties:
		path:			The base of the path (this can optionally have '%r' to specify where in the string the 'replace'
						property will be used [this defaults to at the end of the string]).
		replace:		(optional) The sequence of characters which will be used to replace the '%r' in 'path'. This can
						have these replacement sequences: %a, for the Arabic numeral page number; and %r, for the Roman
						numeral page number.
						This defaults to "-%n".
		seriesAmount:	(optional) The amount of SCPs listed on each page. This defaults to 1000.
		start:			(optional) The number that the listing starts from (the number of the first SCP). This defaults to 0.
		omitOne:		(optional) Whether to omit the page number for page 1 or not. This defaults to true. */
	"mainLists": {
		"default": { "default":"/scp-international" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // International Hub
	"hosts": [ "scp-int.wikidot.com" ],
	"protocol": "http",
	"id": "xa",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archived", "j":"joke", "ex":"explained", "p001":"001-proposal" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "default",
	"mainLists": {
		"default": { "default":"/other-hub" },
		"int": { "default":"/int-hub", "p001":"/scp-001-int" },
		"en": { "default":"/unofficial:language-incubator-hub" },
		"ru": { "default":"/ru-hub", "p001":"/scp-001-ru" },
		"ko": { "default":"/ko-hub", "p001":"/scp-001-ko" },
		"cn": { "default":"/cn-hub", "p001":"/scp-cn-001" },
		"fr": { "default":"/fr-hub", "p001":"/scp-001-fr" },
		"pl": { "default":"/pl-hub", "p001":"/scp-pl-001" },
		"es": { "default":"/es-hub", "p001":"/scp-es-001" },
		"th": { "default":"/th-hub", "p001":"/scp-001-th" },
		"jp": { "default":"/jp-hub", "p001":"/scp-001-jp" },
		"de": { "default":"/de-hub", "p001":"/scp-001-de" },
		"it": { "default":"/it-hub", "p001":"/scp-001-it" },
		"ua": { "default":"/ua-hub", "p001":"/scp-001-ua" },
		"pt": { "default":"/pt-hub", "p001":"/scp-001-pt" },
		"cs": { "default":"/cs-hub", "p001":"/scp-001-cs" },
		"zh": { "default":"/zh-hub", "p001":"/scp-zh-001" },
		"vn": { "default":"/vn-hub", "p001":"/scp-001-vn" }
	}
},
{ // Russian
	"hosts": [ "scpfoundation.net", "scpfoundation.ru", "scp-ru.wikidot.com" ],
	"protocol": "https",
	"id": "ru",
	
	"ratingFormat": 1,
	"typeTags": { "scp":"объект", "arc":"архив", "j":"шуточный", "ex":"обоснованный", "p001":"001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "ru",
	"mainLists": {
		"default": { "default":"/scp-list-others", "arc":"/archived-scps" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "scp":"/scp-list-ru", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "default":"/scp-list-fr", "arc":"/archived-scps", "p001":"/scp-001-fr" },
		"pl": { "default":"/scp-list-pl", "arc":"/archived-scps", "p001":"/scp-pl-001" },
		"es": { "default":"/scp-list-es", "arc":"/archived-scps", "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "default":"/scp-list-jp", "arc":"/archived-scps", "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "default":"/scp-list-ua", "arc":"/archived-scps", "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/ ]
	}
},
{ // Korean
	"hosts": [ "scpko.wikidot.com", "ko.scp-wiki.net" ],
	"protocol": "http",
	"id": "ko",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"보존", "v":"삭제", "j":"농담", "ex":"해명", "p001":"001-제안" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "default",
	"mainLists": {
		"default": { "default": "/other-hub", "v":"/deleted-scps" },
		"int": { "scp":{"path":"/scp-series-int" },									"j":"/joke-scps-int",							"p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"},			"arc":"/archived-scps",		"j":"/joke-scps",			"ex":"/scp-ex",		"p001":"/scp-001" },
		"ru": { "scp":{"path":"/scp-series-ru","start":1000}, "arc":"/archived-scps-ru", "j":"/joke-scps-ru",	"ex":"/scp-ru-ex",	"p001":"/scp-001-ru" },
		"ko": { "scp":{"path":"/scp-series-ko"},		"arc":"/archived-scps-ko",	"j":"/joke-scps-ko",		"ex":"/scp-ko-ex",	"p001":"/scp-001-ko" },
		"cn": { "scp":{"path":"/scp-series-cn"},									"j":"/joke-scps-cn",		"ex":"/scp-ex-cn",	"p001":"/scp-cn-001" },
		"fr": { "scp":{"path":"/liste-fr"},				"arc":"/archived-scps-fr",	"j":"/scps-humoristiques-francais", "ex":"/scp-fr-ex", "p001":"/scp-001-fr" },
		"pl": { "scp":{"path":"/lista-pl"},				"arc":"/archived-scps-pl",	"j":"/joke-scps-pl",							"p001":"/scp-pl-001" },
		"es": { "scp":{"path":"/serie-scp-es"},			"arc":"/archived-scps-es",	"j":"/joke-scps-es",		"ex":"/scp-es-ex",	"p001":"/scp-es-001" },
		"th": { "scp":{"path":"/scp-series-th"},		"arc":"/archived-and-decommissioned-scps-th", "j":"/joke-scps-th", "ex":"/scp-th-ex", "p001":"/scp-001-th" },
		"jp": { "scp":{"path":"/scp-series-jp"},		"arc":"/archived-scps-jp",	"j":"/joke-scps-jp",		"ex":"/scp-jp-ex",	"p001":"/scp-001-jp" },
		"de": { "scp":{"path":"/scp-serie-de"},			"arc":"/archived-scps-de",	"j":"/joke-scps-de",		"ex":"/scp-de-ex",	"p001":"/scp-001-de" },
		"it": { "scp":{"path":"/scp-it-serie","replace":"-%r","omitOne":false}, "arc":"/archived-scps-it", "j":"/joke-scps-it", "p001":"/scp-001-it" },
		"ua": { "scp":{"path":"/scp-series-ua"},		"arc":"/archived-scps-ua",	"j":"/joke-scps-ua",							"p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/series%r-pt","seriesAmount":100,"omitOne":false}, "arc":"/archived-scps-pt", "j":"/joke-scps-pt", "ex":"/scp-ex-pt", "p001":"/scp-001-pt" },
		"cs": { "scp":{"path":"/scp-series-cs"},		"arc":"/archived-scps-cs",	"j":"/joke-scps-cs",							"p001":"/scp-001-cs" },
		"zh": { "scp":{"path":"/scp-series-zh"},									"j":"/joke-scps-zh",		"ex":"/scp-ex-zh",	"p001":"/scp-zh-001" },
		"vn": { "scp":{"path":"/scp-series-vn"},									"j":"/joke-scps-vn",							"p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition", "/scp-ko-series-tales-edition", /^\/scp-series-jp-\d+-tales-edition$/, "/serie-scp-fr-edition-des-contes" ]
	}
},
{ // Simplified Chinese
	"hosts": [ "scp-wiki-cn.wikidot.com" ],
	"protocol": "http",
	"id": "cn",
	
	"ratingFormat": 0,
	"ratingLevel": 1,
	"typeTags": { "scp":"scp", "arc":"被归档", "j":"搞笑", "ex":"已解明", "p001":"001提案" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"原创", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/scp-international" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		// There are no Chinese archived SCPs, and therefore no page for them
		"cn": { "scp":{"path":"/scp-series-cn"}, "j":"/joke-scps-cn", "ex":"/scp-ex-cn", "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition", /^\/scp-series-cn-1-tales-edition$/, "/explained-and-joke-cn-scps-tales-edition",
			/^\/wanderers:wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/wanderers:hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ]
	}
},
{ // French
	"hosts": [ "fondationscp.wikidot.com" ],
	"protocol": "http",
	"id": "fr",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archivé", "j":"humour", "ex":"expliqué", "p001":"proposition-001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "default",
	"mainLists": {
		"default": { "default":"/scp-series-hub", "arc":"/archived-scps" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "scp":"/liste-fr", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition", "/serie-scp-fr-edition-des-contes",
			/^\/vagabonds:wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/vagabonds:hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ]
	}
},
{ // Polish
	"hosts": [ "scp-pl.wikidot.com", "scp-wiki.net.pl" ],
	"protocol": "http",
	"id": "pl",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"zarchiwizowane", "j":"joke", "ex":"zrozumiane", "p001":"propozycja-001" },
	"langTags": { "pl":"oryginał" },
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/scp-international" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "scp":"/lista-pl", "arc":"/archived-scps-pl", "j":"/joke-scps-pl", "ex":"/scp-ex-pl", "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Spanish
	"hosts": [ "lafundacionscp.wikidot.com", "scp-es.com" ],
	"protocol": "http",
	"id": "es",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archivado", "v":"vo", "j":"humorístico", "ex":"explicado", "p001":"propuesta-001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "arc":"/scps-archivados", "v":"/scps-vos", "j":"/joke-scps", "ex":"/scp-ex" },
		"int": { "scp":"/serie-scp-int", "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "p001":"/scp-001" },
		"ru": { "scp":{"path":"/serie-scp-ru","start":1000}, "p001":"/scp-001-ru" },
		"ko": { "scp":{"path":"/serie-scp-ko"}, "p001":"/scp-001-ko" },
		"cn": { "scp":{"path":"/serie-scp-cn"}, "p001":"/scp-cn-001" },
		"fr": { "scp":{"path":"/serie-scp-fr"}, "p001":"/scp-001-fr" },
		"pl": { "scp":{"path":"/serie-scp-pl"}, "p001":"/scp-pl-001" },
		"es": { "scp":{"path":"/serie-scp-es","seriesAmount":100}, "p001":"/scp-es-001" },
		"th": { "scp":{"path":"/serie-scp-th"}, "p001":"/scp-001-th" },
		"jp": { "scp":{"path":"/scp-series-jp"}, "p001":"/scp-001-jp" },
		"de": { "scp":{"path":"/serie-scp-de"}, "p001":"/scp-001-de" },
		"it": { "scp":{"path":"/serie-scp-it"}, "p001":"/scp-001-it" },
		"ua": { "scp":{"path":"/serie-scp-ua"}, "p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/serie-scp-pt"}, "p001":"/scp-001-pt" },
		"cs": { "scp":{"path":"/serie-scp-cz"}, "p001":"/scp-001-cs" },
		"zh": { "scp":{"path":"/serie-scp-zh"}, "p001":"/scp-zh-001" },
		"vn": { "scp":{"path":"/serie-scp-vn"}, "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Thai
	/*	This wiki has the same problem as the Vietnamese wiki, so it won't retrieve alt-titles from original Thai SCPs
		Also, a large number of this wiki's articles are completely without tags for some reason */
	"hosts": [ "scp-th.wikidot.com" ],
	"protocol": "http",
	"id": "th",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"arc", "j":"joke", "ex":"explained", "p001":"001-proposal" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/other-hub", "v":"/deleted-scps" },
		"int": { "scp":{"path":"/scp-series-int" },									"j":"/joke-scps-int",							"p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"},			"arc":"/archived-scps",		"j":"/joke-scps",			"ex":"/scp-ex",		"p001":"/scp-001" },
		"ru": { "scp":{"path":"/scp-series-ru","start":1000}, "arc":"/archived-scps-ru", "j":"/joke-scps-ru",	"ex":"/scp-ru-ex",	"p001":"/scp-001-ru" },
		"ko": { "scp":{"path":"/scp-series-ko"},		"arc":"/archived-scps-ko",	"j":"/joke-scps-ko",		"ex":"/scp-ko-ex",	"p001":"/scp-001-ko" },
		"cn": { "scp":{"path":"/scp-series-cn"},									"j":"/joke-scps-cn",		"ex":"/scp-ex-cn",	"p001":"/scp-cn-001" },
		"fr": { "scp":{"path":"/liste-fr"},				"arc":"/archived-scps-fr",	"j":"/scps-humoristiques-francais", "ex":"/scp-fr-ex", "p001":"/scp-001-fr" },
		"pl": { "scp":{"path":"/lista-pl"},				"arc":"/archived-scps-pl",	"j":"/joke-scps-pl",							"p001":"/scp-pl-001" },
		"es": { "scp":{"path":"/serie-scp-es"},			"arc":"/archived-scps-es",	"j":"/joke-scps-es",		"ex":"/scp-es-ex",	"p001":"/scp-es-001" },
		"th": { "scp":"/scp-series-th",					"arc":"/archived-and-decommissioned-scps-th", "j":"/joke-scps-th", "ex":"/scp-th-ex", "p001":"/scp-001-th" },
		"jp": { "scp":{"path":"/scp-series-jp"},		"arc":"/archived-scps-jp",	"j":"/joke-scps-jp",		"ex":"/scp-jp-ex",	"p001":"/scp-001-jp" },
		"de": { "scp":{"path":"/scp-serie-de"},			"arc":"/archived-scps-de",	"j":"/joke-scps-de",		"ex":"/scp-de-ex",	"p001":"/scp-001-de" },
		"it": { "scp":{"path":"/scp-it-serie","replace":"-%r","omitOne":false}, "arc":"/archived-scps-it", "j":"/joke-scps-it", "p001":"/scp-001-it" },
		"ua": { "scp":{"path":"/scp-series-ua"},		"arc":"/archived-scps-ua",	"j":"/joke-scps-ua",							"p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/series%r-pt","seriesAmount":100,"omitOne":false}, "arc":"/archived-scps-pt", "j":"/joke-scps-pt", "ex":"/scp-ex-pt", "p001":"/scp-001-pt" },
		"cs": { "scp":{"path":"/scp-series-cs"},		"arc":"/archived-scps-cs",	"j":"/joke-scps-cs",							"p001":"/scp-001-cs" },
		"zh": { "scp":{"path":"/scp-series-zh"},									"j":"/joke-scps-zh",		"ex":"/scp-ex-zh",	"p001":"/scp-zh-001" },
		"vn": { "scp":{"path":"/scp-series-vn"},									"j":"/joke-scps-vn",							"p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Japanese
	"hosts": [ "scp-jp.wikidot.com", "ja.scp-wiki.net" ],
	"protocol": "http",
	"id": "jp",
	
	"ratingFormat": 0,
	"ratingLevel": 1,
	"typeTags": { "scp":"scp", "arc":"アーカイブ済み", "j":"ジョーク", "ex":"explained", "p001":"001提言" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "default",
	"mainLists": {
		"default": { "scp":"/scp-series-unofficial",	"arc":"/archived-scps-unofficial", "j":"/joke-scp-series-unofficial", "ex":"/explained-scp-series-unofficial" },
		"en": { "scp":{"path":"/scp-series"},			"arc":"/archived-scps",		"j":"/joke-scps",			"ex":"/scp-ex",		"p001":"/scp-001" },
		"ru": { "scp":{"path":"/scp-series-ru","start":1000}, "arc":"/deleted-scp-ru", "j":"/joke-scps-ru",		"ex":"/scp-ru-ex",	"p001":"/scp-001-ru" },
		"ko": { "scp":{"path":"/series-scp-ko"},		"arc":"/archived-scps-ko",	"j":"/joke-scps-ko",		"ex":"/scp-ko-ex",	"p001":"/scp-001-ko" },
		"cn": { "scp":{"path":"/scp-series-cn"},		"arc":"/archived-scps-cn",	"j":"/joke-scps-cn",		"ex":"/scp-ex-cn",	"p001":"/scp-cn-001" },
		"fr": { "scp":{"path":"/liste-fr"},				"arc":"/archived-scps-fr",	"j":"/joke-scps-fr",		"ex":"/scp-fr-ex",	"p001":"/scp-001-fr" },
		"pl": { "scp":{"path":"/lista-pl"},				"arc":"/archived-scps-pl",	"j":"/joke-scps-pl",		"ex":"/scp-pl-ex",	"p001":"/scp-pl-001" },
		"es": { "scp":{"path":"/serie-scp-es"},			"arc":"/archived-scps-es",	"j":"/joke-scps-es",		"ex":"/scp-es-ex",	"p001":"/scp-es-001" },
		"th": { "scp":{"path":"/scp-series-th"},		"arc":"/archived-scps-th",	"j":"/joke-scps-th",		"ex":"/scp-th-ex",	"p001":"/scp-001-th" },
		"jp": { "scp":{"path":"/scp-series-jp"},		"arc":"/archived-scps-jp",	"j":"/joke-scps-jp",		"ex":"/scp-jp-ex",	"p001":"/scp-001-jp" },
		"de": { "scp":{"path":"/scp-serie-de"},			"arc":"/archived-scps-de",	"j":"/joke-scps-de",		"ex":"/scp-de-ex",	"p001":"/scp-001-de" },
		"it": { "scp":{"path":"/scp-it-serie","replace":"-%r","omitOne":false}, "arc":"/scp-it-e-racconti-archiviati", "j":"/joke-scps-it", "ex":"/scp-it-ex", "p001":"/scp-001-it" },
		"ua": { "scp":{"path":"/scp-series-ua"},		"arc":"/archived-scps-ua",	"j":"/joke-scps-ua",		"ex":"/scp-ua-ex",	"p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/series%r-pt","seriesAmount":100,"omitOne":false}, "arc":"/archived-scps-pt", "j":"/joke-scps-pt", "ex":"/scp-pt-ex", "p001":"/scp-001-pt" },
		"cs": { "scp":{"path":"/scp-series-cs"}/*,		"arc":"/archived-scps-cs",	"j":"/joke-scps-cs",							"p001":"/scp-001-cs" */},
		"zh": { "scp":{"path":"/scp-series-zh"},									"j":"/joke-scps-zh",		"ex":"/scp-zh-ex",	"p001":"/scp-zh-001" },
		"vn": { "scp":{"path":"/scp-series-vn"}/*,									"j":"/joke-scps-vn",							"p001":"/scp-001-vn" */},
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition", /^\/scp-series-jp-\d+-tales-edition$/ ]
	}
},
{ // German
	"hosts": [ "scp-wiki-de.wikidot.com" ],
	"protocol": "http",
	"id": "de",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archiviert", "j":"witz", "ex":"erklärt", "p001":"001-vorschlag" },
	"langTags": {
		"int":"international", "en":"en", "ru":"russisch", "ko":"koreanisch", "cn":"chinesisch", "fr":"französisch", "pl":"polnisch", "es":"spanisch", "th":"thailändisch",
		"jp":"japanisch", "de":"deutsch", "it":"italienisch", "ua":"ukrainisch", "pt":"portugiesisch", "cs":"tschechisch", "zh":"traditionelles-chinesisch", "vn":"vietnamesisch"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/scp-international" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "scp":"/scp-serie-de", "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition", "/scp-de-geschichten" ]
	}
},
{ // Italian
	"hosts": [ "fondazionescp.wikidot.com" ],
	"protocol": "http",
	"id": "it",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archiviato", "j":"scherzo", "ex":"risolto", "p001":"proposta-001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "default",
	"mainLists": {
		"default": { "default":"/hub-internazionale" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		// They have not written any explained SCPs yet
		"it": { "scp":{"path":"/scp-it-serie","replace":"-%r","omitOne":false}, "arc":"/scp-it-e-racconti-archiviati", "j":"/scp-it-scherzo", "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	},
},
{ // Ukrainian
	"hosts": [ "scp-ukrainian.wikidot.com" ],
	"protocol": "http",
	"id": "ua",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "hub":"перелік_об'єктів", "scp":"об'єкт", "arc":"архів", "j":"гумор", "ex":"обґрунтований", "p001":"001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "arc":"/archive", "j":"/scp-list-j", "ex":"/scp-ex" },
		"int": { "scp":{"path":"/scp-series-int"}, "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "p001":"/scp-001" },
		"ru": { "scp":{"path":"/scp-series-ru","start":1000}, "p001":"/scp-001-ru" },
		"ko": { "scp":{"path":"/scp-series-ko"}, "p001":"/scp-001-ko" },
		"cn": { "scp":{"path":"/scp-series-cn"}, "p001":"/scp-cn-001" },
		"fr": { "scp":{"path":"/liste-fr"}, "p001":"/scp-001-fr" },
		"pl": { "scp":{"path":"/lista-pl"}, "p001":"/scp-pl-001" },
		"es": { "scp":{"path":"/serie-scp-es"}, "p001":"/scp-es-001" },
		"th": { "scp":{"path":"/scp-series-th"}, "p001":"/scp-001-th" },
		"jp": { "scp":{"path":"/scp-series-jp"}, "p001":"/scp-001-jp" },
		"de": { "scp":{"path":"/scp-serie-de"}, "p001":"/scp-001-de" },
		"it": { "scp":{"path":"/scp-it-serie","replace":"-%r","omitOne":false}, "p001":"/scp-001-it" },
		"ua": { "scp":{"path":"/scp-series-ua"}, "p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/series%r-pt","seriesAmount":100,"omitOne":false}, "p001":"/scp-001-pt" },
		"cs": { "scp":{"path":"/scp-series-cs"}, "p001":"/scp-001-cs" },
		"zh": { "scp":{"path":"/scp-series-zh"}, "p001":"/scp-zh-001" },
		"vn": { "scp":{"path":"/scp-series-vn"}, "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Portugese
	"hosts": [ "scp-pt-br.wikidot.com" ],
	"protocol": "http",
	"id": "pt",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"arquivado", "j":"piada", "ex":"explicado", "p001":"proposta-001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/scp-series-int", "arc":"/archived-scps" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "scp":{"path":"/series%r-pt","seriesAmount":100,"omitOne":false}, "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Czechslovakian
	"hosts": [ "scp-cs.wikidot.com" ],
	"protocol": "http",
	"id": "cs",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"archivované", "j":"joke", "ex":"explained", "p001":"001-návrh" },
	"langTags": {
		/*"int":"int", "en":"en", */"ru":"ruské",/* "ko":"ko", "cn":"cn", "fr":"fr", */"pl":"polské", "es":"španělské",/* "th":"th",
		*/"jp":"japonské", "de":"německé",/* "it":"it", "ua":"ua", */"pt":"portugalské", "cs":"české",/* "zh":"zh", "vn":"vn",
		*/"sk":"slovenské"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "scp":"/scp-series-int", "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "scp":"/scp-series-cs", "p001":"/scp-001-cs" },
		"zh": { "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"sk": { "scp":"/scp-series-sk", "p001":"/scp-001-sk" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Traditional Chinese
	"hosts": [ "scp-zh-tr.wikidot.com" ],
	"protocol": "http",
	"id": "zh",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"已歸檔", "j":"搞笑", "ex":"已解明", "p001":"001提案" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"原創", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "scp":"/scp-international", "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex" },
		"int": { "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "p001":"/scp-001" },
		"ru": { "p001":"/scp-001-ru" },
		"ko": { "p001":"/scp-001-ko" },
		"cn": { "p001":"/scp-cn-001" },
		"fr": { "p001":"/scp-001-fr" },
		"pl": { "p001":"/scp-pl-001" },
		"es": { "p001":"/scp-es-001" },
		"th": { "p001":"/scp-001-th" },
		"jp": { "scp":"/scp-series-jp", "p001":"/scp-001-jp" },
		"de": { "p001":"/scp-001-de" },
		"it": { "p001":"/scp-001-it" },
		"ua": { "p001":"/scp-001-ua" },
		"pt": { "p001":"/scp-001-pt" },
		"cs": { "p001":"/scp-001-cs" },
		"zh": { "scp":"/scp-series-zh", "p001":"/scp-zh-001" },
		"vn": { "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},
{ // Vietnamese
	// Because of the way this wiki is designed compared to this system, it will not retrieve alt-titles from original Vietnamese SCPs
	"hosts": [ "scp-vn.wikidot.com" ],
	"protocol": "http",
	"id": "vn",
	
	"ratingFormat": 0,
	"ratingLevel": 2,
	"typeTags": { "scp":"scp", "arc":"lưu-trữ", "j":"hài", "ex":"đã-giải-thích", "p001":"đề-xuất-001" },
	"langTags": {
		"int":"int", "en":"en", "ru":"ru", "ko":"ko", "cn":"cn", "fr":"fr", "pl":"pl", "es":"es", "th":"th",
		"jp":"jp", "de":"de", "it":"it", "ua":"ua", "pt":"pt", "cs":"cs", "zh":"zh", "vn":"vn"
	},
	
	"defaultLang": "en",
	"mainLists": {
		"default": { "default":"/other-hub" },
		"int": { "default":"/int-hub", "p001":"/scp-001-int" },
		"en": { "scp":{"path":"/scp-series"}, "arc":"/archived-scps", "j":"/joke-scps", "ex":"/scp-ex", "p001":"/scp-001" },
		"ru": { "default":"/ru-hub", "p001":"/scp-001-ru" },
		"ko": { "default":"/ko-hub", "p001":"/scp-001-ko" },
		"cn": { "default":"/cn-hub", "p001":"/scp-cn-001" },
		"fr": { "default":"/fr-hub", "p001":"/scp-001-fr" },
		"pl": { "default":"/pl-hub", "p001":"/scp-pl-001" },
		"es": { "default":"/es-hub", "p001":"/scp-es-001" },
		"th": { "default":"/th-hub", "p001":"/scp-001-th" },
		"jp": { "default":"/jp-hub", "p001":"/scp-001-jp" },
		"de": { "default":"/de-hub", "p001":"/scp-001-de" },
		"it": { "default":"/it-hub", "p001":"/scp-001-it" },
		"ua": { "default":"/ua-hub", "p001":"/scp-001-ua" },
		"pt": { "default":"/pt-hub", "p001":"/scp-001-pt" },
		"cs": { "default":"/cs-hub", "p001":"/scp-001-cs" },
		"zh": { "default":"/zh-hub", "p001":"/scp-zh-001" },
		"vn": { "scp":"/scp-series-vn", "arc":"/archived-scps-vn", "j":"/joke-scps-vn", "ex":"/scp-ex-vn", "p001":"/scp-001-vn" },
		"extras": [ /^\/scp-series-\d+-tales-edition$/, "/explained-scps-tales-edition", "/joke-scps-tales-edition" ]
	}
},

/************************\
|**WANDERER'S LIBRARIES**|
\************************/

{ // English
	"hosts": [ "wanderers-library.wikidot.com" ],
	"protocol": "https",
	"id": "xb",
	"ratingFormat": 0,
	"ratingLevel": 2,
	"mainLists": { "extras": [ /^\/wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ] }
},
{ // Korean
	"hosts": [ "wanderers-library-ko.wikidot.com" ],
	"protocol": "http",
	"id": "xc",
	"ratingFormat": 0,
	"ratingLevel": 2,
	"mainLists": { "extras": [ /^\/wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ] }
},
{ // Polish
	"hosts": [ "wanderers-library-pl.wikidot.com" ],
	"protocol": "http",
	"id": "xd",
	"ratingFormat": 0,
	"ratingLevel": 2,
	"mainLists": { "extras": [ /^\/wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ] }
},
{ // Japanese
	"hosts": [ "wanderers-library-jp.wikidot.com" ],
	"protocol": "http",
	"id": "xe",
	"ratingFormat": 0,
	"ratingLevel": 2,
	"mainLists": { "extras": [ /^\/wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ] }
},
{ // Czechslovakian
	"hosts": [ "wanderers-library-cs.wikidot.com" ],
	"protocol": "http",
	"id": "xf",
	"ratingFormat": 0,
	"ratingLevel": 2,
	"mainLists": { "extras": [ /^\/wing-(one|two|three|four|five|six|seven|eight|nine|ten)$/, /^\/hall-(one|two|three|four|five|six|seven|eight|nine|ten)$/ ] }
}
];

const LANG_TEXT = {
"en": {
	"by": "by %a",
	"loading": "Loading",
	"dateCreated": "Created",
	"daysAgo": " days ago",
	"scpFoundation": "SCP Foundation"
},
"ru": {
	"by": "%a",
	"loading": "Загрузка",
	"dateCreated": "Создано",
	"daysAgo": " дня назад",
	"scpFoundation": "SCP Foundation"
},
"ko": {
	"by": "%a",
	"loading": "로드 중",
	"dateCreated": "생성 날짜",
	"daysAgo": " 일전",
	"scpFoundation": "SCP 재단"
},
"cn": {
	"by": "作者: %a",
	"loading": "加载中",
	"dateCreated": "创建日期",
	"daysAgo": "日前",
	"scpFoundation": "SCP基金会"
},
"fr": {
	"by": "par %a",
	"loading": "Chargement",
	"dateCreated": "Créé",
	"daysAgo": " jours avant",
	"scpFoundation": "Fondation SCP"
},
"pl": {
	"by": "przez %a",
	"loading": "Ładowanie",
	"dateCreated": "Utworzony",
	"daysAgo": " dni temu",
	"scpFoundation": "Fundacja SCP"
},
"es": {
	"by": "por %a",
	"loading": "Cargando",
	"dateCreated": "Creada",
	"daysAgo": " días antes",
	"scpFoundation": "La Fundación SCP"
},
"th": {
	"by": "โดย %a",
	"loading": "กำลังโหลด",
	"dateCreated": "สร้าง",
	"daysAgo": " วันผ่านไปแล้ว",
	"scpFoundation": "สถาบัน SCP"
},
"ja-corrections": {
	"by": "%a著",
	"loading": "読み込み中",
	"dateCreated": "作成日",
	"daysAgo": "日前",
	"scpFoundation": "SCP財団"
},
"de": {
	"by": "von %a",
	"loading": "Wird geladen",
	"dateCreated": "Erstellt",
	"daysAgo": " Tage vor",
	"scpFoundation": "SCP Foundation"
},
"it": {
	"by": "di %a",
	"loading": "Caricamento",
	"dateCreated": "Creata",
	"daysAgo": " giorni fa",
	"scpFoundation": "Fondazione SCP"
},
"uk": {
	"by": "%a",
	"loading": "Завантаження",
	"dateCreated": "Створено",
	"daysAgo": " днів тому",
	"scpFoundation": "SCP Foundation"
},
"pt-br": {
	"by": "por %a",
	"loading": "Carregando",
	"dateCreated": "Criada",
	"daysAgo": " dias atrás",
	"scpFoundation": "Fundação SCP"
},
"cs": {
	"by": "od %a",
	"loading": "Načítání",
	"dateCreated": "Vytvořeno",
	"daysAgo": " dní zpátky",
	"scpFoundation": "SCP Nadace"
},
"zh": {
	"by": "作者: %a",
	"loading": "加載中",
	"dateCreated": "創建日期",
	"daysAgo": "日前",
	"scpFoundation": "SCP基金會"
},
"vi": {
	"by": "bởi %a",
	"loading": "Đang tải",
	"dateCreated": "Được tạo",
	"daysAgo": " ngày trước",
	"scpFoundation": "Tổ Chức SCP"
}
};

const RATING_TIERS = [
{
	"min1": 0,
	"min2": 0,
	"style": ""
},{
	"min1": 100,
	"min2": 15,
	"style": "font-weight:bold;"
},{
	"min1": 400,
	"min2": 60,
	"style": "font-weight:bold;color:blue;"
},{
	"min1": 600,
	"min2": 90,
	"style": "font-weight:bold;color:green;"
},{
	"min1": 1000,
	"min2": 150,
	"style": "font-weight:bold;color:yellow;"
}
];

// How long, in milliseconds, the cache is valid for (default three months)
const CACHE_EXPIRES = 1000 * 60 * 60 * 24 * 90;
const DEFAULT_SETTINGS = {"ratingsInMainList":true,"tabTitle":true,"bottomAuth":true,"tooltip":true};
const SCP_INFO_LTRS = {"title":"t","altTitle":"b","rating":"r","votes":"v","authUser":"a","authDisp":"d","dateCreated":"c","expires":"e"};
const CACHE_PFXS = {"other":"qm"};
