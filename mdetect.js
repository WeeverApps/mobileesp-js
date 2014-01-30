/* *******************************************
// Copyright 2010-2013, Anthony Hand
//
//	Aditional Authors :
//
//	Rob Porter (rob@weeverapps.com)
// Tiago Medeiros (tiago@weeverapps.com)
//
//
// BETA NOTICE
// Previous versions of the JavaScript code for MobileESP were 'regular' 
// JavaScript. The strength of it was that it was really easy to code and use.
// Unfortunately, regular JavaScript means that all variables and functions
// are in the global namespace. There can be collisions with other code libraries
// which may have similar variable or function names. Collisions cause bugs as each
// library changes a variable's definition or functionality unexpectedly.
// As a result, we thought it wise to switch to an "object oriented" style of code.
// This 'literal notation' technique keeps all MobileESP variables and functions fully self-contained.
// It avoids potential for collisions with other JavaScript libraries.
// This technique allows the developer continued access to any desired function or property.
//
// Please send feedback to project founder Anthony Hand: anthony.hand@gmail.com
//
// File version 2013.10.27 (October 27, 2013)
//	Updates:
//	- Made minor update to the InitDeviceScan. Should check Tablet Tier first, then iPhone Tier, then Quick Mobile. 
//
// File version 2013.08.01 (August 1, 2013)
//	Updates:
//	- Updated DetectMobileQuick(). Moved the 'Exclude Tablets' logic to the top of the method to fix a logic bug.
//
// File version 2013.07.13 (July 13, 2013)
//	Updates:
//	- Added support for Tizen: variable and DetectTizen().
//	- Added support for Meego: variable and DetectMeego().
//	- Added support for Windows Phone 8: variable and DetectWindowsPhone8().
//	- Added a generic Windows Phone method: DetectWindowsPhone().
//	- Added support for BlackBerry 10 OS: variable and DetectBlackBerry10Phone().
//	- Added support for PlayStation Vita handheld: variable and DetectGamingHandheld().
//	- Updated DetectTierIphone(). Added Tizen; updated the Windows Phone, BB10, and PS Vita support.
//	- Updated DetectWindowsMobile(). Uses generic DetectWindowsPhone() method rather than WP7.
//	- Updated DetectSmartphone(). Uses the IsTierIphone variable.
//	- Updated DetectSonyMylo() with more efficient code.
//	- Removed DetectGarminNuvifone() from DetectTierIphone(). How many are left in market in 2013? It is detected as a RichCSS Tier device.
//	- Removed the deviceXoom variable. It was unused.
//	- Added detection support for the OpenWeb transcoding engine to DetectMobileQuick().
//
// File version 2012.07.22  (July 22, 2012)
//	- Switched to an Object-Oriented programming model using the literal notation technique.  
//	- NOTE: The literal notation technique allows only 1 instance of this object per web page.  
//	- Named the JavaScript object "MobileEsp" rather than the old "mDetect."
//	- Applied many small tweaks and a few refactorings. The most notable ones are listed here...
//	- Added a variable for Obigo, an embedded browser. Added a lookup for Obigo to DetectMobileQuick().
//	- Added global variables for quick access to these very useful Boolean values:
//		- isWebkit, isMobilePhone, isIphone, isAndroid, isAndroidPhone, isTierTablet, isTierIphone, isTierRichCss, isTierGenericMobile
//	- Updated & simplified DetectSonyMylo(). Updated the variable mylocom2's value to handle both versions. 
//	- Removed the variable qtembedded, which was only used in Mylo and unnecessary.  
//	- Simplified OperaMobile().  
//	- Reorganized DetectMobileQuick().
//	- Moved the following from DetectMobileQuick() to DetectMobileLong():
//		- DetectDangerHiptop(), DetectMaemoTablet(), DetectGarminNuvifone(), devicePda  
//	- Added DetectBada(). Added it to DetectSmartphone & iPhone Tier, too.
//	- Updated DetectSymbian() to support Opera Mobile 10.
//	- Removed variable for OpenWeb. Removed its detection from DetectMobileQuick().
//		It's not clear whether Sprint is still using the OpenWeb transcoding service from OpenWave.
//
//
//
// LICENSE INFORMATION
// Licensed under the Apache License, Version 2.0 (the "License"); 
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at 
//        http://www.apache.org/licenses/LICENSE-2.0 
// Unless required by applicable law or agreed to in writing, 
// software distributed under the License is distributed on an 
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
// either express or implied. See the License for the specific 
// language governing permissions and limitations under the License. 
//
//
// ABOUT THIS PROJECT
//   Project Owner: Anthony Hand
//   Email: anthony.hand@gmail.com
//   Web Site: http://www.mobileesp.com
//   Source Files: http://code.google.com/p/mobileesp/
//   
//   Versions of this code are available for:
//      PHP, JavaScript, Java, ASP.NET (C#), Ruby and others
//
//
// WARNING: 
//   These JavaScript-based device detection features may ONLY work 
//   for the newest generation of smartphones, such as the iPhone, 
//   Android and Palm WebOS devices.
//   These device detection features may NOT work for older smartphones 
//   which had poor support for JavaScript, including 
//   older BlackBerry, PalmOS, and Windows Mobile devices. 
//   Additionally, because JavaScript support is extremely poor among 
//   'feature phones', these features may not work at all on such devices.
//   For better results, consider using a server-based version of this code, 
//   such as Java, APS.NET, PHP, or Ruby.
//
// *******************************************
*/

	// ### Weever vars

var isTierWeeverSmartphone = false, 
	isTierWeeverTablet = false,
	isTierWeeverAny = false;


// ### Added for AppleTV and disambiguation for iPad
var deviceIntelMacOSX = 'intel mac os x'; // Used for AppleTV2 w/ aTV Flash (black) Couch Surfer Pro browser detection


// ### added for Windows 8
var deviceWinIE10 = 'msie 10.0';
var deviceTouch = 'touch';





	//GLOBALLY USEFUL VARIABLES
	//Note: These values are set automatically during the Init function.
	//Stores whether we're currently initializing the most popular functions.
var initCompleted = false,
	isWebkit = false, //Stores the result of DetectWebkit()
	isMobilePhone = false, //Stores the result of DetectMobileQuick()
	isIphone = false, //Stores the result of DetectIphone()
	isAndroid = false, //Stores the result of DetectAndroid()
	isAndroidPhone = false, //Stores the result of DetectAndroidPhone()
	isTierTablet = false, //Stores the result of DetectTierTablet()
	isTierIphone = false, //Stores the result of DetectTierIphone()
	isTierRichCss = false, //Stores the result of DetectTierRichCss()
	isTierGenericMobile = false, //Stores the result of DetectTierOtherPhones()
	
	//INTERNALLY USED DETECTION STRING VARIABLES
	engineWebKit = 'webkit',

	deviceIphone = 'iphone',
	deviceIpod = 'ipod',
	deviceIpad = 'ipad',
	deviceMacPpc = 'macintosh', //Used for disambiguation
	
	deviceAndroid = 'android',
	deviceGoogleTV = 'googletv',
	deviceHtcFlyer = 'htc_flyer', //HTC Flyer
	
	deviceWinPhone7 = 'windows phone os 7', 
	deviceWinPhone8 = 'windows phone 8', 
	deviceWinMob = 'windows ce',
	deviceWindows = 'windows',
	deviceIeMob = 'iemobile',
	devicePpc = 'ppc', //Stands for PocketPC
	enginePie = 'wm5 pie',  //An old Windows Mobile

	deviceBB = 'blackberry',
	deviceBB10 = 'bb10', //For the new BB 10 OS
	vndRIM = 'vnd.rim', //Detectable when BB devices emulate IE or Firefox
	deviceBBStorm = 'blackberry95', //Storm 1 and 2
	deviceBBBold = 'blackberry97', //Bold 97x0 (non-touch)
	deviceBBBoldTouch = 'blackberry 99', //Bold 99x0 (touchscreen)
	deviceBBTour = 'blackberry96', //Tour
	deviceBBCurve = 'blackberry89', //Curve 2
	deviceBBCurveTouch = 'blackberry 938', //Curve Touch 9380
	deviceBBTorch = 'blackberry 98', //Torch
	deviceBBPlaybook = 'playbook', //PlayBook tablet

	deviceSymbian = 'symbian',
	deviceSymbos = 'symbos', //Opera 10 on Symbian
	deviceS60 = 'series60',
	deviceS70 = 'series70',
	deviceS80 = 'series80',
	deviceS90 = 'series90',

	devicePalm = 'palm',
	deviceWebOS = 'webos', //For Palm's line of WebOS devices
	deviceWebOShp = 'hpwos', //For HP's line of WebOS devices
	engineBlazer = 'blazer', //Old Palm browser
	engineXiino = 'xiino', //Another old Palm

	deviceNuvifone = 'nuvifone', //Garmin Nuvifone
	deviceBada = 'bada', //Samsung's Bada OS
	deviceTizen = 'tizen', //Tizen OS
	deviceMeego = 'meego', //Meego OS

	deviceKindle = 'kindle', //Amazon eInk Kindle
	engineSilk = 'silk-accelerated', //Amazon's accelerated Silk browser for Kindle Fire

	//Initialize variables for mobile-specific content.
	vndwap = 'vnd.wap',
	wml = 'wml',
	
	//Initialize variables for random devices and mobile browsers.
	//Some of these may not support JavaScript
	deviceTablet = 'tablet',
	deviceBrew = 'brew',
	deviceDanger = 'danger',
	deviceHiptop = 'hiptop',
	devicePlaystation = 'playstation',
	devicePlaystationVita = 'vita',
	deviceNintendoDs = 'nitro',
	deviceNintendo = 'nintendo',
	deviceWii = 'wii',
	deviceXbox = 'xbox',
	deviceArchos = 'archos',
	
	engineOpera = 'opera', //Popular browser
	engineNetfront = 'netfront', //Common embedded OS browser
	engineUpBrowser = 'up.browser', //common on some phones
	engineOpenWeb = 'openweb', //Transcoding by OpenWave server
	deviceMidp = 'midp', //a mobile Java technology
	uplink = 'up.link',
	engineTelecaQ = 'teleca q', //a modern feature phone browser
	engineObigo = 'obigo', //W 10 is a modern feature phone browser
	
	devicePda = 'pda',
	mini = 'mini',  //Some mobile browsers put 'mini' in their names
	mobile = 'mobile', //Some mobile browsers put 'mobile' in their user agent strings
	mobi = 'mobi', //Some mobile browsers put 'mobi' in their user agent strings
	
	//Use Maemo, Tablet, and Linux to test for Nokia's Internet Tablets.
	maemo = 'maemo',
	linux = 'linux',
	mylocom2 = 'sony/com', // for Sony Mylo 1 and 2
	
	//In some UserAgents, the only clue is the manufacturer
	manuSonyEricsson = 'sonyericsson',
	manuericsson = 'ericsson',
	manuSamsung1 = 'sec-sgh',
	manuSony = 'sony',
	manuHtc = 'htc',
	
	//In some UserAgents, the only clue is the operator
	svcDocomo = 'docomo',
	svcKddi = 'kddi',
	svcVodafone = 'vodafone',
	
	//Disambiguation strings.
	disUpdate = 'update', //pda vs. update
	
	//Holds the User Agent string value.
	uagent = '';
	
	function $_GET(q,s)
	{
	    s = s ? s : window.location.search;
	    console.log( window.location.href );
	    var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i');
	    return (s=s.replace(/^\?/,'&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
	}
	
	function createCookie(name,value,days) {
	        if (days) {
	                var date = new Date();
	                date.setTime(date.getTime()+(days*24*60*60*1000));
	                var expires = "; expires="+date.toGMTString();
	        }
	        else var expires = "";
	        document.cookie = name+"="+value+expires+"; path=/";
	}
	
	function readCookie(name) {
	        var nameEQ = name + "=";
	        var ca = document.cookie.split(';');
	        for(var i=0;i < ca.length;i++) {
	                var c = ca[i];
	                while (c.charAt(0)==' ') c = c.substring(1,c.length);
	                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	        }
	        return null;
	}
	
	function eraseCookie(name) {
	        createCookie(name,"",-1);
	}
   
	//Initializes key MobileEsp variables
	function InitDeviceScan() {
		initCompleted = false;
		
		 // ### Full website hack
		var fullWebsite = $_GET("full");

		// if you want to kill the cookie
		if ( 0 === fullWebsite ) {

			eraseCookie( 'noWxApp' );

		}

		// kill it if full=1 or full=true
		if( !!fullWebsite || readCookie('noWxApp') ) {

			createCookie( 'noWxApp', 1, 365) ;

			return;
			
		}
			
		
		
		if (navigator && navigator.userAgent)
			uagent = navigator.userAgent.toLowerCase();
		
		//Save these properties to speed processing
		isWebkit = DetectWebkit();
		isIphone = DetectIphone();
		isAndroid = DetectAndroid();
		isAndroidPhone = DetectAndroidPhone();
		
		//Generally, these tiers are the most useful for web development
		isTierIphone = DetectTierIphone(); //Do first
		isTierTablet = DetectTierTablet(); //Do second
		isMobilePhone = DetectMobileQuick(); //Do third
		
		//Optional: Comment these out if you NEVER use them
		isTierRichCss = DetectTierRichCss();
		isTierGenericMobile = DetectTierOtherPhones();
		
		
		 // ### Weever specific functions
		isTierWeeverSmartphone = DetectTierWeeverSmartphones();
		isTierWeeverTablet = DetectTierWeeverTablets();
		isTierWeeverAny = DetectTierWeeverSmartphones() || DetectTierWeeverTablets();

		
		initCompleted = true;
	}


	//APPLE IOS

	//**************************
	// Detects if the current device is an iPhone.
	function DetectIphone() {
                if (initCompleted || isIphone)
			return isIphone;

		if (uagent.search(deviceIphone) > -1)
			{
				//The iPad and iPod Touch say they're an iPhone! So let's disambiguate.
				if (DetectIpad() || DetectIpod())
					return false;
				//Yay! It's an iPhone!
				else 
					return true;
			}
		else
			return false;
	}

	//**************************
	// Detects if the current device is an iPod Touch.
	function DetectIpod() {
			if (uagent.search(deviceIpod) > -1)
				return true;
			else
				return false;
	}

	//**************************
	// Detects if the current device is an iPhone or iPod Touch.
	function DetectIphoneOrIpod() {
		//We repeat the searches here because some iPods 
		//  may report themselves as an iPhone, which is ok.
		if (DetectIphone() || DetectIpod())
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is an iPad tablet.
	function DetectIpad() {
		if (uagent.search(deviceIpad) > -1  && DetectWebkit())
			return true;
		else
			return false;
	}

	//**************************
	// Detects *any* iOS device: iPhone, iPod Touch, iPad.
	function DetectIos() {
		if (DetectIphoneOrIpod() || DetectIpad())
			return true;
		else
			return false;
	}


	//ANDROID

	//**************************
	// Detects *any* Android OS-based device: phone, tablet, and multi-media player.
	// Also detects Google TV.
	function DetectAndroid() {
		if (initCompleted || isAndroid)
			return isAndroid;
		
		if ((uagent.search(deviceAndroid) > -1) || DetectGoogleTV())
			return true;
		//Special check for the HTC Flyer 7" tablet. It should report here.
		if (uagent.search(deviceHtcFlyer) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a (small-ish) Android OS-based device
	// used for calling and/or multi-media (like a Samsung Galaxy Player).
	// Google says these devices will have 'Android' AND 'mobile' in user agent.
	// Ignores tablets (Honeycomb and later).
	function DetectAndroidPhone() {
		if (initCompleted || isAndroidPhone)
			return isAndroidPhone;
		
		if (DetectAndroid() && (uagent.search(mobile) > -1))
			return true;
		//Special check for Android phones with Opera Mobile. They should report here.
		if (DetectOperaAndroidPhone())
			return true;
		//Special check for the HTC Flyer 7" tablet. It should report here.
		if (uagent.search(deviceHtcFlyer) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a (self-reported) Android tablet.
	// Google says these devices will have 'Android' and NOT 'mobile' in their user agent.
	function DetectAndroidTablet() {
		//First, let's make sure we're on an Android device.
		if (!DetectAndroid())
			return false;
		
		//Special check for Opera Android Phones. They should NOT report here.
		if (DetectOperaMobile())
			return false;
		//Special check for the HTC Flyer 7" tablet. It should NOT report here.
		if (uagent.search(deviceHtcFlyer) > -1)
			return false;
			
		//Otherwise, if it's Android and does NOT have 'mobile' in it, Google says it's a tablet.
		if (uagent.search(mobile) > -1)
			return false;
		else
			return true;
	}

	//**************************
	// Detects if the current device is an Android OS-based device and
	//   the browser is based on WebKit.
	function DetectAndroidWebKit() {
		if (DetectAndroid() && DetectWebkit())
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a GoogleTV.
	function DetectGoogleTV() {
		if (uagent.search(deviceGoogleTV) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is based on WebKit.
	function DetectWebkit() {
		if (initCompleted || isWebkit)
			return isWebkit;
		
		if (uagent.search(engineWebKit) > -1)
			return true;
		else
			return false;
	}


	//WINDOWS MOBILE AND PHONE

        // Detects if the current browser is EITHER a 
        // Windows Phone 7.x OR 8 device.
        function DetectWindowsPhone() {
		if (DetectWindowsPhone7() ||
                    DetectWindowsPhone8())
			return true;
		else
			return false;
	}

	//**************************
	// Detects a Windows Phone 7.x device (in mobile browsing mode).
	function DetectWindowsPhone7() {
		if (uagent.search(deviceWinPhone7) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects a Windows Phone 8 device (in mobile browsing mode).
	function DetectWindowsPhone8() {
		if (uagent.search(deviceWinPhone8) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a Windows Mobile device.
	// Excludes Windows Phone 7 and later devices. 
	// Focuses on Windows Mobile 6.xx and earlier.
	function DetectWindowsMobile() {
		if (DetectWindowsPhone())
			return false;

		//Most devices use 'Windows CE', but some report 'iemobile' 
		//  and some older ones report as 'PIE' for Pocket IE. 
		if (uagent.search(deviceWinMob) > -1 ||
			uagent.search(deviceIeMob) > -1 ||
			uagent.search(enginePie) > -1)
			return true;
		//Test for Windows Mobile PPC but not old Macintosh PowerPC.
		if ((uagent.search(devicePpc) > -1) && 
			!(uagent.search(deviceMacPpc) > -1))
			return true;
		//Test for Windwos Mobile-based HTC devices.
		if (uagent.search(manuHtc) > -1 &&
			uagent.search(deviceWindows) > -1)
			return true;
		else
			return false;
	}


	//BLACKBERRY

	//**************************
	// Detects if the current browser is a BlackBerry of some sort.
	// Includes BB10 OS, but excludes the PlayBook.
	function DetectBlackBerry() {
		if ((uagent.search(deviceBB) > -1) ||
			(uagent.search(vndRIM) > -1))
			return true;
		if (DetectBlackBerry10Phone())
			return true;
		else
			return false;
	}

	//**************************
        // Detects if the current browser is a BlackBerry 10 OS phone.
        // Excludes tablets.
	function DetectBlackBerry10Phone() {
		if ((uagent.search(deviceBB10) > -1) &&
			(uagent.search(mobile) > -1))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is on a BlackBerry tablet device.
	//    Example: PlayBook
	function DetectBlackBerryTablet() {
		if (uagent.search(deviceBBPlaybook) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a BlackBerry device AND uses a
	//    WebKit-based browser. These are signatures for the new BlackBerry OS 6.
	//    Examples: Torch. Includes the Playbook.
	function DetectBlackBerryWebKit() {
		if (DetectBlackBerry() &&
			uagent.search(engineWebKit) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a BlackBerry Touch
	//    device, such as the Storm, Torch, and Bold Touch. Excludes the Playbook.
	function DetectBlackBerryTouch() {
		if (DetectBlackBerry() &&
			((uagent.search(deviceBBStorm) > -1) ||
			(uagent.search(deviceBBTorch) > -1) ||
			(uagent.search(deviceBBBoldTouch) > -1) ||
			(uagent.search(deviceBBCurveTouch) > -1) ) ||
            (uagent.search(deviceBB10) > -1 && uagent.search('mobile') > -1))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a BlackBerry OS 5 device AND
	//    has a more capable recent browser. Excludes the Playbook.
	//    Examples, Storm, Bold, Tour, Curve2
	//    Excludes the new BlackBerry OS 6 and 7 browser!!
	function DetectBlackBerryHigh() {
		//Disambiguate for BlackBerry OS 6 or 7 (WebKit) browser
		if (DetectBlackBerryWebKit())
			return false;
		if ((DetectBlackBerry()) &&
			(DetectBlackBerryTouch() ||
			uagent.search(deviceBBBold) > -1 || 
			uagent.search(deviceBBTour) > -1 || 
			uagent.search(deviceBBCurve) > -1))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a BlackBerry device AND
	//    has an older, less capable browser. 
	//    Examples: Pearl, 8800, Curve1.
	function DetectBlackBerryLow() {
		if (DetectBlackBerry())
		{
			//Assume that if it's not in the High tier or has WebKit, then it's Low.
			if (DetectBlackBerryHigh() || DetectBlackBerryWebKit())
				return false;
			else
				return true;
		}
		else
			return false;
	}


	//SYMBIAN

	//**************************
	// Detects if the current browser is the Nokia S60 Open Source Browser.
	function DetectS60OssBrowser() {
		if (DetectWebkit())
		{
			if ((uagent.search(deviceS60) > -1 || 
				uagent.search(deviceSymbian) > -1))
				return true;
			else
				return false;
		}
		else
			return false;
	} 

	//**************************
	// Detects if the current device is any Symbian OS-based device,
	//   including older S60, Series 70, Series 80, Series 90, and UIQ, 
	//   or other browsers running on these devices.
	function DetectSymbianOS() {
		if (uagent.search(deviceSymbian) > -1 ||
			uagent.search(deviceS60) > -1 ||
			((uagent.search(deviceSymbos) > -1) &&
				(DetectOperaMobile)) || //Opera 10
			uagent.search(deviceS70) > -1 ||
			uagent.search(deviceS80) > -1 ||
			uagent.search(deviceS90) > -1)
			return true;
		else
			return false;
	}


	//WEBOS AND PALM

	//**************************
	// Detects if the current browser is on a PalmOS device.
	function DetectPalmOS() {
		//Make sure it's not WebOS first
		if (DetectPalmWebOS())
			return false;

		//Most devices nowadays report as 'Palm', 
		//  but some older ones reported as Blazer or Xiino.
		if (uagent.search(devicePalm) > -1 ||
			uagent.search(engineBlazer) > -1 ||
			uagent.search(engineXiino) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is on a Palm device
	//   running the new WebOS.
	function DetectPalmWebOS()
	{
		if (uagent.search(deviceWebOS) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is on an HP tablet running WebOS.
	function DetectWebOSTablet() {
		if (uagent.search(deviceWebOShp) > -1 &&
			uagent.search(deviceTablet) > -1)
			return true;
		else
			return false;
	}


	//OPERA

	//**************************
	// Detects if the current browser is Opera Mobile or Mini.
	// Note: Older embedded Opera on mobile devices didn't follow these naming conventions.
	//   Like Archos media players, they will probably show up in DetectMobileQuick or -Long instead. 
	function DetectOperaMobile() {
		if ((uagent.search(engineOpera) > -1) &&
			((uagent.search(mini) > -1 ||
			uagent.search(mobi) > -1)))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is Opera Mobile 
	// running on an Android phone.
	function DetectOperaAndroidPhone() {
		if ((uagent.search(engineOpera) > -1) &&
			(uagent.search(deviceAndroid) > -1) &&
			(uagent.search(mobi) > -1))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is Opera Mobile 
	// running on an Android tablet.
	function DetectOperaAndroidTablet() {
		if ((uagent.search(engineOpera) > -1) &&
			(uagent.search(deviceAndroid) > -1) &&
			(uagent.search(deviceTablet) > -1))
			return true;
		else
			return false;
	}


	//MISCELLANEOUS DEVICES

	//**************************
	// Detects if the current device is an Amazon Kindle (eInk devices only).
	// Note: For the Kindle Fire, use the normal Android methods.
	function DetectKindle() {
		if (uagent.search(deviceKindle) > -1 &&
			!DetectAndroid())
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current Amazon device has turned on the Silk accelerated browsing feature.
	// Note: Typically used by the the Kindle Fire.
	function DetectAmazonSilk() {
		if (uagent.search(engineSilk) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a
	//   Garmin Nuvifone.
	function DetectGarminNuvifone() {
		if (uagent.search(deviceNuvifone) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects a device running the Bada smartphone OS from Samsung.
	function DetectBada() {
		if (uagent.search(deviceBada) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects a device running the Tizen smartphone OS.
	function DetectTizen() {
		if (uagent.search(deviceTizen) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects a device running the Meego OS.
	function DetectMeego() {
		if (uagent.search(deviceMeego) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects the Danger Hiptop device.
	function DetectDangerHiptop() {
		if (uagent.search(deviceDanger) > -1 ||
			uagent.search(deviceHiptop) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current browser is a Sony Mylo device.
	function DetectSonyMylo() {
		if ((uagent.search(manuSony) > -1) &&
                    ((uagent.search(qtembedded) > -1) ||
                     (uagent.search(mylocom2) > -1)))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is on one of 
	// the Maemo-based Nokia Internet Tablets.
	function DetectMaemoTablet() {
		if (uagent.search(maemo) > -1)
			return true;
		//For Nokia N810, must be Linux + Tablet, or else it could be something else.
		if ((uagent.search(linux) > -1) 
			&& (uagent.search(deviceTablet) > -1)
			&& !DetectWebOSTablet()
			&& !DetectAndroid())
			return true;
		else
			return false;
	}

        //**************************
	// Detects if the current device is an Archos media player/Internet tablet.
	function DetectArchos() {
		if (uagent.search(deviceArchos) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is an Internet-capable game console.
	// Includes many handheld consoles.
	function DetectGameConsole() {
		if (DetectSonyPlaystation() || 
			DetectNintendo() ||
			DetectXbox())
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a Sony Playstation.
	function DetectSonyPlaystation() {
		if (uagent.search(devicePlaystation) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a handheld gaming device with
        // a touchscreen and modern iPhone-class browser. Includes the Playstation Vita.
	function DetectGamingHandheld() {
		if ((uagent.search(devicePlaystation) > -1) &&
                   (uagent.search(devicePlaystationVita) > -1))
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a Nintendo game device.
	function DetectNintendo() {
		if (uagent.search(deviceNintendo) > -1   || 
			uagent.search(deviceWii) > -1 ||
			uagent.search(deviceNintendoDs) > -1)
			return true;
		else
			return false;
	}

	//**************************
	// Detects if the current device is a Microsoft Xbox.
	function DetectXbox() {
		if (uagent.search(deviceXbox) > -1)
			return true;
		else
			return false;
	}
        
        
	//**************************
	// Detects whether the device is a Brew-powered device.
	//   Note: Limited to older Brew-powered feature phones.
	//   Ignores newer Brew versions like MP. Refer to DetectMobileQuick().
	function DetectBrewDevice() {
		if (uagent.search(deviceBrew) > -1)
			return true;
		else
			return false;
	}


	// DEVICE CLASSES

	//**************************
	// Check to see whether the device is *any* 'smartphone'.
	//   Note: It's better to use DetectTierIphone() for modern touchscreen devices. 
	function DetectSmartphone() {
		//Exclude duplicates from TierIphone
                if (DetectTierIphone() ||
                        DetectS60OssBrowser() ||
			DetectSymbianOS() ||
			DetectWindowsMobile() ||
			DetectBlackBerry() ||
			DetectPalmOS())
			return true;
		
		//Otherwise, return false.
		return false;
	}

	//**************************
	// Detects if the current device is a mobile device.
	//  This method catches most of the popular modern devices.
	//  Excludes Apple iPads and other modern tablets.
	function DetectMobileQuick() {
		//Let's exclude tablets.
		if (DetectTierTablet())
			return false;

		if (initCompleted || isMobilePhone)
			return isMobilePhone;

		//Most mobile browsing is done on smartphones
		if (DetectSmartphone())
			return true;

		//Catch all for many mobile devices
		if (uagent.search(mobile) > -1)
			return true;

		if (DetectKindle() ||
			DetectAmazonSilk())
			return true;

		if (uagent.search(deviceMidp) > -1 ||
			DetectBrewDevice())
			return true;

		if (DetectOperaMobile() ||
			DetectArchos())
			return true;

		if ((uagent.search(engineObigo) > -1) ||
			(uagent.search(engineNetfront) > -1) ||
			(uagent.search(engineUpBrowser) > -1) ||
			(uagent.search(engineOpenWeb) > -1))
			return true;

		return false;
	}

	//**************************
	// Detects in a more comprehensive way if the current device is a mobile device.
	function DetectMobileLong() {
		if (DetectMobileQuick())
			return true;
		if (DetectGameConsole())
			return true;

		if (DetectDangerHiptop() ||
			DetectMaemoTablet() ||
			DetectSonyMylo() ||
			DetectGarminNuvifone())
			return true;

		if ((uagent.search(devicePda) > -1) &&
			!(uagent.search(disUpdate) > -1)) 
			return true;
		
		//Detect for certain very old devices with stupid useragent strings.
		if (uagent.search(manuSamsung1) > -1 ||
			uagent.search(manuSonyEricsson) > -1 || 
			uagent.search(manuericsson) > -1)
			return true;
		
		if ((uagent.search(svcDocomo) > -1) ||
			(uagent.search(svcKddi) > -1) ||
			(uagent.search(svcVodafone) > -1))
			return true;
		
		return false;
	}

	//*****************************
	// For Mobile Web Site Design
	//*****************************
	
	//**************************
	// The quick way to detect for a tier of devices.
	//   This method detects for the new generation of
	//   HTML 5 capable, larger screen tablets.
	//   Includes iPad, Android (e.g., Xoom), BB Playbook, WebOS, etc.
	function DetectTierTablet() {
		if (initCompleted || isTierTablet)
			return isTierTablet;
		
		if (DetectIpad() ||
			DetectAndroidTablet() ||
			DetectBlackBerryTablet() ||
			DetectWebOSTablet())
			return true;
		else
			return false;
	}

	//**************************
	// The quick way to detect for a tier of devices.
	//   This method detects for devices which can 
	//   display iPhone-optimized web content.
	//   Includes iPhone, iPod Touch, Android, Windows Phone 7 and 8, BB10, WebOS, Playstation Vita, etc.
	function DetectTierIphone() {
		if (initCompleted || isTierIphone)
			return isTierIphone;

		if (DetectIphoneOrIpod() ||
                        DetectAndroidPhone() ||
			DetectWindowsPhone() ||
			DetectBlackBerry10Phone() ||
			DetectPalmWebOS() ||
			DetectBada() ||
			DetectTizen() ||
			DetectGamingHandheld())
			return true;

               //Note: BB10 phone is in the previous paragraph
		if (DetectBlackBerryWebKit() && DetectBlackBerryTouch())
			return true;
		
		else
			return false;
	}

	//**************************
	// The quick way to detect for a tier of devices.
	//   This method detects for devices which are likely to be 
	//   capable of viewing CSS content optimized for the iPhone, 
	//   but may not necessarily support JavaScript.
	//   Excludes all iPhone Tier devices.
	function DetectTierRichCss() {
		if (initCompleted || isTierRichCss)
			return isTierRichCss;

		//Exclude iPhone and Tablet Tiers and e-Ink Kindle devices
		if (DetectTierIphone() ||
			DetectKindle() ||
			DetectTierTablet())
			return false;
		
		//Exclude if not mobile
		if (!DetectMobileQuick())
			return false;
				
		//If it's a mobile webkit browser on any other device, it's probably OK.
		if (DetectWebkit())
			return true;
		
		//The following devices are also explicitly ok.
		if (DetectS60OssBrowser() ||
			DetectBlackBerryHigh() ||
			DetectWindowsMobile() ||
			(uagent.search(engineTelecaQ) > -1))
			return true;
		
		else
			return false;
	}

	//**************************
	// The quick way to detect for a tier of devices.
	//   This method detects for all other types of phones,
	//   but excludes the iPhone and RichCSS Tier devices.
	// NOTE: This method probably won't work due to poor
	//  support for JavaScript among other devices. 
	function DetectTierOtherPhones() {
		if (initCompleted || isTierGenericMobile)
			return isTierGenericMobile;
		
		//Exclude iPhone, Rich CSS and Tablet Tiers
		if (DetectTierIphone() ||
			DetectTierRichCss() ||
			DetectTierTablet())
			return false;
		
		//Otherwise, if it's mobile, it's OK
		if (DetectMobileLong())
			return true;

		else
			return false;
	}
	
	
	//************************** // ###
	// Detects AppleTV second generation, jailbroken with Firecore's aTV Flash (black) Couch Surfer Pro browser.
	function DetectAppleTVTwo()
	{
	   // Couch Surfer Pro shows up as an iPad, but with Intel Mac OS X string
		if(uagent.search(deviceIntelMacOSX) > -1 && 
				uagent.search(deviceIpad) > -1)
		   return true;
		else
		   return false;
	}

	//**************************** // ###
	// Weever additional functions
	function DetectTierWeeverSmartphones()
	{
	   if ( DetectIphoneOrIpod() ) 
		  return true; 
	   if ( DetectAndroid() ) 
		  return true; 
	   if ( DetectBlackBerryTouch() ) 
		  return true; 
	   if ( DetectWindowsIE10() && DetectWindowsPhone8() )
		  return true;
	   else
		  return false; 
	}

	function DetectTierWeeverTablets()
	{
	   if (DetectIpad()
		  || DetectAndroidTablet()
		  || DetectBlackBerryTablet()
		  || ( DetectWindowsIE10Touch() && !DetectWindowsPhone8() ))
		  return true;
	   else
		  return false;
	}
	   
	// ###
	//**************************
	// Detects if the current browser is a
	// Windows IE 10 browser.
	function DetectWindowsIE10()
	{
	   if (uagent.search(deviceWinIE10) > -1)
		  return true;
	   else
		  return false;
	}
	
	// ###
	// ***********************
	// Detects when IE10 reports being in touch mode
	function DetectWindowsIE10Touch()
	{
	
	  if( uagent.search(deviceTouch) > -1 && DetectWindowsIE10 )
	  	return true;
	  	
	  return false;
		
	}

//Initialize the MobileEsp object
InitDeviceScan();



